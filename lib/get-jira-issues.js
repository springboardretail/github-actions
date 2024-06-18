#!/usr/bin/env node

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  // Init inputs and context
  const owner = core.getInput('repository')?.split('/')[0] || github.context.repo.owner;
  const repo = core.getInput('repository')?.split('/')[1] || github.context.repo.repo;
  const baseBranch = core.getInput('base_branch') || github.context.payload.pull_request.base.ref;
  const targetBranch = core.getInput('target_branch') || github.context.payload.pull_request.head.ref;
  const jiraPrefixes = core.getInput('jira_prefixes');
  const githubToken = core.getInput('github_token');

  // Init GitHub client
  const octokit = github.getOctokit(githubToken)

  // Construct regex to match issue numbers
  const projectPrefixes = jiraPrefixes.split(',').map(prefix => prefix.trim());
  const prefixRegexInsert = projectPrefixes.map(prefix => `[${prefix}]{${prefix.length}}`).join('|');
  const issueRegex = new RegExp(`((${prefixRegexInsert})[-\\s]*\\d+)`, 'i');

  // Get all commit messages between the two branches
  console.log(`Getting commits between ${baseBranch} and ${targetBranch}`);
  const { data: commitData } = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: baseBranch,
    head: targetBranch,
  });
  const commitMessages = commitData.commits.map(commit => commit.commit.message)

  // Extract unique issue numbers from commit messages
  console.log('Extracting Jira issues from commit messages')
  const commitBlob = commitMessages.join('\n');
  const rawIssueList = commitBlob.match(new RegExp(issueRegex.source, 'g')).map(issue => {
    const [project, number] = issue.match(/[hrtl]{4}|\d+/ig); // Assuming project prefix is [hrtl]{4} as in Ruby script
    return `${project.toUpperCase()}-${number}`;
  });
  const issueList = [...new Set(rawIssueList)]

  // Sort issue list in order of the number part of the issue
  issueList .sort((issue1, issue2) => {
    const num1 = parseInt(issue1.match(/\d+/)[0]);
    const num2 = parseInt(issue2.match(/\d+/)[0]);
    return num1 - num2;
  });

  // Set the issue list output
  core.setOutput('jira_issues', JSON.stringify(issueList));
  core.setOutput('jira_issues_string', issueList.join("\n"));
}

run()
