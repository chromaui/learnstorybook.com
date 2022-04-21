---
title: '애드온(Addon)'
tocTitle: '애드온(Addon)'
description: '인기있는 Controls 애드온(Addon)을 적용하고 사용하는 방법을 배워봅니다.'
commit: '3d53594'
---

스토리북(Storybook)에는 팀 내 모든 구성원의 개발 경험을 향상시키는 데 사용할 수 있는 강력한 [애드온(addons)](https://storybook.js.org/docs/react/configure/storybook-addons) 생태계가 있습니다. [여기](https://storybook.js.org/addons)에서 볼 수 있습니다.

여러분이 이 튜토리얼을 따라했다면 지금까지 이미 여러 애드온을 접했으며, [테스트](/intro-to-storybook/react/ko/test/)챕터에서 하나를 설정해 보았을 것입니다.

가능한 모든 사용 사례에 대한 애드온이 있으며 모든 항목을 다룬다면 오래 걸릴 것입니다. 여기서는 가장 인기 있는 애드온인 [Controls](https://storybook.js.org/docs/react/essentials/controls)를 구현해 보도록 하겠습니다.

## Controls는 무엇인가요?

Controls로 디자이너와 개발자가 인수(arguments)를 바꿔보며 컴포넌트의 동작을 쉽게 탐색할 수 있습니다. 코드가 필요하지 않습니다. Controls는 스토리(story) 옆에 애드온 패널을 생성하므로 실시간으로 인수(arguments)를 편집할 수 있습니다.

스토리북을 새로 설치하면 즉시 사용할 수 있는 Controls도 설치됩니다. 추가 설정이 필요하지 않습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## 새로운 스토리북 작업 흐름(workflows)을 열어주는 애드온

스토리북은 훌륭한 [컴포넌트 기반 개발 환경(component-driven development environment)](https://www.componentdriven.org/)입니다. Controls 애드온은 스토리북을 상호작용형 문서 도구로 발전시킵니다.

## Controls를 사용하여 Edge cases를 찾기

Controls을 사용하면 QA 엔지니어, UI 엔지니어 또는 기타 이해 관계자가 컴포넌트의 한계를 시험해 볼 수 있습니다! 다음의 예를 들어, `Task` 컴포넌트에 **대량의** 문자열을 추가하면 어떻게 될까요?

![이런! 가장 오른쪽에 있는 내용이 잘렸네요!](/intro-to-storybook/task-edge-case.png)

화면이 정상적이지 않습니다! Task 컴포넌트의 경계를 넘어 글자가 넘친 것 같습니다.

Controls을 통해 컴포넌트에 대한 다양한 입력(이 경우, 긴 문자열)을 신속하게 확인할 수 있었고, UI 문제를 발견하는 데 필요한 작업이 줄었습니다.

이제 `Task.js`에 스타일을 추가하여 글자가 넘치는 문제를 해결하겠습니다.

```diff:title=src/components/Task.js
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
+ style={{ textOverflow: 'ellipsis' }}
/>
```

![훨씬 좋습니다](/intro-to-storybook/edge-case-solved-with-controls.png)

문제가 해결되었습니다! 이제 Task 영역의 경계에 도달하면 말줄임표를 이용해 문자열을 보여줍니다.

## 회귀를 피하기 위해 새로운 스토리 추가하기

앞으로는 Controls를 통해 동일한 문자열을 입력하여 수동으로 이 문제를 재현할 수 있습니다. 그러나 이 edge case를 보여주는 story를 작성하는 것이 더 쉽습니다. 이는 회귀 테스트(regression test) 커버리지를 확장하고 팀에게 컴포넌트의 한계를 명확하게 설명할 수 있습니다.

긴 문자열 케이스에 대한 새로운 스토리를 `Task.stories.js` 에 추가해봅시다.

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;
export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

이제 이 edge case를 쉽게 재현하고 작업할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

만약 [시각적 테스팅(visual testing)](/intro-to-storybook/react/ko/test/)이면, 말줄임표 솔루션이 작동 중단되는 경우에도 알림이 표시됩니다. 모호한 edge case들은 테스트 커버리지 없이는 잊혀지기가 쉽습니다!

<div class="aside"><p>💡 Controls는 비개발자가 만든 컴포넌트와 스토리를 맘껏 테스트할 수 있도록하는 훌륭한 방법입니다. 우리가 여기서 본 것보다 더 많은 것을 하려면 다양한 것들을 배우기 위해 <a href="https://storybook.js.org/docs/react/essentials/controls">공식문서</a>를 보는 것을 추천합니다. 그러나, 애드온를 사용하여 작업 흐름(workflow)에 맞게 스토리북을 사용자 정의할 수 있는 여러 방법이 있습니다. <a href="/create-an-addon/react/ko/introduction/">애드온 작업 가이드</a>에선 개발 작업 흐름(workflow)의 향상을 지원하는 애드온을 만듦으로써 얻는 장점에 대해 설명합니다.</p></div>

### 변경 사항을 병합하기(merge)

변경 사항을 깃(Git)에 merge하는 것을 잊지 마세요!
