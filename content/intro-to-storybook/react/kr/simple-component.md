---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '간단한 컴포넌트를 독립적으로 만들어봅시다'
commit: '3d9cd8c'
---

우리는 [컴포넌트 기반 개발(Component-Driven Development)](https://www.componentdriven.org/) (CDD) 방법론에 따라 UI를 만들어 볼 것입니다. 이는 컴포넌트로부터 시작하여 마지막 화면에 이르기까지 상향적으로 UI를 개발하는 과정입니다. CDD는 UI를 구축할 때 직면하는 복잡성을 확장하는데 도움을 줍니다.

## Task 컴포넌트

![Task 컴포넌트의 3가지 states](/intro-to-storybook/task-states-learnstorybook.png)

`Task`는 우리 앱의 핵심 컴포넌트입니다. 각각의 과업은 현재 어떤 state에 있느냐에 따라 약간씩 다르게 나타납니다. 선택된 (또는 선택되지 않은) 체크 박스, 과업에 대한 정보, 그리고 과업을 위아래로 움직일 수 있도록 도와주는 "핀" 버튼이 표시될 것입니다. 이를 위해 다음과 같은 prop들이 필요합니다.

- `title` – 과업을 설명해주는 문자열
- `state` - 현재 어떤 과업이 목록에 있으며, 선택되어 있는지의 여부

`Task` 컴포넌트를 만들기 위해, 위에서 살펴본 여러 유형의 과업에 해당하는 테스트 상태를 작성합니다. 그런 다음 모의 데이터와 함께 Storybook을 사용하여 독립적 환경에서 컴포넌트를 구축합니다. 각각의 state에 따라 컴포넌트의 모습을 수동으로 테스트하면서 진행할 것입니다.

## 설정 시작하기

먼저, `Task` 컴포넌트와 그에 해당하는 스토리 파일을 만들어 봅시다. `src/components/Task.js`와 `src/components/Task.stories.js`을 생성해주세요.
`Task`의 기본 구현부터 시작하겠습니다. 우리가 필요로 하는 속성들과 여러분이 과업에 대해 취할 수 있는 두 가지 액션(목록 간 이동하는 것)을 간단히 살펴보도록 하겠습니다.

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

위의 코드는 Todos 앱의 HTML을 기반으로 한 `Task` 기반의 직관적인 마크업을 렌더링 합니다.

아래의 코드는 `Task`의 세 가지 state를 스토리 파일에 작성한 것입니다.

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  // "Data"로 끝나는 export는 스토리에서 제외합니다.
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => <Task task={{ ...taskData }} {...actionsData} />;

export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;

export const Archived = () => (
  <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
);
```

Storybook은 컴포넌트와 그 하위 스토리의 두 가지 기본 단계로 구성되어 있습니다. 각 스토리는 해당 컴포넌트에 대응된다고 생각하시면 됩니다. 여러분은 얼마든지 필요한 만큼의 스토리를 컴포넌트별로 작성하실 수 있습니다.

- **컴포넌트**
  - 스토리
  - 스토리
  - 스토리

Storybook에게 우리가 문서화하고 있는 컴포넌트에 대해 알려주기 위해, 아래 사항들을 포함하는 `default`를 내보내기 해주세요.

- `component` -- 해당 컴포넌트,
- `title` -- Storybook 앱의 사이드바에서 컴포넌트를 참조하는 방법,
- `excludeStories` -- Storybook에서 스토리를 내보낼 때 렌더링에서 제외하는 것

스토리를 정의하기 위해 각 테스트 상태에 대해 컴포넌트를 랜더링 하는 함수를 내보내어 스토리를 만듭니다. 스토리는 주어진 특정 state에 대하여 렌더링된 요소(예를 들자면 prop이 포함된 컴포넌트)를 반환하는 함수입니다. 이는 [함수형 컴포넌트(Stateless Functional Component)](https://reactjs.org/docs/components-and-props.html)와 같습니다.

`action()`을 사용하면, Storybook UI의 **actions** 패널이 클릭되었을 때 나타나도록 하는 콜백을 만들 수 있습니다. 따라서 핀 버튼을 만들 때 버튼 클릭이 성공적이었는지 테스트 UI에서 확인할 수 있습니다.

컴포넌트의 모든 순열에 동일한 액션을 전달해야 하므로, `actionsData` 변수에 이를 모두 묶어주면 편리합니다. 그리고 React의 `{...actionsData}` prop을 사용하여 이를 모두 한 번에 전달합니다. `<Task {...actionsData}>`는 `<Task onPinTask={actionsData.onPinTask} onArchiveTask={actionsData.onArchiveTask}>`과 동일합니다.

이처럼 액션을 `actionsData`에 묶는 것의 또 다른 좋은 점으로는 그 변수를 `export`로 내보내고 해당 컴포넌트를 재사용하는 컴포넌트의 스토리에서 액션을 사용할 수 있다는 점입니다.

스토리를 만들 때 기본 과업 데이터 (`taskData`)를 사용하여 컴포넌트에 필요한 과업 형태를 만듭니다. 이것은 일반적으로 실제 데이터가 어떻게 보이는지에 따라 모델링 됩니다. 다시 한번, `export`하는 것은 나중에 보실 수 있듯이 다른 스토리에서 이를 재사용 할 수 있도록 해줍니다.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>액션</b></a>은 UI 컴포넌트를 독립적으로 만들 때, 컴포넌트와의 상호작용을 확인하는데 도움이 됩니다. 종종, 앱의 컨텍스트에서 함수와 state에 접근하지 못할 수 있습니다. 이런 경우 <code>action()</code> 을 사용하여 끼워 넣어 주세요.
</div>

## 구성

Storybook 구성을 몇 가지 변경하여, 최근에 생성한 스토리뿐 아니라 [지난 챕터](/react/kr/get-started)에서도 변경된 CSS 파일을 사용할 수 있도록 해보겠습니다.

Storybook 구성 파일 (`.storybook/main.js`)을 다음과 같이 변경해주세요.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

위와 같이 `.storybook` 폴더에 변경을 마치셨다면, 아래와 같이 `preview.js`라는 이름의 새로운 파일을 만들어주세요.

```javascript
// .storybook/preview.js

import '../src/index.css';
```

이 작업을 끝내신 후, Storybook 서버를 재시작하면 세 가지 과업 state에 관한 테스트 사례가 생성됩니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## States 구현하기

지금까지 Storybook 설정, 스타일 가져오기, 테스트 사례를 구성해보았습니다. 디자인에 맞게 컴포넌트의 HTML을 구현하는 작업을 빠르게 시작해 볼 수 있습니다.
컴포넌트는 아직 기본적입니다. 자세한 사항으로 들어가기 전에 우선 디자인을 성취할 수 있는 코드를 적어보겠습니다.

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

위의 추가 마크업과 우리가 가져온 CSS가 서로 결합되어 다음과 같은 UI를 생성합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## 데이터 요구 사항 명시하기

컴포넌트에 필요한 데이터 형태를 명시하려면 React에서 `propTypes`를 사용하는 것이 가장 좋습니다. 이는 자체적 문서화일 뿐만 아니라, 문제를 조기에 발견하는 데 도움이 됩니다.

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

개발 중에 만약 Task 컴포넌트가 잘못 사용된다면 경고가 나타날 것입니다.

<div class="aside">
동일한 목적을 달성하는 다른 방법으로는 TypeScript와 같은 타입 시스템의 JavaScript를 사용하여 컴포넌트의 속성에 대한 타입을 만드는 것입니다.
</div>

## 완성!

지금까지 우리는 서버나 프런트엔드 앱 전체를 실행하지 않고 성공적으로 컴포넌트를 만들었습니다. 다음 단계는 이와 유사한 방법으로 Taskbox 컴포넌트의 남은 부분을 하나씩 만드는 것입니다.

보시다시피, 독립적 환경에서 컴포넌트를 제작하는 것은 쉽고 빠릅니다. 가능한 모든 state를 테스트할 수 있기 때문에, 버그가 적고 높은 퀄리티의 UI를 제작할 수 있습니다.

## 자동화된 테스트

Storybook은 우리의 앱의 UI를 만드는 동안 수동으로 테스트할 수 있는 좋은 방법을 제공해주었습니다. '스토리'는 앱을 계속해서 개발하는 동안 Task 컴포넌트의 외관을 망가뜨리지는 않았는지 확인하는 것을 도와줍니다. 그러나 지금 단계에서는 완전히 수동적 단계이므로 누군가 각 테스트를 일일이 클릭하여 오류나 경고 없이 렌더링 되는지 살펴봐야 합니다. 이를 자동화할 수는 없을까요?

### 스냅샷 테스트

스냅샷 테스트(Snapshot)는 주어진 입력에 대해 컴포넌트의 "양호한" 출력 값을 기록한 다음, 향후 출력 값이 변할 때마다 컴포넌트에 플래그를 지정하는 방식을 말합니다. 이는 새로운 버전의 컴포넌트를 보고 바뀐 부분을 빠르게 확인할 수 있기 때문에 Storybook을 보완해 줄 수 있습니다.

<div class="aside">
스냅샷 테스트가 매번 실패하지 않도록 하려면, 컴포넌트에 전달되는 데이터는 매번 변경되지 않는 것으로 해주세요. 특히 날짜나 무작위로 생성된 값 같은 것들에 주의해주세요.
</div>

[Storyshots 애드온(addon)](https://github.com/storybooks/storybook/tree/master/addons/storyshots)을 사용하면 각 스토리에 대한 스냅샷이 생성됩니다. 다음의 디펜던시를 추가하여 사용해주세요.

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

그리고 `src/storybook.test.js`을 아래와 같이 생성합니다.

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

이제 `yarn test` 명령어를 실행하여 테스트를 실행할 수 있습니다.

![Task 테스트 러너](/intro-to-storybook/task-testrunner.png)

`Task` 스토리를 위한 스냅샷 테스트를 만들어 보았습니다. 만약 `Task`의 구현을 변경하게 되면, 변경 사항을 확인하라는 메시지가 표시될 것입니다.
