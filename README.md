# Prevent file change action

**prevent-file-change-action** is a GitHub Action which allows you to force a workflow fail if
a **pull request** attempts to modify a given file.

Syntax:

```
- name: Prevent file change
  uses: xalvarez/prevent-file-change-action@v1
  with:
    githubToken: ${{ secrets.GITHUB_TOKEN }}
    pattern: .*.example
    trustedAuthors: xalvarez
```

Where `pattern` is a valid JavaScript regular expression matching filenames (including path) of files which must not be changed.
See: [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

In the example above, files with `.example` extension won't be allowed to be changed.

**Note**: This Action supports pull request events only.

## Development

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
