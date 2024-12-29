# Prevent file change action

[![CodeQL](https://github.com/xalvarez/prevent-file-change-action/actions/workflows/codeql-analysis.yml/badge.svg?event=push)](https://github.com/xalvarez/prevent-file-change-action/actions/workflows/codeql-analysis.yml)

**prevent-file-change-action** is a GitHub Action which allows you to force a workflow fail if
a **pull request** attempts to modify a given file.

Syntax:

```
- name: Prevent file change
  uses: xalvarez/prevent-file-change-action@v1
  with:
    githubToken: ${{ secrets.GITHUB_TOKEN }}
    pattern: .*\.example
    trustedAuthors: xalvarez
    allowNewFiles: false
```

The action has the following inputs:

- `githubToken`: (**Required**) The GitHub token used to authenticate with the GitHub API.
  This is typically the `GITHUB_TOKEN` secret provided by GitHub Actions.
- `pattern`: (**Required**) A JavaScript [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
  that matches the filenames (including path) of files which must not be changed. For example,
  `.*\.example` would match any file with the `.example` extension.
- `trustedAuthors`: (**Optional**) A comma-separated list of GitHub usernames. If a pull request is
  opened by any of these authors, the action will not fail even if the pull request modifies a file
  that matches the pattern.
- `allowNewFiles`: (**Optional**) A boolean value that determines whether new files that match the
  pattern should be allowed in the pull request. If set to `true`, the action will not fail even if
  a new file that matches the pattern is added in the pull request. If not provided or set to
  `false`, the action will fail if a new file that matches the pattern is added.
- `closePR`: (**Optional**) A boolean value that determines whether the pull request should be closed
  if a pattern match is found. If set to `true`, the action will close the pull request instead of failing.
  If not provided or set to `false`, the action will fail if a pattern match is found.

> [!IMPORTANT]
> This Action supports pull_request and pull_request_target events only.

> [!CAUTION]
> If you are using the pull_request event, users can manipulate your workflow and add themselves as trusted authors,
> change the pattern, or manipulate the protecting workflow otherwise.
>
> pull_request_target always relies on the action of the target branch.
> Please be aware that the protecting workflow should follow GitHub's security recommendations for pull_request_target.
> You can find more information in the [docs](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request_target)
> or [this blog post](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).

## GITHUB_TOKEN permissions

The required GITHUB_TOKEN permissions are: `pull-requests: read`. Therefore, you may configure your workflow or job's
permissions as follows:

```
permissions:
  pull-requests: read
```

## Development

> [!IMPORTANT]
> This Action requires Node.js 20.

To work on this Action you first need to install npm dependencies:

```
npm i
```

Afterwards, apply any changes you want, write some tests and run all test by calling:

```
npm test
```

Once everything is fine run `npm run all`, which will also update `dist` files.

## License

**Prevent file change action's** license can be found under [LICENSE](LICENSE).
Additionally, this repository was created using [actions/typescript-action](https://github.com/actions/typescript-action) as template.
Its license is included here:

```
The MIT License (MIT)

Copyright (c) 2018 GitHub, Inc. and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
