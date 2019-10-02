---
title: 'Test to maintain quality'
tocTitle: 'Test'
description: 'How to test design system appearance, functionality, and accessibility'
commit: 5b71208
---

In chapter 5, we automate design system testing to prevent UI bugs. This chapter dives into what characteristics of UI components warrant testing and potential pitfalls to avoid. We researched professional teams at Wave, BBC, and Salesforce to land on a test strategy that balances comprehensive coverage, straightforward setup, and low maintenance.

<img src="/design-systems-for-developers/ui-component.png" width="250">

## Fundamentals of UI component testing

Before we begin, let’s figure out what makes sense to test. Design systems are composed of UI components. Each UI component includes stories (permutations) that describe the intended look and feel given a set of inputs (props). Stories are then rendered by a browser or device for the end-user.

![Component states are combinatorial](/design-systems-for-developers/component-test-cases.png)

Whoa! As you can see, one component contains many states. Multiply the states by the number of design system components and you can see why keeping track of them all is a Sisyphean task. In reality, it’s unsustainable to review each experience by hand, especially as the design system grows.

All the more reason to set up automated testing **now** to save work in the **future**.

## Prepare to test

I surveyed 4 frontend teams in a [previous article](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) about professional Storybook workflows. They agreed on these best practices for writing stories to make testing easy and comprehensive.

**Articulate supported component states** as stories to clarify which combinations of inputs yields a given state. Ruthlessly omit unsupported states to reduce noise.

**Render components consistently** to mitigate variability that can be triggered by randomized (Math.random) or relative (Date.now) inputs.

> “The best kind of stories allow you to visualize all of the states your component could experience in the wild” – Tim Hingston, Tech lead at Apollo GraphQL

## Visual test appearance

Design systems contain presentational UI components, which are inherently visual. Visual tests validate the visual aspects of the rendered UI.

Visual tests capture an image of every UI component in a consistent browser environment. New screenshots are automatically compared to previously accepted baseline screenshots. When there are visual differences, you get notified.

![Visual test components](/design-systems-for-developers/component-visual-testing.gif)

If you’re building a modern UI, visual testing saves your frontend team from time-consuming manual review and prevents expensive UI regressions. We’ll demo visual testing using Chromatic, an industrial-grade service by the Storybook maintainers.

First, go to [ChromaticQA.com](https://chromaticqa.com) and sign up with your GitHub account.

![Signing up at Chromatic](/design-systems-for-developers/chromatic-signup.png)

From there choose your design system repo. Behind the scenes, this will sync access permissions and instrument the PR checks.

![Creating a project at Chromatic](/design-systems-for-developers/chromatic-create-project.png)

Install the [storybook-chromatic](https://www.npmjs.com/package/storybook-chromatic) package via npm.

```bash
yarn add --dev storybook-chromatic
```

Make sure you import Chromatic in your Storybook configuration. Your `.storybook/config.js` file should look like this:

```javascript
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import 'storybook-chromatic';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

Open up your command line and navigate to the `design-system` directory. Then run your first test to establish your visual test baselines (you'll need to use the app code that Chromatic supplies on the website)

```bash
yarn chromatic test --app-code=<app-code>
```

![Result of our first Chromatic build](/design-systems-for-developers/chromatic-first-build.png)

Chromatic captured a baseline image of every story! Subsequent test runs will capture new images and compare them against these baselines. See how that works by tweaking a UI component and saving it. Go to the global styles (`src/shared/styles.js`) and increase the font-size.

```javascript
// …
export const typography = {
  // ...
  size: {
    s1: '13',
    // ...
  },
};
// ...
```

Run the test command again.

```bash
yarn chromatic test --app-code=<app-code>
```

Yikes! That small tweak resulted in a flood of UI changes.

![Second build in Chromatic with changes](/design-systems-for-developers/chromatic-second-build.png)

Visual testing helps identify UI changes in Storybook. Review the changes to confirm whether they’re intentional (improvements) or unintentional (bugs). If you’re fond of the new font-size, go ahead and accept the changes and commit to git. Or perhaps the changes are too ostentatious, go ahead and undo them.

Let’s add visual testing to the continuous integration job. Open `.circleci/config.yml` and add the test command.

```
version: 2
jobs:
 build:
   docker:
     - image: circleci/node:8.10.0

   working_directory: ~/repo

   steps:
     - checkout

     - restore_cache:
         keys:
           - v1-dependencies-{{ checksum "package.json" }}
           - v1-dependencies-

     - run: yarn install

     - save_cache:
         paths:
           - node_modules
         key: v1-dependencies-{{ checksum "package.json" }}

     - run: yarn test
     - run: yarn chromatic test --app-code=<app-code> --exit-zero-on-changes
```

Save and `git commit`. Congratulations you just set up visual testing in CI!

## Unit test functionality

Unit tests verify whether the UI code returns the correct output given a controlled input. They live alongside the component and help you validate specific functionality.

Everything is a component in modern view layers like React, Vue, and Angular. Components encapsulate diverse functionality from modest buttons to elaborate date pickers. The more intricate a component, the trickier it becomes to capture nuances using visual testing alone. That’s why we need unit tests.

![Unit test components](/design-systems-for-developers/component-unit-testing.gif)

For instance, our Link component is a little complicated when combined with systems that generate link URLs (“LinkWrappers” in ReactRouter, Gatsby, or Next.js). A mistake in the implementation can lead to links without a valid href value.

Visually, it isn’t possible to see if the `href` attribute is there and points to the right location, which is why a unit test can be appropriate to avoid regressions.

#### Unit testing hrefs

Let’s add a unit test for our `Link` component. create-react-app has set up a unit test environment for us already, so we can simply create a file `src/Link.test.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = props => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

it('has a href attribute when rendering with linkWrapper', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Link href="https://learnstorybook.com" LinkWrapper={LinkWrapper}>
      Link Text
    </Link>,
    div
  );

  expect(div.querySelector('a[href="https://learnstorybook.com"]')).not.toBeNull();
  expect(div.textContent).toEqual('Link Text');

  ReactDOM.unmountComponentAtNode(div);
});
```

We can run the above unit test as part of our `yarn test` command.

![Running a single Jest test](/design-systems-for-developers/jest-test.png)

Earlier we configured our Circle config.js file to run `yarn test` on every commit. Our contributors will now benefit from this unit test. The Link component will be robust to regressions.

![Successful circle build](/design-systems-for-developers/circleci-successful-build.png)

<div class="aside"> Note: Watch out for too many unit tests which can make updates cumbersome. We recommend unit testing design systems in moderation.</div>

> "Our enhanced automated test suite has empowered our design systems team to move faster with more confidence." – Dan Green-Leipciger, Senior software engineer at Wave

## Accessibility test

“Accessibility means all people, including those with disabilities, can understand, navigate, and interact with your app... Online [examples include] alternative ways to access content such as using the tab key and a screen reader to traverse a site.” writes developer [Alex Wilson from T.Rowe Price](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347).

Disabilities affect 15% of the population according to the [World Health Organization](https://www.who.int/disabilities/world_report/2011/report/en/). Design systems have an outsized impact on accessibility because they contain the building blocks of user interfaces. Improving accessibility of just one component means every instance of that component across your company benefits.

![Storybook accessibility addon](/design-systems-for-developers/storybook-accessibility-addon.png)

Get a headstart on inclusive UI with Storybook’s Accessibility addon, a tool for verifying web accessibility standards (WCAG) in realtime.

```bash
yarn add --dev @storybook/addon-a11y

```

Register the addon in `.storybook/addons.js`:

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
```

And add the `withA11y` decorator to our `.storybook/config.js`:

```javascript
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import 'storybook-chromatic';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(withA11y);
addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

// automatically import all files ending in \*.stories.js
configure(require.context('../src', true, /\.stories\.js\$/), module);
```

Once installed, you’ll see a new “Accessibility” tab in the Storybook addons panel.

![Storybook a11y addon](/design-systems-for-developers/storybook-addon-a11y.png)

This shows you accessibility levels of DOM elements (violations and passes). Click the “highlight results” checkbox to visualize violations in situ with the UI component.

![Storybook a11y addon with passes highlighted](/design-systems-for-developers/storybook-addon-a11y-highlighted.png)

From here, follow the addon’s accessibility recommendations.

## Other testing strategies

Paradoxically, tests can save time but also bog down development velocity with maintenance. Be judicious about testing the right things – not everything. Even though software development has many test strategies, we discovered the hard way that some aren’t suited for design systems.

#### Snapshot tests (Jest)

This technique captures the code output of UI components and compares it to previous versions. Testing UI component markup ends up testing implementation details (code), not what the user experiences in the browser.

Diffing code snapshots is unpredictable and prone to false positives. At the component level, code snapshotting doesn’t account for global changes like design tokens, CSS, and 3rd party API updates (web fonts, Stripe forms, Google Maps, etc.). In practice, developers resort to “approving all” or ignoring snapshot tests altogether.

> Most component snapshot tests are really just a worse version of screenshot tests. Test your outputs. Snapshot what gets rendered, not the underlying (volatile!) markup. – Mark Dalgliesh, Frontend infrastructure at SEEK, CSS modules creator

#### End-to-end tests (Selenium, Cypress)

End-to-end tests traverse the component DOM to simulate the user flow. They’re best suited for verifying app flows like the signup or checkout process. The more complex functionality the more useful this testing strategy.

Design systems contain atomic components with relatively simple functionality. Validating user flows are often overkill for this task because the tests are time-consuming to create and brittle to maintain. However, in rare situations, components may benefit from end-to-end tests. For instance, validating complex UIs like datepickers or self-contained payment forms.

## Drive adoption with documentation

A design system is not complete with tests alone. Since design systems serve stakeholders from across the organization, we need to teach others how to get the most from our well-tested UI components.

In chapter 6, we’ll learn how to accelerate design system adoption with documentation. See why Storybook Docs is a secret weapon to create comprehensive docs with less work.
