/**
 * Builds a new description by replacing the matched content in the current description with the new content.
 * If no matching content is found, the new content is added to the end of the current description.
 *
 * @param {String} currentDescription - The current description string.
 * @param {String} newContent - The new content to replace the matched content.
 * @param {RegExp} matchRegex - The regular expression used to match the content in the current description.
 * @returns {String} The updated description string.
 */
export const descriptionBuilder = (currentDescription, newContents, matchRegex) => {
  if (matchRegex.test(currentDescription)) {
    console.log('Matching content found, replacing it with new contents')
    return currentDescription.replace(matchRegex, newContents)
  } else {
    console.log('No matching content found, adding new contents to the end')
    return `${currentDescription}\n\n${newContents}`
  }
}
