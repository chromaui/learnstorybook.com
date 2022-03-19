---
title: 'state 추적하기'
tocTitle: 'state 추적하기'
description: '애드온의 state를 Manager와 Preview로 관리하기'
commit: 'ffd9ccb'
---

리액트는 [hooks](https://reactjs.org/docs/hooks-state.html#gatsby-focus-wrapper) 로 만들어졌고 그 예로는 state를 관리하기 위한 `useState`이 있습니다. 보통은 이것으로 충분합니다만, 이 경우에는 조금 복잡합니다. 잠시 스토리북이 어떻게 구축되어 있는지를 이야기 해보겠습니다.

## 스토리북 구조의 기초

![](../../images/manager-preview.jpg)

겉으로 보기에는 스토리북은 통일화된 유저 인터페이스(UI)를 보여줍니다. 그러나 안에서는, 두 세그먼트로 나뉘어져, **커뮤니케이션 채널을 통해서 이야기를 나눕니다:**

- **A Manager:** 스토리북의 검색, 네비게이션, 툴바, 애드온이 렌더링되는 UI 입니다.
- **Preview:** 스토리들이 렌더링되는 아이프레임.

토클 state를 추적해야하고 **또** 그 state를 Manager와 Preview에 모두 공유해야합니다. 그리하여, `useState` 대신 `@storybook/api`의 `useGlobals`를 사용하겠습니다.

## 전역 state 추적하기

[Globals](https://storybook.js.org/docs/react/essentials/toolbars-and-globals/#globals) 는 “전역” (스토리에 국한된 것이 아닌) 컨텍스트를 스토리북에서 가집니다. 다른 스토리와 애드온과 데코레이터 사이에서 정보를 공유하기 편한 방법들입니다. `useGlobals` 훅은 이 전역 컨텍스트에 대한 접근을 당신이 만드는 툴 안에서 허락합니다.

<div class="aside">다음의 <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a> 에서 API와 관련된 애드온들을 확인하세요.</div>

애드온 키트는 `Tool`을 미리 설정하여 globals를 사용합니다. 전역을 재정의하여 더 정확하게 이것이 무엇을 하는지 반영해봅시다. `toggleOutline` 기능은 사용자로 하여금 아웃라인 애드온을 키고 끄게 토글하는 것을 허용합니다. 👉🏽🔘

![The tool track toggle state](../../images/track-state.gif)

```diff:title=src/Tool.jsf
import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { TOOL_ID } from './constants';

export const Tool = () => {
+  const [{ outlineActive }, updateGlobals] = useGlobals();

+  const toggleOutline = useCallback(
    () =>
      updateGlobals({
+        outlineActive: !outlineActive,
      }),
+    [outlineActive]
  );

  return (
    <IconButton
      key={TOOL_ID}
+      active={outlineActive}
      title="Apply outlines to the preview"
+      onClick={toggleOutline}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```
