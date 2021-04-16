---
title: 'Tutorial Automated visual testing'
tocTitle: 'Tutorial — Automate'
description: 'Learn how to automate visual testing to catch regressions'
commit: 'b1b5f0b'
---

Almost there. So far, we've implemented the `CommentList` and used Visual TDD to build out all its states. We now need to ensure that future changes do not have unintended consequences.

Let's look at how to use snapshots to decrease incoming bugs and prevent UI regressions altogether.

## "Does it look right?"

It's been one of the central points of this handbook. We learned that visual testing is a practical way to verify that our components match the intended design. Empowered by Storybook and streamlined with Visual TDD. It leads to our ultimate goal, creating solid UIs better equipped to handle hardships.

However, creating components is just one aspect of frontend engineering. They must also remain reliable over time. Successful apps require:

- 🎛️ Sustained effort to add features
- 📈 Improved performance
- 🕳️ Patch security holes

Over the natural course of app development, component changes inevitably produce UI regressions.

Forward-thinking teams guard against regressions with test suites composed of unit tests and end-to-end tests, along with a continuous integration tool. But historically, it has been challenging to add visual tests to this suite.

Previous approaches were either too brittle (and complex) or too broad for many teams to adopt. With modern UIs, their inherent modularity makes it much easier to scope tests and pinpoint possible regressions.

## Automated visual testing

By taking snapshots of visual tests, you’ll have a recipe for squashing UI regressions once and for all. We capture an image of the component state, then use a machine to generate a pixel-by-pixel diff. Which then identifies whether components have changed in appearance.

We'll demonstrate a visual test and reviewing workflow with [Chromatic](https://www.chromatic.com/), a service created by Storybook maintainers.

![How visual testing snapshots work](/visual-testing-handbook/how-snapshots work.png)

### Setup a repository in GitHub

Before we begin, our local code needs to sync with a remote version control service.

Go to GitHub and create a new repository for the project [here](https://github.com/new). Name the repo "commentlist", same as our local project.

![Set up comment list repo in GitHub](/visual-testing-handbook/commentlist-gh-repo-optimized.png)

Then follow the instructions to set up the repository:

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/commentlist.git
git push -u origin main
```

<div class="aside">
💡 Don't forget to replace your-username with your account name.
</div>

## Setup Chromatic

First, go to [chromatic.com](https://www.chromatic.com/) and signup with your GitHub account.

![Chromatic sign in](/visual-testing-handbook/chromatic-sign-in-optimized.png)

From there, choose the repository you've just created.

<div class="aside">
 TODO: add video similar to the other tutorials (Intro Storybook and Design Systems) to select the repo in Chromatic
</div>

### Enable UI Tests

UI tests capture a visual snapshot of every story in a cloud browser environment. Whenever you push code, Chromatic generates a new set of snapshots and compares them against baselines. If there are visual changes, you verify if they’re intentional.

Enable visual tests for your project on the manage screen.

![enable UI tests](/visual-testing-handbook/enable-uitests.png)

### Establish baselines

Add Chromatic as a development package to your project:

```shell
yarn add -D chromatic
```

Once it’s finished installing, we have all that we need. Now is an excellent time to commit and push the changes to the remote repository.

```shell
git add .
git commit -m "Added Chromatic"
git push
```

Let's build and deploy our Storybook. Run the following command:

```shell
yarn chromatic --project-token=<project-token>
```

<div class="aside">
💡 Don't forget to replace the <code>project-token</code> with one Chromatic supplies on the website.
</div>

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

With this one command, you've published your Storybook and triggered Chromatic to capture a visual snapshot of each story (using a cloud browser) and set it as the baseline.

Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes.

![Baselines in Chromatic](/visual-testing-handbook/commentlist-accepted-baselines-optimized.png)

### Run tests

Every time a pull request contains UI changes, big or small, it's helpful to run these checks. Chromatic will compare new snapshots to existing baselines from previous builds. The list of changes is shown on the build page in the web app. The build will be marked “unreviewed” and the changes listed in the “Tests” table.

Let's make a small UI change to demonstrate this concept.

```shell
git checkout -b change-commentlist-outline
```

Tweak the `CommentList` component

```diff:title=src/components/CommentList.js
import React from 'react';

import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

const CommentListDiv = styled.div`
  font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  display: inline-block;
  vertical-align: top;
  width: 265px;
`;

const CommentItemDiv = styled.div`
  font-size: 12px;
  line-height: 14px;
  clear: both;
  height: 48px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0;
  background: linear-gradient(
    120deg,
    rgba(248, 248, 254, 0.95),
    rgba(250, 250, 250, 0.95)
  );
  border-radius: 48px;
+ border: 4px solid red;
+ font-weight: bold;
`;

const AvatarDiv = styled.div`
  float: left;
  position: relative;
  overflow: hidden;
  height: 48px;
  width: 48px;
  margin-right: 14px;
  background: #dfecf2;
  border-radius: 48px;
`;

const AvatarImg = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background: #999;
`;

const MessageDiv = styled.div`
  overflow: hidden;
  padding-top: 10px;
  padding-right: 20px;
`;

const AuthorSpan = styled.span`
  font-weight: bold;
`;
const TextSpan = styled.span``;

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
`;

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>empty</div>;
  }
  if (comments.length === 0) {
    return <div>loading</div>;
  }
  return (
    <>
    <GlobalStyle/>
    <CommentListDiv>
      {comments.map(({ text, author: { name, avatar } }) => (
        <CommentItemDiv key={`comment_${name}`}>
          <AvatarDiv>
            <AvatarImg src={avatar} />
          </AvatarDiv>
          <MessageDiv>
            <AuthorSpan>{name}</AuthorSpan> <TextSpan>{text}</TextSpan>
          </MessageDiv>
        </CommentItemDiv>
      ))}
    </CommentListDiv>
    </>
  );
}

CommentList.propTypes = {
  /**
   * Is the component in the loading state
   */
  loading: PropTypes.bool,

  /**
   * Total number of comments
   */
  totalCount: PropTypes.number,
  /**
   * List of comments
   */
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    })
  ),
};

CommentList.defaultProps = {
  loading: false,
  totalCount: 10,
  comments: [],
};

```

Commit the change, push it to the repo and run Chromatic:

```shell
git commit -am "make CommentList sparkle"
git push -u origin change-commentlist-outline
yarn chromatic --project-token=<project-token>
```

Open a pull request for the new branch in your GitHub repository.

![Comment list pull requested opened in GitHub](/visual-testing-handbook/commentlist-gh-pullrequest-optimized.png)

Check the PR checks and click "🟡 UI Test" to view the new changes published into Chromatic.

![New changes published to Chromatic](/visual-testing-handbook/commentlist-ui-tests-chromatic-optimized.png)

## Review and merge changes

Visual regression testing ensures components don’t change by accident. But it’s still up to us to determine whether changes are intentional or not.

If a change is intentional we'll need to update the baseline so that future tests are compared to the latest version of the story. If a change is unintentional it needs fixing.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

When we’ve finished reviewing we’re ready to merge UI changes with confidence—knowing that updates won’t accidentally introduce bugs.

After you merge your code, Chromatic will also apply accepted baselines to stories on the target branch. That means you’ll only need to accept baselines a single time.

## Continuous integration

Running this command each time we make a change is tiresome. Ideally, we'd like to run these tests automatically whenever we push code. Chromatic can be used in CI/CD systems to indicate success and unblock deployment. [Learn about CI setup](https://www.chromatic.com/docs/ci).
