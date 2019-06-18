# Learn Storybook

Learn Storybook teaches you Storybook by building a UI from scratch. We walk through core concepts from building and testing to deployment. This tutorial is intended to get you up to speed on Storybook best practices in a fast and approachable way.

## Contribute

Contributions to Learn Storybook are encouraged! If it’s something small like grammar or punctuation, open up a pull request. If it’s a bigger change, [add an issue](https://github.com/chromaui/learnstorybook.com/issues) for discussion.

You'll find the chapters in the [`/content`](https://github.com/chromaui/learnstorybook.com/tree/master/content) directory.

We need help translating Learn Storybook to new languages. [Find out more »](https://github.com/chromaui/learnstorybook.com/issues/3)
Traditional Chinese translation is converted from Simplified Chinese using [OpenCC](https://github.com/BYVoid/OpenCC). Please help us correct any idiomatic errors.

If you want to add a new chapter, create an identically named file in `content/react/en` and in `content/react/es`. If you are unable to write in one of the required languages, simply add

```
---
title: "[Title-cased Filename]"
tocTitle: "[Headline on page]"
description: "[A general description of what you're learning about on this page.]"
---

Coming Soon
```

to that localized file, and a translator will assist in finishing out the PR when possible. Once the content is created, add the file name to the toc array in `gatsby-config.js`

## Example app code

![Taskbox UI](https://raw.githubusercontent.com/chromaui/learnstorybook.com/master/static/ss-browserchrome-taskbox-learnstorybook.png)

You'll build Taskbox UI as part of the tutorial. Find the finished code below with commits synced to the chapters.

[📕 **GitHub repo: chromaui/learnstorybook-code**](https://github.com/chromaui/learnstorybook-code)

## Who made LearnStorybook.com?

The text, code, and production were contributed by [Chroma](https://blog.hichroma.com/). The tutorial was inspired by Chroma’s popular [GraphQL + React tutorial series](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858)

## Develop

Install packages and run with `yarn dev`.

## Contributors

- [Tom Coleman @tmeasday](https://twitter.com/tmeasday)
- [Dominic Nguyen @domyen](https://twitter.com/domyen)
- [Carlos Iván Suarez @icarlossz](https://twitter.com/icarlossz)
- [Luciano M. Guasco @luchux](https://twitter.com/luchux)
- [yobrave](https://github.com/chinanf-boy)
- [Daniel Duan](https://twitter.com/danduan)
- [Carlos Vega](https://twitter.com/__el_Negro)
- [Matt Rothenberg](https://twitter.com/mattrothenberg)
- [Kyle Holmberg](https://twitter.com/kylemh_)
- You? [Become an OSS contributor](https://www.learnstorybook.com/intro-to-storybook/react/en/contribute/)
