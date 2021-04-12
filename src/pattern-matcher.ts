import {IFile} from './github-service'

export default class PatternMatcher {
  async isThereAnyBlacklistedFile(
    files: IFile[],
    pattern: string
  ): Promise<boolean> {
    if (files && files.length > 0) {
      const regExp = new RegExp(pattern)
      return files.find(file => regExp.test(file.filename)) ? true : false
    } else return false
  }
}
