import {IFile} from './github-service'
import * as core from '@actions/core'

export default class PatternMatcher {
  async checkChangesFilesAgainstPattern(
    files: IFile[],
    pattern: string
  ): Promise<void> {
    core.info(`pattern: ${pattern} files: ${files}`)
    if (files && files.length > 0) {
      const regExp = new RegExp(pattern)
      core.info(`Find: ${files.find(file => regExp.test(file.filename))}`)
      files.find(file => regExp.test(file.filename))
        ? core.debug(`There isn't any file matching the pattern ${pattern}`)
        : this.setFailed(pattern)
    } else this.setFailed(pattern)
  }

  private async setFailed(pattern: string): Promise<void> {
    core.setFailed(`There is at least one file matching the pattern ${pattern}`)
    return
  }
}
