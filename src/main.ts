import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const eventName: string = github.context.eventName
    if (eventName === 'pull_request') {
      const pushPayload = github.context.payload
      core.info(`Payload is: ${JSON.stringify(pushPayload)}`)
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
