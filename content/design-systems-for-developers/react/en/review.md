---
title: 'Review with teams'
tocTitle: 'Review'
description: 'Collaborate with continuous integration and visual review'
commit: eabed3d
---

In chapter 4, we’ll learn professional workflows for making design system improvements while mitigating inconsistencies. This chapter covers techniques for gathering UI feedback and reaching consensus with your team. These production processes are used by folks at Auth0, Shopify, and Discovery Network.

## Single source of truth or single point of failure

Previously, I wrote that design systems are a [single point of failure](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) for frontend teams. In essence, design systems are a dependency. If you change a design system component, that change propagates to dependent apps. The mechanism for distributing changes is unbiased – it ships both improvements and bugs.

![Design system dependencies](/design-systems-for-developers/design-system-dependencies.png)

Bugs are an existential risk for design systems so we’ll do everything to prevent them. Small tweaks end up snowballing into innumerable regressions. Without an ongoing maintenance strategy design systems wither.

## Continuous integration

Continuous integration is the defacto way to maintain modern web apps. It allows you to script behavior like tests, analysis, and deployment whenever you push code. We’ll borrow this technique to save ourselves from repetitive manual work.

We’re using CircleCI here, which is free for our modest usage. The same principles apply to other CI services as well.

First, sign up for CircleCI if you haven’t already. Once there, you’ll see an “add projects” tab where you can set up the design system project like so.

![Adding a project on CircleCI](/design-systems-for-developers/circleci-add-project.png)

Add a `.circleci` directory at the top level and create a config.yml file inside of it. This will allow us to script how our CI process behaves. We can simply add the default file that Circle suggests for Node for now:

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:10.13
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

At the moment, this runs `yarn test`, which is a basic React test that was set up by create-react-app for us. Let’s check that it runs on Circle:

![First build on CircleCI](/design-systems-for-developers/circleci-first-build.png)

Note that our build failed as we currently don't have any tests defined for our project. That's OK, we'll add some soon, for now let's keep moving.

> “But it works on my machine?!” – everyone

## Visual review UI components with your team

Visual review is the process of confirming the behavior and aesthetics of user interfaces. It happens both while you’re developing UI and during QA with the team.

Most developers are familiar with code review, the process of gathering code feedback from other developers to improve code quality. Since UI components express code graphically, visual review is necessary to collect UI/UX feedback.

#### Establish a universal reference point

Delete node_modules. Reinstall packages. Clear localstorage. Delete cookies. If these actions sound familiar, you know how tough it is to ensure teammates reference the latest code. When folks don’t have identical dev environments it’s a nightmare to discern issues caused by the local environment from real bugs.

Fortunately, as frontend developers, we have a common compile target: the browser. Savvy teams publish their Storybook online to serve as a universal reference point for visual review. This sidesteps the inherent complications of local dev environments (it’s annoying to be tech support anyways).

![Review your work in the cloud](/design-systems-for-developers/design-system-visual-review.jpg)

When living UI components are accessible via a URL, stakeholders can confirm UI look and feel from the comfort of their own browsers. That means developers, designers, and PMs don’t have to fuss with a local development environment, pass screenshots around, or reference out of date UI.

> "Deploying Storybook each PR makes visual review easier and helps product owners think in components." –Norbert de Langen, Storybook core maintainer

#### Publish Storybook

Build the visual review workflow using [Netlify](http://netlify.com), a developer-friendly deployment service. Netlify is free for our use case, but it’s straightforward to [build Storybook as a static site and deploy](https://storybook.js.org/docs/basics/exporting-storybook/) it to other hosting services as well.

![Choosing GitHub on Netlify](/design-systems-for-developers/netlify-choose-provider.png)

Now find your design system’s GitHub repo that we created in the last chapter.

![Choosing our repository on Netlify](/design-systems-for-developers/netlify-choose-repository.png)

Enter the `storybook-build` command for Netlify to run whenever you commit.

![Setting up our first build on Netlify](/design-systems-for-developers/netlify-setup-build.png)

All going well, you should see a successful build in Netlify:

![Succeeded running our first build in Netlify](/design-systems-for-developers/netlify-deployed.png)

Browse your published Storybook by clicking on the link. You’ll find that your local Storybook development environment is mirrored online. This makes it easy for your team to review the real rendered UI components just as you see them locally.

![Viewing our first build in Netlify](/design-systems-for-developers/netlify-deployed-site.png)

Netlify runs a build command on every commit that deploys your Storybook. You’ll find a link to it in GitHub’s PR checks (we'll see that below).

Congratulations! Now that you set up the infrastructure to publish Storybook, let’s demo gathering feedback.

While we are at it, let’s add the `storybook-static` directory to our `.gitignore` file:

```
# …
storybook-static
```

And commit it.

```bash
git commit -am “ignore storybook static”
```

#### Request visual review from your team

Every time a pull request contains UI changes, it’s useful to initiate a visual review process with stakeholders to reach a consensus on what’s being shipped to the user. That way there are no unwanted surprises or expensive rework.

We’ll demo visual review by making a UI change on a new branch.

```bash
git checkout -b improve-button
```

First, tweak the Button component. “Make it pop” – our designers will love it.

```javascript
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

Commit the change and push it to your GitHub repo.

```bash
git commit -am “make Button pop”
git push -u origin improve-button
```

Navigate to GitHub.com and open up a pull request for the `improve-button` branch.

![Creating a PR in GitHub](/design-systems-for-developers/github-create-pr.png)

![Created a PR in GitHub](/design-systems-for-developers/github-created-pr.png)

Go to the Netlify URL in your PR checks to find your button component.

![Button component changed in deployed site](/design-systems-for-developers/netlify-deployed-site-with-changed-button.png)

For each component and story that changed, copy the URL from the browser address bar and paste it wherever your team manages tasks (GitHub, Asana, Jira, etc) to help teammates quickly review the relevant stories.

![GitHub PR with links to storybook](/design-systems-for-developers/github-created-pr-with-links.png)

Assign the issue to your teammates and watch the feedback roll in.

![Why?!](/design-systems-for-developers/visual-review-feedback-github.gif)

In software development, most defects stem from miscommunication and not technology. Visual review helps teams gather continuous feedback during development to ship design systems faster.

![Visual review process](/design-systems-for-developers/visual-review-loop.jpg)

> Deploying a Storybook URL for every Pull Request has been something we’ve been doing for a while in Shopify’s design system, Polaris, and it’s been amazingly helpful. Ben Scott, Engineer at Shopify

## Test your design system

Visual review is invaluable; however, reviewing hundreds of component stories by hand can take hours. Ideally, we want to see only the intentional changes (additions/improvements) and automatically catch unintentional regressions.

In chapter 5, we introduce testing strategies that reduce noise during visual review and ensure our components remain durable over time.
