---
title: 'UI 배포하기'
tocTitle: '배포'
description: '디자인 시스템을 패키징하고 다른 앱에 임포트하는 법 알아보기'
commit: 3a5cd35
---

설계 관점에서 보았을 때, 디자인 시스템은 그저 또 다른 프런트엔드 디펜던시입니다. moment나 lodash처럼 유명한 디펜던시들과 다를 바가 없습니다. UI 컴포넌트는 코드로 이루어졌기 때문에 기존의 기술로 코드를 재사용할 수 있습니다.

이 장에서는 UI 컴포넌트를 패키징하는 것부터 다른 앱에 컴포넌트를 임포트하는 것까지 디자인 시스템을 배포할 것입니다. 또한, 릴리즈와 버전 관리를 효율적으로 하면서 시간을 절약하는 기술을 알아봅니다.

![Propagate components to sites](/design-systems-for-developers/design-system-propagation.png)

## 디자인 시스템 패키징하기

조직은 여러 앱에 걸쳐 수천개의 UI 컴포넌트를 가지고 있습니다. 앞 장에서는 가장 흔히 사용하는 컴포넌트들을 디자인 시스템에 포함시켰습니다. 이제는 그 컴포넌트들을 다시 앱으로 불러옵니다. 

우리의 디자인 시스템은 npm이라는 자바스크립트 패키지 매니저를 사용합니다. npm을 사용해서 배포, 버전, 디펜던시를 관리할 수 있습니다.

디자인 시스템을 패키징하는 방법은 여러가지입니다. 다양한 접근 방법을 보고 싶다면 Lonely Planet, Auth0, Salesforce, Github, Microsoft가 갖춘 디자인 시스템을 살펴보세요. 어떤 팀은 각 컴포넌트를 개별적인 패키지로 관리합니다. 다른 팀은 모든 컴포넌트를 하나의 패키지에 넣기도 합니다.

꾸준히 성장할 수 있는 디자인 시스템을 위해 가장 확실한 방법은 다음 사항들을 포함하는 일정한 버전의 패키지를 만드는 것입니다. 

- 🏗 공통 UI 컴포넌트
- 🎨 디자인 토큰 (예를 들어, style variables)
- 📕 문서화

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## 디자인 시스템 Export 준비하기 

create-react-app을 이용해서 디자인 시스템을 만들고 있기 때문에 create-react-app의 초기 상태와 스크립트들을 정리해야 합니다. 

우선, 기초적인 README.md 파일을 추가합니다.

```markdown
# 스토리북 디자인 시스템 배우기

스토리북 디자인 시스템 배우기는 [스토리북 디자인 시스템](https://github.com/storybookjs/design-system/)의 일부분입니다. 어떻게 하면 가장 실용적이고 효율적인 방법으로 디자인 시스템을 만들고 배포할 수 있는지 궁금해할 사람들을 위해 만든 교육 자료입니다.

자세한 사항은 [Learn Storybook](https://learnstorybook.com)을 참고하세요.
```

그 다음으로 우리의 디자인 시스템의 공통적인 시작점을 만들기 위해 `src/index.js`파일을 만듭니다. 이 파일로부터 모든 디자인 토큰과 컴포넌트를 export할 것입니다.

```javascript
//src/index.js

import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

자바스크립트를 컴파일하고 배포하기 위해 `@babel/cli`와 `cross-env`에 개발 디펜던시를 추가합니다.

```bash
yarn add --dev @babel/cli cross-env
```

패키지를 빌드하기 위해 `package.json`에 스크립트를 추가합니다. 이 스크립트는 `dist` 폴더 안에 소스 디렉터리를 구축합니다.

```json
{
  "scripts": {
    "build": "cross-env BABEL_ENV=production babel src -d dist",
      ...
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

이제 `yarn build`를 실행해서 `dist` 디렉터리에 코드를 빌드합니다. 참고로 이 `dist` 디렉터리를 `.gitignore` 파일에 추가해야 합니다.

```
// ..
dist
```

#### 배포를 위해 패키지 메타 데이터 추가하기

마지막으로 사용자가 필요한 정보를 모두 갖출 수 있도록 `package.json` 파일을 조금 수정해야 합니다. 가장 쉬운 방법은 `yarn init` 명령어를 실행하는 것입니다. 이 명령어는 배포를 위해 패키지의 초기 상태를 설정(initialize)합니다.

```bash
yarn init

yarn init v1.16.0
question name (learnstorybook-design-system):
question version (0.1.0):
question description (Learn Storybook design system):
question entry point (dist/index.js):
question repository url (https://github.com/chromaui/learnstorybook-design-system.git):
question author (Tom Coleman <tom@thesnail.org>):
question license (MIT):
question private: no
```

이 명령어는 여러 질문을 하는데, 몇몇 질문은 이미 예상된 답을 제시하고, 다른 몇 개는 우리가 직접 생각해서 적어야 합니다. 사용자는 npm 패키지를 위해 독특한 이름을 정해야 합니다. 예를 들어 `learnstorybook-design-system`은 사용할 수 없고, `<사용자-이름>-learnstorybook-design-system`은 가능합니다.

그러고 나면 `package.json`은 우리가 입력한 답변들로 업데이트됩니다.

```json
{
  "name": "learnstorybook-design-system",
  "description": "Learn Storybook design system",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/chromaui/learnstorybook-design-system.git"
  // ...
}
```

이제 패키지 준비는 끝났으니, 처음으로 npm에 배포해 볼 수 있습니다!

## Auto로 배포 관리하기

변경된 부분들을 기록하는 changelog를 업데이트하고, 적정한 버전 숫자를 입력하고, 그 버전 숫자와 repository에 있는 커밋을 연결해주는 git tag를 생성하는 과정을 거쳐서 npm에 릴리즈를 배포합니다. 이때, 이러한 과정을 위해 만들어진 [Auto](https://github.com/intuit/auto)라는 오픈 소스 툴을 이용할 것입니다. 

Auto를 설치합니다.

```bash
yarn add --dev auto
```

Auto는 릴리즈 관리에 해당하는 다양한 업무에 유용한 커맨드 라인 툴입니다. 자세한 사항은 [Auto의 문서 사이트](https://intuit.github.io/auto/)에서 확인할 수 있습니다.

#### 깃헙 토큰, npm 토큰 생성하기

앞으로의 몇몇 단계에서 Auto는 깃헙과 npm과 통신해야 합니다. 원활한 통신을 위해서 개인 접근 토큰(personal access token)이 필요합니다. [깃헙 토큰 설정 페이지](https://github.com/settings/tokens)에서 토큰을 받을 수 있습니다. 토큰은 `repo` 스코프를 가져야 합니다.

npm 토큰은 이 URL에서 생성할 수 있습니다: https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

'Read and Publish' 기능이 허용되는 토큰을 발급해야 합니다. 

이 토큰을 프로젝트의 `.env` 파일에 추가합니다.

```
GH_TOKEN=<Github에서 발급받은 토큰 값>
NPM_TOKEN=<npm에서 발급받은 토큰 값>
```

`.env` 파일을 `.gitignore`에 추가해서 혹시나 실수로라도 이 토큰값들을 모든 사람이 볼 수 있는 오픈 소스 리포지터리에 올리는 일이 없도록 주의합니다. 매우 중요한 부분이니 유의하세요. 만약 다른 관리자들이 로컬 환경에서 패키지를 배포해야 한다면 그들은 아래 과정을 통해 따로 본인만의 `.env` 파일을 설정해야 합니다. (이후에, 풀 리퀘스트를 마스터 브랜치에 합쳤을 때 자동으로 배포하는 방법도 알아볼 것입니다.)

```
dist
.env
```

#### 깃헙에 레이블 생성하기

Auto를 사용할 때 가장 먼저 깃헙에 몇 가지 레이블을 만들어야 합니다. (다음 장에서 설명할) 패키지를 변경할 때 레이블을 사용하게 될 것입니다. `Auto`는 레이블을 이용해서 패키지 버전을 효율적으로 업데이트하고 changelog와 릴리즈 노트를 생성합니다.

```bash
yarn auto create-labels
```

이제 깃헙을 살펴보면 `Auto`가 추천하는 레이블 종류를 볼 수 있습니다.

![Set of labels created on GitHub by auto](/design-systems-for-developers/github-auto-labels.png)

앞으로의 모든 풀 리퀘스트들은 merge를 하기 전에 이 레이블 중 하나를 선택해서 태그해야 합니다 - `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation`

#### 직접 Auto를 이용해서 첫 릴리즈 배포하기

차후에는 `Auto`에서 스크립트를 통해 새로운 버전 숫자들을 계산할 것입니다. 하지만 첫 번째 릴리즈에서는 명령어를 직접 입력해서 릴리즈 배포가 어떻게 실행되는지 알아봅시다. 첫 changelog를 생성합니다.

```bash
yarn auto changelog
```

이 명령어는 우리가 여태까지 입력한 모든 커밋에 대한 굉장히 긴 changelog 리스트를 만듭니다. 만약 우리가 마스터 브랜치에 계속 푸쉬를 하고 있었다면, 하지 말라는 경고를 합니다.

혹시나 실수하지 않기 위해 자동 생성된 changelog를 사용하는 것이 유용하지만, 사용자에게 가장 알맞도록 changelog를 수정하고 메시지를 변경하는 것도 좋은 방법입니다. 이런 경우에는 사용자가 모든 커밋에 대해 알 필요가 없습니다. 첫 번째로 만든 v0.1.0 버전에 간단한 메시지를 만들어 봅니다. 다음 명령어를 통해 `Auto`가 방금 생성한 커밋을 undo 하되 변경사항은 유지합니다.

```bash
git reset HEAD^
```

그다음 changelog를 업데이트하고 커밋합니다.

```
# v0.1.0 (Tue Sep 03 2019)

- `Avatar`, `Badge`, `Button`, `Icon`, `Link` 컴포넌트를 사용해서 디자인 시스템의 첫 버전을 만들었다.

#### 작성자: 1
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
```

이 changelog를 git에 추가합니다. CI 플랫폼이 이 커밋을 무시하도록 `[skip ci]`를 입력해야 합니다. 그렇지 않으면 빌드와 배포 과정에 추가되어 버립니다.

```bash
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

이제 배포 단계입니다.

```bash
npm version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish
```

그리고 Auto를 통해 깃헙에 릴리즈를 생성합니다. 

```bash
git push --follow-tags origin master
yarn auto release
```

와우! npm에 패키지를 성공적으로 올리고 깃헙에 릴리즈를 만들었습니다.

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

![Release published to GitHub](/design-systems-for-developers/github-published-release.png)

`auto`가 첫 번째 릴리즈에는 릴리즈 노트를 자동 생성해주지만, 우리의 첫번째 버전에 알맞게 조금 수정했다는 걸 유의하세요.

#### Auto 스크립트 설정하기 

위와 같은 과정을 나중에 패키지를 배포할 때 똑같이 실행하도록 Auto를 설정해 봅니다. `package.json` 파일에 아래 스크립트를 추가합니다.

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

이제 `yarn release` 명령어를 실행하면 (자동 생성된 changelog를 사용하는 것을 제외하고) 위의 단계들이 모두 자동으로 진행됩니다. `master`에 푸쉬 된 모든 커밋들이 배포됩니다.

축하합니다! 수동으로 디자인 시스템 릴리즈를 배포할 수 있는 인프라 구조를 구축했습니다! 이제 지속적 통합(CI)을 할 수 있도록 릴리즈를 자동화하는 법을 배워봅니다.

## 릴리즈 자동 배포하기

우리는 지속적인 통합을 위해 Github Actions를 사용합니다. 하지만 진행하기 이전에, 위에서 발급한 Github 토큰과 npm 토큰을 안전하게 저장합니다. Actions를 사용할 때 이 토큰들이 필요합니다.

#### Github Secrets에 토큰 추가하기

Github Secrets에 우리의 저장소에 관련된 민감한 정보들을 저장할 수 있습니다. 브라우저에서 깃헙 저장소를 열어보세요. 

⚙️ Settings 설정 탭을 클릭하고, 사이드바에 있는 Secrets 링크를 클릭하세요. 다음과 같은 화면이 뜰 것입니다.

![Empty GitHub secrets page](/design-systems-for-developers/github-empty-secrets-page.png)

**New secret** 버튼을 클릭합니다. `NPM_TOKEN`을 이름으로 지정하고 위에서 사용했던 npm 토큰을 붙여넣습니다.

![Filled GitHub secrets form](/design-systems-for-developers/github-secrets-form-filled.png)

npm secret을 리포지터리에 추가하면 `secrets.NPM_TOKEN`을 접근할 수 있습니다. 깃헙 토큰을 위해 또 다른 secret을 만들 필요는 없습니다. 모든 깃헙 사용자들은 자동으로 본인의 계정과 연동된 `secrets.NPM_TOKEN`를 발급받습니다.

#### GitHub Actions로 릴리즈 자동화하기

우리는 풀 리퀘스트가 merge 될 때마다 디자인 시스템을 자동으로 배포하고 싶습니다. 이전 장에서 <a href="https://www.learnstorybook.com/design-systems-for-developers/react/en/review/#publish-storybook">스토리북을 배포할 때</a> 사용한 폴더 안에 `push.yml`라는 파일을 생성하고 아래 내용을 추가합니다.

```yml
# .github/workflows/push.yml

## name of our action
name: Release

# the event that will trigger the action
on:
  push:
    branches: [master]

# what the action will do
jobs:
  release:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # this check needs to be in place to prevent a publish loop with auto and github actions
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
      - name: Prepare repository
        run: git fetch --unshallow --tags
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Cache node modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: yarn-deps-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            yarn-deps-${{ hashFiles('yarn.lock') }}

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          yarn release
```

이 변경사항을 저장하고 원격 저장소에 커밋합니다.

성공! 이제 사용자가 마스터에 풀 리퀘스트를 merge 할 때 마다 새로운 버전이 배포되고 사용자가 추가한 레이블에 맞춰서 버전 숫자가 업데이트됩니다. 

<div class="aside">디자인 시스템을 확장하는데 유용할만한 Auto의 다양한 기능들을 모두 알아보지는 못했습니다. 자세한 정보는 <a href="https://github.com/intuit/auto">이 문서를</a>. 참고하세요. </div>

![Import the design system](/design-systems-for-developers/design-system-import.png)

## 앱에 디자인 시스템 임포트하기

이제 디자인 시스템이 온라인에서 실행되고 있으니 디펜던시를 설치하고 UI 컴포넌트를 사용하는 것은 어렵지 않습니다.

#### 예제로 사용할 앱 준비하기

이 튜토리얼의 앞부분에서 우리는 프런트 엔드 기술로 인기가 많은 React와 styled-components를 기준으로 설정했습니다. 즉, 디자인 시스템의 장점을 최대한 많이 사용하기 위해서는 우리의 예제 앱도 React와 styled-components를 사용해야 합니다.

<div class="aside">Svelte나 다른 웹 컴포넌트들을 사용하면 프레임워크에 구애받지 않는 UI 컴포넌트를 만들 수도 있습니다. 하지만 그 방법들은 만들어진 지 얼마 되지 않았거나, 문서화가 부족하거나 다방면으로 적용되기 어려울 수 있기 때문에 이 가이드에는 아직 포함하지 않았습니다. </div>

이 예제 앱은 [컴포넌트 주도 개발 Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)를 할 수 있도록 스토리북을 사용합니다. 컴포넌트 주도 개발은 컴포넌트로 바닥부터 시작해서 페이지로 끝내는 UI 구축 방법입니다. 데모에서 우리는 두 개의 스토리북을 번갈아 가며 실행할 것입니다. 하나는 예제 앱, 하나는 디자인 시스템을 위한 것입니다.

깃헙에서 아래 예제 앱 저장소를 clone 해줍니다.

```bash
git clone https://github.com/chromaui/learnstorybook-design-system-example-app.git
```

디펜던시를 설치하고 앱에서 스토리북을 시작합니다.

```bash
yarn install
yarn storybook
```

앱이 사용하는 간단한 컴포넌트들의 스토리가 실행되는 게 보일 것입니다.

![Initial storybook for example app](/design-systems-for-developers/example-app-starting-storybook.png)

<h4>디자인 시스템 통합하기</h4>

배포한 디자인 시스템을 디펜던시에 추가합니다.

```bash
yarn add <your-username>-learnstorybook-design-system
```

디자인 시스템 컴포넌트를 임포트하기 위해 예제 앱의 `.storybook/main.js` 파일을 업데이트합니다.

```javascript
// .storybook/main.js

module.exports = {
  stories: [
    '../src/**/*.stories.js',
    '../node_modules/<your-username>-learnstorybook-design-system/dist/**/*.stories.(js|mdx)',
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

전역 데코레이터를 `.storybook/preview.js` 설정 파일에 추가해서 디자인 시스템이 지정한 전역 스타일을 사용할 수도 있습니다. 파일을 아래처럼 수정해 주세요.

```javascript
// .storybook/preview.js

import React from 'react';
import { addDecorator } from '@storybook/react';
import { global as designSystemGlobal } from '<your-username>-learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

![Example app storybook with design system stories](/design-systems-for-developers/example-app-storybook-with-design-system-stories.png)

이제 예제 앱을 개발하면서 동시에 디자인 시스템 컴포넌트와 문서도 볼 수 있습니다. 기능을 구현하는 중에 디자인 시스템을 볼 수 있다면 개발자들이 스스로 컴포넌트를 만드느라 시간을 낭비하지 않고 만들어진 컴포넌트를 재사용 가능합니다.

만약 4장에서 <a href="https://www.learnstorybook.com/design-systems-for-developers/react/en/review/#publish-storybook">Chromatic</a>에 스토리북을 배포했다면 본인이 만든 디자인 시스템의 스토리북을 볼 수 있습니다. 

우리가 만든 디자인 시스템 중 Avatar 컴포넌트를 예제 앱의 UserItem 컴포넌트에 사용해 보도록 합니다. UserItem은 이름과 프로필 사진을 포함한 사용자의 정보를 보여줘야 합니다.

본인의 에디터에서 UserItem.js 컴포넌트를 찾아보세요. 그리고 코드가 바뀔 때 핫 모듈 재로딩으로 업데이트가 바로 되는지 스토리북 사이드바에서 UserItem을 찾아보세요.

Avatar 컴포넌트를 임포트합니다.

```javascript
// src/components/UserItem.js

import { Avatar } from '<your-username>-learnstorybook-design-system';
```

Avatar를 사용자 이름 옆에 그려줍니다.

```javascript
//src/components/UserItem.js

import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
    <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

저장하면 UserItem 컴포넌트가 스토리북에서 업데이트되고 새로운 Avatar 컴포넌트가 보입니다. UserItem이 UserList에 속해 있기 때문에 UserList에서도 Avatar를 볼 수 있습니다.

![Example app using the Design System](/design-systems-for-developers/example-app-storybook-using-design-system.png)

짜잔! 디자인 시스템 컴포넌트를 예제 앱에 성공적으로 임포트했습니다. 디자인 시스템에서 Avatart 컴포넌트 관련된 업데이트를 배포하면 앱의 패키지를 업데이트 할 때 예제 앱에서 그 변경 사항을 확인할 수 있습니다. 

![Distribute design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## 디자인 시스템 워크플로우 마스터하기

디자인 시스템 워크플로우는 스토리북에서 UI 컴포넌트를 개발하는 것에서 시작해 클라이언트 앱에 배포하는 것으로 끝납니다. 하지만 그게 전부는 아닙니다. 디자인 시스템은 제품의 요구사항이 계속 변하는 것에 맞춰 지속해서 발전해야 합니다. 이제부터가 시작입니다.

8장에서는 이 가이드에서 만든 엔드 투 엔드 디자인 시스템 워크플로우를 설명합니다. 외부에서 변경한 UI가 어떻게 디자인 시스템에 영향을 끼치는지 알아볼 것입니다.
