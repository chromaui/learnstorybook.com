---
title: "Architecting systems"
tocTitle: "Architecture"
description: "How to extract a design system from component libraries"
---

In chapter 2, we extract a design system from existing component libraries. Along the way, we determine which components belong in the design system and outline common challenges developers face getting started.

In large companies, this exercise is done in conjunction with design, engineering, and product teams. Chroma (the company behind Storybook) and Storybook share a sprightly frontend infrastructure team that serves nearly 800 open source contributors across 3+ properties, so we’re going to outline the process for you.

## The challenge

If you work on a development team, you’ve probably noticed that bigger teams aren’t very efficient. Miscommunication is rampant as teams grow. Existing UI patterns go undocumented or are lost altogether. That means developers reinvent the wheel instead of building new features. Over time, projects are littered with one-off components.

We slammed into this predicament. Despite the best intentions of an experienced team, UI components were endlessly rebuilt or pasted into place. UI patterns that were supposed to be the same diverged in appearance and functionality. Each component was a unique snowflake which made it impossible for new developers to discern the source of truth, much less contribute.

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## Create a design system

A design system consolidates common UI components in a central well-maintained repository that gets distributed via a package manager. Developers import standardized UI components instead of pasting the same UI code in multiple projects.

Most design systems aren’t built from scratch. Instead, they’re assembled from tried-and-true UI components used across a company which are repackaged as a design system. Our project is no exception. We’ll cherry-pick components from existing production component libraries to save time and deliver our design system to stakeholders faster.

![What's in a design system](/design-systems-for-developers/design-system-contents.jpg)

## Where does the design system live?

You can think of a design system as another component library, but instead of servicing one app, it serves an entire organization. A design system focuses on UI primitives while project-specific component libraries can contain anything from composite components to screens.

As such, our design system must be independent of any project and also a dependency of all projects. Changes propagate throughout the organization via a versioned package distributed by a package manager. Projects can reuse design system components and further customize if needed. These constraints give us the blueprint for organizing our frontend projects.

![Who uses a design system](/design-systems-for-developers/design-system-consumers.jpg)

## Setup our repository with create-react-app and GitHub

React is the most popular view layer according to the [State of JS](https://stateofjs.com/) survey. An overwhelming number of Storybooks use React, so we’re using it in this tutorial along with the popular [create-react-app](https://github.com/facebook/create-react-app) boilerplate.

```
npx create-react-app learnstorybook-design-system
```

<div class="aside">Other valid methods of creating design systems include shipping raw HTML/CSS, using other view layers, compiling components with Svelte, or using web components. Pick what works for your team.</div>

Once create-react-app has created our repository, we can push it to GitHub (which we’ll use to host the code for our design system). Start by signing in and creating a new repository on GitHub.com:

![alt_text](/design-systems-for-developers/Feedback-wanted6.png)

Then use GitHub’s instructions to add the remote to your git repo and pushing (the so-far mostly empty) repo:

```
cd learnstorybook-design-system
git remote add origin https://github.com/chromaui/learnstorybook-design-system.git
git push -u origin master
```

Be sure to replace `chromaui` with your own account name.

![alt_text](/design-systems-for-developers/Feedback-wanted7.png)

## What belongs and what doesn’t

Design systems should only contain pure and [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). These components deal with how UI appears. They respond exclusively to props, do not contain app-specific business logic, and are agnostic to how data loads. These properties are essential in allowing the component to be reusable.

Design systems aren’t the superset of every component library in an organization. That would be a headache to keep track of.

App-specific components that contain business logic should not be included because that hamstrings reuse by requiring consumer projects to have identical business constraints.

Omit one-offs that aren’t currently being reused. Even if you hope they become part of the design system one day, nimble teams avoid maintaining excess code when possible.

## Create an inventory

The first task is creating an inventory of your components to identify the most used. This often involves manually cataloging screens in various web sites or apps to discern common UI patterns. Designers like [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/) and [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517) have published handy methodologies for inventorying components so we won’t go into further detail in this tutorial.

Useful heuristics for developers:

- If a UI pattern is used more than three times, turn it into a reusable UI component.
- If a UI component is used in 3 or more projects/teams, put it in your design system.

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

Following this method, we end up with UI primitives: Avatar, Badge, Button, Checkbox, Input, Radio, Select, Textarea, Highlight (for code), Icon, Link, Tooltip, and more. These building blocks are configured in different ways to assemble countless unique features and layouts in our client apps.

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

Add the components we found by downloading them to your computer and dropping them into your repository, as well as removing the application files that Create React App provided:

```
rm -rf src/*

svn export [https://github.com/chromaui/learnstorybook-design-system/branches/download-1(https://github.com/chromaui/learnstorybook-design-system/branches/download-1/src)</h6>

```

<div class="aside">
<p>We’ve used `svn` (Subversion) to easily download a folder of files from GitHub. If you don’t have subversion installed or want to just do it manually, you can grab the folders directly <a href="https://github.com/chromaui/learnstorybook-design-system/tree/download-1/src">here</a></p>

<p>
For the code sample, we’ve selected a subset of these components to make reasoning about the repository simpler. Some teams also include customized third-party components in their design systems for other components like Tables and Forms.</p></div>

We’ll also need to update dependencies that our components rely on.

```
yarn add prop-types styled-components polished
```

<div class="aside">CSS-in-JS: We use <a href="https://www.styled-components.com">styled-components</a>, a library that allows us to scope styling to the component. There are other valid methods to style components including targeting classes manually, CSS modules, etc.</div>

In addition to UI components, it makes sense to include styling constants for typography, colors, spacing, etc that are reused across projects. In design system nomenclature global style variables are called “design tokens”. We won’t dive into the theory behind design tokens in this guide, but you can learn more online (here’s a [good article](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)).

Download our design tokens here and add them to your repository.

```
# Or download from https://github.com/chromaui/learnstorybook-design-system/tree/download-1/src/shared

# and place in the src/shared folder

svn export [https://github.com/chromaui/learnstorybook-design-system/branches/download-1(https://github.com/chromaui/learnstorybook-design-system/branches/download-1/src)/shared src/shared</h6>

```

## Let’s start developing

We’ve defined what to build and how it fits together, it’s time to get to work. In chapter 3 we’ll scaffold the fundamental tooling for design systems. Our raw directory of UI components will be cataloged and viewable with help from Storybook.
