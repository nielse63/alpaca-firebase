# alpaca-firebase

> Algotrading bot example using TypeScript

[Learn how to create your first algotrading bot on Medium.](https://medium.com/@ErikKyleNielsen/write-your-first-typescript-algotrading-bot-8194dfe60e5f)

## Prerequisites

Node `v22.12.0` and a global installation of `firebase-tools` are required to work on this project:

```bash
nvm install v22.12.0
npm i -g firebase-tools
```

## Installation

```bash
git clone https://github.com/nielse63/alpaca-firebase.git
cd alpaca-firebase
nvm use
npm ci
```

## Usage

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run serve`  | Run the firebase functions locally |
| `npm run deploy` | Deploy functions to production     |

### Development

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run lint`  | Lint and format source files    |
| `npm run build` | Generate type declaration files |

### Testing

```bash
npm test

# with coverage
npm test -- --coverage
```

### Creating a new release

```bash
npm run release
npm run release -- --patch    # release patch version
npm run release -- --minor    # release minor version
npm run release -- --major    # release major version
npm run release -- --force    # run even with uncommitted changes
npm run release -- --dry-ryn  # don't create an npm release
```
