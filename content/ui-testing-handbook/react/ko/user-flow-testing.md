---
title: '사용자 플로우(user flow) 테스트하기'
tocTitle: '사용자 플로우(user flow)'
description: 'UI가 전체적으로 작동하는지 확인해보세요'
commit: ''
---

프로덕션(production)에서 디버깅하는 것은 악몽입니다. 우리의 앱의 모든 레이어를 체크해야합니다. 문제가 발생한 곳이 컴포넌트 버그인가요? 혹은 오발된 이벤트, 스타일링, 앱 상태인가요? 버그는 이들 중 어떤 곳에서든 발생할 수 있고, 우리는 그 이유를 풀어내야 합니다.

UI는 목표를 달성하기 위해 여러 페이지에서 일련의 단계를 탐색하도록 도와줍니다. 지금까지 스토리북(Storybook)에서 각 페이지를 쉽게 분리하고 [시각적 요소](../visual-testing), [접근성](../accessibility-testing) 및 [상호작용](../interaction-testing) 테스트를 실행하는 방법을 살펴보았습니다. 그러나 전체적인 흐름을 검증하고 통합 문제들을 파악하려면, E2E(End-to-End) UI 테스트가 필요합니다.

## UI가 전체적으로 작동하나요?

사용자 흐름은 하나의 컴포넌트에만 포함되는 것이 아니라 여러 구성 요소가 함께 작동해야 합니다. 각 상호 작용은 상태 업데이트, 경로 변경 및 API 호출을 발생시켜 화면에 렌더링되는 내용에 영향을 미칩니다. 이러한 모든 장애 지점을 일일이 QA하는 것은 어려울 수 있습니다.

팀은 E2E 테스트를 사용하여 사용자 경험이 의도한 대로 작동하는지 확인합니다. E2E 테스트를 실행하려면 응용 프로그램의 전체 인스턴스를 가동시키는 것부터 시작합니다. 그런 다음 [Cypress](https://cypress.io), [Playwright](https://ww.selenium.dev/) 또는 [Selenium](https://ww.selenium.dev/documentation/webdriver/)과 같은 도구를 사용하여 사용자 동작을 시뮬레이션하여 사용자 흐름을 확인합니다.

<figure>
  <img src="/ui-testing-handbook/e51e5f6924e48ea1bdbf-edgar.scraping-component-driven-stack-component-white.gif" />
  <figcaption>앱은 컴포넌트를 데이터, 비즈니스 논리 및 API에 연결하여 결합됩니다. </figcaption>
</figure>

### 전체 애플리케이션 테스트는 절충을 수반합니다

표면적으로는 E2E와 [상호작용 테스트](../interaction-testing)이 상당히 유사한 것으로 보입니다. 그러나 사용자는 UI 컴포넌트뿐만 아니라 전체 앱과 상호작용합니다. E2E 테스트는 애플리케이션 수준에서 실행되며, 이를 통해 프론트엔드와 백엔드 간의 통합 문제를 발견할 수 있습니다. 그러나 이를 위해서는 기술 스택의 더 많은 계층에 대한 테스트 인프라를 유지해야 합니다(이는 시간 소모적입니다!).

컴포넌트 레벨 테스트는 컴포넌트를 마운트, 렌더링 및 테스트할 수 있는 자체 도구에 의해 수행됩니다. E2E 테스트의 경우, 애플리케이션를 가동하는 것은 _우리의 책임입니다._ 이 때, 두 가지 옵션이 주어집니다 - 

1.  **전체 테스트 환경을 유지**: 여기에는 프런트엔드, 백엔드, 서비스 및 시드 테스트 데이터가 포함됩니다. 예를 들어, O'Reilly 팀은 Docker를 사용하여 전체 앱 인프라를 가동하고 E2E 테스트를 실행합니다.

2.  **모의 백엔드와 짝지어진 프런트엔드 전용 테스트 환경을 유지** 예를 들어, Twilio는 네트워크 요청을 모사하기 위해 사이프레스(Cypress)를 사용하여 흐름을 테스트합니다.

어느 쪽이든 시스템 규모에 따라 복잡도가 증가합니다. 시스템이 클수록 지속적인 통합 서버에서 설정을 복제한 다음 클라우드 브라우저에 연결하여 테스트를 실행해야 하는 번거로움이 커집니다.

이러한 장단점을 고려할 때, 대부분의 팀들은 노력과 가치의 균형을 맞추기 위해 하이브리드 방식을 사용합니다. E2E 테스트는 중요한 사용자 흐름에만 제한적으로 사용되며 상호작용 테스트는 다른 모든 동작을 확인하는 데 사용됩니다.

이 튜토리얼에서는 모의 백엔드와 사이프레스를 사용하여 E2E 테스트를 수행합니다. 작업 흐름의 요약은 다음과 같습니다.

1.  ⚙️ **설정:** 응용 프로그램을 가동하고 모의(mock) 네트워크를 요청 (스토리의 데이터를 재사용해보세요)
2.  **🤖 실행:** 사이프레스를 사용해 페이지를 방문하고 상호 작용을 시뮬레이션
3.  ✅ **명령(선언)을 실행** UI가 올바르게 업데이트되었는지 확인

## 튜토리얼 - 인증 플로우 테스트 하기

인증 플로우에 대한 E2E 테스트를 작성하겠습니다. 로그인 페이지로 이동하여 사용자 자격 증명을 입력합니다. 인증이 완료되면 사용자는 작업 목록을 볼 수 있습니다.

<figure style="display: flex;">
  <img style="flex: 1 1 auto; min-width: 0; margin-right: 0.5em;" src="/ui-testing-handbook/login-screen.png" alt="로그인 페이지" />
  <img style="flex: 1 1 auto; min-width: 0;" src="/ui-testing-handbook/taskbox.png" alt="받은 편지함 페이지" />
</figure>

`yarn start`를 실행하여 개발 모드로 앱을 시작합니다. 그런 다음 [http://localhost:3000](http://localhost:3000/)을 열면 로그인 화면이 나타납니다.

### 사이프레스(Cypress) 설정

`yarn add -D cypress`를 실행하여 사이프레스 패키지를 설치합니다. 그런 다음 `package.json` 파일의 스크립트 필드에 Cypress 명령을 추가합니다.

```json:title=package.json
 "scripts": {
   "cypress": "cypress open"
 }
```
다음으로 프로젝트의 루트에 `cypress.json` 파일을 추가하세요. 여기서는 실제 테스트 명령을 작성할 때 반복할 필요가 없도록 애플리케이션의 기본 URL을 구성할 수 있습니다.

```json:title=cypress.json
{
  "baseUrl": "http://localhost:3000"
}
```

그리고 마지막으로 `yarn cypress`을 실행해 설치 과정을 마칩니다. 그러면 프로젝트에 `cypress` 폴더가 추가될 것입니다. 모든 테스트 파일은 여기에 보관될 것입니다. 또한 사이프레스 테스트 실행을 시작하게 할 수 있습니다.

### 인증 플로우 테스트

사이프레스 테스트 구조는 우리에게 익숙할 수 있는 다른 유형의 테스트들과 상당히 유사합니다. 무엇을 테스트할 지 설명하는 것부터 시작합니다. 각 테스트는 명령들을 실행하는 `it` 블록 안에 있습니다. 인증 사용자 플로우는 다음과 같습니다 - 

```javascript:title=cypress/e2e/auth.spec.js
describe('The Login Page', () => {
  it('user can authenticate using the login form', () => {
    const email = 'alice.carr@test.com';
    const password = 'k12h1k0$5;lpa@Afn';

    cy.visit('/');

    // Fill out the form
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(`${password}`);

    // Click the sign-in button
    cy.get('button[type=submit]').click();

    // UI should display the user's task list
    cy.get('[aria-label="tasks"] li').should('have.length', 6);
  });
});
```

여기서 무슨 일이 벌어지는지 파헤쳐 봅시다. `cy.visit`는 브라우저를 열어 애플리케이션의 로그인 페이지로 갑니다. 그런 다음 `cy.get` 명령을 이용해 이메일과 비밀번호 필드를 찾아 채웁니다. 마지막으로 제출 버튼을 클릭해 실제로 로그인을 수행합니다.

테스트의 마지막 부분은 검증하는 과정입니다. 즉, 인증이 성공했는지 여부를 확인합니다. 우리는 작업 목록이 이제는 보이는지 확인함으로써 인증 작업을 체크합니다.

사이프레스 창으로 전환하고 테스트가 실행되는지 확인해봅시다.

![](/ui-testing-handbook/cypress-error.png)

하지만, 위의 테스트는 실패했다는 것을 알아두세요. 그 이유는 우리가 애플리케이션의 프론트엔드 부분만 실행하고 있기 때문입니다. 가동 중인 백엔드가 없기 때문에 모든 HTTP요청이 실패할 것입니다. 실제 백엔드를 가동하는 대신 모의 네트워크 요청을 사용할 것 입니다.

### 요청을 모의하기

`cy.intercept` 메소드(method)는 네트워크 요청을 가로채고 모의 데이터로 대응할 수 있게 해줍니다. 사용자 인증 플로우는 로그인하는 `/authenticate`와 사용자의 작업을 가져오는 `/tasks`의 두 가지 요청에 의존합니다. 이 요청들을 막으려면 모의 데이터가 필요합니다.

[composition 테스트 장](../composition-testing/)에서, 작업 목록 스토리들에 대한 모의 데이터를 만들었습니다. 이 데이터를 사이프레스 테스트에서 재사용하겠습니다.

```javascript:title=TaskList.stories.js
import React from 'react';
import { TaskList } from './TaskList';
import Task from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  argTypes: {
    ...Task.argTypes,
  },
};
const Template = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  tasks: [
    { id: '1', state: 'TASK_INBOX', title: 'Build a date picker' },
    { id: '2', state: 'TASK_INBOX', title: 'QA dropdown' },
    {
      id: '3',
      state: 'TASK_INBOX',
      title: 'Write a schema for account avatar component',
    },
    { id: '4', state: 'TASK_INBOX', title: 'Export logo' },
    { id: '5', state: 'TASK_INBOX', title: 'Fix bug in input error state' },
    { id: '6', state: 'TASK_INBOX', title: 'Draft monthly blog to customers' },
  ],
};
```

계속해서 두 개의 네트워크 요청을 모의로 만들기 위해 테스트를 업데이트 합시다.

```diff:title=cypress/e2e/auth.spec.js
+ import { Default as TaskListDefault } from '../../src/components/TaskList.stories';

describe('The Login Page', () => {
+  beforeEach(() => {
+    cy.intercept('POST', '/authenticate', {
+      statusCode: 201,
+      body: {
+        user: {
+          name: 'Alice Carr',
+          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
+        },
+      },
+    });
+
+    cy.intercept('GET', '/tasks', {
+      statusCode: 201,
+      body: TaskListDefault.args,
+    });
+  });

  it('user can authenticate using the login form', () => {
    const email = 'alice.carr@test.com';
    const password = 'k12h1k0$5;lpa@Afn';

    cy.visit('/');

    // Fill out the form
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(`${password}`);

    // Click the sign-in button
    cy.get('button[type=submit]').click();

    // UI should display the user's task list
    cy.get('[aria-label="tasks"] li').should('have.length', 6);
  });
});
```

테스트를 재실행하면 이제는 테스트가 통과될 것입니다.

![](/ui-testing-handbook/cypress-success.png)

우리는 전체 애플리케이션을 가동했고, 사용자 행동을 시뮬레이션하고 사이프레스로 로그인 플로우를 테스트했습니다. 이 하나의 테스트에서는 데이터 플로우, 양식 제출 및 API 호출을 확인했습니다.

## UI 테스트 자동화

테스트는 일관되게 실행하는 경우에만 유용합니다. 최고의 엔지니어링 팀은 CI(Continuous Integration) 서버를 사용하여 매 코드가 push될 때마다 자동으로 전체 테스트 세트를 수행합니다. 지금까지 5가지 유형의 테스트에 대해 설명했으며, 다음 장에서는 테스트 실행을 자동화하는 방법에 대해 설명합니다.