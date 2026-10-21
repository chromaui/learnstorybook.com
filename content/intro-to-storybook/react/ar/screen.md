---
title: 'أنشئ واجهة'
tocTitle: 'واجهات'
description: 'أنشئ واجهة من المكونات'
commit: '12a7932'
---

<div style="direction: rtl">

ركزنا على بناء الواجهات من الأسفل لأعلى; عن طريق البدأ بشكل صغير ثم إضافة التعقيدات. هذا مكننا من تطوير كل مكون في منعزل, تحديد بياناته, والتلاعب به في ستوريبوك. كل ذلك دون الحاجة لخادم أو بناء واجهات.

في هذا الفصل سنستمر في إضافة مستوى تعقيدي بدمج المكونات في واجهة وتطوير تلك الواجهة في ستوريبوك

## مكونات حاوية متداخلة

بما أن تطبيقنا بسيط فإن بناء واجهاتنا سيكون سهلا, مجرد تغليف مكون `TaskList` (الذي يقوم بتزويد بياناته الخاصة عن طريق ريدكس) في نسق وإضافة خانة خطأ `error` من ريدكس (لنعتبر أننا سنملأ هذه الخانة في حالة مواجهتنا لمشكلة في الاتصال بخادمنا). قم بإنشاء `InboxScreen.js` في مجلد `components`:

<div style="direction: ltr">

```js:title=src/components/InboxScreen.js
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  /** The error message */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

</div>

سنغير أيضا مكون `App` ليٌظهر `InboxScreen` (سنستخدم في النهاية موجه لاختيار الواجهة الصحيحة, ولكن سنقوم بذلك في وقت آخر):

<div style="direction: ltr">

```js:title=src/App.js
import { Provider } from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

import './index.css';

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
export default App;
```

</div>

.إظهار الستوري في ستوريبوك هو حيث تصبح الأمور مثيرة للإهتمام

كما رأينا سابقا, مكون `TaskList` هو **حاوية** تظهر المكون المظهري `PuteTaskList`. حسب التعريف, المكونات الحاوية لا يمكنها ان تظهر في عزلة; تتوقع هذه المكونات استلام سياق أو الاتصال بخدمة. هذا يعني أن لكي تظهر حاوية في ستوريبوك, يجب تزييف (أي استخدام نسخة غير حقيقية) السياق أو الخدمة التي تتطلبها.

تمكنا عند وضع `TaskList` في ستوريبوك من تجنب هذه المشكلة بإظهار `PureTaskList` وتفادي الحاوية. سنقوم بالأمر ذاته للإظهار `PureInboxScreen` في ستوريبوك.

و لكن لدينا مشكلة لأن بالرغم أن `PureInboxScreen` مظهري بحد ذاته فإن المكون التابع `TaskList` ليس كذلك. أي كأنما المكون `PureInboxScreen` تلوث عندما تحول إلى "حاوية". لذلك عند إعداد ستوريز خاصتنا في `InboxScreen.stories.js`:

<div style="direction: ltr">

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

</div>

يتضح لنا أنه بالرغم من أن ستوري `error` تعمل دون مشاكل, فإنه لدينا مشكلة في ستوري `default` لأن `TaskList` ليس لديها مخزن ريدكس لتتصل به. (ستواجه مشاكل مشابهة عند اختبار `PureInboxScreen` باختبار وحدة)

![صندوق بريد عاطل](/intro-to-storybook/broken-inboxscreen.png)

أحدى الطرق لحل هذه المشكلة هي بتجنب إظهار المكون الحاوية في أي مكان في تطبيقنا إلا في مستوى عال وتمرير متطلبات البيانات عوضا عن ذلك لأسفل هيكل المكون.

و لكن المطورين **سوف** يحتاجون إلى إظهار مكونات خلال هيكل المكون. لو أردنا إظهار معظم أو كل التطبيق في ستوريبوك (نحن بالفعل نريد ذلك!) فإننا سنحتاج لحل لهذه المشكلة.

<div class="aside">
💡 كملاحظة جانبية, تمرير البيانات لأسفل التسلسل الهرمي هو الطريقة الصحيحة, خاصة عند استخدام <a href="http://graphql.org/">GraphQL</a>. فهي الطريقة التي بنينا بها <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> مع +800 ستوري.
</div>

## تزويد السياق والمزينات

الخبر الجيد هو أنه من السهل تمرير مخزن ريدكس إلى `InboxScreen` في ستوري! يمكننا بكل بساطة استخدام نسخة مزيفة من مخزن ريدكس مقدمة في مزين:

<div style="direction: ltr">

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';
+ import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';

+ import { action } from '@storybook/addon-actions';

+ import * as TaskListStories from './TaskList.stories';

+ // A super-simple mock of a redux store
+ const store = {
+   getState: () => {
+    return {
+      tasks: TaskListStories.Default.args.tasks,
+    };
+   },
+   subscribe: () => 0,
+   dispatch: action('dispatch'),
+ };

export default {
  component: PureInboxScreen,
+ decorators: [story => <Provider store={store}>{story()}</Provider>],
  title: 'InboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

</div>

توجد طرق أخرى لتزويد سياق مزيف لمكتبات بيانات أخرى. مثل [أبولو](https://www.npmjs.com/package/apollo-storybook-decorator), [ريلاي](https://github.com/orta/react-storybooks-relay-container) وأخرين.

التنقل بين الحالات في ستوريبوك يسهل اختبار ما إذا ما قمنا به صحيح أم لا:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## التطوير القائم على المكون

بدأنا من أسفل لأعلى مع `Task`ثم `TaskList`, الأن لدينا واجهة استخدام كاملة. `InboxScreen` خاصتنا يتشكل من مكون حاوية متداخل ويحتوي على الستوريز التابعة له

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**التطوير القائم على المكون**](https://www.componentdriven.org/) تسمح لك توسيع مستوى التعقيد بشكل متدرج كلما تتقدم في السلسلة الهرمية للمكونات. إحدى فوائدها هي مستوى تركيز أعلى في نهج التطوير وتغطية أعلى لكل التغييرات المحتملة على واجهة المستخدم. باختصار هذه المنهجية تسمح لك بناء واجهات مسخدم معقدة وذات جودة أعلى

لم ننته بعد - العمل لا ينتهي عند الانتهاء من بناء واجهة المستخدم. نحتاج أيضا للتأكد أنها تبقى متينة عبر الوقت.

<div class="aside">
💡 لا تنسى تنفيذ هذه التغييرات إلى git
</div>

</div>
