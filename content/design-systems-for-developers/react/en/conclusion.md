---
title: "Conclusion"
tocTitle: "Conclusion"
description: "Thriving design systems save time and increase productivity"
---

Research-backed studies suggest reusing code can yield [42–81% time savings](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) and boost productivity by [40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf). It should come as no surprise then that design systems, which facilitate sharing **user interface code**, are surging in popularity amongst developers.

In the last few years, Tom and I witnessed countless veteran teams anchor their design system tooling around Storybook. They concentrated on reducing communication overhead, durable architecture, and automating repetitive manual tasks. We hope that distilling these common-sense tactics will help your design system flourish.

Thanks for learning with us. Subscribe to the Chroma mailing list to get notified when helpful articles and guides like this are published.

<iframe style="height:400px;width:100%;max-width:800px;margin:30px auto;" src="https://upscri.be/bface0?as_embed"></iframe>

## Sample code for this tutorial

If you’re coding along with us, your repositories should look like this:

- [Sample design system repository](https://github.com/chromaui/learnstorybook-design-system)
- [Example app repository](https://github.com/chromaui/learnstorybook-design-system-example-app)

The example code is based on [Storybook’s own design system](https://github.com/storybookjs/design-system) (SDS) which powers the user experience for tens of thousands of developers. SDS is a work in progress – we welcome community contributions. As a contributor, you’ll get hands-on experience with design system best practices and emergent techniques. SDS is also where the Storybook team demos bleeding-edge features.

## About us

_Design Systems for Developers_ was created by [Dominic Nguyen](https://twitter.com/domyen) and [Tom Coleman](https://twitter.com/tmeasday). Dominic designed Storybook’s user interface, brand, and the design system. Tom is a member of the Storybook steering committee in frontend architecture. He worked on Component Story Format, addon API, parameter API.

Expert guidance from [Kyle Suss](https://github.com/kylesuss), tech lead of Storybook’s design system, and [Michael Shilman](https://twitter.com/mshilman), creator of Storybook Docs.

Content, code, and production brought to you by [Chroma](https://hichroma.com/). InVision’s [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) graciously helped kickstart production with a grant. We’re seeking sponsors to make continued maintenance and new guides like this possible. Email [Dominic](mailto:dom@hichroma.com) for more details.

## Broaden your perspective

It’s worth expanding your focus to get a holistic design system perspective.

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/) (book)
- [Eightshapes by Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
- [Building Design Systems by Sarrah Vesselov and Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (book)

More from the authors:

- [Introduction to Storybook](http://learnstorybook.com/introduction-to-storybook) (guide)
- [Component-Driven Development by Tom Coleman](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (article)
- [Why design systems are a single point of failure by Dominic Nguyen](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) (article)
- [Delightful Storybook Workflow by Dominic Nguyen](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) (article)
- [Visual Testing by Tom Coleman](https://blog.hichroma.com/visual-testing-the-pragmatic-way-to-test-uis-18c8da617ecf) (article)

## FAQ

#### Isn’t there more to design systems?

Design systems include (but are not limited to) design files, component libraries, tokens, documentation, principles, and contribution flows. The guide is scoped to the developer perspective on design systems so we cover a subset of the topics. Specifically, the engineering details, APIs, and infrastructure that go into production design systems.

#### What about the governance side of design systems?

Governance is a nuanced topic that is more extensive and organization-specific than we can fit into nine chapters.

#### Does Storybook integrate with design tools?

Yes! The Storybook community creates addons that make design tool integration easy. For example, InVision’s [Design System Manager](https://www.invisionapp.com/design-system-manager) integrates with Storybook to showcase stories in the InVision app. There are also community-created addons for [design tokens](https://github.com/UX-and-I/storybook-design-token), [Sketch](https://github.com/chrisvxd/story2sketch), and [Figma](https://github.com/pocka/storybook-addon-designs).

![Design tool integrations](/design-systems-for-developers/storybook-integrations-design.jpg)

#### Do you need a design system for a single app?

No. There is an opportunity cost for creating and maintaining a design system. At small scales, a design system requires more effort than is returned in time-savings.

#### How do consumer apps protect themselves from unexpected design system changes?

No one is perfect. Your design system will inevitably ship with a bug that impacts consumer apps. Mitigate this disruption by instrumenting your client app’s Storybook with automated testing (visual, unit, etc) in the same way we did with the design system. That way when you update dependencies on a branch (manually or with automated services like [Dependabot](https://dependabot.com/)), your client app’s test suite will catch incoming regressions from the design system.

![Design system updates](/design-systems-for-developers/design-system-update.png)

#### How do you propose tweaks to the design system?

The design system team is a service team. Instead of interfacing with end-users, it exists to make internal app teams more productive. The stewards of the design system are responsible for managing requests and socializing status with other teams. Many teams use a task manager like Jira, Asana, or Trello to keep track of proposals.

## Shoutouts

Thanks to the amazing Storybook community for their invaluable feedback.

Gert Hengeveld and Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Acorns), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla and Kathleen McMahon (O’Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent and Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile 6), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D’amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times), Lee Robinson (Hy-Vee)
