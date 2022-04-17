---
title: '애드온 등록하기'
description: '애드온 UI를 만들고 Storybook 안에 등록하기'
commit: ''
---

`src/Tool.js`파일에서 시작해봅시다. 여기에 아웃라인 툴의 UI 코드가 위치합니다. [@storybook/components](https://www.npmjs.com/package/@storybook/components) 경로에서 import 하는 것을 주목하세요. 리액트와 이모션으로 구축된 Storybook의 컴포넌트 라이브러리입니다. Storybook 자체([데모](https://next--storybookjs.netlify.app/official-storybook/))를 구축하는데 사용하고, 또한 애드온을 만드는 데에 사용할 수 있습니다.

이번에는 `Icons` 와 `IconButton` 컴포넌트를 사용하여 아웃라인 셀렉터(selector) 툴을 만들겠습니다. `outline` 아이콘을 사용하고 적절한 이름을 가지도록 코드를 수정해보세요.

```js:title=src/Tool.js
import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { TOOL_ID } from './constants';

export const Tool = () => {
  const [{ myAddon }, updateGlobals] = useGlobals();

  const toggleMyTool = useCallback(
    () =>
      updateGlobals({
        myAddon: !myAddon,
      }),
    [myAddon]
  );

  return (
    <IconButton
      key={TOOL_ID}
      active={myAddon}
      title="Apply outlines to the preview"
      onClick={toggleMyTool}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```

manger 파일로 이동해서, 애드온을 Storybook과 함께 고유 아이디로 `ADDON_ID` 등록합니다. 
툴 역시도 고유한 아이디와 함께 등록합니다. `storybook/addon-name`과 같은 이름을 권장합니다. 애드온 키트는 탭과 패널 예시도 포함하고 있습니다. 아웃라인 애드온은 툴만을 사용하기 때문에, 나머지는 삭제해도 됩니다.


```js:title=src/preset/manager.js
import { addons, types } from '@storybook/addons';

import { ADDON_ID, TOOL_ID } from '../constants';
import { Tool } from '../Tool';

// 애드온을 등록하세요
addons.register(ADDON_ID, () => {
  // 툴을 등록하세요
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  });
});
```

match 프로퍼티를 확인하세요. 애드온을 활성화할 보기모드를 제어할 수 있습니다. 이 예제의 경우, 애드온은 스토리와 문서 모드에서 활성화될 것입니다.

이제 툴바에서 아웃라인 셀렉터(selector) 툴을 볼 수 있을겁니다.🎉

![Enable the outline tool](../../images/outline-tool.png)
