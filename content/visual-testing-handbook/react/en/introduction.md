---
title: 'Introduction to visual testing'
tocTitle: 'Introduction'
description: 'The pragmatic way to test user interfaces'
---

<div class="aside">
This handbook is made for <b>professional developers</b> learning how to implement visual testing in their workflows. Intermediate experience in JavaScript and React is recommended. You should also know Storybook basics, such as writing a story and editing config files (<a href="/intro-to-storybook">Intro to Storybook</a> teaches basics).
</div>

<br/>

User interfaces are subjective. The answer to "does this look right?" depends on your browser, device, and personal taste. You still have to eyeball the rendered UI to verify its appearance.

But apps are now more expansive than ever. It's unrealistic to **manually** check the entire UI whenever you make a change. Different approaches like unit, snapshot, and end-to-end testing attempt to **automate** visual verification. They often fail because it's tough for machines to determine UI correctness from sequences of HTML tags and CSS classes.

This handbook introduces visual testing, a hybrid approach that combines the accuracy of the human eye with the efficiency of machines. Instead of removing people from the testing equation, let's use tools to focus their effort on the specific UI changes that require attention.

## Why unit tests don't work for UIs

To grasp visual testing, it makes sense to start at unit testing. Modern UIs are [component-driven](https://componentdriven.org/) – they're composed of modular pieces. The component construct allows you to render UI as a function of props and state. That means you can unit test components much like any other function.

A unit test isolates a module and then verifies its behaviour. It supplies inputs (props, state, etc.) and compares the output to an expected result. Unit tests are desirable because testing modules in isolation makes it easier to cover edge cases and pinpoint the source of failures.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/unit-testing-optimized.mp4"
    type="video/mp4"/>
</video>

### The problem

The core issue is that much of a UI component's inherent complexity is visual — the specifics of how generated HTML and CSS appear when it reaches the user's screen.

Unit tests are perfect for evaluating concrete outputs: `2 + 2 === 4`. But it's tough to discern which details of HTML and CSS are impact the appearance and how. For example, HTML changes don't always affect the UI.

The complexity of unit testing UIs leads to a lack of UI tests, which leads to resultant regressions as UIs evolve. It's not surprising to see visual bugs in loading states and edge cases, even in production.

### What about snapshot tests?

Another approach to verifying UI appearance is [snapshot testing](https://reactjs.org/docs/testing-recipes.html#snapshot-testing). This is where the test framework saves the rendered HTML of a component as a baseline. Then each subsequent change must be explicitly committed by the developer.

The intention is to allow developers to confirm UI changes fast. In practice, DOM snapshots are slow to skim because it's tricky to spot the salient details of UI by looking at an HTML blob.

![Minified component code](/visual-testing-handbook/code-visual-testing-optimized.png)

Snapshot tests suffer from the same brittleness as other automated UI tests. Any changes to the internal workings of a component require the test to be updated, regardless of whether the component's rendered output changed.

> Snapshot testing entails an admission of defeat in capturing the essential details of a component: instead we capture them all.

## Visual testing

Visual tests are designed to catch changes in UI appearance. You use a component explorer (Storybook) to isolate UI components, mock their variations, and save the supported test cases as "stories".

During development, “run” a quick manual test of a component by rendering it in a browser to see how it looks. Confirm the variations of your component by toggling through each test case listed in the component explorer.

![Storybook toggle button](/visual-testing-handbook/storybook-toggle-stories-optimized.png)

In QA, use automation to catch regressions and maintain UI quality. Tools like [Chromatic](https://www.chromatic.com/) capture a screenshot of each test case, complete with markup, styling, and other assets, in a consistent browser environment.

Each commit, new screenshots are automatically compared to previously accepted baseline screenshots. When the machine detects visual differences, the developer gets notified to approve the intentional change or fix the accidental bug.

![Visual testing components](/visual-testing-handbook/component-visual-testing.gif)

#### That sounds like a lot of work...

That may sound laborious, but typically it ends up being easier than sifting through false positives from automated tests, updating test cases to match up with minor UI changes, and working overtime to make tests pass again.

## Next up: learn the tools

Now that we have a sense of what visual testing is, let’s check out the main tool you need to enable it: a component explorer.

In the next chapter, we’ll see how component explorers help developers build and test components.
