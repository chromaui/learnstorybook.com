---
title: '리액트(React)를 위한 스토리북(Storybook) 튜토리얼'
tocTitle: '시작하기'
description: '스토리북(Storybook)을 개발 환경에 설치해보세요'
commit: 'bf3514f'
---

스토리북(Storybook)은 개발 모드에서 앱과 함께 실행됩니다. 스토리북은 비즈니스 로직과 맥락(context)으로부터 분리된 UI 컴포넌트를 만들 수 있도록 도와줍니다. 현재 문서는 리액트(React)를 위해 작성되었습니다. 그 밖의 [React Native](/intro-to-storybook/react-native/en/get-started), [Vue](/intro-to-storybook/vue/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started) 및 [Ember](/intro-to-storybook/ember/en/get-started)에 대한 다른 문서도 존재합니다.

![스토리북과 여러분의 앱](/intro-to-storybook/storybook-relationship.jpg)

## 리액트 스토리북 설정

우리의 개발 환경에 빌드(build) 프로세스를 설정하려면 몇 가지 단계를 따라야 합니다. 우선 우리는 [degit](https://github.com/Rich-Harris/degit)을 사용하여 빌드 시스템을 설정하려고 합니다. 이 패키지를 사용해 "템플릿"(일부 기본 구성으로 부분적으로 구축된 애플리케이션)을 다운로드해 개발 작업 흐름(workflow)을 빠르게 파악할 수 있습니다.

다음 명령을 실행해주세요:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 템플릿에는 이 튜토리얼 버전에 필요한 스타일, assets 및 기본 구성이 포함되어 있습니다.
</div>

이제 다양한 환경에서 애플리케이션이 올바르게 작동하는지 아래 명령어를 통해 빠르게 확인할 수 있습니다:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

우리의 주요 프론트엔드 애플리케이션 방식: 컴포넌트 개발(Storybook)과 애플리케이션 자체 개발이 있습니다.

![2가지 양식](https://storybook.js.org/tutorials/intro-to-storybook/app-main-modalities-react.png)

앱의 어느 부분을 작업하느냐에 따라, 이 중 하나 또는 여러 개를 동시에 실행하고 싶을 수 있습니다. 현재 우리의 초점은 단일 UI 컴포넌트를 만드는 것이므로, Storybook만 실행할 것입니다.

## 변경 사항 커밋(commit)

이 단계에서는 파일을 로컬 저장소(local repository)에 추가하는 것이 안전합니다. 다음 명령을 실행하여 로컬 저장소를 초기화하고 지금까지 수행한 변경 사항(내용)을 추가 및 commit하세요.

```shell
$ git init
```

뒤이어:

```shell
$ git add .
```

그 다음에:

```shell
$ git commit -m "first commit"
```

그리고 마지막으로:

```shell
$ git branch -M main
```

그럼 이제 우리의 첫 번째 컴포넌트를 만들어봅시다!
