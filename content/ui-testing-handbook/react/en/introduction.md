---
title: 'Introduction to testing UIs'
tocTitle: 'Introduction'
description: 'Latest production-ready techniques used by leading engineering teams'
commit: 'e3c72c0'
---

<div class="aside">This guide is made for <b>professional developers</b> learning how to test UI components. Intermediate experience in JavaScript and React is recommended. You should also know Storybook basics, such as writing a story and editing config files (<a href="/intro-to-storybook">Intro to Storybook</a> covers all the basics).
</div>

<br/>

Testing UIs is awkward. Users expect frequent releases packed with features. But every new feature introduces more UI and new states that you then have to test. Every testing tool promises “easy, not flaky, fast”, but has trade-offs in the fine print.

How do leading front-end teams keep up? What's their testing strategy, and what methods do they use? I researched ten teams from the Storybook community to learn what works — Twilio, Adobe, Peloton, Shopify and more.

This post highlights UI testing techniques used by scaled engineering teams. That way, you can create a pragmatic testing strategy that balances coverage, setup, and maintenance. Along the way, we'll point out pitfalls to avoid.

## What are we testing?

All major JavaScript frameworks are component-driven. That means UIs are built from the “bottom-up”, starting with atomic components and progressively composed into pages.

Remember, every piece of UI is now a component. Yup, that includes pages. The only difference between a page and a button is how they consume data.

Therefore, testing UI is now synonymous with testing components.

![Component hierarchy: atomic, compositions, Pages and Apps](/ui-testing-handbook/component-testing.gif)

When it comes to components, the distinction between different testing methods can be blurry. Instead of focusing on terminology, let’s consider what characteristics of UIs warrant testing.

1. **Visual:** does a component render correctly given a set of props or state?
2. **Composition:** do multiple components work together?
3. **Interaction:** are events handled as intended?
4. **Accessibility:** is the UI accessible?
5. **User flows:** do complex interactions across various components work?

Next, we'll cover the criteria for evaluating each testing method and see how teams design their test strategy.
