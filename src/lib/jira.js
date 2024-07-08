/**
 * Generates a regular expression for matching Jira project issue keys.
 *
 * @param {string[]} jiraPrefixes - An array of Jira project prefixes.
 * @param {string} flags - Optional flags for the regular expression.
 * @returns {RegExp} - The generated regular expression.
 */
export const projectIssueRegex = (jiraPrefixes, flags = 'i') => {
  const projectPrefixes = jiraPrefixes.split(',').map((prefix) => prefix.trim())
  const prefixRegexInsert = projectPrefixes
    .map((prefix) => `[${prefix}]{${prefix.length}}`)
    .join('|')
  const issueRegex = new RegExp(`((${prefixRegexInsert})[-\\s]*\\d+)`, flags)
  return issueRegex
}

/**
 * Extracts a list of unique Jira issue numbers from an array of commit messages.
 *
 * @param {string[]} commitMessages - An array of commit messages.
 * @param {string[]} jiraPrefixes - An array of Jira project prefixes.
 * @returns {string[]} - An array of unique Jira issue numbers sorted in ascending order.
 */
export const extractIssueListFromCommitMessages = (commitMessages, jiraPrefixes) => {
  // Extract unique issue numbers from commit messages
  const commitBlob = commitMessages.join('\n')
  const issueRegex = projectIssueRegex(jiraPrefixes, 'ig')
  const rawIssueList = commitBlob.match(issueRegex).map((issue) => {
    const [project, number] = issue.match(/[hrtl]{4}|\d+/gi) // Assuming project prefix is [hrtl]{4} as in Ruby script
    return `${project.toUpperCase()}-${number}`
  })
  const issueList = [...new Set(rawIssueList)]

  // Sort issue list in order of the number part of the issue
  issueList.sort((issue1, issue2) => {
    const num1 = parseInt(issue1.match(/\d+/)[0])
    const num2 = parseInt(issue2.match(/\d+/)[0])
    return num1 - num2
  })
}
