---
title: '디자인 시스템을 위한 워크플로우'
tocTitle: '워크플로우'
description: '프론트엔드 개발자를 위한 디자인 시스템 워크플로우 살펴보기'
commit: ab64b4c
---

디자인팀과 개발팀이 이루고자 하는 목표의 가치는 프런트엔드 도구들이 어떻게 함께 작동하느냐에 영향을 많이 받는다. 잘 구성되었다면 UI 컴포넌트를 개발하고 재사용하는 과정이 원활해야 한다.

이 챕터에서는 새로운 컴포넌트인 `AvatarList`를 통해 5단계의 워크플로우를 보여줄 것이다.

![Design system workflow](/design-systems-for-developers/design-system-workflow-horizontal.jpg)


## 빌드
`AvatarList` 컴포넌트는 여러 아바타를 보여준다. 다른 디자인 시스템 컴포넌트와 마찬가지로 `AvatarList`는 다양한 프로젝트에 붙여 넣어지면서 사용되었다. 그렇기 때문에 더더욱 디자인 시스템에 포함되어야 한다. 이 데모에서는 `AvatarList` 컴포넌트가 다른 프로젝트에서 이미 개발되었다고 가정하고 바로 완성된 코드부터 설명을 시작할 것이다.

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

첫 번째로 git에서 새로운 브랜치를 생성한다. 이 브랜치에서 작업을 진행할 것이다.

```shell
git checkout -b create-avatar-list-component
```

`AvatarList` 컴포넌트와 스토리를 본인 기기에 다운로드하고 `/src` 디렉토리에 넣는다.

- [컴포넌트 파일](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.js)
- [스토리 파일](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.stories.js)

스토리북은 `\*.stories.js`으로 끝나는 파일을 자동으로 감지해서 설정하고 UI에 보여줄 것이다.

![Storybook with AvatarList component](/design-systems-for-developers/storybook-with-avatarlist-6-0.png)

성공! 이제 `AvatarList`에서 지원하는 각각의 UI 상태를 명시한다. 우선 `AvatarList`는  `small`이나 `loading` 같은 `Avatar`의 속성을 지원한다.

```javascript
// src/AvatarList.stories.js

export const SmallSize = Template.bind({});
SmallSize.args = {
  users: short.args.users,
  size: 'small',
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};
```

![Storybook with more AvatarList stories](/design-systems-for-developers/storybook-with-avatarlist-loading-6-0.png)

이 컴포넌트는 리스트이므로 여러 아바타를 보여줘야 한다. 리스트 아이템이 많을 때와 적을 때 어떤 일이 발생하는지 볼 수 있는 스토리를 추가해보자.

```javascript
// src/AvatarList.stories.js

export const Ellipsized = Template.bind({});
Ellipsized.args = {
  users: [
    ...short.args.users,
    {
      id: '3',
      name: 'Zoltan Olah',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/81672',
    },
    {
      id: '4',
      name: 'Tim Hingston',
      avatarUrl: 'https://avatars3.githubusercontent.com/u/1831709',
    },
  ],
};

export const BigUserCount = Template.bind({});
bigUserCount.args = {
  users: Ellipsized.args.users,
  userCount: 100,
};

export const Empty = Template.bind({});
empty.args = {
  users: [],
};
```
<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-with-all-avatarlist-stories-6-0.mp4"
    type="video/mp4"
  />
</video>

현재까지의 진행 상황을 저장하고 커밋한다.

```shell
git commit -am "Added AvatarList and stories"
```

## 문서화

스토리북의 `Docs` 애드온 덕분에 적은 노력으로 맞춤형 문서화 작업이 가능하다. 다른 사용자들은 스토리북의 `Docs` 탭을 참고해서 어떻게 `AvatarList`를 사용하는지 배울 수 있다.

![Storybook docs with minimal AvatarList info](/design-systems-for-developers/storybook-docs-minimal-avatarlist.png)

최소한의 기능을 담은 문서가 완성됐다! `AvatarList`를 어떻게 사용하는지 추가 설명을 덧붙여주자.

```javascript
// src/AvatarList.stories.js

/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {
```

지원되는 props에 대한 설명도 추가한다.

```javascript
// src/AvatarList.stories.js

AvatarList.propTypes = {
  /**
   * Are we loading avatar data from the network?
   */
  loading: PropTypes.bool,
  /**
   * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayed.
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    })
  ),
  /**
   * The total number of users, if a subset is passed to `users`.
   */
  userCount: PropTypes.number,
  /**
   * AvatarList comes in four sizes. In most cases, you’ll be fine with `medium`.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

이제 누워서 떡 먹기이다. 지금으로서는 이 정도의 자세한 설명이면 충분한 듯하다. MDX를 사용해서 나중에 얼마든지 더 수정할 수 있다. 

![Storybook docs with full AvatarList info](/design-systems-for-developers/storybook-docs-full-avatarlist.png)

문서화하는 과정이 항상 지겨울 필요는 없다. 우리는 자동화 도구를 사용해서 사용자들이 지루한 작업 없이 바로 문서 작성에만 집중할 수 있도록 했다.

변경 사항을 커밋하고 Github에 푸쉬한다.

```shell
git commit -am "Improved AvatarList docs"
```

### 풀 리퀘스트 생성하기

`AvatarList` 브랜치를 Github에 푸쉬한다.

```shell
git push -u origin create-avatar-list-component
```

그리고 Github으로 가서 풀 리퀘스트를 생성한다.

![PR created in PR for AvatarList](/design-systems-for-developers/github-pr-create-avatarlist.png)

## 리뷰

현재 시점에서 `AvatarList`는 디자인 시스템에 포함될 컴포넌트 후보이다. 관계자들이 해당 컴포넌트를 검토하고 그 기능과 모양이 기대에 충족하는지 반드시 확인해야 한다.

디자인 시스템의 스토리북은 각 풀 리퀘스트마다 자동으로 배포되어서 리뷰 과정을 매우 손쉽게 만들어 준다. PR checks의 하단으로 스크롤 해서 배포된 스토리북 링크를 찾아보자.

![PR check for deployed PR](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

온라인 스토리북에서 `AvatarList`를 찾아보자. 사용자의 로컬 스토리북과 동일하게 보여야 한다. 

![AvatarList in Storybook online](/design-systems-for-developers/netlify-deployed-avatarlist-stories.png)

온라인 스토리북은 팀이 함께 공유하는 공통 레퍼런스이다. `AvatarList` 링크를 다른 관계자들과 공유해서 더 빠르게 피드백을 받을 수 있다. 개발 환경을 만들 필요도 없고 코드를 건드릴 필요도 없으니 팀원들이 당신을 사랑할 것이다. 

![Looks good, ship it!](/design-systems-for-developers/visual-review-shipit.png)

수많은 팀과 만장일치에 도달하는 과정은 아무짝에도 쓸모없는 것처럼 느껴질 때가 있다. 누구는 이전 버전의 코드를 보고 있거나, 개발 환경이 없거나, 어쩌면 여러 툴에 피드백이 흩어져 있을 수도 있다. 온라인 스토리북을 사용해서 리뷰한다면 간단하게 URL만 공유하면 된다. 

## 테스트

스토리북의 테스트 스위트는 매 커밋마다 백그라운드에서 실행된다. `AvatarList`는 간단한 프레젠테이션 컴포넌트이기 때문에 유닛 테스트가 필요하지 않다. 하지만 PR check을 살펴보면, 비주얼 테스팅 툴인 Chromatic이 이미 검토가 필요한 변경사항을 감지한 것을 알 수 있다.

![Chromatic changes on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

`AvatarList`는 새로운 컴포넌트라서 아직 비주얼 테스트가 없다. 각 스토리에 최소한의 기준을 만들어주자. Chromatic의 "new stories"에 동의하고 비주얼 테스트 커버리지를 확장한다. 

![Chromatic changes to the AvatarList stories](/design-systems-for-developers/chromatic-avatarlist-changes.png)

여기까지 완료되었다면 Chromatic에서 빌드가 통과될 것이다. 

![Chromatic changes to the AvatarList stories accepted](/design-systems-for-developers/chromatic-avatarlist-changes-accepted.png)

그러고 나면 Github의 PR check이 업데이트된다.

![Chromatic changes accepted on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes-accepted.png)

테스트가 성공적으로 반영되었다. 나중에 회귀 테스트를 하는 사람은 디자인 시스템을 파고드느라 고생을 꽤 할 것이다.

## 배포

`AvatarList`를 디자인 시스템에 추가하겠다는 풀 리퀘스트가 현재 열려있는 상태이다. 스토리도 작성했고 테스트도 통과했고 문서화도 완성했다. 마지막으로 `Auto`와 `npm`을 사용해서 디자인 시스템 패키지를 업데이트하면 된다. 

풀 리퀘스트에 `minor` 레이블을 추가하자. 이 레이블은 풀 리퀘스트가 머지되면 `Auto`에게 패키지의 minor 버전을 업데이트하도록 지시한다.

![GitHub PR with labels](/design-systems-for-developers/github-pr-labelled.png)

이제 풀 리퀘스트를 머지하고 해당 npm 패키지로 이동한다. 패키지가 업데이트될 때까지 몇 분간 기다린다.

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

성공! Github으로 간편하게 디자인 시스템 패키지를 배포했다. 커맨드 라인이나 npm을 건드릴 필요가 없다. `AvatarList`를 사용하려면 로컬의 예제 앱에서 `learnstorybook-design-system` 디펜던시를 업데이트하면 된다.

## 이제부터 시작이다

누구나 자신만의 것을 개발할 때 손쉽게 시작할 수 있도록 _개발자를 위한 디자인 시스템_ 은 전문적인 프런트앤드 팀들이 사용하는 엔드 투 엔드 워크플로우를 강조한다. 

당신의 디자인 시스템이 성장할수록 이 도구들을 당신 팀의 요구에 맞게 추가하고 재배열하고 확장하길 바란다.

9장에서는 완성된 샘플 코드, 유용한 자료, 개발자들이 흔히 하는 질문으로 내용을 마무리할 것이다.