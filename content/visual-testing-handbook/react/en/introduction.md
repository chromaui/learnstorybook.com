---
title: 'Introduction to visual testing'
tocTitle: 'Introduction'
description: 'The pragmatic way to test user interfaces'
---

User interfaces are subjective. The answer to "does this look right?" depends on your browser, device, and personal taste. You still have to look at the rendered UI to verify its appearance.

But it takes forever to manually check the whole UI each commit. Different approaches like unit and snapshot testing attempt to automate visual verification. They often fail because it's tough for machines to determine UI correctness from sequences of HTML tags and CSS classes.

How do teams actually prevent UI bugs? Are janky UIs inevitable? We researched teams whose UIs impact millions of people like Microsoft, BBC, and Shopify to figure out what works.

This handbook introduces visual testing, a pragmatic approach that combines the accuracy of the human eye with the efficiency of machines. Instead of removing people from the testing equation, visual testing uses tools to focus their effort on the specific UI changes that require attention.

## Unit tests don't have eyes

To grasp visual testing, it makes sense to start with unit testing. Modern UIs are [component-driven](https://componentdriven.org/) – they're composed of modular pieces. The component construct allows you to render UI as a function of props and state. That means you can unit test components much like any other function.

A unit test isolates a module and then verifies its behaviour. It supplies inputs (props, state, etc.) and compares the output to an expected result. Unit tests are desirable because testing modules in isolation makes it easier to cover edge cases and pinpoint the source of failures.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/component-unit-testing.mp4"
    type="video/mp4"/>
</video>

The core issue is that much of a UIs inherent complexity is visual — the specifics of how generated HTML and CSS render on the user's screen.

Unit tests are perfect for evaluating concrete outputs: `2 + 2 === 4`. But they're not great for UI because it's tough to discern which details of HTML or CSS impact appearance and how. For example, HTML changes don't always affect the UI look and feel.

## What about snapshot tests?

[Snapshot tests](https://reactjs.org/docs/testing-recipes.html#snapshot-testing) provide an alternate approach to verifying UI appearance. This is where the test framework saves the generated DOM of a component as a "baseline". Subsequent changes compare the new DOM to the baseline. If there are differences, the developer must explicitly update the baseline.

![Minified component code](/visual-testing-handbook/code-visual-testing-optimized.png)

In practice, DOM snapshots are awkward because it's tricky to determine how a UI renders by evaluating an HTML blob.

Snapshot tests suffer from the same brittleness as other automated UI tests. Any changes to the internal workings of a component require the test to be updated, regardless of whether the component's rendered output changed.

## Visual testing is made for UIs

Visual tests are designed to catch changes in UI appearance. You use a component explorer like Storybook to isolate UI components, mock their variations, and save the supported test cases as "stories".

During development, “run” a quick manual test of a component by rendering it in a browser to see how it looks. Confirm the variations of your component by toggling through each test case listed in the component explorer.

![Storybook toggle button](/visual-testing-handbook/storybook-toggle-stories-optimized.png)

In QA, use automation to detect regressions and enforce UI consistency. Tools like [Chromatic](https://www.chromatic.com/) capture an image snapshot of each test case, complete with markup, styling, and other assets, in a consistent browser environment.

Each commit, new image snapshots are automatically compared to previously accepted baseline snapshots. When the machine detects visual differences, the developer gets notified to approve the intentional change or fix the accidental bug.

![Visual testing components](/visual-testing-handbook/component-visual-testing.gif)

#### That sounds like a lot of work...

That may sound laborious, but it ends up being easier than sifting through false positives from automated tests, updating test cases to match up with minor UI changes, and working overtime to make tests pass again.

## Learn the tools

Now that we have a sense of visual testing, let’s check out the main tool you need to enable it: a component explorer. In the next chapter, we’ll see how component explorers help developers build and test components.
