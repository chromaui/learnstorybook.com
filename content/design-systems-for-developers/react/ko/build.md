---
title: 'UI 컴포넌트 구축하기'
tocTitle: '빌드'
description: '스토리북에서 디자인 시스템 컴포넌트를 구축하고 구조화하기'
commit: 'f4c9bb5'
---

챕터 3에서는 가장 인기 있는 컴포넌트 탐색기인 스토리북(Storybook)을 이용하여 필수 디자인 시스템 제작과정을 설정해봅니다. 이 가이드의 목표는 전문성을 갖춘 팀이 디자인 시스템을 어떻게 구축하는지 보여주는 것입니다. 따라서 깔끔한 코드, 시간을 절약해주는 스토리북 애드온(addon), 디렉터리 구조와 같이 자세한 내용까지 살펴보겠습니다.

![스토리북을 쓰기 좋은 곳](/design-systems-for-developers/design-system-framework-storybook.jpg)

## 깔끔한 코드를 위한 형식과 린트(Lint)

디자인 시스템은 협업의 결과물이기 때문에 문법을 수정하거나 형식을 표준화하는 툴은 협업 품질 개선에 기여합니다. 툴을 사용해서 코드의 일관성을 확보하는 것이 수작업으로 직접 코드를 관리하는 것 보다 훨씬 효율적입니다. 따라서 디자인 시스템 작성자는 자료를 많이 확보하면 유용하게 활용하는데 도움이 됩니다.

이 튜토리얼에서는 [VSCode](https://code.visualstudio.com/) 에디터를 사용합니다만, 같은 원칙이 적용되는 [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), [CodeLobster](https://codelobster.com/), [IntelliJ](https://www.jetbrains.com/idea/) 등 다른 최신 에디터들을 사용해도 무방합니다.

이 프로젝트에 프리티어(Prettier) 애드온을 설치해서 편집기에 올바르게 적용하면 특별히 추가적인 노력을 하지 않아도 코드 형식이 일관되게 유지됩니다. -

```shell
yarn add --dev prettier
```

프리티어를 처음 사용하는 경우 에디터에 프리티어를 설치해야 할 수도 있습니다. VScode를 사용한다면 프리티어 애드온을 추가하면 됩니다. -

![VSCode를 위한 프리티어 애드온](/design-systems-for-developers/prettier-addon.png)

`editor.formatOnSave` 아직 설정을 하지 않았다면 Preference 설정에서 'format on save'를 활성화하세요. 프리티어 설치를 완료하고 나면 파일을 저장할 때마다 에디터가 코드 형식을 자동으로 정리해 주는 것을 확인할 수 있습니다.

## 스토리북 설치하기

스토리북은 독자적인 UI 컴포넌트를 개발을 위한 업계 표준 [컴포넌트 탐색기](https://www.chromatic.com/blog/ui-component-explorers---your-new-favorite-tool/)입니다. 디자인 시스템은 UI 컴포넌트에 집중하기 때문에 스토리북은 용례를 위한 이상적인 도구입니다. 다음 기능을 주로 사용합니다. -

- 📕UI 컴포넌트들을 카탈로그화 하기
- 📄컴포넌트 변화를 스토리들(Stories)로 저장하기
- ⚡️핫 모듈 재 로딩과 같은 개발 툴 경험을 제공하기
- 🛠리액트를 포함한 다양한 뷰 레이어 지원하기

스토리북을 설치하고 실행해 보세요.

```shell:clipboard=false
# Installs Storybook
npx storybook init

# Starts Storybook in development mode
yarn storybook
```

다음과 같은 화면을 볼 수 있을 것 입니다.

![초기 스토리북 UI](/design-systems-for-developers/storybook-initial-6-0.png)

잘 하셨습니다. 컴포넌트 탐색기 설치가 끝났습니다!

어플리케이션에 스토리북을 설치할 때마다 `stories` 폴더에 예제가 몇 가지 추가됩니다. 원한다면 예제들을 천천히 살펴보아도 좋습니다. 하지만 디자인 시스템 챕터에서는 사용하지 않으므로 `stories` 디렉토리를 지워도 무방합니다.

스토리북은 아래와 같이 보여야 합니다. (스토리(story) 목록 중 "Avatar: Initials"의 폰트 스타일이 살짝 어긋나 있습니다. 대신 "Avatar:Initials" 스토리를 참고하세요) -

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-6-0.mp4"
    type="video/mp4"
  />
</video>

### 글로벌 스타일 추가하기

디자인 시스템의 컴포넌트가 제대로 보이기 위해서는 몇 가지 글로벌 스타일(CSS reset)을 문서에 적용해야 합니다. 이는 Styled Components 의 글로벌 스타일 태그를 이용해서 쉽게 추가할 수 있습니다. 아래 예시처럼 `src/shared/global.js` 에 있는 글로벌 스타일을 업데이트 해 보세요 -

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

스토리북의 `GlobalStyle` 컴포넌트를 사용하기 위해 컴포넌트 래퍼(wrapper)인 [데코레이터(decorator)](https://storybook.js.org/docs/react/writing-stories/decorators)를 활용할 수 있습니다. 하나의 앱 안이라면 그 컴포넌트를 앱 레이아웃 최상단에 놓겠지만 스토리북에서는 프리뷰 설정 파일을 사용해서 모든 스토리를 그 컴포넌트 안에 넣고 감싸도록 합니다. [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering)

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

데코레이터는 어떤 스토리가 선택되었든 간에 `GlobalStyle` 이 반드시 렌더(render) 되도록 합니다.

<div class="aside"> 💡 <code><></code> 데코레이터 안의 기호는 오타가 아닙니다 -- <a href="https://reactjs.org/docs/fragments.html">React Fragment 입니다.</a> 불필요한 HTML 태그를 추가하지 않기 위해 그것을 사용합니다. </div>

### 폰트 태그 추가하기

디자인 시스템 앱의 기본 폰트는 Nunito Sans 입니다. 이 부분은 앱 프레임워크에 따라서 설정하는 방법이 다르지만 ([여기](https://github.com/storybookjs/design-system#font-loading)에서 더 자세히 볼 수 있습니다), 스토리북에서 설정하는 가장 쉬운 방법은 [`.storybook/preview-head.html`](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head) 파일에서 `<head>` 태그에 직접 `<link>` 태그를 추가하는 것입니다.

```html:title=.storybook/preview-head.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900" />
```

이제 스토리북이 이렇게 보일 것입니다. 글로벌 폰트 스타일을 적용했기 때문에 "T" 글자는 sans-serif 폰트가 적용되어 있습니다.

![글로벌 스타일이 적용된 스토리북](/design-systems-for-developers/storybook-global-styles-6-0.png)

## 애드온으로 스토리북을 더욱 강력하게

스토리북는 대규모 커뮤니티가 만든 탄탄한 [애드온 생태계](https://storybook.js.org/addons)를 보유하고 있습니다. 실용성을 추구하는 개발자라면 직접 커스텀 도구를 만드는 것보다 애드온 생태계를 이용해서 작업 흐름(workflow)를 구축하는 것이 더 쉽고 빠릅니다.

<h4 id="storybook-addon-actions">상호 작용을 확인하기 위한 액션 애드온</h4>

버튼이나 링크 같은 인터렉티브한 엘리먼트를 실행했을 때, 스토리북의 [액션 애드온](https://storybook.js.org/docs/react/essentials/actions)은 UI 피드백을 제공합니다. 액션 애드온은 스토리북을 설치할 때 기본으로 같이 설치되며, "액션"을 콜백 prop으로 컴포넌트에 전달하여 사용할 수 있습니다.

버튼 엘리먼트의 사용방법을 알아보겠습니다. 클릭에 반응하기 위해 래퍼(wrapper) 컴포넌트로 버튼 엘리먼트를 감싸기도 하는데, 우리는 래퍼(wrapper)에 액션에 따른 스토리를 전달하게 됩니다. -

```js:title=src/Button.stories.js
import React from 'react';

import styled from 'styled-components';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
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

<h4 id="storybook-addon-controls">컴포넌트 스트레스 테스트를 위한 Controls</h4>

스토리북을 새로 설치하면 [Controls 애드온](https://storybook.js.org/docs/react/essentials/controls)이 이미 다 설정된 상태로 포함되어 있습니다.

Controls 애드온을 이용하면 스토리북 UI에서 컴포넌트 입력값(props)을 역동적으로 사용할 수 있습니다. [전달 인자](https://storybook.js.org/docs/react/writing-stories/args) (줄여서 args)를 통해 컴포넌트 prop에 다양한 값을 제공할 수 있고 UI를 통해서 값을 변경할 수 있습니다. 디자인 시스템 크리에이터는 이를 통해 전달인자의 값을 조정하면서 컴포넌트 입력값(props)을 스트레스 테스트를 할 수 있습니다. 디자인 시스템 사용자는 여러 컴포넌트를 통합하기 전에 컴포넌트를 사용해보고 각 입력값(prop)이 컴포넌트에 어떤 영향을 주는지 사전에 파악할 수 있습니다.

`src/Avatar.stories.js`에 있는 `Avatar` 컴포넌트에 새로운 스토리를 추가하여 Controls 애드온이 어떻게 작동하는지 살펴봅시다.

```js:title=src/Avatar.stories.js
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

애드온 목록에 있는 Controls 탭에 주목하세요. Controls는 props를 조정하기 위해 자동으로 그래픽 UI를 생성합니다. 예를 들어, 사이즈를 선택하는 엘리먼트("size")를 이용해서 아바타 사이즈를 `tiny`, `small`, `medium`, `large` 중에서 고를 수 있습니다. 이 방식은 컴포넌트의 나머지 props에도 ("loading", "username", "src") 동일하게 적용됩니다. 이렇게 사용자 친화적인 방법으로 스트레스 테스트를 컴포넌트에 적용할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-6-0.mp4"
    type="video/mp4"
  />
</video>

단, Controls가 스토리들을 대체하지는 않습니다. Controls는 특수한 컴포넌트를 탐색할 때, 그리고 스토리들이 원래 의도한 상태가 무엇인지 보여줄 때 유용합니다.

<h4>애드온 인터렉션(interaction)을 통한 인터랙티브한 스토리들</h4>

스토리북의 애드온이 [Controls](#storybook-addon-controls)을 통해 특수 케이스를 찾아내는데 어떻게 도움이 되는지, 그리고 [Actions](#storybook-addon-actions) 애드온을 통해 컴포넌트가 어떻게 상호작용 하는지 알아보았습니다. 이때 스토리에 변화를 하나씩 적용할 때마다 그것이 디자인 시스템을 망가뜨리지 않았는지 매번 수동으로 확인해야 합니다. [`@storybook/addon-interactions`](https://storybook.js.org/addons/@storybook/addon-interactions/) 애드온을 사용하여 이를 어떻게 자동화 할 수 있는지 알아보고 `play` 함수를 사용하여 컴포넌트를 작동시켜봅시다. -

다음 명령어를 사용하여 애드온 및 의존성을 설치합니다. -

```shell
yarn add --dev @storybook/addon-interactions @storybook/testing-library
```

다음으로, 설치한 것을 스토리북의 구성파일에 등록합니다. (i.e., `.storybook/main.js`)-

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

이제, `Button` 컴포넌트에 새로운 스토리를 추가하여 어떻게 작동하는지 보겠습니다. -

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

+ // New story using the play function
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

+   const canvas = within(canvasElement);
+   await userEvent.click(canvas.getByRole("link"));
+ };

+ WithInteractions.storyName = "button with interactions";
```

<div class="aside">
 💡 Play 함수는 작은 코드 조각입니다. <code>애드온-인터렉션(interaction)</code> 의 도움으로 스토리가 렌더링되고 나면, Play 함수 덕분에 사람의 개입 없이 시나리오를 테스트할 수 있습니다.  됩니다. 더 자세한 내용은 <a href="https://storybook.js.org/docs/react/writing-stories/play-function"> 공식문서를 참고하세요</a>.
</div>

새로운 스토리를 선택한 후 컴포넌트가 어떻게 동작하는지, 어떻게 일관성을 유지하는지 확인해 보세요. 여러분의 이와같은 노력은 사람이 개입하지 않고도 더 견고하고 버그가 적은 디자인 시스템을 만들기 위한 발판이 될 것입니다.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-button-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

다음 챕터에서는 접근성과 문서 애드온에 대해 알아봅니다.

> “스토리북은 팀이 비즈니스 로직에 걸려 넘어지거나 고민하는 일 없이 UI를 설계,구축,구성 할 수 있도록 돕는 강력한 프런트엔드 작업 환경 도구입니다. (심지어 전체화면입니다!) .” – Brad Frost, Atomic Design의 저자

## 유지보수 자동화 방법 알아보기

디자인 시스템 컴포넌트가 스토리북 안에 들어갔으니 산업표준을 준수하는 디자인 시스템 구축을 향해 한 단계 더 나아간 것 입니다. 이제 원격저장소에 작업물을 commit 하기 좋은 시점입니다. Commit을 수행하고 나면 지속적인 유지관리를 위한 자동화 도구 설정 방법을 알아볼 준비가 된 것입니다.

디자인 시스템은 소프트웨어와 마찬가지로 진화해야 합니다. 이 때 중요한 점은 디자인 시스템 진화하는 동안에도 UI 컴포넌트가 원래 의도한 룩앤필(look and feel)이 유지되도록 하는 것 입니다.

챕터 4에서는 온라인 협업을 위해 디자인 시스템을 자동으로 통합 및 배포하는 설정법을 배웁니다.
