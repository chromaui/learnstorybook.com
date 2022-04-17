---
title: '프리셋'
tocTitle: '프리셋'
description: '모든 스토리에 아웃라인을 보여줄 수 있습니다.'
---

이제 데코레이터 부분이 끝났으니, preset 기능을 사용해 모든 스토리를 감싸 봅시다. 

프리셋을 사용하면 다양한 스토리북의 설정 값들을 결합할 수 있고, 한번에 적용할 수 있습니다. 일부 addon은 단순히 스토리북의 구성만 담당하고, UI가 존재하지 않습니다. 예를 들어, <a href="https://www.npmjs.com/package/@storybook/preset-create-react-app">preset-create-react-app</a>와 <a href="https://www.npmjs.com/package/storybook-preset-nuxt">preset-nuxt</a>가 그렇습니다. 이러한 요소를 <a href="https://storybook.js.org/docs/react/addons/writing-presets">프리셋 애드온</a>이라고 합니다.

프리셋은 두 가지로 분류할 수 있습니다:

1. addon 등록을 위한 `manager.js` 
2. 글로벌 데코레이터를 명시하기 위한 `preview.js`

모든 스토리를 자동으로 감싸주는 `withGlobals` 데코레이터를 사용해 디자인 미리보기를 업데이트 해주세요.

```js:title=src/preset/preview.js
import { withGlobals } from '../withGlobals';

export const decorators = [withGlobals];
```

<div class="aside">💡 애드온 키트의 <code>withRoundTrip</code> 데코레이터는 애드온과 스토리 간 양방향 소통을 위한 예시입니다. 하지만 애드온에 꼭 필요한 것은 아니며 삭제할 수 있습니다.</div>

![도구를 껐다 켰다 하면 아웃라인이 나타납니다](../../images/toggle.gif)

## 최상위 단계 프리셋

카탈로그에 애드온을 추가하기 앞서, 짚고 넘어갈만한 항목이 하나 있습니다. 각각의 스토리북의 애드온에는 사용자의 추가 환경설정 없이 애드온을 등록하기 위해 최상위 단계 프리셋이 포함되어 있어야 합니다. 운좋게도 이것은 우리가 [셋업 (Set up)장](/create-an-addon/react/en/getting-started/)에서 레포지토리를 클론할 때 설정되어 있습니다. 최상위 폴더에서 `preset.js`파일을 열면 다음과 같은 내용을 확인할 수 있습니다:

```js:title=preview.js
function config(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/manager")];
}

module.exports = {
  managerEntries,
  config,
};
```

<div class="aside">
 💡 프리셋에 대해 더 자세히 알고 싶다면 <a href="https://storybook.js.org/docs/react/addons/writing-presets#manager-entries">스토리북 공식문서</a>를 읽어보세요.
</div>

성공했습니다! 이제 로컬저장소의 스토리북에 완전한 기능을 하는 애드온이 생겼습니다. 마지막 장에서는, 카탈로그에 애드온을 나열하는 법을 배워볼 것입니다. 그렇게 하면 팀과 스토리북 커뮤니티와 공유할 수 있게 됩니다.