---
title: '스토리북(Storybook)의 시각적 요소 테스트'
tocTitle: '시각적 요소 테스트'
description: 'UI 버그를 자동으로 찾아내는 방법 알아보기'
commit: ''
---

버그가 없는 UI를 제공하는 것은 어렵습니다. 과거에 개발자들은 유닛 테스트와 스냅샷 테스트를 이용해 HTML 덩어리에서 버그를 찾아냈습니다. 그러나 이런 방식은 사용자가 실제로 보는 화면과는 거리가 있었고, 버그는 결코 사라지지 않았습니다.


시각적 요소 테스트는 실제 브라우저에서 이미지 스냅샷을 캡처하고 비교해서 버그를 잡습니다. 이를 통해 UI가 제대로 보이는지 확인하는 과정을 자동화할 수 있습니다.

## 시각적 버그란 무엇일까요?



시각적 버그는 무척 흔합니다. 잘린 요소, 부적절한 색깔과 폰트, 깨진 레이아웃, 그리고 오류 상태의 누락과 같은 것들이 모두 시각적 버그입니다. 



오늘날 모든 회사는 소프트웨어 회사입니다. 즉, 모든 회사가 UI를 유지해야할 책임이 있다는 뜻입니다. 그러나 여러분도 알다시피 보통 회사는 UI를 항상 모니터링할 수 있을 만큼 인력이 충분하지 않습니다.

![](/ui-testing-handbook/visual-bugs.gif)

시각적 버그는 뜻하지 않게 발생한 오류로 우리가 만든 UI의 신뢰성을 떨어뜨립니다. 이러한 에러는 눈으로 볼 때는 발견하기 쉽지만, 일반적인 테스트 방법으로는 파악할 수 없는 회귀(regression)입니다. 

대부분의 테스트는 로직을 검증하기 위한 목적으로 시행됩니다. 함수를 실행하고 출력한 다음, 값이 정확한지 확인하는 방식으로요. 다행히 컴퓨터는 이런 일에 무척 탁월합니다. 하지만 눈에 보이는 화면은 어떨까요?  

여기에는 두 가지 문제가 있습니다.

### 1. 제대로 보이나요?

아래의 Task 컴포넌트를 예로 들어 보겠습니다. 이 컴포넌트는 가지고 있는 상태에 따라 다르게 보입니다. 완료 여부를 표시할 수 있는 체크박스, 할 일에 관한 정보, 고정 버튼이 보이네요. 물론 이 요소들은 모두 스타일링 되어 있습니다.


![Task 컴포넌트의 여러 상태들](/ui-testing-handbook/task.gif)

첫 번째 과제는 예측 가능한 모든 시나리오에서 컴포넌트의 모양새를 확인하는 것입니다. 각 사례를 설정하고 테스트하기 위해서는 props와 상태를 많이 손봐야 합니다. 컴퓨터는 명세와 실제 화면이 일치하는지 잘 알지 못합니다. 유감스럽지만 개발자가 육안으로 직접 검사해야 합니다.  

### 2. <i>아직도</i> 제대로 보이나요?

처음에는 분명 제대로 만든 것 같습니다. 모든 상태에서 문제가 없어 보입니다. 하지만 개발 과정에는 늘 변경사항이 생깁니다. 그리고 이를 수정하는 과정에 필연적으로 버그가 침입합니다. CSS를 살짝 조정하려던 것뿐인데 컴포넌트 또는 그 컴포넌트의 상태 중 하나가 망가지기도 합니다.  

무언가를 변경할 때마다 UI를 수동으로 확인할 수는 없습니다. 우리에겐 자동화가 필요합니다.

## 시각적 요소 테스트

시각적 요소 테스트를 통해 위의 두 가지 문제를 통합된 하나의 작업 방식으로 모두 해결할 수 있습니다. 바로 컴포넌트를 빌드할 때 그 컴포넌트의 모양새도 확인하는 방식입니다. 그리고 이 과정을 새로운 기능을 도입할 때마다 반복합니다.  

시각적 요소 테스트는 다음과 같은 방식으로 진행됩니다 - 

1. 🏷  컴포넌트 **분리**하기. [스토리북(Storybook)](https://storybook.js.org/)을 사용해 한 번에 한 컴포넌트씩 집중해서 테스트합니다.


2. ✍🏽 **테스트 케이스 작성하기.** 각 상태는 props 및 모의 데이터를 사용하여 재현됩니다.

3.  🔍 **수동으로 확인하기.** 각 테스트 케이스의 모양을 수동으로 확인합니다.

4.  📸 **UI  버그를 자동으로 잡기**  각 테스트 케이스의 스냅샷을 캡처한 뒤 기계를 이용한 비교를 사용하여 회귀를 확인합니다.

시각적 테스트의 핵심은 앱의 나머지 부분(데이터, 백엔드, API)에서 UI를 분리하는 것입니다. 이를 통해 각 상태를 개별적으로 관찰할 수 있습니다. 일부를 수동으로 확인한 뒤 각각의 상태를 자동으로 회귀 테스트할 수 있습니다.

각 단계를 자세히 살펴보겠습니다.

### 1. 컴포넌트 분리하기

한 번에 하나의 컴포넌트만 테스트하고, 각 상태마다 테스트 케이스를 작성하는 것이 버그를 찾아내기 훨씬 쉽습니다. 기존에는 컴포넌트가 처음으로 사용되는 애플리케이션 페이지에서 컴포넌트를 빌드했습니다. 그러나 이 방식은 모든 상태를 시뮬레이션하고 검증하기 어렵습니다. 자, 이제는 스토리북이라는 더 좋은 방법이 있습니다.

스토리북은 컴포넌트를 개별적으로 빌드하기 위한 업계 표준입니다. Twitter, Slack, Airbnb, Shopify, Stripe 및 Microsoft에서 사용합니다. 스토리북은 작은 독립 실행형 도구로 패키지되어 앱과 함께 제공되며, 아래와 같은 이점이 있습니다. 

- 📥 각 컴포넌트를 분리해서 렌더링할 수 있는 **샌드 박스**

- 🔭  모든 **상태**를 _stories_로 시각화

- 📑 각 컴포넌트에 대한 props 및 사용 지침에 관한 **문서**

- 🗃️ 쉽게 검색할 수 있도록 돕는 모든 컴포넌트의 **디렉토리**

Task 컴포넌트로 다시 돌아가 보겠습니다. "컴포넌트 분리"란 이 하나의 컴포넌트를 자체적으로 불러오고 렌더링한다는 것을 의미합니다. 그러기 위해서는 스토리북이 필요합니다.

### 스토리북 설정하기

우리의 프로젝트는 스토리북을 사용할 수 있도록 미리 구성되어 있습니다. 설정 파일은 `.storybook` 폴더에 있고, 필요한 모든 스크립트는 `package.json`에 추가되었습니다.

Task 컴포넌트에 대한 스토리(story) 파일을 만드는 것으로 시작해볼까요. 이렇게 하면 Task 컴포넌트가 스토리북에 등록되고, 하나의 기본 테스트 케이스로 추가됩니다.

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

마지막으로 다음 명령어를 실행해 개발 모드에서 스토리북을 시작합시다. Task 컴포넌트가 로드되는 것을 볼 수 있습니다.

```
yarn storybook
```

![](/ui-testing-handbook/sb-register.png)

이제 테스트 케이스를 작성할 준비가 되었습니다.

### 2. 테스트 케이스 작성하기

스토리북에서는 테스트 케이스를 스토리라고 합니다. 스토리는 컴포넌트의 특정 상태, 즉 브라우저에서 실제 렌더링된 상태를 포착합니다.

Task 컴포넌트에는 기본 상태, 고정 되었을 때, 그리고 보관되었을 때 이렇게 총 세 가지 상태가 있습니다. 이 각 상태에 대한 스토리를 추가해봅시다.

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

## 3. 검증하기


검증은 컴포넌트가 스토리북에서 어떻게 보이는지 개발자가 직접 평가하는 과정입니다. 즉, 디자인 명세와 일치하는지 확인하는 일입니다.

보통 개발은 다음과 같은 과정으로 진행됩니다 - 

1. 코드 수정하기
2. 적절한 상태의 컴포넌트 가져오기
3. 외관 평가하기

그리고 모든 상태를 확인할 때까지 위의 과정을 반복합니다.

하지만 각 상태에 대한 스토리를 작성하면 두 번째 단계가 생략됩니다. 코드를 수정한 뒤 모든 테스트 케이스 검증까지 바로 진행할 수 있습니다. 따라서 전체 프로세스의 속도가 크게 빨라집니다.

스토리를 작성하다 보면 그 이전에는 미처 고려하지 못했던 시나리오도 떠오릅니다. 예를 들어 사용자가 정말 긴 이름의 일정을 입력하면 어떻게 될까요? 아래 스토리를 추가한 뒤 살펴봅시다.


```javascript
const longTitleString = `이 일정의 이름은 어마어마하게 길어요. 지금처럼 계속 길어지다가는 내용이 넘칠 수도 있을 것 같습니다. 이렇게 되면 무슨 일이 일어날까요? 고정된 일정을 나타내는 별 모양 아이콘에 텍스트가 겹칠 수도 있습니다. 아니면 아이콘에 도달했을 때 텍스트가 갑자기 잘릴 수도 있겠죠. 부디 그렇지 않기를 바랍니다!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    id: '4',
    title: longTitleString,
    state: 'TASK_INBOX',
  },
};
```

## 4. 자동으로 회귀 포착하기

Task 컴포넌트는 모든 사용 사례에서 우리가 기대했던 대로 보입니다. 하지만 앞으로도 쭉 CSS가 깨지지 않도록 하려면 어떻게 해야 할까요? 무언가를 변경할 때마다 컴포넌트의 전체 디렉터리를 따라 **수동으로** 검사하는 것은 비효율적입니다.

그래서 개발자들은 시각적 회귀 테스트 도구를 사용하여 회귀를 자동으로 확인합니다. Auth0, Twilio, Adobe와 Peloton에서는 스토리북팀에서 만든 [크로마틱(Chromatic)](http://chromatic.com/)을 사용합니다.

완성된 컴포넌트는 의도했던 대로 훌륭한 상태입니다. 크로마틱은 브라우저에 표시되는 모든 스토리의 이미지 스냅샷을 캡처합니다. 그런 다음 무언가 변경될 때마다 새 스냅샷을 찍고 이전 스냅샷과 비교합니다. 우리는 발견된 시각적 차이를 검토해서 의도적인 변경인지 우발적인 버그인지 결정하기만 하면 됩니다.

![](/ui-testing-handbook/visual-regression-testing.gif)

### 크로마틱 설정하기

[새 프로젝트 만들기](https://www.chromatic.com/docs/setup)에 로그인하고 프로젝트 token을 받아오세요.

크로마틱은 스토리북용으로 특별히 제작되었으며 따로 구성(configuration)할 필요가 없습니다. 아래 커맨드를 실행하면 크로마틱이 클라우드 브라우저를 사용해 각 스토리의 스냅샷을 캡처합니다.


```
npx chromatic --project-token=<project-token>
```

첫 번째 실행은 기준점, 즉 시작점으로 설정됩니다. 그리고 각각의 스토리에는 고유한 기준점이 있습니다.

![](/ui-testing-handbook/baselines.png)


### 테스트 실행하기

commit할 때마다 새 스냅샷이 캡처되고, 그 스냅샷을 기존 기준점과 비교해서 UI 변경 사항을 감지합니다. 직접 보면서 확인해봅시다.

먼저 UI를 수정합시다. 고정 아이콘과 텍스트 스타일을 변경하겠습니다. Task 컴포넌트를 업데이트하고 commit한 다음 크로마틱을 다시 실행합니다.

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

이제 두 파일의 차이가 보일 겁니다.

![](/ui-testing-handbook/task-diff.gif)


회귀 테스트는 의도하지 않은 변경 사항이 들어오는 것을 막아줍니다. 그러나 변경 사항이 의도적인지 여부를 결정하는 것은 여전히 개발자의 몫입니다.

✅ 의도한 변경사항일 경우 accept를 누르세요. 이제 새 스냅샷이 기준점으로 설정됩니다.

❌ 의도하지 않은 변경이라면 deny를 누르세요. 빌드(build)가 실패합니다. 코드를 수정하고 크로마틱을 다시 실행하세요.

우리의 경우 변경 사항은 의도적이었습니다. 모든 스토리에 대해 accept를 눌러주세요. 전체 작업 흐름(workflow)은 아래에 설명되어 있습니다.

![스토리북을 빌드하고 크로마틱에서 시각적 요소 테스트를 수행하세요. 변경 사항들이 좋아 보인다면, PR을 병합하세요.](/ui-testing-handbook/visual-testing-workflow.png)

## 하나의 버그가 여러 개의 버그로 늘어나는 것을 방지하기

약간의 CSS 실수 혹은 한 컴포넌트의 문제가 여러 문제로 눈덩이처럼 불어날 수 있습니다. 이런 버그는 디버깅하기가 무척 어렵습니다. 다음 장에서는 이같은 연쇄적인 문제를 잡는 방법을 배워봅시다.
