---
title: '스토리북(Storybook) 배포하기'
tocTitle: '배포하기'
description: 'Storybook을 온라인으로 배포하는 방법을 배워보세요'
commit: '59da1ac'
---

이 튜토리얼을 통해 우리는 로컬 개발 환경에서 컴포넌트를 만들었습니다. 언젠가 팀의 피드백을 얻기 위해 작업을 공유해야 할 필요가 있을 것입니다. 다른 팀원들이 UI 구현을 검토할 수 있도록 스토리북(Storybook)을 온라인으로 배포해봅시다.

## 정적 앱으로 내보내기

스토리북을 배포하기 위해서는 먼저 정적인 웹 앱으로 내보내야 합니다. 이 기능은 이미 스토리북에 내장되어 있으며 미리 구성되어 있습니다.

`yarn build-storybook`을 실행하면 `storybook-static` 디렉토리에 정적인 스토리북이 생성될 것이며 이를 정적 사이트 호스팅 서비스에 배포할 수 있습니다.

## 스토리북(Storybook) 배포하기

이번 튜토리얼은 스토리북 관리자가 만든 무료 배포 서비스인 <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>을 사용하겠습니다. 크로마틱(Chromatic)으로 클라우드에서 스토리북을 안전하게 배포하고 호스팅 할 수 있습니다.

### 깃허브(Github) 저장소 설정

시작하기 전에 로컬 코드가 원격 버전 제어 서비스와 동기화되어야 합니다. [시작하기 장](/intro-to-storybook/react/ko/get-started/)에서 프로젝트를 시작하셨을 때, 이미 로컬 저장소를 초기화했습니다. 이 단계에서, 우리는 원격 저장소에 push할 commit들을 이미 가지고 있습니다.

깃허브로 이동하여 [여기](https://github.com/new)에서 프로젝트를 위한 새로운 저장소를 만듭니다. 저장소의 이름은 프로젝트명과 동일하게 'taskbox'로 하겠습니다.

![깃허브 설정](/intro-to-storybook/github-create-taskbox.png)

새로운 저장소에서 origin URL을 가져와서 다음 명령과 같이 깃(git) 프로젝트에 추가해주세요.

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

마지막으로, 로컬 저장소를 원격 저장소로 푸시해주세요.

```shell
git push -u origin main
```

### 크로마틱(Chromatic) 설치

development dependency로 패키지를 추가해주세요.

```shell
yarn add -D chromatic
```

패키지가 설치되면 깃허브 계정으로 [크로마틱에 로그인](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) 해주세요 (크로마틱은 간단한 권한 요청만 할 것입니다). 그런 다음 'taskbox'라는 이름의 새로운 프로젝트를 만들고, 앞서 설정한 깃허브 저장소와 동기화합니다.

`Choose GitHub repo`를 클릭하고 저장소를 선택해주세요.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

프로젝트를 위해 생성된 고유한 `project-token`을 복사해주세요. 그런 다음 스토리북을 빌드(build)하고 배포하기 위해 아래 명령어를 실행해주세요. 여러분의 토큰으로 `project-token` 부분을 꼭 바꿔주세요.

```shell
yarn chromatic --project-token=<project-token>
```

![스토리북 실행](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

완료되면 배포된 스토리북의 `https://random-uuid.chromatic.com`링크를 받으실 것입니다. 해당 링크를 팀과 공유하여 피드백을 받으세요.

![크로마틱 패키지와 함께 배포된 스토리북](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

만세! 하나의 명령어를 사용하여 스토리북을 배포해보았습니다. 하지만 UI 구현 후 피드백을 얻기 위해 매번 이러한 명령어를 수동적으로 실행하는 것은 반복적인 일입니다. 코드를 push할 때마다 최신 버전의 컴포넌트를 배포하는 것이 더 이상적입니다. 스토리북을 지속적으로 배포할 필요가 있습니다.

## 크로마틱을 통한 지속적 배포

이제 프로젝트가 깃허브 저장소에 호스팅 되었으므로 자동으로 스토리북을 배포하기 위하여 지속적 통합(continuous integration, CI) 서비스를 이용할 수 있습니다. [GitHub Actions](https://github.com/features/actions)는 깃허브에 내장된 무료 CI 서비스로, 쉽게 자동으로 배포할 수 있도록 합니다.

### 스토리북을 배포하기 위해 깃허브 액션 추가하기

프로젝트의 기본 폴더에 `.github`라는 새로운 디렉토리를 만들고 그 안에 `workflows`라는 디렉토리를 만들어주세요.

`chromatic.yml`이라는 파일을 아래와 같이 생성해주세요.

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/ko/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>간단하게 진행하고자 <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> 은 언급되지 않았습니다. 이는 깃허브에서 제공하는 안전한 환경 변수이며 이를 사용하면 <code>project-token</code>을 직접 입력할 필요가 없습니다.</p></div>

### 깃허브 액션 커밋하기

다음의 명령어를 실행하여 변경된 사항을 추가해주세요.

```shell
git add .
```

그런 다음 commit을 해주세요:

```shell
git commit -m "GitHub action setup"
```

마지막으로 원격 저장소에 push해주세요:

```shell
git push origin main
```

깃허브 action을 설정하면 코드를 push할 때마다 스토리북이 크로마틱에 배포될 것입니다. 크로마틱의 프로젝트 빌드 화면에서 배포된 모든 스토리북을 보실 수 있습니다.

![크로마틱 사용자 대시보드](/intro-to-storybook/chromatic-user-dashboard.png)

맨 위에 있는 최신 빌드를 클릭해주세요.

그런 다음, 최신 버전의 스토리북을 보시려면 `View Storybook` 버튼을 클릭해주세요.

![크로마틱의 스토리북 링크](/intro-to-storybook/chromatic-build-storybook-link.png)

링크를 사용하여 팀원들과 공유하세요. 이는 표준화된 앱 개발 과정일 뿐만 아니라 여러분의 작업을 팀원들에게 자랑할 수 있게끔 도와줄 것입니다. 💅
