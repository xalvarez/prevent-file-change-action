import * as core from '@actions/core'
import {IFile} from '../src/github-service'
import {checkChangedFilesAgainstPattern} from '../src/pattern-matcher'

jest.mock('@actions/core')

describe('pattern-matcher', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should reject matching pattern', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.js'

    await checkChangedFilesAgainstPattern(files, pattern, 'exampleRepo', 'exampleOwner', 'exampleToken', 1)

    expect(core.setFailed).toHaveBeenCalledWith(`There is at least one file matching the pattern ${pattern}`)
    expect(core.debug).not.toHaveBeenCalled()
  })

  it('Should not reject non matching pattern', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.ts'

    await checkChangedFilesAgainstPattern(files, pattern, 'exampleRepo', 'exampleOwner', 'exampleToken', 1)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`There isn't any file matching the pattern ${pattern}`)
  })

  it('Should not reject empty commit', async () => {
    const files: IFile[] = []
    const pattern = '.*'

    await checkChangedFilesAgainstPattern(files, pattern, 'exampleRepo', 'exampleOwner', 'exampleToken', 1)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`This commit doesn't contain any files`)
  })

  it('Should not reject matching added file when allowNewFiles is true', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.js'

    await checkChangedFilesAgainstPattern(files, pattern, 'exampleRepo', 'exampleOwner', 'exampleToken', 1, true)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`There isn't any file matching the pattern ${pattern}`)
  })
})

function givenFiles(): IFile[] {
  return [
    {filename: 'src/file1.js', status: 'added'},
    {filename: 'README.md', status: 'modified'}
  ]
}
