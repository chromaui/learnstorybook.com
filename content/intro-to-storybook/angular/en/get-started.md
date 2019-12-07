---
title: 'Storybook for Angular tutorial'
tocTitle: 'Get started'
description: 'Setup Angular Storybook in your development environment'
commit: 0818d47
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Angular; other editions exist for [React](/react/en/get-started) and [Vue](/vue/en/get-started).

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
npm install -D jest @types/jest jest-preset-angular@7.1.1 @testing-library/angular @testing-library/jest-dom
```

Create `src/jest-config` folder and inside some files will be added.

Start by creating a file called `globalMocks.ts` with the following:

```typescript
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
import 'jest-preset-angular';
import './globalMocks';

Object.defineProperty(global, 'Promise', { writable: false, value: global.Promise });
```

Then create a new file called `styleMock.js` with the following:

```javascript
module.exports = {};
```

Also `fileMock.js` with the following:

```javascript
module.exports = 'file-stub';
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
    "testPathIgnorePatterns": [
      "node_modules/(?!@storybook/*)",
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
      "^.+\\.stories\\.[jt]sx?$": "@storybook/addon-storyshots/injectFileName"
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
```

Also some new scripts to allow `jest` to run:

```json
{
  ....
  "scripts":{
    ...
     "jest": "jest",
     "jest:watch": "jest --watch"
  }
}
```

Update `src/app/app.component.spec.ts`:

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

Finally update `tsconfig.app.json` with the following:
```json
{
  
  "exclude": [
    "src/test.ts",
    "src/**/*.spec.ts",
    "**/*.stories.ts",
    "src/jest-config",
    
  ]
}

```

Our three frontend app modalities: automated test (Karma), component development (Storybook), and the app itself.

Now we can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Karma) in a terminal (we will add Jest along the way):
npm run jest

# Start the component explorer on port 6006:
npm run storybook

# Run the frontend app proper on port 4200:
npm run start
```

![3 modalities](/intro-to-storybook/app-three-modalities-angular.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the `src/styles.css` file.

Finally one small change to `src/styles.css` in order to allow the icons in the `percolate` font to be correctly displayed with angular.

```css
@font-face {
  font-family: 'percolate';
  src: url('./assets/icon/percolate.eot?-5w3um4');
  src: url('./assets/icon/percolate.eot?#iefix5w3um4') format('embedded-opentype'), url('./assets/icon/percolate.woff?5w3um4')
      format('woff'), url('./assets/icon/percolate.ttf?5w3um4') format('truetype'), url('./assets/icon/percolate.svg?5w3um4')
      format('svg');
  font-weight: normal;
  font-style: normal;
}
```
![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

Add the font and icon directories by downloading them to your computer and dropping them into your repository.

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon assets/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font assets/font
```

<div class="aside">
<p>We’ve used <code>svn</code> (Subversion) to easily download a folder of files from GitHub. If you don’t have subversion installed or want to just do it manually, you can grab the folders directly <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.</p></div>

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
