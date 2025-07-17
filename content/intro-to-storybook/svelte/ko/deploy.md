---
title: 'Storybook 배포하기'
tocTitle: '배포'
description: 'Storybook을 온라인에 배포하는 방법을 배워봅시다.'
commit: '73f95be'
---

지금까지의 튜토리얼에서는, 로컬 환경에서 컴포넌트를 만들었습니다. 어떤 시점에는 작업을 팀과 공유하여 피드백을 받아야 합니다. 팀원들이 UI 구현을 거토할 수 있도록 Storybook을 온라인에 배포해 봅시다.

## 정적 앱으로 내보내기

Storybook을 배포하려면 먼저 Storybook을 정적 웹 앱으로 내보내야 합니다. 이 기능은 이미 Storybook에 내장 및 구성되어 있습니다.

`yarn build-storybook` 명령을 실행하면 `storybook-static` 디렉터리에 정적 Storybook이 생성되고, 이것을 임의의 정적 사이트 호스팅 서비스에 배포할 수 있습니다.

## Storybook 게시하기

이 튜토리얼에서는 Storybook 유지 관리자들이 만든 무료 게시 서비스인 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)을 사용합니다. 이를 통해 Storybook을 안전하고 확실하게 클라우드에 배포하고 호스팅할 수 있습니다.

### GitHub 저장소 설정하기

시작하기 전에, 로컬 코드가 원격 버전 관리 서비스와 동기화되어야 합니다. 저희는 [시작하기](/intro-to-storybook/svelte/en/get-started/) 챕터에서 프로젝트를 설정할 때 이미 로컬 저장소를 초기화해 두었습니다. 그리고 이미 원격 저장소로 푸시할 수 있는 커밋이 있습니다.

GitHub로 가서 프로젝트를 위한 새 저장소를 만드세요([새 저장소 만들기](/intro-to-storybook/svelte/en/get-started/)). 저장소 이름은 로컬 프로젝트와 똑같이 "taskbox"로 지정합니다.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

새 저장소에서 origin URL을 복사한 뒤, 다음 명령어로 git 프로젝트에 추가합니다:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

마지막으로, 로컬 저장소를 GitHub 원격 저장소로 푸시합니다:

```shell
git push -u origin main
```

### Chromatic 가져오기

Chromatic 패키지를 개발 의존성으로 추가합니다.

```shell
yarn add -D chromatic
```

패키지가 설치되면, GitHub 계정으로[Chromatic에 로그인 하세요](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)(Chromatic은 최소한의 권한만 요청합니다). 그런 다음 새 프로젝트 "taskbox"를 만들고, 앞서 설정한 GitHub 저장소와 동기화합니다.

아래의 화면처럼 `Choose GitHub repo`를 클릭하고 해당 저장소를 선택합니다.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

프로젝트를 위해 생성된 고유한 `project-token`을 복사한 다음, 터미널에서 아래의 명령을 실행하여 Storybook을 빌드하고 배포합니다. `project-token` 부분을 실제 토큰으로 바꾸는 것을 잊지 마세요.

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

작업이 완료되면 `https://random-uuid.chromatic.com` 형식의 링크가 표시됩니다. 이 링크를 팀원에게 공유하여 피드백을 받으세요.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy.png)

야호! 한 줄의 명령으로 Storybook을 게시했습니다. 하지만 UI 구현에 대한 피드백이 필요할 때마다 수동으로 명령을 실행해야 합니다. 그것보다는, 코드를 푸시할 때마다 최신 컴포넌트 버전을 자동으로 게시하는 것이 이상적입니다. 이제 Storybook을 지속적으로 배포(continuous deploy)할 방법이 필요합니다.

## Chromatic으로 지속적 배포하기(CD)

이제 프로젝트를 GitHub 저장소에 호스팅했으니, 지속적 통합(CI) 서비스를 이용해 Storybook을 자동으로 배포할 수 있습니다. [GitHub Actions](https://github.com/features/actions)는 GitHub에 내장된 무료 CI 서비스로, 자동 게시를 간편하게 만들어 줍니다.

### Storybook 배포를 위한 GitHub Action 추가하기

프로젝트 루트 폴더에 `.github` 디렉터리를 만들고, 그 안에 `workflows` 디렉터리를 생성합니다.

아래와 같이 `chromatic.yml` 파일을 만들어 봅시다.

```yaml:title=.github/workflows/chromatic.yml
# Workflow 이름
name: 'Chromatic Deployment'

# Workflow 이벤트
on: push

# Job 목록
jobs:
  chromatic:
    name: 'Run Chromatic'
    runs-on: ubuntu-latest
    # 단계별 Job
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: yarn
        #👇 Workflow에 Chromatic을 추가합니다.
      - uses: chromaui/action@latest
        # Chromatic의 GitHub Action 필수 옵션
        with:
          #👇 Chromatic projectToken, https://storybook.js.org/tutorials/intro-to-storybook/svelte/en/deploy/ 에서 확인할 수 있습니다.
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">

💡 [GitHub secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) 내용은 생략했습니다. Secrets는 GitHub에서 제공하는 보안 환경 변수로, `project-token`을 하드코딩할 필요가 없습니다.

</div>

### 액션 커밋하기

다음 명령으로 변경 사항을 추가합니다:

```shell
git add .
```

그런 다음 커밋합니다:

```shell
git commit -m "GitHub action setup"
```

마지막으로 원격 저장소에 푸시합니다:

```shell
git push origin main
```

GitHub Action을 설정하면, 코드를 푸시할 때마다 Storybook이 Chromatic에 자동으로 배포됩니다. Chromatic의 프로젝트 빌드 화면에서 게시된 모든 Storybook을 확인할 수 있습니다.

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

가장 최근 빌드를 클릭해 보세요. 보통 맨 위에 표시됩니다.

그런 다음, `View Storybook` 버튼을 눌러 Storybook의 최신 버전을 확인하세요.

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

링크를 사용해 팀원들과 공유하세요. 표준 앱 개발 프로세스로, 또는 작업을 뽐내기 위해서도 유용합니다💅.
