---
title: 'Storybook for Angular tutorial'
tocTitle: 'Get started'
description: 'Setup Angular Storybook in your development environment'
commit: 0818d47
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Angular; other editions exist for [React](/react/en/get-started), [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Svelte](/svelte/en/get-started) and [Ember](/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Angular Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use the [@angular/cli](https://cli.angular.io/) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application:
npx -p @angular/cli ng new taskbox --style css

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

### Setup Jest with Angular

We have two out of three modalities configured in our app, but we still need one, we need to setup [Jest](https://facebook.github.io/jest/) to enable testing.

Run the following command:

```bash
npm install -D jest @types/jest jest-preset-angular@7.1.1 @testing-library/angular @testing-library/jest-dom @babel/preset-env @babel/preset-typescript
```

Create `src/jest-config` folder and inside some files will be added.

Start by creating a file called `globalMocks.ts` with the following:

```typescript
// src/jest-config/globalMocks.ts
const mock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});
```

Followed with a new file called `setup.ts` with the following:

```typescript
// src/jest-config/setup.ts
import 'jest-preset-angular';
import './globalMocks';

Object.defineProperty(global, 'Promise', { writable: false, value: global.Promise });
```

Then create a new file called `styleMock.js` with the following:

```javascript
// src/jest-config/styleMock.js
module.exports = {};
```

Also `fileMock.js` with the following:

```javascript
// src/jest-config/fileMock.js
module.exports = 'file-stub';
```

Now in the root of your project folder, create a file called `babel.config.js` with the following content:

```javascript
// babel.config.js
module.exports = function(api) {
  process.env.NODE_ENV === 'development' ? api.cache(false) : api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ];
  const plugins = [];
  return {
    presets,
    plugins,
  };
};
```

Add a new field to `package.json` with the following:

```json
{
  ....
   "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": [
      "<rootDir>/src/jest-config/setup.ts"
    ],
    "transformIgnorePatterns":[
      "node_modules/(?!@storybook/*)"
    ],
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/storybook-static/",
      "<rootDir>/src/test.ts"
    ],
    "coveragePathIgnorePatterns": [
      "/jest-config/",
      "/node_modules/"
    ],
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-preset-angular/AngularSnapshotSerializer.js",
      "<rootDir>/node_modules/jest-preset-angular/HTMLCommentSerializer.js"
    ],
    "globals": {
      "ts-jest": {
        "tsConfig": "<rootDir>/tsconfig.spec.json",
        "stringifyContentPathRegex": "\\.html$",
        "diagnostics": false,
        "isolatedModules": true,
        "astTransformers": [
          "<rootDir>/node_modules/jest-preset-angular/InlineHtmlStripStylesTransformer"
        ]
      }
    },
    "moduleNameMapper": {
      "\\.(css|less)$": "<rootDir>/src/jest-config/styleMock.js",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/jest-config/fileMock.js"
    },
    "transform": {
      "^.+\\.(ts|html)$": "ts-jest",
      "^.+\\.js$": "babel-jest"
    },
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node",
      ".html"
    ]
  }
}
```

We need to make some changes to some of the files that `@angular/cli` added when the project was instantiated earlier. More specifically `tsconfig.spec.json`,`tsconfig.json` and `tsconfig.app.json`.

In your `tsconfig.spec.json` add the following keys and values to the `compilerOptions`:

```json
{
 "compilerOptions": {
  ....
  "module": "commonjs",
  "allowJs": true,
  }
}
```

You'll also need to change the `types` to the following:

```json
{
  "compilerOptions": {
    "types": ["jest", "jquery", "jsdom", "node"]
  }
}
```

Moving onto `tsconfig.json`. Once again under `compilerOptions` add the following key and value `emitDecoratorMetadata: true`

And finally in `tsconfig.app.json` add a reference to the folder you've created earlier to the `exclude`, turning its contents into:

```json
{
  "exclude": ["src/test.ts", "src/**/*.spec.ts", "**/*.stories.ts", "src/jest-config"]
}
```

We're almost done, only three more changes are required to finish setting up Jest with Angular and Storybook.

Add the following key and value to your `.storybook/tsconfig.json`:

```json
{
  ...
  "compilerOptions": {
    "skipLibCheck": true,
    ....
  },
  ...
}

```

We need a script to run our tests, add the following script to your `package.json` to allow `jest` to run:

```json
{
  ....
  "scripts":{
    ...
     "jest": "jest --watch"
  }
}
```

And finally update the test file that was created automatically when the project was initialized, more specifically `src/app/app.component.spec.ts` to:

```typescript
import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render the component', async () => {
    const { getByText } = await render(AppComponent);
    expect(getByText('Welcome'));
  });
});
```

Now we can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal (we will add Jest along the way):
npm run jest

# Start the component explorer on port 6006:
npm run storybook

# Run the frontend app proper on port 4200:
npm run start
```

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities-angular.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the `src/styles.css` file.

And make a small change to allow the icons in the `percolate` font to be correctly displayed with Angular.

```css
@font-face {
  font-family: 'percolate';
  src: url('/assets/icon/percolate.eot?-5w3um4');
  src: url('/assets/icon/percolate.eot?#iefix5w3um4') format('embedded-opentype'), url('/assets/icon/percolate.woff?5w3um4')
      format('woff'), url('/assets/icon/percolate.ttf?5w3um4') format('truetype'), url('/assets/icon/percolate.svg?5w3um4')
      format('svg');
  font-weight: normal;
  font-style: normal;
}
```

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">here</a>.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place its contents inside your `src/assets` folder. Issue the following commands in your terminal:

```bash
npx degit chromaui/learnstorybook-code/public/font src/assets/font
npx degit chromaui/learnstorybook-code/public/icon src/assets/icon
```

<div class="aside">
We use <a href="https://github.com/Rich-Harris/degit">degit</a> to download folders from GitHub. If you want to do it manually, you can grab the folders <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.
</div>

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
