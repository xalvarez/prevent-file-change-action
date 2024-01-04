import * as core from '@actions/core'
import GitHubService from '../src/github-service'
import {context} from '@actions/github'
import * as authorChecker from '../src/author-checker'
import {run} from '../src/main'

jest.mock('@actions/core')
jest.mock('../src/github-service')
jest.mock('../src/author-checker')

describe('main', () => {
  let isTrustedAuthorSpy: jest.SpyInstance
  let getChangedFilesSpy: jest.SpyInstance

  beforeEach(() => {
    jest.spyOn(core, 'getInput').mockReturnValue('exampleAuthor1,exampleAuthor2')
    isTrustedAuthorSpy = jest.spyOn(authorChecker, 'isTrustedAuthor').mockResolvedValue(false)
    context.actor = 'exampleAuthor2'
    context.eventName = 'pull_request'
    getChangedFilesSpy = jest
      .spyOn(GitHubService.prototype, 'getChangedFiles')
      .mockResolvedValue([{filename: 'exampleFile1.md'}, {filename: 'exampleFile2.md'}])
  })

  it('Should skip checks when author is trusted', async () => {
    isTrustedAuthorSpy = jest.spyOn(authorChecker, 'isTrustedAuthor').mockResolvedValue(true)

    await run()

    expect(isTrustedAuthorSpy).toHaveBeenCalledWith('exampleAuthor2', 'exampleAuthor1,exampleAuthor2')
    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Should fail when event name is not pull_request', async () => {
    context.eventName = 'push'

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Only pull_request events are supported. Event was: push')
  })

  it('Should fail when event payload is missing', async () => {
    context.payload = {}

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
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
    expect(core.setFailed).toHaveBeenCalledWith(errorMock.message)
  })

  it('Should catch errors of unknown type', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((inputName: string) => {
      if (inputName === 'githubToken') {
        throw 'Error!'
      }
      return ''
    })

    await run()

    expect(getChangedFilesSpy).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Unknown error occurred')
  })
})
