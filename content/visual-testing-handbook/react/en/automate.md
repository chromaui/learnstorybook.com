---
title: 'Automate visual testing'
tocTitle: 'Automate'
description: 'Learn how to automate visual testing to conquer UI bugs'
commit: 'b1b5f0b'
---

This chapter will teach us how to use a professional workflow for making robust UI that can help decrease incoming bugs and prevent UI regressions altogether. These processes are used today by professional teams all over the world.

## "Does it look right?"

It's been one of the central points of this handbook. We learned that visual testing is a practical way to verify that our components match the intended design. Empowered by Storybook, and streamlined with Visual Test-Driven Development (**VTDD**). It leads to our ultimate goal, creating solid UIs better equipped to handle hardships.

However, creating components is just one aspect of frontend engineering. They must also remain reliable over time. Successful apps require:

- 🎛️ Sustained effort to add features
- 📈 Improved performance
- 🕳️ Patch security holes

Over the natural course of app development, component changes inevitably produce UI regressions.

Forward-thinking teams already guard against regressions with test suites composed of unit tests, end-to-end tests, along a continuous integration tool. But historically, it has never been simple to add visual tests to the suite.

Previous approaches were either too brittle (and complex) or too broad for many teams to adopt. With modern UIs, their inherent modularity makes it much easier to scope tests and pinpoint possible regressions.

## Publish Storybook

We'll demonstrate a visual test and reviewing workflow with [Chromatic](https://www.chromatic.com/), a free publishing service created by the Storybook maintainers. It allows you to deploy and host your Storybook safely and securely in the cloud.

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

### Get Chromatic

First, go to [chromatic.com](https://www.chromatic.com/) and signup with your GitHub account.

![Chromatic sig in](/visual-testing-handbook/chromatic-sign-in-optimized.png)

From there, choose the repository you've just created.

<div class="aside">
 TODO: add video similar to the other tutorials (Intro Storybook and Design Systems) to select the repo in Chromatic
</div>

<div class="aside">
💡 Behind the scenes, it will synch access permissions and set up the pull request checks. If you're wondering about permissions, Chromatic only asks for lightweight ones.
</div>

Add Chromatic as a development package:

```shell
yarn add -D chromatic
```

Once installed, run the following command to build and deploy your Storybook.

```shell
yarn chromatic --project-token=<project-token>
```

<div class="aside">
💡 Don't forget to replace the <code>project-token</code> with the Chromatic supplies on the website.
</div>

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

We published Storybook with one command. 🎉

But, running this command each time we make a change is tiresome. Ideally, we'd like to publish the latest version of our components whenever we push code. We need a way to deploy Storybook automatically.

## Continuous deployment with Chromatic

Now that our project is hosted in a GitHub repository, we can use GitHub Actions, a free CI service built into GitHub that makes automatic deployments easy.

### Deploy Storybook with GitHub Actions

In the project's root folder, create a new directory called `.github`, and inside it, another one called `workflows`.

Add a new file called `chromatic.yml` similar to the one below. Make sure you replace the `projectToken` with your own.

```yml:title=.github/workflows/chromatic.yml
# Name of our action
name: 'Chromatic'
# The event that will trigger the action
on: push

# What the action will do
jobs:
  test:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/visual-testing-handbook/react/en/automate/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">
💡 For brevity purposes, we didn't mention <a href="https://docs.github.com/en/actions/reference/encrypted-secrets">GitHub secrets</a>. Secrets are secure environment variables provided by GitHub so that you don't need to hard-code the <code>projectToken</code>.
</div>

### Commit the action

Issue the following command to add the changes introduced:

```shell
git add .
```

Then commit them by issuing:

```shell
git commit -m "Automated Storybook deployment with GitHub Actions"
```

Finally, push them to the remote repository with:

```shell
git push origin main
```

Once you've set up the GitHub Action, your Storybook will be deployed to Chromatic whenever you push code. You can find your published Storybook on your project's build screen in Chromatic.

<video autoPlay muted playsInline loop>
  <source 
    src="/visual-testing-handbook/commentlist-published-chromatic-optimized.mp4"
    type="video/mp4"/>
</video>

## Request visual review from the team

Every time a pull request contains UI changes, big or small, it's helpful to start a visual review process with all stakeholders to reach a consensus on what will be shipped. With that, we avoid unwanted bugs and time-consuming rework.

We're going to demo visual review by making a small UI change on a brand new branch.

```shell
git checkout -b change-commentlist-outline
```

Start by tweaking the component.

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

Commit the change and push it to the repo:

```shell
git commit -am "make CommentList sparkle"
git push -u origin change-commentlist-outline
```

Open a pull request for the new branch in your GitHub repository. Once you've created the pull request, the CI job will automatically run.

![Comment list pull requested opened in GitHub](/visual-testing-handbook/commentlist-pull-request-GitHub-optimized.png)

Check the PR checks and click "🟡 UI Review" to view the new changes published into Chromatic.

![New changes published to Chromatic](/visual-testing-handbook/commentlist-chromatic-ui-changes-optimized.png)

Click the "Assign reviewers button" and add a team member to review your changes, and wait for the feedback to roll in.

![Why?!](/design-systems-for-developers/github-visual-review-feedback.gif)

<div class="aside">
TODO: add a Why??? in a comment in chromatic if possible
</div>

If you pair visual testing with Storybook, and visual review with Chromatic, you'll have a recipe for squashing UI regressions once and for all.

![Visual review flywheel](/design-systems-for-developers/visual-review-loop.jpg)

## Merge changes

Once we’ve finished the review process, collected the necessary feedback, we’re ready to merge our changes, knowing that they won't create bugs or introduce unwanted regressions.

<div class="aside">
Todo: Add asset of accepted changes. After feedback gathered.
</div>
