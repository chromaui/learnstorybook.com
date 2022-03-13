---
# title: 'Accessibility testing with Storybook'
title: 'Storybook을 통한 접근성 테스트'
# tocTitle: 'Accessibility'
tocTitle: '접근성'
# description: 'Fast feedback with integrated tooling'
description: '통합적인 툴 사용(integrated tooling)으로 빠른 피드백 제공'
commit: '1681de1'
---

미국에 있는 [성인의 26%](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html)는 적어도 하나의 장애를 가지고 있습니다. 접근성을 개선하면, 현재 그리고 미래의 고객들에게 아주 커다란 영향을 미칩니다. 또한 접근성은 법적 요구 사항이기도 합니다.

<!-- [26% of adults](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html) in the US have at least one disability. When you improve accessibility, it has an outsized impact on your current and future customers. It’s also a legal requirement. -->

접근성을 확인하는 가장 정확한 방법은 실제 장치에서 수동으로 확인하는 것입니다. 하지만 그러기 위해서는 전문 지식과 많은 시간이 필요한데, 두 가지 모두 프론트엔드 팀에게는 아주 드물게 존재합니다.

<!-- The most accurate way to check accessibility is manually on real devices. But that requires specialized expertise and a lot of time, both of which are scarce on frontend teams. -->

그것이 바로 현재 많은 회사들이 자동과 수동 테스팅을 함께 사용하는 이유입니다. 자동화는 개발자들이 크게 공들이지 않아도 일반적인 접근성 문제를 파악합니다.
수동 QA는 사람의 주의가 필요한 까다로운 문제들을 다루기 위해 준비되어 있습니다.

<!-- That's why many companies now use a combination of automated and manual testing. Automation catches common accessibility issues with low effort from developers. Manual QA is reserved for trickier problems that require human attention. -->

접근성 원칙에 깊게 파고드는 많은 리소스들이 있으므로 여기서는 깊게 다루지 않을 것입니다. 대신에, Storybook을 통해 접근성 테스트를 자동화하는 방법을 중점적으로 살펴보겠습니다. 이것은 여러분이 직면하기 쉬운 대부분의 문제들을 찾고 고치는 실용적인 접근법입니다.

<!-- There are plenty of resources that dive deep into accessibility principles, so we won't get into that here. Instead, we'll focus on how to automate accessibility testing with Storybook. It's a pragmatic approach to finding and fixing most issues you're likely to encounter. -->

## 왜 자동화일까요?
<!-- ## Why automation? -->

시작하기 전에, 일반적인 장애의 유형을 살펴봅시다. - 시각, 청각, 이동성, 인지, 언어 그리고 신경학적인 장애들.
이러한 사용자 장애들로 인해 다음과 같은 앱 요구사항들이 발생합니다 -

<!-- Before we begin, let’s examine common types of disabilities: visual, hearing, mobility, cognition, speech, and neurological. These user disabilities yield app requirements like: -->

- ⌨ 키보드 네비게이션
- 🗣 화면 리더기 지원
- 👆 쉬운 터치
- 🎨 충분한 색상 대비
- ⚡️ 모션 감소
- 🔍 확대

<!-- - ⌨ Keyboard navigation
- 🗣 Screen reader support
- 👆 Touch-friendly
- 🎨 High enough colour contrast
- ⚡️ Reduced motion
- 🔍 Zoom -->

과거에는 브라우저,장치 및 화면 리더기의 조합에서 모든 컴포넌트를 검사하여 이러한 각 요구사항을 확인했습니다. 그러나 앱은 수십개의 컴포넌트들을 갖고 있고 UI를 지속적으로 업데이트하고 있기 때문에 수작업으로 검사하는 것은 비현실 적입니다.

<!-- In the past, you’d verify each of these requirements by checking every component across a combination of browsers, devices, and screen readers. But that’s impractical to do by hand because apps have dozens of components and are constantly updating the UI. -->

## 자동화가 작업 흐름(작업 흐름)의 속도를 높여줄 것입니다.
<!-- ## Automation speeds up your 작업 흐름 -->

자동화된 도구는 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 규칙 및 기타 업계에서 입증된 모범 사례를 기반으로 일련의 휴리스틱와 비교하여 렌더링된 DOM을 감사합니다. 이들은 노골적인 접근성 위반을 적발하는 QA의 첫번째 라인 역할을 수행합니다. 

<!-- Automated tools audit the rendered DOM against a set of heuristics based on [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) rules and other industry-accepted best practices. They act as the first line of QA to catch blatant accessibility violations. -->

예를 들어, Axe는 평균적으로 [WCAG 이슈의 57%를 자동적으로](https://www.deque.com/blog/ automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)찾아냅니다. 이를 통해 팀은 수동 검토가 필요한 더 복잡한 이슈에 전문가 자원을 집중할 수 있습니다.

<!-- For example, Axe, on average, finds [57% of WCAG issues automatically](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/). That allows teams to focus their expert resources on the more complex issues that require manual review. -->

대부분의 기존 테스트 환경과 통합되므로 [Axe library](https://github.com/dequelabs/axe-core)를 사용하는 팀이 많습니다. 예를 들어, [Twilio Paste](https://github.com/twilio-labs/paste) 팀은 [jest-axe integration](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40)를 사용합니다. 반면 Shopify Polaris & Adobe Spectrum 팀들은 [Storybook addon](https://storybook.js.org/addons/@storybook/addon-a11y) 버전을 사용합니다. 

<!-- Many teams use the [Axe library](https://github.com/dequelabs/axe-core) because it integrates with most existing test environments. For example, the [Twilio Paste](https://github.com/twilio-labs/paste) team uses the [jest-axe integration](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40). Whereas the Shopify Polaris & Adobe Spectrum teams use the [Storybook addon](https://storybook.js.org/addons/@storybook/addon-a11y) version. -->

Storybook 애드온은 (jsdom for Jest와는 반대로) 브라우저에서 검사를 실행하므로 낮은 대비와 같은 문제들을 발견할 수 있습니다. 하지만 각 story를 수동으로 확인해야 합니다.

<!-- The Storybook addon runs checks in the browser (as opposed to jsdom for Jest) and can therefore catch issues such as low contrast. However, it does require you to manually verify each story. -->

## 접근성 테스팅 작업 흐름
<!-- ## Accessibility testing 작업 흐름 -->

개발 프로세스 전반에 걸쳐 이러한 검사를 실행하면 피드백 루프를 단축하고 문제를 더 빠르게 해결할 수 있습니다. 작업 흐름의 모양은 다음과 같습니다.
<!-- By running these checks throughout the development process, you shorten the feedback loop and fix issues faster. Here’s what the 작업 흐름 looks like: -->

1.  👨🏽‍💻 **개발 중:** Storybook을 사용하여 한 번에 하나의 컴포넌트에 집중할 수 있습니다. A11y addon을 사용해 비전 결함을 시뮬레이션하고 컴포넌트 레벨에서 접근성 검사를 실행합니다.
2.  ✅ **QA의 경우:** Axe 검사를 기능 테스트 파이프라인에 통합합시다. 모든 컴포넌트를 검사해 회귀를 탐지합니다. 

<!-- 1.  👨🏽‍💻 **During development:** use Storybook to focus on one component at a time. Use the A11y addon to simulate vision defects and run an accessibility audit at the component level.
2.  ✅ **For QA:** integrate the Axe audit into your functional testing pipeline. Run checks on all components to catch regressions. -->

![](/ui-testing-handbook/a11y-작업 흐름.png)

이 작업 흐름을 살펴보겠습니다.
<!-- Let’s see this 작업 흐름 in action. -->

### 접근성 addon을 설치해보자
<!-- ### Install the accessibility addon -->

Storybook의 접근성은 활성 story에 Axe를 실행합니다. 테스트 결과를 패널에 시각화하고 규칙을 위반한 모든 DOM 노드를 추려서 나타냅니다. 
Storybook’s Accessibility runs Axe on the active story. It visualizes the test results in a panel and outlines all DOM nodes that have a violation.

![](/ui-testing-handbook/a11y-testing.gif)

addon을 설치하기 위해, `yarn add -D @storybook/addon-a11y`을 실행합시다. 그 후 `'@storybook/addon-a11y'`를 `.storybook/main.js`: 안에 있는 addon 배열에 추가합시다.

<!-- To install the addon, run: `yarn add -D @storybook/addon-a11y`. Then, add `'@storybook/addon-a11y'` to the addons array in your `.storybook/main.js`: -->

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
<!-- ### Testing accessibility as you code -->

우리는 이미 작업 컴포넌트를 [격리](../visual-testing/)했고 해당 사용 사례를 모두 story로 캡쳐했습니다. 개발 단계에서 이러한 사례를 순환하여 접근성 문제를 발견할 수 있습니다.

<!-- We've already [isolated](../visual-testing/) the Task component and captured all its use cases as stories. During the development phase, you can cycle through these stories to spot accessibility issues. -->

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

addon이 어떻게 두개의 위반을 발견했는지 봅시다. 첫 번째,**“전경색과 배경색의 대비가 WCAG 2 AA 대비율 임계값을 충족하는지 확인하기”**는 '보관' 상태에 한정됩니다. 본질적으로 그것은 글과 배경의 대비가 충분하지 않음을 의미합니다. 텍스트 색상을 'gray.400'에서 'gray.600'으로 약간 더 어두운 회색으로 변경함으로써 이 문제를 해결할 수 있습니다.

<!-- Notice how the addon found two violations. The first, **“Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds,”** is specific to the `archived` state. Essentially what it means is that there isn’t enough contrast between the text and the background. We can fix that by changing the text color to a slightly darker gray—from `gray.400` to `gray.600`. -->

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
두 번째 위반인 **“`<li>` 요소가 의미있게 사용되도록 하기”**는 DOM 구조가 잘못되었음을 나타냅니다. 작업 컴포넌트는 `<li>` 요소를 렌더링합니다. 하지만 story안에서 `<li>` 요소가 자신을 sementic하게 만들어주는  `<ul>` 로 감싸지지 않았습니다. 이 story들은 작업 컴포넌트를 위한 것입니다. `<ul>`은 사실 TaskList에 의해 제공됩니다. 따라서 DOM 구조는 TaskList story들 안에서 유효합니다. 그러므로 이 오류는 무시해도 무방합니다. 말하자면, 우리는 모든 Task story에 대한 이러한 규칙을 비활성화할 수 있습니다.

<!-- The second violation, **“Ensures `<li>` elements are used semantically,”** indicates that the DOM structure is incorrect. The Task component renders an `<li>` element. However, it's not wrapped with a `<ul>` in its stories. Which makes sense. These stories are for the Task component. The `<ul>` is actually provided by the TaskList. So the DOM structure gets validated in the TaskList stories. Therefore, it's safe to ignore this error. In fact, we can go ahead and disable this rule for all the Task stories. -->

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

// remaining code omitted for brevity
```

이제 다른 모든 컴포넌트에도 이 프로세스를 반복할 수 있습니다.
<!-- You can now repeat this process for all other components. -->

접근성 테스팅을 Storybook에 통합하면 개발 작업 흐름을 간소화할 수 있습니다. 컴포넌트에서 작업할 때 다른 툴들 사이를 이동할 필요가 없습니다. 필요한 건 바로 여기 브라우저에 있습니다. 중염색체(제2색약),원형종(제1색약) 또는 청황 색맹 같은 시각적 장애도 시뮬레이션이 가능합니다.
<!-- Integrating accessibility testing into Storybook streamlines your development 작업 흐름. You don’t have to jump between different tools while working on a component. Everything you need is right there in the browser. You can even simulate visual impairments such as deuteranomaly, protanomaly or tritanopia. -->

![](/ui-testing-handbook/vision-simulator.png)

### 회귀 방지
<!-- ### Preventing regressions -->

컴포넌트는 상호의존적이며 - 한 컴포넌트의 변화가 우연히 다른 컴포넌트를 파괴할 수 있습니다. 접근성 위반이 발생하지 않도록 하려면, 변경사항을 병합하기 전에 모든 컴포넌트에 Axe를 실행해야 합니다.

<!-- Components are interdependent – changes in one component could break others by accident. To ensure that accessibility violations aren’t introduced, we need to run Axe on all our components before merging changes. -->

Story는 ES6 모듈을 기반으로 작성되므로 다른 테스트 프레임워크와 함께 재사용할 수 있습니다. 마지막 장에서는, [stories into Jest](../interaction-testing/)가져오기 및 테스팅 라이브러리와의 인터랙션에 대해 살펴보았습니다. 마찬가지로 [Jest Axe integration](https://github.com/nickcolley/jest-axe)를 사용해 컴포넌트에 대한 접근성 테스트를 실행할 수 있습니다.

<!-- Stories are written in a format based on ES6 modules, allowing you to reuse them with other testing frameworks. In the last chapter, we looked at importing [stories into Jest](../interaction-testing/) and verifying interactions with Testing Library. Similarly, we can use the [Jest Axe integration](https://github.com/nickcolley/jest-axe) to run accessibility tests on the component. -->

먼저 설치부터 시작하겠습니다.
<!-- Let’s start by installing it: -->

```sh
yarn add -D jest-axe
```
다음으로, Axe를 실행하고 위반 여부를 확인하는 `it`블록을 추가합니다. Jest-axe는 `toHaveNoViolations`라는 편리한 주장을 제시하여 하나의 기능 호출로 위반 여부를 확인할 수 있습니다. 

<!-- Next, add in an `it` block that runs Axe and checks for violations. Jest-axe also gives you a handy assertion, `toHaveNoViolations`, to verify this with one function call. -->

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
`yarn test`를 실행하여 Jest를 시작합니다. 모든 인터랙션 테스트를 실행하고 접근성 검사도 실행합니다. 이제 코드를 수정할 때마다 이 전체 테스트 세트를 실행할 수 있습니다. 회귀도 탐색해주면서요.

<!-- Run `yarn test` to start up Jest. It'll execute all the interaction tests and run the accessibility audit too. You can now run this entire test suite any time you modify the code. Allowing you to catch regressions. -->

![](/ui-testing-handbook/jest-axe.png)

## 통합 문제 파악
<!-- ## Catching integration issues -->

UI는 컴포넌트를 구성하고 데이터 및 API에 연결함으로써 조립됩니다. 그 과정에는 잠재적인 실패 지점이 많이 있습니다. 다음에는 Cypress를 사용해 시스템의 모든 계층을 한 번에 테스트하여 통합 문제를 파악하는 방법에 대해 알아보겠습니다. 

<!-- UIs are assembled by composing components and wiring them up to data and APIs. That's a lot of potential points of failure. Next up, we'll look at using Cypress to catch integration issues by testing all layers of your system in one go. -->
