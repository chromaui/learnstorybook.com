---
# title: 'Testing user flows'
title: '사용자 플로우(user flow) 테스트하기'
# tocTitle: 'User flow'
tocTitle: '사용자 플로우(user flow)'
# description: 'Verify that your UI works end-to-end'
description: 'UI가 전체적으로 작동하는지 확인해보세요'
commit: ''
---

프로덕션에서 디버깅하는 것은 악몽입니다. 우리의 앱의 모든 레이어를 체크해야합니다. 컴포넌트 버그, 오류가 발생하는 이벤트, 스타일링, 앱 상태가 있거나 혹은 API가 깨졌나요? 이러한 경우 중 어떤 것이든 발생할 수 있고, 우리는 그 이유를 풀어내야 합니다.

<!-- Debugging in production is a nightmare. You have to check every layer of your app. Is it a component bug, a misfiring event, styling, app state, or perhaps a broken API? It could be any of the above, and you have to untangle why. -->

UI는 목표를 달성하기 위해 여러 페이지에서 일련의 단계를 탐색하도록 도와줍니다. 지금까지 Storybook에서 각 페이지를 쉽게 분리하고 [시각적 요소](../visual-testing), [접근성](../accessibility-testing) 및 [상호작용](../interaction-testing) 테스트를 실행하는 방법을 살펴보았습니다. 그러나 전체적인 흐름을 검증하고 통합 문제들을 파악하려면, E2E(End-to-End) UI 테스트가 필요합니다.

<!-- UIs help folks navigate a sequence of steps on multiple pages to accomplish their goals. So far, we've seen how Storybook makes it easy to isolate each of those pages and run [visual](../visual-testing), [accessibility](../accessibility-testing) and [interaction](../interaction-testing) tests on them. But to verify the entire flow and catch integration issues, you need end-to-end (E2E) UI tests. -->

## UI가 전체적으로 작동하나요?
<!-- ## Does your UI work end-to-end? -->

사용자 흐름은 하나의 컴포넌트에만 포함되는 것이 아니라 여러 구성 요소가 함께 작동해야 합니다. 각 상호 작용은 상태 업데이트, 경로 변경 및 API 호출을 발생시켜 화면에 렌더링되는 내용에 영향을 미칩니다. 이러한 모든 장애 지점을 일일이 QA하는 것은 어려울 수 있습니다.

<!-- User flows aren’t contained to only one component, they involve multiple components working in tandem. Each interaction triggers state updates, route changes, and API calls that affect what’s rendered on screen. With all of these points of failure, it can be tough to QA them one-by-one. -->

팀은 E2E 테스트를 사용하여 사용자 경험이 의도한 대로 작동하는지 확인합니다. E2E 테스트를 실행하려면 응용 프로그램의 전체 인스턴스를 가동시키는 것부터 시작합니다. 그런 다음 [Cypress](https://cypress.io), [Playwright](https://ww.selenium.dev/) 또는 [Selenium](https://ww.selenium.dev/documentation/webdriver/)과 같은 도구를 사용하여 사용자 동작을 시뮬레이션하여 사용자 흐름을 확인합니다.

<!-- Teams use E2E tests to ensure that the user experience works as intended. To run an E2E test, you start by spinning up a complete instance of an application. Then use tools like [Cypress](https://cypress.io), [Playwright](https://playwright.dev/), or [Selenium](https://www.selenium.dev/documentation/webdriver/) to verify the user flow by simulating user behavior. -->

<figure>
  <img src="/ui-testing-handbook/e51e5f6924e48ea1bdbf-edgar.scraping-component-driven-stack-component-white.gif" />
  <figcaption>앱은 컴포넌트를 데이터, 비즈니스 논리 및 API에 연결하여 결합됩니다. </figcaption>
  <!-- <figcaption>Apps are assembled by connecting components to data, business logic and APIs</figcaption> -->
</figure>

### 전체 애플리케이션 테스트는 절충을 수반합니다

<!-- ### Testing the complete application comes with trade-offs -->

표면적으로는 E2E와 [상호작용 테스트](../interaction-testing)이 상당히 유사한 것으로 보입니다. 그러나 사용자는 UI 컴포넌트뿐만 아니라 전체 앱과 상호작용합니다. E2E 테스트는 애플리케이션 수준에서 실행되며, 이를 통해 프런트엔드와 백엔드 간의 통합 문제를 발견할 수 있습니다. 그러나 이를 위해서는 기술 스택의 더 많은 계층에 대한 테스트 인프라를 유지해야 합니다(이는 시간 소모적입니다!).
<!-- On the surface, E2E and [interaction tests](../interaction-testing) seem pretty similar. But remember, your users interact with the entire app and not just the UI components. E2E tests run at the app level, which allows them to uncover integration issues between the frontend and backend. But that also requires you to maintain test infrastructure for more layers of your tech stack (time-consuming!). -->

컴포넌트 레벨 테스트는 컴포넌트를 마운트, 렌더링 및 테스트할 수 있는 자체 도구에 의해 수행됩니다. E2E 테스트의 경우, 애플리케이션를 가동하는 것은 _우리의 책임입니다._ 이 때, 두 가지 옵션이 주어집니다 - 
<!-- Component level testing is done by self-contained tools which can mount, render and test components. With E2E tests, _you're responsible_ for spinning up the application. For which, you have two options: -->

1.  **전체 테스트 환경을 유지**: 여기에는 프런트엔드, 백엔드, 서비스 및 시드 테스트 데이터가 포함됩니다. 예를 들어, O'Reilly 팀은 Docker를 사용하여 전체 앱 인프라를 가동하고 E2E 테스트를 실행합니다.
<!-- 1.  **Maintain a full test environment**: this includes front-end, back-end, services, and seeded test data. For example, the O'Reilly team uses Docker to spin up their entire app infrastructure and run E2E tests. -->
2.  **모형 백엔드와 짝지어진 프런트엔드 전용 테스트 환경을 유지** 예를 들어, Twilio는 네트워크 요청을 무시하기 위해 Cypress를 사용하여 흐름을 테스트합니다.
<!-- 2.  **Maintain a front-end only test environment** paired with a mock back-end**.** For example, Twilio tests flows by using Cypress to stub out network requests. -->

어느 쪽이든 시스템 규모에 따라 복잡도가 증가합니다. 시스템이 클수록 지속적인 통합 서버에서 설정을 복제한 다음 클라우드 브라우저에 연결하여 테스트를 실행해야 하는 번거로움이 커집니다.
<!-- Either way, the complexity ramps up with the scale of your system. The larger the system the more cumbersome it is to replicate the setup on a continuous integration server and then connect to a cloud browser to run the tests. -->

이러한 절충안을 고려할 때, 대부분의 팀들은 노력과 가치의 균형을 맞추기 위해 하이브리드 방식을 사용합니다. E2E 테스트는 중요한 사용자 흐름에만 제한적으로 사용되며 상호작용 테스트는 다른 모든 동작을 확인하는 데 사용됩니다.
<!-- Given this trade-off, most teams use a hybrid approach to balance effort and value. E2E tests are limited to only critical user flows and interaction tests are used to verify all other behavior. -->

이 튜토리얼에서는 모형 백엔드로 Cypress를 사용하여 E2E 테스트를 하고 있습니다. 워크플로우 요약은 다음과 같습니다.
<!-- In this tutorial, we’re E2E testing using Cypress with the mocked back-end approach. Here's a summary of the workflow: -->

1.  ⚙️ **설정:** 응용 프로그램을 가동하고 mock 네트워크를 요청 (스토리의 데이터를 재사용해보세요)
2.  **🤖 실행:** Cypress를 사용해 페이지를 방문하고 상호 작용을 시뮬레이션
3.  ✅ **명령(선언)을 실행** UI가 올바르게 업데이트되었는지 확인
<!-- 1.  ⚙️ **Setup:** spin up the application and mock network requests (reuse data from stories)
2.  **🤖 Action:** use Cypress to visit pages and simulate interactions
3.  ✅ **Run assertions** to verify that the UI updated correctly -->

## 튜토리얼 - 인증 플로우 테스트 하기
<!-- ## Tutorial: testing the authentication flow -->

인증 플로우에 대한 E2E 테스트를 작성하겠습니다. 로그인 페이지로 이동하여 사용자 자격 증명을 입력합니다. 인증이 완료되면 사용자는 작업 목록을 볼 수 있습니다.
<!-- We’ll write an E2E test for the authentication flow: navigate to the login page and fill in the user credentials. Once authenticated, the user should be able to see a list of their tasks. -->

<figure style="display: flex;">
  <img style="flex: 1 1 auto; min-width: 0; margin-right: 0.5em;" src="/ui-testing-handbook/login-screen.png" alt="login page" />
  <img style="flex: 1 1 auto; min-width: 0;" src="/ui-testing-handbook/taskbox.png" alt="inbox page" />
</figure>

`yarn start`를 실행하여 개발 모드로 앱을 시작합니다. 그런 다음 [http://localhost:3000](http://localhost:3000/)을 열면 로그인 화면이 나타납니다.
<!-- Start the app in development mode by running `yarn start`. Then open [http://localhost:3000](http://localhost:3000/) and you’ll be presented with the login screen. -->

### Cypress 설정
<!-- ### Set up Cypress -->

`yarn add sypress --dev`를 실행하여 Cypress 패키지를 설치합니다. 그런 다음 `package.json` 파일의 스크립트 필드에 Cypress 명령을 추가합니다.
<!-- Run: `yarn add cypress --dev` to install the Cypress package. Then add the Cypress command to the scripts field of your `package.json` file. -->

```json:title=package.json
 "scripts": {
   "cypress": "cypress open"
 }
```
다음으로 프로젝트의 루트에 `cypress.json` 파일을 추가하세요. 여기서는 실제 테스트 명령을 작성할 때 반복할 필요가 없도록 애플리케이션의 기본 URL을 구성할 수 있습니다.
<!-- Next, add a `cypress.json` file at the root of your project. Here we can configure the base URL for our application so that we don’t have to repeat ourselves when writing out actual test commands. -->

```json:title=cypress.json
{
  "baseUrl": "http://localhost:3000"
}
```

그리고 마지막으로 `yarn cypress`을 실행해 설치 과정을 마칩니다. 그러면 프로젝트에 `cypress` 폴더가 추가될 것입니다. 모든 테스트 파일은 여기에 보관될 것입니다. 또한 Cypress 테스트 실행을 시작하게 할 수 있습니다.
<!-- And finally, run `yarn cypress` to finish up the setup process. This will add a `cypress` folder to your project. All the test files will live here. It will also start the Cypress test runner. -->

### 인증 플로우 테스트
<!-- ### Testing the auth flow -->

Cypress 테스트 구조는 우리에게 익숙할 수 있는 다른 유형의 테스트들과 상당히 유사합니다. 무엇을 테스트할 지 설명하는 것부터 시작합니다. 각 테스트는 명령들을 실행하는 `it` 블록 안에 있습니다. 인증 사용자 플로우는 다음과 같습니다 - 
<!-- Cypress test structure is quite similar to other types of testing you might be familiar with. You start by describing what you’re going to test. Each test lives in an `it` block where you run assertions. Here’s what the authentication user flow test looks like: -->

```javascript:title=cypress/e2e/auth.spec.js
describe('The Login Page', () => {
  it('user can authenticate using the login form', () => {
    const email = 'alice.carr@test.com';
    const password = 'k12h1k0$5;lpa@Afn';

    cy.visit('/');

    // Form 채우기
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(`${password}`);

    // sign-in 버튼 클릭하기
    cy.get('button[type=submit]').click();

    // UI는 사용자의 task 목록을 보여줘야 합니다.
    cy.get('[aria-label="tasks"] li').should('have.length', 6);
  });
});
```

여기서 무슨 일이 벌어지는지 파헤쳐 봅시다. `cy.visit`는 브라우저를 열어 애플리케이션의 로그인 페이지로 갑니다. 그런 다음 `cy.get` 명령을 이용해 이메일과 비밀번호 필드를 찾아 채웁니다. 마지막으로 제출 버튼을 클릭해 실제로 로그인해봅시다.
<!-- Let’s break down what’s happening here. `cy.visit` opens the browser to the login page of our application. Then we use the `cy.get` command to find and fill out the email and password fields. And finally, click the submit button to actually log in. -->

테스트의 마지막 비트는 명령들을 실행합니다. 즉, 인증이 성공했는지 여부를 확인합니다. 우리는 작업 목록이 이제는 보이는지 확인함으로써 인증 작업을 체크합니다.
<!-- The last bit of the test runs assertions. In other words, we verify whether the authentication was successful. We do this by checking to see if the list of tasks is now visible. -->

Cypress 창으로 전환하고 테스트가 실행되는지 확인해봅시다.
<!-- Switch over to the Cypress window and you should see that the test is executed. -->

![](/ui-testing-handbook/cypress-error.png)

하지만, 그 테스트는 실패했다는 것을 알아두세요. 그 이유는 우리가 애플리케이션의 프런트엔드 부분만 실행하고 있기 때문입니다. 활동 중인 백엔드가 없기 때문에 모든 HTTP요청이 실패할 것입니다. 실제 백엔드를 가동하는 대신 무시된 네트워크 요청을 사용할 것 입니다.
<!-- But, notice that the test failed. That’s because we’re only running the front-end of the application. All HTTP requests will fail since we don’t have an active back-end. Instead of spinning up the actual back-end we’ll use stubbed network requests. -->

### Mock 요청하기
<!-- ### Mocking requests -->

`cy.intercept` method는 네트워크 요청을 가로채고 mock 데이터로 대응할 수 있게 해줍니다. 사용자 인증 플로우는 로그인하는 `/authenticate`와 사용자의 작업을 가져오는 `/tasks`의 두 가지 요청에 의존합니다. 이 요청들을 막으려면 mock 데이터가 필요합니다.
<!-- The `cy.intercept` method allows us to intercept network requests and respond with mock data. The auth user flow relies on two requests: `/authenticate` to log in and `/tasks` to fetch the user’s tasks. To stub these requests we're gonna need some mock data. -->

[composition testing chapter](../composition-testing/)에서, 작업 목록 스토리들에 대한 mock 데이터를 만들었습니다. 이제 Cypress 테스트에서 데이터를 재사용하겠습니다.
<!-- In the [composition testing chapter](../composition-testing/), we created mock data for the task list stories. We'll now reuse that in our Cypress test. -->

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
<!-- Let’s go ahead and update the test to mock those two network requests. -->

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
<!-- Re-run the test and it should be passing now. -->

![](/ui-testing-handbook/cypress-success.png)

우리는 전체 애플리케이션을 부팅하고 사용자 행동을 시뮬레이션하고 Cypress로 로그인 플로우를 테스트했습니다. 이 하나의 테스트에서는 데이터 플로우, 양식 제출 및 API 호출을 확인했습니다.
<!-- We booted up the entire application and simulated user behaviour and tested the login flow with Cypress. In this one test, we checked data flow, form submission and API calls. -->

## UI 테스트 자동화
<!-- ## Automating UI tests -->

테스트는 일관되게 실행하는 경우에만 유용합니다. 최고의 엔지니어링 팀은 CI(Continuous Integration) 서버를 사용하여 모든 코드를 push해서 전체 테스트 세트를 자동으로 실행합니다. 지금까지 5가지 유형의 테스트에 대해 설명했으며, 다음 장에서는 테스트 실행을 자동화하는 방법에 대해 설명합니다.
<!-- Tests are only helpful if you are running them consistently. Leading engineering teams use a Continuous Integration (CI) server to run their full test suite—automatically on every code push. We've covered five different types of testing, and the next chapter will show you how to automate their execution. -->
