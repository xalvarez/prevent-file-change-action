import * as core from '@actions/core'
import GitHubService from '../src/github-service'
import {context} from '@actions/github'
import * as authorChecker from '../src/author-checker'
import {run} from '../src/main'
import * as patternMatcher from '../src/pattern-matcher'

jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  context: {
    actor: 'exampleAuthor2',
    repo: {
      owner: 'exampleOwner',
      repo: 'exampleOwner/exampleRepo'
    }
  }
}))
jest.mock('../src/github-service')
jest.mock('../src/author-checker')
jest.mock('../src/pattern-matcher')

describe('main', () => {
  const trustedAuthors = 'exampleAuthor1,exampleAuthor2'
  const changedFiles = [
    {filename: 'exampleFile1.md', status: 'added'},
    {filename: 'exampleFile2.md', status: 'modified'}
  ]
  const pattern = 'examplePattern'

  let isTrustedAuthorSpy: jest.SpyInstance
  let getChangedFilesSpy: jest.SpyInstance
  let checkChangedFilesAgainstPatternSpy: jest.SpyInstance

  beforeEach(() => {
    jest.spyOn(core, 'getInput').mockImplementation((inputName: string) => {
      switch (inputName) {
        case 'trustedAuthors':
          return trustedAuthors
        case 'pattern':
          return pattern
        default:
          return ''
      }
    })

    isTrustedAuthorSpy = jest.spyOn(authorChecker, 'isTrustedAuthor').mockResolvedValue(false)

    context.eventName = 'pull_request'
    context.payload = {
      pull_request: {
        number: 1
      }
    }

    getChangedFilesSpy = jest.spyOn(GitHubService.prototype, 'getChangedFiles').mockResolvedValue(changedFiles)

    checkChangedFilesAgainstPatternSpy = jest.spyOn(patternMatcher, 'checkChangedFilesAgainstPattern')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should check changed files against pattern', async () => {
    await run()

    expect(getChangedFilesSpy).toHaveBeenCalledWith('exampleOwner', 'exampleOwner/exampleRepo', 1)
    expect(checkChangedFilesAgainstPatternSpy).toHaveBeenCalledWith(changedFiles, pattern, false)
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Should skip checks when author is trusted', async () => {
    isTrustedAuthorSpy = jest.spyOn(authorChecker, 'isTrustedAuthor').mockResolvedValue(true)

    await run()

    expect(isTrustedAuthorSpy).toHaveBeenCalledWith('exampleAuthor2', trustedAuthors)
    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(checkChangedFilesAgainstPatternSpy).not.toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Should fail when event name is not pull_request', async () => {
    context.eventName = 'push'

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(checkChangedFilesAgainstPatternSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Only pull_request events are supported. Event was: push')
  })

  it('Should fail when pull request payload is missing', async () => {
    context.payload = {
      pull_request: undefined
    }

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(checkChangedFilesAgainstPatternSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Pull request number is missing in github event payload')
  })

  it('Should catch errors of type Error', async () => {
    const errorMock = new Error('Required githubToken input is missing')
    jest.spyOn(core, 'getInput').mockImplementation((inputName: string) => {
      if (inputName === 'githubToken') {
        throw errorMock
      }
      return ''
    })

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(checkChangedFilesAgainstPatternSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(errorMock.message)
  })

  it('Should catch errors of unknown type', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((inputName: string) => {
      if (inputName === 'githubToken') {
        // eslint-disable-next-line no-throw-literal
        throw 'Error!'
      }
      return ''
    })

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(checkChangedFilesAgainstPatternSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Unknown error occurred')
  })
})
