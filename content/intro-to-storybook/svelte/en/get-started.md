---
title: 'Storybook for Svelte tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Svelte; other editions exist for [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [React](/angular/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Svelte Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [Degit](https://github.com/Rich-Harris/degit) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application:
npx degit sveltejs/template taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
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
  module.exports='file-stub';
  ```
- The second one called `styleMock.js` with the following content:
  ```javascript
  module.exports={};
  ```

Create a `.babelrc` file in the root of the project with the following:

```json
{
   "presets": [
        "@babel/preset-env"
    ]
}
```

Add a new field to `package.json`:

```json
"jest": {
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.svelte$": "jest-transform-svelte"
    },
    "moduleFileExtensions": [
      "js",
      "svelte",
      "json"
    ],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|scss|stylesheet)$": "<rootDir>/__mocks__/styleMock.js"
    },
    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/build/",
      "/storybook-static/"
    ]
  }
```

And a new script is required to run Jest:
```json
"test": "jest --watchAll"
```

<div class="aside">The usage of the flag `--watchAll` in the script is to prevent a error being thrown by Jest, because at this stage there's still no repository configured. That will be addressed later on.</div>

Finally we need to create a test file. Create a new file called `Sample.test.js` inside the `src` folder with the following inside:

```javascript
function sum(a, b) {
  return a + b;
}
describe("Sample Test", () => {
  it("should return 3 as the result of the function", () => {
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

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the src/index.css file.

We'll need a new dependency to bundle the copied css file into a separate file, leaving any component styles separated and with that avoiding any styling issues. Run the following command:

```bash
npm install -D rollup-plugin-css-only
```

Modify your `rollup.config.js` to the following:

```js
// ./rollup.config.js
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import rollup_start_dev from './rollup_start_dev';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
	....
	plugins: [
		....
		css({output: 'public/index.css'}), //bundles the copied css into the app 
		....
	],
};

```

Modify `public/index.html` to reference the css file we just added, by adding the following:

```html
<link rel="stylesheet" href="index.css">
```

And remove the following tag:

```html
<link rel='stylesheet' href='/global.css'>
```
<div class="aside">You can also safely remove the global.css file aswell as it will not be used with this tutorial</div>

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

We also need to add the font and icon [directories](https://github.com/chromaui/learnstorybook-code/tree/master/public) to the `public/` folder.

And finally we need to update our storybook script to serve the `public` directory (in `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
