---
title: '결론'
tocTitle: '결론'
description: '적게 하고 더 많은 걸 되게 하자'
---

개발자들은 [21%의 시간을](https://www.niss.org/sites/default/files/technicalreports/tr81.pdf) 버그를 고치는데 씁니다. 테스트는 결함을 발견하고 디버깅 속도를 빠르게 해서 해야하는 일을 줄여줍니다. 하지만 모든 새로은 기능은 더 많은 UI 와 상태를 도입하고 테스트도 필요해집니다. 생산성을 유지하는 유일한 방법은 직관적인 테스팅 작업 흐름을 구축하는 것 뿐입니다.
<!--
Developers spend [21% of their time](https://www.niss.org/sites/default/files/technicalreports/tr81.pdf) fixing bugs. Tests help reduce the amount of work you have to do by catching defects and speeding up debugging. But every new feature introduces more UI and states that need tests. The only way to stay productive is to implement an intuitive testing workflow.
-->

**테스트 케이스를 스토리로 작성하면서 시작하세요.** 이 스토리는 Jest, Chromatic, 그리고 Axe 같은 테스팅 도구를 재사용할 수 있습니다. 연구들은 코드를 재사용하면 [42-81%](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) 정도 개발 시간을 아낄 수 있다고 제안합니다.

<!--
**Start by writing test cases as stories**. You can reuse them in testing tools such as Jest, Chromatic and Axe. Studies suggest that reusing code can shave [42-81% off](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) dev time.
-->

개발하는 동안, 빠르게 **코드를 짜면서 테스트를 하면** 빠른 피드백 루프를 유지하고 프로덕션에 올라가기 전에 버그들을 잡을 수 있습니다. 프로덕션에서 버그를 고치는 건 [10x](https://ntrs.nasa.gov/search.jsp?R=20100036670)배 더 비쌉니다.
<!--
During development, **test while you code** to get a fast feedback loop and catch bugs before hitting production. It's [10x](https://ntrs.nasa.gov/search.jsp?R=20100036670) more expensive to fix bugs in production!
-->

<img src="/ui-testing-handbook/component-automate-testing.gif" alt="PR checks for all types of UI testing: visual, interaction, accessibility, composition and user flows" style="max-width: 450px;" />

마지막으로, 의도치 않은 회귀 에러를 예방하기 위해 전체 UI에 걸쳐서 **CI 서버를 사용해서 모든 검사를 실행하세요.** 마이크로소프트에서 수행한 연구에 기반한 조사에서 자동화 테스트로 [결함이 20.9 까지 감소]하는 걸 보게 될 거라고 제안합니다.
<!--
Finally, **use a CI server to run all your checks** across the entire UI to prevent accidental regressions. Research-backed studies from Microsoft suggest that you can see a [20.9% reduction in defects](https://collaboration.csc.ncsu.edu/laurie/Papers/Unit_testing_cameraReady.pdf) with automated testing.
-->

테스트가 통과하면, 우리의 UI가 버그에서 자유롭다는 확신을 얻게 될 겁니다.
<!--
When your tests pass, you’ll have confidence that your UI is bug-free.
-->

저는 이런 배움을 실용적인 작업 흐름으로 잘 모아서 당신 만의 탄탄한 테스트 전략을 구축하는데 도움을 줄 수 있기를 바랍니다.
<!--
I hope condensing these learnings into a pragmatic workflow helps you implement a solid testing strategy of your own. Let this be your starting point.
-->

## 이 튜토리얼을 위한 예시 코드
<!--
## Sample code for this tutorial
-->

코딩을 해나가면서, 당신의 저장소와 배포된 스토리북은 이렇게 보여야 합니다. 
<!--
If you've been coding along, your repository and deployed Storybook should look like this:
-->

- 📕 [깃허브 저장소](https://github.com/chromaui/ui-testing-guide-code/tree/workflow)
- 🌎 [배포된 스토리북](https://main--60876bbe754b7b0021704b3d.chromatic.com)

<!--
- 📕 [GitHub repository](https://github.com/chromaui/ui-testing-guide-code/tree/workflow)
- 🌎 [Deployed Storybook](https://main--60876bbe754b7b0021704b3d.chromatic.com)
-->

## 더 많은 자료
<!--
## More resources
-->

더 많은 걸 원하나요? 여기 유용한 몇몇 추가 자료가 있습니다.

<!--
Want more? Here are some additional helpful resources:
-->

- [**시각적 테스팅 핸드북**](/visual-testing-handbook)은 UI 모습을 테스팅하는 방법을 BBC, Adobe, Target 그리고 더 많은 선도적인 엔지니어링 팀들에서 배운 교훈들과 함께 깊이 있게 다루는 가이드입니다.
- [**스토리북으로 UI 테스트하기**](https://storybook.js.org/docs/react/writing-tests/introduction) UI 테스팅을 위해 스토리북을 어떻게 사용하는지 자세히 설명합니다.
- [**디스코드 채팅**](https://discord.gg/UUt2PJb)에서는 스토리북 커뮤니티와 메인테이너들과 연락을 유지할 수 있게 해줍니다.
- [**블로그**](https://medium.com/storybookjs)에서는 최신 릴리즈와 기능을 보여주고 당신의 UI 개발 작업흐름을 최신으로 유지시켜줍니다.

우리랑 같이 배워주셔서 감사합니다. 스토리북 메일링 리스트를 구독하셔서 이 핸드북과 같이 유용한 기사와 가이드가 공개될 때마다 알림을 받아보세요.

<!--
- [**Visual Testing Handbook**](/visual-testing-handbook) is an in-depth guide to testing UI appearance—with learnings from leading engineering teams like BBC, Adobe, Target and more.
- [**How to test UIs with Storybook**](https://storybook.js.org/docs/react/writing-tests/introduction) details how you can use Storybook for UI testing.
- [**Discord chat**](https://discord.gg/UUt2PJb) puts you in contact with the Storybook community and maintainers.
- [**Blog**](https://medium.com/storybookjs) showcases the latest releases and features to streamline your UI development workflow.

Thanks for learning with us. Subscribe to the Storybook mailing list to get notified when helpful articles and guides like this are published.
-->

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>
