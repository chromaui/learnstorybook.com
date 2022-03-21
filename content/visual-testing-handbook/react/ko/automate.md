---
title: '시각적 테스팅 자동화'
tocTitle: '자동화'
description: '회귀 오류를 잡기 위해 시각적 테스팅을 자동화하기'
commit: 'd7daf97'
---

개발하는 자연스러운 과정에서, 버그는 피할 수 없습니다. 시각적 테스트 자동화는 기계를 사용해 UI 겉모습이 변했는지 감지해서 인간이 검토할 수 있게 해줍니다. 

<!--
Over the natural course of development, bugs are inevitable. Visual test automation uses machines to detect changes in UI appearance for a human to review.
-->

핵심만 말하자면, 이미지 스냅샷을 각 컴포넌트의 변화형(variation)마다 찍습니다. 이는 시각적 테스트의 "기준선(baseline)"으로 쓰입니다. 각 커밋마다, 새 스냅샷을 찍고, 이 기준선과 픽셀 하나하나를 비교합니다. 혹시 UI에 변한 부분이 있으면, 버그인지 의도적인 변경인지 검토해달라고 알림을 받습니다.
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

시작하기 전에, 우리의 로컬 `CommentList` 코드를 원격 버전 관리 서비스와 동기화해야 합니다.
<!--
Before we start, our local `CommentList` code needs to sync with a remote version control service.
-->


Go to GitHub and create a new repository for the project [here](https://github.com/new). Name the repo "commentlist", same as our local project.

![Set up comment list repo in GitHub](/visual-testing-handbook/commentlist-gh-repo-optimized.png)

Then follow the instructions to set up the repository. Replace `your-username` with your GitHub account name.

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/commentlist.git
git push -u origin main
```

## Setup Chromatic

We'll use Chromatic by Storybook maintainers to demonstrate the image snapshotting process. Go to [chromatic.com](https://www.chromatic.com/) and signup with your GitHub account.

![Chromatic sign in](/visual-testing-handbook/chromatic-sign-in-optimized.png)

From there, choose the repository you've just created.

<video autoPlay muted playsInline loop>
  <source src="/visual-testing-handbook/chromatic-create-project-optimized.mp4"
    type="video/mp4" />
</video>

UI tests capture an image snapshot of every story in a cloud browser environment. Whenever you push code, Chromatic generates a new set of snapshots and compares them against baselines. If there are visual changes, you verify if they’re intentional.

### Establish baselines

Add Chromatic as a development package to your project:

```shell
yarn add -D chromatic
```

Once it’s finished installing, we have all that we need. Now is an excellent time to commit and push the changes to the remote repository.

```shell
git add .
git commit -m "Added Chromatic"
git push
```

Build and publish our Storybook with the `chromatic` command. Don't forget to replace the <code>project-token</code> with one Chromatic supplies on the website.

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

With this one command, you published your Storybook, triggered Chromatic to capture an image snapshot of each story (in a standardized cloud browser), and set the snapshot as the baseline.

Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes.

![Baselines in Chromatic](/visual-testing-handbook/commentlist-accepted-baselines-optimized.png)

### 테스트를 실행하기

풀 리퀘스트가 UI 변경을 포함하고 있다면, 크던 작던, 시각적 테스트를 돌리는 게 도움이 됩니다. Chromatic은 새 스냅삿들을 이전 빌드에서 만들었던 기존의 기준선과 비교할 겁니다. 
<!--
Every time a pull request contains UI changes, big or small, it's helpful to run the visual tests. Chromatic compares new snapshots to existing baselines from previous builds.
-->

그러면 이 개념을 시연하기 위해서, 작은 UI 변경사항을 만들어 봅시다.
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

변경사항을 커밋하고, 저장소에 푸시한 뒤에 Chromatic 을 실행합니다.
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

![Comment list pull requested opened in GitHub](/visual-testing-handbook/commentlist-gh-pullrequest-optimized.png)

크로마틱이 당신이 검토할 UI 변경을 찾아놨을 겁니다. 변경된 목록을 보려면 PR checks로 가서 "🟡 UI Test"를 클릭하세요. 이번 빌드는 "unreviewed"라고 표시되어 있고 변경사항들은 "Tests" 테이블에 나열되어 있을 겁니다.

<!--
Chromatic detected UI changes for you to review! Go to the PR checks and click "🟡 UI Test" to see the list of changes. The build will be marked “unreviewed” and the changes listed in the “Tests” table.
-->

![New changes published to Chromatic](/visual-testing-handbook/commentlist-ui-tests-chromatic-optimized.png)

### Review changes

시각적 테스팅을 자동화하면 컴포넌트가 실수로 변경되지 않았다는 걸 보장해줍니다. 하지만 이 변경사항이 의도적인지 아닌지 결정할 책임은 여전히 개발자에게 있습니다.
<!--
Automating visual testing ensures components don’t change by accident. But it’s still up to developers to determine whether changes are intentional or not.
-->

만약 변경이 의도적이었다면, 이 스냅샷을 받아들여서 기준선을 최신화합니다. 즉 미래의 테스트에서는 빨간 테두리를 가진 `CommentList`를 기준으로 비교하게 된다는 뜻입니다.

<!--
If a change is intentional, we accept the snapshot to update the baseline. That means future tests will be compared to the `CommentList` with red borders.
-->

만약 변경을 의도한 게 아니었다면, 고쳐야 합니다. 우리 디자이너는 이 ✨위엄있는✨ 빨간 테두리가 불쾌하다 생각하니, 뒤로 돌리겠습니다.

![Chromatic test screen](/visual-testing-handbook/chromatic-test-screen-optimized.png)

### 변경사항을 머지하기

일단 버그를 고치고 기준선을 최신화하고나면, 코드를 target 브랜치로 다시 머지시킬 준비가 되었습니다. Chromatic은 브랜치 사이에서 승인된기준선을 이전(transfer)해주기 때문에, 기준선을 한 번만 승인(accept)해주면 됩니다. 
<!--
Once bugs are fixed and baselines are up to date, you're ready to merge code back into the target branch. Chromatic will transfer any accepted baselines between branches so that you only need to accept baselines once.
-->

![visual testing workflow](/visual-testing-handbook/workflow-uitest.png)

### 지속적 통합

변경사항을 만들 때마다 이 명령어를 로컬에서 실행하는 건 귀찮습니다. 프로덕션 팀은 코드를 CI/CD 파이프라인에 푸시할 때마다 시각적 테스트가 실행되게 트리거(trigger)를 설정합니다. 이 튜토리얼에서 이 설정을 하진 않겠비만, [Chromatic's CI docs](https://www.chromatic.com/docs/ci)에서 더 많은 걸 배울 수 있습니다.

<!--
Running this command locally each time we make a change is tiresome. Productions teams trigger visual test runs when code is pushed in their CI/CD pipeline. While we won't set that up in this tutorial, you can learn more in [Chromatic's CI docs](https://www.chromatic.com/docs/ci).
-->

## 여행의 시작

시각적 테스팅 핸드북은 최고의 프런트엔드 팀은 어떻게 UI 겉모습을 테스트하는지 보여주는 쇼케이스였습니다. 시각적 테스팅은 시간이 지나면서 UI가 의도한 디자인과 맞는지 검증하고, 버그에서 자유로운 상태를 유지하는 실용적인 방법입니다.

<!--
Visual Testing Handbook showcases the how leading frontend teams test UI appearance. It's a practical way to verify that UI matches the intended design and remains bug free over time.
-->

우리는 이 가이드가 당신만의 시각적 테스트 전략을 만드는데 영감을 주기를 바랍니다. 마지막 장에서는 완전한 예시 코드와 유용한 자료들을 소개하면서 결론을 짓겠습니다.
<!--
We hope this guide inspires your own visual test strategy. The final chapter concludes with the complete sample code and helpful resources.
-->
