---
title: '컴포넌트 상호작용 테스트하기'
tocTitle: '상호작용'
description: '사용자의 동작을 시뮬레이션하고 기능별 검사를 실행하는 방법 알아보기'
commit: ''
---

스위치를 눌러도, 전등이 켜지지 않습니다. 전구가 타버린 것일 수도, 혹은 배선 결함이었을 수도 있습니다. 스위치와 전구는 벽 안쪽의 선들로 서로 연결되어 있습니다.

앱도 마찬가지입니다. 표면상으로 사용자들이 보고 상호작용하는 것은 UI입니다. 그 안을 들여다 보면, UI는 정보와 이벤트(event)의 흐름이 잘 동작하도록 연결되어 있습니다.

페이지처럼 더 복잡한 UI를 만들수록 컴포넌트들은 UI 렌더링 그 이상의 역할을 하게 됩니다. 컴포넌트들은 정보를 조합하고 상태를 관리합니다. 이 장에서는 컴퓨터를 사용하여 사용자 상호 작용을 시뮬레이션하고 확인하는 방법에 대해 설명하겠습니다.

![](/ui-testing-handbook/1_bfTfHf-9RSQ_s3FhnRBaeQ.png)

## 그 컴포넌트가 진짜로 작동하나요?

컴포넌트의 주요 임무는 props를 받아서 한 조각의 UI으로 렌더링하는 것입니다. 더 복잡한 컴포넌트들은 애플리케이션의 상태를 추적하기도 하며 애플리케이션의 동작들을 컴포넌트 트리 아래로 전달합니다.

예를 들어, 컴포넌트는 초기 상태를 가지고 시작합니다. 사용자가 입력창에 무언가를 타이핑하거나 버튼을 클릭할 때, 이런 동작들은 앱 안의 이벤트를 발생시킵니다. 그럼 이 컴포넌트는 이 이벤트에 대한 응답으로 상태를 업데이트합니다. 이러한 상태 변화들은 렌더링된 UI를 업데이트하고, 이것이 바로 상호작용을 하는 하나의 주기입니다.

`InboxScreen`에서, 사용자는 일정을 고정시키기 위해 별 아이콘을 클릭할 수 있습니다. 혹은 checkbox를 클릭해 업무를 보관할 수 있습니다. 시각적 요소 테스트들은 컴포넌트가 이러한 모든 상태 안에서 올바르게 보이는지 보장합니다. 또한 우리는 UI가 이와 같은 상호 작용에 정확히 응답하는지 보장해야합니다.

![](/ui-testing-handbook/interactive-taskbox.gif)

상호 작용 테스트 작업 흐름(workflow)은 다음과 같습니다. - 

1.  **📝 설정:** 컴포넌트를 분리하고 초기 상태를 만들기 위해 적절한 props를 제공하기.
2.  **🤖 실행:** 컴포넌트를 렌더링하고 상호작용을 시뮬레이션 하기.
3.  ✅ **assertions을 실행**해서 컴포넌트의 상태가 올바르게 업데이트 되었는지 확인하기.

Taskbox 앱은 [Jest](https://jestjs.io/)와 함께 사전 구성된 Create React App을 사용해 부트스트랩 되었습니다. 여기서 우리는 테스트를 쓰고 실행하는데 이 앱을 사용하고자 합니다.

### 컴포넌트가 어떻게 동작하는지가 아닌 무엇을 하는지 테스트 해보세요.

![](/ui-testing-handbook/1_AyDgC9kxOjUl8Yihq0ltTQ.gif)

유닛 테스트와 마찬가지로, 컴포넌트의 내부 작동 테스트도 피하고 싶습니다. 내부 작동 테스트는 코드를 리팩토링 할 때마다 결과값의 변화 여부에 관계없이 테스트를 중단시키므로 테스트를 불안정하게 만듭니다. 그래서 속도가 느려집니다.

 그것이 바로 Adobe, Twilio, Gatsby 그리고 더 많은 회사의 팀들이 [Testing-Library](https://testing-library.com/)를 사용하는 이유입니다. Testing-Library는 렌더링된 결과물을 평가할 수 있게 합니다. 이는 가상 브라우저(JSDOM)에 구성 요소를 마운트하여 작동하며 사용자 상호작용을 복제하는 유틸리티를 제공합니다.

컴포넌트의 내부 상태와 메소드들에 접근하는 대신, 실제 사용법을 모방한 테스트를 작성할 수 있습니다. 더불어 사용자의 관점에서 테스트를 작성하는 것은 우리의 코드가 동작한다는 사실에 더 자신감을 갖게 합니다.

## 스토리(story)를 상호작용 테스트 케이스로 재사용해보세요

앞 장에서는 `InboxScreen.stories.js` 파일에 `InboxScreen` 컴포넌트의 모든 사용예를 카탈로그로 작성했습니다. 이를 통해 개발 중 모습을 확인하고 비주얼 테스트를 통해 회귀를 포착할 수 있었습니다. 이 스토리(story)는 이제 우리의 상호작용 테스트에도 힘을 실어줄 것입니다.

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
스토리는 표준 자바스크립트 모듈을 기반으로 하며 이동 가능한 형식으로 작성됩니다. 어떤 자바스크립트 기반의 테스트 라이브러리(Jest, Testing Lib, Playwright)에서도 스토리를 재사용할 수 있습니다. 따라서 제품군의 각 테스트 도구에 대한 테스트 케이스를 설정하고 유지보수할 필요가 없습니다. 예를 들어, Adobe Spectrum 디자인 설계팀은 이러한 패턴을 사용해 메뉴와 대화 상자 컴포넌트에 대한 [상호작용 테스트](https://github.com/adobe/react-spectrum/blob/f6c06605243ad2033fce95f80ae3fecd4a38daeb/packages/%40react-spectrum/dialog/test/DialogContainer.test.js#L62)를 수행합니다. 

![](/ui-testing-handbook/portable-stories.jpg)

테스트 케이스로 스토리를 작성할 때, 어떤 형태의 assertion도 스토리의 최상단으로 올려질 수 있습니다. 한 번 해보세요. `InboxScreen.test.js`파일을 만들고 첫 번째 테스트를 작성해봅시다. 위의 예와 같이 우리는 이러한 테스트에 스토리를 가져와 Testing-Library에 있는 `render` 기능을 이용하여 쌓습니다. 

`it` 블록은 우리의 테스트를 나타냅니다. 먼저 컴포넌트를 렌더링하고 데이터를 가져올 때까지 기다린 후 특정 작업을 찾아 핀 버튼을 클릭합니다. assertion은 고정된 상태가 업데이트 되었는지 확인합니다. 마지막으로 `afterEach` 블록이 테스트 중에 마운트된 리액트(React) 트리들을 마운트 해제하여 정리합니다.

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
`yarn test`를 실행해 제스트(Jest)를 시작합니다. 그러면 테스트가 실패한 것을 알 수 있습니다.

![](/ui-testing-handbook/yarn-test-fail.png)

`InboxScreen`은 백엔드에서 데이터를 가져옵니다. [이전 장](../composition-testing)에서는, 이러한 API 요청을 모의(mock) 하기 위해 [Storybook MSW addon](https://storybook.js.org/addons/msw-storybook-addon/)를 설치했습니다. 하지만 제스트에서는 이 방식이 통하지 않습니다. 우리는 이 요청과 다른 컴포넌트 의존성을 함께 가져올 방법이 필요합니다.

### 이동할 컴포넌트의 설정

복잡한 컴포넌트는 theme provider나 context와 같은 외부 의존성에 기대어 전역 데이터를 공유합니다. 스토리북(Storybook)은 [데코레이터들(decorators)](https://storybook.js.org/docs/react/writing-stories/decorators)을 사용해 스토리를 감싸고 그러한 기능을 제공합니다. 모든 구성과 함께 스토리를 가져오려면 [@storybook/testing-react](https://github.com/storybookjs/testing-react) 라이브러리를 사용합니다.

이 과정은 보통 두 단계로 이루어지는데, 우선, 전역 데코레이터들을 모두 등록해야합니다. 우리의 경우 두 개의 데코레이터가 있습니다 - Chakra UI 테마를 제공하는 데코레이터와 MSW 애드온을 위한 데코레이터입니다. 두 데코레이터 모두 [`.storybook/preview`](https://github.com/chromaui/ui-testing-guide-code/blob/interaction-testing/.storybook/preview.js) 파일을 통해 구성됩니다.

제스트는 프로젝트가 부트스트랩될 때 CRA에 의해 자동으로 생성되는 글로벌 설정 파일 `setupTest.js`를 제공합니다. 해당 파일을 업데이트해서 스토리북의 글로벌 설정을 등록합니다.

```javascript:title=setupTests.js
import '@testing-library/jest-dom';

import { setGlobalConfig } from '@storybook/testing-react';
import * as globalStorybookConfig from '../.storybook/preview';

setGlobalConfig(globalStorybookConfig);
```

이어서, `@storybook/testing-react`에서 `composeStories` 유틸리티를 사용하도록 테스트를 업데이트합니다. 이 테스트는 모든 데코레이터가 적용된 스토리들을 1:1 map으로 치환합니다. 그러면 짜잔, 우리의 테스트는 통과했습니다!

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

  // 모든 테스트가 완료된 후에 정리해서(clean up)  
  // 이 레이어가 다른 관련이 없는 테스트에 영향을 미치지 않도록 합니다. 
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
우리는 Testing Library을 이용해 스토리를 올리고 렌더링한 후에, 시뮬레이션된 사용자의 동작을 적용하고 해당 컴포넌트의 상태가 정확히 업데이트 되었는지 확인하는 테스트를 성공적으로 작성했습니다.

![](/ui-testing-handbook/yarn-test-pass.png)

같은 패턴을 적용해서 아카이브 및 편집 시나리오에 대한 테스트를 추가할 수 있습니다.

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
정리하면, 설정 코드는 스토리 파일 안에 존재하고, 액션과 명령들은 테스트 파일 안에 존재합니다. 코드들은 Testing Library을 사용해 사용자의 방식으로 UI와 상호작용합니다. 향후 컴포넌트 구현이 변경되면, 결과물이나 동작이 수정될 때에만 테스트가 중단될 것입니다.

![](/ui-testing-handbook/yarn-test-all.png)

## 사용성 문제 파악하기

모든 사용자가 우리의 UI를 사용할 수 있게 되면, 비즈니스 재무에 영향을 미치고 [법적 요구사항](https://www.w3.org/WAI/policies/?q=government)을 충족시키게 됩니다. 이것은 윈-윈 관계라고 할 수 있습니다. 다음 장에서는 스토리의 이동성을 활용해 접근성 테스트를 간소화하는 방법을 보여주겠습니다.
