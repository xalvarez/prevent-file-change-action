# Prevent file change action

[![CodeQL](https://github.com/xalvarez/prevent-file-change-action/actions/workflows/codeql-analysis.yml/badge.svg?event=push)](https://github.com/xalvarez/prevent-file-change-action/actions/workflows/codeql-analysis.yml)

**prevent-file-change-action** is a GitHub Action which allows you to force a workflow fail if
a **pull request** attempts to modify a given file.

Syntax:

```
- name: Prevent file change
  uses: xalvarez/prevent-file-change-action@v3
  with:
    githubToken: ${{ secrets.GITHUB_TOKEN }}
    pattern: .*\.example
    trustedAuthors: xalvarez
    allowNewFiles: false
```

Complete example:

```
name: Prevent file change

on:
  pull_request_target:
    branches: [ main ]

jobs:
  prevent-file-change:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: read
    steps:
      - name: Prevent file from being modified
        uses: xalvarez/prevent-file-change-action@v3.0.0
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          pattern: .*hello.world
```

No `actions/checkout` step is needed: the Action reads the changed files through the GitHub API.

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
> This Action supports `pull_request_target` events exclusively. See
> [Why `pull_request_target`?](#why-pull_request_target) for details.

## Why `pull_request_target`?

With `pull_request`, GitHub runs the workflow file from the pull request's merge commit. A pull request could therefore
edit the protective workflow itself, for example by adding its author to `trustedAuthors`, changing `pattern`, or
replacing the step with one that always passes, and the check would still report success.

With `pull_request_target`, the workflow file is always taken from the default branch, so a pull request cannot alter
it. This Action uses that context safely: it never checks out or executes code from the pull request. It only reads the
list of changed files through the GitHub API.

> [!CAUTION]
> Do not add steps that check out or run pull request code (for example `actions/checkout` with
> `ref: ${{ github.event.pull_request.head.sha }}`) to the same workflow. See
> [Securely using `pull_request_target`](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)
> and [Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).

## Allowing `pull_request_target` in public repositories

> [!WARNING]
> Starting **December 2, 2026**, GitHub blocks `pull_request_target` events by default in **public** repositories,
> unless an applicable Actions event policy explicitly allows them. Blocked runs fail with an error annotation, so a
> required check using this Action will block merging until the event is allowed. Temporary brownouts take place on
> **November 9, 2026** and **November 16, 2026**, 16:00–18:00 UTC. Private and internal repositories aren't affected.
> See the [GitHub changelog](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/).

To keep this Action working, allow `pull_request_target` only for the workflow file that uses it:

1. In your repository (or organization), click **Settings**.
2. In the left sidebar, under **Actions**, click **Policies**.
3. Create a new policy and give it a name, for example `Allow prevent-file-change`.
4. Target only the workflow file that uses this Action, for example `.github/workflows/prevent-file-change.yml`.
5. Under **Restrict events**, allow `pull_request_target`.
6. Save the policy, then check **Policy insights** to confirm the workflow is no longer reported as blocked.

For full details, see
[Governing execution of GitHub Actions workflows](https://docs.github.com/actions/how-tos/administer/control-workflow-execution).

> [!TIP]
> Keep the allowed workflow minimal: only the job that runs this Action. Allowing a broader set of workflows increases
> the risk of running untrusted code with access to your secrets.

## GITHUB_TOKEN permissions

The required GITHUB_TOKEN permissions are: `pull-requests: read`. Therefore, you may configure your workflow or job's
permissions as follows:

```
permissions:
  pull-requests: read
```

## Development

> [!IMPORTANT]
> This Action requires Node.js 24.

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
