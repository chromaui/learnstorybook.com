---
title: 'UI context engineering'
tocTitle: 'UI context engineering'
description: 'Understand how different types of context support agentic workflows'
---

A context-aware agent is only as good as the content it has access to. Through hundreds of evals across different apps and component libraries, we found that agents benefit from three sources of context: API reference for component libraries, documentation and examples of best practice, and tests to verify the quality of their output.

Storybook ships with first-class features addressing all three of these context needs:

- **Docgen algorithms** expose component APIs to agents more efficiently than any code exploration tool
- **MDX documentation** and stories tell your users how to best use and compose components
- **Stories act as tests** for agent to verify how its code renders, whether it's accessible, etc.

Storybook's approach is fundamentally different to `AGENTS.md` or `DESIGN.md` files. As the human who needs to maintain all this agent context, you can also Storybook to visualize, inspect and improve your documentation, API reference and stories. And the effort you spend writing context for agents also pays back in the form of documentation for humans.

## Docgen

The first building block of UI context is component APIs. Even for well-known libraries like Base UI, agents need access to an up-to-date API to correctly use components. Agents usually verify API by reading source files, wasting input tokens.

Storybook parses your component library using state-of-the-art docgen algorithms, and extracts API information in a compact form. The Storybook skills, MCP and UI all use that information to show component props, descriptions and types to agents and humans alike. All supported frameworks in Storybook have docgen.

### Performance benefits of docgen

How does Storybook's docgen compare to direct codebase exploration?

#### Component discovery

Docgen is exposed via the `docs-show` MCP tool. When requesting component APIs, agents often first call `docs-list` to identify available components, incurring an initial cost. That cost is offset as early as the first or second `docs-show` query compared to codebase exploration. The more components you fetch, the more money and time is saved by using docgen through the Storybook MCP.

This effect is easily explained. Codebase exploration loads entire files (and, sometimes, subcomponents or referenced types from other files), even though component types (the useful part of the file) often fit in a few dozen lines of code.

<figure>
  <img src="/ai-ready-design-systems/10-random-components.svg" alt="Graph showing the Storybook MCP is cheaper, consumes less input and less output than direct codebase exploration as soon as two or more components are fetched. The MCP is 52% cheaper and 36% faster for 10 components.">
  <figcaption>Performance of fetching 10 random components through codebase exploration vs the Storybook MCP.</figcaption>
</figure>

#### End to end workflows

We confirmed the benefits of docgen for agents in a broader evaluation of Storybook MCP against [Mealdrop](https://mealdrop.vercel.app/), a food delivery app, using the [Droppy Design System](https://github.com/storybookjs/droppy-ds). We tested six UI creation and bug fixing workflows on Mealdrop, using various combinations of Storybook content and comparing to workflows without Storybook MCP.

<div class="TODO">LINK: See Chapter XXXXXXXXXXXXXXXXXX for more details on our eval methodology.</div>
<div class="TODO">Harmonise wording: workflows VS prompts</div>
<div class="TODO">Harmonise wording: UI generation VS UI creation</div>

We found docgen contributes to reducing the cost of agentic workflows by an average of 8.8% (p = 0.011) regardless of the amount of accompanying documentation and stories. The effect is stronger for UI generation prompts than bug fixing prompts, at an average of 12% (p = 0.003).

In one of the prompts we tested, we asked agents to add an entire 'Order history' page to Mealdrop. That prompt involved a lot of component discovery and selection decisions. With only docgen information available, Storybook MCP cut agentic workflow duration by 22% (p = 9×10⁻⁵) and cost by 28% (p = 3×10⁻⁴) compared to the same workflow without MCP.

### Get the best out of docgen

Docgen relies on your components' [TypeScript types](https://www.typescriptlang.org/) and [JSDoc annotations](https://jsdoc.app/) (except for Web Components where it reads your [Custom Elements Manifests](https://custom-elements-manifest.open-wc.org/)). You can improve the quality of agent-available context by typing all your component props, and annotating props with a description.

Storybook has a built-in debugger to help you spot missing types and descriptions. The debugger is enabled by default and available at [`http://localhost:6006/manifests/components.html`](http://localhost:6006/manifests/components.html).

The debugger lets you spot missing component and prop, buggy stories and type extraction errors. You can filter on a specific type of issue to find which components need remediation.

<figure>
  <img src="/ai-ready-design-systems/debugger.png" alt="Screenshot of the component manifest debugger showing the A11yPanel component is missing docgen information, and the AbstractToolbar is missing a story description.">
  <figcaption>Storybook's component manifest debugger</figcaption>
</figure>

## Stories

Every story you've written to document your design system to humans, or test component behavior, is also available via the Storybook MCP and skills.

The `docs-show` tool outputs a component's first three stories alongside docgen, so agents have examples to rely on. When agents want more context, they can call `docs-show-story` to get a specific story.

<figure>
  <img src="/ai-ready-design-systems/story-view.png" alt="Screenshot of the Storybook UI for a given story, alongside the 'docs-show-story' MCP tool output for the same story.">
  <figcaption>Human and agent views of the same story</figcaption>
</figure>

### Agents don't explore every story

Not all stories provide equal value to agents. In our evaluation, across 600 agent runs with a Storybook MCP, agents called `docs-show-story` with only 34 distinct stories, across 285 requests. Across all variations of Storybook content we tested, that's fewer than 7% of all stories.

<figure>
  <img src="/ai-ready-design-systems/story-reach-by-size.svg" alt="TODO">
  <figcaption>Share of stories loaded explicitly, inlined by <code>docs-show</code>, or never loaded for 11 Storybook experimental cases. Numbers are averaged across 50 agent runs.</figcaption>
</figure>

Our data suggests adding more stories does not increase agent performance. But we don't have definitive evidence that it degrades their performance either. You should continue to write stories that cover all aspects of your components that might serve a human being.

### Why agents fetch stories

Given this disparity in story usefulness, what compels an agent to load a specific story? What kind of information was missing? Using Fable 5.2, we data mined agent reasoning for every tool call, and then grouped agent rationales into open clusters.

We found two reasons dominate why agents reach for stories: agents either want examples of how a component is already used (43%), or they want to learn something they could not deduce from docgen (like default HTML attributes, or behaviour). For some tasks, agents also reach for specialist knowledge like ARIA attributes injected on a component, or examples of ARIA labels. In composition-heavy design systems, we expect anatomy and example stories to take a bigger role as they document how components are wired together.

<figure>
  <img src="/ai-ready-design-systems/reason-families.svg" alt="TODO">
  <figcaption>TODO</figcaption>
</figure>

We recommend writing stories that show:

- Examples with real-world or high-quality content, so agents align better with your tone and style
- Ways to use a component e.g. controlled vs uncontrolled state management
- Prop combinations for specific cases e.g. how to make a compact button in a toolbar

### Stories need good names

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

### The other role of stories

Agents do not need hundreds of stories to understand components. A few well crafted stories are enough. But stories are also useful for [UI testing](https://storybook.js.org/tutorials/ui-testing-handbook/) and [visual testing](https://storybook.js.org/tutorials/visual-testing-handbook/).

You can hide a story from the MCP and skills by adding the `!manifest` tag to it. Hidden stories still show up in test runs. As we'll cover in [Chapter 4](./self-healing-loops/), agents use stories to implement a self-healing loop and prevent regressions when making changes to components.

### Requesting feedback

<div class="TODO">Add RFC on story inclusion controls (tag-based inclusion, control default count of 3, etc.) // dynamic story selection based on history of tool calls</div>

## Documentation in Storybook

Last but not least, Storybook can serve documentation to your agents.

- explain what SB can serve (autodocs, custom mdx) and how it's discovered
- state we've found docs can have the highest rate of information to token cost
- reiterate the stories example to show how a well built doc sentence can help agents
- tell readers we'll now review best performing docs content together
