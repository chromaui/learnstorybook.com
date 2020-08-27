---
title: 'UI 컴포넌트 구축하기'
tocTitle: '빌드'
description: '스토리북에서 디자인 시스템 컴포넌트를 구축하고 구조화하기'
commit: e7b6f00
---

3장에서 우리는 가장 인기 있는 컴포넌트 탐색기인 Storybook을 이용하여 필수 디자인 시스템 제작과정을 설정할 것입니다. 이 가이드의 목표는 전문가로 이루어진 팀들이 어떻게 디자인 시스템을 구축하는지 보여주는 것입니다. 그러므로 우리는 깔끔한 코드 (code hygiene - 직역: 코드 위생), 시간을 절약해주는 스토리북 애드온, 디렉터리 구조 등과 같은 세부 사항들도 살펴볼 것입니다.

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## 깔끔한 코드를 위한 형식과 린트

디자인 시스템은 협업의 결과물이기 때문에 문법을 고치거나 형식을 표준화하는 툴은 기여도를 향상해 줍니다. 툴을 사용해서 코드의 일관성을 강조하는 것이 손으로 직접 코드를 살피기보다 훨씬 쉽습니다. 그렇기에 다양한 툴과 방법을 알고 있는 것은 디자인 시스템 작성자의 자산입니다.

이 튜토리얼에서는 VSCode 에디터를 사용하지만, Atom, Sublime, IntelliJ 등 다른 최신 에디터들을 사용해도 무방합니다.

이 프로젝트에 Prettier 애드온을 설치해서 사용한다면, 크게 신경 쓸 필요 없이 일관성 있는 코드 형식을 유지할 수 있습니다. 

```bash
yarn add --dev prettier
```

만약 Prettier를 처음 써본다면, 에디터에 Prettier를 설치해야 합니다. VScode를 사용한다면, Prettier 익스텐션을 추가하면 됩니다.

아직 하지 않았다면, Preference 설정에서 'format on save'를 활성화하는 것을 추천합니다. Prettier를 한 번 설치했다면, 그 이후에는 파일을 저장할 때마다 에디터가 코드 형식을 자동으로 정리해 줄 것입니다.

## 스토리북 설치하기

스토리북은 독자적으로 UI 컴포넌트를 개발하기 위한 업계 표준 컴포넌트 탐색기입니다. 디자인 시스템은 UI 컴포넌트에 집중하기 때문에 스토리북은 디자인 시스템을 구축하는 데에 매우 유용합니다. 

우리는 다음 기능들에 집중합니다.
- 📕UI 컴포넌트들을 카탈로그 화하기
- 📄컴포넌트 변화를 Stories로 저장하기
- ⚡️핫 모듈 재 로딩과 같은 개발 툴 경험을 제공하기
- 🛠리액트를 포함한 다양한 뷰 레이어 지원하기

스토리북을 설치하고 실행한다면,

```bash
npx -p @storybook/cli sb init
yarn storybook
```

다음과 같은 화면이 보입니다.

이제 우리는 컴포넌트 탐색기를 설치했습니다!

스토리북은 아래와 같이 재 로딩돼야 합니다. (스토리 목록 중 'Initials'의 폰트가 살짝 어긋나 있습니다.)

### 글로벌 스타일 추가하기

우리의 디자인 시스템은 컴포넌트가 제대로 보이기 위해 어느 정도의 글로벌 스타일(CSS reset)이 문서에 적용되도록 요구합니다. Styled Components 의 글로벌 스타일 태그를 이용해서 쉽게 추가할 수 있습니다. 아래 예시처럼 `src/shared/global.js` 에 있는 글로벌 스타일을 원하는 대로 커스텀화하면 됩니다.

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

스토리북의 `GlobalStyle` 컴포넌트를 사용하기 위해서 우리는 컴포넌트 래퍼(wrapper)인 decorator를 이용할 수 있습니다. 앱이라면 그 컴포넌트를 앱 레이아웃 최상단에 놓을 것입니다. 하지만 스토리북에서는 `.storybook/preview.js` 설정 파일을 사용해서 모든 스토리들을 그 컴포넌트 안에 넣고 감싸도록 합니다.

```javascript
// .storybook/preview.js

import React from 'react';
import { addDecorator } from '@storybook/react';
import { GlobalStyle } from '../src/shared/global';

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

decorator 는 어떤 스토리가 선택되었든 간에 GlobalStyle 이 반드시 렌더링되도록 합니다. 

<div class="aside"> decorator 안의 <code><></code> 기호는 오타가 아닙니다 -- 불필요한 HTML 태그를 추가하지 않기 위해 <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> 를 사용합니다. </div>

### 폰트 태그 추가하기

우리의 디자인 시스템은 앱에서 Nunito Sans 폰트를 기본으로 합니다. 이 부분은 앱 프레임워크에 따라서 설정하는 방법이 다르지만 ([여기](https://github.com/storybookjs/design-system#font-loading)에서 더 자세하게 볼 수 있습니다), 스토리북에서 설정하는 가장 쉬운 방법은 `.storybook/preview-head.html` 파일에서 `<head>` 태그에 직접 `<link>` 태그를 추가하는 것입니다. 

```javascript
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900">
```

이제 당신의 스토리북은 이렇게 보일 것입니다. 글로벌 폰트 스타일을 적용했기 때문에 'T' 글자는 sans-serif 폰트가 적용되어 있습니다.

![글로벌 스타일이 적용된 스토리북](/design-systems-for-developers/storybook-global-styles.png)

## 애드온으로 스토리북을 더욱 강력하게 

큰 커뮤니티 덕분에 스토리북은 탄탄한 애드온 생태계를 가지고 있습니다. 실용성을 추구하는 개발자를 위해서도, 우리가 직접 커스텀 도구를 만드는 것보다 애드온 생태계를 이용해서 워크플로우를 구축하기가 더 쉽고 빠릅니다. 

<h4>인터렉션을 위한 액션 애드온</h4>

버튼이나 링크 같은 인터렉티브한 엘리먼트를 실행했을 때, 스토리북의 [액션 애드온](https://github.com/storybookjs/storybook/tree/next/addons/actions)은 UI 피드백을 줍니다. 액션 애드온은 스토리북을 설치할 때 기본으로 같이 설치되며, '액션'을 콜백 prop으로 컴포넌트에 전달하면 사용할 수 있습니다. 

클릭에 반응하기 위해 wrapper 컴포넌트로 버튼 엘리먼트를 감싸기도 하는데, 이 버튼 엘리먼트에서 액션 애드온을 어떻게 사용할 수 있는지 봅시다. 

여기, 버튼 wrapper에 액션을 전달하는 스토리가 있습니다.

```javascript
// src/Button.js

import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
return <CustomButton onClick={action('button action click')} {...props} />;
}

export const buttonWrapper = () => (
<Button ButtonWrapper={ButtonWrapper} appearance="primary">
// … etc ..
)
```

![액션 애드온 사용하기](/design-systems-for-developers/storybook-addon-actions.gif)

#### 코드를 보고 복사할 수 있는 소스

사용자가 스토리를 보다가, 이 스토리가 어떻게 작동하는지 알기 위해 뒷단의 코드를 보고 본인의 프로젝트에 복사하고 싶을 수도 있습니다. Storysource 애드온은 애드온 패널 중에서 현재 선택된 스토리 코드를 보여줍니다. 

```bash
yarn add --dev  @storybook/addon-storysource
```

`.storybook/main.js` 에 애드온을 추가합니다:
```javascript
//.storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
};
```

스토리북에서 이 워크플로우는 이렇게 보입니다.

![Storysource 애드온](/design-systems-for-developers/storybook-addon-storysource.png)

<h4>Knobs 애드온으로 컴포넌트 스트레스 테스트하기</h4>

[knobs 애드온](https://github.com/storybookjs/storybook/tree/next/addons/knobs)을 이용하면 스토리북 UI에서 컴포넌트 props를 역동적으로 사용할 수 있습니다. 컴포넌트 prop에 다양한 값을 제공할 수 있고, UI를 통해서 값을 변경할 수 있습니다. 이는 디자인 시스템을 만드는 사람들이 knobs를 조절해서 컴포넌트의 여러 입력값을 스트레스 테스트를 할 수 있도록 해줍니다. 동시에 디자인 시스템 사용자들은 여러 컴포넌트를 합치기 이전에, 먼저 사용해보고, 각각의 prop이 컴포넌트를 어떻게 바꾸는지 이해할 수 있습니다.

`Avatar` 컴포넌트에서 knobs를 설정해서 어떻게 작동하는지 봅시다.

```bash
yarn add --dev @storybook/addon-knobs
```

`.storybook/main.js`에 애드온을 추가합니다.

```javascript
//.storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
  ],
};
```

`src/Avatar.stories.js` 에 있는 knobs를 사용하는 스토리를 추가합니다.

```javascript
//src/Avatar.stories.js

import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

// …

export const knobs = () => (
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
);

knobs.story = {
  decorators: [withKnobs],
};
```

애드온 목록에 있는 Knobs 탭을 주목해 봅니다. 사이즈를 선택하는 엘리먼트("Size")를 조절해서 아바타 사이즈를 `tiny`, `small`, `medium`, `large` 중에서 고를 수 있습니다. 이렇게 knobs와 다른 props를 조합해서 여러 컴포넌트를 인터렉티브하게 사용해 볼 수 있는 환경을 만들 수 있습니다.

![Storybook knobs 애드온](/design-systems-for-developers/storybook-addon-knobs.gif)

단, knobs가 stories를 대체하지는 않습니다. knobs는 컴포넌트의 여러 특수 케이스를 탐색하는 데에 매우 유용합니다. Story는 의도된 케이스를 보여주는 데에 사용합니다.

우리는 뒤의 챕터에서 Accessibility and Docs(접근성과 문서) 애드온을 살펴볼 것입니다. 

> 비즈니스 로직과 틀을 망치지 않으면서, 디자인하고 개발하고 UI 컴포넌트를 정리하기에 스토리북은 강력한 프런트엔드 워크숍 환경 도구입니다.

## 유지 보수 자동화하기

이제 우리의 디자인 시스템 컴포넌트들이 스토리북에 생성되었습니다. 우리는 업계 표준의 디자인 시스템을 구축하는 데에 한 발짝 더 가까워졌습니다. 원격 저장소(remote repository)에 작업을 커밋하기 좋은 때입니다. 그러고 나서 우리는 유지보수를 계속해서 가동하기 위해 어떻게 자동화 도구를 설정해야 하는지 생각해볼 수 있습니다. 

여느 소프트웨어처럼, 디자인 시스템도 지속해서 발전해야 합니다. 디자인 시스템이 발전하면서 UI 컴포넌트들도 계속 의도한 대로 보이고 느껴질 수 있게 하는 것은 쉬운 일이 아닙니다.

4장에서는 지속가능한 통합과 온라인 협업을 위해 디자인 시스템을 자동 배포하는 방법을 배울 것입니다. 
