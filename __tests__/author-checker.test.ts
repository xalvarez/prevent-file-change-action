import {isTrustedAuthor} from '../src/author-checker'

describe('author-checker', () => {
  it('Should allow trusted author', async () => {
    const pullRequestAuthor = 'examplePullRequestAuthor1'
    const trustedAuthors = 'examplePullRequestAuthor1, examplePullRequestAuthor2'

    const result = await isTrustedAuthor(pullRequestAuthor, trustedAuthors)

    expect(result).toBeTruthy()
  })

  it('Should reject not trusted author', async () => {
    const pullRequestAuthor = 'examplePullRequestAuthor1'
    const trustedAuthors = 'examplePullRequestAuthor2, examplePullRequestAuthor3'

    const result = await isTrustedAuthor(pullRequestAuthor, trustedAuthors)

    expect(result).toBeFalsy()
  })

  it('Should allow empty trustedAuthors', async () => {
    const pullRequestAuthor = 'examplePullRequestAuthor'
    const trustedAuthors = ''

    const result = await isTrustedAuthor(pullRequestAuthor, trustedAuthors)

    expect(result).toBeTruthy()
  })
})
