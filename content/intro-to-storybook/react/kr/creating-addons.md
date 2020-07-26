---
title: '보너스: 애드온 만들기'
tocTitle: '보너스: 애드온 만들기'
description: '개발을 강력하게 만들어 줄 나만의 애드온을 만드는 방법을 배워봅시다'
commit: 'bebba5d'
---

앞서 우리는 Storybook의 핵심 기능인 강력한 [애드온(addons)](https://storybook.js.org/addons/introduction/) 에코시스템에 대해 소개드렸습니다. 애드온은 개발자 경험과 작업 흐름을 향상시키는데 사용됩니다.

이번 보너스 챕터에서는 애드온을 어떻게 만드는지 살펴보겠습니다. 애드온을 직접 만드는 것은 벅찬 작업이라고 생각하실지도 모르겠지만 실제로는 그렇지 않습니다. 시작하기 위해 몇 단계를 거치기만 하면 바로 작성을 시작할 수 있습니다.

하지만 우선 먼저 해야할 일로, 우리가 만들 애드온이 무엇을 할지에 대해 알아보겠습니다.

## 우리가 쓸 애드온

이 예제를 위해서 우리 팀이 기존의 UI 컴포넌트와 관련이 있는 디자인 자산(design assets)을 가지고 있다고 가정해봅시다. 현재의 Storybook UI를 보면, 그러한 관계가 분명하지 않은 것 같아 보입니다. 어떻게 하면 이러한 점을 고칠 수 있을까요?

우리의 목표를 잡았습니다. 이제 애드온이 지원할 기능을 정의해보겠습니다.

- 디자인 자산을 패널에 표시함
- 이미지 및 임베딩을 위한 url을 지원함
- 여러 버전이나 테마가 있는 경우를 대비하여, 여러 자산을 지원 가능해야 함

스토리에 자산 목록을 첨부하는 방법은 Storybook의 옵션인 [parameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options)를 사용하는 것입니다. 이는 사용자 정의 변수를 스토리에 주입할 수 있도록 해줍니다. 사용하는 방법은 이전 챕터에서 살펴본 데코레이터(decorator)를 사용한 방식과 매우 유사합니다.

```javascript
export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## 설정

우리의 애드온이 무엇을 하게될지 간략히 살펴보았습니다. 이제 본격적으로 작업을 시작해보겠습니다.

프로젝트의 루트 폴더에 `.babelrc` 파일을 아래와 같이 생성해주세요:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

이 파일을 추가하면 개발하려는 애드온에 대해 올바른 사전 설정과 옵션을 사용할 수 있습니다.

그런 다음 `.storybook` 폴더에 `design-addon`이라는 새로운 폴더를 만들고 그 안에 `register.js` 파일을 생성해주세요.

그게 다입니다! 이제 애드온 개발을 시작할 준비가 되었습니다.

<div class="aside">우리는 <code>.storybook</code> 폴더에 애드온을 배치할 것입니다. 그 이유는 간단한 접근방식을 유지하고 복잡하기 않게 하기 위함입니다. 이 애드온을 실제 애드온으로 변환하는 경우에는 자체 파일 및 폴더 구조를 가진 별도의 패키지로 분리하는 것이 가장 좋습니다.</div>

## 애드온 작성하기

최근에 작성한 파일에 다음을 추가해주세요.

```javascript
//.storybook/design-addon/register.js
import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

이는 여러분이 시작하기 위한 전형적인 상용구 코드(boilerplate)입니다. 코드가 수행하는 작업을 살펴보면:

- Storybook에 새로운 애드온을 등록하고 있습니다.
- 일부 옵션(애드온을 정의하는 title과 사용되는 요소의 type)과 함께 애드온에 대한 새로운 UI 요소를 추가하고 현재는 일부 텍스트를 렌더링합니다.

이 시점에서 Storybook을 시작하면 아직 애드온을 볼 수 없습니다. 이전에 Knobs 애드온을 사용했을때와 같이, `.storybook/main.js` 파일에 등록해주어야 합니다. 기존의 애드온 목록에 다음을 추가해주세요.

```js
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // 이전과 동일
    './.storybook/design-addon/register.js', // 우리의 애드온
  ],
};
```

![Storybook에서 실행되는 디자인 자산 애드온](/intro-to-storybook/create-addon-design-assets-added.png)

성공! Storybook UI에 새로 만든 애드온이 추가되었습니다.

<div class="aside">Storybook 패널뿐만 아니라 다양한 종류의 UI 컴포넌트를 추가할 수 있습니다. 전부는 아니지만 대부분이 @storybook/components 패키지 안에 이미 만들어져있기 때문에, 여러분은 UI 구현에 너무 많은 시간을 낭비하지 않고 기능을 작성하는데 집중하실 수 있습니다. </div>

### Content 컴포넌트 만들기

우리는 첫번째 목표를 달성하였습니다. 이제 두번째 목표를 위한 작업을 시작할 시간입니다.

이를 완료하려면 가져오기 부분을 약간 변경하고 자산에 대한 정보를 표시할 새로운 컴포넌트를 도입해야 합니다.

애드온 파일을 다음과 같이 변경해주세요:

```javascript
//.storybook/design-addon/register.js
import React, { Fragment } from 'react';
/* 이전과 동일 */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // 스토리의 매개변수(parameter)가 여기에서 검색됩니다
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

컴포넌트를 생성하고, 가져오기 부분을 수정해보았습니다. 남은 것은 컴포넌트를 패널에 연결하는 것 뿐입니다. 그러면 우리는 스토리와 관련된 정보를 표시할 수 있는 애드온을 갖게 될 것입니다.

코드는 다음과 같아야 합니다.

```javascript
//.storybook/design-addon/register.js
import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // 스토리의 매개변수(parameter)가 여기에서 검색됩니다
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

여기서 [useParameter](https://storybook.js.org/docs/addons/api/#useparameter)를 사용하고 있는데, 이 편리한 훅은 각각의 스토리에 `parameters` 옵션을 통해 제공된 정보를 읽을 수 있게 해줄 것이며, 우리와 같은 경우에는 자산에 대한 단일 경로 또는 경로 목록이 될 것입니다. 곧 적용된 모습을 보실 수 있을 것입니다.

### 스토리에서 애드온 사용하기

필요한 모든 조각들을 연결해보았습니다. 그치만 실제로 잘 작동하는지 또 어떤 것을 보여주는지 어떻게하면 확인할 수 있을까요?

이를 위해 `Task.stories.js` 파일을 조금 변경하고 [parameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options) 옵션을 추가해보도록 하겠습니다.

```javascript
// src/components/Task.stories.js
export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  // "Data"로 끝나는 것은 스토리에서 제외합니다
  excludeStories: /.*Data$/,
};
/* 이전과 동일  */
```

Storybook을 다시 시작하고 Task 스토리를 선택해주세요. 다음과 같은 내용을 보실 수 있을 것입니다.

![Storybook 스토리에서 디자인 자산 애드온의 내용이 표시됨](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### 애드온에 내용 표시하기

이 단계에서 애드온이 정상적으로 작동하고 있음을 알 수 있지만, 이제 `Content` 컴포넌트를 변경하여 우리가 실제로 원하는 것을 표시해 보겠습니다:

```javascript
//.storybook/design-addon/register.js
import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // 이미지 뷰어 실행
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // 스토리의 매개변수(parameter)가 여기에서 검색됩니다
  const results = useParameter('assets', []);
  // Storybook global state에서 story의 id를 가져옵니다
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

자세히 살펴보면 `styled` 태그를 사용하고 있음을 보실 수 있습니다. 이 태그는 `@storybook/theming` 패키지에서 가져온 것입니다. 이 태그를 사용하면 Storybook의 테마뿐만 아니라 필요한 경우 UI를 사용자 정의 할 수 있습니다. 또한 [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate)는 스토리 북의 내부 state를 활용하여 존재하는 어떤 정보든 가져올 수 있는 편리한 훅입니다. 우리의 경우에는 생성된 각 스토리의 id를 가져 오기 위해 사용합니다.

### 실제 자원을 표시하기

애드온이 표시하는 자산들을 실제로 보려면, `public` 폴더로 자산을 복사하고 `parameters` 옵션을 조정하여 이러한 변경사항을 반영해야 합니다.

Storybook은 변경 사항을 파악하고 자산들을 가져올 것입니다. 그러나 지금은 첫번째 자산만 가져옵니다.

![가져온 실제 자산](/intro-to-storybook/design-assets-image-loaded.png)

## Stateful addons

Going over our initial objectives:

- ✔️ Display the design asset in a panel
- ✔️ Support images, but also urls for embedding
- ❌ Should support multiple assets, just in case there will be multiple versions or themes

We're almost there, only one goal remaining.

For the final one, we're going to need some sort of state, we could use React's `useState` hook, or if we were working with class components `this.setState()`. But instead we're going to use Storybook's own `useAddonState`, which gives us a means to persist the addon state, and avoid creating extra logic to persist the local state. We'll also use another UI element from Storybook, the `ActionBar`, which will allow us to change between items.

We need to adjust our imports for our needs:

```javascript
//.storybook/design-addon/register.js
import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

And modify our `Content` component, so that we can change between assets:

```javascript
//.storybook/design-addon/register.js
const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Addon built

We've accomplished what we set out to do, which is to create a fully functioning Storybook addon that displays the design assets related to the UI components.

<details>
  <summary>Click to expand and see the full code used in this example</summary>

```javascript
// .storybook/design-addon/register.js
import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## Next steps

The next logical step for our addon, would be to make it it's own package and allow it to be distributed with your team and possibly with the rest of the community.

But that's beyond the scope of this tutorial. This example demonstrates how you can use the Storybook API to create your own custom addon to further enhance your development workflow.

Learn how to further customize your addon:

- [add buttons in the Storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communicate through the channel with the iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [send commands and results](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [perform analysis on the html/css outputted by your component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [wrap components, re-render with new data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [fire DOM events, make DOM changes](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [run tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

And much more!

<div class="aside">Should you create a new addon and you're interested in having it featured, feel free to open a PR in the Storybook documentation to have it featured.</div>

### Dev kits

To help you jumpstart the addon development, the Storybook team has developed some `dev-kits`.

These packages are starter-kits to help you start building your own addons.
The addon we've just finished creating is based on one of those starter-sets, more specifically the `addon-parameters` dev-kit.

You can find this one and others here:
https://github.com/storybookjs/storybook/tree/next/dev-kits

More dev-kits will become available in the future.

## Sharing addons with the team

Addons are timesaving additions to your workflow, but it can be difficult for non-technical teammates and reviewers to take advantage of their features. You can't guarantee folks will run Storybook on their local machine. That's why deploying your Storybook to an online location for everyone to reference can be really helpful. In the next chapter we'll do just that!
