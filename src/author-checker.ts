export async function isTrustedAuthor(pullRequestAuthor: string, trustedAuthors: string): Promise<boolean> {
  if (trustedAuthors) {
    const authors: string[] = trustedAuthors.split(',').map((author: string) => author.trim())
    return authors.includes(pullRequestAuthor)
  } else return false
}
