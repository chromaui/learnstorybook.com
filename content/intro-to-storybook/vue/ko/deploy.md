---
title: 'Storybook 배포하기'
tocTitle: '배포'
description: 'Storybook을 온라인에 배포하는 방법을 배워보세요'
---

지금까지 로컬 개발 환경에서 컴포넌트를 만들었습니다. 이제 팀원들의 의견을 받을 수 있도록 결과물을 공유해봅시다. Storybook을 온라인에 배포하면 팀원들도 구현된 UI를 살펴볼 수 있습니다.

## 정적 웹 앱으로 내보내기

Storybook을 배포하려면 먼저 정적 웹 앱으로 내보내야 합니다. 이 기능은 Storybook에 기본으로 포함되어 있으며 설정도 되어 있습니다.

`yarn build-storybook`을 실행하면 `storybook-static` 디렉터리에 정적 Storybook 파일이 생성됩니다. 이 파일들을 원하는 정적 사이트 호스팅 서비스에 배포하면 됩니다.

## Storybook 게시하기

이 튜토리얼에서는 Storybook 유지 관리팀이 만든 무료 배포 서비스인 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)을 사용합니다. Chromatic을 이용하면 Storybook을 클라우드에 안전하게 배포하고 호스팅할 수 있습니다.

### GitHub 저장소 만들기

먼저 로컬 코드를 원격 버전 관리 서비스에 연결해야 합니다. [시작하기](/intro-to-storybook/vue/ko/get-started/)에서 프로젝트를 설정할 때 로컬 저장소를 초기화했으므로, 지금까지 만든 커밋을 원격 저장소에 올리면 됩니다.

GitHub의 [새 저장소 만들기 페이지](https://github.com/new)에서 프로젝트 저장소를 만드세요. 저장소 이름은 로컬 프로젝트와 같은 "taskbox"로 지정합니다.

![GitHub 저장소 만들기](/intro-to-storybook/github-create-taskbox.png)

새 저장소의 URL을 복사한 뒤, 다음 명령어로 git 프로젝트의 원격 저장소를 등록합니다:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

마지막으로 로컬 저장소의 내용을 GitHub에 푸시합니다:

```shell
git push -u origin main
```

### Chromatic 설치하기

Chromatic 패키지를 개발 의존성으로 추가합니다.

```shell
yarn add -D chromatic
```

설치가 끝나면 GitHub 계정으로 [Chromatic에 로그인](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)하세요. Chromatic은 최소한의 권한만 요청합니다. 그런 다음 "taskbox"라는 프로젝트를 만들고, 앞서 생성한 GitHub 저장소와 연결합니다.

collaborators 항목 아래에서 `Choose GitHub repo`를 클릭하고 저장소를 선택하세요.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

프로젝트에 발급된 고유한 `project-token`을 복사하세요. 그런 다음 아래 명령어로 Storybook을 빌드하고 배포합니다. `project-token`은 복사한 프로젝트 토큰으로 바꿔주세요.

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic 실행 화면](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

완료되면 배포된 Storybook에 접속할 수 있는 `https://random-uuid.chromatic.com` 형태의 링크가 나옵니다. 팀에 공유하고 피드백을 받아보세요.

<!--
 TODO:
   - Follow up Design to get updated versions of this assets
     - One for non-React versions that showcase the same structure (i.e., Task, PureTaskList and InboxScreen)
 -->

![Chromatic으로 배포한 Storybook](/intro-to-storybook/chromatic-manual-storybook-deploy-non-react.png)

명령어 하나로 Storybook을 배포했습니다. 하지만 UI를 공유할 때마다 직접 명령어를 실행하는 것은 번거롭습니다. 코드를 푸시할 때마다 최신 컴포넌트가 자동으로 배포되도록 설정해봅시다.

## Chromatic으로 지속적 배포 설정하기

코드를 GitHub 저장소에 올렸으므로, 지속적 통합(CI) 서비스를 이용해 Storybook을 자동으로 배포할 수 있습니다. GitHub에 내장된 무료 CI 서비스인 [GitHub Actions](https://github.com/features/actions)를 사용하면 간단하게 설정할 수 있습니다.

### Storybook 배포용 GitHub Actions 워크플로 추가하기

프로젝트 루트에 `.github` 디렉터리를 만들고, 그 안에 `workflows` 디렉터리를 만듭니다.

`chromatic.yml` 파일을 만들고 아래 내용을 작성하세요.

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  chromatic:
    name: 'Run Chromatic'
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@latest
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/svelte/en/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">

💡 여기서는 [GitHub secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)의 자세한 설정 방법은 다루지 않습니다. Secrets는 GitHub에서 안전하게 관리하는 환경 변수로, `project-token`을 코드에 직접 적지 않아도 됩니다.

</div>

### 워크플로 커밋하기

터미널에서 다음 명령어로 변경한 파일을 스테이징합니다:

```shell
git add .
```

이어서 변경 사항을 커밋합니다:

```shell
git commit -m "GitHub action setup"
```

마지막으로 원격 저장소에 푸시합니다:

```shell
git push origin main
```

GitHub Actions를 설정하면 코드를 푸시할 때마다 Storybook이 Chromatic에 배포됩니다. 배포된 Storybook은 Chromatic 프로젝트의 빌드 화면에서 확인할 수 있습니다.

![Chromatic 사용자 대시보드](/intro-to-storybook/chromatic-user-dashboard.png)

맨 위에 있는 최신 빌드를 클릭하세요.

그런 다음 `View Storybook` 버튼을 클릭하면 최신 Storybook이 열립니다.

![Chromatic의 Storybook 링크](/intro-to-storybook/chromatic-build-storybook-link.png)

이 링크를 팀원들에게 공유하세요. 개발 중에 의견을 주고받을 때도, 완성한 작업물을 보여줄 때도 유용합니다 💅.
