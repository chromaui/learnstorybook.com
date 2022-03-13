---
title: 'UI 컴포넌트 구축하기'
tocTitle: '빌드'
description: 'Storybook에서 디자인 시스템 컴포넌트를 구축하고 구조화하기'
commit: 'a45c546'
---

<!-- In chapter 3, we’ll set up the essential design system tooling starting with Storybook, the most popular component explorer. The goal of this guide is to show you how professional teams build design systems, so we’ll also focus on finer details like the code hygiene, timesaving Storybook addons, and directory structure. -->

챕터 3에서 우리는 가장 인기 있는 컴포넌트 탐색기인 Storybook을 이용하여 필수 디자인 시스템 제작과정을 설정할 것입니다. 이 가이드의 목표는 전문적인 팀들이 어떻게 디자인 시스템을 구축하는지 보여주는 것입니다. 그러므로 우리는 깔끔한 코드, 시간을 절약해주는 Storybook 애드온, 디렉터리 구조 등과 같은 세부 사항들도 살펴볼 것입니다.

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)



<!-- ## Code formatting and linting for hygiene

Design systems are collaborative, so tools that fix syntax and standardize formatting serve to improve contribution quality. Enforcing code consistency with tooling is much less work than policing code by hand, a benefit for the resourceful design system author.

In this tutorial, we'll use [VSCode](https://code.visualstudio.com/) as our editor, but you can apply the same principles to other modern editors like [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), or [IntelliJ](https://www.jetbrains.com/idea/).

If we add Prettier to our project and set our editor up correctly, we should obtain consistent formatting without having to think much about it:

If you are using Prettier for the first time, you may need to set it up for your editor. In VSCode, install the Prettier addon:

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

Enable the Format on Save `editor.formatOnSave` if you haven’t done so already. Once you’ve installed Prettier, you should find that it auto-formats your code whenever you save a file.

 -->


## 깔끔한 코드를 위한 형식과 린트

디자인 시스템은 협업의 결과물이기 때문에 문법을 고치거나 형식을 표준화하는 툴은 협업의 품질을 향상해 줍니다. 툴을 사용해서 코드의 일관성을 적용하는 것이 수작업으로 직접 코드를 관리하는 것 보다 훨씬 효율적이기 때문에 디자인 시스템 작성자에게 이익이 됩니다.

이 튜토리얼에서는 [VSCode](https://code.visualstudio.com/) 에디터를 사용하지만, [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), [IntelliJ](https://www.jetbrains.com/idea/) 등 다른 최신 에디터들을 사용해도 무방합니다.

이 프로젝트에 Prettier 애드온을 설치해서 편집기에 올바르게 적용하면, 크게 신경 쓸 필요 없이 일관성 있는 코드 형식을 유지할 수 있을 것입니다.

```shell
yarn add --dev prettier
```

만약 Prettier를 처음 써본다면 에디터에 Prettier를 설치해야 합니다. VScode를 사용한다면, Prettier 애드온을 추가하면 됩니다-

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

`editor.formatOnSave`  형식을 활성화 해보세요, 아직 설정을 하지 않았다면, Preference 설정에서 'format on save'를 활성화하는 것을 추천합니다. Prettier를 한 번 설치한 이후에는 파일을 저장할 때마다 에디터가 코드 형식을 자동으로 정리해 줄 것입니다.


<!-- ## Install Storybook

Storybook is the industry-standard [component explorer](https://www.chromatic.com/blog/ui-component-explorers---your-new-favorite-tool) for developing UI components in isolation. Since design systems focus on UI components, Storybook is the ideal tool for the use case. We’ll rely on these features:

- 📕Catalog UI components
- 📄Save component variations as stories
- ⚡️Developer experience tooling like Hot Module Reloading
- 🛠Supports many view layers, including React

Install and run Storybook -->


## Storybook 설치하기

Storybook은 독자적으로 UI 컴포넌트를 개발애 있어 업계 표준 [컴포넌트 탐색기](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a)입니다. 디자인 시스템은 UI 컴포넌트에 집중하기 때문에 Storybook은 이상적인 도구입니다. 우리는 다음 기능을 주로 사용할 것입니다.

- 📕UI 컴포넌트들을 카탈로그 화하기
- 📄컴포넌트 변화를 Stories로 저장하기
- ⚡️핫 모듈 재 로딩과 같은 개발 툴 경험을 제공하기
- 🛠리액트를 포함한 다양한 뷰 레이어 지원하기

Storybook을 설치하고 실행해 보세요,

```shell
# Installs Storybook
npx sb init

# Starts Storybook in development mode
yarn storybook
```

다음과 같은 화면을 볼 수 있을 것 입니다.

![Initial Storybook UI](/design-systems-for-developers/storybook-initial-6-0.png)

<!-- Nice, we’ve set up a component explorer!

Every time you install Storybook into an application, it will add some examples inside the `stories` folder. If you want, take some time and explore them. But we won't be needing them for our design system, so it's safe to delete the `stories` directory.

Now your Storybook should look like this (notice that the font styles are a little off, for instance, see the "Avatar: Initials" story): -->


이제 우리는 컴포넌트 탐색기를 설치를 마쳤습니다!

어플리케이션에 Storybook을 설치할 때마다 'stories' 폴더에 몇 가지 예제들이 추가될 것입니다. 원한다면 예제들을 천천히 둘러보아도 좋습니다. 하지만 디자인 시스템 챕터에서는 사용하지 않으므로 'stories' 디렉토리를 지워도 무방합니다.

Storybook은 아래와 같이 보여야 합니다. (story 목록 중 "Avatar: Initials"의 폰트 스타일이 살짝 어긋나 있습니다. 대신 "Avatar:Initials" story를 참고하세요)- 

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-6-0.mp4"
    type="video/mp4"
  />
</video>


<!-- Our design system requires some global styles (a CSS reset) to be applied to the document to render our components correctly. We can add them easily with the Styled Components global style tag. Update your `src/shared/global.js` file to the following: -->

### 글로벌 스타일 추가하기

우리의 디자인 시스템은 컴포넌트가 제대로 보이기 위해 어느 정도의 글로벌 스타일(CSS reset)이 문서에 적용되도록 요구합니다. 이는 Styled Components 의 글로벌 스타일 태그를 이용해서 쉽게 추가할 수 있습니다. 아래 예시처럼 `src/shared/global.js` 에 있는 글로벌 스타일을 업데이트 해 보세요 -

```diff:title=src/shared/global.js
import { createGlobalStyle, css } from 'styled-components';

import { color, typography } from './styles';

+ export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* Same as before */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }`;
```

<!-- To use the `GlobalStyle` “component” in Storybook, we can make use of a [decorator](https://storybook.js.org/docs/react/writing-stories/decorators) (a component wrapper). In an app, we’d place that component in the top-level app layout, but in Storybook, we wrap all stories using the preview config file [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering). -->

Storybook의 `GlobalStyle` 컴포넌트를 사용하기 위해서 우리는 컴포넌트 래퍼(wrapper)인 [decorator](https://storybook.js.org/docs/react/writing-stories/decorators)를 이용할 수 있습니다. 하나의 앱 안에서 그 컴포넌트를 앱 레이아웃 최상단에 놓을 것입니다. 하지만 Storybook에서는 설정 파일을 사용해서 모든 story들을 그 컴포넌트 안에 넣고 감싸도록 합니다. [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering) 


```diff:title=.storybook/preview.js
+ import React from 'react';

+ import { GlobalStyle } from '../src/shared/global';

/*
 * Global decorator to apply the styles to all stories
 * Read more about them at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
+ export const decorators = [
+   Story => (
+     <>
+       <GlobalStyle />
+       <Story />
+     </>
+   ),
+ ];

/*
 * Read more about global parameters at:
 * https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

<!-- The decorator ensures the `GlobalStyle` renders no matter which story is selected.

<div class="aside">💡 The <code><></code> in the decorator is not a typo--it’s a <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> that we use here to avoid adding an unnecessary extra HTML tag to our output.</div> -->

decorator 는 어떤 story가 선택되었든 간에 GlobalStyle 이 반드시 렌더(render) 되도록 합니다.

<div class="aside"> 💡 <code><></code> decorator 안의 기호는 오타가 아닙니다 -- <a href="https://reactjs.org/docs/fragments.html">React Fragment 입니다.</a> 불필요한 HTML 태그를 추가하지 않기 위해 그것을 사용합니다. </div>

### 폰트 태그 추가하기

우리의 디자인 시스템은 앱에서 Nunito Sans 폰트를 기본으로 합니다. 이 부분은 앱 프레임워크에 따라서 설정하는 방법이 다르지만 ([여기](https://github.com/storybookjs/design-system#font-loading)에서 더 자세하게 볼 수 있습니다), Storybook에서 설정하는 가장 쉬운 방법은 [`.storybook/preview-head.html`](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head) 파일에서 `<head>` 태그에 직접 `<link>` 태그를 추가하는 것입니다.

```html:title=.storybook/preview-head.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900" />
```

이제 당신의 Storybook은 이렇게 보일 것입니다. 글로벌 폰트 스타일을 적용했기 때문에 "T" 글자는 sans-serif 폰트가 적용되어 있습니다.

![글로벌 스타일이 적용된 Storybook](/design-systems-for-developers/storybook-global-styles-6-0.png)

## 애드온으로 Storybook을 더욱 강력하게

Storybook는 대규모 커뮤니티가 만든 탄탄한 [애드온 생태계](https://storybook.js.org/addons)를 가지고 있습니다. 실용성을 추구하는 개발자를 위해서도, 우리가 직접 커스텀 도구를 만드는 것보다 애드온 생태계를 이용해서 워크플로우를 구축하기가 더 쉽고 빠릅니다.

<h4 id="storybook-addon-actions">상호 작용을 확인하기 위한 액션 애드온</h4>

버튼이나 링크 같은 인터렉티브한 엘리먼트를 실행했을 때, Storybook의 [액션 애드온](https://storybook.js.org/docs/react/essentials/actions)은 UI 피드백을 제공합니다. 액션 애드온은 Storybook을 설치할 때 기본으로 같이 설치되며, '액션'을 콜백 prop으로 컴포넌트에 전달하여 사용할 수 있습니다.

버튼 엘리먼트의 사용방법을 알아보겠습니다. 클릭에 반응하기 위해 래퍼(wrapper) 컴포넌트로 버튼 엘리먼트를 감싸기도 하는데, 우리는 래퍼(wrapper)에 액션에 따른 story를 전달하게 됩니다-


```js:title=src/Button.stories.js
import React from 'react';

import styled from 'styled-components';

//사용자가 버튼을 클릭하면, action()함수를 호출합니다.
//결론적으로 StoryBook의 애드온 패널에 보여지게 됩니다.

function ButtonWrapper(props) {
  return <CustomButton {...props} />;
}

export const buttonWrapper = (args) => (
  return <CustomButton {...props}/>;
// … etc ..
)
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-actions-6-0.mp4"
    type="video/mp4"
  />
</video>

<h4 id="storybook-addon-controls">컴포넌트를 테스트 스트레스 줄이기</h4>

Storybook을 새로 설치하면 [Controls 애드온](https://storybook.js.org/docs/react/essentials/controls)이 이미 다 설정된 상태로 포함되어 있습니다.

Controls 애드온을 이용하면 Storybook UI에서 컴포넌트 입력값(props)을 역동적으로 사용할 수 있습니다. [전달인자](https://storybook.js.org/docs/react/writing-stories/args) (줄여서 args)를 통해 컴포넌트 prop에 다양한 값을 제공할 수 있고 UI를 통해서 값을 변경할 수 있습니다. 이는 디자인 시스템을 만드는 사람들이 전달인자의 값들을 조정하면서 컴포넌트 입력값(props)을 스트레스 테스트를 할 수 있도록 해줍니다. 동시에 디자인 시스템 사용자들은 여러 컴포넌트를 합치기 이전에 먼저 사용해보고 각 입력값(prop)이 컴포넌트를 어떻게 바꾸는지 이해할 수 있습니다.

`src/Avatar.stories.js`에 있는 `Avatar` 컴포넌트에 새로운 story를 추가해보면서 Controls 애드온이 어떻게 작동하는지 살펴봅시다.

```js:title=src/Avatar.stories.jsx
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
   * More on Storybook argTypes at:
   * https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
};

// Other Avatar stories

/*
 * New story using Controls
 * Read more about Storybook templates at:
 * https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
const Template = args => <Avatar {...args} />;

export const Controls = Template.bind({});
/*
 * More on args at:
 * https://storybook.js.org/docs/react/writing-stories/args
 */
Controls.args = {
  loading: false,
  size: 'tiny',
  username: 'Dominic Nguyen',
  src: 'https://avatars2.githubusercontent.com/u/263385',
};
```

애드온 목록에 있는 Controls 탭을 주목해 봅시다. Controls는 props를 조정하기 위해 자동으로 그래픽 UI를 생성합니다. 예를 들어, 사이즈를 선택하는 엘리먼트("size")를 이용해서 아바타 사이즈를 `tiny`, `small`, `medium`, `large` 중에서 고를 수 있습니다. 이 방식은 컴포넌트의 나머지 props에도 ("loading", "username", "src")에도 동일하게 적용됩니다. 이렇게 사용자 친화적인 방법으로 컴포넌트 스트레스 테스트를 만드는 것이 가능합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-6-0.mp4"
    type="video/mp4"
  />
</video>

단, Controls가 stories를 대체하지는 않습니다. Controls는 컴포넌트의 여러 특수 케이스를 탐색하는 데에 매우 유용합니다. Stories는 의도된 케이스를 보여주는 데에 사용합니다.

<!-- <h4>Interactive stories with addon-interactions </h4> -->
<h4>애드온 인터렉션(interaction)을 통한 인터랙티브한 story들</h4>

<!-- We've seen how Storybook's addons help us find edge cases with the [Controls](#storybook-addon-controls) addon and how a component behaves when we interact with it using the [Actions](#storybook-addon-actions) addon. Still, with each variation we add with our stories, we must check it manually and see if our design system doesn't break. Let's see how we can automate this by adding the [`@storybook/addon-interactions`](https://storybook.js.org/addons/@storybook/addon-interactions/) addon, and interact with our component using the `play` function: -->

Storybook의 애드온이 [Controls](#storybook-addon-controls)을 통해 어떻게 도움이 되는지, 그리고 [Actions](#storybook-addon-actions) 애드온을 통해 컴포넌트가 어떻게 상호작용 하는지 알아보겠습니다. 이때, story들에 하나의 변화를 준다면, 그것이 디자인 시스템을 망가뜨리지 않았는지 수동으로 확인해야 합니다. [`@storybook/addon-interactions`](https://storybook.js.org/addons/@storybook/addon-interactions/) 애드온을 사용하여 이를 어떻게 자동화 할 수 있는지 알아보고 컴포넌트의 기능을 동작시켜봅시다.- 


<!-- Run the following command to install the addon and its dependencies: -->

다음 명령어를 사용하여 애드온 및 의존성을 설치합니다.-

```shell
yarn add --dev @storybook/addon-interactions @storybook/testing-library
```

<!-- Next, register it in Storybook's configuration file (i.e., `.storybook/main.js`): -->

다음으로, 설치한 것을 Storybook의 구성파일에 등록합니다. (i.e., `.storybook/main.js`)-

```diff:title=./storybook/main.js
module.exports = {
  stories: [
     '../src/**/*.stories.mdx',
     '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-interactions',
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
};
```

<!-- Now, let's see how it works by adding a new story for our `Button` component: -->
이제, 'Button' 컴포넌트에 새로운 story를 추가하여 어떻게 작동하는지 보겠습니다-

```diff:title=src/Button.stories.js
import React from 'react';
import styled from 'styled-components';
+ import { userEvent, within } from '@storybook/testing-library';
import { Button } from './Button';
import { StoryLinkWrapper } from './StoryLinkWrapper';
export default {
  title: 'Design System/Button',
  component: Button,
};

// Other Button stories
// 이외의 버튼 story들

+ // New story using the play function
+ // play 함수를 사용하는 새로운 story 
+ export const WithInteractions = () => (
+   <Button
+     ButtonWrapper={StoryLinkWrapper}
+     appearance="primary"
+     href="http://storybook.js.org">
+       Button
+    </Button>
+ );
+ WithInteractions.play = async ({ canvasElement }) => {
+   // Assigns canvas to the component root element
    //root 엘리먼트에 캔버스 할당
+   const canvas = within(canvasElement);
+   await userEvent.click(canvas.getByRole("link"));
+ };

+ WithInteractions.storyName = "button with interactions";
```

<!-- <div class="aside">
 💡 Play functions are small snippets of code that once the story finishes rendering, aided by the <code>addon-interactions</code>, it allows you to test scenarios otherwise impossible without human intervention. Read more about them in the <a href="https://storybook.js.org/docs/react/writing-제작/play-function"> official documentation</a>.
</div> -->

<div class="aside">
 💡 Play 함수는 작은 코드 조각으로 <code>애드온-인터렉션(interaction)</code> 의 도움으로 렌더링됩니다. 이는 사용자에게 사람의 개입이 없이는 불가능한 시나리오를 테스트할 수 있도록 합니다. 더 알고싶다면 <a href="https://storybook.js.org/docs/react/writing-stories/play-function"> 공식문서를 참고하세요</a>.
</div>


<!-- Select your new story and notice how we were able to check how the component behaves and stays consistent—taking one additional step in making our design system more robust and bug-free without relying on human interactions. -->

새로운 story를 선택하고 어떻게 컴포넌트가 동작하는지와 일관성을 유지하는지 확인 해보세요 한 발 더 나아가 디자인 시스템을 사람의 인터렉션(interaction)에 의존하지 않는, 보다 강력하고 버그가 없는 상태로 만들 수 있습니다.

<!-- <video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-button-interactive-stories.mp4"
    type="video/mp4"
  />
</video>
We'll visit the Accessibility and Docs addons in later chapters.

> “Storybook is a powerful frontend workshop environment tool that allows teams to design, build, and organize UI components (and even full screens!) without getting tripped up over business logic and plumbing.” – Brad Frost, Author of Atomic Design -->

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-button-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

이제 접근성과 문서 애드온에 대해서 알아볼 것입니다. 

> “Storybook은 팀이 UI를 설계,구축,구성 할 수 있도록 돕는 강력한 프런트엔드 작업 환경 도구입니다. (심지어 전체화면입니다!) 이는 비즈니스의 로직과 설계에 걸려 넘어지지 않도록 돕습니다.” – Brad Frost, Atomic Design의 저자

<!-- ## Learn how to automate maintenance

Now that our design system components are in Storybook, we've taken one more step to create an industry-standard design system. Now it's an excellent time to commit our work to our remote repository. Then we can start thinking about how we set up the automated tooling that streamlines ongoing maintenance.

A design system, like all software, should evolve. The challenge is to ensure UI components continue to look and feel as intended as the design system grows.

In chapter 4, we’ll learn how to set up continuous integration and auto-publish the design system online for collaboration. -->

## 유지보수 자동화 방법 알아보기

디자인 시스템 컴포넌트가 Storybook 상에 있다면, 그것은 산업표준에 맞춘 디자인 시스템 구축에 한 단계 더 나아간 것 입니다. 이제, 원격저장소에 작업물을 commit 하기 좋은 시점입니다. 이후 지속적인 유지관리를 위해 자동화된 도구를 설정하는 방법에 대해 알아볼 수 있습니다. 

디자인 시스템은 소프트웨어와 마찬가지로 진화해야 합니다. 문제는 디자인 시스템이 확장됨에 따라 UI 컴포넌트가 의도한 바에 맞게 보여지는 것을 보장하도록 하는 것 입니다.

챕터 4에서는 디자인 시스템을 온라인 협업을 위해 지속적 통합과 자동 배포 설정을 할 수 있는지 알아봅니다. 

