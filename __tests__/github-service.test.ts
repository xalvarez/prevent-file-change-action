import * as octokit from '@actions/github'
import GitHubService, {IFile} from '../src/github-service'

const GITHUB_TOKEN = 'exampleGitHubToken'

jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn().mockReturnValue({
    paginate: jest.fn().mockResolvedValue([{filename: 'exampleFile1.md'}, {filename: 'exampleFile2.md'}]),
    rest: {
      pulls: {
        listFiles: jest.fn()
      }
    }
  })
}))

describe('github-service', () => {
  let gitHubService: GitHubService

  beforeEach(() => {
    gitHubService = new GitHubService(GITHUB_TOKEN)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should get changed files', async () => {
    const repositoryOwner = 'exampleRepositoryOwner'
    const repositoryName = 'exampleRepositoryName'
    const pullRequestNumber = 1
    const expectedFiles = [{filename: 'exampleFile1.md'}, {filename: 'exampleFile2.md'}]

    const changedFiles: IFile[] = await gitHubService.getChangedFiles(
      repositoryOwner,
      repositoryName,
      pullRequestNumber
    )

    expect(octokit.getOctokit(GITHUB_TOKEN).paginate).toHaveBeenCalledWith(
      octokit.getOctokit(GITHUB_TOKEN).rest.pulls.listFiles,
      {
        owner: repositoryOwner,
        repo: repositoryName,
        pull_number: pullRequestNumber
      }
    )
    expect(changedFiles).toEqual(expectedFiles)
  })
})
