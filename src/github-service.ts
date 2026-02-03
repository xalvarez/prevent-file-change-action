import * as core from '@actions/core'
import * as github from '@actions/github'

export interface IFile {
  filename: string
  status: string
}

export default class GitHubService {
  private readonly octokit

  constructor(gitHubToken: string) {
    this.octokit = github.getOctokit(gitHubToken)
  }

  async getChangedFiles(repositoryOwner: string, repositoryName: string, pullRequestNumber: number): Promise<IFile[]> {
    const responseBody = await this.octokit.paginate(this.octokit.rest.pulls.listFiles, {
      owner: repositoryOwner,
      repo: repositoryName,
      pull_number: pullRequestNumber
    })

    const files: IFile[] = []
    for (const file of responseBody) {
      files.push({filename: file.filename, status: file.status} as IFile)
    }

    core.debug(`Pull request ${pullRequestNumber} includes following files: ${JSON.stringify(files)}`)

    return files
  }

  async closePullRequest(owner: string, repo: string, pullRequestNumber: number): Promise<void> {
    await this.octokit.rest.pulls.update({
      owner: owner,
      repo: repo,
      pull_number: pullRequestNumber,
      state: 'closed'
    })
  }
}
