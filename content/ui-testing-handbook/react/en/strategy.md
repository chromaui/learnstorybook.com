---
title: 'How teams design their test strategy'
tocTitle: 'Testing strategy'
description: 'Where should you focus your effort?'
commit: 'e3c72c0'
---

A comprehensive UI testing strategy balances effort and value. But there are so many ways to test that it can be overwhelming to figure out what’s right for any given situation. That’s why many teams evaluate different testing techniques using the criteria below.

- 💰 **Maintenance cost:** time and effort required to write and maintain the tests.
- ⏱️ **Iteration speed:** how fast is the feedback loop between making a change and seeing the result.
- 🖼 **Realistic environment:** where the tests are executed—in a real browser or a simulated environment like JSDOM.
- 🔍 **Isolate failures:** a test fails, how quickly can you identify the source of the failure.
- 🤒 **Test Flake:** false positives/negatives defeat the purpose of testing.

For example, end-to-end testing simulates “real” user flows but isn’t practical to apply everywhere. The key advantage of testing in a web browser is also a disadvantage. Tests take longer to run, and there are more points of failure (flake!).

With those criteria in mind, let's look at how teams design their test strategy. We'll get a high-level overview of the different testing methods and their trade-offs.

### 1. Visual testing

Visual tests to capture a screenshot of every UI component, complete with markup, styling, and other assets, in a consistent browser environment. That way, they’re testing what the user actually sees.

Each commit, new screenshots are automatically compared to previously accepted baseline screenshots. When the machine detects visual differences, the developer gets notified to approve the intentional change or fix the accidental bug.

#### Is it worth it?

Always. Visual tests are high value for low effort. They require minimal effort to maintain, are executed in real browsers, and have low flake.

### 2. Composition testing

You can also run visual tests on higher-level components to verify integration all the way up to pages. To do so, you have to start by isolating composite components in Storybook. These components often rely on data, state and events, which can be mocked using Storybook addons.

#### Is it worth it?

Often. These tests require some investment, but they surface non-obvious integration issues that are hard to track down otherwise.

### 3. Interaction testing

Interaction tests verify the functional qualities of a component. You start by rendering the component in isolation. Then simulate user behaviour such as click or input. Finally, verify whether the state updated correctly.

#### Is it worth it?

Sometimes. Interaction tests ensure that the connection between the components is working. Events are flowing, and the state is being updated. In practice, this means you get moderate coverage by writing relatively low maintenance tests.

### 4. Accessibility testing

Accessibility is the practice of making websites usable to all people. This means building UIs that support keyboard & screen reader navigation, high colour contrast, reduced motion, etc.

The most accurate way to test accessibility is to manually check it across a combination of browsers, devices, and screen readers. But that's impractical to do by hand because apps have dozens of components and have frequent UI updates. A more pragmatic approach is to combine manual and automated testing.

As the first line of QA, use automated tools to catch blatant accessibility violations. They work by auditing the rendered DOM against a set of best-practice heuristics. After those checks are complete, manually spot-check the UI to find subtle issues.

#### Is it worth it?

Always. Not only is it great for your users, it's also a legal requirement. Axe is a low investment tool. Using it doesn't automatically make your app accessible, but it catches lots of issues early.

### 5. User flow testing

Even the most basic task requires a user to complete a sequence of steps across multiple components. This is yet another potential point of failure. Tools like Cypress and Playwright allow you to run end-to-end (E2E) tests against the complete application to verify such interactions.

#### Is it worth it?

Sparingly. E2E tests require a significant trade-off. They offer a high level of confidence but take time/effort to spin up and test the entire system. Therefore, limit E2E tests to just the critical user flows, e.g., sign up → add to cart → buy.

## Your UI testing strategy

UI testing is integral to delivering high-quality experiences. It can be confusing to figure out a pragmatic testing strategy because an application’s surface area is expansive, and there are plenty of ways to test it.

You end up balancing trade-offs. Some tests are easy to maintain but offer false assurance. Others evaluate the system as a whole but are slow.

After interviewing ten teams to determine which UI testing methods actually worked, I compiled a shortlist of tools they recommend.

- 📚 [Storybook](http://storybook.js.org/) for isolating components from their context to simplify testing.
- ✅ [Chromatic](https://www.chromatic.com/) to catch visual bugs in atomic components and verify component composition/integration.
- 🐙 [Testing Library](https://testing-library.com/) to verify interactions and underlying logic.
- ♿️ [Axe](https://www.deque.com/axe/) to audit accessibility
- 🔄 [Cypress](https://www.cypress.io/) to verify user flows across multiple components
- 🚥 [GitHub Actions](https://github.com/features/actions) for continuous integration

The table below summarizes each UI testing method’s pros and cons and how often it’s used.

![How to evaluate different testing methods](/ui-testing-handbook/evaluate-different-testing-methods.png)

## Let's get testing

So far, we've just scratched the surface of UI testing. In upcoming chapters, we'll dig deeper into each layer of the test stack and get into the mechanics of how to implement this testing strategy. But first, we’re going to need something to test. I’ll be using the Taskbox app as an example. It’s a task management app similar to Asana.

![](/ui-testing-handbook/taskbox.png)

To grab the code, run the following commands:

```sh
# Clone the template
npx degit chromaui/ui-testing-guide-code taskbox

cd taskbox

# Install dependencies
yarn
```

Note, the implementation details aren’t important since we’re focusing more on how to test this UI. We use React here, but rest assured, these testing concepts extend to all component-based frameworks.
