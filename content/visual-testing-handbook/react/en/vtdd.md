---
title: 'Visual TDD'
description: 'Put all the concepts together in code'
commit: 'e7c8eb9'
---

Now that the basics are covered, let’s jump into the details. This example demonstrates building out a state of `CommentList` using **Visual TDD** with Storybook.

Suppose we are tasked with building out the CommentList, part of a chat tool for galactic freedom fighters. Our designer has handed us a design for the various ways the list of comments should look based on the data and the state of the app:

![Commentlist design spec](/visual-testing-handbook/visual-testing-handbook-commentlist-design-optimized.png)

We need to ensure the list renders correctly in terms of the exact text, images displayed, and visual treatment.

### 1. Build visual test cases

Start visual TDD by building test cases. We’ll create three cases that match the three images above. A strict TDD-er would say we need to develop and implement one test case at a time; it’s up to you if you think this helps your process.

Let's set up the example project using [degit](https://github.com/Rich-Harris/degit) to download the necessary boilerplate templates (partially built applications with some default configuration). Run the following commands:

```shell
# Clone the template for this tutorial
npx degit chromaui/visual-testing-handbook-react-template commentlist

cd commentlist

# Install dependencies
yarn
```

Next, we’ll build the simplest-possible `CommentList` implementation so that we can ensure our tests are set up correctly.

Inside your `src` directory, create a new folder called `components`, then by a new file called `CommentList.js` with the following content:

```js:title=src/components/CommentList.js
import React from 'react';

import PropTypes from 'prop-types';

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>empty</div>;
  }
  if (comments.length === 0) {
    return <div>loading</div>;
  }
  return (
    <div>
      {comments.length} of {totalCount}
    </div>
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

Now that we have a basic implementation, we can build our test states. Storybook makes this quick and easy.

Create a new file called `CommentList.stories.js` in `src/components` and add the following:

```js:title=src/components/CommentList.stories.js
import React from 'react';

import CommentList from './CommentList';

export default {
  component: CommentList,
  title: 'CommentList',
};

const Template = args => <CommentList {...args} />;

export const Paginated = Template.bind({});
Paginated.args = {
  comments: [
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      author: {
        name: 'Luke',
        avatar: 'luke.jpeg',
      },
    },
    {
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      author: {
        name: 'Leah',
        avatar: 'leah.jpeg',
      },
    },
    {
      text: 'Duis aute irure dolor in reprehenderit in voluptate.',
      author: {
        name: 'Han',
        avatar: 'han.jpeg',
      },
    },
    {
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      author: {
        name: 'Poe',
        avatar: 'poe.jpeg',
      },
    },
    {
      text: 'Duis aute irure dolor in reprehenderit in voluptate.',
      author: {
        name: 'Finn',
        avatar: 'finn.jpeg',
      },
    },
  ],
  totalCount: 10,
};

export const HasData = Template.bind({});
HasData.args = {
  comments: [...Paginated.args.comments.slice(0, 3)],
  totalCount: 3,
};
export const Loading = Template.bind({});
Loading.args = {
  comments: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  ...Loading.args,
  loading: false,
};
```

### 2. Check the tests in Storybook

Start Storybook to see the test cases. Our component implementation is bare bones, but it allows us to confirm our test cases render as intended.

```shell
# Start Storybook in development mode
yarn storybook
```

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-initial-state-optimized.mp4"
    type="video/mp4"/>
</video>

### Step 3: Build out the implementation

So far, we scaffolded a rudimentary implementation, setup Storybook to render our test cases. It’s time to start building an implementation of the `HasData` state in isolation.

We use [`styled-components`](https://styled-components.com/) – a libary that encapsulates CSS at the component level. Run the following command:

```shell
yarn add styled-components
```

Now we can try an implementation of the main list that handles the `HasData` use case. Update your `CommentList.js` file to the following:

```diff:title=src/components/CommentList.stories.js
import React from 'react';

import PropTypes from 'prop-types';

+ import styled, { createGlobalStyle } from 'styled-components';

+ const CommentListDiv = styled.div`
+   font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
+   color: #333;
+   display: inline-block;
+   vertical-align: top;
+   width: 265px;
+ `;

+ const CommentItemDiv = styled.div`
+   font-size: 12px;
+   line-height: 14px;
+   clear: both;
+   height: 48px;
+   margin-bottom: 10px;
+   box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0;
+   background: linear-gradient(
+    120deg,
+    rgba(248, 248, 254, 0.95),
+    rgba(250, 250, 250, 0.95)
+   );
+   border-radius: 48px;
+ `;

+ const AvatarDiv = styled.div`
+   float: left;
+   position: relative;
+   overflow: hidden;
+   height: 48px;
+   width: 48px;
+   margin-right: 14px;
+   background: #dfecf2;
+   border-radius: 48px;
+ `;

+ const AvatarImg = styled.img`
+   position: absolute;
+   height: 100%;
+   width: 100%;
+   left: 0;
+   top: 0;
+   z-index: 1;
+   background: #999;
+ `;

+ const MessageDiv = styled.div`
+   overflow: hidden;
+   padding-top: 10px;
+   padding-right: 20px;
+ `;

+ const AuthorSpan = styled.span`
+   font-weight: bold;
+ `;

+ const TextSpan = styled.span``;

+ const GlobalStyle = createGlobalStyle`
+   @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
+ `;

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>empty</div>;
  }
  if (comments.length === 0) {
    return <div>loading</div>;
  }
  return (
+   <>
+   <GlobalStyle/>
+   <CommentListDiv>
+     {comments.map(({ text, author: { name, avatar } }) => (
+       <CommentItemDiv key={`comment_${name}`}>
+         <AvatarDiv>
+           <AvatarImg src={avatar} />
+         </AvatarDiv>
+         <MessageDiv>
+           <AuthorSpan>{name}</AuthorSpan> <TextSpan>{text}</TextSpan>
+         </MessageDiv>
+       </CommentItemDiv>
+     ))}
+   </CommentListDiv>
+   </>
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

### 4. Check the implementation against the design

Open it up in Storybook to see if it works. Of course, this example was heavy on CSS, so chances are we will have been testing our changes in Storybook as we went to tweak the styles to achieve what we wanted.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-finished-state-optimized.mp4"
    type="video/mp4"/>
</video>

### 5. Iterate

If we were unhappy with our implementation in step 4, we could go back to step 3 and keep working on it. If we’re satisfied, then it’s time to build the next state. Perhaps we’d tackle the `paginated` test state and try to add the “load more” button.

As we iterate through this process, we should keep checking each state to ensure that our final implementation correctly handles our test states (not just the last one we worked on!)

## Next up: learn how to automate visual testing

We're not done yet! In the next chapter, we’ll see how we can automate the VTDD process with Chromatic, a free publishing service made by the Storybook maintainers.
