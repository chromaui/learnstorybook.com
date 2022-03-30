---
title: '설치'
description: '애드온 키트로 시작하기'
commit: ''
---

![](../../images/addon-kit-demo.gif)

우리는 [애드온 키트](https://github.com/storybookjs/addon-kit) 를 사용하여 프로젝트를 부트스트랩 합니다. Storybook 애드온을 구축하는 데 필요한 모든 것을 제공합니다.

- 📝 개발 모드에서 실시간 편집
- ⚛️ UI를 위한 React/JSX 지원
- 📦 [Babel](http://babeljs.io/)을 사용한 트랜스파일링 및 번들링
- 🏷 플러그인 메타데이터
- 🚢 [Auto](https://github.com/intuit/auto)를 사용하는 배포 관리 

시작하기에 앞서, [애드온 키트 레포지토리](https://github.com/storybookjs/addon-kit)에서 **use thie template** 버튼을 클릭하세요. 그러면 모든 애드온 키트가 포함된 새로운 레포지토리가 생성됩니다.

![](../../images/addon-kit.png)

다음으로, 레포지토리를 클론하고 의존성(dependency)을 설치합니다.

```bash
yarn
```

애드온 키트는 기본으로 타입스크립트를 사용합니다. 하지만 튜토리얼의 목적을 위해 eject 명령어를 사용해서 보일러플레이트 코드를 자바스크립트로 바꿔주세요.

```bash
yarn eject-ts
```

이 명령어는 모든 코드를 자바스크립트로 변환해줍니다. 파괴적일 수 있는 과정이라, 다른 어느 코드를 작성 하기전에 이 명령어를 먼저 실행하는 것이 좋습니다.

마지막으로, 개발 모드를 시작합니다. Storybook을 시작하고 Babel을 보기 모드에서 볼 수 있습니다.

```bash
yarn start
```

애드온 코드는 'src' 폴더에 있습니다. 포함된 보일러플레이트 코드는 세개의 UI 패러다임과 다른 개념들, 예를 들어 상태 관리나 스토리에 반응하기 등을 보여주고 있습니다. 다음 장에서는 이에 대해 더 자세히 살펴볼 것입니다.
