---
title: 'UI 테스팅 플레이북'
tocTitle: '작업 흐름'
description: '우리를 느리게 하지 않는 테스팅 작업 흐름'
commit: ''
---

UI의 서로 다른 부분을 테스트 하는 도구를 찾기는 쉽습니다. 하지만 이 모든 걸 생산적인 작업 흐름으로 어떻게 결합하는 방법을 깨닫기는 까다롭습니다. 잘못 이해하면, 유지보수의 악몽으로 빨려들어갈 수도 있습니다.

우리의 작업 흐름은 story를 테스트 케이스로 재사용해서 유지보수 부담을 줄여줍니다. 또한 컴포넌트 수준에서 테스트해서 버그를 빨리 발견할 수 있습니다.

이 장에서는 할일을 삭제하는 기능을 추가하면서 UI testing 작업 흐름의 전체를 보여줍니다.

![](/ui-testing-handbook/workflow-ui-testing.png)

## 빌드

이 Task 컴포넌트는 이미 사용자가 할일을 수정할 수 있고, 고정할 수 있고, 보관할 수 있습니다. 이제 삭제 버튼을 추가하고, 이 버튼을 애플리케이션 상태에 연결해서 삭제 기능을 추가해보겠습니다.

![](/ui-testing-handbook/add-delete-button.png)

이 데모를 위해서, 테스트할 준비가 된 지점으로 곧장 건너뛰어봅시다. 업데이트된 파일들을 다운 받고, `/src` 디렉토리에 놓아주세요 -

- [src/components/Task.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/components/Task.js)
- [src/components/TaskList.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/components/TaskList.js)
- [src/InboxScreen.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/InboxScreen.js)
- [src/useTasks.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/useTasks.js)

### 시각적 요소와 구성 테스트

먼저, 수정된 UI의 스타일이 명세(spec)와 일치한다는 걸 보장해야 합니다. Task 컴포넌트는 이제 삭제를 다루기 위해 `onDeleteTask` prop이 필요합니다. 일단 이를 Task story에서 모의해줍니다.

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
+   onDeleteTask: { action: 'onDeleteTask' },
  },
  parameters: {
    a11y: {
 ...
```

#### 개발하는 동안

앱 전체를 실행하는 대신에, Storybook을 이용해서 오직 Task 컴포넌트에만 집중할 수 있습니다. 그 뒤에는 모든 story를 돌면서, 손으로 직접 컴포넌트의 모양을 검증할 수 있습니다.

![](/ui-testing-handbook/task-stories.gif)

#### PR 확인

Task UI를 약간 고쳤을 때, 이를 사용하는 다른 컴포넌트를 의도치 않게 변경해버릴 수도 있습니다. TaskList나 InboxScreen처럼요. Chromatic으로 시각적 요소 테스트를 실행하면 이를 잡아낼 겁니다. 이를 통해 모든 게 정확하게 연결되어 있다는 걸 보장해주기도 합니다.

Chromatic은 pull request를 만들면 자동으로 작동할 겁니다. 완료되고 나면 리뷰할 변경 사항을 보게 될 겁니다. 이 경우에는 일부러 UI를 변경했습니다. accept 버튼을 눌러서 기준점을 최신으로 업데이트해줍니다.

![](/ui-testing-handbook/workflow-visual-tests.png)

![](/ui-testing-handbook/workflow-visual-diff.png)

### 접근성 테스트

![](/ui-testing-handbook/task-a11y.gif)

#### 개발하는 동안

개발하는 동안 Storybook에서 접근성 검사를 실행해보세요. [A11y 애드온](https://storybook.js.org/addons/@storybook/addon-a11y)은 Axe를 사용해서 활성화된 story의 변경을 추적(audit)하고 애드온 패널에 리포트를 보여줍니다. 한 번 빠르게 훑어보기만 해도 우리의 story가 모두 위반사항이 없다는 걸 확인할 수 있습니다.

#### PR 확인

회귀 오류를 잡아내기 위해서는 모든 컴포넌트를 검사해야 합니다. story를 test file에 모두 import하고 [jest-axe](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40)를 이용해서 접근성 추적을 실행해주면 됩니다. 모든 위반사항은 PR 페이지로 보고될 것입니다.

![](/ui-testing-handbook/ci-a11y.png)

### 상호작용 테스트

사용자는 _쓰레기통_ 버튼을 클릭해서, 할일을 삭제할 수 있고, 이 동작을 검증하기 위해서 테스트에 추가해야 합니다.

![](/ui-testing-handbook/manual-interaction.gif)

#### 개발하는 동안

개발 중에는, InboxScreen story를 이용해서 수동으로 상호작용을 검증합니다. 기대한대로 동작한다면, Jest나 Testing Library를 이용한 상호작용 테스트를 추가하는 단계로 넘어갈 수 있습니다.

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
import { axe, toHaveNoViolations } from 'jest-axe';
import { composeStories } from '@storybook/testing-react';
import { getWorker } from 'msw-storybook-addon';
import * as stories from './InboxScreen.stories';

expect.extend(toHaveNoViolations);

describe('InboxScreen', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => getWorker().close());

  const { Default } = composeStories(stories);

  it('should pin a task', async () => { ... });
  it('should archive a task', async () => { ... });
  it('should edit a task', async () => { ... });
  it('Should have no accessibility violations', async () => { ... });

+ it('should delete a task', async () => {
+   const { queryByText, getByRole, getAllByRole } = render(<Default />);
+
+   await waitFor(() => {
+     expect(queryByText('You have no tasks')).not.toBeInTheDocument();
+   });
+
+   const getTask = () => getByRole('listitem', { name: 'Export logo' });
+
+   const deleteButton = within(getTask()).getByRole('button', {
+     name: 'delete',
+   });
+
+   fireEvent.click(deleteButton);
+
+   expect(getAllByRole('listitem').length).toBe(5);
+ });
});

```

`yarn test`를 실행해서 모든 테스트가 통과하는지 확인합니다. Jest가 어떻게 watch 모드에서 실행되며 변경된 파일과 관련된 테스트만 실행하는지 살펴보세요.
![](/ui-testing-handbook/jest.png)


#### PR 확인

PR이 만들어지면 Github Action은 Jest를 실행해서 PR 확인를 통해서 현재의 상태를 보고합니다.

![](/ui-testing-handbook/jest-ci.png)

## 사용자 흐름 테스트

마지막으로, E2E 테스트를 실행해서 모든 결정적인 사용자 흐름이 기대한대로 동작하는지 보장해야 합니다.

#### 개발하는 동안

저희가 만든 새 기능은 인증 흐름(auth flow)에는 영향을 주지 않습니다. 그래서 CI서버에서 Cypress가 실행될 때까지 기다리면 됩니다. 테스트를 추가하거나 수정했을 때에만 원하는 E2E 테스트를 실행하면 됩니다.

![](/ui-testing-handbook/auth-flow.png)

#### PR 확인

다른 모든 테스트처럼, Github Actions는 Cypress를 이용해서 E2E도 실행해줍니다.

![](/ui-testing-handbook/user-flow-ci.png)

## 모험은 시작되었습니다

**UI 테스팅 핸드북**은 프로 프론트엔드 팀이 사용하는 테스트 전략을 강조합니다. 이 테스트들은 앱의 health checks처럼 돌아가고, 눈에 보이는 겉모습부터 UI 로직을 검증할 뿐만 아니라, 심지어 통합 이슈까지 감지합니다. 게다가, 지속적 통합으로 매 commit을 자동으로 테스트하면 버그를 감소시킬 수 있습니다.

마지막 장에서는 완전한 예시 코드, 도움이 되는 자료들, 개발자들이 자주 하는 질문으로 마무리를 짓겠습니다.
