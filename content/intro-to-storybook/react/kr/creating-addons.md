---
title: '보너스: 애드온 만들기'
tocTitle: '보너스: 애드온 만들기'
description: '개발을 강력하게 만들어 줄 나만의 애드온을 만드는 방법을 배워봅시다'
commit: 'bebba5d'
---

앞서 우리는 Storybook의 핵심 기능인 강력한 [애드온(addons)](https://storybook.js.org/addons/introduction/) 에코시스템에 대해 소개해 드렸습니다. 애드온은 개발자 경험과 작업 흐름을 향상하는데 사용됩니다.

이번 보너스 챕터에서는 애드온을 어떻게 만드는지 살펴보겠습니다. 애드온을 직접 만드는 것은 벅찬 작업이라고 생각하실지도 모르겠지만 실제로는 그렇지 않습니다. 시작하기 위해 몇 단계를 거치기만 하면 바로 작성을 시작할 수 있습니다.

하지만 우선 먼저 해야 할 일로, 우리가 만들 애드온이 무엇을 할지에 대해 알아보겠습니다.

## 우리가 만들 애드온

이 예제를 위해서 우리 팀이 기존의 UI 컴포넌트와 관련이 있는 디자인 자산(design assets)을 가지고 있다고 가정해봅시다. 현재의 Storybook UI를 보면, 그러한 관계가 분명하지 않은 것으로 보입니다. 어떻게 하면 이러한 점을 고칠 수 있을까요?

우리의 목표를 잡았습니다. 이제 애드온이 지원할 기능을 정의해보겠습니다.

- 디자인 자산을 패널에 표시
- 이미지 및 임베딩을 위한 URL 지원
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

우리의 애드온이 무엇을 하게 될지 간략히 살펴보았습니다. 이제 본격적으로 작업을 시작해보겠습니다.

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

<div class="aside">우리는 <code>.storybook</code> 폴더에 애드온을 배치할 것입니다. 그 이유는 간단한 접근방식을 유지하고 복잡하지 않게 하기 위함입니다. 이것을 실제 애드온으로 변환하는 경우에는 자체 파일 및 폴더 구조를 가진 별도의 패키지로 분리하는 것이 가장 좋습니다.</div>

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
- 일부 옵션(애드온을 정의하는 title과 사용되는 요소의 type)과 함께 애드온에 대한 새로운 UI 요소를 추가하고 있으며, 현재는 일부 텍스트를 렌더링합니다.

이 시점에서 Storybook을 시작하면 아직 애드온을 볼 수 없습니다. 이전에 Knobs 애드온을 사용했을 때와 같이, `.storybook/main.js` 파일에 등록해주어야 합니다. 기존의 애드온 목록에 다음을 추가해주세요.

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

<div class="aside">Storybook 패널뿐만 아니라 다양한 종류의 UI 컴포넌트를 추가할 수 있습니다. 전부는 아니지만, 대부분이 @storybook/components 패키지 안에 이미 만들어져있기 때문에 여러분은 UI 구현에 너무 많은 시간을 낭비하지 않고 기능을 작성하는데 집중하실 수 있습니다. </div>

### Content 컴포넌트 만들기

우리는 첫 번째 목표를 달성하였습니다. 이제 두 번째 목표를 위한 작업을 시작할 시간입니다.

이를 완료하려면 import 부분을 약간 변경하고 자산에 대한 정보를 표시할 새로운 컴포넌트를 도입해야 합니다.

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

컴포넌트를 생성하고, import 부분을 수정해보았습니다. 남은 것은 컴포넌트를 패널에 연결하는 것뿐입니다. 그러면 우리는 스토리와 관련된 정보를 표시할 수 있는 애드온을 갖게 될 것입니다.

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

여기서 [useParameter](https://storybook.js.org/docs/addons/api/#useparameter)를 사용하고 있는데, 이 편리한 훅은 각각의 스토리에 `parameters` 옵션을 통해 제공된 정보를 읽을 수 있게 해줄 것이며, 우리의 경우에는 자산에 대한 단일 경로 또는 경로 목록이 될 것입니다. 곧 적용된 모습을 보실 수 있을 것입니다.

### 스토리에서 애드온 사용하기

필요한 모든 조각을 연결해보았습니다. 그렇지만 실제로 잘 작동하는지 또 어떤 것을 보여주는지 어떻게 하면 확인할 수 있을까요?

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

자세히 살펴보면 `styled` 태그를 사용하고 있음을 보실 수 있습니다. 이 태그는 `@storybook/theming` 패키지에서 가져온 것입니다. 이 태그를 사용하면 Storybook의 테마뿐만 아니라 필요한 경우 UI를 사용자 정의 할 수 있습니다. 또한 [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate)는 스토리 북의 내부 state를 활용하여 존재하는 어떤 정보든 가져올 수 있는 편리한 훅입니다. 우리의 경우에는 생성된 각 스토리의 id를 가져오기 위해 사용합니다.

### 실제 자원을 표시하기

애드온이 표시하는 자산들을 실제로 보려면, `public` 폴더로 자산을 복사하고 `parameters` 옵션을 조정하여 이러한 변경사항을 반영해야 합니다.

Storybook은 변경 사항을 파악하고 자산들을 가져올 것입니다. 그러나 지금은 첫 번째 자산만 가져옵니다.

![가져온 실제 자산](/intro-to-storybook/design-assets-image-loaded.png)

## 상태를 저장하는(Stateful) 애드온

우리의 초기 목표를 되짚어 보면:

- ✔️ 디자인 자산을 패널에 표시
- ✔️ 이미지 및 임베딩을 위한 URL 지원
- ❌ 여러 버전이나 테마가 있는 경우를 대비하여, 여러 자산을 지원 가능해야 함

거의 다 왔네요, 이제 한 가지 목표만 남았습니다.

마지막으로 우리는 일종의 state가 필요합니다. React의 `useState` 훅이나 클래스형 컴포넌트의 `this.setState()`를 사용할 수도 있지만 대신 우리는 Storybook의 `useAddonState`를 사용할 것입니다. 이는 애드온의 state를 지속할 수 있는 수단을 제공하고 로컬 state를 지속하기 위한 추가적 논리를 생성하는 것을 피하도록 해줍니다.

import를 필요에 맞게 수정해주세요:

```javascript
//.storybook/design-addon/register.js
import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* 이전과 동일 */
```

그리고 `Content` 컴포넌트를 수정하여 자산을 전환할 수 있도록 해보겠습니다:

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

## 애드온 완성

우리는 목표한 바와 같이 UI 구성 요소와 관련된 디자인 자산을 표시하는 완전한 기능을 갖춘 Storybook 애드온을 완성해보았습니다.

<details>
  <summary>이 예제에 사용된 전체 코드를 보시려면 여기를 클릭해주세요. </summary>

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

## 다음 단계

우리가 만든 애드온을 위한 다음 단계가 있다고 한다면, 그것은 애드온을 자체 패키지로 만들어 팀 및 다른 커뮤니티에 배포할 수 있도록 하는 것입니다.

그러나 그것은 이 튜토리얼에서 다룰 수 있는 범위를 벗어납니다. 이 예제는 작업 흐름을 더욱 향상하기 위해 Storybook API를 사용하여 여러분만의 애드온을 만드는 방법을 보여주었습니다.

애드온을 사용자 정의하는 추가적 방법들은:

- [Storybook 툴바에 버튼 추가하기](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [iframe과 채널을 통해 전달하기](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [명령 및 결과 보내기](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [컴포넌트가 출력한 html/css에 대한 분석 수행하기](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [컴포넌트를 감싸 새로운 데이터와 함께 다시 렌더링](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [DOM 이벤트를 발생시키고 DOM을 변경하기](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [테스트를 실행하기](https://github.com/storybookjs/storybook/tree/next/addons/jest)

외에도 더 많은 방법이 있습니다!

<div class="aside">새로운 애드온을 만들고 위 목록에 추가되길 원하신다면, 추가될 수 있도록 Storybook 문서에서 PR을 열어주세요.</div>

### 데브 키트(Dev kits)

Storybook 팀은 여러분이 애드온을 개발하시는 것을 돕고자 데브 키트를 개발하였습니다.

이 패키지는 자신만의 애드온 구축을 시작하는 데 도움이되는 스타터 키트입니다.
방금 만든 애드온은 이러한 스타터 세트 중 하나이며, 특히 `addon-parameters` 를 기반으로 하였습니다.

데브 키트는 여기에서 찾아보실 수 있습니다:
https://github.com/storybookjs/storybook/tree/next/dev-kits

앞으로 더 많은 데브 키드가 제공될 예정입니다.

## 애드온을 팀과 공유하기

애드온은 개발 흐름에 시간을 절약해 주는 기능이지만 기술자가 아닌 팀원이나 검토자가 해당 기능을 활용하기에 어려울 수 있습니다. 모든 사람이 로컬 컴퓨터에서 Storybook을 작동시킬 것이라고 장담할 수도 없습니다. 그 때문에 Storybook을 온라인에 배포하여 모든 사람이 참조 할 수 있도록 하는 것이 매우 도움이 되는 이유입니다. 다음 챕터에서 해 볼 것입니다!
