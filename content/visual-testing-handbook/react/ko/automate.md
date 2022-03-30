---
title: '시각적 테스트 자동화'
tocTitle: '자동화'
description: '회귀 오류를 잡기 위해 시각적 테스트를 자동화하기'
commit: 'd7daf97'
---

자연스러운 개발 과정에서는 버그가 불가피합니다. 시각적 테스트 자동화는 기계를 사용해 사용자가 검토할 UI 외관의 변화를 감지합니다.

<!--
Over the natural course of development, bugs are inevitable. Visual test automation uses machines to detect changes in UI appearance for a human to review.
-->

핵심만 말하자면, 이미지 스냅샷을 각 컴포넌트의 변화형(variation)마다 찍습니다. 이는 시각적 테스트의 "기준선(baseline)"역할을 합니다. 각 커밋마다 새로운 스냅샷이 캡쳐되고, 픽셀 단위로 기준선과 비교됩니다. UI가 변경된 경우 버그인지 의도적인 업데이트인지 확인하라는 알림을 받습니다.

<!--
In a nutshell, an image snapshot is taken of every component variation. This serves as the visual test "baseline". With each commit, new snapshots are captured then compared pixel-by-pixel to the baselines. If there are UI changes, you get notified to review whether they're bugs or intentional updates.
-->

<video autoPlay muted playsInline loop >
  <source
    src="/visual-testing-handbook/automate-visual-workflow-test-diff.mp4"
    type="video/mp4"
  />
</video>

## 깃허브 저장소를 구축하기

시작하기 전에, 로컬 `CommentList` 코드가 원격 버전 관리 서비스와 동기화되어야 합니다.

<!--
Before we start, our local `CommentList` code needs to sync with a remote version control service.
-->


GitHub에 접속하여 프로젝트 [여기](https://github.com/new))의 새로운 저장소를 만듭니다. 지역 프로젝트와 마찬가지로 저장소(repo)의 이름을 "commentlist"로 지정합니다.

<!-- Go to GitHub and create a new repository for the project [here](https://github.com/new). Name the repo "commentlist", same as our local project. -->

![GitHub에서 댓글 목록 저장소(repo) 설정](/visual-testing-handbook/commentlist-gh-repo-optimized.png)

<!-- ![Set up comment list repo in GitHub](/visual-testing-handbook/commentlist-gh-repo-optimized.png) -->

그런 다음 지침에 따라 저장소를 설정합니다. `your-username`을 GitHub 계정명으로 바꿉니다.

<!-- Then follow the instructions to set up the repository. Replace `your-username` with your GitHub account name. -->

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/commentlist.git
git push -u origin main
```

## 크로매틱(Chromatic) 설정
<!-- ## Setup Chromatic -->

Chromatic by Storybook maintainers를 사용하여 이미지 스냅샷 프로세스를 시연합니다. [chromatic.com](https://www.chromatic.com/))에 접속하여 GitHub 계정으로 가입하세요.

<!-- We'll use Chromatic by Storybook maintainers to demonstrate the image snapshotting process. Go to [chromatic.com](https://www.chromatic.com/) and signup with your GitHub account. -->

![크로매틱 로그인](/visual-testing-handbook/chromatic-sign-in-optimized.png)

<!-- ![Chromatic sign in](/visual-testing-handbook/chromatic-sign-in-optimized.png) -->

여기서 방금 만든 저장소를 선택합니다.
<!-- From there, choose the repository you've just created. -->

<video autoPlay muted playsInline loop>
  <source src="/visual-testing-handbook/chromatic-create-project-optimized.mp4"
    type="video/mp4" />
</video>

UI 테스트는 클라우드 브라우저 환경의 모든 스토리의 이미지 스냅샷을 캡처합니다. 코드를 푸시할 때마다 Chromatic은 새 스냅샷 집합을 생성하여 기준선과 비교합니다. 시각적 변화가 있는 경우 의도적인 것인지 확인합니다.

<!-- UI tests capture an image snapshot of every story in a cloud browser environment. Whenever you push code, Chromatic generates a new set of snapshots and compares them against baselines. If there are visual changes, you verify if they’re intentional. -->

### 기준선 설정
<!-- ### Establish baselines -->

프로젝트에 개발 패키지로 Chromatic을 추가합니다 -

```shell
yarn add -D chromatic
```

설치가 완료되면 필요한 모든 것을 얻을 수 있습니다. 지금이야말로 변경을 리모트 저장소로 커밋하고 푸시할 절호의 기회입니다.

<!-- Once it’s finished installing, we have all that we need. Now is an excellent time to commit and push the changes to the remote repository. -->

```shell
git add .
git commit -m "Added Chromatic"
git push
```

Chromatic 명령어로 스토리북을 제작하여 발행하세요. 웹사이트에서 <code> project-token </code>를 하나의 Chromatic 공급 장치로 교체하는 것을 잊지 마세요.

<!-- Build and publish our Storybook with the `chromatic` command. Don't forget to replace the <code>project-token</code> with one Chromatic supplies on the website. -->

```shell
yarn chromatic --project-token=<project-token>
```

![크로매틱(Chromatic) 실행](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

<!-- ![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png) -->

이 명령어 하나로 스토리북을 퍼블리싱하고 크로매틱이 각 스토리(표준 클라우드 브라우저)의 이미지 스냅샷을 캡처하고 스냅샷을 기준으로 설정하도록 했습니다.

<!-- With this one command, you published your Storybook, triggered Chromatic to capture an image snapshot of each story (in a standardized cloud browser), and set the snapshot as the baseline. -->

이후 빌드는 UI 변경을 감지하기 위해 기존 기준선과 비교되는 새 스냅샷을 생성합니다.

<!-- Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes. -->

![크로매틱의 기준선](/visual-testing-handbook/commentlist-accepted-baselines-optimized.png)

<!-- ![Baselines in Chromatic](/visual-testing-handbook/commentlist-accepted-baselines-optimized.png) -->

### 테스트를 실행하기

풀 리퀘스트(PR)가 UI 변경을 포함하고 있다면, 크던 작던, 시각적 테스트를 실행하는 게 유용합니다. 크로매틱은 새 스냅샷들을 이전 빌드에서 만들었던 기존의 기준선과 비교할 겁니다.

<!--
Every time a pull request contains UI changes, big or small, it's helpful to run the visual tests. Chromatic compares new snapshots to existing baselines from previous builds.
-->

그럼 이 개념을 설명하기 위해 UI를 약간 변경해 보겠습니다.
<!--
Let's make a small UI change to demonstrate this concept.
-->

```shell
git checkout -b change-commentlist-outline
```

`CommentList` 컴포넌트를 약간 뒤틀어봅니다.

```diff:title=src/components/CommentList.js
import React from 'react';

import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

const CommentListDiv = styled.div`
  font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  display: inline-block;
  vertical-align: top;
  width: 265px;
`;

const CommentItemDiv = styled.div`
  font-size: 12px;
  line-height: 14px;
  clear: both;
  height: 48px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0;
  background: linear-gradient(
    120deg,
    rgba(248, 248, 254, 0.95),
    rgba(250, 250, 250, 0.95)
  );
  border-radius: 48px;
+ border: 4px solid red;
+ font-weight: bold;
`;

const AvatarDiv = styled.div`
  float: left;
  position: relative;
  overflow: hidden;
  height: 48px;
  width: 48px;
  margin-right: 14px;
  background: #dfecf2;
  border-radius: 48px;
`;

const AvatarImg = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background: #999;
`;

const MessageDiv = styled.div`
  overflow: hidden;
  padding-top: 10px;
  padding-right: 20px;
`;

const AuthorSpan = styled.span`
  font-weight: bold;
`;
const TextSpan = styled.span``;

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
`;

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>loading</div>;
  }
  if (comments.length === 0) {
    return <div>empty</div>;
  }
  return (
    <>
    <GlobalStyle/>
    <CommentListDiv>
      {comments.map(({ text, author: { name, avatar } }) => (
        <CommentItemDiv key={`comment_${name}`}>
          <AvatarDiv>
            <AvatarImg src={avatar} />
          </AvatarDiv>
          <MessageDiv>
            <AuthorSpan>{name}</AuthorSpan> <TextSpan>{text}</TextSpan>
          </MessageDiv>
        </CommentItemDiv>
      ))}
    </CommentListDiv>
    </>
  );
}

CommentList.propTypes = {
  /**
   * Is the component in the loading state
   */
  loading: PropTypes.bool,

  /**
   * Total number of comments
   */
  totalCount: PropTypes.number,
  /**
   * List of comments
   */
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    })
  ),
};

CommentList.defaultProps = {
  loading: false,
  totalCount: 10,
  comments: [],
};

```

변경사항을 커밋하고, 저장소에 푸시한 뒤에 크로매틱을 실행합니다.
<!--
Commit the change, push it to the repo and run Chromatic:
-->

```shell
git commit -am "make CommentList sparkle"
git push -u origin change-commentlist-outline
yarn chromatic --project-token=<project-token>
```

깃허브 저장소에서 새 브랜치를 위한 풀 리퀘스트를 엽니다.
<!--
Open a pull request for the new branch in your GitHub repository.
-->


![GitHub에서 열린 풀 리퀘스트(PR)된 댓글 목록](/visual-testing-handbook/commentlist-gh-pullrequest-optimized.png)

<!-- ![Comment list pull requested opened in GitHub](/visual-testing-handbook/commentlist-gh-pullrequest-optimized.png) -->


사용자가 검토할 UI 변경 사항을 크로매틱으로 감지했습니다! 변경 사항 목록을 보려면 PR checks로 가서 "🟡 UI Test"를 클릭하세요. 이번 빌드는 "unreviewed"라고 표시되고 변경사항들은 "Tests" 테이블에 나열됩니다.

<!--
Chromatic detected UI changes for you to review! Go to the PR checks and click "🟡 UI Test" to see the list of changes. The build will be marked “unreviewed” and the changes listed in the “Tests” table.
-->

![크로매틱에 발행된 새 변경 사항들](/visual-testing-handbook/commentlist-ui-tests-chromatic-optimized.png)

<!-- ![New changes published to Chromatic](/visual-testing-handbook/commentlist-ui-tests-chromatic-optimized.png) -->

### 변경 내용 확인
<!-- ### Review changes -->

시각 테스트를 자동화하여 컴포넌트가 실수로 변경되지 않도록 합니다. 그러나 변경이 의도적인 것인지 아닌지 결정 여부는 여전히 개발자들에게 달려 있습니다.

<!--
Automating visual testing ensures components don’t change by accident. But it’s still up to developers to determine whether changes are intentional or not.
-->

의도적으로 변경한 경우에는 스냅샷을 받아들여 기준선을 업데이트합니다.따라서 미래의 테스트는 빨간 테두리를 두른 `CommentList`를 기준으로 비교하게 됩니다.

<!--
If a change is intentional, we accept the snapshot to update the baseline. That means future tests will be compared to the `CommentList` with red borders.
-->

의도하지 않은 변경이라면 고쳐야 합니다. 우리 디자이너는 이 ✨장엄한✨ 빨간 테두리가 끔찍하다고 생각하니 변경을 취소하겠습니다.

![크로매틱 테스트 화면](/visual-testing-handbook/chromatic-test-screen-optimized.png)
<!-- ![Chromatic test screen](/visual-testing-handbook/chromatic-test-screen-optimized.png) -->

### 변경사항을 머지(merge)하기

버그가 수정되고 기준선이 최신 상태가 되면, 코드를 target 브랜치로 다시 머지(merge)할 수 있습니다. Chromatic은 브랜치 사이에서 승인된 기준선을 전송하므로 기준선을 한 번만 승인해주면 됩니다. 

<!--
Once bugs are fixed and baselines are up to date, you're ready to merge code back into the target branch. Chromatic will transfer any accepted baselines between branches so that you only need to accept baselines once.
-->

![시각적 테스팅 작업흐름(workflow)](/visual-testing-handbook/workflow-uitest.png)
<!-- ![visual testing workflow](/visual-testing-handbook/workflow-uitest.png) -->

### 지속적 통합

변경사항을 만들 때마다 이 명령어를 로컬에서 실행하는 건 귀찮습니다. 프로덕션 팀은 코드를 CI/CD 파이프라인에 푸시할 때마다 시각적 테스트가 실행되게 트리거(trigger)를 설정합니다. 이 튜토리얼에서는 설정하지 않지만[Chromatic's CI docs](https://www.chromatic.com/docs/ci)에서 자세한 내용을 확인할 수 있습니다.

<!--
Running this command locally each time we make a change is tiresome. Productions teams trigger visual test runs when code is pushed in their CI/CD pipeline. While we won't set that up in this tutorial, you can learn more in [Chromatic's CI docs](https://www.chromatic.com/docs/ci).
-->

## 여행의 시작

시각적 테스팅 핸드북은 주요 프런트엔드 팀이 UI 외관을 테스트하는 방법을 보여주는 쇼케이스였습니다. 시각적 테스팅은 UI가 의도한 설계와 일치하고 시간이 지남에 따라 버그가 발생하지 않는지 확인하는 실용적인 방법입니다.

<!--
Visual Testing Handbook showcases the how leading frontend teams test UI appearance. It's a practical way to verify that UI matches the intended design and remains bug free over time.
-->

이 가이드가 당신의 시각적 테스트 전략에 도움이 되기를 바랍니다. 마지막 장에서는 완전한 샘플 코드와 유용한 자료들 소개로 마무리합니다.

<!--
We hope this guide inspires your own visual test strategy. The final chapter concludes with the complete sample code and helpful resources.
-->
