---
title: 'Component explorers'
tocTitle: 'Component explorers'
description: 'Your new favorite tool for UI development'
---

UI components make you think reusable, predictable, and modular. They allow you to build apps "bottom-up," starting with atomic components then progressively combining them into pages.

However, as an app grows, teams encounter two challenges:

- 🗄️ An ever-increasing number of components
- 🗜️ More complex components

Modern interfaces support countless permutations of language, device, browser, and UI state. Building components "on-site" of the app screen where it is first used makes it challenging to test all scenarios. What, in theory, is a solid architecture for modern UIs becomes unwieldy in large apps.

Leading teams use component explorers to manage complexity. Fortune 100 companies like [**Walmart**](https://www.walmart.com/), [**eBay**](https://www.ebay.com/), and [**Facebook**](https://www.facebook.com/) can deliver robust UI components for billions of people because they can build and test UI in isolation. Global software consultancies like [**Pivotal**](https://www.pivotalconsults.com/) and [**IBM**](https://www.ibm.com/) use component explorers to create enterprise-grade UIs with confidence.

## Component explorers

A component explorer is packaged as a small standalone sandbox that lives alongside your app. Their primary features:

- 🧱 Sandbox for component isolation
- 🔭 State visualizer for component specification and properties
- 📑 Documentation for component discovery and usage guidelines

They allow you to visualize component states during the development process. You can mock hard-to-reach edge cases and record the supported test cases. Then playback those states during QA. And lastly, have a directory of your modular UI that lives alongside your production apps.

[Storybook](https://storybook.js.org/) is the industry standard and the most widely used component explorer. It's used by teams at Twitter, Slack, Airbnb, Shopify, Stripe, and Microsoft.

But, why build UIs in isolation?

## Robust user interfaces

Engineering is prone to bugs. The more components and states you have, the harder it is to confirm that they all render correctly in users' devices and browsers.

![Component test cases](/visual-testing-handbook/component-test-cases.png)

Component explorers mitigate inconsistency by showcasing the various states of a component. Highlighting these permutations enables developers to focus on each state independently. They can be tested in isolation, and you can use mocking to replicate complicated edge cases.

## Rapid development

Applications are not static. You have to continuously iterate to improve the user experience. Therefore, apps must be easily adaptable to accommodate new learning.

Dissecting UIs into interchangeable components enables rapid development. You can reconfigure pieces as business needs change. The component model encourages interchangeability by separating the state from the UI.

Component explorers make this separation evident by providing a sandbox to develop the interfaces in isolation, away from the app.

The model also allows you to parallelize work. A team of people can work on different UI pieces simultaneously without distraction or state pollution from other parts of the app.

In short: teams get things done faster.

## Collaboration
UI engineering is inherently visual. Code-only pull requests are an incomplete representation of the work. To truly unlock collaboration, user interfaces must be made real.

Visualizing components allows developers to create artifacts that are easy to share with designers, product managers, and QA.

![Relation between components and component explorers](/visual-testing-handbook/component-explorer-diagram-optimized.png)

## How does it work?

1. 🔧 Build components in isolation
2. ✉️ Register the component with the explorer
3. 🔬 Specify state and stub data (e.g., use [msw](https://mswjs.io/) to generate a server response for your component or hard-code specific states to test)

<div class="aside">
TODO: add image multiple states (histogram page 16)
</div>

<div class="aside">

</div>

### How are component explorers different from readymade UI frameworks?

That’s an important and frequently asked question since the early days of component explorers.

Storybook, as other existing component explorers, is complementary to UI frameworks like [Material-UI](https://material-ui.com/) and [Ant Design](https://ant.design/). Whereas readymade UIs offer a menu of options for visualizing their components, they do not map back to the user’s state in the system.

For example, a form <code>input</code> might have `disabled`, `error`, and `default` appearances in these UI frameworks. When we want to see how they look through the lens of system or user states like `loggedIn` or `loggedOut`, we use a component explorer.

## Next up: learn the process

It’s clear that professional software teams increasingly rely on component explorers to harness modern apps’ complexity. But how do visual tests and component explorers fit into your frontend development process? In the next chapter, learn how to tweak the popular Test-Driven Development methodology to build UIs.
