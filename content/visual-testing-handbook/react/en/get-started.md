---
title: "Storybook for React tutorial"
tocTitle: "Get started"
description: "Setup React Storybook in your development environment"
commit: ebe2ae2
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for React; other editions exist for [Vue](/vue/en/get-started) and [Angular](/angular/en/get-started).

![Storybook and your app](/storybook-relationship.jpg)

## Setup React Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [Create React App](https://github.com/facebook/create-react-app) (CRA) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application:
npx create-react-app taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

We can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
  NOTE: If <code>yarn test</code> throws an error, you may need to install <code>watchman</code> as advised in <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">this issue</a>.
</div>

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/app-three-modalities.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. We’ll simply compile the LESS to a single CSS file and include it in our app. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the src/index.css file per CRA’s convention.

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

We also need to add the font and icon [directories](https://github.com/chromaui/learnstorybook-code/tree/master/public) to the `public/` folder. After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
