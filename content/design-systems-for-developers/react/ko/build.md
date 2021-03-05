---
title: 'UI 컴포넌트 구축하기'
tocTitle: '빌드'
description: '스토리북에서 디자인 시스템 컴포넌트를 구축하고 구조화하기'
commit: 4211d5e
---

3장에서 우리는 가장 인기 있는 컴포넌트 탐색기인 Storybook을 이용하여 필수 디자인 시스템 제작과정을 설정할 것입니다. 이 가이드의 목표는 전문가로 이루어진 팀들이 어떻게 디자인 시스템을 구축하는지 보여주는 것입니다. 그러므로 우리는 깔끔한 코드 (code hygiene), 시간을 절약해주는 스토리북 애드온, 디렉터리 구조 등과 같은 세부 사항들도 살펴볼 것입니다.

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## 깔끔한 코드를 위한 형식과 린트

디자인 시스템은 협업의 결과물이기 때문에 문법을 고치거나 형식을 표준화하는 툴은 기여도를 향상해 줍니다. 툴을 사용해서 코드의 일관성을 강조하는 것이 손으로 직접 코드를 살피기보다 훨씬 쉽습니다. 그렇기에 다양한 툴과 방법을 알고 있는 것은 디자인 시스템 작성자의 자산입니다.

이 튜토리얼에서는 VSCode 에디터를 사용하지만, Atom, Sublime, IntelliJ 등 다른 최신 에디터들을 사용해도 무방합니다.

이 프로젝트에 Prettier 애드온을 설치해서 사용한다면, 크게 신경 쓸 필요 없이 일관성 있는 코드 형식을 유지할 수 있습니다.

```shell
yarn add --dev prettier
```

만약 Prettier를 처음 써본다면 에디터에 Prettier를 설치해야 합니다. VScode를 사용한다면, Prettier 익스텐션을 추가하면 됩니다.

아직 하지 않았다면, Preference 설정에서 'format on save'를 활성화하는 것을 추천합니다. Prettier를 한 번 설치한 이후에는 파일을 저장할 때마다 에디터가 코드 형식을 자동으로 정리해 줄 것입니다.

## 스토리북 설치하기

스토리북은 독자적으로 UI 컴포넌트를 개발하기 위한 업계 표준 [컴포넌트 탐색기](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a)입니다. 디자인 시스템은 UI 컴포넌트에 집중하기 때문에 스토리북은 디자인 시스템을 구축하는 데에 매우 유용합니다.

우리는 다음 기능들에 집중합니다.

- 📕UI 컴포넌트들을 카탈로그 화하기
- 📄컴포넌트 변화를 Stories로 저장하기
- ⚡️핫 모듈 재 로딩과 같은 개발 툴 경험을 제공하기
- 🛠리액트를 포함한 다양한 뷰 레이어 지원하기

스토리북을 설치하고 실행한다면,

```shell
npx -p @storybook/cli sb init
yarn storybook
```

다음과 같은 화면이 보입니다.

![Initial Storybook UI](/design-systems-for-developers/storybook-initial-6-0.png)

이제 우리는 컴포넌트 탐색기를 설치했습니다!

어플리케이션에 스토리북을 설치할 때마다 'stories' 폴더에 몇 가지 예제들이 추가될 것입니다. 원한다면 예제들을 천천히 둘러보아도 좋습니다. 하지만 디자인 시스템 챕터에서는 사용하지 않으므로 'stories' 디렉토리를 지워도 무방합니다.

스토리북은 아래와 같이 보여야 합니다. (스토리 목록 중 "Avatar: Initials"의 폰트 스타일이 살짝 어긋나 있습니다.)

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-6-0.mp4"
    type="video/mp4"
  />
</video>

### 글로벌 스타일 추가하기

우리의 디자인 시스템은 컴포넌트가 제대로 보이기 위해 어느 정도의 글로벌 스타일(CSS reset)이 문서에 적용되도록 요구합니다. Styled Components 의 글로벌 스타일 태그를 이용해서 쉽게 추가할 수 있습니다. 아래 예시처럼 `src/shared/global.js` 에 있는 글로벌 스타일을 원하는 대로 조정할 수 있습니다.

```javascript
// src/shared/global.js

import { createGlobalStyle, css } from 'styled-components';
import { color, typography } from './styles';

export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* same as before */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }
`;
```

스토리북의 `GlobalStyle` 컴포넌트를 사용하기 위해서 우리는 컴포넌트 래퍼(wrapper)인 [decorator](https://storybook.js.org/docs/react/writing-stories/decorators)를 이용할 수 있습니다. 앱이라면 그 컴포넌트를 앱 레이아웃 최상단에 놓을 것입니다. 하지만 스토리북에서는 [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering) 설정 파일을 사용해서 모든 스토리들을 그 컴포넌트 안에 넣고 감싸도록 합니다.

```javascript
// .storybook/preview.js

import React from 'react';

import { GlobalStyle } from '../src/shared/global';

// 모든 스토리에 스타일을 적용하기 위한 글로벌 decorator
export const decorators = [
  Story => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

decorator 는 어떤 스토리가 선택되었든 간에 GlobalStyle 이 반드시 렌더링되도록 합니다.

<div class="aside"> decorator 안의 <code><></code> 기호는 오타가 아닙니다 -- 불필요한 HTML 태그를 추가하지 않기 위해 <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> 를 사용합니다. </div>

### 폰트 태그 추가하기

우리의 디자인 시스템은 앱에서 Nunito Sans 폰트를 기본으로 합니다. 이 부분은 앱 프레임워크에 따라서 설정하는 방법이 다르지만 ([여기](https://github.com/storybookjs/design-system#font-loading)에서 더 자세하게 볼 수 있습니다), 스토리북에서 설정하는 가장 쉬운 방법은 [`.storybook/preview-head.html`](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head) 파일에서 `<head>` 태그에 직접 `<link>` 태그를 추가하는 것입니다.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900" />
```

이제 당신의 스토리북은 이렇게 보일 것입니다. 글로벌 폰트 스타일을 적용했기 때문에 "T" 글자는 sans-serif 폰트가 적용되어 있습니다.

![글로벌 스타일이 적용된 스토리북](/design-systems-for-developers/storybook-global-styles-6-0.png)

## 애드온으로 스토리북을 더욱 강력하게

큰 커뮤니티 덕분에 스토리북은 탄탄한 [애드온 생태계](https://storybook.js.org/addons)를 가지고 있습니다. 실용성을 추구하는 개발자를 위해서도, 우리가 직접 커스텀 도구를 만드는 것보다 애드온 생태계를 이용해서 워크플로우를 구축하기가 더 쉽고 빠릅니다.

<h4>인터렉션을 위한 액션 애드온</h4>

버튼이나 링크 같은 인터렉티브한 엘리먼트를 실행했을 때, 스토리북의 [액션 애드온](https://storybook.js.org/docs/react/essentials/actions)은 UI 피드백을 줍니다. 액션 애드온은 스토리북을 설치할 때 기본으로 같이 설치되며, '액션'을 콜백 prop으로 컴포넌트에 전달하여 사용할 수 있습니다.

클릭에 반응하기 위해 wrapper 컴포넌트로 버튼 엘리먼트를 감싸기도 하는데, 이 버튼 엘리먼트에서 액션 애드온을 어떻게 사용할 수 있는지 봅시다.

여기, 버튼 wrapper에 액션을 전달하는 스토리가 있습니다.

```javascript
// src/Button.stories.js

import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// 버튼을 클릭하면, `action()`이 실행되고,
// 스토리북의 애드온 패널에 나타난다.
function ButtonWrapper(props) {
  return <CustomButton {...props} />;
}

export const buttonWrapper = (args) => (
  return <CustomButton {...props}/>;
  // … etc ..
)
```

<video autoPlay muted playsInline loop>
  <source src="/design-systems-for-developers/storybook-addon-actions-6-0.mp4" type="video/mp4" />
</video>

<h4>컴포넌트 스트레스 테스트를 위한 Controls</h4>

스토리북을 새로 설치하면 [Controls 애드온](https://storybook.js.org/docs/react/essentials/controls)이 이미 다 설정된 상태로 포함되어 있습니다.

Controls 애드온을 이용하면 스토리북 UI에서 컴포넌트 입력값(props)을 역동적으로 사용할 수 있습니다. [전달인자](https://storybook.js.org/docs/react/writing-stories/args) (줄여서 args)를 통해 컴포넌트 prop에 다양한 값을 제공할 수 있고 UI를 통해서 값을 변경할 수 있습니다. 이는 디자인 시스템을 만드는 사람들이 전달인자의 값들을 조정하면서 컴포넌트 입력값(props)을 스트레스 테스트를 할 수 있도록 해줍니다. 동시에 디자인 시스템 사용자들은 여러 컴포넌트를 합치기 이전에 먼저 사용해보고 각 입력값(prop)이 컴포넌트를 어떻게 바꾸는지 이해할 수 있습니다.

`src/Avatar.stories.js`에 있는 `Avatar` 컴포넌트에 새로운 스토리를 추가해보면서 Controls 애드온이 어떻게 작동하는지 살펴봅시다.

```javascript
//src/Avatar.stories.js
import React from 'react';

// Controls을 사용하는 새로운 스토리
const Template = args => <Avatar {...args} />;
export const Controls = Template.bind({});
Controls.args = {
  loading: false,
  size: 'tiny',
  username: 'Dominic Nguyen',
  src: 'https://avatars2.githubusercontent.com/u/263385',
};
```

애드온 목록에 있는 Controls 탭을 주목해 봅니다. Controls는 props를 조정하기 위해 자동으로 그래픽 UI를 생성합니다. 예를 들어, 사이즈를 선택하는 엘리먼트("size")를 이용해서 아바타 사이즈를 `tiny`, `small`, `medium`, `large` 중에서 고를 수 있습니다. 이 방식은 컴포넌트의 나머지 props에도 ("loading", "username", "src")에도 동일하게 적용됩니다. 이렇게 사용자 친화적인 방법으로 컴포넌트 스트레스 테스트를 만드는 것이 가능합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-6-0.mp4"
    type="video/mp4"
  />
</video>

단, Controls가 stories를 대체하지는 않습니다. Controls는 컴포넌트의 여러 특수 케이스를 탐색하는 데에 매우 유용합니다. Stories는 의도된 케이스를 보여주는 데에 사용합니다.

우리는 뒤의 챕터에서 접근성과 문서 (Accessibility and Docs) 애드온을 살펴볼 것입니다.

> 비즈니스 로직과 틀을 망치지 않으면서, 디자인하고 개발하고 UI 컴포넌트를 정리하기에 스토리북은 강력한 프런트엔드 워크숍 환경 도구입니다. – Brad Frost, Atomic Design 저자

## 유지 보수 자동화하기

이제 우리의 디자인 시스템 컴포넌트들이 스토리북에 생성되었습니다. 우리는 업계 표준의 디자인 시스템을 구축하는 데에 한 발짝 더 가까워졌습니다. 원격 저장소(remote repository)에 작업을 커밋하기 좋은 때입니다. 그러고 나서 우리는 유지보수를 계속해서 가동하기 위해 어떻게 자동화 도구를 설정해야 하는지 생각해볼 수 있습니다.

여느 소프트웨어처럼, 디자인 시스템도 지속해서 발전해야 합니다. 디자인 시스템이 발전하면서 UI 컴포넌트들도 계속 의도한 대로 보이고 느껴질 수 있게 하는 것은 쉬운 일이 아닙니다.

4장에서는 지속가능한 통합과 온라인 협업을 위해 디자인 시스템을 자동 배포하는 방법을 배울 것입니다.
