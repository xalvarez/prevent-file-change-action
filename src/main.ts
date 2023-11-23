import * as core from '@actions/core'
import GitHubService, {IFile} from './github-service'
import PatternMatcher from './pattern-matcher'
import {context} from '@actions/github'
import {isTrustedAuthor} from './author-checker'

async function run(): Promise<void> {
  try {
    const trustedAuthors: string = core.getInput('trustedAuthors')
    const pullRequestAuthor: string = context.actor
    const eventName: string = context.eventName
    core.debug(`Event='${eventName}', Author='${pullRequestAuthor}', Trusted Authors='${trustedAuthors}'`)
    if (await isTrustedAuthor(pullRequestAuthor, trustedAuthors)) {
      core.info(`${pullRequestAuthor} is a trusted author and is allowed to modify any matching files.`)
    }

    const githubToken: string = core.getInput('githubToken', {required: true})
    const gitHubService = new GitHubService(githubToken)

    let files: IFile[]
    if (eventName === 'push') {
      files = await gitHubService.getChangedFilesForCommit(
        context.repo.owner,
        context.repo.repo,
        context.sha
      )
    } else if (eventName === 'pull_request') {
      const pullRequestNumber: number = context.payload?.pull_request?.number || 0
      if (pullRequestNumber === 0) {
        core.setFailed('Pull request number is missing in github event payload')
        return
      }

      files = await gitHubService.getChangedFilesForPR(
        context.repo.owner,
        context.repo.repo,
        pullRequestNumber
      )
    } else {
      core.setFailed(`Only pull_request events are supported. Event was: ${eventName}`)
      return
    }

    const pattern: string = core.getInput('pattern', {required: true})
    const patternMatcher = new PatternMatcher()
    await patternMatcher.checkChangedFilesAgainstPattern(files, pattern)
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error occurred')
    }
  }
}

run()
