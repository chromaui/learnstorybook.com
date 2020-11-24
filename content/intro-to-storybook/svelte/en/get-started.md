---
title: 'Storybook for Svelte tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Svelte; other editions exist for [Vue](/vue/en/get-started), [Angular](/angular/en/get-started), [React](/react/en/get-started) and [React Native](/react-native/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Svelte Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [degit](https://github.com/Rich-Harris/degit) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application:
npx degit sveltejs/template taskbox

cd taskbox

# Install the dependencies
npm install

# Add Storybook:
npx -p @storybook/cli sb init --type svelte
```

### Setup Jest with Svelte

We have two out of three modalities configured in our app, but we still need one, we need to setup [Jest](https://facebook.github.io/jest/) to enable testing.

Run the following commands:

```bash
npm install -D jest @testing-library/svelte jest-transform-svelte @testing-library/jest-dom
```

Create a new folder called `__mocks__`, with two files inside:

- The first one called `fileMock.js` with the following content:
  ```javascript
  module.exports = 'file-stub';
  ```
- The second one called `styleMock.js` with the following content:
  ```javascript
  module.exports = {};
  ```

Create a `.babelrc` file in the root of the project with the following:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

Add a new field to `package.json`:

```json
{
  "jest": {
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.svelte$": "jest-transform-svelte"
    },
    "moduleFileExtensions": ["js", "svelte", "json"],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|scss|stylesheet)$": "<rootDir>/__mocks__/styleMock.js"
    },
    "setupFilesAfterEnv": ["@testing-library/jest-dom/extend-expect"],
    "testPathIgnorePatterns": ["/node_modules/", "/build/", "/storybook-static/"]
  }
}
```

And a new script is required to run Jest:

```json
{
  "scripts": {
    "test": "jest --watchAll"
  }
}
```

<div class="aside">The usage of the flag `--watchAll` in the script is to prevent a error being thrown by Jest, because at this stage there's still no repository configured. That will be addressed later on.</div>

To make sure everything is working properly we need to create a test file. In the `src` folder, add a file called `Sample.test.js` with the following:

```javascript
// Sample.test.js

function sum(a, b) {
  return a + b;
}
describe('Sample Test', () => {
  it('should return 3 as the result of the function', () => {
    // set timeout to prevent false positives with tests
    expect(sum(1, 2)).toBe(3);
  });
});
```

Now we can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
npm run test

# Start the component explorer on port 9009:
npm run storybook

# Run the frontend app proper on port 5000:
npm run dev
```

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities-svelte.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the public/global.css file.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">here</a>.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place them inside the `public` folder. Issue the following commands in your terminal:

```bash
npx degit chromaui/learnstorybook-code/src/assets/font public/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon public/assets/icon
```

<div class="aside">
We use <a href="https://github.com/Rich-Harris/degit">degit</a> to download folders from GitHub. If you want to do it manually, you can grab the folders <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">here</a>.
</div>

Finally we need to update our storybook script to serve the `public` directory (in `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
