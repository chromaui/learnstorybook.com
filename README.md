# Learn Storybook

Learn Storybook teaches you how to use Storybook and Component-Driven Development to build UIs from scratch. We walk through core concepts from building and testing to deployment. Using engaging guides and content, we hope to get you up to speed on Storybook best practices in a fast and approachable way.

## Contribute

Contributions to Learn Storybook are encouraged! If it’s something small like grammar or punctuation, open up a pull request. If it’s a bigger change like adding a new guide or chapter, [add an issue](https://github.com/chromaui/learnstorybook.com/issues) for discussion before getting started.

You'll find the guides and chapters in the [`/content`](https://github.com/chromaui/learnstorybook.com/tree/master/content) directory. Content is organized at the guide level. Within the `/content` directory, you'll find directories for the current guides that are offered. Within each guide directory, you can see the chapters that make up that guide.

We need help translating Learn Storybook to new languages. [Find out more »](https://github.com/chromaui/learnstorybook.com/issues/3)
Traditional Chinese translation is converted from Simplified Chinese using [OpenCC](https://github.com/BYVoid/OpenCC). Please help us correct any idiomatic errors.

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

## Adding new content

Thanks for taking the time to contribute and add content to Learn Storybook! The tutorials below reference file paths which will be represented in this format:

`/content/:guide/:framework?/:language/:chapter.md`

File parts that are prefixed with a colon (`:`) are meant to be dynamic names that are chosen by you. `:guide` becomes `intro-to-storybook` or whatever you decide to use for your content. If a file part is followed by a question mark (`?`), then it is optional.

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

4. Populate the guide content in markdown underneath the frontmatter. This content shows up on the guide page after the table of contents. You can insert images, call out frameworks, or provide details about the project contained within the guide.

5. Visit your guide at `http://localhost:8000/:guide`

### Add a chapter

_If you are translating a chapter that already exists in a different language, skip to step 2._

_If you are writing a new chapter for a language that already exists, skip to step 3._

1. Decide if your guide should be organized by framework. Will the examples and messaging be specific to the reader's framework of choice? If so, add an additional directory for the framework: `/content/:guide/:framework` (`react`, `angular`, `vue`, etc.). If not, carry on to the next step -- you will put your translation directories and chapters inside the `/content/:guide` directory.

2. Add a directory for the language that you will use to write your chapter. The naming of this language directory is important and should mirror what has been used in other guides for similar translations. Additionally, [a helper](https://github.com/chromaui/learnstorybook.com/tree/master/src/lib/getLanguageName.js) is used across the app to transform the language into a human readable name, so make sure to update that helper if you are adding a language which has not yet been used. Know of a better way to convert this language into something more readable? [Start an issue](https://github.com/chromaui/learnstorybook.com/issues) and let us know your idea.

3. Add a new file for the chapter that you are going to write:

`/content/:guide/:framework?/:language/:chapter.md`

4. Using the name of the file that you just created, go back to the guide frontmatter and add the `toc`:

```
toc: [":chapter"]
```

This is necessary for building the table of contents for your guide. Each time you add a new chapter, make sure to go back and update the guide's `toc`in order to populate the Table of Contents as well as control the order of the chapters.

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

The URL to the repository that has the code examples for your guide. Used in combination with the `commit` frontmatter in the chapter to link chapters to their corresponding code examples .

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

An animation to use on the guide's hero image which corresponds with a named export from the [animation styles file](https://github.com/chromaui/learnstorybook.com/tree/master/src/styles/animations.js). The export must contain the entire CSS property and value for the animation.

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
