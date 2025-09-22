---
title: '뷰(Vue)를 위한 스토리북(Storybook) 튜토리얼'
tocTitle: '시작하기'
description: '스토리북(Storybook)을 개발 환경에 설치해보세요'
commit: 'e2984d1'
---

Storybook은 개발 모드에서 애플리케이션과 함께 실행됩니다. 이를 통해 애플리케이션의 비즈니스 로직이나 컨텍스트와 분리된 상태에서 UI 컴포넌트를 개발할 수 있습니다. 이 튜토리얼은 Vue 버전에 해당하며, [React](/intro-to-storybook/react/ko/get-started), [React Native](/intro-to-storybook/react-native/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started) 버전도 있습니다.

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Vue Storybook 설정하기

우리는 몇 가지 단계를 거쳐 빌드 프로세스를 개발 환경에 설정해야 합니다.  
먼저 [degit](https://github.com/Rich-Harris/degit)을 사용해 빌드 시스템을 구성하겠습니다. 이 패키지를 사용하면 "템플릿"(기본 설정이 포함된 일부 완성된 애플리케이션)을 다운로드하여 개발 작업을 빠르게 시작할 수 있습니다.

다음 명령어를 실행해주세요:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 이 템플릿에는 이 튜토리얼 버전에 필요한 스타일, 에셋, 최소한의 필수 설정이 포함되어 있습니다.
</div>

이제 다양한 환경에서 애플리케이션이 올바르게 작동하는지 아래 명령어를 통해 빠르게 확인할 수 있습니다:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

우리의 주요 프론트엔드 애플리케이션 방식: 컴포넌트 개발(Storybook)과 애플리케이션 자체 개발이 있습니다.

![Main modalities](/intro-to-storybook/app-main-modalities-vue.png)

현재 작업하는 앱의 부분에 따라 하나 이상의 모드를 동시에 실행할 수도 있습니다.
하지만 지금은 단일 UI 컴포넌트를 만드는 것이 목표이므로 Storybook만 실행하겠습니다.

## 변경 사항 커밋하기(commit)

이 시점에서 작업한 파일을 로컬 저장소에 추가해도 안전합니다. 다음 명령어로 로컬 저장소를 초기화하고, 변경 사항을 추가 및 커밋하세요.

```shell
git init
```

그다음:

```shell
git add .
```

그리고:

```shell
git commit -m "first commit"
```

마지막으로:

```shell
git branch -M main
```

이제 첫 번째 컴포넌트를 만들어봅시다!
