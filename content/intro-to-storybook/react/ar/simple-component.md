---
title: 'قم ببناء مكون بسيط'
tocTitle: 'مكون بسيط'
description: 'قم ببناء مكون بسيط بشكل منعزل'
commit: '1e576c5'
---

<div style="direction: rtl">

سنقم ببناء واجهتنا بإتباع منهجية [التطوير المدفوعة بالمكون](https://www.componentdriven.org/). وهي نهج يبني واجهات المستخدم بشكل تصاعدي بداية بالمكونات وانتهاءً بالشاشات. هذه المنهجية تساعدك على توسيع مقدار التعقيد الذي تواجهه خلال بنائك للواجهات

## مهمة

![مكون المهمة في ثلاث حالات](/intro-to-storybook/task-states-learnstorybook.png)

`Task` هوالمكون الجوهري في تطبيقنا. كل مهمة تُعرض بشكل مختلف نوعا ما بناء على الحالة التي هي فيها. نعرض خانة اختيار محددة (او غير مخددة), بعض المعلومات حول المهمة, وزر "تثبيت", الذي يسمح لنا بتحريك المهمة لأعلى ولأسفل اللائحة’ لبناء كل هذا, نحتاج الى هذه الخاصيات:

- `title` – نص يصف المهمة
- `state` - أي لائحة توجد بها المهمة حاليا وهل هي محددة؟

خلال بنائنا للـ `مهمة`, سنكتب حالاتنا التجريبية التي تتوافق مع الأنواع الموضحة في الصورة أعلاه. ثم سنستخدم ستوريبوك لبناء المكون بشكل منعزل باستخدام بيانات وهمية. سنختبر مظهر المكون يدويا تبعا لكل حالة اثناء تقدمنا.

## الإعداد

أولا, لننشئ مكون المهمة وملف ستوري الخاص به

`src/components/Task.js` و`src/components/Task.stories.js`.

سنبدأ بتنفيذ بسيط للمكون `مهمة`, سنأخذ ببساطة الصفات التي نعلم أننا سنحتاج إليها بالإضافة إلى العمليتان اللتان ستنجز على مهمة (تحريكها بين اللوائح)

<div style="direction: ltr">

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

</div>

مما سبق, نقوم بإظهار النص لـ`مهمة` بشكل مباشر بناء عن هيكل HTML الخاص بتطبيق مدير المهام

بالأسفل, نقوم ببناء حالات الاختبار الثلاث الخاصة بالمهمة في ملف ستوري:

<div style="direction: ltr">

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

</div>

هناك مستويين بسيطين من التنظيم في ستوريبوك: قصص المكون وقصص الأبناء الخاص به. يمكنك الحصول على كم غير محدود من الستوري لكل مكون تحتاج إليه

- **مكون**
  - ستوري
  - ستوري
  - ستوري

لإعلام ستوريبوك بالمكون الذي نوثقه, نكون:
`default` export
و التي تحتوي على:

- `component` -- المكون بحد ذاته,
- `title` -- كيفية الإشارة إلى المكون في القائمة الجانبية من تطبيق ستوريبوك,
- `excludeStories` -- التصديريات في ملف ستوري التي لا يجب ان تظهر كستوري عن طريق ستوريبوك.
- `argTypes` -- تحدد سلوك [الحجج](https://storybook.js.org/docs/react/api/argtypes) في كل ستوري.

لتعريف الستوريز الخاصة بنا, نقوم بتصدير دالة لكل من حالات الاختبار لتوليد ستوري. الستوري هي دالة تقوم بإرجاع عنصر ظاهر (اي مكون مع مجموعة من الخاصيات) لحالة معينة - تماما [كمكون وظيفي](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

عندما يكون ليدنا تغييرات متعددة لمكوننا, فإنه من المناسب تعيينه إلى متغير `Template` أو `قالب`. استخدام هذا النمط في الستوريز الخاصة بك يقلل من كمية الكود الذي تحتاج لكتابته وصيانته

<div class="aside">
💡 <code>Template.bind({})</code> هي تقنية <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">جافاسكربت اساسية</a> لإنشاء نسخة من دالة, نستخدم هذه التقنية للإتاحة لكل ستوري مُصدرة تعيين الخاصيات الخاصة بها, ولكن باستخدام نفس التنفيذ
</div>

حجج أو[`args`](https://storybook.js.org/docs/react/writing-stories/args), تسمح لنا بتعديل مكوناتنا بشكل مباشر مع إضافة الضوابط بدون إعادة تشغيل ستوريبوك. بمجرد ما ان قيم [`args`](https://storybook.js.org/docs/react/writing-stories/args) تتبدل, يتبدل المكون على حدِِ سواء

عند إنشاء ستوري يمكننا استخدام حجج `task` أساسية لبناء شكل المهمة التي يتوقع استقبالها المكون. يتم اخد ذلك عادة من الشكل الذي ستبدو عليه البيانات.
للتذكير, اصدار (`export`) هذا الشكل يمكننا من إعادة استخدامه في ستوريهات لاحقة.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/essentials/actions"><b>أحداث</b></a> تساعدك على التأكد من التفاعلات عند بناء مكونات واجهة المستخدم بشكل منعزل. عادة لن تتمكن من الوصول الى الدوال والحالة التي لديك في سياق التطبيق. استخدم `action()` لإدخالهم.
</div>

## الإعداد

سنحتاج للقيام ببعض التعديلات على ملفات إعدادات ستوريبوك ليتمكن ستوريبوك من ملاحظة تغييراتنا الأخيرة, ليس ذلك فحسب, بل حتى تمكيننا من استخدام ملف `css` الخاص بالتطبيق (الموجود في `src/index.css`).

ابدأ بتغيير ملف إعدادات ستوريبوك (`.storybook/main.js`) إلى الآتي:

<div style="direction: ltr">

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

</div>

بعد تكملة التغيير أعلاه, داخل مجلد `.storybook` قم بتغيير المظهر (`preview.js`) إلى الآتي:

<div style="direction: ltr">

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

</div>

[`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) عادة تُستخدم للتحكم في سلوك مزايا وإضافات ستوريبوك. في حالتنا هذه سنستخدمهم لإعداد الطريقة التي سيتم التعامل فيها مع `actions`

`actions` تسمح لنا إنشاء دوال تظهر تحت قسم **actions** من واجهة ستوريبوك. بحيث عند بناء زر تثبيت, سنتمكن في اختبار الواجهة من تحديد ما إذا كانت ضغطة زر ناجحة

عند الإنتهاء من ذلك, من المفترض أن إعادة تشغيل خادم ستوريبوك ستظهر لنا حالات الاختبار للحالات الثلاث من مكون `Task`

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## بناء الحالات

بما أن تم إعداد ستوريبوك, وتم استيراد الأنماط, وتم بناء حالات الاختبار, يمكننا وبسرعةالبدء بتنفيذ نص `HTML` ليتطابق المكون مع التصميم

<div style="direction: ltr">

```js:title=src/components/Task.js
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

</div>

إضافة النمط الذي تم استيراده ممزوج مع نص الوصف أعلاه يعطينا الواجهة الأتية:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## تحديد متطلبات البيانات

من أفضل الممارسات استخدام `propTypes` في رياكت لتحديد شكل البيانات التي يتوقعها مكون. لا يقتصر الأمر على التكوين الذاتي فحسب, بل يساعد أيضا في إكتشاف المشاكل مبكرا

<div style="direction: ltr">

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

</div>

سيظهر الآن خلال التطوير إنذار في حال استخدمت المهمة (Task) بشكل خاطئ

حل بديل لتحقيق نفس الهدف هو استخدام TypeScript من أجل خاصيات المكون

<div class="aside">
💡 حل بديل لتحقيق نفس الهدف هو استخدام TypeScript من أجل خاصيات المكون
</div>

## تم بناء المكون

قمنا الآن ببناء مكوننا بشكل ناجح بدون الحاجة لخادم أو تشغيل الواجهة الأمامية لتطبيقنا بشكل كامل. الخطوة الآتية هي بناء ما تبقى من صندوق المهام خطوة بخطوة بنفس الطريقة.

كما تلاحظ, من السهل ومن السريع البدأ في بناء المكونات بشكل منعزل. يمكننا توقع إنتاج واجهات أمامية ذات جودة عالية وبمشاكل قليلة لأن من الممكن التعمق واختبار كل حالة لكل مكون.

## اختبار مميكن

ستوريبوك يمككنا من اختبار واجهة تطبيقنا خلال عملية البناء. ستساعدنا الـ`ستوريز` من ضمان أننا لن نكسر شكل المهمة (Task) عند تطويرنا للتطبيق. ولكن, هذه عملية يدوية إلى هذه اللحظة, سيحتاج شخص ما من الضغط على كل اختبار حالة لضمان إظهاره بشكل صحيح وبدون أخطاء, ألا يمكننا القيام بذلك ذاتيا؟

### اختبار اللمحة

يقصد به تسجيل الإخراج الجيد لمكون بناء على إدخال معين ثم الإشارة إلى المكون كلما تغير المغرج في المستقبل. هذا يكمل ستوريبوك لأنها طريقة سريعة لعرض نسخ جديدة من المكون والتغييرات التي طرأت عليه.

<div class="aside">
💡 تأكد من أن بيانات الإظهار الخاصة بالمكون لا تتبدل حتى لا يفشل اختبار اللمحة في كل مرة. انتبه لأشياء مثل التواريخ أو القيم المولدة عشوائيا.
</div>

مع [إضافة ستوريبوك](https://github.com/storybooks/storybook/tree/master/addons/storyshots) يتم إنشاء اختبار لمحة لكل ستوري. استخدمها لأضافة التبعيات التالية:

<div style="direction: ltr">

```shell
yarn add -D @storybook/addon-storyshots react-test-renderer
```

</div>

ثم أنشئ ملف `src/storybook.test.js` يحتوي على الأتي:

<div style="direction: ltr">

```js:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

</div>

إنتهينا! يمكنك تنفيذ الأمر `yarn test` ورؤية الإخراج التالي:

![Task test runner](/intro-to-storybook/task-testrunner.png)

الأن لدينا اختبار لمحة لكل ستوري خاصة بالـ`Task`. إذا غيرنا التنفيذ الخاص بالـ`Task` سوف يٌطلب منا تأكيد هذا التغيير

<div class="aside">
💡 لا تنسى تنفيذ هذه التغييرات إلى git
</div>

</div>
