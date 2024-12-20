import * as core from '@actions/core'
import * as github from '@actions/github'
import {IFile} from './github-service'

export async function checkChangedFilesAgainstPattern(
  files: IFile[],
  pattern: string,
  repo: string,
  owner: string,
  token: string,
  pullRequestNumber: number,
  allowNewFiles = false
): Promise<void> {
  if (files.length > 0) {
    const regExp = new RegExp(pattern)
    const shouldPreventFileChange = files.some(file => {
      const isPatternMatched = regExp.test(file.filename)
      if (isPatternMatched && allowNewFiles && file.status === 'added') {
        return false
      }
      return isPatternMatched
    })

    if (shouldPreventFileChange) {
      const closePR: boolean = core.getInput('closePR') === 'true'
      if (closePR) {
        const octokit = github.getOctokit(token)
        const response = await octokit.rest.pulls.update({
          owner,
          repo,
          pull_number: pullRequestNumber,
          state: 'closed'
        })
        core.info(`Pull request #${pullRequestNumber} has been successfully closed.`)
        core.info(`Response: ${JSON.stringify(response.data)}`)
      } else {
        core.setFailed(`There is at least one file matching the pattern ${pattern}`)
      }
    } else {
      core.debug(`There isn't any file matching the pattern ${pattern}`)
    }
  } else core.debug(`This commit doesn't contain any files`)
}
