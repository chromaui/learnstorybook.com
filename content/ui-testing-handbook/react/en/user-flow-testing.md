---
title: 'Testing user flows'
tocTitle: 'User flow testing'
description: 'Verify that your UI works end-to-end'
commit: '84af22d'
---

Debugging in production is a nightmare. You have to check every layer of your app. Is it a component bug, a misfiring event, styling, app state, or perhaps a broken API? It could be any of the above, and you have to untangle why.

UIs help folks navigate a sequence of steps on multiple pages to accomplish their goals. So far, we've seen how Storybook makes it easy to isolate each of those pages and run [visual](../visual-testing), [accessibility](../accessibility-testing) and [interaction](../interaction-testing) tests on them. But to verify the entire flow and catch integration issues, you need end-to-end (E2E) UI tests.

## Does your UI work end-to-end?

User flows aren’t contained to only one component, they involve multiple components working in tandem. Each interaction triggers state updates, route changes, and API calls that affect what’s rendered on screen. With all of these points of failure, it can be tough to QA them one-by-one.

Teams use E2E tests to ensure that the user experience works as intended. To run an E2E test, you start by spinning up a complete instance of an application. Then use tools like Cypress, Playwright, or Selenium to verify the user flow by simulating user behavior.

<figure>
  <img src="/ui-testing-handbook/e51e5f6924e48ea1bdbf-edgar.scraping-component-driven-stack-component-white.gif" />
  <figcaption>Apps are assembled by connecting components to data, business logic and APIs</figcaption>
</figure>

<!-- ![](/ui-testing-handbook/e51e5f6924e48ea1bdbf-edgar.scraping-component-driven-stack-component-white.gif) -->

### Testing the complete application comes with trade-offs

On the surface, E2E and [interaction tests](../interaction-testing) seem pretty similar. But remember, your users interact with the entire app and not just the UI components. E2E tests run at the app level, which allows them to uncover integration issues between the frontend and backend. But that also requires you to maintain test infrastructure for more layers of your tech stack (time-consuming!).

Component level testing is done by self-contained tools which can mount, render and test components. With E2E tests, _you're responsible_ for spinning up the application. For which, you have two options:

1.  **Maintain a full test environment**: this includes front-end, back-end, services, and seeded test data. For example, the O'Reilly team uses Docker to spin up their entire app infrastructure and run E2E tests.
2.  **Maintain a front-end only test environment** paired with a mock back-end**.** For example, Twilio tests flows by using Cypress to stub out network requests.

Either way, the complexity ramps up with the scale of your system. The larger the system the more cumbersome it is to replicate the setup on a continuous integration server and then connect to a cloud browser to run the tests.

Given this trade-off, most teams use a hybrid approach to balance effort and value. E2E tests are limited to only critical user flows and interaction tests are used to verify all other behavior.

In this tutorial, we’re E2E testing using Cypress with the mocked back-end approach. Here's a summary of the workflow:

1.  ⚙️ **Setup:** spin up the application and mock network requests (reuse data from stories)
2.  **🤖 Action:** use Cypress to visit pages and simulate interactions
3.  ✅ **Run assertions** to verify that the UI updated correctly

## Tutorial: testing the authentication flow

We’ll write an E2E test for the authentication flow: navigate to the login page and fill in the user credentials. Once authenticated, the user should be able to see a list of their tasks.

<figure style="display: flex;">
  <img style="flex: 1 1 auto; min-width: 0; margin-right: 0.5em;" src="/ui-testing-handbook/login-screen.png" alt="login page" />
  <img style="flex: 1 1 auto; min-width: 0;" src="/ui-testing-handbook/taskbox.png" alt="inbox page" />
</figure>

Start the app in development mode by running `yarn start`. Then open [http://localhost:3000](http://localhost:3000/) and you’ll be presented with the login screen.

### Set up Cypress

Run: `yarn add cypress --dev` to install the Cypress package. Then add the Cypress command to the scripts field of your `package.json` file.

```json:title=package.json
 "scripts": {
   "cypress": "cypress open"
 }
```

Next, add a `cypress.json` file at the root of your project. Here we can configure the base URL for our application so that we don’t have to repeat ourselves when writing out actual test commands.

```json:title=cypress.json
{
  "baseUrl": "http://localhost:3000"
}
```

And finally, run `yarn cypress` to finish up the setup process. This will add a `cypress` folder to your project. All the test files will live here. It will also start the Cypress test runner.

### Testing the auth flow

Cypress test structure is quite similar to other types of testing you might be familiar with. You start by describing what you’re going to test. Each test lives in an `it` block where you run assertions. Here’s what the authentication user flow test looks like:

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

Let’s break down what’s happening here. `cy.visit` opens the browser to the login page of our application. Then we use the `cy.get` command to find and fill out the email and password fields. And finally, click the submit button to actually log in.

The last bit of the test runs assertions. In other words, we verify whether the authentication was successful. We do this by checking to see if the list of tasks is now visible.

Switch over to the Cypress window and you should see that the test is executed.

![](/ui-testing-handbook/cypress-error.png)

But, notice that the test failed. That’s because we’re only running the front-end of the application. All HTTP requests will fail since we don’t have an active back-end. Instead of spinning up the actual back-end we’ll use stubbed network requests.

### Mocking requests

The `cy.intercept` method allows us to intercept network requests and respond with mock data. The auth user flow relies on two requests: `/authenticate` to log in and `/tasks` to fetch the user’s tasks. To stub these requests we're gonna need some mock data.

In the [composition testing chapter](../composition-testing/), we created mock data for the task list stories. We'll now reuse that in our Cypress test.

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

Let’s go ahead and update the test to mock those two network requests.

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

Re-run the test and it should be passing now.

![](/ui-testing-handbook/cypress-success.png)

We booted up the entire application and simulated user behaviour and tested the login flow with Cypress. In this one test, we checked data flow, form submission and API calls.

## Automating UI tests

Tests are only helpful if you are running them consistently. Leading engineering teams use a Continuous Integration (CI) server to run their full test suite—automatically on every code push. We've covered five different types of testing, and the next chapter will show you how to automate their execution.
