---
title: '애드온'
tocTitle: '애드온'
description: '인기있는 Controls 애드온을 적용하고 사용하는 방법을 배워봅시다.'
commit: '3d53594'
---

Storybook은 강력한 [애드온(addons)](https://storybook.js.org/docs/react/configure/storybook-addons) 시스템을 통해 팀의 모든 구성원의 개발 경험을 향상할 수 있습니다. [여기](https://storybook.js.org/addons)에서 애드온 목록을 보실 수 있습니다.

만약 본 튜토리얼을 계속 따라 하셨다면, 저희는 지금까지 여러 애드온을 참조해왔으며, 이미 [테스팅 챕터](/intro-to-storybook/react/ko/test/)에서 하나를 구현해보셨을 것입니다.

가능한 모든 사용 사례에 대한 애드온이 있기 때문에 애드온에 관한 모든 예시를 다룰 수는 없을 것입니다. 여기서는 가장 인기 있는 애드온인 [Controls](https://storybook.js.org/docs/react/essentials/controls)를 함께 구현해 보도록 하겠습니다.

## Controls는 무엇인가요?

Controls는 디자이너와 개발자가 컴포넌트에 전달되는 값를 _바꾸어보며_ 쉽게 컴포넌트의 행동을 살펴볼 수 있게 해줍니다. 코드가 필요하지 않습니다. Controls는 스토리 옆에 애드온 패널을 생성하여 실시간으로 전달되는 값을 수정해볼 수 있도록 해 줍니다.

Storybook을 새로 설치하게 되면 Controls이 포함되어있기 때문에 추가로 설정이 필요하지 않습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## 새로운 Storybook 작업 흐름을 열어주는 애드온

Storybook는 훌륭한 [컴포넌트 기반 개발 환경(component-driven development environment)](https://www.componentdriven.org/)입니다. Controls 애드온은 Storybook을 상호작용 가능한 문서 도구로 진화하도록 해주었습니다.

## Controls를 사용하여 엣지 케이스(Edge cases)를 찾기

Controls을 사용하여 컴포넌트에 전달된 데이터를 쉽게 편집할 수 있기 때문에 QA 엔지니어 또는 UI 엔지니어가 컴포넌트의 한계를 시험해 볼 수 있습니다! 예를 들어 생각해보겠습니다. `Task` 컴포넌트에 _대량의_ 문자열을 추가한다면 어떤 일이 벌어질까요?

![아이코! 가장 오른쪽에 있는 내용이 잘렸네요!](/intro-to-storybook/task-edge-case.png)

맞지 않네요! `Task` 컴포넌트의 경계를 넘어 글자가 넘치는 것 같아 보입니다.

Controls은 컴포넌트에 여러가지 입력을 빠르게 시도해볼 수 있도록 해줍니다. 긴 문자열과 같은 경우도 마찬가지입니다. 이는 UI 문제점들을 발견하는 일을 줄여줍니다.

이제 `Task.js`에 스타일을 추가하여 글자가 넘치는 문제를 함께 해결해보겠습니다.

```javascript
// src/components/Task.js

<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![이제 한결 낫네요.](/intro-to-storybook/edge-case-solved-with-controls.png)

문제가 해결되었습니다! 이제 말줄임표를 사용하여 Task의 경계에 있는 문자를 잘라줍니다.

## 회귀를 피하기 위해 새로운 스토리 추가하기

향후 우리는 Controls에 같은 입력값을 넣음으로써 문제를 항상 재현할 수 있지만, 이러한 입력값에 대응하는 story를 쓰는 것이 더 좋습니다. 이렇게 하면 회귀 테스트의 커버리지를 넓히고 팀에게 컴포넌트의 한계들을 분명히 설명할 수 있을 것입니다.

긴 문자열에 관한 사례를 `Task.stories.js` story에 함께 추가해봅시다.

```javascript
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

이제 이러한 엣지 케이스를 재현하고 작업할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

[시각적 테스팅(visual testing)](/intro-to-storybook/react/ko/test/)인 경우, 말줄임표에 관한 솔루션이 작동을 멈추었는지에 대한 알림 또한 받을 수 있을 것입니다. 모호한 엣지 케이스들은 테스트 커버리지 없이는 잊혀지기가 쉽습니다!

### 변경 사항을 병합하기

변경 사항들을 git에 merge하는 것을 잊지 마세요!

<div class="aside"><p>우리가 살펴본 바와 같이 Controls는 개발자가 아닌 사람들이 컴포넌트와 story들을 접해 볼 수 있도록 하는 훌륭한 방법이며 함께 살펴본 것보다 더 많은 사항은 <a href="https://storybook.js.org/docs/react/essentials/controls">공식 문서</a>를 통해 배우실 수 있습니다. 그러나 애드온을 사용하여 여러분의 작업흐름에 맞게 Storybook을 사용하는 많은 방법들이 존재합니다. <a href="/create-an-addon/react/en/introduction/">애드온 생성하기</a> 보너스 챕터에서는 개발 작업 흐름을 강화할 수 있도록 도와주는 애드온을 함께 만들어보며 그러한 방법을 알려드리도록 하겠습니다.</p></div>
