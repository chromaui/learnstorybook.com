---
title: '품질 유지를 위한 테스트'
tocTitle: '테스트'
description: '디자인 시스템 외관, 기능성 및 접근성을 테스트하는 방법'
commit: 'a856d54'
---

5장에서는 UI 버그를 방지하기 위해 디자인 시스템 테스트를 자동화합니다. 이 장에서는 테스트가 필요한 UI 컴포넌트의 특성과 피해야 할 잠재적 함정에 대해 자세히 설명합니다. Wave, BBC 및 Salesforce의 전문 팀을 조사하여 종합적인 테스트 적용 범위, 직관적인 초기 설정 및 낮은 유지 보수 비용 간의 균형을 고려한 테스트 전략을 수립했습니다.

<img src="/design-systems-for-developers/ui-component.png" width="250">

## UI 컴포넌트 테스트의 기초

시작하기 전에 테스트에 적합한 것이 무엇인지 알아봅시다. 디자인 시스템은 UI 컴포넌트로 구성됩니다. 각 UI 컴포넌트에는 일련의 입력(속성)들이 주어졌을 때 의도한 외관과 느낌을 설명하는 스토리(순열)들이 포함되어 있습니다. 그런 다음 최종 사용자를 위해 브라우저 또는 장치에서 스토리를 렌더링 합니다.

![결합적인 컴포넌트 상태](/design-systems-for-developers/component-test-cases.png)

우와! 보시다시피 한 컴포넌트에는 여러 상태가 포함되어 있습니다. 상태에 디자인 시스템 컴포넌트의 수를 곱해본다면, 모든 상태를 추적하는 것이 불가능하다는 것을 알 수 있습니다. 특히 디자인 시스템이 확장되는 경우 모든 요소를 수작업으로 검토하는 것은 현실적으로 지속가능하지 않습니다.

그러니 더더욱 **나중의** 수고를 덜하기 위해 **지금** 자동 테스트를 설정해야 합니다.

## 테스트 준비

전문적인 Storybook 워크플로우에 대해 [이전 글](https://www.chromatic.com/blog/the-delightful-storybook-workflow)에서 4개의 프런트엔드 팀을 설문 조사했습니다. 그들은 스토리 작성에 대한 이러한 모범 사례들이 쉽고 포괄적인 테스트를 만든다는 것에 동의했습니다.

어떤 입력 조합이 테스트 항목으로 주어지는지 명확히 하기 위해 **스토리가 지원하는 컴포넌트 상태**들을 표시합니다. 엉뚱한 테스트 범위를 줄이기 위해 지원되지 않는 상태를 가차 없이 제거합니다.

**일관되게 컴포넌트를 렌더링**하여 무작위(Math.random()) 또는 상대적(Date.now()) 입력에 의해 촉발될 수 있는 가변성을 완화합니다.

> "최고의 스토리는 컴포넌트가 실제로 경험할 수 있는 모든 상태를 시각화할 수 있도록 해줍니다." – Tim Hingston, Apollo GraphQL의 기술 책임자

## 외관에 대한 시각적 테스트

디자인 시스템에는 본질적으로 시각적인 UI 컴포넌트가 포함되어 있습니다. 시각적 테스트는 렌더링 된 UI의 시각적 측면을 검증합니다.

시각적 테스트는 일관된 브라우저 환경에서 모든 UI 컴포넌트의 이미지를 캡처합니다. 새 스크린샷은 이전에 테스트를 통과하여 기준 버전으로 지정되었던 스크린샷과 자동으로 비교됩니다. 시각적 차이가 있으면 알림을 받을 수 있습니다.

![시각적 테스트 컴포넌트](/design-systems-for-developers/component-visual-testing.gif)

모던 UI를 구축하는 경우 시각적 테스트를 통해 프런트엔드 팀이 수작업 리뷰에 드는 시간을 절약하고 비용이 많이 드는 UI 회귀 테스트를 수행하는 것을 방지할 수 있습니다.

<a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/ko/review/#publish-storybook">이전 장</a>에서 [Chromatic](https://www.chromatic.com/)을 사용하여 스토리북을 게시하는 방법을 배웠습니다. 각 `버튼` 컴포넌트 주위에 굵은 빨간색 테두리(border)를 추가한 다음, 팀원에게 피드백을 요청했습니다.

![빨간색 테두리 버튼](/design-systems-for-developers/chromatic-button-border-change.png)

이제 Chromatic에 내장된 [테스트 도구](https://www.chromatic.com/features/test)를 사용하여 시각적 테스트가 어떻게 작동하는지 살펴보겠습니다. 풀 리퀘스트(PR)가 생성되었을 때 Chromatic은 변경 사항에 대한 이미지를 캡처하여 동일한 컴포넌트의 이전 버전과 비교했습니다. 4가지 변경 사항이 발견되었습니다.

![풀 리퀘스트의 체크 목록](/design-systems-for-developers/chromatic-list-of-checks.png)

**🟡 UI 테스트** 체크를 클릭하여 검토합니다.

![Chromatic에서 변경된 두 번째 빌드](/design-systems-for-developers/chromatic-second-build-from-pr.png)

검토하여 의도적인 것인지 (개선) 의도하지 않은 것인지 (버그) 확인합니다. 변경 사항을 수락하면 테스트 기준이 업데이트됩니다. 즉, 후속 커밋은 버그를 감지하기 위해 새로운 기준 버전과 비교됩니다.

![Chromatic에서의 변경 검토](/design-systems-for-developers/chromatic-review-changes-pr.png)

이전 장에서 우리 팀원은 어떤 이유로 `버튼` 주위에 빨간색 테두리를 원하지 않았습니다. 취소해야 함을 나타 내기 위해 변경 사항을 거부합니다.

![Chromatic에서 거부 검토](/design-systems-for-developers/chromatic-review-deny.png)

변경 사항을 실행 취소하고 다시 커밋하여 시각적 테스트를 다시 통과해보세요.

## 기능성에 대한 단위 테스트

단위 테스트는 제어된 입력이 주어졌을 때 UI 코드가 올바른 출력을 반환하는지 확인합니다. 컴포넌트와 함께 존재하며 특정 기능을 검증하는 데 도움이 됩니다.

모든 것은 React, Vue 및 Angular와 같은 최신 뷰 레이어의 컴포넌트입니다. 컴포넌트는 단순한 버튼부터 정교한 날짜 선택기까지 다양한 기능을 캡슐화합니다. 컴포넌트가 복잡할수록 시각적 테스트만으로 뉘앙스를 포착하는 것이 더 까다로워집니다. 그렇기 때문에 단위 테스트가 필요합니다.

![단위 테스트 컴포넌트](/design-systems-for-developers/component-unit-testing.gif)

예를 들어, 링크 컴포넌트는 링크 URL을 생성하는 시스템 (ReactRouter, Gatsby 또는 Next.js의 "LinkWrappers")과 결합할 때 약간 복잡해집니다. 구현 단계의 실수는 유효한 href 값이 없는 링크를 생성할 수 있습니다.

시각을 통해서는 `href` 속성이 있고 올바른 위치를 가리키는지 확인할 수 없으므로 회귀 테스트를 방지하기 위해 단위 테스트가 적절할 수 있습니다.

#### href에 대한 단위 테스트

`Link` 컴포넌트에 대한 단위 테스트를 추가해 봅시다. [Create React App](https://create-react-app.dev/) 은 이미 단위 테스트 환경을 설정했으므로 간단히 `src/Link.test.js` 파일을 만들 수 있습니다.

```js:title=src/Link.test.js
import { render } from '@testing-library/react';
import { Link } from './Link';

test('has a href attribute when rendering with linkWrapper', () => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  const LinkWrapper = props => <a {...props} />;
  const { container } = render(
    <Link href="https://storybook.js.org/tutorials/" LinkWrapper={LinkWrapper}>
      Link Text
    </Link>
  );

  const linkElement = container.querySelector('a[href="https://storybook.js.org/tutorials/"]');
  expect(linkElement).not.toBeNull();
  expect(linkElement.textContent).toEqual('Link Text');
});
```

`yarn test` 명령의 일부로 위의 단위 테스트를 실행할 수 있습니다.

![단일 Jest 테스트를 실행합니다](/design-systems-for-developers/jest-test.png)

이전에 Storybook을 배포하도록 GitHub Action을 구성했고, 이제 테스트도 포함하도록 조정할 수 있습니다. 기여자들은 이제 이 단위 테스트의 혜택을 누릴 수 있고, Link 컴포넌트는 회귀를 방어할 수 있습니다.

```diff:title=.github/workflows/chromatic.yml
# ... 이전과 동일
jobs:
  test:
    # 실행할 운영 체제
    runs-on: ubuntu-latest
    # 작업이 진행될 단계 목록
    steps:
      - uses: actions/checkout@v1
      - run: yarn
+      - run: yarn test # 테스트 명령을 추가합니다.
      #👇 작업절차 중 한 단게로서 Chromatic을 추가합니다.
      - uses: chromaui/action@v1
        # GitHub chromatic action에 필요한 옵션
        with:
          #👇 Chromatic 프로젝트 토큰을 얻기 위해서는 다음을 참고하세요.
          # https://storybook.js.org/tutorials/design-systems-for-developers/react/ko/review/ (업데이트 링크)
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

![성공적인 Circle 빌드](/design-systems-for-developers/gh-action-with-test-successful-build.png)

<div class="aside">💡 <strong>참고 :</strong> 업데이트를 번거롭게 만들 수 있는 너무 많은 단위 테스트에 주의하십시오. 디자인 시스템에 대한 단위 테스트를 적당한 수준에서 할 것을 권장합니다.</div>

> "향상된 자동화 테스트 모음 덕분에 디자인 시스템 팀이 더 확신을 가지고 더 빠르게 움직일 수 있게 되었습니다." – Dan Green-Leipciger, Wave의 선임 소프트웨어 엔지니어

## 접근성 테스트

"접근성은 장애가 있는 사용자를 포함한 모든 사용자가 애플리케이션을 이해하고 탐색하고 상호 작용할 수 있음을 의미합니다. 온라인 [예제에는] 탭 키나 스크린 리더를 통해 사이트를 탐색하는 것처럼 콘텐츠에 접근할 수 있는 다른 방법들을 포함했습니다." 개발자 [T.Rowe Price의 Alex Wilson](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347)이 작성하였습니다.

[세계 보건기구](https://www.who.int/disabilities/world_report/2011/report/en/)에 따르면 전 인류의 15%가 장애를 가지고 있습니다. 디자인 시스템은 사용자 인터페이스의 컴포넌트를 포함하므로 접근성에 큰 영향을 미칩니다. 단 하나의 컴포넌트에 대한 접근성을 향상시킨다는 것은 회사 전체에서 해당 컴포넌트의 모든 인스턴스의 접근성이 향상된다는 것을 의미합니다.

![Storybook 접근성 애드온(addon)](/design-systems-for-developers/storybook-accessibility-addon.png)

웹 접근성 표준(WCAG)을 실시간으로 확인하기 위한 도구인 Storybook의 접근성 애드온(addon)을 사용하여 포용력 있는 UI를 시작하세요.

```shell
yarn add --dev @storybook/addon-a11y

```

애드온을 `.storybook/main.js`에 추가:

```diff:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

`.storybook/preview.js`파일의 [parameters](https://storybook.js.org/docs/react/writing-stories/parameters)를 업데이트 하고, 다음의 `a11y`설정을 추가하세요.

```diff:title=.storybook/preview.js

import React from 'react';

import { GlobalStyle } from '../src/shared/global';

/*
* Storybook global-devorators에 대한 자세한 내용은 다음 웹 사이트를 참조하세요. -
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
* Storybook의 더 많은 global parameter들은 여기로 - 
* https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
*/
+ export const parameters = {
+   actions: { argTypesRegex: '^on[A-Z].*' },
+   // 스토리북 a11y 애드온 설정
+   a11y: {
+     // 타겟 DOM 엘리먼트
+     element: '#root',
+     // 애드온의 실행 모드를 설정
+     manual: false,
+   },
+ };
```

모든 설정이 완료되면 Storybook 애드온(addon) 패널에 새로운 "접근성"탭이 표시됩니다.

![Stotybook A11y 애드온(addon)](/design-systems-for-developers/storybook-addon-a11y-6-0.png)

DOM 요소 (위반 및 통과)의 접근성 수준을 보여줍니다. UI 컴포넌트인 "highlight results" 체크박스를 클릭하여 UI 컴포넌트와 관련된 상황에서의 위반 사항을 시각화합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-a11y-6-0-highlighted.mp4"
    type="video/mp4"
  />
</video>

지금부터는 애드온(addon)의 접근성 권장 사항을 따르세요.

## 기타 테스트 전략

역설적이게도 테스트는 시간을 절약해주기도 하지만 유지 관리로 인해 개발 속도를 저하시킵니다. 모든 것이 아니라 올바른 것을 테스트하는 데 집중하세요. 소프트웨어 개발에는 많은 테스트 전략이 있지만 모두 디자인 시스템에 적합하지는 않다는 것을 저희도 어렵게 깨달았습니다.

#### 스냅샷 테스트 (Jest)

이 기술은 UI 컴포넌트의 코드 출력을 캡처하여 이전 버전과 비교합니다. UI 컴포넌트 마크업을 테스트하면 결국에는 사용자가 브라우저에서 경험하는 것을 테스트하는 것이 아닌 구현 세부 정보 (코드)를 테스트하게 됩니다.

변경된 코드 스냅샷 비교는 예측할 수 없으며 긍정 오류(false positive)가 발생하기 쉽습니다. 컴포넌트 수준에서의 코드 스냅 샷은 디자인 토큰, CSS 및 타사 API 업데이트 (웹 글꼴, 스트라이프 양식, Google 지도 등)와 같은 전체적인 변경 사항을 탐지할 수 없습니다. 실제로 개발자는 "모두 승인"하거나 스냅 샷 테스트를 모두 무시합니다.

> 대부분의 컴포넌트 스냅샷 테스트는 실제로 스크린샷 테스트의 더 나쁜 버전입니다. 출력을 테스트하십시오. 기본 (휘발성!) 마크업이 아니라 렌더링 되는 항목을 스냅샷 합니다. – Mark Dalgliesh, SEEK의 프런트엔드 인프라, CSS 모듈 작성자

#### 엔드 투 엔드 테스트 (Selenium, Cypress)

엔드 투 엔드 테스트는 컴포넌트 DOM을 탐색하여 사용자의 작업 절차를 시뮬레이션합니다. 가입 또는 결제 프로세스와 같은 앱 작업 절차를 확인하는 데 가장 적합합니다. 이 테스트 전략은 기능이 복잡할수록 더 유용합니다.

디자인 시스템은 비교적 단순한 기능을 가진 단일 컴포넌트를 포함합니다. 사용자 작업 절차에 대한 유효성 검사는 테스트를 생성하는 데 시간이 많이 걸리고 유지 관리를 하기에도 취약하기 때문에 여기에는 적합하지 않은것으로 간주되는 편입니다. 그러나 컴포넌트가 드물게 엔드 투 엔드 테스트의 이점을 누릴 수 있는 경우도 있습니다. 예를 들면, 날짜 선택기 또는 자체 내장된 결제 양식과 같은 복잡한 UI의 유효성을 검사하는 경우입니다.

## 문서화를 통해 디자인 시스템 도입 촉진

디자인 시스템은 테스트만으로는 완성되지 않습니다. 디자인 시스템은 조직 전체의 이해 관계자들에게 서비스를 제공하므로 잘 테스트 된 UI 컴포넌트를 최대한 활용하는 방법을 다른 사람들에게 가르쳐야 합니다.

6장에서는 문서를 통해 디자인 시스템 도입을 가속화하는 방법을 배웁니다. 왜 Storybook Docs가 작은 노력으로 이해하기 쉬운 문서를 만드는 비밀 무기인지 알아보세요.
