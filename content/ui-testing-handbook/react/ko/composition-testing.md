---
title: '컴포넌트 구성 테스트'
tocTitle: '구성'
description: '사소한 변경이 커다란 회귀로 변하는 것을 방지하기'
commit: '60b8d8f'
---

<!-- In Jan 2021, [Tesla recalled 158,000 cars](https://www.theverge.com/2021/1/13/22229854/tesla-recall-model-s-x-touchscreens-bricked-failure-nhtsa) because one module—the display—malfunctioned. With a broken display console, you can’t access the backup camera, turn signals, or driver assistance. That significantly increases the risk of a crash. -->

2021년 1월, Tesla는 디스플레이 모듈의 오작동으로 [158,000대의 자동차를 리콜했습니다.](https://www.theverge.com/2021/1/13/22229854/tesla-recall-model-sx-touchscreens-bricked-failure-nhtsa) 
디스플레이 콘솔이 고장나면 백업 카메라나 방향 지시등, 또는 운전자 지원에 접근할 수 없습니다. 이는 충돌 위험을 크게 증가시킵니다.

<!-- > One defective module escalated into a major failure. -->

> 모듈 하나의 결함이 심각한 장애로 확대된 것입니다.

<!-- UIs suffer from a similar challenge because apps, much like cars, are an interconnected network of parts. A bug in one component affects all others around it. Not to mention every part of the app where it’s used. Testing how UI components are composed helps you to prevent such bugs. -->

앱이 자동차처럼 각 부분이 서로 연결되어 있기 때문에, UI도 비슷한 문제를 겪고 있습니다. 컴포넌트 하나의 버그가 주변의 다른 부분에도 전부 영향을 미칩니다. 그 컴포넌트가 사용되는 부분은 말할 것도 없죠. UI 컴포넌트가 어떻게 구성되는지 테스트하면 이러한 버그를 방지하는 데 도움이 됩니다.

<!-- Testing the more complex parts of the UI is tricky. They are created by combining many simpler components and are also wired up to the application state. In this chapter, we'll look at how to isolate and apply visual testing to composite components. Along the way, you'll learn about mocking data and simulating application logic. And ways to test component integration. -->

UI의 복합 컴포넌트를 테스트하는 것은 더욱 까다롭습니다. 복합 컴포넌트는 단순한 컴포넌트 여러 개가 모여 구성되며 애플리케이션의 상태와도 연결됩니다. 이번 챕터에서는 복합 컴포넌트를 분리하고 시각적 테스트를 적용하는 방법을 살펴보겠습니다. 이 과정에서 목 데이터(mocking data)와 애플리케이션 로직을 시뮬레이션 하는 방법을 배우게 됩니다. 또한 컴포넌트 통합 테스트를 하는 방법에 대해서도 알게될 것입니다. 



<!-- ## Small bugs end up breaking apps -->

## 작은 버그가 앱 전체를 망칩니다

<!-- Applications are built by plugging components into each other. This means a bug in one element can impact its neighbours. For example, renaming a prop can disrupt data flow from parent to child components. Or incorrect CSS in a UI element often leads to broken layouts. -->

애플리케이션은 컴포넌트를 서로 연결하여 구축됩니다. 그렇기 때문에 엘리먼트 하나의 버그 한 개가 그 주변 전체에 영향을 미치기도 합니다. 예를 들어, prop의 이름을 바꾸는 것만으로 부모 컴포넌트에서 자식 컴포넌트로의 데이터 흐름이 중단될 수 있습니다. 혹은 잘못 스타일링된 엘리먼트 하나로 레이아웃 자체가 깨지기도 합니다. 

<!-- ![minor tweaks cause major regressions](/ui-testing-handbook/minor-major-regressions-1.gif) -->

![사소한 수정이 큰 회귀를 초래합니다.](/ui-testing-handbook/minor-major-regressions-1.gif)

<!-- Consider the Button component from [Storybook’s design system](https://5ccbc373887ca40020446347-oghpnhotjv.chromatic.com/?path=/docs/button--basic). It is used countless times across multiple pages. A bug in `Button` will inadvertently lead to bugs in all those pages. In other words, one failure can compound exponentially. As you move up the component hierarchy towards the level of pages, the impact of these bugs increases. Therefore, we need a way to catch such cascading issues early and figure out the root cause. -->

[Storybook 디자인 시스템](https://5ccbc373887ca40020446347-oghpnhotjv.chromatic.com/?path=/docs/button--basic)의 Button 컴포넌트를 생각해봅시다. 이 컴포넌트는 여러 페이지에서 셀 수 없이 많이 사용됩니다. `Button`의 버그는 곧 버튼이 사용된 모든 페이지의 버그로 이어집니다. 즉, 하나의 실수가 기하급수적인 실수로 번진다는 뜻입니다. 컴포넌트 계층이 페이지 수준으로 올라갈수록 이러한 버그의 영향도 커집니다. 따라서 이런 연속적인 문제를 조기에 포착하고 근본 원인을 파악할 수 있는 방법이 필요합니다.

<!-- ![The same button component is being used across multiple pages of an app](/ui-testing-handbook/design-system-inconsistent-buttons.jpg) -->

![앱의 여러 페이지에서 동일한 버튼 컴포넌트가 사용되고 있습니다](/ui-testing-handbook/design-system-inconsistent-buttons.jpg)


<!-- ## Composition testing -->

## 구성 테스트

<!-- Visual tests catch bugs by capturing and comparing image snapshots of stories—in a real browser. Which makes them ideal for spotting UI changes and identifying the root cause. Here’s a quick reminder of the process: -->

시각적 테스트는 실제 브라우저에서 story의 이미지 스냅샷을 캡처하고 비교하여 버그를 포착합니다. 따라서 UI 변경 사항을 파악하고 근본 원인을 알아차리는데 유용합니다. 이전 챕터에서 배웠던 테스트 프로세스를 떠올려봅시다:

<!-- 1. 🏷 **Isolate** components. Use Storybook to test one component at a time.
2. ✍🏽 Write out the **test cases**. Each component state is reproduced using props.
3. 🔍 **Manually verify** the appearance of each test case.
4. 📸 Catch **bugs** automatically using visual regression tests. -->

1. 🏷  컴포넌트 **분리**하기. Storybook을 사용해 한 번에 한 컴포넌트씩 테스트합니다.
2. ✍🏽 **테스트 케이스 작성하기.** 각 state는 props를 통해 재현됩니다.
3.  🔍 **수동으로 확인하기.** 각 테스트 케이스의 모양을 수동으로 확인합니다.
4.  📸 시각적 회귀 테스트를 통해 **UI 버그 자동으로 잡기**  

<!-- Composition testing is all about running visual tests on “composite” components higher up in the tree that are made up of several simpler components. That way you can quantify the impact that any change might have on the entire application. And ensure that the system works as a whole. -->

구성 테스트는 몇 가지 간단한 컴포넌트로 구성된 트리의 상위에 있는 "복합" 컴포넌트에 대해 시각적 테스트를 실행하는 것입니다. 이렇게 하면 변경 사항이 전체 애플리케이션에 미칠 수 있는 영향을 측량할 수 있습니다. 그리고 시스템이 전체적으로 작동하는지 확인합니다.

<!-- The key difference is that composite components track application state and pass behaviours down the tree. You’ll have to account for those when writing the test cases. -->

가장 중요한 차이는 복합 컴포넌트가 애플리케이션 상태를 추적하고 동작을 트리 아래로 전달한다는 것입니다. 테스트 케이스를 작성할 때는 이 점을 고려해야 합니다.

<!-- Let’s see this process in action by writing tests for the `TaskList` component, which displays the complete list of tasks belonging to the user. -->

사용자와 관련된 모든 할일 목록을 표시하는 `TaskList` 컴포넌트에 대한 테스트를 작성하여 이 프로세스가 실제로 작동하는지 살펴보겠습니다.

<!-- It moves pinned tasks to the top of the list. And has a loading and empty state. We’ll start by writing stories for all these scenarios. -->

핀 버튼을 누르면 해당 일정은 목록의 맨 위로 이동합니다. 로딩중일 때도 있고, 아무런 일정이 없을 때도 있습니다. 이 모든 시나리오에 대한 이야기를 작성하는 것으로 시작해봅시다.

<!-- ![Task list has four states: Default, Empty, Loading and Pinned](/ui-testing-handbook/task-list.png) -->

![Task list는 4가지 상태를 가지고 있습니다: 디폴트일 때, 아무것도 없을 때, 로딩중일 때, 고정됐을 때](/ui-testing-handbook/task-list.png)

<!-- Create a story file, registering the `TaskList` component and add in a story for the default case. -->

story 파일을 생성하고 `TaskList` 컴포넌트를 등록하세요. 그리고 디폴트 케이스에 대한 story를 추가합니다.

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

<!-- Notice the `argTypes`. [Args](https://storybook.js.org/docs/react/writing-stories/args) are Storybook's mechanism for defining inputs to a story. Think of them as framework-agnostic props. Args defined at the component level are automatically passed down to each story. In our case, we have defined three event handlers using the [Actions addon](https://storybook.js.org/docs/react/essentials/actions). -->

'argTypes'에 주목하세요. [Args](https://storybook.js.org/docs/react/writing-stories/args)는 story에 대한 입력을 정의하기 위한 Storybook의 메커니즘입니다. 프레임워크에 구애받지 않는 props로 생각하세요. 컴포넌트 수준에서 정의된 인수는 자동으로 각 story에 전달됩니다. 우리의 경우 [Actions addon](https://storybook.js.org/docs/react/essentials/actions)을 사용하여 3개의 이벤트 핸들러를 정의했습니다.

<!-- These simulated actions will show up in the addons panel as you interact with `TaskList`. Allowing you to verify that the components are wired correctly. -->

이렇게 시뮬레이션된 작업은 `TaskList`와 상호 작용할 때 애드온 패널에 표시됩니다. 컴포넌트가 올바른 위치에 놓였는지 확인할 수 있습니다.

![](/ui-testing-handbook/tasklist-actions.gif)

<!-- ### Composing args -->

### 인수(args) 구성

<!-- The same way you combine components to create new UIs, you can combine args to create new stories. It’s typical that the args of a composite component will even combine args from its sub-components. -->

컴포넌트를 결합하여 새 UI를 만드는 것과 같은 방식으로 인수를 결합하여 새 story를 만들 수 있습니다. 복합 컴포넌트의 args는 하위 컴포넌트의 args를 결합하는 것이 일반적입니다.

<!-- The event handler args are already defined in the Task stories file, which we can reuse. Similarly, we can also use args from the default story to create the pinned tasks story. -->

이벤트 핸들러 인수는 재사용 가능한 Task story 파일에 이미 정의되어 있습니다. 마찬가지로 기본 story의 args를 사용하여 고정된 일정에 대한 story를 만들 수도 있습니다.

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

<!-- Shaping stories through args composition is a powerful technique. It allows us to write stories without repeating the same data over and over again. And more importantly, it tests component integration. If you rename one of the `Task` component props, that'll lead to failed test cases for `TaskList`. -->

args 구성을 통해 story를 형성하는 것은 아주 강력한 기술입니다. 이를 통해 동일한 데이터를 반복해서 적지 않아도 story를 작성할 수 있습니다. 더욱 훌륭한 점은 컴포넌트를 통합적으로 테스트를 할 수 있다는 것입니다. 만약 `Task` 컴포넌트의 prop 중 하나의 이름을 바꾸면, `TaskList`에 대한 테스트 케이스가 실패하게 됩니다.

![](/ui-testing-handbook/tasklist-stories.gif)

<!-- So far, we’ve only dealt with components that accept data and callback via props. Things get trickier when your component is wired up to an API or has internal state. Next we'll look at how to isolate and test such connected components. -->

지금까지는 props를 통해 데이터와 콜백을 허용하는 컴포넌트만 다루었습니다. 그런데 컴포넌트가 API에 연결되어 있거나 내부 상태가 있는 경우에는 상황이 더 까다로워집니다. 자, 이제 이렇게 서로 연결된 컴포넌트를 분리하고 테스트하는 방법을 살펴보겠습니다.

<!-- ### Stateful composite components -->

### 상태유지(Stateful) 복합 컴포넌트

<!-- The `InboxScreen` uses a [custom hook](https://github.com/chromaui/ui-testing-guide-code/blob/composition-testing/src/useTasks.js) to fetch data from the Taskbox API and to manage application state. Much like unit tests, we want to detach components from the real backend and test the features in isolation. -->

'InboxScreen'은 [custom hook](https://github.com/chromaui/ui-testing-guide-code/blob/composition-testing/src/useTasks.js)을 사용해서 Taskbox API에서 데이터를 가져오고 애플리케이션의 상태를 관리합니다. 단위 테스트를 할 때처럼 실제 백엔드로부터 컴포넌트를 분리하고 기능별로 테스트해봅시다.

![](/ui-testing-handbook/taskbox.png)

<!-- That’s where Storybook addons come in. They allow you to mock API requests, state, context, providers and anything else that your component relies on. Teams at [The Guardian](https://5dfcbf3012392c0020e7140b-borimwnbdl.chromatic.com/?path=/story/layouts-showcase--article-story) and [Sidewalk Labs](https://www.sidewalklabs.com/) (Google) use them to build entire pages in isolation. -->

바로 이런 상황에 Storybook 애드온이 필요합니다. Storybook 애드온을 통해  API 요청, 상태, 컨텍스트, provider 및 컴포넌트가 의존하는 모든 것을 모의할 수 있습니다. [The Guardian](https://5dfcbf3012392c0020e7140b-borimwnbdl.chromatic.com/?path=/story/layouts-showcase--article-story) 과 [Sidewalk Labs](https://www.sidewalklabs.com/) (Google) 같은 회사는 이 애드온을 사용해서 전체 페이지를 개별적으로 구축합니다.

<!-- For the InboxScreen, we are going to use [Mock Service Worker (MSW) addon](https://storybook.js.org/addons/msw-storybook-addon/) to intercept requests at the network level and return mocked responses. -->

InboxScreen의 경우, [Mock Service Worker(MSW) 애드온](https://storybook.js.org/addons/msw-storybook-addon/)을 통해 네트워크 레벨에서 요청을 가로채고 모의 응답을 반환합니다.

<!-- Install msw & its storybook addon. -->

MSW와 MSW 애드온을 설치하세요.

```
yarn add -D msw msw-storybook-addon
```

<!-- Then, generate a new service worker in your public folder. -->


그런 다음, public 폴더에 새 서비스 워커를 생성하세요.

```
npx msw init public/
```

<!-- Enable the MSW addon in your `.storybook/preview.js` file: -->

`.storybook/preview.js` 파일에서 MSW 애드온을 활성화하세요 :

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

<!-- Lastly, restart the `yarn storybook` command. And we’re all set to mock API requests in stories. -->

마지막으로 'yarn storybook' 커맨드를 다시 실행하세요. 자, story의 mock API 요청에 관한 설정이 모두 완료되었습니다.

<!-- `InboxScreen` calls the `useTasks` hook which in-turn fetches data from the `/tasks` endpoint. We can specify the mock responses using the `msw` parameter. Notice how you can return different responses for each story. -->

`InboxScreen`은 `/tasks` 엔드포인트에서 차례로 데이터를 가져오는 `useTasks` hook을 호출합니다. `msw` 매개변수를 사용하여 모의 응답을 지정할 수 있습니다. 각 story에 대해 다른 응답을 반환하는 방법을 확인해보세요.


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
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json(TaskListDefault.args));
    }),
  ],
};

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
Error.parameters = {
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json([]));
    }),
  ],
};
```

![](/ui-testing-handbook/inbox-screen.gif)

<!-- State has many different forms. Some applications track bits of state globally using libraries such as Redux and MobX. Or by making GraphQL queries. Or they might use container components. Storybook is flexible enough to support all these scenarios. For more on this, see: [Storybook addons to manage data & state](https://storybook.js.org/blog/storybook-addons-to-manage-data-state/). -->

state에는 다양한 형태가 있습니다. 일부 애플리케이션은 Redux나 MobX 같은 라이브러리를 사용하여 전역적으로 상태 비트를 추적합니다. 또는 GraphQL 쿼리를 작성하거나 container 컴포넌트를 사용할 수 있습니다. Storybook은 이러한 모든 시나리오를 지원할 만큼 충분히 유연합니다. 이에 대한 자세한 내용은 [데이터 및 상태 관리를 위한 Storybook 애드온](https://storybook.js.org/blog/storybook-addons-to-manage-data-state/)을 참조하세요.

<!-- Building components in isolation curtails the complexity of development. You don't have to spin up the back-end, log in as a user, and click around the UI just to debug some CSS. You can set it all up as a story and get going. And you can even run automated regression tests on those stories. -->

컴포넌트를 개별적으로 구축하면 개발의 복잡성이 줄어듭니다. 약간의 CSS를 디버깅하기 위해 백엔드를 실행하고, 사용자로 로그인한 다음 UI를 클릭하는 귀찮은 과정을 거칠 필요가 없습니다. 모든 것을 story로 설정하고 진행할 수 있습니다. 그리고 해당 story에 대해 자동화된 회귀 테스트를 실행할 수도 있습니다.

<!-- ### Catch regressions -->

### 회귀 포착하기

<!-- In the [previous chapter](../visual-testing/), we set up Chromatic and went over the basic workflow. Now that we have stories for all our composite components, we can execute the visual tests by running: -->

[이전 챕터](../visual-testing/)에서 Chromatic을 설정하고 기본적인 작업 흐름을 살펴보았습니다. 이제 모든 복합 컴포넌트에 대한 story가 있으므로, 아래 커맨드로 시각적 테스트를 실행할 수 있습니다.

```
npx chromatic --project-token=<project-token>
```

<!-- You should be presented with a diff that includes stories for TaskList and the InboxScreen. -->

TaskList 및 InboxScreen에 대한 story가 포함된 diff가 표시되어야 합니다.

![](/ui-testing-handbook/cascading-changes.png)

<!-- Now try changing something in the Task component, something like font size or background color. Then make a commit and rerun Chromatic. -->

이제 Task component에서 font size나 background color 같은 것들을 변경해보세요. 그런 다음 커밋하고 Chromatic을 다시 실행해봅시다.

![](/ui-testing-handbook/cascading-stories.gif)

<!-- The tree-like nature of applications means that any tweak to the Task component will also be caught by tests for higher level components. Composition testing allows you to understand the potential impact of every small changes. -->

애플리케이션의 트리 같은 특성은 Task component의 변경사항이 상위 컴포넌트에 대한 테스트에서도 포착된다는 것을 의미합니다. 구성 테스트를 통해 수정한 내용의 모든 부수효과를 알 수 있습니다.

<!-- ## Verifying component functionality -->

## 컴포넌트의 기능 확인하기

<!-- Next up, we'll go beyond appearance and into testing interactions. When the user checks off a task, how do you ensure that the suitable event was fired and that state updated correctly? -->

다음 챕터에서는 단순한 모양새 뿐만 아니라 인터랙션(interaction)을 테스트할 것입니다. 사용자가 완료한 일정을 체크했을 때, 적절한 이벤트가 발생하고 상태가 올바르게 업데이트되는지 어떻게 확인할 수 있을까요?