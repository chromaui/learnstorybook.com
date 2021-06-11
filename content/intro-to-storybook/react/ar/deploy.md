---
title: 'أطلق ستوريبوك'
tocTitle: 'أطلق'
description: 'تعلم كيفية إطلاق ستوريبوك أونلاين'
commit: '8652d73'
---

<div style="direction: rtl">

عبر هذه الدروس, بنينا مكونات على جهاز التطوير المحلي خاصتنا. في نقطة معينة, سنحتاج لإطلاق عملنا للحصول على ملاحظات الفريق. لإطلاق ستوريبوك أونلاين لنساعد زملائنا على مراجعة تنفيذ واجهة المستخدم.

## التصدير كتطبيق ثابت

لإطلاق ستوريبوك سنحتاج أولا لإصداره كتطبيق ويب ثابت. هذه الوظيفة موجودة و معدة مسبقا في ستوريبوك.

تنفيذ `yarn build-storybook` سينتج ستوريبوك ثابت في وجهة `storybook-static`, و التي يمكنها بعد ذلك الإطلاق على أي خدمة إستضافة مواقع ثابتة.

## نشر ستوريبوك

هذا الدرس يستخدم <a href="https://www.chromatic.com/">كروماتك</a>, خدمة نشر مجانية صنعت من مراقبي ستوريبوك. تسمح لنا بإطلاق و إستضافة ستوريبوك خاصتنا بشكل أمن في السحابة.

### قم بإعداد مستودع في Github

قبل أن نبدأ, يحتاج الكود المحلي ان يتزامن مع خدمة التحكم في الإصدار عن بعد. عندما تم تهيئة مشروعنا في [فصل البدأ](/intro-to-storybook/react/en/get-started/), قمنا بتهيئة مستودع محلي. في هذه اللحظة لدينا بالفعل مجموعة من التنفيذات (commits) التي يمكننا دفعها إلى مستودع عن بعد.

إذهب إلى GitHub و قم بإنشاء مستودع جديد لمشروعنا [هنا](https://github.com/new). اعط المستودع إسم "taskbox" كما في مشروعنا المحلي.

![إعداد Github](/intro-to-storybook/github-create-taskbox.png)

في المستودع الجديد, خذ رابط المصدر و أضفه إلى مشروع git خاصتك عن طريق هذا الأمر:

<div style="direction: ltr">

```bash
git remote add origin https://github.com/<your username>/taskbox.git
```

</div>

أخيرا, إدفع مستودعك المحلي إلى البعيد في Github عن طريق:

<div style="direction: ltr">

```bash
git push -u origin main
```

</div>

### إجلب Chromatic

أضف الحزمة إلى تبعيات التطوير.

<div style="direction: ltr">

```bash
yarn add -D chromatic
```

</div>

عندما يتم تثبيت الحزمة, [سجل دخولك إلى Chromatic](https://www.chromatic.com/start) بإستخدام حسابك في Github (Chromatic سيطلب سمحيات خفيفة) ثم سننشئ مشروع جديد إسمه "taskbox" و نزامنه مع مستودع Github الذي أعددناه.

إضغط على `Choose GitHub repo` تحت خانة المتعاونون و إختر مستودعك.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

إنسخ الرمز الفريد `project-token` الذي يتم توليده لمشروعك. ثم قم بتنفيذه عن طريق تنفيذ الأمر التالي لبناء و إطلاق ستوريبوك. تأكد من تبديل كلمة `project-token` برمز مشروعك.

<div style="direction: ltr">

```bash
yarn chromatic --project-token=<project-token>
```

</div>

![Chromatic يشتغل](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

عند الإنتهاء ستحصل على رابط `https://random-uuid.chromatic.com` للستوريبوك المٌنشر. شارك هذا الرابط مع فريقك للحصول على أرائهم.

![ستوريبوك نٌشر بحزمة Chromatic](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

مرحى! لقد قمنا بنشر ستوريبوك بإستخدام أمر واحد, و لكن تنفيذ أمر كل مرة نريد فيها الحصول على تعليق حول تنفيذ واجهة المستخدم هو أمر تكراري. من ناحية مثالية, نريد نشر أخر نسخة من المكونات كلما دفعنا الكود. سنتحتاج إلى إطلاق إستمراري لستوريبوك.

## الإطلاق الإستمراري مع Chromatic

بما أن مشروعنا مستضاف في مستودع Github, يمكننا إستخدام خدمة دمج إستمراري (Continious Integration) لإطلاق ستوريبوك خاصتنا أوتوماتيكيا. [GitHub Actions](https://github.com/features/actions) هي خدمة دمج إستمراري مجانية مبنية في Github تسهل الإطلاق الأوتوماتيكي.

### أضف Github Action لإطلاق ستوريبوك

في المجلد الرئيسي من المشروع, انشئ وجهة جديدة بإسم `.github` ثم أنشئ وجهة أخرى داخلها بإسم `workflows`

أنشئ ملف جديد بإسم `chromatic.yml` مثل الذي بالأسفل. تأكد من إعادة تسمية `CHROMATIC_PROJECT_TOKEN` إلى الرمز الفريد لمشروعك.

<div style="direction: ltr">

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/en/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

</div>

<div class="aside"><p>💡 لتبسيط الأمور, لم تُذكر <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> Secrets او أسرار هي متغيرات بيئة أمنة مقدمة من Github لكي لا تحتاج لكتابة <code>رمز المشروع</code> الفريد يدويا داخل الكود.</p></div>

### نفذ الـ action

في سطر الأوامر, نفذ الأمر التالي لإضافة التغييرات التي تم تنفيذها:

<div style="direction: ltr">

```bash
git add .
```

</div>

ثم نفذ التغييرات عن طريق:

<div style="direction: ltr">

```bash
git commit -m "GitHub action setup"
```

</div>

أخيرا, إدفع التغييرات إلى المستودع البعيد عن طريق:

<div style="direction: ltr">

```bash
git push origin main
```

</div>

بمجرد إعدادك Github action سيتم إطلاق ستوريبوك إلى Chromatic كلما تقوم بدفع الكود. يمكنك إيجاد كل الستوريبوك التي تم نشرها في واجهة بناء مشروعك في Chromatic.

![لوحة مستخدم Chromatic](/intro-to-storybook/chromatic-user-dashboard.png)

أنقر على أخر بناء, يجب أن يكون في الأعلى.

ثم أنقر على زر `View Storybook` لرؤية أخر نسخة من ستوريبوك خاصتك.

![رابط ستوريبوك في Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

شارك الرابط مع زملائك. هذا سيساعدك سواء كان جزء من مسار تطوير تطبيق إعتيادي أم فقط من أجل التفاخر بعملك 💅

</div>
