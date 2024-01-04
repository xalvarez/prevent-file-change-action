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

  beforeEach(() => {
    jest.spyOn(core, 'getInput').mockReturnValue('exampleAuthor1,exampleAuthor2')
    isTrustedAuthorSpy = jest.spyOn(authorChecker, 'isTrustedAuthor').mockResolvedValue(true)
    context.actor = 'exampleAuthor2'
  })

  it('Should skip checks if author is trusted', async () => {
    await run()

    expect(isTrustedAuthorSpy).toHaveBeenCalledWith('exampleAuthor2', 'exampleAuthor1,exampleAuthor2')
    expect(GitHubService).not.toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
  })
})
