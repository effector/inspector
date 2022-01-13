# Effector Inspector

| Dark theme and unit tracing                     | Units in files                            |
| ----------------------------------------------- | ----------------------------------------- |
| ![Dark-Traces](https://i.imgur.com/Gqx47NV.png) | ![Units](https://i.imgur.com/xqrp2wl.png) |

## Installation

1. Install effector, logger and **inspector**

```bash
npm install effector
npm install --dev effector-logger effector-inspector
```

or yarn

```bash
yarn add effector
yarn add -D effector-logger effector-inspector
```

**effector-inspector** requires `effector` and `effector-logger` to be installed

2. Follow instructions for [effector-logger](https://github.com/sergeysova/effector-logger#installation)

- Setup babel plugin
- Replace `effector` to `effector-logger`

3. Open your root application file (`client.tsx` or `index.tsx`)

Initialize effector logger in it first lines.

```ts
import { createInspector } from 'effector-inspector';

createInspector();
```

4. Press hot keys to open inspector

By default: `CTRL+B` in your application

5. Watch your stores and its values

## Release process

1. Check out the [draft release](https://github.com/effector/inspector/releases).
1. All PRs should have correct labels and useful titles. You can [review available labels here](https://github.com/effector/inspector/blob/master/.github/release-drafter.yml).
1. Update labels for PRs and titles, next [manually run the release drafter action](https://github.com/effector/inspector/actions/workflows/release-drafter.yml) to regenerate the draft release.
1. Review the new version and press "Publish"
1. If required check "Create discussion for this release"
