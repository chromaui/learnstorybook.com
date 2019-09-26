---
title: "Introduction to design systems"
tocTitle: "Introduction"
description: "A guide to the latest production-ready tools for design systems"
---

Design systems are exploding in popularity. From tech heavyweights like Airbnb to nimble startups, organizations of every shape are reusing successful UI patterns to save time and money. But there’s a chasm between the design systems created by Airbnb, Uber, or Microsoft and the design systems created by most developers.

Why do leading design systems teams use the tools and techniques they use? My co-author Tom and I researched the traits of successful design systems from the Storybook community to identify best practices.

This step-by-step guide reveals the automated tooling and careful workflows used in scaled production design systems. We’ll walk through assembling a design system from existing component libraries, then set up core services, libraries, and workflows.

<div class="aside">This guide is made for <b>professional developers</b> learning how to build design systems. Intermediate experience in JavaScript, Git, and continuous integration is recommended. You should also know Storybook basics, such as writing a story and editing config files (<a href="/intro-to-storybook">Intro to Storybook</a> teaches basics).</div>

## What’s all the fuss about design systems anyways?

Let’s get something out of the way: the concept of a reusable user interface isn’t new. Styleguides, UI kits, and shareable widgets have existed for decades. Today, designers and developers are aligning towards the UI component construct. A UI component encapsulates the visual and functional properties of discrete user interface pieces. Think LEGOs.

Modern user interfaces are assembled from hundreds of modular UI components that are rearranged to deliver different user experiences.

Design systems contain reusable UI components that help teams build complex, durable, and accessible user interfaces across projects. Since both designers and developers contribute to the UI components, the design system serves as a bridge between disciplines. It is also the “source of truth” for an organization’s common components.

![Design systems bridge design and development](/design-systems-for-developers/design-system-context.jpg)

Designers often talk about building design systems inside their tools. The holistic scope of a design system encompasses assets (Sketch, Figma, etc.), overarching design principles, contribution structure, governance, and more. There’s an abundance of designer-oriented guides that dive deep into these topics so we won’t rehash that here.

For developers, a few things are certain, production design systems must include the UI components and the frontend infrastructure behind it all. There are three technical parts to a design system that we’ll talk about in this guide:

- 🏗 Common reusable UI components
- 🎨 Design tokens: Styling-specific variables such as brand colors and spacing
- 📕 Documentation site: Usage instructions, narrative, do’s and don'ts

The parts are packaged up, versioned, and distributed to consumer apps via a package manager.

## Do you need a design system?

Despite the hype, a design system isn’t a silver bullet. If you work with a modest team on a single app, you’re better off with a directory of UI components instead of setting up the infrastructure to enable a design system. For small projects, the cost of maintenance, integration, and tooling far outweighs any productivity benefits you might see.

The economy of scale in a design system works in your favor when sharing UI components across many projects. If you find yourself pasting the same UI components in different apps or across teams, this guide is for you.

## What we’re building

Storybook powers the design systems for [Uber](https://github.com/uber-web/baseui), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/), and hundreds more companies. The recommendations here are inspired by best practices and tools from the smartest teams. We’ll be building the following frontend stack:

#### Build components

- 📚 [Storybook](http://storybook.js.org) for UI component development and auto-generated docs
- ⚛️ [React](https://reactjs.org/) for declarative component-centric UI (via create-react-app)
- 💅 [Styled-components](https://www.styled-components.com/) for component-scoped styling
- ✨ [Prettier](https://prettier.io/) for automatic code formatting

#### Maintain the system

- 🚥 [CircleCI](https://circleci.com/) for continuous integration
- 📐 [ESLint](https://eslint.org/) for JavaScript linting
- ✅ [Chromatic](https://chromaticqa.com) to catch visual bugs in components (by Storybook maintainers)
- 🃏 [Jest](https://jestjs.io/) for unit testing components
- 📦 [npm](https://npmjs.com) for distributing the library
- 🛠 [Auto](https://github.com/intuit/auto) for release management workflow

#### Storybook addons

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) to check for accessibility issues during development
- 💥 [Actions](https://github.com/storybookjs/storybook/tree/master/addons/actions) to QA click and tap interactions
- 🎛 [Knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs) to interactively adjust props to experiment with components
- 📝 [Storysource](https://github.com/storybookjs/storybook/tree/master/addons/storysource) to view story code to paste it in your project
- 📕 [Docs](https://github.com/storybookjs/storybook/tree/master/addons/docs) for automatic documentation generation from stories

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## Understand the workflow

Design systems are an investment in frontend infrastructure. In addition to showcasing how to use the technology above, this guide also focuses on core workflows that promote adoption and simplify maintenance. Wherever possible, manual tasks will be automated. Below are the activities we’ll encounter.

#### Build UI components in isolation

Every design system is composed of UI components. We’ll use Storybook as a “workbench” to build UI components in isolation outside of our consumer apps. Then we’ll integrate timesaving addons that help you increase component durability (Actions, Source, Knobs).

#### Review to reach consensus and gather feedback

UI development is a team sport that requires alignment between developers, designers, and other disciplines. We’ll publish work-in-progress UI components to loop stakeholders into the development process so we can ship faster.

#### Test to prevent UI bugs

Design systems are a single source of truth and a single point of failure. Minor UI bugs in basic components can snowball into company-wide incidents. We’ll automate tests to help you mitigate the inevitable bugs to ship durable, accessible UI components with confidence.

#### Document to accelerate adoption

Documentation is essential, but creating it is often a developer’s last priority. We’ll make it much easier for you to document UI components by auto-generating minimum viable docs which can be further customized.

#### Distribute the design system to consumer projects

Once you have well-documented UI components, you need to distribute them to other teams. We’ll cover packaging, publishing, and how to surface the design system in other Storybooks.

## Storybook Design System

This guide’s example design system was inspired by Storybook’s own [production design system](https://github.com/storybookjs/design-system). It is consumed by three sites and touched by tens of thousands of developers in the Storybook ecosystem.

In the next chapter we’ll show you how to extract a design system from disparate component libraries.

<h2>2. Architecture</h2>

**How to extract a design system from component libraries**

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

<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted6.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted6.png "image_tooltip")

Then use GitHub’s instructions to add the remote to your git repo and pushing (the so-far mostly empty) repo:

```
cd learnstorybook-design-system
git remote add origin https://github.com/chromaui/learnstorybook-design-system.git
git push -u origin master
```

Be sure to replace `chromaui` with your own account name.

<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted7.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted7.png "image_tooltip")

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

<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted8.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

Following this method, we end up with UI primitives: Avatar, Badge, Button, Checkbox, Input, Radio, Select, Textarea, Highlight (for code), Icon, Link, Tooltip, and more. These building blocks are configured in different ways to assemble countless unique features and layouts in our client apps.

<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted9.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

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

<h2>3. Build</h2>

**Setup Storybook to build and catalog design system components**

---

In chapter 3 we’ll set up the essential design system tooling starting with Storybook, the most popular component explorer. The goal of this guide is to show you how professional teams build design systems, so we’ll also focus on finer details like the code hygiene, timesaving Storybook addons, and directory structure.

<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted10.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted10.png "image_tooltip")

## Code formatting and linting for hygiene

Design systems are collaborative, so tools that fix syntax and standardize formatting serve to improve contribution quality. Enforcing code consistency with tooling is much less work than policing code by hand, a benefit for the resourceful design system author.

We’ll use VSCode as our editor in this tutorial but the same idea can be applied to all modern editors like Atom, Sublime, or IntelliJ.

If we add Prettier to our project and set our editor up correctly, we should obtain consistent formatting without having to think much about it:

```

yarn add --dev prettier

```

If you are using Prettier for the first time, you may need to set it up for your editor. In VSCode, install the Prettier addon:

<p id="gdcalert12" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted11.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert13">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted11.png "image_tooltip")

Enable the Format on Save `editor.formatOnSave` if you haven’t done so already. Once you’ve installed Prettier, you should find that it auto-formats your code whenever you save a file.

## Install Storybook

Storybook is the industry-standard [component explorer](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) for developing UI components in isolation. Since design systems focus on UI components, Storybook is the ideal tool for the use case. We’ll rely on these features:

- 📕Catalog UI components
- 📄Save component variations as stories
- ⚡️Developer experience tooling like Hot Module Reloading
- 🛠Supports many view layers including React

Install and run Storybook

```

npx -p @storybook/cli sb init

yarn storybook

```

You should see this:

<p id="gdcalert13" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted12.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert14">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted12.png "image_tooltip")

Nice, we’ve set up a component explorer!

By default, Storybook has created a folder `src/stories` with some example stories. However, when we copied our components over, we brought their stories too. We can get them indexed in our Storybook by changing the search path in `.storybook/config.js` from `’src/stories’` to `’src/components’`, and removing the `src/stories` directory:

```

import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js

configure(require.context('../src, true, /\.stories\.js$/), module);

```

Your Storybook should reload like this (notice that the font styles are a little off):

<p id="gdcalert14" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted13.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert15">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](/design-systems-for-developers/Feedback-wanted13.png "image_tooltip")

<h4>Add global styles</h4>

Our design system requires some global styles (a CSS reset) to be applied to the document for components to be rendered correctly. The styles can be added easily via a Styled Components global style tag. For reference here is how the code is exported from `src/shared/global.js`:

```

import { createGlobalStyle, css } from 'styled-components';

import { color, typography } from './styles';

export const `fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';`

export **const** bodyStyles = css`

  /* global styles */

`

export **const** GlobalStyle = createGlobalStyle`

 body {

   ${bodyStyles}

 }

`;

```

To use the `GlobalStyle` “component” in Storybook, we can make use of a decorator (a component wrapper). In an app we’d place that component in the top-level app layout.

```

import React from 'react';

import { configure, addDecorator } from '@storybook/react';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(story **=>** (

 <>

   <GlobalStyle />

   {story()}

 </>

));

// automatically import all files ending in *.stories.js

configure(require.context('../src’	, true, /\.stories\.js$/), module);

```

The decorator will ensure the `GlobalStyle` is rendered no matter which story is selected.

> The `<>` in the decorator is not a typo -- it’s a [React Fragment](https://reactjs.org/docs/fragments.html) that we use here to avoid adding an unnecessary extra HTML tag to our output.

<h4>Add font tag</h4>

Our design system also relies on the font Nunito Sans to be loaded into the app. The way to achieve that in an app depends on the app framework (read more about it [here](https://github.com/storybookjs/design-system#font-loading)), but in Storybook the easiest way to achieve that is to use `.storybook/preview-head.html` to add a `<link>` tag directly to the `<head>` of the page:

```


```

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900">
```

```

Your Storybook should now look like this. Notice the “T” is sans-serif because we added global font styles.



<p id="gdcalert15" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted14.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert16">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted14.png "image_tooltip")


## Supercharge Storybook with addons


Storybook includes a powerful addon ecosystem created by a massive community. For the pragmatic developer, it’s easier to build our workflow using the ecosystem instead of creating custom tooling ourselves (which can be time-consuming).

<h4>Actions addon to verify interactivity</h4>


The [actions addon](https://github.com/storybookjs/storybook/tree/next/addons/actions) gives you UI feedback in Storybook when an action is performed on an interactive element like a Button or Link. Actions comes installed in storybook by default and you use it simply by passing an “action” as a callback prop to a component.

Let’s see how to use it in our Button element, which optionally takes a wrapper component to respond to clicks. We have a story that passes an action to that wrapper:

```

```
import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
  return <CustomButton onClick={action('button action click')} {...props} />;
}

export const buttonWrapper = () => (
    <Button ButtonWrapper={ButtonWrapper} appearance="primary">
    // … etc ..
)
```

````



<p id="gdcalert16" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted15.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert17">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted15.png "image_tooltip")


<h4>Source to view and paste code</h4>


When you view a story, you often want to see the underlying code to understand how it works and paste it into your project. The Storysource addon shows the currently selected story code in the addon panel.

```


yarn add --dev  @storybook/addon-storysource


```


Register the addon in `.storybook/addons.js`:

```


import '@storybook/addon-actions/register';


import '@storybook/addon-links/register';


import '@storybook/addon-storysource/register';


```


And update your webpack config in `.storybook/webpack.config.js`:

```


module.exports = **function**({ config }) {


 config.module.rules.push({


   test: /\.stories\.jsx?$/,


   loaders: [require.resolve('@storybook/addon-storysource/loader')],


   enforce: 'pre',


 });


 return config;


`};``


```


This is what that workflow looks like in Storybook:



<p id="gdcalert17" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted16.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert18">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted16.png "image_tooltip")


<h4>Knobs to stress test components</h4>


The [knobs addon](https://github.com/storybookjs/storybook/tree/next/addons/knobs) allows you to interact with component props dynamically in the Storybook UI. Knobs allows you to supply a multiple values to a component prop and adjust them through via the UI. This helps design system creators stress test component inputs by adjusting, well, knobs.  It also gives design system consumers the ability to try components before integrating them so that they can understand how each prop affects the component.

Let’s see how this works by setting up knobs in the `Avatar` component:

```


yarn add --dev @storybook/addon-knobs


```


Register the addon in `.storybook/addons.js`:

```


import '@storybook/addon-actions/register';


import '@storybook/addon-links/register';


import '@storybook/addon-storysource/register';


import '@storybook/addon-knobs/register';


```


Add a story that uses knobs in `src/Avatar.stories.js`:

```


import React from 'react';


import { withKnobs, select, boolean } from '@storybook/addon-knobs';


// …


export **const** knobs = () **=>** (


 <Avatar


   loading={boolean('Loading')}


   size={select('Size', ['tiny', 'small', 'medium', 'large'])}


   username="Dominic Nguyen"


   src="https://avatars2.githubusercontent.com/u/263385"


 />


);


knobs.story = {


 decorators: [withKnobs],


};


```


Notice the Knobs tab in the addon panel. We instrumented the “Size” select element that allows us to cycle through the supported Avatar sizes `tiny`, `small`, `medium`, and `large`. You can instrument other props with knobs as well to create an interactive playground for the component.



<p id="gdcalert18" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted17.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert19">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted17.png "image_tooltip")


That said, knobs don’t replace stories. Knobs are great for exploring the edge cases of the components. Stories are used for showcasing the intended cases.

_> “Storybook is a powerful frontend workshop environment tool that allows teams to design, build, and organize UI components (and even full screens!) without getting tripped up over business logic and plumbing.” – Brad Frost, Author of Atomic Design_

## Learn how to automate maintenance


Now that our design system components are in Storybook, we need to set up the automated tooling that streamlines ongoing maintenance. A design system, like all software, should evolve. The challenge is to ensure UI components continue to look and feel as intended as the design system grows.

In chapter 4 we’ll learn how to set up continuous integration and auto-publish the design system online for collaboration.

<h2>4. Review</h2>


**Collaborate on design systems with continuous integration and visual review**



---


In chapter 4, we’ll learn professional workflows for making design system improvements while mitigating inconsistencies. This chapter covers techniques for gathering UI feedback and reaching consensus with your team. These production processes are used by folks at Auth0, Shopify, and Discovery Network.

## Single source of truth or single point of failure


Previously, I wrote that design systems are a [single point of failure](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) for frontend teams. In essence, design systems are a dependency. If you change a design system component, that change propagates to dependent apps. The mechanism for distributing changes is unbiased – it ships both improvements and bugs.



<p id="gdcalert19" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted18.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert20">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted18.png "image_tooltip")


Bugs are an existential risk for design systems so we’ll do everything to prevent them. Small tweaks end up snowballing into innumerable regressions. Without an ongoing maintenance strategy design systems wither.

## Continuous integration


Continuous integration is the defacto way to maintain modern web apps. It allows you to script behavior like tests, analysis, and deployment whenever you push code. We’ll borrow this technique to save ourselves from repetitive manual work.

We’re using CircleCI here, which is free for our modest usage. The same principles apply to other CI services as well.

First, sign up for CircleCI if you haven’t already. Once there, you’ll see an “add projects” tab where you can set up the design system project like so.



<p id="gdcalert20" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted19.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert21">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted19.png "image_tooltip")


Add a `.circleci` directory at the top level and create a config.yml file inside of it. This will allow us to script how our CI process behaves. We can simply add the default file that Circle suggests for Node for now:

```


version: 2


jobs:


  build:


    docker:


      - image: circleci/node:8.10.0


    working_directory: ~/repo


    steps:


      - checkout


      - restore_cache:


          keys:


            - v1-dependencies-{{ checksum "package.json" }}


            - v1-dependencies-


      - run: yarn install


      - save_cache:


          paths:


            - node_modules


          key: v1-dependencies-{{ checksum "package.json" }}


      - run: yarn test


```


At the moment, this runs `yarn test`, which is a basic React test that was set up by create-react-app for us. Let’s check that it passes OK on Circle:



<p id="gdcalert21" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted20.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert22">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted20.png "image_tooltip")


Nice, we’ll pick this back up later.

_> “But it works on my machine?!” – everyone _

## Visual review UI components with your team


Visual review is the process of confirming the behavior and aesthetics of user interfaces. It happens both while you’re developing UI and during QA with the team.

Most developers are familiar with code review, the process of gathering code feedback from other developers to improve code quality. Since UI components express code graphically, visual review is necessary to collect UI/UX feedback.

**Establish a universal reference point **

Delete node_modules. Reinstall packages. Clear localstorage. Delete cookies. If these actions sound familiar, you know how tough it is to ensure teammates reference the latest code. When folks don’t have identical dev environments it’s a nightmare to discern issues caused by the local environment from real bugs.

Fortunately, as frontend developers, we have a common compile target: the browser. Savvy teams publish their Storybook online to serve as a universal reference point for visual review. This sidesteps the inherent complications of local dev environments (it’s annoying to be tech support anyways).



<p id="gdcalert22" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted21.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert23">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted21.png "image_tooltip")


When living UI components are accessible via a URL, stakeholders can confirm UI look and feel from the comfort of their own browsers.  That means developers, designers, and PMs don’t have to fuss with a local development environment, pass screenshots around, or reference out of date UI.

_> Deploying Storybook each PR makes visual review easier and helps product owners think in components. –Norbert de Langen, Storybook maintainer_

**Publish Storybook**

Build the visual review workflow using [Netlify](http://netlify.com), a developer-friendly deployment service. Netlify is free for our use case, but it’s straightforward to [build Storybook as a static site and deploy](https://storybook.js.org/docs/basics/exporting-storybook/) it to other hosting services as well.



<p id="gdcalert23" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted22.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert24">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted22.png "image_tooltip")


Now find your design system’s GitHub repo that we created in the last chapter.



<p id="gdcalert24" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted23.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert25">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted23.png "image_tooltip")


Enter the `storybook-build` command for Netlify to run whenever you commit.



<p id="gdcalert25" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted24.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert26">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted24.png "image_tooltip")


Browse your published Storybook by clicking on the link. You’ll find that your local Storybook development environment is mirrored online. This makes it easy for your team to review the real rendered UI components just as you see them locally.



<p id="gdcalert26" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted25.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert27">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted25.png "image_tooltip")


Netlify runs a build command on every commit that deploys your Storybook. You’ll find a link to it in GitHub’s PR checks.



<p id="gdcalert27" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted26.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert28">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted26.png "image_tooltip")


Congratulations! Now that you set up the infrastructure to publish Storybook, let’s demo gathering feedback. Go to the Storybook URL in your browser.



<p id="gdcalert28" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted27.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert29">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted27.png "image_tooltip")


While we are at it, let’s add the `storybook-static` directory to our `.gitignore` file:

```


# …


storybook-static


```


 And commit it.

```


git commit -am “ignore storybook static”


```


**Request visual review from your team **

Every time a pull request contains UI changes, it’s useful to initiate a visual review process with stakeholders to reach a consensus on what’s being shipped to the user. That way there are no unwanted surprises or expensive rework.

We’ll demo visual review by making a UI change on a new branch.

```


git checkout -b improve-button


```


First, tweak the Button component. “Make it pop” – our designers will love it.

```


// ...


**const** StyledButton = styled.button`


  border: 10px solid red;


  font-size: 20
`</h6>


// ...


```


Commit the change and push it to your GitHub repo.

```


git commit -am “make Button pop”


git push -u origin improve-button


```


Navigate to GitHub.com and open up a pull request for the `improve-button` branch.



<p id="gdcalert29" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted28.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert30">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted28.png "image_tooltip")




<p id="gdcalert30" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted29.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert31">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted29.png "image_tooltip")


Go to the Netlify URL in your PR checks to find your button component.



<p id="gdcalert31" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted30.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert32">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted30.png "image_tooltip")


For each component and story that changed, copy the URL from the browser address bar and paste it wherever your team manages tasks (GitHub, Asana, Jira, etc) to help teammates quickly review the relevant stories.



<p id="gdcalert32" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted31.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert33">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted31.png "image_tooltip")


Assign the issue to your teammates and watch the feedback roll in.



<p id="gdcalert33" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted32.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert34">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted32.png "image_tooltip")


In software development, most defects stem from miscommunication and not technology. Visual review helps teams gather continuous feedback during development to ship design systems faster.

<p id="gdcalert34" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted33.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert35">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted33.png "image_tooltip")


_> Deploying a Storybook URL for every Pull Request has been something we’ve been doing for a while in Shopify’s design system, Polaris, and it’s been amazingly helpful. Ben Scott @ Shopify_

## Test your design system


Visual review is invaluable; however, reviewing hundreds of component stories by hand can take hours. Ideally, we want to see only the intentional changes (additions/improvements) and automatically catch unintentional regressions.

In chapter 5, we introduce testing strategies that reduce noise during visual review and ensure our components remain durable over time.

<h2>5. Test</h2>


**How to test design system appearance, functionality, and accessibility**

In chapter 5, we automate design system testing to prevent UI bugs. This chapter dives into what characteristics of UI components warrant testing and potential pitfalls to avoid. We researched professional teams at Wave, BBC, and Salesforce to land on a test strategy that balances comprehensive coverage, straightforward setup, and low maintenance.



<p id="gdcalert35" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted34.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert36">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted34.png "image_tooltip")


## Fundamentals of UI component testing


Before we begin, let’s figure out what makes sense to test. Design systems are composed of UI components. Each UI component includes stories (permutations) that describe the intended look and feel given a set of inputs (props). Stories are then rendered by a browser or device for the end-user.

<p id="gdcalert36" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted35.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert37">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted35.png "image_tooltip")


Whoa! As you can see, one component contains many states. Multiply the states by the number of design system components and you can see why keeping track of them all is a Sisyphean task. In reality, it’s unsustainable to review each experience by hand, especially as the design system grows.

All the more reason to set up automated testing **now** to save work in the **future**.

## Prepare to test


In a [previous article](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) about professional Storybook workflows, I surveyed 4 frontend teams. They agreed on these best practices for writing stories. Following them makes testing easier and more comprehensive.

**Articulate supported component states** as stories to clarify which combinations of inputs yields a given state. Ruthlessly omit unsupported states to reduce noise.

**Render components consistently **to mitigate variability that can be triggered by randomized (Math.random) or relative (Date.now) inputs.

_> “The best kind of stories allow you to visualize all of the states your component could experience in the wild” – Tim Hingston at Apollo GraphQL._

## Visual test appearance


Design systems contain presentational UI components, which are inherently visual. Visual tests validate the visual aspects of the rendered UI.

Visual tests capture an image of every UI component in a consistent browser environment. New screenshots are automatically compared to previously accepted baseline screenshots. When there are visual differences, you get notified.



<p id="gdcalert37" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted36.gif). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert38">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted36.gif "image_tooltip")


If you’re building a modern UI, visual testing saves your frontend team from time-consuming manual review and prevents expensive UI regressions. We’ll demo visual testing using Chromatic, an industrial-grade service by the Storybook maintainers.

First, go to [ChromaticQA.com](https://chromaticqa.com) and sign up with your GitHub account.



<p id="gdcalert38" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted37.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert39">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted37.png "image_tooltip")


From there choose your design system repo. Behind the scenes, this will sync access permissions and instrument the PR checks.



<p id="gdcalert39" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted38.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert40">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted38.png "image_tooltip")


Install the [storybook-chromatic](https://www.npmjs.com/package/storybook-chromatic) package via npm.


````

```
yarn add --dev storybook-chromatic
```

```


Make sure you import Chromatic in your Storybook configuration. Your `.storybook/config.js` file should look like this:


```

```
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import 'storybook-chromatic';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(story => (
 <>
   <GlobalStyle />
   {story()}
 </>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

```


Open up your command line and navigate to the `design-system` directory. Then run your first test to establish your visual test baselines.


```

```
yarn chromatic test -a "<app code>"
```

```




<p id="gdcalert40" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted39.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert41">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted39.png "image_tooltip")


Chromatic captured a baseline image of every story! Subsequent test runs will capture new images and compare them against these baselines. See how that works by tweaking a UI component and saving it. Go to the global styles (`src/shared/styles.js`) and increase the font-size.


```

```
// …
export const typography = {
 // ...
 size: {
   s1: '13',
   // ...
 },
};
// ...
```

```


Run the test command again.


```

```
yarn chromatic test -a "<app code>"
```

```


Yikes! That small tweak resulted in a flood of UI changes.



<p id="gdcalert41" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted40.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert42">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted40.png "image_tooltip")


Visual testing helps identify UI changes in Storybook. Review the changes to confirm whether they’re intentional (improvements) or unintentional (bugs). If you’re fond of the new font-size, go ahead and accept the changes and commit to git. Or perhaps the changes are too ostentatious, go ahead and undo them.

Let’s add visual testing to the continuous integration job. Open `.circleci/config.yml` and add the test command.


```

```
version: 2
jobs:
 build:
   docker:
     - image: circleci/node:8.10.0

   working_directory: ~/repo

   steps:
     - checkout

     - restore_cache:
         keys:
           - v1-dependencies-{{ checksum "package.json" }}
           - v1-dependencies-

     - run: yarn install

     - save_cache:
         paths:
           - node_modules
         key: v1-dependencies-{{ checksum "package.json" }}

     - run: yarn test
     - run: yarn chromatic test -a 2wix88i1ziu --exit-zero-on-changes
```

```


Save and `git commit`. Congratulations you just set up visual testing in CI!

## Unit test functionality


Unit tests verify whether the UI code returns the correct output given a controlled input. They live alongside the component and help you validate specific functionality.

Everything is a component in modern view layers like React, Vue, and Angular. Components encapsulate diverse functionality from modest buttons to elaborate date pickers. The more intricate a component, the trickier it becomes to capture nuances using visual testing alone. That’s why we need unit tests.



<p id="gdcalert42" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted41.gif). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert43">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted41.gif "image_tooltip")


For instance, our Link component is a little complicated when combined with systems that generate link URLs (“LinkWrappers” in ReactRouter, Gatsby, or Next.js). A mistake in the implementation can lead to links without a valid href value.

Visually, it isn’t possible to see if the `href` attribute is there and points to the right location, which is why a unit test can be appropriate to avoid regressions.

<h4>Unit testing hrefs</h4>


Let’s add a unit test for our `Link` component. create-react-app has set up a unit test environment for us already, so we can simply create a file `src/Link.test.js`:


```

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = props => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

it('has a href attribute when rendering with linkWrapper', () => {
 const div = document.createElement('div');
 ReactDOM.render(
   <Link href="https://learnstorybook.com" LinkWrapper={LinkWrapper}>
     Link Text
   </Link>,
   div
 );

 expect(div.querySelector('a[href="https://learnstorybook.com"]')).not.toBeNull();
 expect(div.textContent).toEqual('Link Text');

 ReactDOM.unmountComponentAtNode(div);
});

```

```


We can run the above unit test as part of our `yarn test` command.



<p id="gdcalert43" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted42.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert44">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted42.png "image_tooltip")


Earlier we configured our Circle config.js file to run `yarn test` on every commit. Our contributors will now benefit from this unit test. The Link component will be robust to regressions.

> Note: Watch out for too many unit tests which can make updates cumbersome. We recommend unit testing design systems in moderation.

_> Our enhanced automated test suite has empowered our design systems team to move faster with more confidence. – Dan Green-Leipciger, Senior software engineer at Wave _

## Accessibility test


“Accessibility means all people, including those with disabilities, can understand, navigate, and interact with your app... Online [examples include] alternative ways to access content such as using the tab key and a screen reader to traverse a site.” writes developer Alex Wilson from T.Rowe Price [[source](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347)].

Disabilities affect 15% of the population according to the World Health Organization. Design systems have an outsized impact on accessibility because they contain the building blocks of user interfaces. Improving accessibility of just one component means every instance of that component across your company benefits.



<p id="gdcalert44" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted43.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert45">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted43.png "image_tooltip")


Get a headstart on inclusive UI with Storybook’s Accessibility addon, a tool for verifying web accessibility standards (WCAG) in realtime.


```

```
yarn add --dev @storybook/addon-a11y
```

```


Register the addon in `.storybook/addons.js`:


```

```
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
```

```


And add the `withA11y` decorator to our `.storybook/config.js`:


```

```
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import 'storybook-chromatic';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(withA11y);
addDecorator(story => (
 <>
   <GlobalStyle />
   {story()}
 </>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

```


Once installed, you’ll see a new “Accessibility” tab in the Storybook addons panel.



<p id="gdcalert45" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted44.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert46">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted44.png "image_tooltip")


This shows you accessibility levels of DOM elements (violations and passes). Click the “highlight results” checkbox to visualize violations in situ with the UI component.



<p id="gdcalert46" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted45.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert47">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted45.png "image_tooltip")


From here, follow the addon’s accessibility recommendations.

## Other testing strategies


Paradoxically, tests can save time but also bog down development velocity with maintenance. Be judicious about testing the right things – not everything. Even though software development has many test strategies, we discovered the hard way that some aren’t suited for design systems.

<h4>Snapshot tests (Jest)</h4>


This technique captures the code output of UI components and compares it to previous versions. Testing UI component markup ends up testing implementation details (code), not what the user experiences in the browser.

Diffing code snapshots is unpredictable and prone to false positives. At the component level, code snapshotting doesn’t account for global changes like design tokens, CSS, and 3rd party API updates (web fonts, Stripe forms, Google Maps, etc.). In practice, developers resort to “approving all” or ignoring snapshot tests altogether.

_> Most component snapshot tests are really just a worse version of screenshot tests. Test your outputs. Snapshot what gets rendered, not the underlying (volatile!) markup. – Mark Dalgliesh,  Frontend infrastructure at SEEK, CSS modules creator_

<h4>End-to-end tests (Selenium, Cypress) </h4>


End-to-end tests traverse the component DOM to simulate the user flow. They’re best suited for verifying app flows like the signup or checkout process. The more complex functionality the more useful this testing strategy.

Design systems contain atomic components with relatively simple functionality. Validating user flows are often overkill for this task because the tests are time-consuming to create and brittle to maintain. However, in rare situations, components may benefit from end-to-end tests. For instance, validating complex UIs like datepickers or self-contained payment forms.

## Drive adoption with documentation


A design system is not complete with tests alone. Since design systems serve stakeholders from across the organization, we need to teach others how to get the most from our well-tested UI components.

In chapter 6, we’ll learn how to accelerate design system adoption with documentation. See why Storybook Docs is a secret weapon to create comprehensive docs with less work.

<h2>6. Document</h2>


**Drive design system adoption with documentation**

Professional frontend teams measure design system success by adoption. To get the full work-saving benefits of a design system, components must be widely circulated. Otherwise, what’s the point?

In this chapter, we’ll create a design system “user manual” to help stakeholders reuse components in their apps. Along the way, we’ll uncover UI documentation best practices used by teams at Shopify, Microsoft, Auth0, and the UK government.



<p id="gdcalert47" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted46.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert48">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted46.png "image_tooltip")


## Documentation is exhausting


It’s obvious – documentation is invaluable for collaborative UI development. It helps teams learn how and when to use common UI components. But why does it take so much effort?

If you’ve ever created docs, you probably sunk time into non-documentation tasks like site infrastructure or wrangling technical writers. And even if you find time to publish those docs, it’s grueling to maintain them while continuing to develop features.

**Most docs go out of date the moment they’re created. **Outdated docs undermine trust in the design system components, which results in developers opting to create new components instead of reusing what exists.

## Requirements


Our docs must overcome the inherent friction of creating and maintaining documentation. Here’s what they should do:



*   **🔄Stay up to date **by using the latest production code
*   **✍️Facilitate writing** using familiar writing tools like Markdown
*   **⚡️Reduce maintenance time **so teams can focus on writing
*   **📐Provide boilerplate **so developers don’t rewrite common patterns
*   **🎨Offer customizability** for particularly complex use cases and components

As Storybook users, we have a head start because component variations are already recorded as stories – a form of documentation. A story showcases how a component is supposed to work given different inputs (props). Stories are easy to write and are self-updating because they use the production components. What’s more, stories can be regression tested using the tools in the previous chapter!

_> When you write stories you get component prop documentation and usage examples for free! – Justin Bennett, Frontend Architect at Discovery Network_

## Write stories, generate docs


With the Storybook Docs addon, we can generate rich documentation from existing stories to reduce maintenance time and get out-of-the-box defaults. First, navigate to your design system directory. We’ll install the docs addon:


```

```
yarn add --dev @storybook/addon-docs
```

```


Also, we’ll add a *preset* for the docs addon, in a new file `.storybook/presets.js`. Note that the use of this preset removes the need for our `.storybook/webpack.config.js` and we can remove it:


```

```
module.exports = ['@storybook/addon-docs/react/preset'];
```

```


You should see two tabs in your Storybook. “Canvas” tab is your component development environment. “Docs” is your component documentation.



<p id="gdcalert48" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted47.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert49">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted47.png "image_tooltip")


Behind the scenes, Storybook Docs created a new “Docs” tab for each component. It populated the tab with frequently used documentation pieces like interactive previews, source code viewers, and a props table. You’ll find similar features in the design system documentation of Shopify and Auth0. All in less than 5 minutes.

## Extending documentation


So far we’ve made lots of progress with little effort. Yet, the documentation still lacks a _human_ touch. We need to give more context (why, when, and how) for other developers.

Start by adding more metadata that explains what the component does. In `src/Avatar.stories.js`, add a subtitle that describes what the Avatar is used for:


```

```

export default {
 title: 'Design System|Avatar',

 parameters: {
   component: Avatar,
   componentSubtitle: 'Displays an image that represents a user or organization',
 },
};
```

```


Next add JSdoc to the Avatar component (in `src/components/Avatar.js`) that provides a description to be read:


```

```
/**
* Use an avatar for attributing actions or content to specific users.
*   The user's name should always be present when using Avatar – either printed beside
*   the avatar or in a tooltip.
**/
export function Avatar({ loading, username, src, size, ...props }) {
```

```


You should now see this:



<p id="gdcalert49" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted48.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert50">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted48.png "image_tooltip")


Storybook Docs automatically generated the prop table that shows types and default values. That’s convenient, but it doesn’t mean Avatar is dummy-proof – several props can be misused. Add comments in your proptypes to render them in the auto-generated prop table.


```

```
Avatar.propTypes = {
 /**
  Use the loading state to indicate that the data Avatar needs is still loading.
 */
 loading: PropTypes.bool,
 /**
  Avatar falls back to the user's initial when no image is provided. Supply a `username` and omit `src` to see what this looks like.
 */
 username: PropTypes.string,
 /**
  The URL of the Avatar's image.
 */
 src: PropTypes.string,
 /**
  Avatar comes in four sizes. In most cases, you'll be fine with `medium`.
 */
 size: PropTypes.oneOf(Object.keys(sizes)),
};
```

```


By default, every Avatar story is rendered in the docs. We can’t assume other developers know what each story represents. Write some descriptive text for the stories in `src/Avatar.stories.js`:

```

```
export const sizes = () => (
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
);
sizes.story = { parameters: { docs: { storyDescription: '4 sizes are supported.' } } };
```

```



<p id="gdcalert50" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted49.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert51">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted49.png "image_tooltip")


<h4>Supercharge documentation with Markdown/MDX</h4>


Every component is different and so are its documentation requirements. We used Storybook Docs to generate best practice documentation for free. Let’s add supplementary information and identify some gotchas in our component.

Markdown is a straightforward format for writing text. MDX allows you to use interactive code (JSX) inside of Markdown. Storybook Docs uses MDX to give developers ultimate control over how documentation renders.

First, let’s take control of the Avatar doc generation from the default. Register MDX files in `.storybook/config.js` like so.


```

```
// automatically import all files ending in *.stories.js|mdx
configure(require.context('../src', true, /\.stories\.(js|mdx)$/), module);
```

```


Create a new `src/Avatar.stories.mdx` file and supply some details. We’ll remove the `Avatar.stories.js` file and recreate the stories in the mdx file:


```

```
import { Meta, Story } from '@storybook/addon-docs/blocks';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import { Avatar } from './Avatar';

<Meta title="Design System|Avatar" component={Avatar} />

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users. The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

<Story name="standard">
  <Avatar
    size="large"
    username="Tom Coleman"
    src="https://avatars2.githubusercontent.com/u/132554"
  />
</Story>

### Sizes

4 sizes are supported.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### Default Values

When no image is supplied to the `src` prop, Avatar displays initials. Avatar should be used sparingly in situations without access to images.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

The loading state is used when the image or username is, well, loading.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Experiment with this story with Knobs addon in Canvas mode.

<Story name="knobs" parameters={{ decorators: [withKnobs] }}>
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
</Story>

```

```


In Storybook your Avatar component’s “Docs” tab should be replaced with our sparse MDX page.



<p id="gdcalert51" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted50.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert52">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted50.png "image_tooltip")


Storybook Docs come with “Doc Blocks”, readymade components like interactive previews, the props table, and more. By default, they’re used behind the scenes for the auto-generated docs pages. They can also be extracted for individual use. Our goal is to customize Avatar’s docs without redoing everything ourselves so let’s reuse Doc Blocks where possible.

Let’s add the `Props` doc block, and wrap our initial story in a  `Preview`

```

```
import { Meta, Story, Props, Preview } from '@storybook/addon-docs/blocks';
```

# …

```
<Preview withToolbar>
  <Story name="standard">
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </Story>
</Preview>

<Props of={Avatar} />
```

```




<p id="gdcalert52" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted51.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert53">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted51.png "image_tooltip")


Nice! We’re back to where we started, but now with full control over ordering and content. The benefits of automated doc generation persist because we’re using Doc Blocks.

Customize Avatar’s docs with a note about use cases. This gives developers context about how to take advantage of this component. We can just add markdown as we would in any other markdown document:

```

```
// As before
<Props of={Avatar} />

## Usage

Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

### Sizes
// As before
```

````



<p id="gdcalert53" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted52.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert54">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted52.png "image_tooltip")


<h4>Custom pages</h4>


Every design system comes with a cover page. Storybook Docs allows you to create discrete pages using MDX.

Create a new file `src/components/Intro.stories.mdx`:


```
```
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Design System|Introduction" />

# Introduction to the Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```
```


This generates a new documentation-only page that is independent of the automated component docs pages from earlier.



<p id="gdcalert54" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted53.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert55">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted53.png "image_tooltip")


To get it to appear first, we have to tell Storybook to load the Introduction file first:

```


configure(


 [


   require.context('../src’, false, /Intro\.stories\.mdx/),


   require.context('../src', true, /\.stories\.(js|mdx)$/),


 ],


 module


);


```




<p id="gdcalert55" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted54.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert56">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted54.png "image_tooltip")


## Publishing documentation online


If you write documentation that no one reads, is that useful? No. It’s not enough to create high-quality learning material, we need to surface that material to stakeholders and colleagues. Right now, our docs are buried in the repo which means folks must run the design system’s Storybook locally in order to see the docs.

In a previous chapter, we published Storybook online for visual review. It’s easy to use the same mechanism to publish our component docs as well. Let’s add a new script to `package.json` to build our Storybook in docs mode:

```


{


  “scripts”: {


     `"build-storybook-docs": "build-storybook -s public --docs",`


   }


}


```

Save and commit. Create a second Netlify integration to run the docs build script:



<p id="gdcalert56" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted55.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert57">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted55.png "image_tooltip")


Great. Every time you commit, you’ll now see two PR checks. One takes you to the published Storybook. The other takes you to the published Storybook Docs.



<p id="gdcalert57" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted56.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert58">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted56.png "image_tooltip")


> As your design system grows you may encounter organization-specific requirements that warrant custom tooling or even building your own static site in Gatsby or Next. It’s easy to port markdown and MDX to other solutions. In addition, the functionality in Doc Blocks is cross-compatible.

## Import the design system in other apps


Up until now, we focused inward. First, on creating durable UI components. Then, on reviewing, testing, and documenting them. Now we’ll shift perspective outward to examine how teams consume design systems.

Chapter 7 walks through packaging the design system for use in other apps. Learn how to combine npm, the JavaScript package manager, with Auto, a time-saving release management tool.

<h2>7. Distribute</h2>


**Learn to package and import your design system into other apps**

From an architectural perspective, design systems are yet another frontend dependency. They are no different than popular dependencies like moment or lodash. UI components are code so we can rely on established techniques for code reuse.

This chapter walks through design system distribution from packaging UI components to importing them in other apps. We’ll also uncover timesaving techniques to streamline versioning and release.



<p id="gdcalert58" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted57.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert59">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted57.png "image_tooltip")


## Package the design system


Organizations have thousands of UI components spread across different apps. Previously, we extracted the most common components into our design system. Now we need to reintroduce those components back into the apps.

Our design system uses JavaScript package manager npm to handle distribution, versioning, and dependency management.

There are many valid methods for packaging design systems. Gander at design systems from Lonely Planet, Auth0, Salesforce, GitHub, and Microsoft to see a diversity in approaches. Some folks deliver each component as a separate package. Others ship all components in one package.

For nascent design systems, the most direct way is to publish a single versioned package that encapsulates:



*   🏗 Common UI components
*   🎨 Design tokens (a.k.a., style variables)
*   📕 Documentation



<p id="gdcalert59" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted58.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert60">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted58.png "image_tooltip")


## Prepare your design system for export


As we used create-react-app as a starting point for our design system, there are still vestiges of the initial app and scripts that create-react-app created for us. Let’s clean them up now.

First, we should add a basic README.md:


```
```
# The Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```
```


Then, let’s create a `src/index.js` file to create a common entry point for using our design system. From this file we’ll export all our design tokens and the components:


```
```
import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```
```


Let’s add a development dependency on `@babel/cli` to compile our JavaScript for release:


```
```
yarn add --dev @babel/cli
```
```


To build the package, we’ll add a script to `package.json` that builds our source directory into `dist`:


```
```
{
  "scripts": {
   "build": "BABEL_ENV=production babel src -d dist",
   ...
  }
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```
```


We can now run `yarn build` to build our code into the `dist` directory -- we should add that directory to `.gitignore` too:


```
```
// ..
storybook-static
dist
```
```


<h4>Adding package metadata for publication</h4>


Finally, let’s make a couple of changes to `package.json` to ensure consumers of the package get all the information we need. The easiest way to do that is to run `yarn init` -- a command that initializes the package for publication:


```
```yarn init

yarn init v1.16.0
question name (learnstorybook-design-system):
question version (0.1.0):
question description (Learn Storybook design system):
question entry point (dist/index.js):
question repository url (https://github.com/chromaui/learnstorybook-design-system.git):
question author (Tom Coleman <tom@thesnail.org>):
question license (MIT):
question private: no
```
```


The command will ask us a set of questions, some of which will be prefilled with answers, others that we’ll have to think about. You’ll need to pick a unique name for the package on npm (you won’t be able to use `learnstorybook-design-system` -- a good choice is `<your-username>-learnstorybook-design-system`).

All in all, it will update `package.json` with new values as a result of those questions:


```
```
{
 "name": "learnstorybook-design-system",
 "description": "Learn Storybook design system",
 "version": "0.1.0",
 "license": "MIT",
 "main": "dist/index.js",
 "repository": "https://github.com/chromaui/learnstorybook-design-system.git",
 // ...
}
```
```


Now we’ve prepared our package, we can publish it to npm for the first time!

## Release management with Auto


To publish releases to npm, we’ll use a process that also updates a changelog describing changes, sets a sensible version number, and creates git tag linking that version number to a commit in our repository. To help with all those things, we’ll use an open-source tool called [Auto](https://github.com/intuit/auto), designed for this very purpose.

Let’s install Auto:

```


yarn add --dev auto


```


Auto is a command line tool we can use for various common tasks around release management. You can learn more about Auto on [their documentation site](https://intuit.github.io/auto/).

<h4>Getting a GitHub and npm token</h4>


For the next few steps, Auto is going to talk to GitHub and npm. In order for that to work correctly, we’ll need a personal access token. You can get one of those on [this page](https://github.com/settings/tokens) for GitHub. The token will need the `repo` scope.

For npm, you can create a token at the URL: [https://www.npmjs.com/settings/](https://www.npmjs.com/settings/)<your-username>/tokens

You’ll need a token with “Read and Publish” permissions.

Let’s add that token to a file called `.env` in our project::

```


GH_TOKEN=<value you just got from GitHub>


NPM_TOKEN=<value you just got from npm>

```


By adding the file to `.gitignore` we’ll be sure that we don’t accidentally push this value to an open-source repository that all our users can see! This is crucial. If other maintainers need to publish the package from locally (later we’ll set things up to auto publish when PRs are merged to master) they should set up their own `.env` file following this process:

```


storybook-static


dist


.env


```


<h4>Create labels on GitHub</h4>


The first thing we need to do with Auto is to create a set of labels in GitHub. We’ll use these labels in the future when making changes to the package (see the next chapter) and that’ll allow `auto` to update the package version sensibly and create a changelog and release notes.

```


yarn auto create-labels


```


If you check on GitHub, you’ll now see a set of labels that `auto` would like us to use:



<p id="gdcalert60" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted59.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert61">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted59.png "image_tooltip")


We should tag all future PRs with one of the labels: `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation` before merging them.

<h4>Publish our first release with Auto manually</h4>


In the future, we’ll calculate new version numbers with `auto` via scripts, but for the first release, let’s run the commands manually to understand what they do. Let’s generate our first changelog entry:

```


yarn auto changelog


```


This will generate a long changelog entry with every commit we’ve created so far (and a warning we’ve been pushing to master, which we should stop doing soon).

Although it is useful to have an auto-generated changelog so you don’t miss things, it’s also a good idea to manually edit it and craft the message in the most useful way for users. In this case, the users don’t need to know about all the commits along the way. Let’s make a nice simple message for our first v0.1.0 version. First undo the commit that Auto just created (but keep the changes:

```


git reset HEAD^


```


Then we’ll update the changelog and commit it:

```


# v0.1.0 (Tue Sep 03 2019)


- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon``Link` components.</h6>


#### Authors: 1


- Tom Coleman ([@tmeasday](https://github.com/tmeasday))


```


Let’s add that changelog to git. Note that we use `[skip ci]` to tell CI platforms to ignore these commits, else we end up in their build and publish loop.

```


git add CHANGELOG.md


git commit -m “Changelog for v0.1.0 [skip ci]”


```


Now we can publish:

```


npm version 0.1.0 -m "Bump version to: %s [skip ci]"


npm publish


```


And use Auto to create a release on GitHub:

```


git push --follow-tags origin master


yarn auto release


```


Yay! We’ve successfully published our package to npm and created a release on GitHub (with luck!).



<p id="gdcalert61" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted60.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert62">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted60.png "image_tooltip")




<p id="gdcalert62" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted61.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert63">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted61.png "image_tooltip")


<h4>Set up scripts to use Auto</h4>


Let’s set up Auto to follow the same process when we want to publish the package in the future. We’ll add the following scripts to our `package.json`:

```


{


  “scripts”: {


     “release”: “auto shipit”


  }


}


```


 \
Now, when we run `yarn release`, we’ll step through all the steps we ran above (except using the auto-generated changelog) in an automated fashion. We’ll ensure that all commits to master are published by adding a command to our circle config:

```


# ...


     - run: yarn test


     - run: yarn chromatic test -a 2wix88i1ziu


     - run: ‘[ $CIRCLE_BRANCH = 'master' ] && yarn release’


We’ll also need to add an npm+GitHub token to your project’s Circle environment on the CircleCI website (https://circleci.com/gh/<your-username>/learnstorybook-design-system/edit#env-vars):



<p id="gdcalert63" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted62.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert64">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted62.png "image_tooltip")


Now every time you merge a PR to master, it will automatically publish a new version, incrementing the version number as appropriate due to the labels you’ve added.

> We didn’t cover all of Auto’s many features and integrations that might be useful for growing design systems. Read the docs [here](https://github.com/intuit/auto).



<p id="gdcalert64" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted63.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert65">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted63.png "image_tooltip")


## Import the design system in an app


Now that our design system lives online, it’s trivial to install the dependency and start using the UI components.

<h4>Get the example app</h4>


Earlier in this tutorial, we standardized on a popular frontend stack that includes React and styled-components. That means our example app must also use React and styled-components to take full advantage of the design system.

> Other promising methods like Svelte or web components may allow you to ship framework-agnostic UI components . However, they are relatively new, under-documented, or lack widespread adoption so they’re not included in this guide yet.

The example app uses Storybook to facilitate [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), an app development methodology of building UIs from the bottom up starting with components and ending with pages. During the demo, we’ll run two Storybook’s side-by-side: one for our example app and one for our design system.

Clone the example app repository from GitHub

```


git clone chromaui/learnstorybook-design-system-example-app


```


Install the dependencies and start the app’s Storybook

```


yarn install


yarn storybook


```


You should see the Storybook running with the stories for the simple components the app uses:



<p id="gdcalert65" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted64.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert66">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted64.png "image_tooltip")


<h4>Integrating the design system</h4>


Add your published design system as a dependency.

```


yarn add <your-username>-learnstorybook-design-system


```


Now, let’s update the example app’s `.storybook/config.js` to list the design system components, and to use the global styles defined by the design system. Edit `.storybook/config.js` to:

```


import React from ‘react’;


import { configure. addDecorator } from '@storybook/react';


import { GlobalStyles } from ‘`<your-username>-learnstorybook-design-system';`



```
addDecorator(s => <><GlobalStyles/>{s()}</>);
```


// automatically import all files ending in *.stories.js


configure(


 [


   require.context('../src', true, /\.stories\.js$/),



```

   require.context('../node_modules/<your-username>-learnstorybook-design-system/dist, tr\.stories\.(js|mdx)$/),
</h6>

```


 ],


 module


);


```




<p id="gdcalert66" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted65.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert67">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted65.png "image_tooltip")


You’ll now be able to browse the design system components and docs while developing the example app. Showcasing the design system during feature development increases the likelihood that developers will reuse existing components instead of wasting time inventing their own.

Alternatively, you can browse your design system’s Storybook online if you deployed it to a web host earlier (see chapter 4).

We’ll use the Avatar component from our design system in the example app’s UserItem component. UserItem should render information about a user including a name and profile photo.

Navigate to the UserItem.js component in your editor. Also, find UserItem in the Storybook sidebar to see code changes update instantly with hot module reload.

Import the Avatar component.


```

import { Avatar } from '<your-username>-learnstorybook-design-sys
</h6>

```


We want to render the Avatar beside the username.

```


import React from 'react';


import styled from 'styled-components';


import { Avatar } from 'learnstorybook-design-system';


**const** Container = styled.div`


 background: #eee;


 margin-bottom: 1em;


 padding: 0.5em;


`;


**const** Name = styled.span`


 color: #333;


 font-size: 16px;


`;


export default ({ user: { name, avatarUrl } }) **=>** (


 <Container>


   <Avatar username={name} src={avatarUrl} />


   <Name>{name}</Name>


 </Container>


);


```


Upon save, the UserItem component will update in Storybook to show the new Avatar component. Since UserItem is a part of the UserList component, you’ll see the Avatar in UserList as well.



<p id="gdcalert67" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted66.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert68">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted66.png "image_tooltip")


There you have it! You just imported a design system component into the example app. Whenever you publish an update to the Avatar component in the design system, that change will also be reflected in the example app when you update the package.



<p id="gdcalert68" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted67.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert69">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted67.png "image_tooltip")


## Master the design system workflow


The design system workflow starts with developing UI components in Storybook and ends with distributing them to client apps. That’s not all though. Design systems must continually evolve to serve ever-changing product requirements. Our work has only just begun.

Chapter 8 illustrates the end-to-end design system workflow we created in this guide. We’ll see how UI changes ripple outward from the design system.

<h2>8. Workflow</h2>


**An overview of the design system workflow for frontend developers**

How frontend tools work together has a significant impact on the ultimate value design and development teams can realize. When done well, it should be seamless to develop and reuse UI components.

This chapter showcases the five-step workflow by introducing a new component AvatarList.

##

<p id="gdcalert69" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted68.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert70">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted68.png "image_tooltip")



## Build


AvatarList is a component that displays multiple avatars. Like the other design system components, AvatarList started off being pasted into many projects. That’s why it warrants inclusion in the design system. For this demo, let’s assume that the component was developed in another project and jump straight to the finished code.



<p id="gdcalert70" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted69.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert71">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted69.png "image_tooltip")


First, make a new branch on git where we’ll be tracking this work.

```


git checkout -b create-avatar-list-component


```


Download AvatarList to your machine. Place it in the /src directory.

```


<code>svn export [https://github.com/chromaui/learnstorybook-design-system/branches/downlosrc](https://github.com/chromaui/learnstorybook-design-system/branches/download-1/src)</code> src</h6>


```


Storybook is setup to automatically detect files ending in *.stories.js and show them in the UI.



<p id="gdcalert71" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted70.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert72">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted70.png "image_tooltip")


Nice! Now let’s articulate each UI state supported by AvatarList. At a glance, it’s clear that AvatarList supports some of Avatar’s properties like `small` and `loading`.

```


export **const** smallSize = () **=>** <AvatarList users={users.slice(0, 2)} size="small" h6>


export **const** loading = () **=>** <AvatarList loading />;


```




<p id="gdcalert72" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted71.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert73">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted71.png "image_tooltip")


Given that it’s a list, it should show many avatars. Let’s add stories that showcase what happens with numerous list items and what happens with few list items.

```


export **const** ellipsized = () **=>** <AvatarList users={users} />;


export **const** bigUserCount = () **=>** <AvatarList users={users} userCount={100} />;


export **const** empty = () **=>** <AvatarList users={[]} />;


```




<p id="gdcalert73" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted72.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert74">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted72.png "image_tooltip")


Save your progress and commit.

```


git commit -am “Added AvatarList and stories”


```


## Document


Thanks to Storybook Docs, we get customizable documentation with minimal effort. This helps others learn how to use AvatarList by referring to the Docs tab in Storybook.



<p id="gdcalert74" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted73.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert75">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted73.png "image_tooltip")


Minimum viable docs! Let’s make AvatarList a bit more human by supplying additional context on how to use it.

```


/**


 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the tuser count.</h6>


 */


export **function** AvatarList({ loading, users, userCount, size, ...props }) {


```


Sprinkle in some additional details about the supported props.

```


AvatarList.propTypes = {


 _/**_


  * Are we loading avatar data from the network?


  */


 loading: PropTypes.bool,


 _/**_


  * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayh6>


  */


 users: PropTypes.arrayOf(


   PropTypes.shape({


     id: PropTypes.string.isRequired,


     name: PropTypes.string,


     avatarUrl: PropTypes.string,


   })


 ),


 _/**_


_  * The total number of users, if a subset is passed to _`users`_._


  */


 userCount: PropTypes.number,


 _/**_


_  * AvatarList comes in four sizes. In most cases, you’ll be fine with _`medium`_._


  */


 size: PropTypes.oneOf(Object.keys(sizes)),


};


```


Easy as pie! This level of detail is sufficient for now –we can always customize more using MDX later.



<p id="gdcalert75" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted74.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert76">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted74.png "image_tooltip")


Documentation doesn’t have to be tiresome. With automated tooling, we removed the tedium to get straight to writing.

Commit the changes and push to GitHub.

```


git commit -am “Improved AvatarList docs”


```


<h4>Create a Pull Request</h4>


Let’s push our `AvatarList` branch to GitHub and create a pull request:

```


git push -u origin `create-avatar-list-component`


```


 \
Then navigate to GitHub and open a pull request.



<p id="gdcalert76" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted75.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert77">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted75.png "image_tooltip")


## Review


At this point, AvatarList is a candidate for design system inclusion. Stakeholders must review the component to see if it meets expectations for functionality and appearance.

The design system’s Storybook is automatically published each pull request to make review dead simple. Scroll down to the PR checks to find a link to the deployed Storybook.



<p id="gdcalert77" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted76.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert78">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted76.png "image_tooltip")


Find the AvatarList in the Storybook online. It should look identical to your local Storybook.



<p id="gdcalert78" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted77.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert79">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted77.png "image_tooltip")


The online Storybook is a universal reference point for the team. Share the link to AvatarList with other stakeholders to get feedback faster. Your team will love you because they don’t have to deal with code or setting up a development environment.



<p id="gdcalert79" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted78.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert80">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted78.png "image_tooltip")


Reaching consensus with numerous teams often feels an exercise in futility. Folks reference out of date code, don’t have a development environment, or scatter feedback across multiple tools. Reviewing Storybook online makes it as simple as sharing a URL.

## Test


Our test suite runs in the background every commit. AvatarList is a simple presentational component so unit tests aren’t necessary. But if we take a look at the PR check, our visual testing tool Chromatic has already detected changes that need to be reviewed.



<p id="gdcalert80" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted79.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert81">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted79.png "image_tooltip")


Since AvatarList is new there aren’t visual tests for it yet. We’ll need to add baselines for each story. Accept the “new stories” in Chromatic to expand visual test coverage.



<p id="gdcalert81" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted80.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert82">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted80.png "image_tooltip")


Once you’re done, the build will pass in Chromatic.



<p id="gdcalert82" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted81.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert83">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted81.png "image_tooltip")


Which, in turn, updates the PR check in GitHub.



<p id="gdcalert83" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted82.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert84">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted82.png "image_tooltip")


The tests were successfully updated. In the future, regressions will have a tough time sneaking into the design system.

## Distribute


We have an open pull request that adds AvatarList to the design system. Our stories are written, the tests pass, and documentation exists. At last, we’re ready to update our design system package with Auto and npm.** **

Add the `minor` label to the PR. This tells Auto to update the minor version of the package on merge.



<p id="gdcalert84" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted83.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert85">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted83.png "image_tooltip")


Merge the pull request.



<p id="gdcalert85" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted84.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert86">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted84.png "image_tooltip")


Navigate to your package on npm and hang tight for a few minutes while the package is updated.



<p id="gdcalert86" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted85.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert87">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted85.png "image_tooltip")


Success! Your design system package was updated from the comfort of GitHub. No need to touch the command line or fuss with npm. Update the `learnstorybook-design-system` dependency in the example app to start using AvatarList.

## Your journey begins


_Design Systems for Developers_ highlights the end-to-end workflow used by professional frontend teams to give you a headstart as you develop your own. As your design system grows add, rearrange, and extend these tools to fit your team’s needs.

Chapter 9 concludes with the complete sample code, helpful resources, and frequently asked questions from developers.

<h2>9. Conclusion </h2>


**Thriving design systems save time and increase productivity**

Research-backed studies suggest reusing code can yield [42–81% time savings](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) and boost productivity by [40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf). It should come as no surprise then that design systems, which facilitate sharing _user interface_ _code_, are surging in popularity amongst developers.

In the last few years, Tom and I witnessed countless veteran teams anchor their design system tooling around Storybook. They concentrated on reducing communication overhead, durable architecture, and automating repetitive manual tasks. We hope that distilling these common-sense tactics will help your design system flourish.

Thanks for learning with us. Subscribe to the Chroma mailing list to get notified when helpful articles and guides like this are published.

**[TK Subscribe to mailing list form]**

## Sample code for this tutorial


If you’re coding along with us, your repositories should look like this:



*   Sample design system repository
*   Example app repository

The example code is based on [Storybook’s own design system](https://github.com/storybookjs/design-system) (SDS) which powers the user experience for tens of thousands of developers. SDS is a work in progress – we welcome community contributions. As a contributor, you’ll get hands-on experience with design system best practices and emergent techniques. SDS is also where the Storybook team demos bleeding-edge features.

## About us


_Design systems for Developers_ was created by [Dominic Nguyen](https://twitter.com/domyen) and [Tom Coleman](https://twitter.com/tmeasday). Dominic designed Storybook’s user interface, brand, and the design system. Tom is a member of the Storybook steering committee in frontend architecture. He worked on Component Story Format, addon API, parameter API.

Expert guidance from [Kyle Suss](https://github.com/kylesuss), tech lead of Storybook’s design system, and [Michael Shilman](https://twitter.com/mshilman), creator of Storybook Docs.

Content, code, and production brought to you by [Chroma](https://hichroma.com/). InVision’s [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) graciously helped kickstart production with a grant. We’re seeking sponsors to make continued maintenance and new guides like this possible. Email [Dominic](mailto:dom@hichroma.com) for more details.

## Broaden your perspective


It’s worth expanding your focus to get a holistic design system perspective.



*   [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/) (book)
*   [Eightshapes by Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
*   [Building Design Systems by Sarrah Vesselov and Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X)(book)

More from the authors:



*   [Introduction to Storybook](http://learnstorybook.com/introduction-to-storybook) (guide)
*   [Component-Driven Development by Tom Coleman](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (article)
*   [Why design systems are a single point of failure by Dominic Nguyen](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) (article)
*   [Delightful Storybook Workflow by Dominic Nguyen](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) (article)
*   [Visual Testing by Tom Coleman](https://blog.hichroma.com/visual-testing-the-pragmatic-way-to-test-uis-18c8da617ecf) (article)

## FAQ


**Isn’t there more to design systems?**

Design systems include (but are not limited to) design files, component libraries, tokens, documentation, principles, and contribution flows. The guide is scoped to the developer perspective on design systems so we cover a subset of the topics. Specifically, the engineering details, APIs, and infrastructure that go into production design systems.

**What about the governance side of design systems?**

Governance is a nuanced topic that is more extensive and organization-specific than we can fit into nine chapters.

**Does Storybook integrate with design tools?**

Yes! The Storybook community creates addons that make design tool integration easy. For example, InVision’s [Design System Manager](https://www.invisionapp.com/design-system-manager) integrates with Storybook to showcase stories in the InVision app. There are also community-created addons for [design tokens](https://github.com/UX-and-I/storybook-design-token), [Sketch](https://github.com/chrisvxd/story2sketch), and [Figma](https://github.com/pocka/storybook-addon-designs).



<p id="gdcalert87" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted86.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert88">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted86.png "image_tooltip")


**Do you need a design system for a single app?**

No. There is an opportunity cost for creating and maintaining a design system. At small scales, a design system requires more effort than is returned in time-savings.

**How do consumer apps protect themselves from unexpected design system changes?**

No one is perfect. Your design system will inevitably ship with a bug that impacts consumer apps. Mitigate this disruption by instrumenting your client app’s Storybook with automated testing (visual, unit, etc) in the same way we did with the design system. That way when you update dependencies on a branch (manually or with automated services like [Dependabot](https://dependabot.com/)), your client app’s test suite will catch incoming regressions from the design system.

##

<p id="gdcalert88" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Feedback-wanted87.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert89">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](/design-systems-for-developers/Feedback-wanted87.png "image_tooltip")



**How do you propose tweaks to the design system?**

The design system team is a service team. Instead of interfacing with end-users, it exists to make internal app teams more productive. The stewards of the design system are responsible for managing requests and socializing status with other teams. Many teams use a task manager like Jira, Asana, or Trello to keep track of proposals.

## Shoutouts


Thanks to the amazing Storybook community for their invaluable feedback.

Gert Hengeveld and Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Acorns), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla and Kathleen McMahon (O’Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent and Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile 6), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D’amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times)


<!-- Docs to Markdown version 1.0β17 -->
````
