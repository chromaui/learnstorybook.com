---
title: 'جمّع مكون مركب'
tocTitle: 'مكون مركب'
description: 'جمّع مكون مركب من مكونات بسيطة'
commit: 'f9b2cfb'
---

<div style="direction: rtl">

بنينا في أخر فصل مكوننا الأول; هذا الفصل يوسع مع تعلمناه لبناء قائمة مهام, قائمة بها مجموعة مهام. لندمج مكونات معا و نرى ما سيحصل عندما يتم إضافة مستوى جديد من التعقيد.

## لائحة المهام

صندوق المهام يبين المهام المثبتة بوضعهم فوق المهام الإفتراضية. هذا يكون نوعان من لائحة المهام الذان تحتاج لإنشاء ستوريز لهما: عناصر إفتراضية و عناصر مثبتة

![مهام إفتراضية و مثبتة](/intro-to-storybook/tasklist-states-1.png)

بما أن بيانات `Task` ترسل بشكل غير متزامن, سنحتاج إلى حالة تحميل للعرض خلال غياب الإتصال. إضافةً إلى ذلك سنحتاج **أيضا** إلى حالة فارغة عندما لا توجد مهام في اللائحة.

![مهام فارغة و محملة](/intro-to-storybook/tasklist-states-2.png)

## الإعداد

لا يختلف مكون مركب عن مكون بسيط من ناحية المحتوى. قم بإنشاء مكون لائحة مهام مع ملف ستوري المصاحب له: `src/components/TaskList.js` و `src/components/TaskList.stories.js`.

إبدأ بتنفيذ مبسط لـ`لائحة المهام`. ستحتاج لإستيراد مكون `Task` الذي كوناه سابقا و تمرير الخصائص و الأحداث كمدخل

<div style="direction: ltr">

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

</div>

ثم قم بإنشاء حالات إختبار `Tasklist` في ملف الستوري.

<div style="direction: ltr">

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited from the Default story in task.stories.js.
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

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> هي طريقة أغلفة مجردة للستوريز خصتنا. في هذه الحالة نستخدم `key` للـمزين او decorator مع التصديرة الإفتراضية مع بعض الـ`padding` حول المكون المُغلف. يمكن أيضا إستخدامهم لتغليف الستوريز في "providers" (يقصد بها مكون المكتبة الذي يستخدم مع رياكت context)
</div>

بإستيراد `TaskStories` نحن قادرون على [جمع](https://storybook.js.org/docs/react/writing-stories/args#args-composition) الحجج (args) في الستوريز خاصتنا بأقل جهد. بهذه الطريقة تبقى البيانات و الأحداث المتوقعة من كلتا المكونين محفوظة

تفقد الأن ستوريبوك لترى الستوريز الخاصة بـ`TaskList`

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## قم ببناء الحالة

لا يزال مكوننا في حالته المبدئية و لكننا الأن نملك فكرة عن الستوريز التي سنعمل عليها. قد تعتقد بأن الغلاف `.list-items` مفرط في البساطة. فعلا هو كذلك, غالبا لن نحتاج لإنشاء مكون جديد فقط من أجل غلاف. و لكن **التعقيد الفعلي** لمكون `TaskList` يظهر في الحالات الطرفية `withPinnedTasks`, `loading`, و `empty`.

<div style="direction: ltr">

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

</div>

نص الوصف المٌضاف يٌنتج الواجهة التالية:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

لاحظ موضع العنصر المثبت في اللائحة. نريد إظهار العنصر المثبت في أعلا الائحة لإعطائه أولوية لمستخدمينا.

## متطلبات البيانات و الدعائم

كلما نما المكون, نمت معه متطلبات الإدخال. حدد متطلبات الدعائم لـ`TaskList`. لأن `Task` هو مكون تابع, تأكد أن البيانات المعطات في حالة صحيحة للإظهار. لحفظ الجهد و الوقت, أعد إستخدام propTypes التي حددتها في `Task` سابقا.

<div style="direction: ltr">

```diff:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
}

+ TaskList.propTypes = {
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

</div>

## إختبار مميكن

في الفصل السابق تعلمنا كيفية إجراء إختبار لمحة على الستوريز خاصتنا بإستخدام Storyshots. مع `Task` لا يوجد الكثير من التقيد لإختبار أن الإظهار يجري بشكل صحيح. بما أن `TaskList` تضيف طبق أخرى من التعقيد نريد التأكد من أن بعض المدخلات تنتج إخراجات محددة بطريقة تتيح الإختبار المميكن. للقيام بذلك, سننشئئ إختبارات وحدة بإستخدام [مكتبة رياكت للإختبار](https://testing-library.com/docs/react-testing-library/intro) و [@storybook/testing-react](https://storybook.js.org/addons/@storybook/testing-react).

![شعار مكتبة الإختبار](/intro-to-storybook/testinglibrary-image.jpeg)

### إختبارات الوحدة و مكتبة إختبار رياكت

ستوريز الخاصة بستوريبوك و الإختبارات اليدوية و إختبارات اللمحة تساعد كثيرا في تجنب أخطاء الواجهات. إذا غطت الستوريز أنواع مختلفة من حالات إستخدان المكون, وإستخدمنا الأدوات التي تضمن أن شخص سيرى التغيير الذي يطرأ على ستوري, تكون إحتمالية وقوع الأخطاء قليلة بشكل ملحوظ.

و لكن العبرة في التفاصيل, منصة إختبار صريحة حول هذه التفاصيل مطلوبة و هو ما يقودنا إلى إختبارات الوحدة

في حالتنا هذه, نريد من `TaskList` إظهار المهام المثبتة **قبل** المهام الغير مثبتة التي تم تمريرها إلى دعائم `task`. بالرغم من أن لدينا ستوري (`WithPinnedTasks`) لنختبرها في هذا السيناريو إلا أن الأمر قد يبدو مجهولا لشخص ما إذا كان المكون **أوقف** ترتيب المهام بهذا الشكل ام أنه خطأ برمجي فهي بالطبع لن تٌعلم المستخدم بأنها **خطأ**

لذلك و لتفادي هذه المشكلة يمكننا إستخدام مكتبة إختبار رياكت لإظهار الستوري في الـDOM و تنفيذ بعض أوامر إستعلام حول DOM للتأكد من أن المزايا الظاهرة. ما يميز صيغة الستوري هو أنه يمكننا و بكل بساطة استيراد الستوري إلى أختباراتنا, ثم إظهارها هناك!

أنشئ ملف إختبار إسمه `src/components/TaskList.test.js` هنا سنقوم ببناء إختباراتنا التي ستقوم بتأكيد المخرجات

<div style="direction: ltr">

```js:title=src/components/TaskList.test.js
import { render } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

import * as TaskListStories from './TaskList.stories'; //👈  Our stories imported here

//👇 composeStories will process all information related to the component (e.g., args)
const { WithPinnedTasks } = composeStories(TaskListStories);

it('renders pinned tasks at the start of the list', () => {
  const { container } = render(<WithPinnedTasks />);

  expect(
    container.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]')
  ).not.toBe(null);
});
```

</div>

<div class="aside">
💡 <a href="">@storybook/testing-react</a> هي إضافة رائعة تسمح لك إعادة إستخدام ستوريز خاصتك في وحدات إختبار. بإعادة إستخدام ستوريز خاصتك في إختباراتك, يكون لديك فهرس من سيناريوهات المكون جاهزة للإختبار. إضافة إلى ذلك كل الحجج (args), مزينات, و المعلومات الأخرى من الستوري سيتم تجميعها عن طريق هذه المكتبة. كما لاحظت, كل ما عليك فعله في إختباراتك هو إختيار أي ستوري لإظهارها
</div>

![مشغل إختبار لائحة المهام](/intro-to-storybook/tasklist-testrunner.png)

لاحظ أننا كنا قادرين على إعادة إستخدام ستوري `WithPinnedTasks` في إختبار الوحدة خاصتنا; بهذه الطريقة يمكننا الإستمرار في الإستفادة من مصادر موجودة بطرق مختلفة

لاحظ أيضا أن هذا الإختبار هش بعض الشيئ, من المحتمل أن بنضوج المشروع و التنفيذ الخاص بـ`Task` بحد ذاته يتبدل -- ربما بإستخدام classname مختلف او `textarea` بدلا من `input`-- سيفشل الإختبار و سيحتاج للتحديث. هذه ليست مشكلة بالضرورة و إنما مؤشر لتوخي الحذر عند إستخدام إختبارات الوحدة بكثرة للواجهات. ذلك لان ليس من السهل متابعتهم. عوضا عن ذلك اعتمد الإختبارات اليدوية و اللمحة و الإنحدار المظهري (يرجى مراجعة [فصل الإختبار](/intro-to-storybook/react/en/test/) ) كلما أتاحت الفرصة.

<div class="aside">
💡 لا تنسى تنفيذ هذه التغييرات إلى git
</div>

</div>
