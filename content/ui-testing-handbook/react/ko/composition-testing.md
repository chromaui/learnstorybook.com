---
title: '구성 테스트'
tocTitle: '구성'
description: '사소한 변경이 커다란 회귀로 변하는 것을 방지하기'
commit: '2c8173d'
---

2021년 1월, 테슬라(Tesla)는 디스플레이 모듈의 오작동으로 [158,000대의 자동차를 리콜했습니다.](https://www.theverge.com/2021/1/13/22229854/tesla-recall-model-sx-touchscreens-bricked-failure-nhtsa)
디스플레이 콘솔이 고장나면 백업 카메라나 방향 지시등, 또는 운전자 지원에 접근할 수 없습니다. 이러한 고장은 충돌 위험을 크게 증가시킵니다.

> 모듈 하나의 결함이 심각한 실패로 확대된 것입니다.

앱이 자동차처럼 각 부분이 서로 연결되어 있기 때문에, UI도 비슷한 문제를 겪고 있습니다. 컴포넌트 하나의 버그가 주변의 다른 부분에도 전부 영향을 미칩니다. 그 컴포넌트가 사용되는 부분은 말할 것도 없죠. UI 컴포넌트가 어떻게 구성되는지 테스트하면 이러한 버그를 방지하는 데 도움이 됩니다.

UI의 더 복잡한 부분들을 테스트하는 것은 더욱 까다롭습니다. 복합 컴포넌트는 단순한 컴포넌트 여러 개가 모여 구성되며 애플리케이션의 상태와도 연결됩니다. 이번 챕터에서는 복합 컴포넌트를 분리하고 시각적 테스트를 적용하는 방법을 살펴보겠습니다. 이 과정에서 모의 데이터(mocking data)와 애플리케이션 로직을 시뮬레이션 하는 방법을 배우게 됩니다. 또한 컴포넌트 통합 테스트를 하는 방법에 대해서도 배우게 될 것입니다.

## 작은 버그가 앱 전체를 망칩니다

애플리케이션은 컴포넌트를 서로 연결하여 구축됩니다. 그렇기 때문에 하나의 엘리먼트의 버그 한 개가 그 주변 전체에 영향을 미치기도 합니다. 예를 들어, prop의 이름을 바꾸는 것만으로 부모 컴포넌트에서 자식 컴포넌트로의 데이터 흐름이 중단될 수 있습니다. 혹은 잘못 스타일링된 엘리먼트 하나로 레이아웃 자체가 깨지기도 합니다.

![사소한 수정이 큰 회귀를 초래합니다.](/ui-testing-handbook/minor-major-regressions-1.gif)

[스토리북(Storybook) 디자인 시스템](https://5ccbc373887ca40020446347-oghpnhotjv.chromatic.com/?path=/docs/button--basic)의 Button 컴포넌트를 생각해봅시다. 이 컴포넌트는 여러 페이지에서 셀 수 없이 많이 사용됩니다. `Button`의 버그는 곧 버튼이 사용된 모든 페이지의 버그로 이어집니다. 즉, 하나의 실수가 기하급수적인 실수로 번진다는 뜻입니다. 컴포넌트 계층이 페이지 수준으로 올라갈수록 이러한 버그의 영향도 커집니다. 따라서 이런 상속적인 문제를 일찍 잡아내고 근본 원인을 파악할 수 있는 방법이 필요합니다.

![앱의 여러 페이지에서 동일한 버튼 컴포넌트가 사용되고 있습니다](/ui-testing-handbook/design-system-inconsistent-buttons.jpg)

## 구성 테스트

시각적 요소 테스트는 실제 브라우저에서 스토리(story)의 이미지 스냅샷을 캡처하고 비교하여 버그를 포착합니다. 이는 UI 변경 사항을 파악하고 근본 원인을 알아차리는데 유용합니다. 이전 장에서 배웠던 테스트 과정을 떠올려봅시다 -

1. 🏷 컴포넌트 **분리**하기. Storybook을 사용해 한 번에 한 컴포넌트씩 테스트합니다.
2. ✍🏽 **테스트 케이스** 작성하기. 각 state는 props를 통해 재현됩니다.
3. 🔍 **수동으로 확인**하기. 각 테스트 케이스의 모양을 수동으로 확인합니다.
4. 📸 시각적 요소 회귀 테스트를 통해 **UI 버그** 자동으로 잡기

구성 테스트는 몇 가지 간단한 컴포넌트로 구성된 트리의 상위에 있는 "복합" 컴포넌트에 대해 시각적 테스트를 실행하는 것입니다. 이렇게 하면 변경 사항이 전체 애플리케이션에 미칠 수 있는 영향을 측량할 수 있습니다. 그리고 시스템이 전체적으로 작동하는지 확인할 수 있습니다.

가장 중요한 차이는 복합 컴포넌트가 애플리케이션 상태를 추적하고 동작을 트리 아래로 전달한다는 것입니다. 테스트 케이스를 작성할 때는 이 점을 고려해야 합니다.

사용자와 관련된 모든 할일 목록을 표시하는 `TaskList` 컴포넌트에 대한 테스트를 작성하여 이 프로세스가 실제로 작동하는지 살펴보겠습니다.

핀 버튼을 누르면 해당 일정은 목록의 맨 위로 이동합니다. 로딩중일 때도 있고, 아무런 일정이 없을 때도 있습니다. 이 모든 시나리오에 대한 이야기를 작성하는 것으로 시작해봅시다.

![Task list는 4가지 상태를 가지고 있습니다 - 디폴트 상태일 때, 아무것도 없을 때, 로딩중일 때, 고정됐을 때](/ui-testing-handbook/task-list.png)

스토리 파일을 생성하고 `TaskList` 컴포넌트를 등록하세요. 그리고 디폴트 케이스에 대한 스토리를 추가합니다.

```javascript:title=src/components/TaskList.stories.js
import React from 'react';
import { TaskList } from './TaskList';
import Task from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  argTypes: {
    ...Task.argTypes,
  },
};
const Template = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  tasks: [
    { id: '1', state: 'TASK_INBOX', title: 'Build a date picker' },
    { id: '2', state: 'TASK_INBOX', title: 'QA dropdown' },
    {
      id: '3',
      state: 'TASK_INBOX',
      title: 'Write a schema for account avatar component',
    },
    { id: '4', state: 'TASK_INBOX', title: 'Export logo' },
    { id: '5', state: 'TASK_INBOX', title: 'Fix bug in input error state' },
    { id: '6', state: 'TASK_INBOX', title: 'Draft monthly blog to customers' },
  ],
};
```

`argTypes`에 주목하세요. [Args](https://storybook.js.org/docs/react/writing-stories/args)는 스토리에 대한 입력을 정의하기 위한 스토리북의 메커니즘입니다. 프레임워크에 구애받지 않는 props로 생각하세요. 컴포넌트 수준에서 정의된 인수는 자동으로 각 스토리에 전달됩니다. 우리의 경우 [Actions addon](https://storybook.js.org/docs/react/essentials/actions)을 사용하여 3개의 이벤트 핸들러를 정의했습니다.

이렇게 시뮬레이션된 작업은 `TaskList`와 상호 작용할 때 애드온(addon) 패널에 표시됩니다. 컴포넌트가 올바른 위치에 놓였는지 확인할 수 있습니다.

![](/ui-testing-handbook/tasklist-actions.gif)

### 인수(args) 구성

컴포넌트를 결합하여 새 UI를 만드는 것과 같은 방식으로 인수를 결합하여 새 스토리를 만들 수 있습니다. 복합 컴포넌트의 인수는 하위 컴포넌트의 인수를 결합하는 것이 일반적입니다.

이벤트 핸들러 인수는 재사용 가능한 Task story 파일에 이미 정의되어 있습니다. 마찬가지로 기본 스토리의 인수를 사용하여 고정된 일정에 대한 스토리를 만들 수도 있습니다.

```javascript:title=src/components/TaskList.stories.js
import React from 'react';
import { TaskList } from './TaskList';
import Task from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  argTypes: {
    ...Task.argTypes,
  },
};
const Template = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  tasks: [
    { id: '1', state: 'TASK_INBOX', title: 'Build a date picker' },
    { id: '2', state: 'TASK_INBOX', title: 'QA dropdown' },
    {
      id: '3',
      state: 'TASK_INBOX',
      title: 'Write a schema for account avatar component',
    },
    { id: '4', state: 'TASK_INBOX', title: 'Export logo' },
    { id: '5', state: 'TASK_INBOX', title: 'Fix bug in input error state' },
    { id: '6', state: 'TASK_INBOX', title: 'Draft monthly blog to customers' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  tasks: [
    { id: '6', title: 'Draft monthly blog to customers', state: 'TASK_PINNED' },
    ...Default.args.tasks.slice(0, 5),
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  ...Loading.args,
  loading: false,
};
```

인수 구성을 통해 스토리를 형성하는 것은 아주 강력한 기술입니다. 이를 통해 동일한 데이터를 반복해서 적지 않아도 스토리를 작성할 수 있습니다. 더욱 훌륭한 점은 컴포넌트를 통합적으로 테스트를 할 수 있다는 것입니다. 만약 `Task` 컴포넌트의 props 중 하나의 이름을 바꾸면, `TaskList`에 대한 테스트 케이스가 실패하게 됩니다.

![](/ui-testing-handbook/tasklist-stories.gif)

지금까지는 props를 통해 데이터와 콜백을 허용하는 컴포넌트만 다루었습니다. 그런데 컴포넌트가 API에 연결되어 있거나 내부 상태가 있는 경우에는 상황이 더 까다로워집니다. 자, 이제 이렇게 서로 연결된 컴포넌트를 분리하고 테스트하는 방법을 살펴보겠습니다.

### 상태를 가지는(Stateful) 복합 컴포넌트

`InboxScreen`은 [커스텀 훅](https://github.com/chromaui/ui-testing-guide-code/blob/composition-testing/src/useTasks.js)을 사용해서 Taskbox API에서 데이터를 가져오고 애플리케이션의 상태를 관리합니다. 단위 테스트를 할 때처럼 실제 백엔드로부터 컴포넌트를 분리하고 기능별로 테스트해봅시다.

![](/ui-testing-handbook/taskbox.png)

바로 이런 상황에 스토리북 애드온이 필요합니다. 스토리북 애드온을 통해 API 요청, 상태, 컨텍스트, 프로바이더(provider) 및 컴포넌트가 의존하는 모든 것을 모의할 수 있습니다. [The Guardian](https://5dfcbf3012392c0020e7140b-borimwnbdl.chromatic.com/?path=/story/layouts-showcase--article-story) 과 [Sidewalk Labs](https://www.sidewalklabs.com/) (Google) 같은 회사는 이 애드온을 사용해서 전체 페이지를 개별적으로 구축합니다.

InboxScreen의 경우, [Mock Service Worker(MSW) 애드온](https://storybook.js.org/addons/msw-storybook-addon/)을 통해 네트워크 레벨에서 요청을 가로채고 모의 응답을 반환합니다.

MSW와 MSW 애드온을 설치하세요.

```
yarn add -D msw msw-storybook-addon
```

그런 다음, public 폴더에 새 서비스 워커를 생성하세요.

```
npx msw init public/
```

`.storybook/preview.js` 파일에서 MSW 애드온을 활성화하세요 -

```diff:title=.storybook/preview.js
 import React from 'react';
 import { ChakraProvider } from '@chakra-ui/react';
+ import { initialize, mswDecorator } from 'msw-storybook-addon';
 import { theme } from '../src/theme';

+ initialize();

 export const parameters = {
   actions: { argTypesRegex: '^on[A-Z].*' },
   controls: {
     matchers: {
       color: /(background|color)$/i,
       date: /Date$/,
     },
   },
   backgrounds: {
     default: 'blue',
     values: [
       { name: 'blue', value: '#2cc5d2' },
       { name: 'white', value: '#fff' },
     ],
   },
 };

 export const decorators = [
   (Story) => (
     <ChakraProvider theme={theme}>
       <Story />
     </ChakraProvider>
   ),
+  mswDecorator,
 ];
```

마지막으로 `yarn storybook` 커맨드를 다시 실행하세요. 자, 스토리의 모의 API 요청에 관한 설정이 모두 완료되었습니다.

`InboxScreen`은 `/tasks` 엔드포인트에서 차례로 데이터를 가져오는 `useTasks` 훅(hook)을 호출합니다. `msw` 매개변수를 사용하여 모의 응답을 지정할 수 있습니다. 각 스토리에 대해 다른 응답을 반환하는 방법을 확인해보세요.

```javascript:title=src/InboxScreen.stories.js
import React from 'react';
import { rest } from 'msw';
import { InboxScreen } from './InboxScreen';
import { Default as TaskListDefault } from './components/TaskList.stories';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
};

const Template = (args) => <InboxScreen {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.json(TaskListDefault.args));
      }),
    ],
  },
};

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
Error.parameters = {
  msw: {
    handlers: [
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.json([]));
      }),
    ],
  },
};
```

![](/ui-testing-handbook/inbox-screen.gif)

상태에는 다양한 형태가 있습니다. 일부 애플리케이션은 Redux나 MobX 같은 라이브러리를 사용하여 전역적으로 상태를 추적합니다. 또는 GraphQL 쿼리를 작성하거나 컨테이너 컴포넌트를 사용할 수 있습니다. 스토리북은 이러한 모든 시나리오를 지원할 만큼 충분히 유연합니다. 이에 대한 자세한 내용은 [데이터 및 상태 관리를 위한 스토리북 애드온](https://storybook.js.org/blog/storybook-addons-to-manage-data-state/)을 참조하세요.

컴포넌트를 개별적으로 구축하면 개발의 복잡성이 줄어듭니다. 약간의 CSS를 디버깅하기 위해 백엔드를 실행하고, 사용자로 로그인한 다음 UI를 클릭하는 귀찮은 과정을 거칠 필요가 없습니다. 모든 것을 스토리로 설정하고 진행할 수 있습니다. 그리고 해당 스토리에 대해 자동화된 회귀 테스트를 실행할 수도 있습니다.

### 회귀 포착하기

[이전 장](/ui-testing-handbook/react/ko/visual-testing/)에서 크로마틱(Chromatic)을 설정하고 기본적인 작업 흐름을 살펴보았습니다. 이제 모든 복합 컴포넌트에 대한 스토리가 있으므로, 아래 명령어로 시각적 테스트를 실행할 수 있습니다.

```
npx chromatic --project-token=<project-token>
```

TaskList 및 InboxScreen에 대한 스토리가 포함된 diff가 표시되어야 합니다.

![](/ui-testing-handbook/cascading-changes.png)

이제 Task 컴포넌트에서 폰트 크기나 배경색 같은 것들을 변경해보세요. 그런 다음 commit하고 크로마틱을 다시 실행해봅시다.

![](/ui-testing-handbook/cascading-stories.gif)

애플리케이션의 트리 같은 특성은 Task 컴포넌트의 변경사항이 상위 컴포넌트에 대한 테스트에서도 포착된다는 것을 의미합니다. 구성 테스트를 통해 수정한 내용의 모든 부수효과를 알 수 있습니다.

## 컴포넌트의 기능 확인하기

다음 장에서는 단순한 모양새 뿐만 아니라 상호작용(interaction)을 테스트할 것입니다. 사용자가 완료한 일정을 체크했을 때, 적절한 이벤트가 발생하고 상태가 올바르게 업데이트되는지 어떻게 확인할 수 있을까요?
