---
title: '마무리'
tocTitle: 'Conclusion'
description: '잘 갖춰놓은 디자인 시스템으로 시간 절약과 생산성 향상'
---

연구 논문에 따르면 재사용 코드는 [42-81% 시간절약](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA)과 [40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf)의 생산성 향상이라는 결과를 가져올 수 있다고 합니다. **사용자 인터페이스 코드(user interface code)**의 공유를 촉진시키는 디자인 시스템이 개발자들 사이에서 인기가 급상승 중인 것은 어찌 보면 당연한 일입니다.

지난 몇 년동안 Tom과 저는 셀 수 없이 많은 베테랑 팀들이 Storybook을 기반으로 한 디자인 시스템을 도입하는 것을 지켜봤습니다. 그 팀들은 불필요한 커뮤니케이션 줄이기, 견고한 아키텍쳐, 반복적인 수작업의 자동화에 집중했습니다. 이렇게 당연한 전술을 더욱 갈고닦는 것이 여러분의 디자인 시스템을 발전시키는데 도움이 되길 바랍니다.

함께 해주셔서 감사합니다. Storybook의 뉴스레터를 구독하면 도움이 될만한 글과 가이드가 발행될 때마다 소식을 받아보실 수 있습니다.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## 이 튜토리얼은 위한 예제 코드

가이드와 함께 코딩을 진행했다면 레포지토리가 다음과 같을 것입니다.

- [예제 디자인 시스템 레포지토리](https://github.com/chromaui/learnstorybook-design-system)
- [예제 앱 레포지토리](https://github.com/chromaui/learnstorybook-design-system-example-app)

이 예제 코드는 수많은 개발자의 사용자 경험 개선에 동력이 되는 [Storybook 자체의 디자인 시스템](https://github.com/storybookjs/design-system) (SDS)을 기반으로 합니다. SDS는 완성품이 아닌 진행 중인 상태로, 여러분의 기여 참여에 열려있습니다. 기여자(contributor)가 되면 디자인 시스템 모범사례 및 신기능을 직접 경험할 수 있습니다. 또한 SDS는 Storybook 팀이 최신 기능들을 실험하는 곳 입니다.

## 우리에 대해

_개발자를 위한 디자인 시스템_ 은 [Dominic Nguyen](https://twitter.com/domyen)과 [Tom Coleman](https://twitter.com/tmeasday)에 의해 결성되었습니다. Dominic은 Storybook의 사용자 인터페이스, 브랜드, 디자인 시스템을 설계했습니다. Tom은 프론트엔드 아키텍처에 대한 Storybook의 운영위원회의 구성원입니다. Tom이 담당한 영역은 컴포넌트 Story의 포맷, 애드온(addon) API, 매개변수(parameter) API 등 입니다.

Storybook의 디자인 시스템 테크 리드인 [Kyle Suss](https://github.com/kylesuss)와 Storybook 문서를 만든 [Michael Shilman](https://twitter.com/mshilman)는 전문적인 가이드를 해주었습니다.

내용, 코드, 제작은 [Chromatic](https://www.chromatic.com/)에서 제공했습니다. InVision의 [Design Forward Fund](https://www.invisionapp.com/design-forward-fund)는 제작을 시작할 수 있게 보조금을 지원해 주었습니다. Storybook을 지속적으로 관리하고 이와 같은 새로운 가이드를 만들 수 있도록 후원자들을 찾고 있습니다. 더 자세한 사항을 원하신다면 [Dominic](mailto:dom@chromatic.com)에게 메일을 보내주세요.

## 시야 넓히기

디자인 시스템에 대한 전반적인 관점을 확보하기 위해 시야를 넓히는 것은 가치있는 일입니다.

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/) (book)
- [Eightshapes by Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
- [Building Design Systems by Sarrah Vesselov and Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (book)

위의 저자들이 쓴 다른 글 입니다. - 

- [Intro to Storybook](http://learnstorybook.com/intro-to-storybook) (guide)
- [Component-Driven Development by Tom Coleman](https://www.componentdriven.org/) (article)
- [Why design systems are a single point of failure by Dominic Nguyen](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure) (article)
- [Delightful Storybook Workflow by Dominic Nguyen](https://www.chromatic.com/blog/the-delightful-storybook-workflow) (article)
- [Visual Testing by Tom Coleman](https://www.chromatic.com/blog/visual-testing-the-pragmatic-way-to-test-uis/) (article)

## FAQ

#### 지금까지 연급되지 않은 디자인 시스템의 기능이나 역할은 무엇인가요? 

디자인 시스템은 디자인 파일, 컴포넌트 라이브러리, 토큰, 문서, 원칙, 기여의 흐름 등을 포함합니다. 본 가이드는 디자인 시스템을 보는 개발자들의 관점으로 그 범위를 한정하여 제작되었습니다. 더 구체적으로 언급하자면 개발과 관련된 상세한 사항들, API, 디자인 시스템 프로덕션에 필요한 인프라 등을 다루었다고 보시면 됩니다. 

#### 디자인 시스템의 관리적인(governance) 측면은요?

관리적인 측면은 섬세한 주제이기도 하고 광범위하면서 조직에 따라 달라지기 때문에 9개 챕터에 포함시키기는 어렵습니다.

#### Storybook은 다른 디자인 툴과 동기화가 가능한가요?

그럼요! Storybook 커뮤니티는 디자인 툴과 동기화가 더 쉽도록 애드온(addon)을 만들었습니다. 예를 들어, InVision의 [디자인 시스템 매니저(Design System Manager)](https://www.invisionapp.com/design-system-manager)는 스토리를 InVision 앱에서 보여주도록 동기화합니다. [디자인 토큰(design tokens)](https://github.com/UX-and-I/storybook-design-token), [스케치(Sketch)](https://github.com/chrisvxd/story2sketch) 그리고 [피그마(Figma)](https://github.com/pocka/storybook-addon-designs) 등, 커뮤니티가 만든 애드온도 있습니다.

![디자인 툴 통합(Design tool integrations)](/design-systems-for-developers/storybook-integrations-design.jpg)

#### 앱 하나에도 디자인 시스템이 필요할까요?

그렇지 않습니다. 디자인 시스템을 만들고 유지하는 데에는 기회비용이 듭니다. 규모가 작은 경우에는 디자인 시스템으로 인해 절약되는 시간보다 만드는 데 소요되는 노력이 더 큽니다.

#### 디자인 시스템에 예상하지 못한 변화가 생긴 경우, 소비자 앱(consumer app)을 보호할 수 있나요?

완벽한 사람은 없습니다. 여러분의 디자인 시스템은 불가피하게 소비자 앱에 영향을 끼치는 버그를 전달할 것입니다. 디자인 시스템에서 진행했던 것과 같은 방법으로 자동화된 테스팅 기법(비주얼 테스트, 단위 테스트 등)을 사용해 클라이언트 앱의 Storybook에 대한 버그를 최소화해보세요. 그러면 브랜치의 의존성을 업데이트 할 때(수동으로 혹은 [Dependabot](https://dependabot.com/)과 같은 자동화된 서비스를 이용하여) 클라이언트 앱의 테스트 케이스들은 디자인 시스템으로부터 오는 회귀 케이스들을 잡아낼 것입니다.

![Design system updates](/design-systems-for-developers/design-system-update.png)

#### 디자인 시스템에 대한 변경 사항을 어떻게 제안할 수 있나요?

서비스 팀이기도 한 디자인 시스템 팀은 최종 사용자를 지원하는 게 아니라 내부 앱 개발팀의 생산성 향상을 위해 존재합니다. 디자인 시스템의 구성원들은 제안을 처리하고, 다른 팀들과 현재 작업에 대해 소통하는 역할을 맡고 있습니다. 많은 팀은 제안 사항들을 놓치지 않도록 Jira, Asana 혹은 Trello와 같은 일정 관리 툴을 사용합니다.

## 감사합니다!

귀한 피드백을 주신 Storybook 커뮤니티에 감사를 전합니다.

Gert Hengeveld and Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Air), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla and Kathleen McMahon (O’Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent and Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile Six), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D’Amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times), Lee Robinson (Hy-Vee)
