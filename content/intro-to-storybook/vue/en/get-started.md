---
title: "Storybook for Vue tutorial"
tocTitle: "Get started"
description: "Setup Vue Storybook in your development environment"
commit: d1c4858
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Vue; other editions exist for [React](/react/en/get-started) and [Angular](/angular/en/get-started).

![Storybook and your app](/storybook-relationship.jpg)

## Setup Vue Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use the [Vue CLI](https://cli.vuejs.org) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application, using a preset that contains jest:
npx -p @vue/cli vue create --preset hichroma/vue-preset-learnstorybook taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

We can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test:unit

# Start the component explorer on port 6006:
yarn run storybook

# Run the frontend app proper on port 8080:
yarn serve
```

<div class="aside">
  NOTE: If <code>yarn test:unit</code> throws an error, you may not have <a href="https://yarnpkg.com/lang/en/docs/install/">yarn installed</a> or you may need to install <code>watchman</code> as advised in <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">this issue</a>.
</div>

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/app-three-modalities-vue.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. We’ll simply compile the LESS to a single CSS file and include it in our app. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into `src/index.css` and then import the CSS into the app by editing the `<style>` tag in `src/App.vue` so it looks like:

```html
<style>
@import './index.css';
</style>
```

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

We also need to add the font and icon [directories](https://github.com/chromaui/learnstorybook-code/tree/master/public) to the `public/` folder.

We also need to update our storybook script to serve the `public` directory (in `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
