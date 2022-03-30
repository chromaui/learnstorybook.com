---
title: '컴포넌트 상호작용 테스트하기'
tocTitle: '상호작용'
description: '사용자의 동작을 시뮬레이션하고 기능별 검사를 실행하는 방법 알아보기'
commit: ''
---

<!-- 1차 리뷰 완료  -->

스위치를 눌러도, 전등이 켜지지 않습니다. 전구가 타버린 것일 수도, 혹은 배선 결함이었을 수도 있습니다. 스위치와 전구는 벽 안쪽의 선들로 서로 연결되어 있습니다.

<!-- 
You flip the switch, and the light doesn’t turn on. It could be a burnt-out light bulb, or it could be faulty wiring. The switch and the bulb are connected to each other with wires inside the walls. -->

앱도 마찬가지입니다. 표면상으로 사용자들이 보고 상호작용하는 것은 UI입니다. 그 안을 들여다 보면, UI는 정보와 이벤트의 흐름이 잘 동작하도록 
연결되어 있습니다.

<!-- 
Apps are the same. On the surface is the UI that the user sees and interacts with. Under the hood, the UI is wired up to facilitate the flow of data and events. -->

페이지처럼 더 복잡한 UI를 만들수록 컴포넌트들은 UI 렌더링 그 이상의 역할을 하게 됩니다. 컴포넌트들은 정보를 조합하고 상태를 관리합니다. 이 장에서는 컴퓨터를 사용하여 사용자 상호 작용을 시뮬레이션하고 확인하는 방법에 대해 설명하겠습니다.

<!-- 
As you build more complex UIs like pages, components become responsible for more than just rendering the UI. They fetch data and manage state. This chapter will teach you how to use a computer to simulate and verify user interactions. -->

![](/ui-testing-handbook/1_bfTfHf-9RSQ_s3FhnRBaeQ.png)

## 그 컴포넌트가 진짜로 작동하나요?

<!-- 
## Does that component really work? -->

컴포넌트의 주요 임무는 props를 받아서 한 조각의 UI으로 렌더링하는 것입니다. 더 복잡한 컴포넌트들은 애플리케이션의 상태를 추적하기도 하며 애플리케이션의 동작들을 컴포넌트 트리 아래로 전달합니다.

<!-- 
A component's primary task is to render a piece of the UI given a set of props. More complex components also track application state and pass behaviours down the component tree. -->

예를 들어, 컴포넌트는 초기 상태를 가지고 시작합니다. 사용자가 입력창에 무언가를 타이핑하거나 버튼을 클릭할 때, 이런 동작들은 앱 안의 event를 발생시킵니다. 그럼 이 컴포넌트는 이 event에 대한 응답으로 상태를 업데이트합니다. 이러한 상태 변화들은 렌더링된 UI를 업데이트하고, 이것이 바로 상호작용을 하는 하나의 주기입니다.

<!-- 
For example, a component will start with an initial state. When the user types something in an input field or clicks a button, it triggers an event within the app. The component updates state in response to this event. Those state changes then update the rendered UI. That's the complete cycle for an interaction. -->

`InboxScreen`에서, 사용자는 일정을 고정시키기 위해 별 아이콘을 클릭할 수 있습니다. 혹은 checkbox를 클릭해 업무를 보관할 수 있습니다. 시각적 테스트들은 컴포넌트가 이러한 모든 상태 안에서 올바르게 보이는지 확인합니다. 또한 우리는 UI가 이와 같은 상호 작용에 정확히 응답하는지 확인해야합니다.

<!-- 
On the `InboxScreen`, the user can click on the star icon to pin a task. Or click on the checkbox to archive it. Visual tests ensure that the component looks right in all those states. We also need to ensure that the UI is responding to those interactions correctly. -->

![](/ui-testing-handbook/interactive-taskbox.gif)

상호 작용 테스트 작업 흐름(workflow)은 다음과 같습니다. - 

<!-- 
Here's what the interaction testing workflow looks like: -->

1.  **📝 설정:** 컴포넌트를 분리해 적절한 props를 주고 초기 상태로 만들기.

<!-- 
1.  **📝 Setup:** isolate the component and supply the appropriate props for the initial state. -->

2.  **🤖 실행:** 컴포넌트를 렌더링하고 상호작용을 시뮬레이션 하기.

<!-- 
2.  **🤖 Action:** render the component and simulate interactions. -->

3.  ✅ **assertions을 실행**해서 컴포넌트의 상태가 올바르게 업데이트 되었는지 확인하기.

<!-- 
3.  ✅ **Run assertions** to verify that the state updated correctly. -->

Taskbox 앱은 [Jest](https://jestjs.io/)와 함께 사전 구성된 Create React App을 사용해 부트스트랩 되었습니다. 여기서 우리는 테스트를 쓰고 실행하는데 이 앱을 사용하고자 합니다.

<!-- 
The Taskbox app was bootstrapped using Create React App, which comes pre-configured with [Jest](https://jestjs.io/). That's what we'll use to write and run the tests. -->

### 컴포넌트가 어떻게 동작하는지가 아닌 무엇을 하는지 테스트 해보세요.

<!-- 
### Test what a component does, not how it does it -->

![](/ui-testing-handbook/1_AyDgC9kxOjUl8Yihq0ltTQ.gif)

유닛 테스트와 마찬가지로, 컴포넌트의 내부 작동테스트도 피하고 싶습니다. 내부 작동테스트는 코드를 리팩터링 할 때마다 결과값의 변화 여부에 관계없이 테스트를 중단시키므로 테스트를 불안정하게 만듭니다. 그래서 속도가 느려집니다.

<!-- 
Much like unit tests, we want to avoid testing the inner workings of a component. This makes tests brittle because any time you refactor code it'll break the tests, regardless of whether the output changed or not. Which in turn slows you down. -->

 그게 바로 Adobe, Twilio, Gatsby 그리고 더 많은 회사의 팀들이 [Testing-Library](https://testing-library.com/)를 사용하는 이유입니다. Testing-Library는 렌더링된 결과물을 평가할 수 있게 합니다. 이는 가상 브라우저 (JSDOM)에 구성 요소를 마운트하여 작동하며 사용자 상호작용을 복제하는 유틸리티를 제공합니다.

<!-- 
This is why teams at Adobe, Twilio, Gatsby and many more use [Testing-Library](https://testing-library.com/). It allows you to evaluate the rendered output. It works by mounting the component in a virtual browser (JSDOM) and provides utilities that replicate user interactions. -->

컴포넌트의 내부 상태와 메소드들에 접근하는 대신, 실제 사용법을 모방한 테스트를 작성할 수 있습니다. 더불어 사용자의 관점에서 테스트를 작성하는 것은 우리의 코드가 동작한다는 사실에 더 자신감을 갖게 합니다.

<!-- 
We can write tests that mimic real-world usage, instead of accessing a component’s internal state and methods. And writing tests from the user’s perspective gives us a lot more confidence that our code works. -->

## story를 상호작용 테스트 사례로 재사용해보세요

<!-- 
## Reuse stories as interaction test cases -->

앞 장에서는 `InboxScreen.stories.js` 파일에 `InboxScreen` 컴포넌트의 모든 사용 사례를 목록으로 작성했습니다. 이를 통해 개발 중 모습을 확인하고 비주얼 테스트를 통해 regression(회귀,퇴행..)을 포착할 수 있었습니다. 이 story는 이제 우리의 상호작용 테스트에도 힘을 실어줄 것입니다.

<!-- 
In the previous chapter, we catalogued all the use cases of the `InboxScreen` component in the `InboxScreen.stories.js` file. That allowed us to spot check appearance during development and to catch regressions via visual tests. These stories will now also power our interaction tests. -->

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
Story는 표준 자바스크립트 모듈을 기반으로 하며 이동 가능한 형식으로 작성됩니다. 어떤 자바스크립트 기반의 테스트 라이브러리(Jest, Testing Lib, Playwright)와도 함께 story를 재사용할 수 있습니다. 따라서 제품군의 각 테스트 도구에 대한 테스트 사례를 설정하고 유지보수할 필요가 없습니다. 예를 들어, Adobe Spectrum 디자인설계팀은 이러한 패턴을 사용해 메뉴와 대화 상자 컴포넌트에 대한 [상호작용 테스트](https://github.com/adobe/react-spectrum/blob/f6c06605243ad2033fce95f80ae3fecd4a38daeb/packages/%40react-spectrum/dialog/test/DialogContainer.test.js#L62)를 수행합니다. 

<!-- 
Stories are written in a portable format based on standard JavaScript modules. You can reuse them with any JavaScript-based testing library (Jest, Testing Lib, Playwright). That saves you from needing to set up and maintain test cases for each testing tool in your suite. For example, the Adobe Spectrum design system team uses this pattern to [test interactions](https://github.com/adobe/react-spectrum/blob/f6c06605243ad2033fce95f80ae3fecd4a38daeb/packages/%40react-spectrum/dialog/test/DialogContainer.test.js#L62) for their menu and dialog components. -->

![](/ui-testing-handbook/portable-stories.jpg)

테스트 사례로 story를 작성할 때, 어떤 형태의 assertion도 story의 최상단으로 올려질 수 있습니다. 한 번 해보세요. `InboxScreen.test.js`파일을 만들고 첫 번째 테스트를 작성해봅시다. 위의 예와 같이 우리는 이러한 테스트에 story를 가져와서 Testing-Library에 잇는 `render` 기능을 이용해 쌓습니다. 

<!-- 
When you write your test cases as stories, any form of assertion can be layered on top. Let’s try that out. Create the `InboxScreen.test.js` file and write the first test. Like the example above, we are importing a story into this test and mounting it using the `render` function from Testing-Library. -->

`it` 블록은 우리의 테스트를 나타냅니다. 먼저 컴포넌트를 렌더링하고 데이터를 가져올 때까지 기다린 후 특정 작업을 찾아 핀 버튼을 클릭합니다. assertion은 고정된 상태가 업데이트 되었는지 확인합니다. 마지막으로 `afterEach` 블록이 테스트 중에 마운트된 React 트리들을 마운트 해제하여 정리합니다.

<!-- 
The `it` block describes our test. We start by rendering the component, waiting for it to fetch data, finding a particular task, and clicking the pin button. The assertion checks to see if the pinned state has been updated. Finally, the `afterEach` block cleans up by un-mounting React trees mounted during the test. -->

```javascript:title=src/InboxScreen.test.js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render,
  waitFor,
  cleanup,
  within,
  fireEvent,
} from '@testing-library/react';
import * as stories from './InboxScreen.stories';

describe('InboxScreen', () => {
  afterEach(() => {
    cleanup();
  });

  const { Default } = stories;

  it('should pin a task', async () => {
    const { queryByText, getByRole } = render(<Default />);

    await waitFor(() => {
      expect(queryByText('You have no tasks')).not.toBeInTheDocument();
    });

    const getTask = () => getByRole('listitem', { name: 'Export logo' });

    const pinButton = within(getTask()).getByRole('button', { name: 'pin' });

    fireEvent.click(pinButton);

    const unpinButton = within(getTask()).getByRole('button', {
      name: 'unpin',
    });

    expect(unpinButton).toBeInTheDocument();
  });
});
```
`yarn test`실행해 Jest를 시작합니다. 그러면 테스트가 실패한 것을 알 수 있습니다.

<!-- 
Run `yarn test` to start up Jest. You’ll notice that the test fails. -->

![](/ui-testing-handbook/yarn-test-fail.png)

`InboxScreen`은 백엔드에서 데이터를 가져옵니다. [이전 장](../composition-testing)에서는, 이러한 API 요청을 mock 하기 위해 [Storybook MSW addon](https://storybook.js.org/addons/msw-storybook-addon/)를 설치했습니다. 하지만 Jest에서는 이 방식이 통하지 않습니다. 우리는 이 요청과 다른 컴포넌트 의존성을 함께 가져올 방법이 필요합니다.

<!-- 
`InboxScreen` fetches data from the back-end. In the [previous chapter](../composition-testing), we set up [Storybook MSW addon](https://storybook.js.org/addons/msw-storybook-addon/) to mock this API request. However, that isn’t available to Jest. We’ll need a way to bring this and other component dependencies along. -->

### 이동할 컴포넌트의 설정

<!-- ### Component configs to go -->

복잡한 컴포넌트는 theme provider나 context와 같은 외부 의존성에 기대어 전역 데이터를 공유합니다. Storybook은 [decorators](https://storybook.js.org/docs/react/writing-stories/decorators)을 사용해 story를 감싸고 그러한 기능을 제공합니다. 모든 구성과 함께 story를 가져오려면 [@storybook/testing-react](https://github.com/storybookjs/testing-react) 라이브러리를 사용합니다.

<!-- 
Complex components rely on external dependencies such as theme providers and context to share global data. Storybook uses [decorators](https://storybook.js.org/docs/react/writing-stories/decorators) to wrap a story and provide such functionality. To import stories along with all their config, we'll use the [@storybook/testing-react](https://github.com/storybookjs/testing-react) library. -->

이 과정은 보통 두 단계로 이루어지는데, 우선, 전역 데코레이터들을 모두 등록해야합니다. 우리의 경우, 두 개의 데코레이터가 있습니다 - Chakra UI 테마를 제공하는 데코레이터와 MSW 애드온을 위한 데코레이터입니다. 두 데코레이터 모두 [`.storybook/preview`](https://github.com/chromaui/ui-testing-guide-code/blob/interaction-testing/.storybook/preview.js) 파일을 통해 구성됩니다.

<!-- 
This is usually a two-step process. First, we need to register all global decorators. In our case, we have two: a decorator that provides the Chakra UI theme and one for the MSW addon. Both configured via the [`.storybook/preview`](https://github.com/chromaui/ui-testing-guide-code/blob/interaction-testing/.storybook/preview.js) file. -->

Jest는 프로젝트가 부트스트랩될 때 CRA에 의해 자동으로 생성되는 글로벌 설정 파일 `setupTest.js`를 제공합니다. 해당 파일을 업데이트해서 Storybook의 글로벌 설정을 등록합니다.

<!-- 
Jest offers a global setup file `setupTests.js`, auto-generated by CRA when the project is bootstrapped. Update that file to register Storybook’s global config. -->

```javascript:title=setupTests.js
import '@testing-library/jest-dom';

import { setGlobalConfig } from '@storybook/testing-react';
import * as globalStorybookConfig from '../.storybook/preview';

setGlobalConfig(globalStorybookConfig);
```

이어서, 테스트를 업데이트하여 `@storybook/testing-react`에서 `composeStories` 유틸리티를 사용합니다. 이 테스트는 모든 데코레이터가 적용된 story들을 1:1 map으로 치환합니다. 그러면 짜잔, 우리의 테스트는 통과했습니다!

<!-- 
Next, update the test to use the `composeStories` utility from `@storybook/testing-react`. It returns a 1:1 map of the stories with all decorators applied to them. And voilà, our test is passing! -->

```javascript:title=src/InboxScreen.test.js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render,
  waitFor,
  cleanup,
  within,
  fireEvent,
} from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { getWorker } from 'msw-storybook-addon';
import * as stories from './InboxScreen.stories';

describe('InboxScreen', () => {
  afterEach(() => {
    cleanup();
  });

  // 모든 테스트가 완료된 후에 정리해서(clean up)  Clean up after all tests are done, preventing this
  // 이는 관련이 없는 테스트에 영향을 미치는 레이어를 차단합니다.  interception layer from affecting irrelevant tests
  afterAll(() => getWorker().close());

  const { Default } = composeStories(stories);

  it('should pin a task', async () => {
    const { queryByText, getByRole } = render(<Default />);

    await waitFor(() => {
      expect(queryByText('You have no tasks')).not.toBeInTheDocument();
    });

    const getTask = () => getByRole('listitem', { name: 'Export logo' });

    const pinButton = within(getTask()).getByRole('button', { name: 'pin' });

    fireEvent.click(pinButton);

    const unpinButton = within(getTask()).getByRole('button', {
      name: 'unpin',
    });

    expect(unpinButton).toBeInTheDocument();
  });
});
```
우리는 Testing Library을 이용해 story를 올리고 렌더링하는 테스트를 성공적으로 작성했습니다. 그 후 시뮬레이션된 사용자의 동작을 적용하고 해당 컴포넌트의 상태가 정확히 업데이트 되었는지 확인합니다.

<!-- 
We’ve successfully written a test that loads up a story and renders it using Testing Library. Which then applies simulated user behaviour and checks to see if the component state is updated accurately or not. -->

![](/ui-testing-handbook/yarn-test-pass.png)

같은 패턴을 적용해서 아키이브 및 편집 시나리오에 대한 테스트를 추가할 수 있습니다.

<!-- 
Using the same pattern, we can also add tests for the archive and editing scenarios. -->

```javascript
it('should archive a task', async () => {
  const { queryByText, getByRole } = render(<Default />);

  await waitFor(() => {
    expect(queryByText('You have no tasks')).not.toBeInTheDocument();
  });

  const task = getByRole('listitem', { name: 'QA dropdown' });
  const archiveCheckbox = within(task).getByRole('checkbox');
  expect(archiveCheckbox.checked).toBe(false);

  fireEvent.click(archiveCheckbox);
  expect(archiveCheckbox.checked).toBe(true);
});

it('should edit a task', async () => {
  const { queryByText, getByRole } = render(<Default />);

  await waitFor(() => {
    expect(queryByText('You have no tasks')).not.toBeInTheDocument();
  });

  const task = getByRole('listitem', {
    name: 'Fix bug in input error state',
  });
  const taskInput = within(task).getByRole('textbox');

  const updatedTaskName = 'Fix bug in the textarea error state';

  fireEvent.change(taskInput, {
    target: { value: 'Fix bug in the textarea error state' },
  });
  expect(taskInput.value).toBe(updatedTaskName);
});
```
요약하면, 설정 코드는 story안에 존재하고, 액션과 명령들은 테스트 파일 안에 존재합니다. 코드들은 Testing Library을 사용해 사용자의 방식으로 UI와 상호작용합니다. 향후 컴포넌트 구현이 변경되면, 결과물이나 동작이 수정될 때에만 테스트가 중단될 것입니다.

<!-- 
In summary, the setup code lives in the stories file, and the actions and assertions live in the test file. With Testing Library, we interacted with the UI in the way a user would. In the future, if the component implementation changes, it will only break the test if the output or behaviour is modified. -->

![](/ui-testing-handbook/yarn-test-all.png)

## 사용적 합성의 문제 파악하기

<!-- ## Catching usability issues -->

모든 사용자가 우리의 UI를 사용할 수 있게 되면, 비즈니스 재무에 영향을 미치고 [법적 요구사항](https://www.w3.org/WAI/policies/?q=government)을 충족시키게 됩니다. 이것은 윈-윈 관계라고 할 수 있습니다. 다음 장에서는 story의 이동성을 활용해 접근성 테스트를 간소화하는 방법을 보여주려 합니다.

<!-- 
When you ensure your UI is usable to every user, you impact the business financials and satisfy [legal requirements](https://www.w3.org/WAI/policies/?q=government). It’s a win-win. The next chapter demonstrates how you can leverage the portability of stories to simplify accessibility testing. -->
