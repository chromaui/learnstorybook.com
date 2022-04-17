---
title: 'Storybook을 통한 접근성 테스트'
tocTitle: '접근성'
description: '통합적인 툴 사용(integrated tooling)으로 빠른 피드백 제공'
commit: ''
---

미국에 있는 [성인의 26%](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html)는 적어도 하나의 장애를 가지고 있습니다. 접근성을 개선하면, 현재 그리고 미래의 고객들에게 아주 커다란 영향을 미칩니다. 또한 접근성은 법적 요구 사항이기도 합니다.

접근성을 확인하는 가장 정확한 방법은 실제 장치에서 수동으로 확인하는 것입니다. 하지만 그러기 위해서는 전문 지식과 많은 시간이 필요한데, 두 가지 모두 프론트엔드 팀에게는 아주 드물게 존재합니다.

그것이 바로 현재 많은 회사들이 자동과 수동 테스팅을 함께 사용하는 이유입니다. 자동화는 개발자들이 크게 공들이지 않아도 일반적인 접근성 문제를 파악합니다. 수동 QA는 사람의 주의가 필요한 까다로운 문제들을 다룰 때에 사용합니다.

접근성 원칙에 깊게 파고드는 많은 자료들이 있으므로 여기서는 깊게 다루지 않을 것입니다. 대신에, Storybook을 통해 접근성 테스트를 자동화하는 방법을 중점적으로 살펴보겠습니다. 이것은 직면하기 쉬운 대부분의 문제들을 찾고 고치는 실용적인 접근법입니다.

## 왜 자동화일까요?

시작하기 전에, 일반적인 장애의 유형을 살펴봅시다. - 시각, 청각, 이동성, 인지, 발화 그리고 신경학적인 장애들. 이러한 사용자 장애들로 인해 다음과 같은 앱 요구사항들이 발생합니다 -

- ⌨ 키보드 네비게이션
- 🗣 스크린 리더기 지원
- 👆 터치 친화성
- 🎨 충분한 색상 대비
- ⚡️ 모션 감소
- 🔍 확대

과거에는 브라우저, 장치 및 스크린 리더기의 조합에서 모든 컴포넌트를 검사하여 이러한 각 요구사항을 확인했습니다. 그러나 앱은 수십개의 컴포넌트를 갖고 있고 UI를 지속적으로 업데이트하고 있기 때문에 수작업으로 검사하는 것은 현실적으로 불가능합니다.

## 작업 흐름(workflow)의 속도를 높여주는 자동화

자동화된 도구는 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 규칙 및 업계에서 입증된 기타 모범 사례를 기반으로 일련의 휴리스틱와 비교하여 렌더링된 DOM을 감사합니다. 이들은 노골적인 접근성 위반을 적발하는 QA의 첫번째 라인 역할을 수행합니다. 

예를 들어, Axe는 평균적으로 [WCAG 이슈의 57%를 자동적으로](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)찾아냅니다. 이를 통해 팀은 수동 검토가 필요한 더 복잡한 이슈에 전문가 자원을 집중할 수 있습니다.

대부분의 기존 테스트 환경과 통합되므로 [Axe library](https://github.com/dequelabs/axe-core)를 사용하는 팀이 많습니다. 예를 들어, [Twilio Paste](https://github.com/twilio-labs/paste) 팀은 [jest-axe integration](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40)를 사용합니다. 반면 Shopify Polaris와 Adobe Spectrum 팀들은 [Storybook addon](https://storybook.js.org/addons/@storybook/addon-a11y) 버전을 사용합니다. 

Storybook 애드온은 (jsdom을 위한 Jest와는 반대로) 브라우저에서 검사를 실행하므로 낮은 대비와 같은 문제들을 발견할 수 있습니다. 하지만 각 story를 수동으로 확인해야 합니다.

## 접근성 테스팅 작업 흐름

개발 프로세스 전반에 걸쳐 이러한 검사를 실행하면 피드백 루프를 단축하고 문제를 더 빠르게 해결할 수 있습니다. 작업 흐름의 모양은 다음과 같습니다.

1.  👨🏽‍💻 **개발 중:** Storybook을 사용하여 한 번에 하나의 컴포넌트에 집중할 수 있습니다. A11y addon을 사용해 시각적 결함을 시뮬레이션하고 컴포넌트 레벨에서 접근성 검사를 실행합니다.
2.  ✅ **QA의 경우:** Axe 검사를 기능 테스트 파이프라인에 통합합니다. 모든 컴포넌트를 검사해 회귀를 탐지합니다. 

![](/ui-testing-handbook/a11y-workflow.png)

실제 상황을 예시로 이 작업 흐름을 살펴보겠습니다.

### 접근성 애드온을 설치해보세요

Storybook의 접근성은 활성 story에 Axe를 실행합니다. 테스트 결과를 패널에 시각화하고 규칙을 위반한 모든 DOM 노드를 추려서 나타냅니다. 

![](/ui-testing-handbook/a11y-testing.gif)

애드온을 설치하기 위해, `yarn add -D @storybook/addon-a11y`을 실행해보세요. 그 후 `'@storybook/addon-a11y'`를 `.storybook/main.js` 안에 있는 addon 배열에 추가해보세요. -

```diff:title=.storybook/main.js
module.exports = {
 stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
 addons: [
   '@storybook/addon-links',
   '@storybook/addon-essentials',
   '@storybook/preset-create-react-app',
+  '@storybook/addon-a11y',
 ],
};
```
### 작성한대로 접근성 테스트하기

우리는 이미 작업 컴포넌트를 [분리](../visual-testing/)했고 해당 사용례를 모두 story로 캡쳐했습니다. 개발 단계에서 이러한 사례를 순환하여 접근성 문제를 발견할 수 있습니다.

```javascript:title=src/components/Task.stories.js
import React from 'react';
import { Task } from './Task';

export default {
  component: Task,
  title: 'Task',
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
  },
};

const Template = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Buy milk',
    state: 'TASK_INBOX',
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    id: '2',
    title: 'QA dropdown',
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    id: '3',
    title: 'Write schema for account menu',
    state: 'TASK_ARCHIVED',
  },
};

const longTitleString = `이 일정의 이름은 어마어마하게 길어요. 지금처럼 계속 길어지다가는 내용이 넘칠 수도 있을 것 같습니다. 이렇게 되면 무슨 일이 일어날까요? 고정된 일정을 나타내는 별 모양 아이콘에 텍스트가 겹칠 수도 있습니다. 아니면 아이콘에 도달했을 때 텍스트가 갑자기 잘릴 수도 있겠죠. 부디 그렇지 않기를 바랍니다!`

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    id: '4',
    title: longTitleString,
    state: 'TASK_INBOX',
  },
};
```

![](/ui-testing-handbook/a11y-addon.png)

애드온이 어떻게 두 개의 위반을 발견했는지 보세요. 첫 번째, **"전경색과 배경색의 대비가 WCAG 2 AA 대비율 임계값을 충족하는지 확인하기"**는 `archived` state에 한정됩니다. 본질적으로 그것은 글과 배경의 대비가 충분하지 않음을 의미합니다. 텍스트 색상을 `gray.400`에서 `gray.600`으로 약간 더 어두운 회색으로 변경함으로써 이 문제를 해결할 수 있습니다.

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';
import {
 Checkbox,
 Flex,
 IconButton,
 Input,
 Box,
 VisuallyHidden,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export const Task = ({
 task: { id, title, state },
 onArchiveTask,
 onTogglePinTask,
 onEditTitle,
 ...props
}) => (

 // 간결성을 위해 생략된 코드

   <Box width="full" as="label">
     <VisuallyHidden>Edit</VisuallyHidden>
     <Input
       variant="unstyled"
       flex="1 1 auto"
-      color={state === 'TASK_ARCHIVED' ? 'gray.400' : 'gray.700'}
+      color={state === 'TASK_ARCHIVED' ? 'gray.600' : 'gray.700'}
       textDecoration={state === 'TASK_ARCHIVED' ? 'line-through' : 'none'}
       fontSize="sm"
       isTruncated
       value={title}
       onChange={(e) => onEditTitle(e.target.value, id)}
     />
   </Box>

   // 간결성을 위해 생략된 코드
 </Flex>
);

Task.propTypes = {
 task: PropTypes.shape({
   id: PropTypes.string.isRequired,
   title: PropTypes.string.isRequired,
   state: PropTypes.string.isRequired,
 }),
 onArchiveTask: PropTypes.func.isRequired,
 onTogglePinTask: PropTypes.func.isRequired,
 onEditTitle: PropTypes.func.isRequired,
};
```
두 번째 위반인 **“`<li>` 요소가 의미있게 사용되도록 하기”**는 DOM 구조가 잘못되었음을 나타냅니다. 작업 컴포넌트는 `<li>` 요소를 렌더링합니다. 하지만 story안에서 `<li>` 요소가 자신을 sementic하게 만들어주는  `<ul>` 로 감싸지지 않았습니다. 이 story들은 작업 컴포넌트를 위한 것입니다. `<ul>`은 사실 TaskList에 의해 제공됩니다. 따라서 DOM 구조는 TaskList story들 안에서 유효합니다. 그러므로 이 오류는 무시해도 무방합니다. 말하자면, 우리는 모든 Task story에 대한 이러한 규칙을 비활성화할 수 있습니다.

```diff:title=src/components/Task.stories.js
import React from 'react';
import { Task } from './Task';

export default {
  component: Task,
  title: 'Task',
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
  },
+  parameters: {
+    a11y: {
+      config: {
+        rules: [{ id: 'listitem', enabled: false }],
+      },
+    },
+  },
};

// 간결성을 위해 나머지 코드는 생략함
```

이제 다른 모든 컴포넌트에도 이 프로세스를 반복할 수 있습니다.

접근성 테스트를 Storybook에 통합하면 개발 작업 흐름을 간소화할 수 있습니다. 컴포넌트에서 작업할 때 다른 툴들 사이를 이동할 필요가 없습니다. 필요한 건 바로 여기 브라우저에 있습니다. 중염색체(제2색약),원형종(제1색약) 또는 청황 색맹 같은 시각적 장애도 시뮬레이션이 가능합니다.

![](/ui-testing-handbook/vision-simulator.png)

### 회귀 방지

컴포넌트는 상호의존적이며 - 한 컴포넌트의 변화가 우연히 다른 컴포넌트를 파괴할 수 있습니다. 접근성 위반이 발생하지 않도록 하려면, 변경사항을 병합하기 전에 모든 컴포넌트에 Axe를 실행해야 합니다.

Story는 ES6 모듈을 기반으로 작성되므로 다른 테스트 프레임워크와 함께 재사용할 수 있습니다. 마지막 장에서는, [stories into Jest](../interaction-testing/)가져오기 및 테스팅 라이브러리와의 상호작용에 대해 살펴보았습니다. 마찬가지로 [Jest Axe integration](https://github.com/nickcolley/jest-axe)를 사용해 컴포넌트에 대한 접근성 테스트를 실행할 수 있습니다.

먼저 설치부터 해봅시다 - 

```sh
yarn add -D jest-axe
```
다음으로, Axe를 실행하고 위반 여부를 확인하는 `it` 블록을 추가합니다. Jest-axe는 `toHaveNoViolations` 라는 편리한 assertion을 제시하여 하나의 함수 호출로 위반 여부를 확인할 수 있습니다. 

```diff:title=src/InboxScreen.test.js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render,
  waitFor,
  cleanup,
  within,
  fireEvent,
} from '@testing-library/react';
+ import { axe, toHaveNoViolations } from 'jest-axe';
import { composeStories } from '@storybook/testing-react';
import { getWorker } from 'msw-storybook-addon';
import * as stories from './InboxScreen.stories';

+ expect.extend(toHaveNoViolations);

describe('InboxScreen', () => {
  afterEach(() => {
    cleanup();
  });

  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests
  afterAll(() => getWorker().close());

  const { Default } = composeStories(stories);

  // axe를 실행하세요.
+  it('Should have no accessibility violations', async () => {
+    const { container, queryByText } = render(<Default />);
+
+    await waitFor(() => {
+      expect(queryByText('You have no tasks')).not.toBeInTheDocument();
+    });
+
+    const results = await axe(container);
+    expect(results).toHaveNoViolations();
+  });

  it('should pin a task', async () => { ... });
  it('should archive a task', async () => { ... });
  it('should edit a task', async () => { ... });
});
```
`yarn test`를 실행하여 Jest를 시작합니다. 모든 상호작용 테스트를 실행하고 접근성 검사도 실행합니다. 이제 코드를 수정할 때마다 이 전체 테스트 세트를 실행하고 회귀도 탐색할 수 있습니다.

![](/ui-testing-handbook/jest-axe.png)

## 통합 문제 파악

UI는 컴포넌트를 구성하고 데이터 및 API에 연결함으로써 조립됩니다. 그 과정에는 실패할 수 있는 지점들이 많이 있습니다. 다음에는 Cypress를 사용해 시스템의 모든 계층을 한 번에 테스트하여 통합 문제를 파악하는 방법에 대해 알아보겠습니다. 
