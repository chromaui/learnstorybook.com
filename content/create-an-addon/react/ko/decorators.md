---
title: '데코레이터'
tocTitle: '데코레이터'
description: '스토리와의 상호작용'
commit: '0e7246a'
---


이제 거의 끝났습니다. 지금까지 우리는 상태를 추적할 수 있는 툴을 만들어 툴바에 추가했고, 이제는 이 상태에 대응하여 아웃라인을 표시하고, 숨겨야 합니다.

[데코레이터](https://storybook.js.org/docs/react/writing-stories/decorators)는 스토리를 감싸고 엑스트라 렌더링 기능을 추가합니다. 이번 장에서 글로벌 아웃라인에 대응하고 CSS 인젝션을 처리하는 데코레이터를 만들어 볼 것입니다. 차례로 모든 HTML 요소 주위에 아웃라인을 그려볼 것입니다.

이전 단계에서 `outlineActive`을 전역으로 정의해봤습니다. 이어서 `useGlobals` 훅을 사용하여 데코레이터에서 전역상태를 사용할 수 있습니다.

```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useGlobals } from '@storybook/addons';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // 문서 패널에서 애드온을 사용하는지 여부
  const isInDocs = context.viewMode === 'docs';

  useEffect(() => {
    // 이 곳에서 부수 작용(side effect)을 실행하세요.
    // 예를 들어, 미리보기 콘텐츠를 여기서 다뤄보세요.
    const selectorId = isInDocs ? `#anchor--${context.id} .docs-story` : `root`;

    displayToolState(selectorId, { outlineActive, isInDocs });
  }, [outlineActive]);

  return StoryFn();
};

function displayToolState(selector, state) {
  const rootElement = document.getElementById(selector);
  let preElement = rootElement.querySelector('pre');

  if (!preElement) {
    preElement = document.createElement('pre');
    preElement.style.setProperty('margin-top', '2rem');
    preElement.style.setProperty('padding', '1rem');
    preElement.style.setProperty('background-color', '#eee');
    preElement.style.setProperty('border-radius', '3px');
    preElement.style.setProperty('max-width', '600px');
    rootElement.appendChild(preElement);
  }

  preElement.innerText = `This snippet is injected by the withGlobals decorator.
It updates as the user interacts with the ⚡ tool in the toolbar above.
${JSON.stringify(state, null, 2)}
`;
}
```

## 아웃라인 CSS 삽입하기

스타일을 추가하거나 제거하는 것은 부수 작용(side effect)이기 때문에 이 작업을 `useEffect`에서 함수 안에 감싸줘야 합니다. 다음으로 `outlineActive` 전역에 의해 트리거됩니다. Kit 코드는 예시가 제공되지만, 아웃라인 CSS 주입을 처리하도록 업데이트 해보겠습니다.

```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useMemo, useGlobals } from '@storybook/addons';

import { clearStyles, addOutlineStyles } from './helpers';
import outlineCSS from './outlineCSS';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // 문서 패널에서 애드온을 사용하는지 여부
  const isInDocs = context.viewMode === 'docs';

  const outlineStyles = useMemo(() => {
    const selector = isInDocs ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

    return outlineCSS(selector);
  }, [context.id]);

  useEffect(() => {
    const selectorId = isInDocs ? `addon-outline-docs-${context.id}` : `addon-outline`;

    if (!outlineActive) {
      clearStyles(selectorId);
      return;
    }

    addOutlineStyles(selectorId, outlineStyles);

    return () => {
      clearStyles(selectorId);
    };
  }, [outlineActive, outlineStyles, context.id]);

  return StoryFn();
};
```

좋습니다, 큰 도약을 한 것 같습니다. 모든 변경사항을 살펴보겠습니다.

애드온은 문서 및 스토리 보기 모드에서 모두 활성화될 수 있습니다. 미리 보기 `iframe`의 실제 DOM 노드는 이 두 모드에서 서로 다릅니다. 실제로, 문서 모드는 한 페이지에 여러 개의 스토리 미리보기를 렌더링합니다. 따라서 스타일이 주입될 DOM 노드에 적합한 셀렉터(selector)를 선택해야 합니다. 또한 CSS는 특정 셀렉터(selector)로 범위를 지정해야 합니다.

<div class="aside"> 💡 여기서 <code>useMemo</code> 및 <code>useEffect</code>는 리액트가 아니라 <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a>에서 가져온 것입니다. 왜냐하면 데코레이터 코드가 Storybook 미리보기에서 실행되기 때문입니다. 리액트를 포함하지 않을 사용자 코드가 불러와지는 곳이기 때문에 Storybook은 우리가 사용하는 리액트와 유사한 훅 라이브러리를 구현합니다.</div>

다음으로, DOM에 스타일을 주입할 때, 사용자가 스타일을 끄거나 보기 모드를 전환할 때 스타일을 초기화 할 수 있도록 스타일을 추적해야 합니다.

이 모든 CSS 로직을 관리하려면 헬퍼 함수가 필요합니다. 이 함수는 DOM API를 사용하여 스타일시트를 주입하고 제거합니다.

```js:title=src/helpers.js
/* eslint-env browser */
export const clearStyles = selector => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  selectors.forEach(clearStyle);
};

const clearStyle = selector => {
  const element = document.getElementById(selector);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
};

export const addOutlineStyles = (selector, css) => {
  const existingStyle = document.getElementById(selector);
  if (existingStyle) {
    if (existingStyle.innerHTML !== css) {
      existingStyle.innerHTML = css;
    }
  } else {
    const style = document.createElement('style');
    style.setAttribute('id', selector);
    style.innerHTML = css;
    document.head.appendChild(style);
  }
};
```

그리고 CSS의 outline 자체는 [Pesticide](https://github.com/mrmrs/pesticide)가 사용하는 것을 기반으로 합니다. [outlineCSS.js](https://github.com/chromaui/learnstorybook-addon-code/blob/main/src/outlineCSS.js) 파일에서 가져오세요.

이를 통해 UI 요소 주위에 outline을 그릴 수 있습니다.

![도구를 껐다 켰다 하면 아웃라인이 나타납니다](../../images/outlines.png)
