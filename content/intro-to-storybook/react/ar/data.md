---
title: 'اربط البيانات'
tocTitle: 'البياتات'
description: 'تعلم كيفية ربط البيانات مع مكون واجهة المستخدم'
commit: 'd2fca1f'
---

<div style="direction: rtl">

أنشأنا حتى الأن مكونات بدون حالة والتي تعتبر مناسبة لستوريبوك ولكن ليست ذات جدوى إلا إذا أعطيناها بعض من البيانات في تطبيقنا

هذا الدرس لا يركز على تفاصيل بناء التطبيق لذلك لن نتطرق لهذه التفاصيل. ولكن سنتوقف لحظة لنلقي نظرة على الأنماط المتداولة عند ربط البيانات مع المكونات الحاوية.

## المكونات الحاوية

مكون `TaskList` خاصتنا مكتوب في صورة مظهرية (راجع [منشور هذه المدونة](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) أي انه لا يتصل مع أي شيء خارج محيط تنفيذه. لتمرير البيانات إليه, نحتاج إلى "حاوية".

هذا المثال يستخدم [ريدكس](https://redux.js.org/), أشهر مكتبة رياكت لتخزين البيانات, لبناء نموذج بيانات بسيط لتطبيقنا. ولكن هذا النمط المستخدم يمكن تطبيقه على أي مكتبة إدارة بيانات أخرى مثل [أبولو](https://www.apollographql.com/client/) و[موب اكس](https://mobx.js.org/).

أضف التبعيات الضرورية لمشروعك عن طريق:

<div style="direction: ltr">

```bash
yarn add react-redux redux
```

</div>

سنبني أولا مخزن ريدكس يستجيب لأحداث تبدل في حالة المهام خاصتنا, في ملف تحت اسم `lib/redux.js` في مجلد `src` (أٌبقى بسيط عن قصد):

<div style="direction: ltr">

```js:title=src/lib/redux.js
// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// The reducer describes how the contents of the store change for each action
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```

</div>

سنغير بعدها في التصديرة الافتراضية من مكون `TaskList` ليتصل مع مخزن ريدكس ويٌظهر المهام التي نحن مهتمين بهم:

<div style="direction: ltr">

```js:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
}

PureTaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(PureTaskList);
```

</div>

بما أن لدينا بيانات حقيقية مأخوذة من ريدكس في مكوننا, يمكننا ربطه مع `src/app.js` وإظهار المكون هناك. ولكن لنتأخر عن ذلك ونستمر في رحلتنا المبنية عن المكون.

لا تقلق سنتعامل مع ذلك في الفصل التالي.

في هذه المرحلة, ستتوقف اختبارات ستوريبوك عن العمل لأن `TaskList` أصبح حاوية ولا يقبل خاصيات بعد الآن. تقوم `TaskList` عوضا عن ذلك بالاتصال مع المخزن وتقوم بوضع الخاصيات في مكون `PureTaskList` المحيطة به.

و لكن يمكننا حل هذه المشكلة بكل بساطة عن طريق عرض `PureTaskList` -- المكون المظهري الذي أضفناه لتونا في جملة `export` في الخطوة السابقة -- في ستوريز الخاصة بستوريبوك:

<div style="direction: ltr">

```diff:title=src/components/TaskList.stories.js
import React from 'react';

+ import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

+ const Template = args => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 مع هذا التغيير ستحتاج اللمحات خاصتك إلى تحديث, قم بإعادة تنفيذ أمر الاختبار عن طريق المؤشر <code>-u</code> لتحديثهم, ولا تنسى أيضا تنفيذ التغييرات إلى git

</div>

</div>
