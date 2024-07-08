#!/usr/bin/env node

const core = require('@actions/core')
const github = require('@actions/github')
const { extractIssueListFromCommitMessages } = require('./lib/jira')

async function run() {
  // Init inputs and context
  const owner = core.getInput('repository')?.split('/')[0] || github.context.repo.owner
  const repo = core.getInput('repository')?.split('/')[1] || github.context.repo.repo
  const baseBranch = core.getInput('base_branch') || github.context.payload.pull_request.base.ref
  const targetBranch =
    core.getInput('target_branch') || github.context.payload.pull_request.head.ref
  const jiraPrefixes = core.getInput('jira_prefixes').split(',')
  const githubToken = core.getInput('github_token')

  // Init GitHub client
  const octokit = github.getOctokit(githubToken)

  // Get all commit messages between the two branches
  console.log(`Getting commits between ${baseBranch} and ${targetBranch}`)
  const { data: commitData } = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: baseBranch,
    head: targetBranch,
  })
  const commitMessages = commitData.commits.map((commit) => commit.commit.message)

  // Extract unique issue numbers from commit messages
  console.log('Extracting Jira issues from commit messages')
  const issueList = extractIssueListFromCommitMessages(commitMessages, jiraPrefixes)

  // Set the issue list output
  core.setOutput('jira_issues', JSON.stringify(issueList))
  core.setOutput('jira_issues_string', issueList.join('\n'))
}

run()
