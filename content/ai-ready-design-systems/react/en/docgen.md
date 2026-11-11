---
title: 'Docgen'
tocTitle: 'Docgen'
description: 'Understand how different types of context support agentic workflows'
---

The first building block of UI context is component APIs. Even for well-known libraries like Base UI, agents need access to an up-to-date API to correctly use components. Agents usually verify API by reading source files, wasting input tokens.

Storybook parses your component library using state-of-the-art docgen algorithms, and extracts API information in a compact form. The Storybook skills, MCP and UI all use that information to show component props, descriptions and types to agents and humans alike. All supported frameworks in Storybook have docgen.

## Performance benefits of docgen

How does Storybook's docgen compare to direct codebase exploration?

## Component discovery

Docgen is exposed via the `docs-show` MCP tool. When requesting component APIs, agents often first call `docs-list` to identify available components, incurring an initial cost. That cost is offset as early as the first or second `docs-show` query compared to codebase exploration. The more components you fetch, the more money and time is saved by using docgen through the Storybook MCP.

This effect is easily explained. Codebase exploration loads entire files (and, sometimes, subcomponents or referenced types from other files), even though component types (the useful part of the file) often fit in a few dozen lines of code.

<figure>
  <img src="/ai-ready-design-systems/10-random-components.svg" alt="Graph showing the Storybook MCP is cheaper, consumes less input and less output than direct codebase exploration as soon as two or more components are fetched. The MCP is 52% cheaper and 36% faster for 10 components.">
  <figcaption>Performance of fetching 10 random components through codebase exploration vs the Storybook MCP.</figcaption>
</figure>

## End to end workflows

We confirmed the benefits of docgen for agents in a broader evaluation of Storybook MCP against [Mealdrop](https://mealdrop.vercel.app/), a food delivery app, using the [Droppy Design System](https://github.com/storybookjs/droppy-ds). We tested six UI creation and bug fixing workflows on Mealdrop, using various combinations of Storybook content and comparing to workflows without Storybook MCP.

<div class="TODO">LINK: See Chapter XXXXXXXXXXXXXXXXXX for more details on our eval methodology.</div>
<div class="TODO">Harmonise wording: workflows VS prompts</div>
<div class="TODO">Harmonise wording: UI generation VS UI creation</div>

We found docgen contributes to reducing the cost of agentic workflows by an average of 8.8% (p = 0.011) regardless of the amount of accompanying documentation and stories. The effect is stronger for UI generation prompts than bug fixing prompts, at an average of 12% (p = 0.003).

In one of the prompts we tested, we asked agents to add an entire 'Order history' page to Mealdrop. That prompt involved a lot of component discovery and selection decisions. With only docgen information available, Storybook MCP cut agentic workflow duration by 22% (p = 9×10⁻⁵) and cost by 28% (p = 3×10⁻⁴) compared to the same workflow without MCP.

## Get the best out of docgen

Docgen relies on your components' [TypeScript types](https://www.typescriptlang.org/) and [JSDoc annotations](https://jsdoc.app/) (except for Web Components where it reads your [Custom Elements Manifests](https://custom-elements-manifest.open-wc.org/)). You can improve the quality of agent-available context by typing all your component props, and annotating props with a description.

Storybook has a built-in debugger to help you spot missing types and descriptions. The debugger is enabled by default and available at [`http://localhost:6006/manifests/components.html`](http://localhost:6006/manifests/components.html).

The debugger lets you spot missing component and prop, buggy stories and type extraction errors. You can filter on a specific type of issue to find which components need remediation.

<figure>
  <img src="/ai-ready-design-systems/debugger.png" alt="Screenshot of the component manifest debugger showing the A11yPanel component is missing docgen information, and the AbstractToolbar is missing a story description.">
  <figcaption>Storybook's component manifest debugger</figcaption>
</figure>
