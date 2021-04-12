import * as core from '@actions/core'
import {context} from '@actions/github'
import GitHubService from './github-service'

async function run(): Promise<void> {
  try {
    const eventName: string = context.eventName
    if (eventName === 'pull_request') {
      const githubToken: string = core.getInput('githubToken')
      const gitHubService = new GitHubService(githubToken)
      const pullRequestNumber: number =
        context.payload?.pull_request?.number || 0
      if (pullRequestNumber) {
        await gitHubService.getChangedFiles(
          context.repo.owner,
          context.repo.repo,
          pullRequestNumber
        )
      } else {
        core.setFailed('Pull request number is missing in github event payload')
      }
    } else {
      core.setFailed(
        `Only pull_request events are supported. Event was: ${eventName}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
