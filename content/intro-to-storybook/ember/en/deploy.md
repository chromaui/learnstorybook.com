---
title: 'Deploy Storybook'
tocTitle: 'Deploy'
description: 'Deploy Storybook online with GitHub and Netlify'
---

In this tutorial we ran Storybook on our development machine. You may also want to share that Storybook with the team, especially the non-technical members. Thankfully, it’s easy to deploy Storybook online.

<div class="aside">
<strong>Did you setup Chromatic testing earlier?</strong>
<br/>
🎉 Your stories are already deployed! Chromatic securely indexes your stories online and tracks them across branches and commits. Skip this chapter and go to the <a href="/ember/en/conclusion">conclusion</a>.
</div>

## Exporting as a static app

To deploy Storybook we first need to export it as a static web app. This functionality is already built into Storybook and Ember, we just need to make a small change to our `package.json` file in order for both frameworks to be able to work together and successfully deploy our Storybook.

Add the following to your scripts:

```javascript

// package.json
{
    "scripts":{
        "pre-build":"ember build",
        "deploy-storybook":"run-s pre-build build-storybook"
    }
}
```

Now when you build Storybook via `npm run deploy-storybook`, it will output a static Storybook in the `storybook-static` directory.

## Continuous deploy

We want to share the latest version of components whenever we push code. To do this we need to continuous deploy Storybook. We’ll rely on GitHub and Netlify to deploy our static site. We’re using the Netlify free plan.

### GitHub

If you're following along from the previous testing chapter jump to setting up a repository on GitHub.

When the project was initialized with Ember CLI, a local repository was already setup for you. At this stage it's safe to add the files to the first commit.

```bash
$ git add .
```

Now commit the files.

```bash
$ git commit -m "taskbox UI"
```

### Setup a repository in GitHub

Go to GitHub and setup a repository [here](https://github.com/new). Name your repo “taskbox”.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

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

![Netlify create site](/intro-to-storybook/netlify-create-site.png)

Next click the GitHub button to connect Netlify to GitHub. This allows it to access our remote Taskbox repo.

Now select the taskbox GitHub repo from the list of options.

![Netlify connect to repo](/intro-to-storybook/netlify-account-picker.png)

Configure Netlify by highlighting which build command to run in its CI and which directory the static site is outputted in. For branch choose `master`. Directory is `storybook-static`. Build command use `npm run deploy-storybook`.

![Netlify settings](/intro-to-storybook/netlify-settings-ember.png)

<div class="aside"><p>Should your deployment fail with Netlify, add the <a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet </a> flag to your <code>build-storybook</code> script.</p></div>

Submit the form to build and deploy the code on the `master` branch of taskbox.

When that's finished we'll see a confirmation message on Netlify with a link to Taskbox’ Storybook online. If you're following along, your deployed Storybook should be online [like so](https://clever-banach-415c03.netlify.com/).

<div class="aside"><p>Should your deployment fail mentioning that the folder is not present, trigger a local build, then uncomment the dist folder from the <code>.gitignore</code>file.</p><p>Commit the changes, then the netlify CI should pick on on it and will succeed in building the app along side with Storybook.</p></div>

![Netlify Storybook deploy](/intro-to-storybook/netlify-storybook-deploy.png)

We finished setting up continuous deployment of your Storybook! Now we can share our stories with teammates via a link.

This is helpful for visual review as part of the standard app development process or simply to show off work 💅.
