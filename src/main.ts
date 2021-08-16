import * as core from '@actions/core'
import GitHubService, {IFile} from './github-service'
import PatternMatcher from './pattern-matcher'
import {context} from '@actions/github'

async function run(): Promise<void> {
  try {
    const eventName: string = context.eventName
    if (eventName === 'pull_request') {
      const githubToken: string = core.getInput('githubToken')
      const gitHubService = new GitHubService(githubToken)
      const pullRequestNumber: number =
        context.payload?.pull_request?.number || 0
      if (pullRequestNumber) {
        const files: IFile[] = await gitHubService.getChangedFiles(
          context.repo.owner,
          context.repo.repo,
          pullRequestNumber
        )
        const pattern: string = core.getInput('pattern')
        const patternMatcher = new PatternMatcher()
        await patternMatcher.checkChangedFilesAgainstPattern(files, pattern)
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
