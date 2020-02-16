# Effector Inspector

![Effector-Inspector](https://i.imgur.com/D5oqpLv.png)

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
