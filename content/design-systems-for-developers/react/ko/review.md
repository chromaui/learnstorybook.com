---
title: '팀과 함께 리뷰하기'
tocTitle: '리뷰'
description: '지속적 통합(CI)과 비주얼 리뷰를 통한 협업'
commit: 3b28026
---

4장에서는 디자인 간 불일치 문제를 해결하며 디자인 시스템을 더 발전시킬 수 있는 전문적인 워크플로우에 대해서 배울 것입니다. 이 장은 팀에서 UI 피드백을 주고받아 의견 합의에 이를 수 있는 여러 방법을 알려줍니다. 이러한 프로덕션 과정들은 Auth0, Shopify, 그리고 Discovery Network에서 이용되고 있습니다.

## 단일한 진실 지점(SSOT)인가, 단일한 장애 지점(SPOF)인가

이 전에, 디자인 시스템은 프런트엔드 팀에 있어서 [단일한 장애 지점](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure) 이라고 한 적이 있습니다. 결국 디자인 시스템이란 디펜던시(Dependency)이기 때문입니다. 디자인 시스템 컴포넌트를 바꾸면, 그 변화는 의존 관계에 있는 앱들로 퍼지게 됩니다. 변화가 퍼지는 방식은 공평합니다. 개선된 부분과 버그가 함께 있기 때문입니다.

![Design system dependencies](/design-systems-for-developers/design-system-dependencies.png)

버그는 디자인 시스템에 있어서 치명적인 문제점이기 때문에 우리는 모두 버그를 예방하기 위해 큰 노력을 합니다. 작은 변화가 셀 수 없이 많은 버그가 될 수도 있습니다. 지속해서 관리하지 않으면 디자인 시스템은 무용지물이 될 것입니다.

> “내 컴퓨터에서는 잘 되던데?!” – 모두

## 팀과 함께 UI 컴포넌트 비주얼 리뷰하기

비주얼 리뷰는 UI의 기능과 미학을 결정짓는 과정입니다. 이는 UI 개발 과정 및 QA 진행 시 모두 필요합니다.

대부분의 개발자들은 코드 퀄리티를 향상하기 위해 다른 개발자들로부터 피드백을 주고받는 과정인 코드 리뷰에 익숙합니다. UI 컴포넌트는 코드를 시각적으로 표현하므로, 비주얼 리뷰는 UI/UX와 관련한 피드백을 주고받기 위해 필수적입니다.

### 전체적인 참조 지점 수립하기

node_modules 삭제하기. 패키지 재설치하기. 로컬 저장소 비우기. 쿠키 삭제하기. 만약 이러한 행동들에 대해 어디서 들어본 듯 하다면, 여러분들은 팀메이트들이 최신 코드를 사용하도록 만든다는 게 얼마나 고된 일인지 알고 있는 것입니다. 팀메이트들이 완전히 동일한 개발 환경을 갖고 있지 않다면, 실제 버그와 로컬 개발 환경에서만 발생하는 이슈를 구분하는 건 거의 악몽 수준이죠.

다행히도 프런트엔드 개발자로서, 우리는 '브라우저'라는 공통적인 컴파일 목표를 갖고 있습니다. 능숙한 팀들은 비주얼 리뷰를 위한 공통적인 참조 사항으로 Storybook을 온라인으로 퍼블리싱하기도 합니다. 이는 로컬 개발 환경이 내재한 문제점들을 피해가게 해줍니다(어쨌든 기술 지원팀으로 일하는 건 때로는 힘들 때도 있네요).

![Review your work in the cloud](/design-systems-for-developers/design-system-visual-review.jpg)

UI 컴포넌트들이 URL을 통해 접근 가능할 때, 관계자들은 UI가 어떻게 보이고 느껴질지 그들의 브라우저라는 익숙한 환경 안에서 확정할 수 있습니다. 이는 개발자들, 디자이너들 및 PM들이 로컬 개발 환경에서의 문제점과 씨름할 일이 없고, 스크린샷을 다른 사람에게 넘길 일이 없으며 또한 예전 UI를 참고할 필요가 없어진다는 얘기입니다.

> "각 PR에 스토리북을 배포하는 것은 비주얼 리뷰를 더 원활하게 만들고 프로덕트 소유주가 컴포넌트를 고려할 수 있도록 합니다." –Norbert de Langen, 스토리북 코어 관리자

<h2 id="publish-storybook">스토리북 퍼블리싱하기</h2>

우리는 스토리북 관리자들이 만든 무료 퍼블리싱 서비스인 [크로마틱(Chromatic)](https://www.chromatic.com/) 을 통해 비주얼 리뷰의 예를 보여줄 것입니다. 이는 여러분이 클라우드에 스토리북을 안전하게 그리고 안정적으로 배포하고 호스트 할 수 있게 해줄 뿐만 아니라, [스토리북을 정적 사이트로 만들고 다른 호스팅 서비스에 배포하기](https://storybook.js.org/docs/basics/exporting-storybook/) 도 상당히 수월하게 해줍니다.

### 크로마틱 시작하기

첫 단계는 [chromatic.com](https://chromatic.com) 에 가셔서 깃허브 계정으로 로그인 하는 것입니다.

![Signing up at Chromatic](/design-systems-for-developers/chromatic-signup.png)

크로마틱에서 다자인 시스템 저장소를 선택합니다. 실제로 이는 접근 권한을 동기화하고 PR 체크 기능을 설치하는 과정입니다.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/design-systems-for-developers/chromatic-setup-learnstorybook-design-system.mp4"
    type="video/mp4"
  />
</video>

npm을 통해 [chromatic](https://www.npmjs.com/package/chromatic) 패키지를 설치합니다.

```shell
yarn add --dev chromatic
```

설치되었으면 아래 커맨드를 실행해 스토리북을 빌드하고 배포합니다. (크로마틱 웹사이트에서 제공되는 `project-token`을 사용해야 합니다)

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic in the command line](/design-systems-for-developers/chromatic-manual-storybook-console-log.png)

위 링크를 복사한 후 새로운 브라우저 창에 붙여넣어 퍼블리쉬된 스토리북을 살펴봅니다. 로컬 스토리북 개발환경이 온라인에서 그대로 구현된 것을 볼 수 있습니다.

![Storybook built with Chromatic](/design-systems-for-developers/chromatic-published-storybook-6-0.png)

이는 여러분의 팀이 실제로 렌더링 된 UI 컴포넌트들을 리뷰하는 과정을 원활하게 합니다. 마치 로컬 개발환경에서 리뷰하듯이 말입니다. 아래는 여러분이 크로마틱에서 보게 될 결과입니다.

![Result of our first Chromatic build](/design-systems-for-developers/chromatic-first-build.png)

축하드립니다! 이제 스토리북을 배포하기 위한 인프라가 만들어졌으므로, 지속적 통합(CI)을 통해 더 발전 시켜 나가 봅시다.

### 지속적 통합(CI)

지속적 통합(CI)은 현대 웹 앱을 관리하기 위한 실질적인 수단입니다. 이는 여러분이 코드를 푸쉬할 때 테스트, 분석, deploy와 같은 행동을 제어할 수 있게 합니다. 우리는 단순 반복 노동으로부터 우리 자신을 구제하기 위해 이러한 방법을 사용할 것입니다.

우리는 적정량의 사용까지는 무료인 GitHub Actions를 사용할 것입니다. 이러한 원리는 다른 CI 서비스들에도 적용됩니다.

디렉토리의 최상위에 `.github` 디렉토리를 추가합니다. 그리고 나서 `workflows` 라는 다른 디렉토리를 만듭니다.

아래처럼 chromatic.yml 이라는 파일을 생성합니다. 이는 우리의 CI 프로세스가 작동되도록 지시하게 만들어 줍니다. 지금은 작은 것부터 시작하고, 점차 발전 시켜 나갈 것입니다.

```yaml
# .github/workflows/chromatic.yml

# name of our action
name: 'Chromatic'
# the event that will trigger the action
on: push

# what the action will do
jobs:
  test:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
      - uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

수정사항을 git add 합니다.

```shell
git add .
```

커밋합니다.

```shell
git commit -m "Storybook deployment with GitHub action"
```

마지막으로, 아래 명령어를 사용해 원격 저장소에 푸쉬합니다.

```shell
git push origin master
```

성공했습니다! 인프라를 향상시켰네요.

## 팀에게 비주얼 리뷰 요청하기

풀 리퀘스트가 UI 변동사항을 동반할 때마다, 유저에게 무엇을 전달할지에 관해 합의에 이르기 위해 이해 당사자들과 비주얼 리뷰 과정을 항상 거치는 것이 도움 됩니다.

우리는 새로운 브랜치에 UI 변경을 함으로써 비주얼 리뷰를 보여주겠습니다.

```shell
git checkout -b improve-button
```

처음은 버튼 컴포넌트에 약간의 변화를 가하는 것입니다. “눈에 확 들어오게 하세요” – 저희 디자이너들이 정말 좋아하겠네요.

```javascript
//src/Button.js

// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

변동사항을 커밋하고 여러분의 깃허브 저장소에 푸쉬합니다.

```shell
git commit -am "make Button pop"
git push -u origin improve-button
```

GitHub.com로 가서 `improve-button` 브랜치에 대해 풀 리퀘스트를 오픈합니다. 오픈됨과 동시에, 스토리북을 퍼블리쉬하기 위한 CI 작업이 시작될 것입니다.

![Created a PR in GitHub](/design-systems-for-developers/github-created-pr-actions.png)

PR 체크 리스트의 페이지 아래쪽에, **Storybook Publish** 를 클릭하여 새로운 변동사항을 반영하여 퍼블리쉬된 스토리북을 살펴봅니다.

![Button component changed in deployed site](/design-systems-for-developers/chromatic-deployed-site-with-changed-button.png)

팀원들이 연관된 스토리들을 신속히 리뷰할 수 있도록, 변동된 각각의 컴포넌트와 스토리에 대해 브라우저에서 URL을 복사해서 여러분의 팀이 테스크 관리에 쓰는 툴(GitHub, Asana, Jira 등)에 붙여넣으세요.

![GitHub PR with links to storybook](/design-systems-for-developers/github-created-pr-with-links-actions.png)

팀원들에게 이슈를 할당하고 피드백이 들어오는 걸 살펴봅니다.

![Why?!](/design-systems-for-developers/github-visual-review-feedback.gif)

<div class="aside">크로마틱은 유료 서비스의 일부분으로 제품에 대한 완전한 UI 리뷰 워크플로우를 제공합니다. 스토리북 링크를 깃허브 PR로 복사하는 기능은 사용량이 적을 때는 문제 없지만(크로마틱 뿐만 아니라 스토리북을 호스팅하는 모든 서비스), 사용량이 커지면 여러분은 이러한 서비스를 고려하게 될지도 모릅니다. 이 서비스는 프로세스를 자동화하기 때문입니다. </div>

소프트웨어 개발에서, 대부분의 결함은 기술적인 문제가 아니라 커뮤니케이션의 오류에서 비롯됩니다. 비주얼 리뷰는 디자인 시스템을 더 빨리 전달하기 위해 팀들이 개발 과정에서 지속적인 피드백을 받도록 도와줍니다.

![Visual review process](/design-systems-for-developers/visual-review-loop.jpg)

> 모든 풀 리퀘스트에 스토리북 URL을 배포하는 것은 Polaris, 즉 Shopify의 디자인 시스템에서 지속적으로 해오고 있던 것입니다. 그리고 이는 정말로 많은 도움이 됩니다. Ben Scott, Shopify의 엔지니어

## 디자인 시스템 테스트하기

비주얼 리뷰는 정말 중요하지만, 수백 개의 컴포넌트 스토리를 일일이 손으로 리뷰하는 것은 몇 시간이나 걸릴 수 있습니다. 이상적으로는, 우리는 의도된 변화 (추가/개선)만 보고 싶고 의도되지 않은 반복들은 자동으로 잡아내고 싶어 합니다.

5장에서는 비주얼 리뷰에서의 잡음을 줄이고 견고한 컴포넌트를 확립하는 데 도움이 되는 테스팅 기법들을 소개합니다.
