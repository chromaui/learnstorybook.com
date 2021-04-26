---
title: 'Component explorers'
tocTitle: 'Component explorers'
description: 'A tool for UI development and visual testing'
---

Modern UIs support countless permutations of state, language, device, browser, and user data. It's cumbersome to navigate to a page, then click around to get it in the right state, just to work on a component.

**Component explorers isolate UI concerns from business logic and app context.** First, you build UI components in isolation to focus on each component's supported permutations. That allows you to gauge how inputs (props, state) affect the rendered UI. After the component is complete, you integrate it into the app.

Isolation is a fundamental requirement of visual testing today's componentized UIs. Let's see why.

![Relation between components and component explorers](/visual-testing-handbook/component-explorer-diagram-optimized.png)

## Why build UIs in isolation?

### Fewer bugs

The more components and states you have, the harder it is to confirm that they all render correctly in users' devices and browsers.

Component explorers prevent inconsistency by showcasing the supported variations of a component. That enables developers to focus on each state independently. They can be tested in isolation, and you can use mocking to replicate complicated edge cases.

![Component test cases](/visual-testing-handbook/component-test-cases.png)

### Faster development

Apps are never finished. You continuously iterate. Therefore, UI architecture must be adaptable to accommodate new features. The component model encourages interchangeability by separating the UI from application business logic and backend.

Component explorers make this separation evident by providing a sandbox to develop UI in isolation, away from the app. That means teams can work on different UI pieces simultaneously without distraction or state pollution from other parts of the app.

### Easier collaboration

UIs are inherently visual. Code-only pull requests are an incomplete representation of the work. To truly unlock collaboration, stakeholders have to look at the UI.

Component explorers visualize UI components and all their variations. That makes it easy to get feedback on "does this look right?" from developers, designers, product managers, and QA.

<div class="aside">
TODO: component explorer vs app illustration
</div>

## How do component explorers work?

A component explorer is packaged as a small standalone sandbox that lives alongside your app. [Storybook](https://storybook.js.org/) is the industry-standard component explorer used by Twitter, Slack, Airbnb, Shopify, Stripe, and Microsoft.

#### Primary features

- 🧱 Sandbox for component isolation
- 🔭 Variation visualizer for component specification and properties
- 📑 Documentation for component discovery and usage guidelines

Storybook allows you to visualize component variations during the development process. You can mock hard-to-reach cases and save them as "stories" to revisit during QA.

> A story is a test case. Stories are a test suite.

<div class="aside">
TODO: add image multiple states (histogram page 16)
</div>

<br/>

<div class="aside">

**How do component explorers work with readymade UI frameworks?** A component explorer is complementary to UI frameworks like [Material-UI](https://material-ui.com/) and [Ant Design](https://ant.design/). Whereas readymade UIs offer a menu of options for visualizing their components, they do not map back to the user’s state in the system.

For example, a form <code>input</code> might have `disabled`, `error`, and `default` variations in these UI frameworks. When we want to see how they look through the lens of system or user states like `loggedIn` or `loggedOut`, we use a component explorer.

</div>

## Learn the workflow

Teams at Peloton, Twilio, and Salesforce rely on Storybook to visual test. The next chapter shows you how to apply the popular Test-Driven Development methodology to UI development.
