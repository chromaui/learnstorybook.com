---
title: 'Distribute UI across an organization'
tocTitle: 'Distribute'
description: 'Learn to package and import your design system into other apps'
commit: 3a5cd35
---

From an architectural perspective, design systems are yet another frontend dependency. They are no different than popular dependencies like moment or lodash. UI components are code so we can rely on established techniques for code reuse.

This chapter walks through design system distribution from packaging UI components to importing them in other apps. We’ll also uncover timesaving techniques to streamline versioning and release.

![Propagate components to sites](/design-systems-for-developers/design-system-propagation.png)

## Package the design system

Organizations have thousands of UI components spread across different apps. Previously, we extracted the most common components into our design system. Now we need to reintroduce those components back into the apps.

Our design system uses JavaScript package manager npm to handle distribution, versioning, and dependency management.

There are many valid methods for packaging design systems. Gander at design systems from Lonely Planet, Auth0, Salesforce, GitHub, and Microsoft to see a diversity in approaches. Some folks deliver each component as a separate package. Others ship all components in one package.

For nascent design systems, the most direct way is to publish a single versioned package that encapsulates:

- 🏗 Common UI components
- 🎨 Design tokens (a.k.a., style variables)
- 📕 Documentation

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## Prepare your design system for export

As we used create-react-app as a starting point for our design system, there are still vestiges of the initial app and scripts that create-react-app created for us. Let’s clean them up now.

First, we should add a basic README.md:

```markdown
# The Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

Then, let’s create a `src/index.js` file to create a common entry point for using our design system. From this file we’ll export all our design tokens and the components:

```javascript
//src/index.js

import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

Let’s add a development dependency on `@babel/cli` and `cross-env` to compile our JavaScript for release:

```bash
yarn add --dev @babel/cli cross-env
```

To build the package, we’ll add a script to `package.json` that builds our source directory into `dist`:

```json
{
  "scripts": {
    "build": "cross-env BABEL_ENV=production babel src -d dist",
      ...
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

We can now run `yarn build` to build our code into the `dist` directory -- we should add that directory to `.gitignore` too:

```
// ..
dist
```

#### Adding package metadata for publication

Finally, let’s make a couple of changes to `package.json` to ensure consumers of the package get all the information we need. The easiest way to do that is to run `yarn init` -- a command that initializes the package for publication:

```bash
yarn init

yarn init v1.16.0
question name (learnstorybook-design-system):
question version (0.1.0):
question description (Learn Storybook design system):
question entry point (dist/index.js):
question repository url (https://github.com/chromaui/learnstorybook-design-system.git):
question author (Tom Coleman <tom@thesnail.org>):
question license (MIT):
question private: no
```

The command will ask us a set of questions, some of which will be prefilled with answers, others that we’ll have to think about. You’ll need to pick a unique name for the package on npm (you won’t be able to use `learnstorybook-design-system` -- a good choice is `<your-username>-learnstorybook-design-system`).

All in all, it will update `package.json` with new values as a result of those questions:

```json
{
  "name": "learnstorybook-design-system",
  "description": "Learn Storybook design system",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/chromaui/learnstorybook-design-system.git"
  // ...
}
```

Now we’ve prepared our package, we can publish it to npm for the first time!

## Release management with Auto

To publish releases to npm, we’ll use a process that also updates a changelog describing changes, sets a sensible version number, and creates git tag linking that version number to a commit in our repository. To help with all those things, we’ll use an open-source tool called [Auto](https://github.com/intuit/auto), designed for this very purpose.

Let’s install Auto:

```bash
yarn add --dev auto
```

Auto is a command line tool we can use for various common tasks around release management. You can learn more about Auto on [their documentation site](https://intuit.github.io/auto/).

#### Getting a GitHub and npm token

For the next few steps, Auto is going to talk to GitHub and npm. In order for that to work correctly, we’ll need a personal access token. You can get one of those on [this page](https://github.com/settings/tokens) for GitHub. The token will need the `repo` scope.

For npm, you can create a token at the URL: https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

You’ll need a token with “Read and Publish” permissions.

Let’s add that token to a file called `.env` in our project:

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

By adding the file to `.gitignore` we’ll be sure that we don’t accidentally push this value to an open-source repository that all our users can see! This is crucial. If other maintainers need to publish the package from locally (later we’ll set things up to auto publish when PRs are merged to master) they should set up their own `.env` file following this process:

```
dist
.env
```

#### Create labels on GitHub

The first thing we need to do with Auto is to create a set of labels in GitHub. We’ll use these labels in the future when making changes to the package (see the next chapter) and that’ll allow `auto` to update the package version sensibly and create a changelog and release notes.

```bash
yarn auto create-labels
```

If you check on GitHub, you’ll now see a set of labels that `auto` would like us to use:

![Set of labels created on GitHub by auto](/design-systems-for-developers/github-auto-labels.png)

We should tag all future PRs with one of the labels: `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation` before merging them.

#### Publish our first release with Auto manually

In the future, we’ll calculate new version numbers with `auto` via scripts, but for the first release, let’s run the commands manually to understand what they do. Let’s generate our first changelog entry:

```bash
yarn auto changelog
```

This will generate a long changelog entry with every commit we’ve created so far (and a warning we’ve been pushing to master, which we should stop doing soon).

Although it is useful to have an auto-generated changelog so you don’t miss things, it’s also a good idea to manually edit it and craft the message in the most useful way for users. In this case, the users don’t need to know about all the commits along the way. Let’s make a nice simple message for our first v0.1.0 version. First undo the commit that Auto just created (but keep the changes:

```bash
git reset HEAD^
```

Then we’ll update the changelog and commit it:

```
# v0.1.0 (Tue Sep 03 2019)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
```

Let’s add that changelog to git. Note that we use `[skip ci]` to tell CI platforms to ignore these commits, else we end up in their build and publish loop.

```bash
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

Now we can publish:

```bash
npm version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish
```

And use Auto to create a release on GitHub:

```bash
git push --follow-tags origin master
yarn auto release
```

Yay! We’ve successfully published our package to npm and created a release on GitHub (with luck!).

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

![Release published to GitHub](/design-systems-for-developers/github-published-release.png)

(Note that although `auto` auto-generated the release notes for the first release, we've also modified them to make sense for a first version).

<h4>Set up scripts to use Auto</h4>

Let’s set up Auto to follow the same process when we want to publish the package in the future. We’ll add the following scripts to our `package.json`:

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

<!-- Now, when we run `yarn release`, we’ll step through all the steps we ran above (except using the auto-generated changelog) in an automated fashion. We’ll ensure that all commits to master are published by making a change to our GitHub Action: -->

Now, when we run `yarn release`, we'll setup through all the steps we ran above (except using the auto-generated changelog) in a automated fashion. We'll ensure that all commits to master will be published.

We can do this by adding a new GitHub action in a file called `push.yml`, in the same folder we've used to setup the Storybook publishing action earlier:

```yml
# .github/workflows/push.yml

## name of our action
name: Release

# the event that will trigger the action
on:
  push:
    branches: [master]

# what the action will do
jobs:
  release:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # this check needs to be in place to prevent a publish loop with auto and github actions
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
      - name: Prepare repository
        run: git fetch --unshallow --tags
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Cache node modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: yarn-deps-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            yarn-deps-${{ hashFiles('yarn.lock') }}

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          yarn release
```

Don't forget to to add the npm token to the project’s secrets.

![Setting secrets in GitHub](/design-systems-for-developers/gh-npm-token-added.png)

<div class="aside"><p>For brevity purposes <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> weren't mentioned. Secrets are secure environment variables provided by GitHub so that you don't need to hard code any sensitive information.</p></div>

Now every time you merge a PR to master, it will automatically publish a new version, incrementing the version number as appropriate due to the labels you’ve added.

<div class="aside">We didn’t cover all of Auto’s many features and integrations that might be useful for growing design systems. Read the docs <a href="https://github.com/intuit/auto">here</a>.</div>

![Import the design system](/design-systems-for-developers/design-system-import.png)

## Import the design system in an app

Now that our design system lives online, it’s trivial to install the dependency and start using the UI components.

#### Get the example app

Earlier in this tutorial, we standardized on a popular frontend stack that includes React and styled-components. That means our example app must also use React and styled-components to take full advantage of the design system.

<div class="aside">Other promising methods like Svelte or web components may allow you to ship framework-agnostic UI components . However, they are relatively new, under-documented, or lack widespread adoption so they’re not included in this guide yet.</div>

The example app uses Storybook to facilitate [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), an app development methodology of building UIs from the bottom up starting with components and ending with pages. During the demo, we’ll run two Storybook’s side-by-side: one for our example app and one for our design system.

Clone the example app repository from GitHub

```bash
git clone https://github.com/chromaui/learnstorybook-design-system-example-app.git
```

Install the dependencies and start the app’s Storybook

```bash
yarn install
yarn storybook
```

You should see the Storybook running with the stories for the simple components the app uses:

![Initial storybook for example app](/design-systems-for-developers/example-app-starting-storybook.png)

<h4>Integrating the design system</h4>

Add your published design system as a dependency.

```bash
yarn add <your-username>-learnstorybook-design-system
```

Now, let’s update the example app’s `.storybook/main.js` to import the design system components:

```javascript
// .storybook/main.js

module.exports = {
  stories: [
    '../src/**/*.stories.js',
    '../node_modules/<your-username>-learnstorybook-design-system/dist/**/*.stories.(js|mdx)',
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

Also we can add a global decorator to a new `.storybook/preview.js` config file use the global styles defined by the design system. Make the following change to the file:

```javascript
// .storybook/preview.js

import React from 'react';
import { addDecorator } from '@storybook/react';
import { global as designSystemGlobal } from '<your-username>-learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

![Example app storybook with design system stories](/design-systems-for-developers/example-app-storybook-with-design-system-stories.png)

You’ll now be able to browse the design system components and docs while developing the example app. Showcasing the design system during feature development increases the likelihood that developers will reuse existing components instead of wasting time inventing their own.

Alternatively, you can browse your design system’s Storybook online if you deployed it to <a href="https://www.learnstorybook.com/design-systems-for-developers/react/en/review/#publish-storybook">Chromatic </a> earlier (see chapter 4).

We’ll use the Avatar component from our design system in the example app’s UserItem component. UserItem should render information about a user including a name and profile photo.

Navigate to the UserItem.js component in your editor. Also, find UserItem in the Storybook sidebar to see code changes update instantly with hot module reload.

Import the Avatar component.

```javascript
// src/components/UserItem.js

import { Avatar } from '<your-username>-learnstorybook-design-system';
```

We want to render the Avatar beside the username.

```javascript
//src/components/UserItem.js

import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
    <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

Upon save, the UserItem component will update in Storybook to show the new Avatar component. Since UserItem is a part of the UserList component, you’ll see the Avatar in UserList as well.

![Example app using the Design System](/design-systems-for-developers/example-app-storybook-using-design-system.png)

There you have it! You just imported a design system component into the example app. Whenever you publish an update to the Avatar component in the design system, that change will also be reflected in the example app when you update the package.

![Distribute design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## Master the design system workflow

The design system workflow starts with developing UI components in Storybook and ends with distributing them to client apps. That’s not all though. Design systems must continually evolve to serve ever-changing product requirements. Our work has only just begun.

Chapter 8 illustrates the end-to-end design system workflow we created in this guide. We’ll see how UI changes ripple outward from the design system.
