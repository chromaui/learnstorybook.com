---
title: '마무리'
tocTitle: '마무리'
description: '시각적 버그들에 안녕을'
---

개발자들은 그들이 가진 시간 중 [21%](https://ieeexplore.ieee.org/document/895984)를 버그를 고치는데 씁니다. UI 외관을 디버깅하는 건 특히 좌절스러울 수 있습니다. 재생산(Reproduction)을 하기위해서는 다양한 브라우저를 실행하고, 앱을 올바른 상태로 만들고, DOM을 통과해야 합니다. 판돈도 더 커지는데 - QA에서 잡히지 않은 버그를 수정하는 비용은 QA보다 프로덕션에서 수정하는데 [5-10배](https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf)더 많은 시간이 소요됩니다.

수천 개의 프런트엔드 팀들이 스토리북(Storybook)을 이용해 시각적 테스트를 하는 건 이제 상식입니다. 스토리북은 컴포넌트를 **구축**하고 **시각적 테스트**를 작성하는 데 도움이 됩니다. 컴포넌트 수준에서 테스트를 실행하면 버그의 근본 원인을 정확히 짚을 수 있습니다. 이미지 스냅샷을 찍으면 **회귀 에러**를 자동으로 포착하는 데 도움이 됩니다. 이는 사람들이 몰래 끼어든 버그들을 걱정하지 않고 UI를 전달할 수 있음을 의미합니다.

이 가이드를 통해 시각적 테스팅의 기본을 소개했습니다. Tom과 나는 여러분이 이번에 배운 내용들을 바탕으로 자신만의 프로젝트들을 만들어보길 희망합니다. 스토리북 메일링 리스트에 가입하셔서 더 유용한 글과 가이드 소식들을 받아보세요.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## 이 튜토리얼의 샘플 코드

지금까지 잘 따라왔다면, 당신의 저장소와 배포한 스토리북은 다음과 같이 보여야 합니다.

- 📕 [**깃허브 저장소**](https://github.com/chromaui/learnstorybook-visual-testing-code)
- 🌎 [**배포된 스토리북**](https://6070d9288779ab00214a9831-oymqxvbejc.chromatic.com/?path=/story/commentlist--paginated)

## 더 많은 자료들

더 깊이 파고들고 싶나요? 여기 유용한 추가 자료들이 있습니다 -

- [**스토리북 공식 문서들**](https://storybook.js.org/docs/react/get-started/introduction) 에는 API 문서와, 예시들, 그리고 애드온(Addon) 갤러리가 있습니다.

- [**UI들을 실제로 테스트하는 방법**](https://storybook.js.org/blog/how-to-actually-test-uis/) 에서는 Shopify, Adobe, Twilio 등의 실용적인 UI 테스팅 전략을 요약한 것입니다.

- [**디스코드(Discord) 채팅**](https://discord.gg/UUt2PJb)을 통해 스토리북 커뮤니티 및 메인테이너들과 연락할 수 있습니다.

- [**블로그**](https://storybook.js.org/blog)는 UI 개발 작업 흐름(workflow)를 간소화하는 최신 릴리스 및 기능을 보여줍니다.
