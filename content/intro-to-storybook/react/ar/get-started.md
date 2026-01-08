---
title: 'دروس ستوريبوك مع رياكت'
tocTitle: '!ابدأ'
description: 'جهّز ستوريبوك في بيئة التطوير الخاصة بك'
commit: 'afe05db'
---

<div style="direction: rtl">

ستوريبوك يعمل جنبا إلى جنب مع تطبيقك في بيئة التطوير. يساعدك على بناء مكونات واجهة مستخدم منعزلة عن منطق العمل وسياق التطبيق الخاص بك. هذه النسخة من درس "مقدمة عن ستوريبوك" مخصصة لرياكت, نسخ اخرى من هذا الدرس: [رياكت نايتف](/intro-to-storybook/react-native/en/get-started/), [فيو](/intro-to-storybook/vue/en/get-started/), [انجيولار](/intro-to-storybook/angular/en/get-started/), [سفيلت](/intro-to-storybook/svelte/en/get-started/).

![ستوريبوك وتطبيقك](/intro-to-storybook/storybook-relationship.jpg)

## تنصيب ستوريبوك رياكت

سنحتاج إلى اتباع بعضا من الخطوات لتجهيز عملية البناء في بيئتنا. للبدأ, نريد ان نستخدم
[ديجيت](https://github.com/Rich-Harris/degit) لتجهيز نظام البناء. عن طريق هذه الرزمة, يمكنك تحميل قوالب (تطبيقات مبنية جزئيا مع إعدادات افتراضية) لمساعدتك على تتبع سير عمل التطوير بشكل سريع

لنقم بتنفيذ الأوامر التالية

<div style="direction: ltr">

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

</div>

<div class="aside">
💡   هذا القالب يحتوي على الأنماط والمصادر والإعدادات الأساسية من أجل هذه النسخة من الدرس
</div>

الأن يمكننا وبسرعة التحقق من أن البيئات المختلفة لتطبيقنا تعمل بنجاح:

<div style="direction: ltr">

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

</div>

<div class="aside">
💡لاحظ علم <code>--watchAll</code> في أمر الاختبار, إدخال هذا العلم يضمن لنا أن كل الاختبارات تنفذ.أثناء تقدمك في هذا الدرس سيتم تعريفك بسيناريوهات اختبار مختلفة. قد ترغب في تعديل نصوص  <code>package.json</code> وفقا إلى ذلك.
</div>

أشكال واجهة تطبيقنا الأمامية الثلاث: اختبار مميكن (جست) وتطوير المكونات (ستوريبوك) والتطبيق بحد ذاته.

![ثلاث أشكال](/intro-to-storybook/app-three-modalities.png)

بناء على أي جزء من التطبيق تعمل عليه, قد ترغب في تنفيذ أحد أو بعض من هذه الأوامر بشكل متزامن. بما أن تركيزنا الأن هو انشاء مكون واجهة امامية واحد, سنلتزم بتنفيذ ستوريبوك فقط.

## تنفيذ التغييرات

في هذه المرحلة من الآمن أن نضيف ملفاتنا إلى مستودع محلي. نفذ الأوامر التالية لتهيئة مستودع محلي, اضف ونفذ التغييرات التي قمنا بها حتى الأن.

<div style="direction: ltr">

```shell
git init
```

</div>

يتبعها:

<div style="direction: ltr">

```shell
git add .
```

</div>

ثم أخيرا:

<div style="direction: ltr">

```shell
git commit -m "first commit"
```

</div>

لنقم ببناء أول مكون لنا!

</div>
