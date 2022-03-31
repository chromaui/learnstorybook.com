---
title: '시각적 TDD'
description: '첫 번째 시각적 테스트를 만들어보세요'
commit: '109652d'
---

<!-- Now that the basics are covered let’s jump into the details. This example demonstrates building out a state of a `CommentList` component using **Visual TDD** with Storybook. -->

이제 기본기는 다 다뤘으니, 더 세부적인 이야기로 들어가 봅시다. 이 예시에서는 Storybook의 **Visual TDD**를 이용해 `CommentList` 하나의 컴포넌트 state를 만드는 과정을 보여드리겠습니다.

<!-- 1. Build visual test cases -->
<!-- 2. Check the tests in Storybook -->
<!-- 3. Build out the implementation -->
<!-- 4. Check the implementation against the design -->
<!-- 5. Iterate -->

1. 시각적 테스트 케이스 구축
2. Storybook의 테스트들 검토
3. 구현 구축
4. 디자인에 대한 구현 검토
5. 반복

<!-- ### What we're building -->
### 우리가 만들 것

<!-- `CommentList` is part of a chat tool for galactic freedom fighters. Our designer has handed us a design for the various ways the list of comments should look based on the data and the app's state. Our job is to ensure the list renders correctly in terms of the exact text, images displayed, and visual treatment. -->

`CommentList`는 galactic freedom fighters의 채팅 도구의 일부분입니다. 디자이너는 우리에게 데이터와 앱의 상태를 바탕으로 댓글 목록이 보여야 할 다양한 방법을 디자인해서  넘겨주었습니다. 우리가 할 일은 목록이 정확한 텍스트, 보여지는 이미지, 시각적인 처리 측면에서 올바르게 렌더링되도록 하는 것입니다.

![Commentlist 디자인 스펙](/visual-testing-handbook/visual-testing-handbook-commentlist-design-optimized.png)
<!-- ![Commentlist design spec](/visual-testing-handbook/visual-testing-handbook-commentlist-design-optimized.png) -->

<!-- ### 1. Build visual test cases -->
### 1. 시각적 테스트 케이스들 구축

<!-- Start visual TDD by building test cases. We’ll create three cases that match the three images above. A strict TDD-er would say we need to develop and implement one test case at a time; it’s up to you if you think this helps your process. -->
테스트 케이스들을 만들면서 시각적 TDD를 시작해봅시다. 우리는 각각 위에 있는 세 이미지에 맞는 세 가지 케이스를 만들 것입니다. 엄격한 TDD 전문가는 한 번에 하나의 테스트 케이스를 개발하고 구현해야 한다고 말하겠지만; 이게 여러분의 프로세스에 도움이 되는지는 스스로 생각하고 결정하면 됩니다.

<!-- Let's set up the example project using [degit](https://github.com/Rich-Harris/degit) to download the necessary boilerplate templates (partially built applications with some default configuration). Run the following commands: -->

예시 프로젝트를 [degit](https://github.com/Rich-Harris/degit)을 이용해서 설정하고, 필요한 보일러플레이트 템플릿(기본 설정을 가지고 일부만 만들어진 어플리케이션)을 다운로드 하겠습니다. 다음 명령어들을 실행해보세요 -

```shell
# 이 튜토리얼을 위한 템플릿을 클론합니다.
npx degit chromaui/visual-testing-handbook-react-template commentlist

cd commentlist

# 필요한 의존성을 설치합니다. npm을 사용한다면 npm install을 해주면 됩니다.
yarn
```

<!-- Next, we’ll build the simplest-possible `CommentList` implementation so that we can ensure our tests are set up correctly. -->

다음으로, 우리는 가장 간단한 `CommentList`구현을 구축해서 테스트가 정확하게 설정되었는지 확인하겠습니다.

<!-- Inside your `src` directory, create a new folder called `components`, then by a new file called `CommentList.js` with the following content: -->

`src` 디렉토리 안에, `components`라는 새 폴더를 만듭니다, 그리고 `CommentList.js`라는 이름으로 새 파일을 하나 만들고 다음 내용을 적습니다.-

```js:title=src/components/CommentList.js
import React from 'react';

import PropTypes from 'prop-types';

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>loading</div>;
  }
  if (comments.length === 0) {
    return <div>empty</div>;
  }
  return (
    <div>
      {comments.length} of {totalCount}
    </div>
  );
}

CommentList.propTypes = {
  /**
   * loading state의 컴포넌트입니다.
   */
  /**
   * Is the component in the loading state
   */
  loading: PropTypes.bool,

  /**
   * 총 댓글 갯수
   */ 
  /**
   * Total number of comments
   */
  totalCount: PropTypes.number,
  /**
   * 댓글들 리스트 
   */
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
<!-- Now that we have a basic implementation, we can build our test states. Storybook makes this quick and easy. -->

이제 기본적인 구현이 있으니, 테스트 state를 만들 수 있습니다. Storybook을 사용하면 이 일을 빠르고 쉽게 할 수 있습니다.

<!-- Create a new file called `CommentList.stories.js` in `src/components` and add the following: -->

`CommentList.stories.js`라는 파일을 `src/components` 폴더에 만들고 다음을 추가합니다.

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

### 2. Storybook에서 테스트를 확인하기

<!-- Start Storybook to see the test cases. Our component implementation is bare bones, but it allows us to confirm our test cases render as intended. -->
테스트 케이스를 보려면 Storybook을 시작하세요. 우리의 컴포넌트 구현은 뼈대 뿐이지만, 테스트 케이스가 의도대로 렌더링되는지 확인할 수는 있습니다.

```shell
# Storybook을 개발 모드로 시작합니다.
yarn storybook
```

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-initial-state-optimized.mp4"
    type="video/mp4"/>
</video>

### 3. 구현을 구축하기

<!-- So far, we scaffolded a rudimentary implementation then setup Storybook to render our test cases. It’s time to start building an implementation of the `HasData` variation in isolation. -->

일단, 기본적인 구현의 비계(scaffolded)를 세웠고 테스트 케이스를 렌더링하도록 Storybook을 설정했습니다.  이제 `HasData`의 변화형(variation)의 구현을 독립적으로 만들어볼 시간입니다.

<!-- We use [`styled-components`](https://styled-components.com/) – a library that encapsulates CSS at the component level. Run the following command: -->

우리는 [`styled-components`](https://styled-components.com/)를 사용합니다. CSS를 컴포넌트 수준에서 캡슐화 시켜주는 라이브러리입니다. 다음 명령어를 실행합니다.

```shell
yarn add styled-components
```

<!-- Update your `CommentList.js` file to the following: -->
`CommentList.js` 파일을 다음과 같이 수정하세요.

```diff:title=src/components/CommentList.js
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
    return <div>loading</div>;
  }
  if (comments.length === 0) {
    return <div>empty</div>;
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

### 4. 디자인에 대한 구현 검토하기

<!-- Check how the component looks in Storybook. This example provided the CSS already, but in practice, we would tweak the styles and confirmed them in Storybook as we went along. -->
컴포넌트가 Storybook에서 어떻게 보이는지 검토합시다. 이 예시에서는 CSS를 이미 제공했습니다, 하지만 실제로는 styles을 약간 바꿔보면서 Storybook에서 어떻게 보이는지 확인했습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-finished-state-optimized.mp4"
    type="video/mp4"/>
</video>

### 5. 반복

<!-- If we're not satisfied with the implementation in step 4, we'd go back to step 3 and keep working on it. If the UI matches the spec, then we'll move on to building the next variation - perhaps by adding the “load more” button to the `Paginated` story. -->

만약 step4에서 만든 구현에 만족하지 못한다면, step3로 돌아가서 계속 작업을 이어가면 됩니다. UI가 스펙과 일치한다면, 이제 다음 변화형(variation)을 만드는 걸로 넘어가서 - "load more" 버튼을 `Paginated` 스토리에 추가할 겁니다.

<!-- As we iterate through this workflow, regularly check each story to ensure that the final implementation correctly handles each test state and not just the last one we worked on. -->

우리가 이 작업 흐름(workflow)를 반복한다면, 정기적으로 각 스토리를 확인해서 마지막으로 작업한 부분만이 아니라 최종 구현 전체가 각 테스트 상태를 정확하게 다루는지 확인해야 합니다.

## 시각적 테스트 자동화하는 법을 배우기

<!-- In the next chapter, we’ll see how we can automate the VTDD process with [Chromatic](https://chromatic.com/), a free visual testing service made by the Storybook maintainers. -->
다음 챕터에서는, VTDD 과정을 스토리북 메인테이너들이 만든 무료 시각적 테스팅 서비스인 [Chromatic](https://chromatic.com/)으로 어떻게 자동화할 수 있는지 보겠습니다.
