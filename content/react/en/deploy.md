---
title: "Deploy Storybook"
tocTitle: "Deploy"
description: "Deploy Storybook online with GitHub and Netlify"
---

In this tutorial we ran Storybook on our development machine. You may also want to share that Storybook with the team, especially the non-technical members. Thankfully, it’s easy to deploy Storybook online.

<div class="aside">
<strong>Did you setup Chromatic testing earlier?</strong>
<br/>
🎉 Your stories are already deployed! Chromatic securely indexes your stories online and tracks them across branches and commits. Skip this chapter and go to the <a href="/react/en/conclusion">conclusion</a>.
</div>

## Exporting as a static app

To deploy Storybook we first need to export it as a static web app. This functionality is already built into Storybook, we just need to activate it by adding a script to `package.json`.

```javascript
// package.json

{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

Now when you build Storybook via `npm run build-storybook`, it will output a static Storybook in the `storybook-static` directory.

## Continuous deploy

We want to share the latest version of components whenever we push code. To do this we need to continuous deploy Storybook. We’ll rely on GitHub and Netlify to deploy our static site. We’re using the Netlify free plan.

### GitHub

First you want to setup Git for your project in the local directory. If you're following along from the previous testing chapter jump to setting up a repository on GitHub.

```bash
$ git init
```

Next add files to the first commit.

```bash
$ git add .
```

Now commit the files.

```bash
$ git commit -m "taskbox UI"
```

Go to GitHub and setup a repository [here](https://github.com/new). Name your repo “taskbox”.

![GitHub setup](/github-create-taskbox.png)

In the new repo setup copy the origin URL of the repo and add it to your git project with this command:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finally push the repo to GitHub

```bash
$ git push -u origin master
```

### Netlify

Netlify has a continuous deployment service built in which will allow us to deploy Storybook without needing to configure our own CI.

<div class="aside">
If you use CI at your company, add a deploy script to your config that uploads <code>storybook-static</code> to a static hosting service like S3.
</div>

[Create an account on Netlify](https://app.netlify.com/start) and click to “create site”.

![Netlify create site](/netlify-create-site.png)

Next click the GitHub button to connect Netlify to GitHub. This allows it to access our remote Taskbox repo.

Now select the taskbox GitHub repo from the list of options.

![Netlify connect to repo](/netlify-account-picker.png)

Configure Netlify by highlighting which build command to run in its CI and which directory the static site is outputted in. For branch choose `master`. Directory is `storybook-static`. Build command use `yarn build-storybook`.

![Netlify settings](/netlify-settings.png)

Submit the form to build and deploy the code on the `master` branch of taskbox.

When that's finished we'll see a confirmation message on Netlify with a link to Taskbox’ Storybook online. If you're following along, your deployed Storybook should be online [like so](https://clever-banach-415c03.netlify.com/).

![Netlify Storybook deploy](/netlify-storybook-deploy.png)

We finished setting up continuous deployment of your Storybook! Now we can share our stories with teammates via a link.

This is helpful for visual review as part of the standard app development process or simply to show off work 💅.
