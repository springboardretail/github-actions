# Heartland Retail GitHub Actions

This is a collection of various reusable GitHub actions used by Heartland Retail repos

## Usage

### publish-test-results

Publishes the JUnit test result file to DataDog

```yml
  - uses: springboard-retail/github-actions/publish-test-results
    with:
      name: heartland-retail-cool-new-test-suite
      junit_file_path: ./test-results.xml
      tags: env:ci,app:my-app
      datadog_api_token: ${{ secrets.DD_OPS_API_KEY }}
    if: always()
```

### get-jira-issues

See [get-jira-issues/action.yml](get-jira-issues/action.yml)

Retrieves matching Jira issue numbers from commit messages

```yml
  - uses: springboard-retail/github-actions/get-jira-issues
    with:
      jira_prefixes: 'HRTL,FORT'
      github_token: ${{ secrets.GITHUB_TOKEN }}
```

If you plan to run this action from a different repo than you want to retrieve the results, you can also pass

- `repository` (owner/repo)
- `base_branch`
- `target_branch`

This will provide two outputs

- `jira_issues`: A JSON array containing the unique issue numbers
- `jira_issues_string`: A newline separated string contianing a sorted unique list of issue numbers

### update-pr-description

See [update-pr-description/action.yml](update-pr-description/action.yml)

Updates the PR description with the new contents, optionally replacing existing matching content.

```yml
  - uses: springboard-retail/github-actions/update-pr-description
    with:
      match_regex: '<!-- JIRA_ISSUES -->[\s\S]*<!-- JIRA_ISSUES_END -->'
      new_content: |
        <!-- JIRA_ISSUES -->
        ## Jira Tickets Connected to this Release
        ${{ steps.get_jira_issues.outputs.jira_issues_string }}
        <!-- JIRA_ISSUES_END -->
      github_token: ${{ secrets.GITHUB_TOKEN }}
```

If you plan to run this action from a different repo, you can optionally pass

- `repository` (owner/repo)
- `pr_number`
