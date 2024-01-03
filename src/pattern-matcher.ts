import * as core from '@actions/core'
import {IFile} from './github-service'

export async function checkChangedFilesAgainstPattern(files: IFile[], pattern: string): Promise<void> {
  if (files.length > 0) {
    const regExp = new RegExp(pattern)
    files.some(file => regExp.test(file.filename))
      ? core.setFailed(`There is at least one file matching the pattern ${pattern}`)
      : core.debug(`There isn't any file matching the pattern ${pattern}`)
  } else core.debug(`This commit doesn't contain any files`)
}
