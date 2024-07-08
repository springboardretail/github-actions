#!/usr/bin/env node

const core = require('@actions/core');
const github = require('@actions/github');
const { descriptionBuilder } = require('./lib/descriptionBuilder');

async function run() {
  // Init inputs and context
  const owner = core.getInput('repository')?.split('/')[0] || github.context.repo.owner;
  const repo = core.getInput('repository')?.split('/')[1] || github.context.repo.repo;
  const prNumber = core.getInput('pr_number') || github.context.payload.pull_request.number;
  const matchRegexString = core.getInput('match_regex');
  const newContents = core.getInput('new_content');
  const githubToken = core.getInput('github_token');

  // Exit with error if no PR number
  if (!prNumber) {
    core.setFailed('No pull request number found in context. Make sure this issue is only run for pull_request events');
    return;
  }

  // Init GitHub client
  const octokit = github.getOctokit(githubToken)

  // Get the current PR description
  const { data: prData } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });
  const currentDescription = prData.body;
  console.log("Current PR description:\n", currentDescription)

  // Build new PR description
  const matchRegex = new RegExp(matchRegexString, 'g');
  const newDescription = descriptionBuilder(currentDescription, newContents, matchRegex)

  // Update the PR description
  console.log("Updating PR description to:\n", newDescription);
  await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    body: newDescription,
  });
}

run()
