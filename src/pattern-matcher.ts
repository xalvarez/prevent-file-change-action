import * as core from '@actions/core'
import {IFile} from './github-service'

export default class PatternMatcher {
  async checkChangedFilesAgainstPattern(files: IFile[], pattern: string): Promise<void> {
    if (files?.length > 0) {
      const regExp = new RegExp(pattern)
      files.some(file => regExp.test(file.filename))
        ? this.setFailed(pattern)
        : core.debug(`There isn't any file matching the pattern ${pattern}`)
    } else core.debug(`This commit doesn't contain any files`)
  }

  private async setFailed(pattern: string): Promise<void> {
    core.setFailed(`There is at least one file matching the pattern ${pattern}`)
    return
  }
}
