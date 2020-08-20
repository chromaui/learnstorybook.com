---
title: '애드온'
tocTitle: '애드온'
description: '잘 알려진 예시를 통해 애드온을 적용하고 사용하는 방법을 배워봅시다.'
commit: 'b3bca4a'
---

Storybook은 강력한 [애드온(addons)](https://storybook.js.org/addons/introduction/) 시스템을 통해 팀의 모든 구성원의 개발 경험을 향상할 수 있습니다. 만약 본 튜토리얼을 계속 따라 하셨다면, 저희는 지금까지 여러 애드온을 참조해왔으며, 이미 [테스팅 챕터](/react/kr/test/)에서 하나를 구현해보셨을 것입니다.

<div class="aside">
<strong>사용 가능한 애드온 목록을 찾고 계신가요?</strong>
<br/>
😍 Storybook에서 공식 지원되며, 커뮤니티에서 적극적으로 지원되는 애드온 목록은 <a href="https://storybook.js.org/addons/addon-gallery/">여기</a>에서 보실 수 있습니다.
</div>

저희는 특정 사용 사례에 대하여 애드온이 어떻게 구성되고 사용되는지 모두 다 적을 수는 없었습니다. 지금은 Storybook의 에코시스템 내에서 가장 인기 있는 애드온인 [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs)를 함께 구현해 보도록 하겠습니다.

## Knobs 설정하기

Knobs는 코드가 필요 없는 제한된 환경에서 디자이너와 개발자가 컴포넌트를 실험하고 사용해 볼 수 있는 놀라운 리소스입니다! 기본적으로 사용자가 스토리의 컴포넌트로 전달된 props를 조작해 볼 수 있도록 동적으로 정의된 필드들을 제공하는 것입니다. 이것을 지금부터 구현해보겠습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### 설치

먼저, 필수적인 디펜던시를 설치해야 합니다.

```bash
yarn add -D @storybook/addon-knobs
```

Knobs를 `.storybook/main.js` 파일 안에 등록해주세요.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
  ],
};
```

<div class="aside">
<strong>📝 애드온을 등록하는 순서는 매우 중요합니다!</strong>
<br/>
애드온을 등록하는 순서는 애드온 패널의 탭에 표시되는 순서를 결정합니다(탭에 나타나는 애드온인 경우).
</div>

이상입니다! 이제 스토리에 적용해 볼 차례입니다.

### 사용 방법

`Task` 컴포넌트에 객체 타입의 knob를 사용해보겠습니다.

먼저, `withKnobs` 데코레이터(decorators)와 `object` knob를 `Task.stories.js`에 가져옵니다.

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

<div class="aside">
  만약 TypeScript를 사용하고 계신다면, import 하실 때 약간의 조정이 필요합니다.
  <code>import { withKnobs, object } from '@storybook/addon-knobs'</code>를 사용해주세요.
</div>

다음은, `Task.stories.js` 파일의 `default` export에서 `decorators`에 `withKnobs`를 추가해주세요.

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

마지막으로, `object` knob를 "default" 스토리 안에 넣어주세요.

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

이제 하단 창의 "Action Logger" 탭 옆에 새로운 "Knobs" 탭이 나타납니다.

[여기](https://github.com/storybooks/storybook/tree/master/addons/knobs#object)에 설명된 것처럼, `object` knob는 라벨과 "default" 객체를 매개변수로 받아들입니다.
라벨은 애드온 패널의 왼쪽에 표시됩니다. 전달한 객체는 편집 가능한 JSON blob으로 표시됩니다. 유효한 JSON 객체를 보내는 한, 컴포넌트가 객체에 전달된 데이터를 바탕으로 조정될 것입니다!

## Storybook의 범위를 넓혀주는 애드온

이제 Storybook이 뛰어난 [CDD 개발환경](https://www.componentdriven.org/)을 제공해줄 뿐만 아니라, 상호작용을 할 수 있는 문서 자료 또한 제공합니다. PropTypes는 훌륭하지만, 디자이너 또는 컴포넌트의 코드에 익숙하지 않은 사람도 knobs 애드온이 구현된 Storybook을 통해서라면 컴포넌트가 어떻게 작동하는지를 쉽게 이해하실 수 있습니다.

## Knobs를 사용하여 엣지 케이스(Edge cases)를 찾기

또한, 컴포넌트에 전달된 데이터를 쉽게 편집할 수 있기 때문에 QA 엔지니어 또는 UI 엔지니어가 컴포넌트의 한계를 시험해 볼 수 있습니다! 예를 들어, `Task`컴포넌트의 목록 아이템 중 하나가 _대량의_ 문자열이라면 어떤 일이 벌어질까요?

![아이코! 가장 오른쪽에 있는 내용이 잘렸네요!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

다행히도 컴포넌트에 다른 입력을 빠르게 시도해볼 수 있기 때문에 우리는 이러한 문제점들을 상대적으로 쉽게 발견하고 수정할 수 있습니다! `Task.js`에 스타일을 추가하여 글자가 넘치는 문제를 함께 해결해보겠습니다.

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![이제 한결 낫네요.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## 회귀를 피하기 위해 새로운 스토리 추가하기

물론 우리는 knobs에 같은 입력값을 넣음으로써 문제를 항상 재현할 수 있지만, 이러한 입력값에 대응하는 story를 쓰는 것이 더 좋습니다. 이렇게 하면 회귀 테스트가 증가하고 팀에게 컴포넌트의 한계들을 분명히 설명할 수 있을 것입니다.
긴 문자열에 관한 사례를 `Task.stories.js` story에 함께 추가해봅시다.

```javascript
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

이제 우리는 story를 추가했으며 언제든지 우리가 작업하고 싶을 때마다 이러한 극단적 사례들을 쉽게 재현하여 볼 수 있습니다.
![Storybook으로 재현한 극단적 사례](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

[시각적 회귀 테스트](/react/kr/test/)를 사용하는 경우, 줄임말 방식에 어긋나는 사례가 생긴다면 그에 대한 알림을 받을 것입니다. 이렇게 모호한 엣지 케이스는 항상 잊어버릴 수도 있습니다!

### 변경 사항을 병합하기

변경 사항들을 git에 병합하는 것을 잊지 마세요!

<div class="aside"><p>우리가 살펴본 바와 같이 Knobs는 개발자가 아닌 사람들이 컴포넌트와 story들을 접해 볼 수 있도록 하는 훌륭한 방법입니다. 하지만 Storybook을 사용자 정의하여 작업 흐름에 맞게 애드온을 사용할 수 있는 더 많은 방법이 있습니다. 보너스 챕터 <a href="/intro-to-storybook/react/kr/creating-addons">애드온 만들기</a>에서는 개발 작업의 흐름을 강화할 수 있도록 도와주는 애드온을 함께 만들어 보며 알려드리겠습니다.</p></div>
