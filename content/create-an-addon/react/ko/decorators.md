---
title: 'Decorators'
tocTitle: 'Decorators'
description: 'Interacting with the stories'
commit: '0e7246a'
---

Almost there. So far, we created a tool, added it to the toolbar and it even tracks state. We now need to respond to this state and show/hide the outlines.

이제 거의 끝났습니다. 지금까지 우리는 툴을 만들어 툴바에 추가했고,

이제는 이 state에 대응하여 아웃라인을 표시하고, 숨겨야 합니다.

[Decorators](https://storybook.js.org/docs/react/writing-stories/decorators) wrap stories and add-in extra rendering functionality. We are going to create a decorator that responds to the outline global and handles CSS injection. Which in turn, draw outlines around all HTML elements.

[데코레이터](https://storybook.js.org/docs/react/writing-stories/decorators)는 story를 래핑하고 엑스트라 렌더링 기능을 추가합니다. 우리는 글로벌 아웃라인에 대응하고 CSS 인젝션을 처리하는 데코레이터를 만들 겁니다. 이것은 차례로 모든 HTML 엘리먼트 주위에 아웃라인을 그리는 것입니다.

In the previous step we defined the `outlineActive` global, let's wire it up! We can consume globals in a decorator using the `useGlobals` hook.

이전 단계에서 `outlineActive` Global을 규정했고, 정리해 보세요! `useGlobals` 훅 을 사용하여 데코레이터에서 글로벌을 소비할 수 있습니다.

```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useGlobals } from '@storybook/addons';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // Is the addon being used in the docs panel
  const isInDocs = context.viewMode === 'docs';

  useEffect(() => {
    // Execute your side effect here
    // For example, to manipulate the contents of the preview
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

## Injecting the outline CSS
## 아웃라인 CSS 삽입하기

Adding and clearing styles is a side-effect, therefore, we need to wrap that operation in `useEffect`. Which in turn is triggered by the `outlineActive` global. The Kit code comes with an example but, let's update it to handle the outline CSS injection.

스타일 추가 및 클리어는 부작용이기 때문에 이 작업을 `useEffect`에서 wrap해야 합니다. 다음으로 `outlineActive` global에 의해 트리거됩니다. Kit 코드에는 예시가 포함되어 있는데, outline CSS 인젝션을 처리하도록 업데이트 해보세요.

```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useMemo, useGlobals } from '@storybook/addons';

import { clearStyles, addOutlineStyles } from './helpers';
import outlineCSS from './outlineCSS';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // Is the addon being used in the docs panel
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

Ok, that seems like a big jump. Let’s walk through all the changes.

좋습니다, 큰 도약을 한 것 같습니다. 변경된 것을 보세요.

The addon can be active in both docs and story view modes. The actual DOM node for the preview `iframe` is different in these two modes. In fact, the docs mode renders multiple story previews on one page. Therefore, we need to pick the appropriate selector for the DOM node where the styles will be injected. Also, the CSS needs to be scoped to that particular selector.

애드온은 문서 및 story 뷰 모드 모두에서 활성화될 수 있습니다. 미리 보기 `iframe`의 실제 DOM 노드는 이 두 모드에서 서로 다릅니다. 실제로, 워드프로세서 모드는 한 페이지에 여러 개의 스토리 프리뷰를 렌더링합니다. 따라서 스타일을 주입할 DOM 노드에 적합한 선택기를 선택해야 합니다. 또한 CSS는 특정 선택기로 범위를 지정할 필요가 있습니다.

<div class="aside"> 💡 <code>useMemo</code> and <code>useEffect</code> here come from <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a> and not React. This is because the decorator code is running in the preview part of Storybook. That's where the user's code is loaded which may not contain React. Therefore, to be framework agnostic, Storybook implements a React-like hook library which we can use!</div>

<div class="aside"> 💡 여기서 <code>useMemo</code> 및 <code>useEffect</code>는 <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a>에서 가져온 것이며 반응하지 않습니다. 왜냐하면 스토리북 미리보기 부분에서 데코레이터 코드가 실행 중이기 때문입니다. 데코레이터 코드는 리액트를 포함하지 않을 수 있는 사용자 코드가 로드되는 곳입니다. 따라서 프레임워크에 구애받지 않기 위해 Storybook은 사용할 수 있는 React와 같은 hook 라이브러리를 구현합니다.</div>

Next, as we inject the styles into the DOM, we need to keep track of them to clear them when the user toggles it off or switches the view mode.

다음으로, DOM에 스타일을 주입할 때, 사용자가 스타일을 끄거나 보기 모드를 전환할 때 지울 수 있도록 스타일을 추적해야 합니다.

To manage all this CSS logic, we need a few helpers. These use DOM APIs to inject and remove stylesheets.

이 모든 CSS 로직을 관리하려면 도우미가 필요합니다. DOM API를 사용하여 스타일시트를 주입하고 제거합니다.

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

And the outline CSS itself is based on what [Pesticide](https://github.com/mrmrs/pesticide) uses. Grab it from [outlineCSS.js](https://github.com/chromaui/learnstorybook-addon-code/blob/main/src/outlineCSS.js) file.

그리고 CSS의 outline 자체는 [Pesticide](https://github.com/mrmrs/pesticide)가 사용하는 것에 기초합니다. [outlineCSS.js](https://github.com/chromaui/learnstorybook-addon-code/blob/main/src/outlineCSS.js) 파일에서 가져오세요.

All together, this enables us to draw outlines around the UI elements.

이를 통해 UI 엘리먼트 주위에 outline을 그릴 수 있습니다.

![toggling the tool toggles the outlines](../../images/outlines.png)
