---
title: 'Component explorers'
tocTitle: 'Component explorers'
description: 'Your new favorite tool for UI development'
---

UI components make you think reusable, predictable, and modular. It may be true for small apps where you can easily recall each component from memory. As an app grows, teams encounter two challenges:

- 🗄️ The proliferation of components
- 🗜️ Increased component complexity

What is, in theory, a solid architecture for building modern UIs becomes unwieldy in large apps.

How can frontend engineers ensure their modular UI adapts to evolving requirements and increasing scope? Let’s see how component explorers are crucial to frontend professionals for taming the process of building and testing modern apps.

![Industrial Revolution Factory floor](/visual-testing-handbook/factory-floor-optimized.jpg)

## Modularization

Two hundred years ago, pioneers of the industrial revolution built complex machines and streamlined manufacturing to make goods and services more accessible.

Less than a decade ago, our friends in DevOps landed on microservice architecture to create modular distributed systems. Today’s frontend engineers seek to build modular UIs to assemble more powerful and complex apps.

The recent adoption of the frontend patterns below has finally enabled frontend engineers to make headway on building web app interfaces in a modular way.

- 📐 **Standardized components:** Idioms established by popular frameworks like React, Angular, and Vue lead to consistency between components.
- ⚛️ **Page-agnostic components:** Components designed to live in isolation from their intended setting and data context
- 🛠 **State-based view layers** (i.e., declarative templating): The separation of UI state, the underlying logical situation of what the user can see, from the layout (DOM)

## Component explorers

Component explorers help engineers build modular UIs by visualizing components to be constructed to isolate an app’s business logic and layout. They allow you to simulate component states during the building process and playback those states during testing. Consider a component explorer, a dictionary for your modular UI that lives alongside your production apps.

Companies of all sizes and shapes use component explorers. Fortune 100 companies like [**Walmart**](https://www.walmart.com/), [**eBay**](https://www.ebay.com/), and [**Facebook**](https://www.facebook.com/) can deliver robust UI components for billions of people because they can build and test UI in isolation. Global software consultancies like [**Pivotal**](https://www.pivotalconsults.com/) and [**IBM**](https://www.ibm.com/) use component explorers to create enterprise-grade UIs with confidence.

Adopting a component explorer is not only for large teams, though, but there is also an immense utility and low overhead whether you’re one developer or one thousand.

<div class="aside">
 TODO: add missing image (page 13) test states histogram
</div>

### Robust user interfaces

Engineering is prone to bugs. The essential complexity in building apps is inescapable. Component explorers seek to mitigate inconsistency by showcasing the many states of components.

Highlighting the various permutations enables developers to build each state independently. All component states can be tested in isolation and complicated ones to replicate, mocked (e.g., `loading`).

Toggling between permutations helps engineers visually verify what to expect and fine-tune the interactions or animations between states. Just as machine tools like lathes help build mechanical parts, a component explorer is necessary for building interfaces.

### Rapid development

As Fred Brooks wrote in [Mythical Man Month](https://en.wikipedia.org/wiki/The_Mythical_Man-Month), “... our ideas are faulty, we have bugs”. The first product release cannot be the last because the subsequent iterations are needed to iron out the bugs in our thinking and code.

> "Our ideas are faulty, we have bugs."

Since ideas are prone to bugs, apps must be easily adaptable to accommodate new learning. Dissecting UIs into interchangeable components enables rapid reconfiguration of the pieces as business needs change. The component model encourages interchangeability by isolating component state from business logic.

A component explorer makes this separation evident by providing a sandbox to develop the UI component in isolation of the app.

The model also allows for parallel production where a team of people can work on different UI pieces simultaneously without distraction or state pollution from other parts of the app. By combining interchangeability and distributed production component explorers contribute to rapid product development. In short: teams get things done faster.

<div class="aside">
TODO: add image of component explorer (Storybook) (page 14)
</div>

### Collaborative

UI engineering is inherently visual. Code-only pull requests are an incomplete representation of the work. To truly unlock collaboration, user interfaces must be made real. Visualizing components allows developers to create artifacts that are easy to share with designers, product, and QA.

![Relation between components and component explorers](/visual-testing-handbook/component-explorer-diagram-optimized.png)

## How does it work?

A component explorer is packaged as a small development-only standalone app that lives alongside your app. Installing one is as easy as running a command to add a dependency in our project.

### Primary features

- 🧱 Sandbox for isolated component development
- 🔭 State visualizer for component discovery and specification

### Process

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
