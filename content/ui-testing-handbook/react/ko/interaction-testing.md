---
title: '컴포넌트 상호작용 테스트하기'
tocTitle: '상호작용'
description: '사용자의 동작을 시뮬레이션하고 기능별 검사를 실행하는 방법 알아보기'
commit: 'fa3353e'
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

## 스토리북에서 컴포넌트 테스트는 어떻게 이뤄지나요?

상호 작용 테스트는 널리퍼진 패턴으로 사용자 행동을 확인하기 위한 테스트입니다. 모의 데이터를 제공하여 테스트 시나리오를 설정하고 [Testing Library](https://testing-library.com/)를 사용하여 사용자 상호 작용을 시뮬레이션하고 결과 DOM 구조를 확인합니다.

![](/ui-testing-handbook/1_AyDgC9kxOjUl8Yihq0ltTQ.gif)

스토리북에서, 이 친숙한 작업 흐름(workflow)는 브라우저 상에서 발생합니다. 이 방식은 컴포넌트를 개발할 때와 동일한 브라우저 환경에서 테스트를 실행하기 때문에 오류를 더 쉽게 디버깅할 수 있습니다.

컴포넌트의 초기 상태를 설정하는 **스토리**를 작성하는 것으로 시작하겠습니다. 그 후 **재생 기능**을 사용해 클릭 및 양식 항목과 같은 사용자 행동을 시큘레이션합니다. 마지막으로 **테스트 러너(runner)**를 사용해 UI 및 컴포넌트 상태가 올바르게 업데이트 되었는지 확인합니다.

## 테스트 러너 설정

먼저 테스트 러너와 관련 패키지를 설치해야 합니다.

```shell
yarn add -D @storybook/testing-library @storybook/jest @storybook/addon-interactions @storybook/test-runner
```

스토리북 설정을 업데이트해서 상호 작용 애드온을 포함시키고 디버깅을 위한 재생 컨트롤을 활성화하세요.

```diff:title=.storybook/main.js
const path = require('path');

const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-interactions',
  ],
  core: {
    builder: {
      name: 'webpack5',
    },
  },
+ features: {
+   interactionsDebugger: true,
+ },
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
    };
  },
};
```

그리고 프로젝트의 `package.json`에 테스트 태스크를 추가하세요. -

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

마지막으로 스토리북을 시작합니다.(테스트 러너는 로컬 스토리북 인스턴스에 대해 실행됩니다.) -

```shell
yarn storybook
```

## 스토리(story)를 상호작용 테스트 케이스로 재사용해 보세요

앞 장에서는 `InboxScreen.stories.js` 파일에 `InboxScreen` 컴포넌트의 모든 사용예를 카탈로그로 작성했습니다. 이를 통해 개발 중 모습을 확인하고 비주얼 테스트를 통해 회귀를 포착할 수 있었습니다. 이 스토리(story)는 이제 우리의 상호 작용 테스트에도 힘을 실어줄 것입니다.

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

### 재생 기능을 사용한 상호작용 테스트를 작성해 보세요

[테스팅 라이브러리](https://testing-library.com/) 는 클릭, 드래그, 탭, 타이핑 등 사용자 상호 작용을 시뮬레이션하기 위한 편리한 API를 제공합니다. 반면에 [Jest](https://jestjs.io/)는 선언 유틸리티를 제공합니다. 테스트를 작성하기 위해 이 두 도구의 스토리북의 계측된 버전을 사용할 것입니다. 따라서 DOM과 상호 작용할 수 있는 친숙한 개발자 친화적인 구문을 얻을 수 있지만 디버깅에 도움이 되는 추가 원격 측정 기능을 사용할 수 있습니다.

테스트 자체는 [재생 기능](https://storybook.js.org/docs/react/writing-stories/play-function)에 저장됩니다. 이 코드 조각은 스토리에 첨부되고 스토리가 렌더링된 후에 실행됩니다.

사용자가 작업을 고정할 수 있는지 확인하기 위해 첫 번째 상호 작용 테스트를 추가하겠습니다. -

```javascript:title=src/InboxScreen.stories.js
import React from 'react';
import { rest } from 'msw';
import { InboxScreen } from './InboxScreen';
import { Default as TaskListDefault } from './components/TaskList.stories';

import { within, userEvent, findByRole } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// ... code omitted for brevity ...

export const PinTask = Template.bind({});
PinTask.parameters = Default.parameters;
PinTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  // Find the task to pin
  const itemToPin = await getTask('Export logo');

  // Find the pin button
  const pinButton = await findByRole(itemToPin, 'button', { name: 'pin' });

  // Click the pin button
  await userEvent.click(pinButton);

  // Check that the pin button is now a unpin button
  const unpinButton = within(itemToPin).getByRole('button', { name: 'unpin' });
  await expect(unpinButton).toBeInTheDocument();
};
```

각 재생 기능은 스토리의 최상위 컨테이너인 캔버스 요소를 받습니다. 이 요소 내에서만 쿼리의 범위를 지정하여 DOM 노드를 더 쉽게 찾을 수 있습니다.

우리의 경우 "로고 내보내기" 작업을 찾고 있습니다. 그런 다음 핀 버튼을 찾아 클릭합니다. 마지막으로 버튼이 고정되지 않은 상태로 업데이트되었는지 확인합니다.

스토리북이 스토리 렌더링을 마치면 플레이 기능 내에서 정의된 단계를 실행하여 구성 요소와 상호 작용하고 작업을 고정합니다 - 사용자가 사용하는 방식과 유사한 방식으로. [상호 작용 패널](https://storybook.js.org/docs/react/writing-tests/interaction-testing#interactive-debugger), 을 선택하면 단계별 흐름이 표시됩니다. 또한 각 상호 작용을 일시 중지, 재개, 되감기 및 단계별로 수행할 수 있는 편리한 UI 컨트롤 세트를 제공합니다.

![](/ui-testing-handbook/pin-task.gif)

### 테스트 러너로 테스트를 실행해 보세요.

이제 첫 번째 테스트를 마쳤으니 이제 아카이브에 대한 테스트를 추가하고 작업 기능을 편집해 보겠습니다.

```javascript:title=src/InboxScreen.stories.js
// ... code omitted for brevity ...

export const ArchiveTask = Template.bind({});
ArchiveTask.parameters = Default.parameters;
ArchiveTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  const itemToArchive = await getTask('QA dropdown');
  const archiveCheckbox = await findByRole(itemToArchive, 'checkbox');
  await userEvent.click(archiveCheckbox);

  await expect(archiveCheckbox.checked).toBe(true);
};

export const EditTask = Template.bind({});
EditTask.parameters = Default.parameters;
EditTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  const itemToEdit = await getTask('Fix bug in input error state');
  const taskInput = await findByRole(itemToEdit, 'textbox');

  userEvent.type(taskInput, ' and disabled state');
  await expect(taskInput.value).toBe('Fix bug in input error state and disabled state');
};
```

이제 이러한 시나리오에 대한 스토리를 볼 수 있습니다. 스토리북은 스토리를 볼 때만 상호 작용 테스트를 실행합니다. 따라서, 모든 검사를 실행하려면 각 스토리를 살펴봐야 합니다.

변경할 때마다 전체 스토리북을 수동으로 검토하는 것은 비현실적입니다. 스토리북 테스트 러너는 해당 프로세스를 자동화합니다. [Playwright](https://playwright.dev/)에 의해 제공되는 독립 실행형 유틸리티로 모든 상호 작용 테스트를 실행하고 깨진 스토리를 집어냅니다.

![](/ui-testing-handbook/more-tests.png)

테스트 러너를 시작하세요. (별도의 터미널 창에서):

```shell
yarn test-storybook --watch
```

![](/ui-testing-handbook/test-runner.png)

모든 스토리가 오류 없이 전달되는지, 그리고 모든 선언이 통과되는지 확인할 것입니다. 테스트가 실패하면 브라우저에서 실패한 스토리를 여는 링크가 나타납니다.

![](/ui-testing-handbook/click-to-debug.gif)

요약하면 설정 코드와 테스트는 모두 스토리 파일에 있습니다. 재생 기능을 사용하여 우리는 사용자가 하는 방식으로 UI와 상호 작용했습니다. 스토리북 상호 작용 테스트는 라이브 브라우저의 직관적인 디버깅 환경과 헤드리스 브라우저의 성능과 스크립트 가능성을 결합합니다.

## 사용성 문제 파악하기

모든 사용자가 우리의 UI를 사용할 수 있게 되면, 비즈니스 재무에 영향을 미치고 [법적 요구사항](https://www.w3.org/WAI/policies/?q=government)을 충족시키게 됩니다. 이것은 윈-윈 관계라고 할 수 있습니다. 다음 장에서는 스토리의 이동성을 활용해 접근성 테스트를 간소화하는 방법을 소개하겠습니다.
