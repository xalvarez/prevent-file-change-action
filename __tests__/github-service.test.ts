import GitHubService, {IFile} from '../src/github-service'
import {getOctokit} from '@actions/github'

const GITHUB_TOKEN = 'exampleGitHubToken'
let gitHubService: GitHubService
jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn()
}))
const octokitMock = {
  paginate: jest.fn(),
  rest: {
    pulls: {
      listFiles: jest.fn()
    }
  }
}

describe('github-service', () => {
  beforeEach(() => {
    ;(getOctokit as jest.Mock).mockReturnValue(octokitMock)
    gitHubService = new GitHubService('exampleGitHubToken')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should get changed files', async () => {
    const repositoryOwner = 'exampleRepositoryOwner'
    const repositoryName = 'exampleRepositoryName'
    const pullRequestNumber = 1
    const expectedFiles = [{filename: 'exampleFile1.md'}, {filename: 'exampleFile2.md'}]
    octokitMock.paginate.mockResolvedValue(expectedFiles)

    const changedFiles: IFile[] = await gitHubService.getChangedFiles(
      repositoryOwner,
      repositoryName,
      pullRequestNumber
    )

    expect(getOctokit).toHaveBeenCalledWith(GITHUB_TOKEN)
    expect(octokitMock.paginate).toHaveBeenCalledWith(octokitMock.rest.pulls.listFiles, {
      owner: repositoryOwner,
      repo: repositoryName,
      pull_number: pullRequestNumber
    })
    expect(changedFiles).toEqual(expectedFiles)
  })
})
