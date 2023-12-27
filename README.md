# Learn Storybook

Learn Storybook teaches you how to use Storybook and Component-Driven Development to build UIs from scratch. We walk through core concepts from building and testing to deployment. Using engaging guides and content, we hope to get you up to speed on Storybook best practices in a fast and approachable way.

## Who made LearnStorybook.com?

The text, code, and production were contributed by [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook). The tutorial was inspired by Chromatic’s popular [GraphQL + React tutorial series](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6)

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
- You? [Become an OSS contributor](https://storybook.js.org/tutorials/intro-to-storybook/react/en/contribute/)

## Contribute

Contributions to Learn Storybook are encouraged! If it’s something small like grammar, punctuation, or even a code snippet, first check the [open pull requests](https://github.com/chromaui/learnstorybook.com/pulls) to see if it's already being addressed, if it's not, then open up a pull request. If it’s a bigger change like adding a new guide or chapter, [add an issue](https://github.com/chromaui/learnstorybook.com/issues) for discussion before getting started.

You'll find the guides and chapters in the [`/content`](https://github.com/chromaui/learnstorybook.com/tree/master/content) directory. Content is organized at the guide level. Within the `/content` directory, you'll find directories for the current guides that are offered. Within each guide directory, you can see the chapters that make up that guide.

We love translations of our guides to new languages. That helps the Storybook community learn in the language they're most comfortable with. [Find out more »](https://github.com/chromaui/learnstorybook.com/issues/3).

Traditional Chinese translation is converted from Simplified Chinese using [OpenCC](https://github.com/BYVoid/OpenCC). Please help us correct any idiomatic errors.

### Running the project locally

#### Storybook instructions

The Storybook for Storybook contains every UI component. The UI is built following [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), a process that builds UIs from the “bottom up” starting with components and ending with screens. That means contributors should compose UIs in Storybook _before_ integration with the Gatsby app.

1. Run `yarn install` to install dependencies
2. Run `yarn storybook` to start Storybook on `localhost:6006`

#### Gatsby instructions

Gatsby is used for static site generation. To run the project locally, you'll need to:

1. Run `yarn install` to install dependencies
2. Run `yarn extract-sb-docs-metadata` to fetch content from the main Storybook repo
3. Set up a `.env.development` file with the following environment variables:

```plaintext
SKIP_DX_DATA=true
```

4. Run `yarn dev` to start the development server

### Adding new content

Thanks for taking the time to contribute and add content to Learn Storybook! The tutorials below reference file paths, which will be represented in this format:

`/content/:guide/:framework?/:language/:chapter.md`

Path parts that are prefixed with a colon (`:`) are meant to be dynamic names that are chosen by you. `:guide` becomes `intro-to-storybook` or whatever you decide to use for your content. If a path part is followed by a question mark (`?`), then it is optional.

### Add a guide

1. Within the `/content` directory, add a directory for your new guide: `/content/:guide`. The name you choose for the directory will be used as the slug for the directory when you access it in a browser.

2. Add a new file, `index.md`, to your newly created directory: `/content/:guide/index.md`. This file will contain the content and metadata for your guide that will be used to populate the site. Using [`intro-to-storybook`'s `index.md`](https://github.com/chromaui/learnstorybook.com/tree/master/content/intro-to-storybook/index.md) as an example, populate the following required frontmatter fields with meaningful content about your guide:

```
---
title:
heroDescription:
description:
overview:
themeColor:
---
```

3. See the [guide frontmatter](#guide-frontmatter) section for additional customization options, many of which you'll want to use in order to create a guide that feels complete.

4. Populate the guide content in markdown underneath the frontmatter. This content shows up on the guide page after the table of contents. For example, you can insert images, call out frameworks, or provide details about the project contained within the guide.

5. Visit your guide at `http://localhost:8000/:guide`

### Add a chapter

_If you are translating a chapter that already exists in a different language, skip to step 2._

_If you are writing a new chapter for a language that already exists, skip to step 3._

1. Decide if your guide should be organized by framework. Will the examples and messaging be specific to the reader's framework of choice? If so, add an additional directory for the framework: `/content/:guide/:framework`. If not, carry on to the next step -- you will put your translation directories and chapters inside the `/content/:guide` directory.

2. Add a directory for the language that you will use to write your chapter. The naming of this language directory is important and should mirror what has been used in other guides for similar translations. Additionally, [a helper](https://github.com/chromaui/learnstorybook.com/tree/master/src/lib/getLanguageName.js) is used across the app to transform the language into a human readable name, so make sure to update that helper if you are adding a language that has not yet been used. Know of a better way to convert this language into something more readable? [Start an issue](https://github.com/chromaui/learnstorybook.com/issues) and let us know your idea.

3. Add a new file for the chapter that you are going to write:

`/content/:guide/:framework?/:language/:chapter.md`

4. Update the guide's `toc` frontmatter. Each time you add a new chapter, make sure to go back and update the guide's `toc` in order to populate the Table of Contents as well as control the order of the chapters. Using the name of the file that you just created in step 3, go back to the guide frontmatter and update the `toc`:

```
toc: [":chapter"]
```

5. Populate the [chapter frontmatter](#chapter-frontmatter).

6. Populate the chapter content in markdown underneath the frontmatter.

7. Visit your chapter at `http://localhost:8000/:guide/:chapter` or by going to `http://localhost:8000/:guide/` and subsequently navigating to your chapter from the Table of Contents.

### Guide frontmatter

---

**Required**

---

#### `title`

The primary name for your guide. What is it called?

#### `description`

A relatively short description of the guide. Used primarily in the primary navigation tooltip menu.

#### `heroDescription`

A message about the guide that will live prominently on the guide page. Why is this guide important? What is the context around the guide that helps reinforce the importance of moving forward to read the guide?

#### `overview`

A section on the guide page discussing the things you will learn in the guide.

#### `themeColor`

A named color, hex, rgba value, etc. Basically anything you can use in the `color` css property.

#### `toc`

A list and the corresponding order of the chapters in the guide. Short for "Table of Contents". List items should map to the file name of the chapter.

---

**Suggested**

---

#### `codeGithubUrl`

The URL to the repository that has the code examples for your guide. Used in combination with the `commit` frontmatter in the chapter to link chapters to their corresponding code examples.

#### `coverImagePath`

The primary image for the guide. Used on the guide page.

#### `thumbImagePath`

A thumbnail representation of the cover image. Used in smaller places such as the guide list on the index page.

#### `contributorCount`

A string representation of the amount of contributors to this guide. Since the Github API only shows contributors to the repo as a whole rather than specific directories, we do this manually for now. Know of a better way? [Start an issue](https://github.com/chromaui/learnstorybook.com/issues) and let us know your idea.

#### `authors`

A list of authors of the guide. Format:

```
authors:
  [
    {
      src: "",
      name: "",
      detail: "",
    },
  ]
```

#### `contributors`

A list of contributors to the guide. Format:

```
contributors:
  [
    {
      src: "",
      name: "",
      detail: "",
    },
  ]
```

#### `heroAnimationName`

An animation to use on the guide's hero image, which corresponds with a named export from the [animation styles file](https://github.com/chromaui/learnstorybook.com/tree/master/src/styles/animations.js). The export must contain the entire CSS property and value for the animation.

#### `twitterShareText`

The text content for the tweet that is auto-populated when people choose to share the guide on Twitter. The URL that is included in the tweet is auto-generated based on the guide, but the individual guide can control the messaging before the link.

### Chapter frontmatter

---

**Required**

---

#### `title`

The primary name for the chapter. What is it called?

#### `tocTitle`

Specify a different title to only be used for the Table of Contents sections.

#### `description`

A brief description of the chapter. Shown underneath the chapter title on the chapter page as well as in the Table of Contents on the guide page.

---

**Suggested**

---

#### `commit`

The short commit hash that maps to the commit on the code example repo for this chapter.

---

## Current Guide Status

Currently, the [Intro to Storybook tutorial](https://storybook.js.org/tutorials/intro-to-storybook/) features the following translations. Some are updated; others are not. If you want to get acquainted with Storybook and you are a native speaker of any of the languages detailed below. Help us out updating the translations. Leave a comment on the issue above.

| Framework    | Translation      | Updated |
| ------------ | ---------------- | ------- |
| React        | English          | ✅      |
|              | Spanish          | ❌      |
|              | Portuguese       | ❌      |
|              | ZH-TW            | ❌      |
|              | Mainland Chinese | ❌      |
|              | Dutch            | ❌      |
|              | Korean           | ❌      |
|              | Japanese         | ❌      |
|              | French           | ❌      |
|              | Italian          | ❌      |
|              | German           | ❌      |
| React Native | English          | ✅      |
|              | Spanish          | ❌      |
| Vue          | English          | ✅      |
|              | Spanish          | ❌      |
|              | Portuguese       | ❌      |
|              | French           | ❌      |
|              | Mainland Chinese | ❌      |
| Angular      | English          | ✅      |
|              | Spanish          | ❌      |
|              | Portuguese       | ❌      |
|              | Japanese         | ✅      |
| Svelte       | English          | ❌      |
|              | Spanish          | ❌      |
| Ember        | English          | ❌      |

---

The [Design Systems for Developers tutorial](https://storybook.js.org/tutorials/design-systems-for-developers/) features the following translations. Some are updated; some are not. If you want to expand your Storybook knowledge and learn how to build an industry-grade component library, and you're a native speaker of any of the languages, detailed below. Help us out by updating the translations. Comment in the issue above.

| Translation      | Updated |
| ---------------- | ------- |
| English          | ✅      |
| Korean           | ❌      |
| Portuguese       | ❌      |
| Japanese         | ❌      |
| Mainland Chinese | ❌      |

---

The [Visual Testing handbook](https://storybook.js.org/tutorials/visual-testing-handbook/) features the following translations. If you want to learn more about testing and solid workflows that can help you as a frontend developer, and you're a native speaker of any of the languages, detailed below. Help us out by updating the translations. Leave a comment on the issue above.

| Translation | Updated |
| ----------- | ------- |
| English     | ✅      |
| Spanish     | ❌      |

The [UI Testing handbook](https://storybook.js.org/tutorials/ui-testing-handbook/) features the following translations. If you want to learn more about industry-grade testing patterns and workflows, and you're a native speaker of any of the languages, detailed below. Help us out by updating the translations. Leave a comment on the issue above.

| Translation | Updated |
| ----------- | ------- |
| English     | ✅      |
| Korean      | ❌      |
