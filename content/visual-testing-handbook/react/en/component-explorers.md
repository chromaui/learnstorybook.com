---
title: 'Component explorers'
tocTitle: 'Component explorers'
description: 'Your new favorite tool for UI development and testing'
---

UI components make you think reusable, predictable, and modular. They allow you to build apps "bottom-up," starting with atomic components then progressively combining them into pages.

However, as an app grows, teams encounter two challenges:

- 🗄️ An ever-increasing number of components
- 🗜️ More complex components

In the past, you'd build a component "on-site" of the exact page where it's used. But UIs now support countless permutations of state, language, device, browser, and user data. It's cumbersome to navigate to a page, then click around to get it in the right state, just to work on one component.

**Component explorers isolate UI components to simplify development and testing.** You sidestep getting entangled in an app's business logic and layout until you're ready to integrate the component. That enables Fortune 100 companies like Microsoft, Ebay, and IBM to deliver durable UI components for billions of people.

![Relation between components and component explorers](/visual-testing-handbook/component-explorer-diagram-optimized.png)

## How does it work?

A component explorer is packaged as a small standalone sandbox that lives alongside your app. [Storybook](https://storybook.js.org/) is the industry-standard component explorer used by Twitter, Slack, Airbnb, Shopify, Stripe, and Microsoft.

#### Primary features

- 🧱 Sandbox for component isolation
- 🔭 State visualizer for component specification and properties
- 📑 Documentation for component discovery and usage guidelines

They allow you to visualize component states during the development process. You can mock hard-to-reach edge cases and record the supported test cases. Then playback those states during QA. And lastly, have a directory of your modular UI that lives alongside your production apps.

#### The process

1. 🔧 Build components in isolation
2. ✉️ Register the component with the explorer
3. 🔬 Specify state and stub data (e.g., use [msw](https://mswjs.io/) to generate a server response for your component or hard-code specific states to test)

<div class="aside">
TODO: component explorer vs app illustration
</div>

## Why build UIs in isolation?

### Fewer bugs

Engineering is prone to bugs. The more components and states you have, the harder it is to confirm that they all render correctly in users' devices and browsers.

![Component test cases](/visual-testing-handbook/component-test-cases.png)

Component explorers prevent inconsistency by showcasing the various states of a component. Highlighting these variations enables developers to focus on each state independently. They can be tested in isolation, and you can use mocking to replicate complicated edge cases.

### Faster development

Apps are never finished. You have to iterate continuously. Therefore, app architecture must be adaptable to accommodate new learning. The component model encourages interchangeability by separating the UI from application business logic and backend.

Component explorers make this separation evident by providing a sandbox to develop UI in isolation, away from the app. That means teams can work on different UI pieces simultaneously without distraction or state pollution from other parts of the app.

### Easier collaboration

UIs are inherently visual. Code-only pull requests are an incomplete representation of the work. To truly unlock collaboration, stakeholders have to look at the UI.

Component explorers visualize UI components and all their variations. That makes it easy to get feedback from designers, product managers, and QA.

<div class="aside">
TODO: add image multiple states (histogram page 16)
</div>

<div class="aside">

**How do component explorers work with readymade UI frameworks?** A component explorer is complementary to UI frameworks like [Material-UI](https://material-ui.com/) and [Ant Design](https://ant.design/). Whereas readymade UIs offer a menu of options for visualizing their components, they do not map back to the user’s state in the system.

For example, a form <code>input</code> might have `disabled`, `error`, and `default` variations in these UI frameworks. When we want to see how they look through the lens of system or user states like `loggedIn` or `loggedOut`, we use a component explorer.

</div>

## Learn the workflow

It's clear that professional engineering teams rely on component explorers to harness UI complexity. But how do visual tests and component explorers actually fit into your frontend development workflow?

The next chapter shows you how to apply the popular Test-Driven Development methodology to UI development.
