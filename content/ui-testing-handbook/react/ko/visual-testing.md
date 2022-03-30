---
title: 'Storybook의 시각적 테스트'
tocTitle: '시각적 테스트'
description: 'UI 버그를 자동으로 찾아내는 방법 알아보기'
commit: ''
---

<!-- It's tough to ship bug-free UIs. In the past, developers used unit and snapshot tests to scan for bugs in blobs of HTML. But those methods don't represent what the user actually sees, so bugs never went away. -->

버그가 없는 UI를 제공하는 것은 어렵습니다. 과거에 개발자들은 유닛 테스트와 스냅샷 테스트를 이용해 HTML 덩어리에서 버그를 찾아냈습니다. 그러나 이런 방식은 사용자가 실제로 보는 화면과는 거리가 있었고, 버그는 결코 사라지지 않았습니다.

<!-- Visual testing catches bugs by capturing and comparing image snapshots in a real browser. It allows you to automate the process of checking if your UI looks right. -->

시각적 테스트는 실제 브라우저에서 이미지 스냅샷을 캡처하고 비교해서 버그를 잡습니다. 이를 통해 UI가 제대로 보이는지 확인하는 과정을 자동화할 수 있습니다.

<!-- ## What are visual bugs? -->

## 시각적 버그란 무엇일까요?

<!-- Visual bugs are ubiquitous. Cut-off elements. Incorrect colors or font styles. Broken layouts. And missing error states. -->

시각적 버그는 무척 흔합니다. 잘린 요소, 부적절한 색깔과 폰트, 깨진 레이아웃, 그리고 누락된 state 오류 같은 것들이 모두 시각적 버그입니다. 

<!-- Every company is now a software company. That means every company is responsible for maintaining a UI. But if you’re like me, you probably noticed that companies never seem to have enough people monitor every part of their UI all the time. -->

오늘날 모든 회사는 소프트웨어 회사입니다. 즉, 모든 회사가 UI를 유지해야할 책임이 있다는 뜻입니다. 그러나 여러분도 알다시피 보통 회사는 UI를 항상 모니터링할 수 있을 만큼 인력이 충분하지 않습니다.

![](/ui-testing-handbook/visual-bugs.gif)

<!-- Visual bugs are the unintentional errors in your UIs appearance that make it look untrustworthy. They’re the regressions that are easy to eyeball but that common testing methods can’t catch. -->

시각적 버그는 뜻하지 않게 발생한 오류로 우리가 만든 UI의 신뢰성을 떨어뜨립니다. 이러한 에러는 눈으로 볼 때는 발견하기 쉽지만, 일반적인 테스트 방법으로는 파악할 수 없는 회귀(regression)입니다. 

<!-- Most tests are intended to verify logic, which makes sense: you run a function, get its output and check whether it's correct or not. Computers are great at verifying data. But what about how something looks? -->

대부분의 테스트는 로직을 검증하기 위한 목적으로 시행됩니다. 함수를 실행하고 출력한 다음, 값이 정확한지 확인하는 방식으로요. 다행히 컴퓨터는 이런 일에 무척 탁월합니다. 하지만 눈에 보이는 화면은 어떨까요?  

<!-- Well, there are two layers to this problem. -->

여기에는 두 가지 문제가 있습니다.

<!-- ### 1. Does it look right? -->

### 1. 제대로 보이나요?

<!-- Take, for example, this Task component. It looks different depending on what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a pin button. And of course, all the associated styling. -->

아래의 Task 컴포넌트를 예로 들어 보겠습니다. 이 컴포넌트는 가지고 있는 state에 따라 다르게 보입니다. 완료 여부를 표시할 수 있는 체크박스, 할 일에 관한 정보, 북마크 버튼이 보이네요. 물론 이 요소들은 모두 스타일링 되어 있습니다.


![Different states of a task component](/ui-testing-handbook/task.gif)

<!-- The first challenge is just to verify the component's appearance in all these scenarios. That requires a lot of fiddling with props & state to set up and test each case. Oh, and computers can’t really tell you if it matches the spec or not. You, _the developer,_ have to visually inspect it. -->

첫 번째 과제는 예측 가능한 모든 시나리오에서 컴포넌트의 모양새를 확인하는 것입니다. 각 사례를 설정하고 테스트하기 위해서는 props와 state를 많이 손봐야 합니다. 컴퓨터는 명세와 실제 화면이 일치하는지 잘 알지 못합니다. 유감스럽지만 개발자가 육안으로 직접 검사해야 합니다.  

<!-- ### 2. Does it <i>still</i> look right? -->

### 2. <i>아직도</i> 제대로 보이나요?

<!-- You built it right the first time. It looks good in _all states_. But changes happen over the natural course of development. Bugs inevitably sneak in. This is especially true for interfaces. A minor CSS tweak can break a component or one of its states. -->

처음에는 분명 제대로 만든 것 같습니다. 여러 번 확인해봐도 문제가 없어 보입니다. 하지만 개발 과정에는 늘 변경사항이 생깁니다. 그리고 이를 수정하는 과정에 필연적으로 버그가 침입합니다. CSS를 살짝 조정하려던 것뿐인데 컴포넌트 또는 그 컴포넌트의 state 중 하나가 망가지기도 합니다.  

<!-- You can’t manually check the breadth of the UI every time you make a change. You need something more automated. -->

무언가를 변경할 때마다 UI를 수동으로 확인할 수는 없습니다. 우리에겐 자동화가 필요합니다.

<!-- ## Visual testing -->

## 시각적 테스트

<!-- Visual testing allows you to tackle both these tasks with one unified workflow. It is the process of verifying the appearance of a component as you’re building it. And again as you iterate to ship new features. -->

시각적 테스트를 통해 위의 두 가지 문제를 통합된 하나의 작업 방식으로 모두 해결할 수 있습니다. 바로 컴포넌트를 빌드할 때 그 컴포넌트의 모양새도 확인하는 방식입니다. 그리고 이 과정을 새로운 기능을 도입할 때마다 반복합니다.  

<!-- Here's what the visual testing workflow looks like: -->

시각적 테스트는 다음과 같은 방식으로 진행됩니다 - 

<!-- 1.  🏷 **Isolate** components. Use [Storybook](https://storybook.js.org/) to focus on and test one component at a time. -->

1. 🏷  컴포넌트 **분리**하기. [Storybook](https://storybook.js.org/)을 사용해 한 번에 한 컴포넌트씩 집중해서 테스트합니다.

<!-- 2.  ✍🏽 **Write out the test cases.** Each state is reproduced using props and mock data. -->

2. ✍🏽 **테스트 케이스 작성하기.** 각 state는 props 및 mock 데이터를 사용하여 재현됩니다.

<!-- 3.  🔍 **Manually verify** the appearance of each test case. -->

3.  🔍 **수동으로 확인하기.** 각 테스트 케이스의 모양을 수동으로 확인합니다.

<!-- 4.  📸 **Catch UI bugs automatically.** Capture snapshots of each test case and use machine-based diffing to check for regressions. -->

4.  📸 **UI  버그를 자동으로 잡기**  각 테스트 케이스의 스냅샷을 캡처한 뒤 머신 기반의 diffing을 사용하여 회귀를 확인합니다.

<!-- The crux of visual testing is isolating the UI from the rest of the app (data, backend, APIs). That allows you to observe each state individually. You can then manually spot check and automatically regression test those states.

Let's go through each step in detail. -->

시각적 테스트의 핵심은 앱의 나머지 부분(데이터, 백엔드, API)에서 UI를 분리하는 것입니다. 이를 통해 각 state를 개별적으로 관찰할 수 있습니다. 일부를 수동으로 확인한 뒤 각각의 state를 자동으로 회귀 테스트할 수 있습니다.

각 단계를 자세히 살펴보겠습니다.

<!-- ### 1. Isolate components -->

### 1. 컴포넌트 분리하기

<!-- It’s much easier to pinpoint bugs by testing one component at a time and writing a test case for each of its states. The conventional approach is to build the component on the application page where it is first used. Which makes it hard to simulate and verify all these states. There’s a better way—Storybook. -->

한 번에 하나의 컴포넌트만 테스트하고, 각 state마다 테스트 케이스를 작성하는 것이 버그를 찾아내기 훨씬 쉽습니다. 기존에는 컴포넌트가 처음으로 사용되는 애플리케이션 페이지에서 컴포넌트를 빌드했습니다. 그러나 이 방식은 모든 state를 시뮬레이션하고 검증하기 어렵습니다. 자, 이제는 Storybook이라는 더 좋은 방법이 있습니다.

<!-- Storybook is the industry-standard for building components in isolation. It’s used by Twitter, Slack, Airbnb, Shopify, Stripe, and Microsoft. It is packaged as a small standalone tool that lives alongside your app, giving you: -->

Storybook은 컴포넌트를 개별적으로 빌드하기 위한 업계 표준입니다. Twitter, Slack, Airbnb, Shopify, Stripe 및 Microsoft에서 사용합니다. Storybook은 작은 독립 실행형 도구로 패키지되어 앱과 함께 제공되며, 아래와 같은 이점이 있습니다. 

<!-- - 📥 A **sandbox** to render each component in isolation -->

- 📥 각 컴포넌트를 분리해서 렌더링할 수 있는 **테스트 영역**

<!-- - 🔭 Visualize all its **states** as _stories_ -->

- 🔭  모든 **state**를 _stories_로 시각화

<!-- - 📑 **Document** props and usage guidelines for each component -->

- 📑 각 컴포넌트에 대한 props 및 사용 지침에 관한 **문서**


<!-- - 🗃️ A **directory** of all your components to make discovery easier -->

- 🗃️ 쉽게 검색할 수 있도록 돕는 모든 컴포넌트의 **디렉토리**

<!-- Let’s go back to that Task component. To isolate it means that we load up and render this one component by itself. For that, we need Storybook. -->

Task 컴포넌트로 다시 돌아가 보겠습니다. "컴포넌트 분리"란 이 하나의 컴포넌트를 자체적으로 불러오고 렌더링한다는 것을 의미합니다. 그러기 위해서는 Storybook이 필요합니다.

<!-- ### Setup Storybook -->

### Storybook 설정하기

<!-- Our project is preconfigured to use Storybook. The config lives in the `.storybook` folder and all the necessary scripts have been added to `package.json`. -->

우리의 프로젝트는 Storybook을 사용할 수 있도록 미리 구성되어 있습니다. config 파일은 `.storybook` 폴더에 있고, 필요한 모든 스크립트는 `package.json`에 추가되었습니다.

<!-- We can start by creating a story file for the Task component. This registers the component with Storybook and adds in one default test case. -->

Task 컴포넌트에 대한 story 파일을 만드는 것으로 시작해볼까요. 이렇게 하면 Task 컴포넌트가 Storybook에 등록되고, 하나의 기본 테스트 사례로 추가됩니다.

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
```

<!-- And finally, run the following command to start Storybook in development mode. You should see the Task component load up. -->

마지막으로 다음 커맨드를 실행해 개발 모드에서 Storybook을 시작합시다. Task 컴포넌트가 로드되는 것을 볼 수 있습니다.

```
yarn storybook
```

![](/ui-testing-handbook/sb-register.png)

<!-- We're now ready to write out the test cases. -->

이제 테스트 케이스를 작성할 준비가 되었습니다.

<!-- ### 2. Write test cases -->

### 2. 테스트 케이스 작성하기

<!-- In Storybook, test cases are referred to as stories. A story captures a particular state of the component—the actual rendered state in the browser. -->

Storybook에서는 테스트 케이스를 story라고 합니다. story는 컴포넌트의 특정 상태, 즉 브라우저에서 실제 렌더링된 state를 포착합니다.

<!-- The Task component has three states—default, pinned and archived. We’ll add a story for each one. -->

Task 컴포넌트에는 기본 상태, 북마크 되었을 때, 그리고 완료되었을 때 이렇게 총 세 가지 상태가 있습니다. 이 각 상태에 대한 story를 추가해봅시다.

![](/ui-testing-handbook/task-states.png)

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
```

<!-- ## 3. Verify -->

## 3. 검증하기

<!-- Verification is _you_ evaluating how the component looks in Storybook. That is, does it match the design spec? -->

검증은 컴포넌트가 Storybook에서 어떻게 보이는지 개발자가 직접 평가하는 과정입니다. 즉, 디자인 명세와 일치하는지 확인하는 일입니다.

<!-- The usual development workflow is:

1.  Edit the code
2.  Get the component in the appropriate state
3.  Evaluate its appearance -->

보통 개발은 다음과 같은 과정으로 진행됩니다 - 

1. 코드 수정하기
2. 적절한 state의 컴포넌트 가져오기
3. 외관 평가하기

<!-- And then repeat the whole cycle until you’ve verified all its states. -->

그리고 모든 state를 확인할 때까지 위의 과정을 반복합니다.

<!-- By writing a story for each state, you cut out that second step. You can go right from editing code to verifying all test cases. Thus, dramatically speeding up the whole process. -->

하지만 각 state에 대한 story를 작성하면 두 번째 단계가 생략됩니다. 코드를 수정한 뒤 모든 테스트 케이스 검증까지 바로 진행할 수 있습니다. 따라서 전체 프로세스의 속도가 크게 빨라집니다.

<!-- Writing out stories also surfaces scenarios that you wouldn't have considered had you developed it in a more ad-hoc way. For example, what happens if the user enters a really long task? Let's add in that story to find out. -->

story를 작성하다 보면 그 이전에는 미처 고려하지 못했던 시나리오도 떠오릅니다. 예를 들어 사용자가 정말 긴 이름의 일정을 입력하면 어떻게 될까요? 아래 story를 추가한 뒤 살펴봅시다.


```javascript
const longTitleString = `이 일정의 이름은 어마어마하게 길어요. 지금처럼 계속 길어지다가는 내용이 넘칠 수도 있을 것 같습니다. 이렇게 되면 무슨 일이 일어날까요? 북마크된 일정을 나타내는 별 모양 아이콘에 텍스트가 겹칠 수도 있습니다. 아니면 아이콘에 도달했을 때 텍스트가 갑자기 잘릴 수도 있겠죠. 부디 그렇지 않기를 바랍니다!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    id: '4',
    title: longTitleString,
    state: 'TASK_INBOX',
  },
};
```

<!-- ## 4. Catch regressions automatically -->

## 4. 자동으로 회귀 포착하기

<!-- The Task component looks as we expect it to in all its use cases. But, how do we ensure that a stray line of CSS doesn’t break it in the future? It’s unrealistic to **manually** go through the entire directory of components whenever you make a change. -->

Task 컴포넌트는 모든 사용 사례에서 우리가 기대했던 대로 보입니다. 하지만 앞으로도 쭉 CSS가 깨지지 않도록 하려면 어떻게 해야 할까요? 무언가를 변경할 때마다 컴포넌트의 전체 디렉터리를 **수동으로** 이동하는 것은 비효율적입니다.

<!-- That’s why developers use a visual regression testing tool to automatically check for regressions. Auth0, Twilio, Adobe and Peloton use [Chromatic](http://chromatic.com/) (built by the Storybook team). -->

그래서 개발자들은 시각적 회귀 테스트 도구를 사용하여 회귀를 자동으로 확인합니다. Auth0, Twilio, Adobe와 Peloton에서는 Storybook팀에서 만든 [Chromatic](http://chromatic.com/)을 사용합니다.

<!-- At this point, we know that the component is in a good state. Chromatic will capture an image snapshot of every story—as it appears in the browser. Then any time you make a change, a new snapshot is captured and compared to the previous one. You then review any visual differences found to decide if they are intentional updates or accidental bugs. -->

완성된 컴포넌트는 의도했던 대로 훌륭한 상태입니다. Chromatic은 브라우저에 표시되는 모든 story의 이미지 스냅샷을 캡처합니다. 그런 다음 무언가 변경될 때마다 새 스냅샷을 찍고 이전 스냅샷과 비교합니다. 우리는 발견된 시각적 차이를 검토해서 의도적인 변경인지 우발적인 버그인지 결정하기만 하면 됩니다.

![](/ui-testing-handbook/visual-regression-testing.gif)

<!-- ### Setup Chromatic -->

### Chromatic 설정하기

<!-- Sign in and [create a new project](https://www.chromatic.com/docs/setup) and grab your project-token. -->

[create a new project](https://www.chromatic.com/docs/setup)에 로그인하고 project token을 받아오세요.

<!-- Chromatic is built specifically for Storybook and requires no configuration. Running the command below will trigger it to capture a snapshot of each story (using a cloud browser). -->

Chromatic은 Storybook용으로 특별히 제작되었으며 따로 구성(configuration)할 필요가 없습니다. 아래 커맨드를 실행하면 Chromatic이 클라우드 브라우저를 사용해 각 story의 스냅샷을 캡처합니다.


```
npx chromatic --project-token=<project-token>
```

<!-- The first run will be set as the baseline i.e., the starting point. And each story has its own baseline. -->

첫 번째 실행은 baseline, 즉 시작점으로 설정됩니다. 그리고 각각의 story에는 고유한 baseline이 있습니다.

![](/ui-testing-handbook/baselines.png)

<!-- ### Run tests -->

### 테스트 실행하기

<!-- On each commit, new snapshots are captured and compared against existing baselines to detect UI changes. Let’s see that check in action. -->

commit할 때마다 새 스냅샷이 캡처되고, 그 스냅샷을 기존 baseline과 비교해서 UI 변경 사항을 감지합니다. 직접 보면서 확인해봅시다.

<!-- First, make a tweak to the UI. We’re going to change the pinned icon and the text styling. Update the Task component, then make a commit and rerun Chromatic. -->

먼저 UI를 수정합시다. 북마크 아이콘과 텍스트 스타일을 변경하겠습니다. Task 컴포넌트를 업데이트하고 commit한 다음 Chromatic을 다시 실행합니다.

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Flex, IconButton, Input, Box, VisuallyHidden } from '@chakra-ui/react';
-import { BellIcon } from '@chakra-ui/icons';
+import { StarIcon } from '@chakra-ui/icons';

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onTogglePinTask,
  onEditTitle,
  ...props
}) => (
  <Flex
    as="li"
    _notLast={{
      borderBottom: '1px',
      borderColor: 'gray.200',
    }}
    h={12}
    bg="white"
    alignItems="center"
    _hover={{
      bgGradient: 'linear(to-b,  brand.100,  brand.50)',
    }}
    aria-label={title}
    tabIndex="0"
    {...props}
  >
    <Checkbox
      px={4}
      isChecked={state === 'TASK_ARCHIVED'}
      onChange={(e) => onArchiveTask(e.target.checked, id)}
    >
      <VisuallyHidden>Archive</VisuallyHidden>
    </Checkbox>
    <Box width="full" as="label">
      <VisuallyHidden>Edit</VisuallyHidden>
      <Input
        variant="unstyled"
        flex="1 1 auto"
        color={state === 'TASK_ARCHIVED' ? 'gray.400' : 'gray.700'}
        textDecoration={state === 'TASK_ARCHIVED' ? 'line-through' : 'none'}
-       fontSize="md"
-       fontWeight="bold"
+       fontSize="sm"
        isTruncated
        value={title}
        onChange={(e) => onEditTitle(e.target.value, id)}
      />
    </Box>
    <IconButton
      p={5}
      flex="none"
      aria-label={state === 'TASK_PINNED' ? 'unpin' : 'pin'}
      variant={state === 'TASK_PINNED' ? 'unpin' : 'pin'}
-     icon={<BellIcon />}
+     icon={<StarIcon />}
      onClick={() => onTogglePinTask(state, id)}
    />
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

<!-- You’ll now be presented with a diff. -->

이제 diff, 즉 두 파일의 차이가 보일 겁니다.

![](/ui-testing-handbook/task-diff.gif)

<!-- Regression testing ensures that we don’t introduce changes by accident. But it’s still up to you to decide whether changes are intentional or not. -->

회귀 테스트는 의도하지 않은 변경 사항이 들어오는 것을 막아줍니다. 그러나 변경 사항이 의도적인지 여부를 결정하는 것은 여전히 개발자의 몫입니다.

<!-- ✅ If the changes are intentional, press accept. The new snapshot will now be set as the baseline. -->

✅ 의도한 변경사항일 경우 accept를 누르세요. 이제 새 스냅샷이 baseline으로 설정됩니다.

<!-- ❌ If the changes are unintentional, press deny. The build will fail. Fix the code and run Chromatic again. -->

❌ 의도하지 않은 변경이라면 deny를 누르세요. 빌드가 실패합니다. 코드를 수정하고 Chromatic을 다시 실행하세요.

<!-- In our case, the changes were intentional. Go ahead and click accept for all stories. The whole workflow is illustrated below. -->

우리의 경우 변경 사항은 의도적이었습니다. 모든 story에 대해 accept를 눌러주세요. 전체 작업 흐름은 아래에 설명되어 있습니다.

![Build in storybook and run visual tests with Chromatic. If changes look good, then merge your PR.](/ui-testing-handbook/visual-testing-workflow.png)

<!-- ## Stopping one bug from turning into many -->

## 하나의 버그가 여러 개의 버그로 늘어나는 것을 방지하기

<!-- A bit of leaky CSS or one broken component can snowball into multiple issues. These bugs are particularly frustrating to debug. In the next chapter, we'll build upon these concepts to learn how to catch such cascading problems. -->

약간의 CSS 실수 혹은 한 컴포넌트의 문제가 여러 문제로 눈덩이처럼 불어날 수 있습니다. 이런 버그는 디버깅하기가 무척 어렵습니다. 다음 장에서는 이같은 상속된 문제를 잡는 방법을 배워봅시다.
