---
title: 'Stories for agents'
tocTitle: 'Stories for agents'
description: 'Discover how agents consume stories, and learn what stories work best for them'
---

Every story you've written to document your design system to humans, or test component behavior, is also available via the Storybook MCP and skills.

<figure>
  <img src="/ai-ready-design-systems/story-view.png" alt="Screenshot of the Storybook UI for a given story, alongside the 'docs-show-story' MCP tool output for the same story.">
  <figcaption>Human and agent views of the same story</figcaption>
</figure>

The `docs-show` tool outputs a component's first three stories alongside docgen, so agents have examples to rely on. When agents want more context, they can call `docs-show-story` to get a specific story. We have a [RFC open](https://github.com/storybookjs/storybook/discussions/37343) on how to configure the stories included in `docs-show` in the future.

## Agents don't explore every story

Not all stories provide equal value to agents. In our evaluation, across 600 agent runs with a Storybook MCP, agents called `docs-show-story` with only 34 distinct stories, across 285 requests. Across all variations of Storybook content we tested, that's fewer than 7% of all stories.

<figure>
  <img src="/ai-ready-design-systems/story-reach-by-size.svg" alt="TODO">
  <figcaption>Share of stories loaded explicitly, inlined by <code>docs-show</code>, or never loaded for 11 Storybook experimental cases. Numbers are averaged across 50 agent runs.</figcaption>
</figure>

Our data suggests adding more stories does not increase agent performance. But we don't have definitive evidence that it degrades their performance either. You should continue to write stories that cover all aspects of your components that might serve a human being.

## Why agents fetch stories

Given this disparity in story usefulness, what compels an agent to load a specific story? What kind of information was missing? Using Fable 5.2, we data mined agent reasoning for every tool call, and then grouped agent rationales into open clusters.

We found two reasons dominate why agents reach for stories: agents either want examples of how a component is already used (43%), or they want to learn something they could not deduce from docgen (like default HTML attributes, or behaviour). For some tasks, agents also reach for specialist knowledge like ARIA attributes injected on a component, or examples of ARIA labels. In composition-heavy design systems, we expect anatomy and example stories to take a bigger role as they document how components are wired together.

<figure>
  <img src="/ai-ready-design-systems/reason-families.svg" alt="TODO">
  <figcaption>Reasons why agents load an individual story.</figcaption>
</figure>

We recommend writing stories, by order of importance that show:

- Examples with real-world or high-quality content, so agents align better with existing UI
- "Component state" stories that teach agents the HTML structure of a component
- Ways to use a component correctly, e.g.
  - controlled vs uncontrolled state management for stateful components
  - component wiring stories for composition-heavy design systems

In experiments we ran with very rich MDX documentation, we noticed some types of stories stopped being queried by agents. Agents were content in relying only on documentation for component anatomy and accessibility expectations. But they kept looking for example stories and undocumented behaviours and attributes.

## Stories need good names

Most of the time, agents operated on very little knowledge when deciding to load a story. 61% of decisions to load a story relied on its name alone.

<figure>
  <img src="/ai-ready-design-systems/what-agent-had-seen.svg" alt="Graph showing agents fetch stories based on their name alone 61% of the time, based on name and a short description 31% of the time, based on previously seen story content 7% of the time and based on name guesses 1% of the time.">
  <figcaption>How much information agents had before deciding to fetch a story</figcaption>
</figure>

We recommend choosing story names that reflect the unique information that a story provides. Agents should be able to infer, from story names alone, what they are about:

- Usage examples or content showcases
- Component states (default, disabled, hovered, focused, empty, errored out, loading, etc.)
- Special topics like accessibility, animation or performance
- Tests (and what is asserted in the test)

## The other role of stories

Agents do not need hundreds of stories to understand components. A few well crafted stories are enough. But stories are also useful for [UI testing](https://storybook.js.org/tutorials/ui-testing-handbook/) and [visual testing](https://storybook.js.org/tutorials/visual-testing-handbook/).

You can hide a story from the MCP and skills by adding the `!manifest` tag to it. Hidden stories still show up in test runs. As we'll cover in [Chapter 5](./self-healing-loops/), agents use stories to implement a self-healing loop and prevent regressions when making changes to components.
