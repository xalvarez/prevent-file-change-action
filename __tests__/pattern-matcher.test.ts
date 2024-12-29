import * as core from '@actions/core'
import GitHubService, {IFile} from '../src/github-service'
import {checkChangedFilesAgainstPattern} from '../src/pattern-matcher'

const GITHUB_TOKEN = 'exampleGitHubToken'

jest.mock('@actions/core')
jest.mock('../src/github-service')

describe('pattern-matcher', () => {
  let gitHubService: GitHubService
  let closePullRequestSpy: jest.SpyInstance

  beforeEach(() => {
    gitHubService = new GitHubService(GITHUB_TOKEN)
    closePullRequestSpy = jest.spyOn(GitHubService.prototype, 'closePullRequest').mockResolvedValue()
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should reject matching pattern', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.js'

    await checkChangedFilesAgainstPattern(files, pattern, gitHubService, 'exampleRepo', 'exampleOwner', 1, false)

    expect(core.setFailed).toHaveBeenCalledWith(`There is at least one file matching the pattern ${pattern}`)
    expect(core.debug).not.toHaveBeenCalled()
    expect(closePullRequestSpy).not.toHaveBeenCalled()
  })

  it('Should not reject non matching pattern', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.ts'

    await checkChangedFilesAgainstPattern(files, pattern, gitHubService, 'exampleRepo', 'exampleOwner', 1, false)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`There isn't any file matching the pattern ${pattern}`)
    expect(closePullRequestSpy).not.toHaveBeenCalled()
  })

  it('Should not reject empty commit', async () => {
    const files: IFile[] = []
    const pattern = '.*'

    await checkChangedFilesAgainstPattern(files, pattern, gitHubService, 'exampleRepo', 'exampleOwner', 1, false)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`This commit doesn't contain any files`)
    expect(closePullRequestSpy).not.toHaveBeenCalled()
  })

  it('Should not reject matching added file when allowNewFiles is true', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.js'

    await checkChangedFilesAgainstPattern(files, pattern, gitHubService, 'exampleRepo', 'exampleOwner', 1, false, true)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.debug).toHaveBeenCalledWith(`There isn't any file matching the pattern ${pattern}`)
    expect(closePullRequestSpy).not.toHaveBeenCalled()
  })
  it('Should close PR', async () => {
    const files: IFile[] = givenFiles()
    const pattern = '.*.js'

    await checkChangedFilesAgainstPattern(files, pattern, gitHubService, 'exampleRepo', 'exampleOwner', 1, true)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(closePullRequestSpy).toHaveBeenCalledWith('exampleOwner', 'exampleRepo', 1)
  })
})

function givenFiles(): IFile[] {
  return [
    {filename: 'src/file1.js', status: 'added'},
    {filename: 'README.md', status: 'modified'}
  ]
}
