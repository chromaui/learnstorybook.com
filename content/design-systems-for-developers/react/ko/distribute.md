---
title: 'UI 배포'
tocTitle: '배포'
description: '디자인 시스템을 다른 앱에 패키징하고 import하는 방법을 배웁니다.'
---

설계적인 관점에서 디자인 시스템은 또 다른 프런트엔드 의존성(dependency)에 불과합니다. 그런 시스템은 유명한 의존성인 moment나 loadash와 다를 바가 없습니다. UI 컴포넌트는 코드이기 때문에 코드 재사용을 위해 확립된 기술을 활용할 수 있습니다.

이번 챕터에서는 디자인 시스템을 배포하며 UI 컴포넌트를 패키징하는 것에서부터 그 컴포넌트를 다른 앱에 가져오는 것까지 해볼 것입니다. 또한, 배포와 버전관리의 효율성을 높이기 위한 시간 절약 기술에 대해서도 알아보겠습니다.

![사이트들에 컴포넌트를 전파(propagate)하기](/design-systems-for-developers/design-system-propagation.png)

## 디자인 시스템 패키징

조직은 수천 개의 UI 컴포넌트들을 서로 다른 앱에 분산시켜둡니다. 이전에는 디자인 시스템에서 가장 흔한 컴포넌트를 추출해서 디자인 시스템에 포함시켰는데, 이제 이 컴포넌트를 앱에 다시 적용할 차례입니다.

디자인 시스템은 JavaScript 패키지 매니저인 npm을 통해 배포, 버전관리, 의존성(dependency) 관리를 합니다.

패키징 디자인 시스템에는 다양한 방법들이 있는데 이러한 다양한 접근 방법은 Lonely Planet의 디자인 시스템인 Gander, Auth0, Salesforce, GitHub 그리고 Microsoft에서 확인할 수 있습니다. 각각의 컴포넌트를 개별적인 패키지로 관리하거나 하나의 패키지에 모든 컴포넌트를 관리하기도 합니다.

초기 디자인 시스템의 경우 가장 직접적인 방법은 아래의 내용을 포함하는 단일 버전 패키지를 발행하는 것입니다. -  

- 🏗 공통적인 UI 컴포넌트
- 🎨 디자인 토큰 (style variables과 같은)
- 📕 문서화

![디자인 시스템 패키지](/design-systems-for-developers/design-system-package.jpg)
## export 하기 위한 디자인 시스템 준비

디자인 시스템의 출발점으로 [Create React App](https://github.com/facebook/create-react-app) (CRA)을 사용했는데 여전히 초기 앱의 흔적이 남아있습니다. 정리를 좀 해볼까요?

첫번째로, README.md를 조금 더 구체적으로 업데이트 합니다. -  

```markdown:title=README.md
# 스토리북(Storybook) 디자인 시스템 튜토리얼

스토리북 디자인 시스템 튜토리얼은 [스토리북 디자인 시스템](https://github.com/storybookjs/design-system/)의 일부로 디자인 시스템을 어떻게 만들고 배포할지 가장 효율적인 방법을 배우고 싶은 사람들을 위한 학습 자료로 제작되었습니다.

더 자세한 내용은 [스토리북 튜토리얼](https://storybook.js.org/tutorials/)를 참고하세요.
```

이제 디자인 시스템의 공통 도입부를 생성하기 위해 `src/index.js` 파일을 만듭니다. 이 파일에서부터 모든 디자인 토큰과 컴포넌트를 export 할 것입니다. -  

```js:title=src/index.js
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

추가로 개발 패키지가 필요한데, 빌드(build) 과정에서 도와줄 [`@babel/cli`](https://www.npmjs.com/package/@babel/cli)와 [`cross-env`](https://www.npmjs.com/package/cross-env)을 사용할 것입니다.

커맨드 라인(command line)에서 다음과 같이 작성합니다. -  

```shell
yarn add --dev @babel/cli cross-env
```

패키지의 설치가 완료되었으면, 빌드 과정에서 구현해야합니다.

고맙게도 Create React App가 이 과정을 이미 처리해두었습니다. 디자인 시스템을 `dist` 디렉토리에 구축하기 위해 이미 만들어진 `build` 스크립트를 수정합니다. -  

```json:title=package.json
{
  "babel": {
    "presets": [
      [
        "react-app",
        {
          "absoluteRuntime": false
        }
      ]
    ]
  }
}
```

빌드 과정이 구현되었고, 이를 조금 수정해보겠습니다. `package.json`에서 `babel`의 키를 찾아 다음과 같이 내용을 업데이트합니다. - 

```json:title=package.json
{
  "babel": {
    "presets": [
      [
        "react-app",
        {
          "absoluteRuntime": false
        }
      ]
    ]
  }
}
```

 이제 `dist` 디렉토리 안에 코드를 빌드 하기 위해 `yarn build`를 실행할 수 있습니다. -- 원치 않는 commit을 피하기 위해 이 디렉토리를 `gitignore`에 추가합니다. - 

```
// ..
dist
```
#### 퍼블리싱을 위한 패키지 메타데이터 추가

패키지의 사용자가 필요한 모든 정보를 얻을 수 있도록 `package.json`을 수정해야합니다. 가장 쉬운 방법은 `yarn init`을 실행하는 것입니다. -- 이 명령어는 배포를 위한 패키지의 초기 상태를 설정합니다. - 

```shell
# Initializes a scoped package
yarn init --scope=@your-npm-username

yarn init v1.22.5
question name (learnstorybook-design-system): @your-npm-username/learnstorybook-design-system
question version (0.1.0):
question description (Learn Storybook design system):Storybook design systems tutorial
question entry point (dist/index.js):
question repository url (https://github.com/your-username/learnstorybook-design-system.git):
question author (your-npm-username <your-email-address@email-provider.com>):
question license (MIT):
question private: no
```

명령어가 한 세트의 질문을 할텐데, 이 중에서 일부는 답이 미리 채워져있을 것이고, 나머지는 우리가 고민해야 합니다. npm에 올릴 패키지를 위해 고유한 이름을 만들어주세요. (`learnstorybook-design-system`를 사용할 수 없습니다. -- 그렇기 때문에 앞에 npm의 사용자 이름을 적는 다음과 같은 방식을 추천합니다. `@your-npm-username/learnstorybook-design-system`)

모두 완료했으면, `package.json`에 그 질문들에 대한 결과로써 새로운 값들과 함께 업데이트가 될 것입니다. - 

```json:title=package.json
{
  "name": "@your-npm-username/learnstorybook-design-system",
  "description": "Storybook design systems tutorial",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/your-username/learnstorybook-design-system.git"
  // ...
}
```

<div class="aside">
💡 간결하게 하기 위해 <a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages">패키지의 스코프(package scopes)</a>는 언급하지 않았는데, 스코프를 사용하면 다른 유저나 조직이 생성한 패키지와 동일한 이름의 패키지를 충돌없이 만들 수 있습니다.
</div>


패키지 준비가 되었으니 이제 npm에 최초 배포를 할 수 있습니다!
## Auto로 배포 관리

변경된 부분을 기록하는 changelog를 업데이트하고, 유효한 버전의 숫자를 입력하며, 저장소의 commit에 있는 버전 숫자와 깃(git) 태그가 연결되도록 만드는 과정을 거쳐서 npm에 배포를 합니다. 이 모든 과정을 위해 만들어진 [Auto](https://github.com/intuit/auto)라고 불리는 오픈소스 툴을 사용할 것입니다. 

Auto를 설치해보세요. - 

```shell
yarn add --dev auto
```

Auto는 배포 관리시 일어날 수 있는 다양하고 흔한 과제를 수행할 때 사용할 수 있는 커맨드 라인 툴입니다. [Auto 문서 사이트](https://intuit.github.io/auto/)에서 Auto에 대해 더 알 수 있습니다.  

 #### GitHub 토큰과 npm 토큰 생성  

다음 단계로 더 나아가기 위해서 Auto에서 깃허브(GitHub)와 npm과 통신을 해야합니다. 명확한 일처리를 위해 개인적으로 접근이 가능한 토큰이 필요한데요. [깃허브 토큰 페이지](https://github.com/settings/tokens)에서 토큰을 얻을 수 있으며, 이 토큰은 `repo` 스코프를 필요로 합니다.

npm에서는, 다음 URL에서 토큰을 생성할 수 있습니다. - https://www.npmjs.com/settings/&lt;your-username&gt;/tokens

"읽기와 배포"의 허가에 대한 토큰이 필요합니다.

`.env`라고 불리는 파일을 프로젝트에 추가하고 받은 토큰을 추가해보세요. - 

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

`.env` 를 `.gitignore` 에 추가함을 통해 이 토큰 값을 모든 사용자가 볼 수 있는 오픈소스 저장소에 원치않게 올리는 것을 방지할 수 있습니다. 이 부분은 중요합니다. 다른 관리자가 로컬에서 이 패키지를 배포해야하는 경우(이 부분은 기본 브랜치에 PR을 해서 merge할 때 자동 배포가 되도록 나중에 설정을 할 것입니다.), 관리자는 자신의 `.env` 파일을 아래와 같은 과정에 따라 설정해야합니다. - 

```
dist
.env
```

#### 깃허브에 라벨 생성

Auto로 가장 우선적으로 해야할 것은 깃허브에 라벨 종류를 생성하는 것입니다. 이 라벨은 나중에 패키지를 수정할 때 (다음 챕터에서 볼 수 있습니다.) 사용하는데, 덕분에 `auto`가 패키지 버전을 합리적으로 업데이트하고 changelog와 릴리즈 노트를 생성할 수 있습니다.

```bash
yarn auto create-labels
```

깃허브를 확인해보면 이제 `auto`가 추천하는 라벨 종류가 생성된 것을 볼 수 있습니다. - 

![깃허브에서 Auto로 생성된 라벨 집합](/design-systems-for-developers/github-auto-labels.png)

merge 하기 전에 모든 PR시 아래 라벨 중 하나를 선택하여 태그해야 합니다. - `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation`
#### 매뉴얼적으로 Auto를 이용해 처음으로 배포

 나중에는 새로운 버전 숫자를 스크립트를 이용해서 `auto`로 계산하겠지만, 처음 배포할 때는 명령어를 실행해서 명령어의 역할을 알아봅시다. changelog를 처음으로 발생시켜봅니다. - 

```shell
yarn auto changelog
```

생성한 모든 commit마다 장문의 changelog가 발생합니다. (기본 브랜치로 push해 온 경고도 함께 뜨는데, 이는 곧 멈출 예정입니다.)

자동으로 생성된 changlog도 유용하지만, 사용자의 편의를 위해 추가적인 편집과 메세지를 수작업으로 더해주는 것도 좋은 방법입니다. 이 상황에서는 사용자가 모든 commit을 알아야할 필요가 없어 첫번째 v0.1.0 버전의 간단한 메세지를 만들어보세요. Auto가 방금 생성한 commit을 되돌리지만, 변경사항은 유지합니다. - 

```shell
git reset HEAD^
```

그리고 changelog를 업데이트하고 이를 commit합니다. - 

```
# v0.1.0 (Tue Mar 09 2021)

- `Avatar`, `Badge`, `Button`, `Icon` 그리고 `Link` 컴포넌트의 첫 디자인 시스템 버전을 만들었습니다.

#### Authors: 1

- [your-username](https://github.com/your-username)
```

git에 changelog를 추가해보세요. CI 플랫폼이 이 commit들을 무시하도록 `[skip ci]`를 사용하는 것을 기억하세요. 그렇지 않으면 빌드와 배포의 순환이 계속 됩니다.

```shell
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

이제 배포할 수 있습니다. - 

```shell
npm --allow-same-version version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish --access=public
```

<div class="aside">
💡 <a href="https://classic.yarnpkg.com/en/docs/cli/">yarn</a>을 사용한다면 그에 알맞게 명령어 사용하는 걸 잊지마세요. 
</div>

그리고 Auto를 사용해서 깃허브에 릴리즈를 생성합니다. - 

```shell
git push --follow-tags origin main
yarn auto release
```

오예! 성공적으로 npm에 배포하고 깃허브에 릴리즈를 만들었습니다.

![npm에 퍼블리쉬된 패키지](/design-systems-for-developers/npm-published-package.png)

![깃허브에 퍼블리쉬된 릴리즈](/design-systems-for-developers/github-published-release.png)

 (`auto`가 자동적으로 첫번째 릴리즈를 릴리즈 노트에 기록해주지만, 첫번째 버전에 맞게 수정했다는 걸 알아두어야 합니다. )

#### Auto를 사용한 스크립트 설정

후에 패키지를 배포하고 싶을 때와 같은 과정을 따라서 Auto를 설정해보세요. 다음과 같은 스크립트를 `package.json`에 추가합니다. - 

```json:title=package.json
{
  "scripts": {
    "release": "auto shipit --base-branch=main"
  }
}
```

 이제, `yarn release`를 실행할 때 (자동 생성 changelog를 사용할 때 제외하고) 자동적으로 위와 같은 모든 과정을 밟을 것입니다. 기본 브랜치에 push한 모든 commit들은 배포됩니다.

축하합니다! 매뉴얼적으로 디자인 시스템을 배포하기 위한 기본적인 인프라 설정을 완료했습니다. 이제 지속적인 통합(CI)으로 어떻게 자동으로 배포할 것인지 알아보겠습니다.

## 자동으로 릴리즈 배포

지속적인 통합을 위해서 GitHub Actions를 사용합니다. 하지만 이 절차를 하기 전에, 앞에서 언급했던 깃허브 토큰과 NPM 토큰을 안전하게 저장해야합니다. 그래야 Actions가 깃허브와 NPM에 접근할 수 있습니다.  

#### GitHub Secrets에 토큰 저장

 GitHub Secrets은 저장소에 보안이 필요한 정보를 저장할 수 있게 합니다. 브라우저에서 깃허브 저장소를 열어보세요. 

⚙️ 설정 탭을 클릭하고, 사이드바에 있는 Secrets 링크를 클릭합니다. 그러면 다음과 같은 스크린이 보입니다. - 

![빈 깃허브 secrets 페이지](/design-systems-for-developers/github-empty-secrets-page.png)

 **New secret** 버튼을 클릭해보세요. 이름으로 `NPM_TOKEN`을 사용하고, 이 챕터를 진행하며 npm에서 얻은 토큰을 붙여넣습니다.

![채워진 깃허브 secrets 양식](/design-systems-for-developers/github-secrets-form-filled.png)

저장소에 npm 토큰을 추가하고, `secrets.NPM_TOKEN`으로써 이를 접근할 수 있습니다. 그러면 깃허브 토큰을 위해 또 다른 secret 설정을 할 필요가 없습니다.

#### GitHub Actions으로 릴리즈 자동화

PR을 매번 merge 할 때마다, 우리는 자동적으로 디자인 시스템이 배포되길 원할 것입니다. `push.yml`이라는 새로운 이름의 파일을 <a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">publish Storybook</a>에서 썼던 폴더와 같은 위치에 생성하고 다음과 같이 추가합니다. - 

```yml:title=.github/workflows/push.yml
# Name of our action
name: Release

# The event that will trigger the action
on:
  push:
    branches: [main]

# what the action will do
jobs:
  release:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # This check needs to be in place to prevent a publish loop with auto and github actions
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    # The list of steps that the action will go through
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
          #👇 npm token, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/distribute/ to obtain it
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          yarn release
```

저장하고 변화된 부분을 리모트 저장소에 커밋합니다.

성공! 이제 기본 브랜치에 PR을 merge 할 때마다 자동으로 새로운 버전이 배포되며, 추가한 라벨에 맞춰 버전 숫자도 업데이트 됩니다. 

<div class="aside">
💡 디자인 시스템 확장에 도움을 줄 수 있는 Auto의 모든 기능과 통합을 알아보지는 못했습니다. 더 많은 내용을 알고 싶으면 <a href="https://github.com/intuit/auto"> 이 문서를 참고해보세요.
</div>

![디자인 시스템 import하기](/design-systems-for-developers/design-system-import.png)
## 앱에 디자인 시스템 적용

이제 디자인 시스템이 온라인에 있으니 의존성으로 설치하고, UI 컴포넌트로 사용하는 것은 간단합니다.

#### 예제 앱 준비

이 튜토리얼의 앞 부분에서, 많이 쓰이는 프런트엔드 스택을 표준화를 했습니다. 이 스택에는 리액트(React)와 Styled Components가 포함되는데, 즉, 디자인 시스템을 최대한 활용하려면 예제 앱에서도 리액트 및 Styled Components를 사용해야 합니다.

<div class="aside">
💡 Svelte나 web components와 같이 다른 유망한 방법을 사용하면 프레임워크에 구애받지 않고 UI 컴포넌트를 구성할 수 있습니다. 그러나 Svelte나 web components는 상대적으로 새로운 방식이라 문서화가 덜 되었거나 널리 채택되지 않았기 때문에 이 가이드에는 아직 포함되지 않았습니다.
</div>

 예제 앱은 스토리북을 사용하여 [컴포넌트 주도 개발 Component-Driven Development](https://www.componentdriven.org/)를 용이하게 합니다. 이 개발 방법은 UI를 아래에서부터, 즉 컴포넌트 개발부터 시작해서 페이지로 끝내는 방식입니다. 데모하는 동안에 두 개의 스토리북을 번갈아가며 실행합니다. 하나는 예제 앱을 위한 것이고 다른 하나는 디자인 시스템을 위한 것입니다. 

예재 앱을 설정하기 위해서 커맨드 라인에 다음과 같이 명령어를 실행합니다. - 

```shell
# Clones the files locally
npx degit chromaui/learnstorybook-design-system-example-app example-app

cd example-app

# Install the dependencies
yarn install

## Start Storybook
yarn storybook
```

앱에서 사용되는 단순한 컴포넌트의 스토리들(stories)이 스토리북에서 실행되는 것이 보일 것입니다. - 

![예제 앱을 위한 초기 스토리북](/design-systems-for-developers/example-app-starting-storybook-6-0.png)

<h4>디자인 시스템 통합</h4>

작업한 디자인 시스템의 스토리북이 배포되어 있을 것입니다. 이제 스토리북을 예제 앱에 추가해보세요. 예제 앱의 `.storybook/main.js`를 다음과 같이 업데이트할 수 있습니다. - 

```diff:title=.storybook/main.js
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ refs: {
+   'design-system': {
+     title: 'My design system',
+     //👇 Chromatic으로 배포된 url
+     url: 'https://your-published-url.chromatic.com',
+   },
+ },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-composition-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 <code>refs</code> 키를 <code>.storybook/main.js</code>에 추가를 하는 것은, 여러 개의 스토리북을 <a href="https://storybook.js.org/docs/react/workflows/storybook-composition">구성</a>에 맞게 하나로 묶어지게 합니다. 이것은 여러 개의 저장소가 분산되어 있거나 다른 기술 스택을 쓰는 규모가 큰 프로젝트를 진행할 때 도움이 됩니다.
</div>

이제 예제 앱을 개발하는 동안 디자인 시스템 컴포넌트와 문서를 검색할 수 있습니다. 기능 개발을 하는 도중에 디자인 시스템을 보여주면 개발자가 본인의 컴포넌트를 구성하는데 시간을 낭비하는 대신 기존에 존재하는 컴포넌트를 재사용할 가능성이 높아집니다.

필요한 것을 가지고 있으니 디자인 시스템을 추가하고 사용할 시간입니다. 다음과 같이 터미널에 명령어를 실행합니다. -

```shell
yarn add @your-npm-username/learnstorybook-design-system
```

디자인 시스템에 정의한 것과 같은 전역 스타일을 사용할 예정이어서 [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering) config 파일을 업데이트하고 [global decorator](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators)을 추가합니다.

```js:title=.storybook/preview.js
import React from 'react';

// The styles imported from the design system.
import { global as designSystemGlobal } from '@your-npm-username/learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

/*
 * Adds a global decorator to include the imported styles from the design system.
 * More on Storybook decorators at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
export const decorators = [
  Story => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];
/*
 * More on Storybook parameters at:
 * https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

![디자인 시스템 스토리가 포함된 앱 스토리북 예시](/design-systems-for-developers/example-app-storybook-with-design-system-stories-6-0.png)

예제 앱의 `UserItem` 컴포넌트에 있는 디자인 시스템을  `Avatar` 컴포넌트에 사용합니다. `UserItem`은 반드시 사용자의 이름과 프로필 사진을 포함한 정보를 렌더해야 합니다.

에디터에서 `src/components/UserItem.js`에 위치한 `UserItem` 컴포넌트를 열어보세요. 그리고 곧이어 변경할 코드가 다시 hot module 로딩이 되는 것을 보기 위해 스토리북에 있는 `UserItem`을 선택합니다.

Avatar 컴포넌트를 import합니다.

```js:title=src/components/UserItem.js
import { Avatar } from '@your-npm-username/learnstorybook-design-system';
```

사용자 이름 옆에 Avatar를 보여줍니다.

```diff:title=src/components/UserItem.js
import React from 'react';

import styled from 'styled-components';

+ import { Avatar } from '@your-npm-username/learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

- const Avatar = styled.img`
-   border: 1px solid black;
-   width: 30px;
-   height: 30px;
-   margin-right: 0.5em;
- `;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
+   <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

저장과 동시에 `UserItem` 컴포넌트가 스토리북을 업데이트 하여 새 Avatar 컴포넌트를 보여줄 것입니다. `UserItem`이 `UsetList`에 포함되어 있기 때문에 `UserList`에서도 `Avatar`를 볼 수 있습니다.

![디자인 시스템을 이용한 샘플 앱 예제](/design-systems-for-developers/example-app-storybook-using-design-system-6-0.png)

됐습니다! 방금 예제 앱에 디자인 시스템 컴포넌트를 import했습니다. Avatar 컴포넌트를 업데이트해서 배포할 때마다 패키지를 업데이트 할 시 변경된 부분 또한 예제 앱에 반영됩니다.

![디자인 시스템 배포](/design-systems-for-developers/design-system-propagation-storybook.png)
## 디자인 시스템 작업 흐름(workflow) 마스터하기

디자인 시스템의 작업 흐름(workflow)는 스토리북에 있는 UI 컴포넌트를 개발하는 것에서부터 시작해서 개발한 컴포넌트를 클라이언트 앱에 배포하는 것으로 끝을 맺습니다. 그런데 그것이 전부가 아닙니다. 디자인 시스템은 끊임없이 변화하는 제품의 요구사항을 충족시키기 위해 지속적으로 발전해야하며, 이제 시작 단계에 들어섰을 뿐입니다. 

챕터 8은 이 가이드에서 만든 end-to-end 디자인 시스템의 흐름을 소개합니다. 외부에서 변경한 UI가 어떻게 디자인 시스템에 영향을 끼치는지 알아봅니다. 
