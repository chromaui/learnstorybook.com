---
title: "Get started"
tocTitle: "Get started"
description: "Setup Storybook in your development environment"
commit: 30939d5
---

# Get started

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app.

![Storybook and your app](/storybook-relationship.jpg)

## Setup Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [Create React App](https://github.com/facebook/create-react-app) (CRA) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# If you haven't already got some tools we need, install from npm
npm install --global create-react-app getstorybook yarn

# Create our application:
create-react-app tasklist
cd tasklist

# Add Storybook:
getstorybook
```

We can quickly check the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/app-three-modalities.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. We’ll simply compile the LESS to a single CSS file and include it in our app. Copy and paste [this compiled CSS](https://gist.github.com/tmeasday/a2658f7c37ab93dfc03e688c0febdae0) into the src/index.css file per CRA’s convention.

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the Github repo.
</div>

## Add assets

We also need to add the font and icon [directories](https://github.com/hichroma/learnstorybook-code/) to the public/ folder. After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
