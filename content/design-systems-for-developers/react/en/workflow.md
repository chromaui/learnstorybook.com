---
title: "Workflow for design systems"
tocTitle: "Workflow"
description: "An overview of the design system workflow for frontend developers"
---

How frontend tools work together has a significant impact on the ultimate value design and development teams can realize. When done well, it should be seamless to develop and reuse UI components.

This chapter showcases the five-step workflow by introducing a new component AvatarList.

![Design system workflow](/design-systems-for-developers/design-system-workflow-horizontal.jpg)

## Build

AvatarList is a component that displays multiple avatars. Like the other design system components, AvatarList started off being pasted into many projects. That’s why it warrants inclusion in the design system. For this demo, let’s assume that the component was developed in another project and jump straight to the finished code.

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

First, make a new branch on git where we’ll be tracking this work.

```
git checkout -b create-avatar-list-component
```

Download AvatarList to your machine. Place it in the `/src` directory.

```
<code>svn export [https://github.com/chromaui/learnstorybook-design-system/branches/downlosrc](https://github.com/chromaui/learnstorybook-design-system/branches/download-1/src)</code> src</h6>
```

Storybook is setup to automatically detect files ending in `\*.stories.js` and show them in the UI.

![alt_text](/design-systems-for-developers/Feedback-wanted70.png)

Nice! Now let’s articulate each UI state supported by AvatarList. At a glance, it’s clear that AvatarList supports some of Avatar’s properties like `small` and `loading`.

```javascript
export const smallSize = () => (
  <AvatarList users={users.slice(0, 2)} size="small" />
);
export const loading = () => <AvatarList loading />;
```

![alt_text](/design-systems-for-developers/Feedback-wanted71.png)

Given that it’s a list, it should show many avatars. Let’s add stories that showcase what happens with numerous list items and what happens with few list items.

```javascript
export const ellipsized = () => <AvatarList users={users} />;
export const bigUserCount = () => <AvatarList users={users} userCount={100} />;
export const empty = () => <AvatarList users={[]} />;
```

![alt_text](/design-systems-for-developers/Feedback-wanted72.png)

Save your progress and commit.

```
git commit -am "Added AvatarList and stories"
```

## Document

Thanks to Storybook Docs, we get customizable documentation with minimal effort. This helps others learn how to use AvatarList by referring to the Docs tab in Storybook.

![alt_text](/design-systems-for-developers/Feedback-wanted73.png)

Minimum viable docs! Let’s make AvatarList a bit more human by supplying additional context on how to use it.

```javascript
/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {
```

Sprinkle in some additional details about the supported props.

```javascript
AvatarList.propTypes = {
  /**
   * Are we loading avatar data from the network?
   */
  loading: PropTypes.bool,
  /**
   * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayed.
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatarUrl: PropTypes.string
    })
  ),
  /**
   * The total number of users, if a subset is passed to `users`.
   */
  userCount: PropTypes.number,
  /**
   * AvatarList comes in four sizes. In most cases, you’ll be fine with `medium`.
   */
  size: PropTypes.oneOf(Object.keys(sizes))
};
```

Easy as pie! This level of detail is sufficient for now –we can always customize more using MDX later.

![alt_text](/design-systems-for-developers/Feedback-wanted74.png)

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

Then navigate to GitHub and open a pull request.

![alt_text](/design-systems-for-developers/Feedback-wanted75.png)

## Review

At this point, AvatarList is a candidate for design system inclusion. Stakeholders must review the component to see if it meets expectations for functionality and appearance.

The design system’s Storybook is automatically published each pull request to make review dead simple. Scroll down to the PR checks to find a link to the deployed Storybook.

![alt_text](/design-systems-for-developers/Feedback-wanted76.png)

Find the AvatarList in the Storybook online. It should look identical to your local Storybook.

![alt_text](/design-systems-for-developers/Feedback-wanted77.png)

The online Storybook is a universal reference point for the team. Share the link to AvatarList with other stakeholders to get feedback faster. Your team will love you because they don’t have to deal with code or setting up a development environment.

![alt_text](/design-systems-for-developers/visual-review-shipit.png)

Reaching consensus with numerous teams often feels an exercise in futility. Folks reference out of date code, don’t have a development environment, or scatter feedback across multiple tools. Reviewing Storybook online makes it as simple as sharing a URL.

## Test

Our test suite runs in the background every commit. AvatarList is a simple presentational component so unit tests aren’t necessary. But if we take a look at the PR check, our visual testing tool Chromatic has already detected changes that need to be reviewed.

![alt_text](/design-systems-for-developers/Feedback-wanted79.png)

Since AvatarList is new there aren’t visual tests for it yet. We’ll need to add baselines for each story. Accept the “new stories” in Chromatic to expand visual test coverage.

![alt_text](/design-systems-for-developers/Feedback-wanted80.png)

Once you’re done, the build will pass in Chromatic.

![alt_text](/design-systems-for-developers/Feedback-wanted81.png)

Which, in turn, updates the PR check in GitHub.

![alt_text](/design-systems-for-developers/Feedback-wanted82.png)

The tests were successfully updated. In the future, regressions will have a tough time sneaking into the design system.

## Distribute

We have an open pull request that adds AvatarList to the design system. Our stories are written, the tests pass, and documentation exists. At last, we’re ready to update our design system package with Auto and npm.\*\* \*\*

Add the `minor` label to the PR. This tells Auto to update the minor version of the package on merge.

![alt_text](/design-systems-for-developers/Feedback-wanted83.png)

Merge the pull request.

![alt_text](/design-systems-for-developers/Feedback-wanted84.png)

Navigate to your package on npm and hang tight for a few minutes while the package is updated.

![alt_text](/design-systems-for-developers/Feedback-wanted85.png)

Success! Your design system package was updated from the comfort of GitHub. No need to touch the command line or fuss with npm. Update the `learnstorybook-design-system` dependency in the example app to start using AvatarList.

## Your journey begins

_Design Systems for Developers_ highlights the end-to-end workflow used by professional frontend teams to give you a headstart as you develop your own. As your design system grows add, rearrange, and extend these tools to fit your team’s needs.

Chapter 9 concludes with the complete sample code, helpful resources, and frequently asked questions from developers.
