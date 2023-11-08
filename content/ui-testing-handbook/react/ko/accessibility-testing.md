---
title: '스토리북(Storybook)을 통한 접근성 테스트'
tocTitle: '접근성'
description: '통합적인 툴 사용(integrated tooling)으로 빠른 피드백 제공'
commit: 'ef3fa29'
---

미국에 있는 [성인의 26%](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html)는 적어도 하나의 장애를 가지고 있습니다. 접근성을 개선하면, 현재 그리고 미래의 고객들에게 아주 커다란 영향을 미칩니다. 또한 접근성은 법적 요구 사항이기도 합니다.

접근성을 확인하는 가장 정확한 방법은 실제 장치에서 수동으로 확인하는 것입니다. 하지만 그러기 위해서는 전문 지식과 많은 시간이 필요한데, 두 가지 모두 프런트엔드 팀에게는 아주 드물게 존재합니다.

그것이 바로 현재 많은 회사들이 자동과 수동 테스팅을 함께 사용하는 이유입니다. 자동화는 개발자들이 크게 공들이지 않아도 일반적인 접근성 문제를 파악합니다. 수동 QA는 사람의 주의가 필요한 까다로운 문제들을 다룰 때에 사용합니다.

접근성 원칙에 깊게 파고드는 많은 자료들이 있으므로 여기서는 깊게 다루지 않을 것입니다. 대신에, 스토리북(Storybook)을 통해 접근성 테스트를 자동화하는 방법을 중점적으로 살펴보겠습니다. 이것은 직면하기 쉬운 대부분의 문제들을 찾고 고치는 실용적인 접근법입니다.

## 왜 자동화일까요?

시작하기 전에, 일반적인 장애의 유형을 살펴봅시다. - 시각, 청각, 이동성, 인지, 발화 그리고 신경학적인 장애들. 이러한 사용자 장애들로 인해 다음과 같은 앱 요구사항들이 발생합니다 -

- ⌨ 키보드 네비게이션
- 🗣 스크린 리더기 지원
- 👆 터치 친화성
- 🎨 충분히 높은 색 대비
- ⚡️ 모션 감소
- 🔍 확대

과거에는 브라우저, 장치 및 스크린 리더기의 조합에서 모든 컴포넌트를 검사하여 이러한 각 요구사항을 확인했습니다. 그러나 앱은 수십개의 컴포넌트를 갖고 있고 UI를 지속적으로 업데이트하고 있기 때문에 수작업으로 검사하는 것은 현실적으로 불가능합니다.

## 작업 흐름(workflow)의 속도를 높여주는 자동화

자동화된 도구는 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 규칙 및 업계에서 입증된 기타 모범 사례를 기반으로 일련의 휴리스틱와 비교하여 렌더링된 DOM을 감사합니다. 이들은 노골적인 접근성 위반을 적발하는 QA의 첫번째 라인 역할을 수행합니다.

예를 들어, Axe는 평균적으로 [WCAG 이슈의 57%를 자동적으로](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)찾아냅니다. 이를 통해 팀은 수동 검토가 필요한 더 복잡한 이슈에 전문가 자원을 집중할 수 있습니다.

대부분의 기존 테스트 환경과 통합되므로 [Axe library](https://github.com/dequelabs/axe-core)를 사용하는 팀이 많습니다. 예를 들어, [Twilio Paste](https://github.com/twilio-labs/paste) 팀은 [jest-axe integration](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40)를 사용합니다. 반면 Shopify Polaris와 Adobe Spectrum 팀들은 [스토리북 애드온(Storybook addon)](https://storybook.js.org/addons/@storybook/addon-a11y) 버전을 사용합니다.

스토리북 애드온은 (jsdom을 위한 Jest와는 반대로) 브라우저에서 검사를 실행하므로 낮은 대비와 같은 문제들을 발견할 수 있습니다. 하지만 각 스토리(story)를 수동으로 확인해야 합니다.

## 접근성 테스팅 작업 흐름

개발 프로세스 전반에 걸쳐 이러한 검사를 실행하면 피드백 루프를 단축하고 문제를 더 빠르게 해결할 수 있습니다. 작업 흐름의 모양은 다음과 같습니다.

1.  👨🏽‍💻 **개발 중:** 스토리북을 사용하여 한 번에 하나의 컴포넌트에 집중할 수 있습니다. A11y 애드온을 사용해 시각적 결함을 시뮬레이션하고 컴포넌트 레벨에서 접근성 검사를 실행합니다.
2.  ✅ **QA의 경우:** Axe 검사를 기능 테스트 파이프라인에 통합합니다. 모든 컴포넌트를 검사해 회귀를 탐지합니다.

![](/ui-testing-handbook/a11y-workflow.png)

실제 상황을 예시로 이 작업 흐름을 살펴보겠습니다.

### 접근성 애드온을 설치해보세요

스토리북의 접근성은 활성 스토리에 Axe를 실행합니다. 테스트 결과를 패널에 시각화하고 규칙을 위반한 모든 DOM 노드를 추려서 나타냅니다.

![](/ui-testing-handbook/a11y-testing.gif)

애드온을 설치하기 위해, `yarn add -D @storybook/addon-a11y`을 실행해보세요. 그 후 `'@storybook/addon-a11y'`를 `.storybook/main.js` 안에 있는 애드온 배열에 추가해보세요. -

```diff:title=.storybook/main.js
module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  core: {
    builder: {
      name: 'webpack5',
    },
  },
  features:{
    interactionsDebugger: true,
  },
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

### 작성한대로 접근성 테스트하기

우리는 이미 작업 컴포넌트를 [분리](/ui-testing-handbook/react/ko/visual-testing/)했고 해당 사용례를 모두 스토리로 캡쳐했습니다. 개발 단계에서 이러한 사례를 순환하여 접근성 문제를 발견할 수 있습니다.

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

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

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

애드온이 어떻게 두 개의 위반사항을 발견했는지 보세요. 첫 번째, **“전경색과 배경색의 대비가 WCAG 2 AA 대비율 임계값을 충족하는지 확인하기”** 는 `archived` 상태에 한정됩니다. 본질적으로 그것은 글과 배경의 대비가 충분하지 않음을 의미합니다. 텍스트 색상을 `gray.400`에서 `gray.600`처럼 약간 더 어두운 회색으로 변경함으로써 이 문제를 해결할 수 있습니다.

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

 // code omitted for brevity

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

   // code omitted for brevity
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

두 번째 위반사항인 **“`<li>` 요소가 의미있게 사용되도록 하기”** 는 DOM 구조가 잘못되었음을 나타냅니다. Task 컴포넌트는 `<li>` 요소를 렌더링합니다. 따라서 우리는 이 스토리 안의 템플릿을 `<ul>` 엘레멘트가 감싸는 형태로 갱신해야 합니다.

```js:title=src/components/Task.stories.js
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

const Template = (args) => (
  <ul>
    <Task {...args} />
  </ul>
);

// ... code omitted for brevity
```

이제 다른 모든 컴포넌트에도 이 프로세스를 반복할 수 있습니다.

접근성 테스트를 스토리북에 통합하면 개발 작업 흐름을 간소화할 수 있습니다. 컴포넌트에서 작업할 때 다른 툴들 사이를 이동할 필요가 없습니다. 필요한 건 바로 여기 브라우저에 있습니다. 중염색체(제2색약),원형종(제1색약) 또는 청황 색맹 같은 시각적 장애도 시뮬레이션이 가능합니다.

![](/ui-testing-handbook/vision-simulator.png)

### 테스트 러너를 이용하여 자동으로 회귀 잡기

때로는 한 컴포넌트의 변화가 우연히 다른 컴포넌트를 파괴할 수 있습니다. 이러한 회귀를 잡기 위해서는, 풀 리퀘스트를 열기 전에 모든 모든 스토리를 테스트하길 원할 것입니다. 그러나 접근성 애드온은 스토리를 볼 때에만 검사를 수행합니다. 테스트 러너를 이용하여 모든 스토리를 한번에 테스트 할 수 있습니다. 이는 독자적인 유틸리티이며([Jest](https://jestjs.io/)와 [Playwright](https://playwright.dev/)에 기반함) 스토리들의 렌더링 에러를 검사합니다.

Axe를 실행하기 위해 테스트 러너를 설정해 봅시다. 우선 [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright)를 설치할 것입니다.

```shell
yarn add -D axe-playwright
```

다음으로, Axe를 실행하고 위반 여부를 확인하는 `it` 블록을 추가합니다. Jest-axe는 `toHaveNoViolations` 라는 편리한 assertion을 제시하여 하나의 함수 호출로 위반 여부를 확인할 수 있습니다.

```javascript:title=.storybook/test-runner.js
const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
 async preRender(page, context) {
   await injectAxe(page);
 },
 async postRender(page, context) {
   await checkA11y(page, '#root', {
     detailedReport: true,
     detailedReportOptions: {
       html: true,
     },
   })
 },
};
```

`preRender` 와 `postRender`는 태스크 러너에게 추가적인 작업을 수행시키기 위한 설정을 가능하게 하는 편리한 훅들입니다. 우리는 이러한 훅을 이용하여 스토리에 Axe를 주입하고, 그리고 렌더링이 된다면 접근성 테스트를 수행합니다.

`checkA11y` 함수에 전달된 몇 옵션들을 주목하세요. 스토리의 루트 엘레멘트에 Axe를 설정하고, DOM 트리를 순회하면서 문제가 있는지 검사할 것입니다. 이것들은 발견한 이슈들에 대해서 자세한 레포트를 만들고, 접근성 규칙을 위반한 HTML 엘레먼트의 목록을 출력할 것입니다.

이 테스트를 수행하기 위해, 하나의 터미널 창에서 `yarn storybook`을 통해 Storybook을 시작하고, 다른 터미널 창에서 `yarn test-storybook`을 통해 테스트 러너러를 수행하세요.

![](/ui-testing-handbook/test-runner-ally.png)

## 통합 문제 파악

UI는 컴포넌트를 구성하고 데이터 및 API에 연결함으로써 조립됩니다. 그 과정에는 실패할 수 있는 지점들이 많이 있습니다. 다음에는 Cypress를 사용해 시스템의 모든 계층을 한 번에 테스트하여 통합 문제를 파악하는 방법에 대해 알아보겠습니다.
