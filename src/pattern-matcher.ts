import * as core from '@actions/core'
import {IFile} from './github-service'

export async function checkChangedFilesAgainstPattern(
  files: IFile[],
  pattern: string,
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
      core.setFailed(`There is at least one file matching the pattern ${pattern}`)
    } else {
      core.debug(`There isn't any file matching the pattern ${pattern}`)
    }
  } else core.debug(`This commit doesn't contain any files`)
}
