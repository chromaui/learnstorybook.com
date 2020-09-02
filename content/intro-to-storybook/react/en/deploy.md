---
title: 'Deploy Storybook'
tocTitle: 'Deploy'
description: 'Learn how to deploy Storybook online'
---

Throughout this tutorial, we built components on our local development machine. At some point, we'll need to share our work to get team feedback. Let's deploy Storybook online to help teammates review UI implementation.

## Exporting as a static app

To deploy Storybook we first need to export it as a static web app. This functionality is already built-in to Storybook and pre-configured.

Running `yarn build-storybook` will output a static Storybook in the `storybook-static` directory, which can then be deployed to any static site hosting service.

## Publish Storybook

This tutorial uses <a href="https://www.chromatic.com/">Chromatic</a>, a free publishing service made by the Storybook maintainers. It allows us to deploy and host our Storybook safely and securely in the cloud.

### Setup a repository in GitHub

Before we begin, our local code needs to sync with a remote version control service. When our project was initialized in the [Get started chapter](/react/en/get-started/), Create React App (CRA) already created a local repository for us. At this stage it's safe to add our files to the first commit.

Issue the following commands to add and commit the changes we've done so far.

```bash
$ git add .
```

Followed by:

```bash
$ git commit -m "taskbox UI"
```

Go to GitHub and create a new repository for our project [here](https://github.com/new). Name the repo “taskbox”, same as our local project.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

In the new repo, grab the origin URL of the repo and add it to your git project with this command:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finally, push our local repo to the remote repo on GitHub with:

```bash
$ git push -u origin master
```

### Get Chromatic

Add the package as a development dependency.

```bash
yarn add -D chromatic
```

Once the package is installed, [login to Chromatic](https://www.chromatic.com/start) with your GitHub account (Chromatic will only ask for lightweight permissions). Then we'll create a new project called name "taskbox" and sync it with the GithHub repository we've setup.

Click `Choose GitHub repo` under collaborators and select your repo.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copy the unique `project-token` that was generated for your project. Then execute it, by issuing the following in the command line, to build and deploy our Storybook. Make sure to replace `project-token` with your project token.

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

When finished, you'll get a link `https://random-uuid.chromatic.com` to your published Storybook. Share the link with your team to get feedback.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

Hooray! We published Storybook with one command, but manually running a command every time we want to get feedback on UI implementation is repetitive. Ideally, we'd publish the latest version of components whenever we push code. We'll need to continuously deploy Storybook.

## Continuous deployment with Chromatic

Now that our project is hosted in a GitHub repository, we can use a continuous integration(CI) service to deploy our Storybook automatically. [GitHub Actions](https://github.com/features/actions) is a free CI service that's built into GitHub that makes automatic publishing easy.

### Add a GitHub Action to deploy Storybook

In the root folder of our project, create a new directory called `.github` then create another `workflows` directory inside of it.

Create a new file called `chromatic.yml` like the one below. Replace to change `project-token` with your project token.

```yaml
# .github/workflows/chromatic.yml
# name of our action
name: 'Chromatic Deployment'
# the event that will trigger the action
on: push

# what the action will do
jobs:
  test:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
      - uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # our project token, to see how to obtain it
          # refer to https://www.learnstorybook.com/intro-to-storybook/react/en/deploy/
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>For brevity purposes <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> weren't mentioned. Secrets are secure environment variables provided by GitHub so that you don't need to hard code the <code>project-token</code>.</p></div>

### Commit the action

In the command line, issue the following command to add the changes that were done:

```bash
git add .
```

Then commit them by issuing:

```bash
git commit -m "GitHub action setup"
```

Finally push them to the remote repository with:

```bash
git push origin master
```

Once you’ve set up the GitHub action. Your Storybook will be deployed to Chromatic whenever you push code. You can find all the published Storybook’s on your project’s build screen in Chromatic.

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

Click the latest build, it should be the one at the top.

Then, click the `View Storybook` button to see the latest version of your Storybook.

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

<!--
And that's it, all is required is to commit and push the changes to our repository and we've successfully automated our Storybook deployment
 -->

Use the link and share it with your team members. This is helpful as a part of the standard app development process or simply to show off work 💅.
