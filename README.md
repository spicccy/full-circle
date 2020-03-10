# Welcome to the full-circle monorepo!

We hope you enjoy your stay

## Prerequisites

- Node Version Manager [windows](https://github.com/coreybutler/nvm-windows) [linux](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/)
- (Recommended) VSCode

## Installation

### First time?

```
# install node
nvm install 13.7.0
nvm use 13.7.0

# sync your public SSH key with github if you haven't done so already
git clone git@github.com:unsw-cse-comp3900-9900/capstone-project-spicccy.git
cd capstone-project-spicccy

# install and build dependencies
yarn
yarn build:shared
```

## Opening in VSCode

This project has a vscode workspace, which contains settings and recommended plugins. Open the `full-circle.code-workspace` file inside .vscode. Recommended plugins can be installed through the extensions tab, then "Show Recommended Extensions".

### Updating packages

Should be done whenever pulling from master, to be up to date with packages.

```
yarn
```

### Running in development mode

This will run frontend and backend in parallel in the same terminal.

```
yarn start
```

Alternatively open up frontend and backend can be run in separate terminals

```
yarn start:FE
```

```
yarn start:BE
```

### Adding or updating packages

Adding a web package:

```
yarn FE add <package-name>
```

Adding a server package:

```
yarn BE add <package-name>
```

Adding a shared/global package:

```
yarn ALL add <package-name>
```

### Linting and tests

Runs prettier and eslint over the whole project, and will try to autofix any issues.

```
yarn prettylint
```

Runs all the tests.

```
yarn test
```

## Shared folder

Contains shared code between server and web. Code in this file needs to be compiled first, before it can be imported. Either run `yarn build:shared` or run it in watch mode with `yarn start`.

Linting rule has been added to stop imports from `@full-circle/shared/src`. Please import the compiled code from `@full-circle/shared/lib` instead.
