---
title: 'Svelte를 위한 Storybook 튜토리얼'
tocTitle: '시작하기'
description: '개발 환경에 Storybook을 설정해보세요.'
---

Storybook은 개발 모드에서 애플리케이션과 함께 실행됩니다. 이를 통해 비즈니스 로직이나 애플리케이션의 컨텍스트(context)에서 분리된 상태로 UI 컴포넌트를 구축할 수 있습니다. 현재 문서는 Intro to Storybook 튜토리얼의 Svelte 버전입니다; 다른 프레임워크에 대한 튜토리얼도 제공됩니다: [Vue](/intro-to-storybook/vue/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [React](/intro-to-storybook/react/en/get-started), [React Native](/intro-to-storybook/react-native/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Svelte Storybook 설정하기

빌드 프로세스를 환경에 맞게 설정하려면 몇 가지 단계를 따라야 합니다. 우선 [degit](https://github.com/Rich-Harris/degit)를 사용하여 빌드 시스템을 초기화합니다. 이 패키지를 통해 _"템플릿"_(기본 설정이 포함된, 부분적으로 완성된 애플리케이션)을 다운로드하여 개발 작업 흐름을 빠르게 파악할 수 있습니다.

다음 명령을 실행해주세요:

```shell:clipboard=false
# 애플리케이션 생성:
npx degit chromaui/intro-storybook-svelte-template taskbox

cd taskbox

# 의존성 설치
yarn
```

<div class="aside">
💡 템플릿에는 이 튜토리얼 버전에 필요한 스타일, assets 및 필수적인 기본 설정이 포함되어 있습니다.
</div>

이제 애플리케이션이 다양한 환경에서 제대로 작동하는지 빠르게 확인해볼 수 있습니다:

```shell:clipboard=false
# 포트 6006에서 component explorer 실행:
yarn storybook

# 포트 5173에서 프론트엔드 앱 실행:
yarn dev
```

프론트엔드 앱의 주요 모드는 컴포넌트 개발(Storybook)과 애플리케이션 실행입니다.

<!-- Needs to be updated and the link updated to ![Main modalities](/intro-to-storybook/app-main-modalities-svelte.png) -->

![3 modalities](/intro-to-storybook/app-three-modalities-svelte.png)

앱의 어느 부분을 작업하느냐에 따라 하나 또는 여러 개의 모드를 동시에 실행할 수 있습니다. 현재는 단일 UI 컴포넌트를 만드는 것이 목표이므로, Storybook만 실행하겠습니다.

## 변경 사항 커밋하기

이 시점에 파일을 로컬 저장소에 추가해도 안전합니다. 다음 명령을 실행하여 로컬 저장소를 초기화하고, 지금까지 작업한 변경 사항을 추가 및 커밋하세요.

```shell
git init
```

이어서:

```shell
git add .
```

다음으로:

```shell
git commit -m "first commit"
```

마지막으로:

```shell
git branch -M main
```

이제 첫 번째 컴포넌트를 만들어보겠습니다!
