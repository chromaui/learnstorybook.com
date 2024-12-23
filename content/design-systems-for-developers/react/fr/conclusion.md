---
title: 'Conclusion'
tocTitle: 'Conclusion'
description: "Les design system efficaces permettent de gagner du temps et d'augmenter la productivité"
---

Des études appuyées par des recherches suggèrent que la réutilisation du code peut permettre de gagner [42-81% de temps](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) et d'augmenter la productivité de [40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf). Il n'est donc pas surprenant que les design system, qui facilitent le partage du **code de l'interface utilisateur**, soient de plus en plus populaires auprès des développeurs.

Au cours des dernières années, Tom et moi (Dominic) avons vu d'innombrables équipes chevronnées ancrer leur design system autour de Storybook. Ils se sont concentrés sur la réduction des frais généraux de communication, sur une architecture durable et sur l'automatisation des tâches manuelles répétitives.
Nous espérons que le partage de ces bonnes pratiques contribuera à l'épanouissement de votre design system.

Merci d'apprendre avec nous. Abonnez-vous à la newsletter de Storybook pour être informé de la publication d'articles et de guides utiles comme celui-ci.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## Exemple de code pour ce tutoriel

Si vous codez avec nous, vos dépôts devraient ressembler à ceci :

- [Dépôt du design system](https://github.com/chromaui/learnstorybook-design-system)
- [Dépôt de application d'exemple](https://github.com/chromaui/learnstorybook-design-system-example-app)

Le code d'exemple est basé sur [le propre design system de Storybook](https://github.com/storybookjs/design-system) (SDS) qui alimente l'expérience utilisateur de dizaines de milliers de développeurs. Le SDS est en cours de développement – nous acceptons volontiers les contributions de la communauté. En tant que contributeur, vous aurez une expérience concrète des meilleures pratiques en matière de design system et des techniques émergentes. SDS est également le lieu où l'équipe de Storybook présente des fonctionnalités de pointe.

## A propos

_design system for Developers_ a été créé par [Dominic Nguyen](https://twitter.com/domyen) et [Tom Coleman](https://twitter.com/tmeasday).
Dominic a conçu l'interface utilisateur, la marque et le design system de Storybook. Tom est membre du comité de pilotage de Storybook dans le domaine de l'architecture frontend. Il a travaillé sur le Component Story Format, l'API des modules complémentaires et l'API des paramètres.

Conseils d'experts de [Kyle Suss](https://github.com/kylesuss), responsable technique du design system de Storybook, et de [Michael Shilman](https://twitter.com/mshilman), créateur de Storybook Docs.

Le contenu, le code et la production vous sont proposés par [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook). Le [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) d'InVision a gracieusement contribué au lancement en accordant une subvention. Nous recherchons des sponsors pour permettre la poursuite de la maintenance et l'élaboration de nouveaux guides comme celui-ci.
Envoyez un mail à [Dominic](mailto:dom@chromatic.com) pour plus de détails.

## Élargissez votre champ d'action

Il est utile d'élargir votre champ d'action afin d'obtenir une vision complète de la notion de design system.

- [Atomic Design par Brad Frost](http://atomicdesign.bradfrost.com/) (livre)
- [Eightshapes par Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
- [Building design system par Sarrah Vesselov et Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (livre)

Pour davantage de contenus par les auteurs :

- [Introduction to Storybook](https://storybook.js.org/tutorials/intro-to-storybook/) (guide)
- [Component-Driven Development par Tom Coleman](https://www.chromatic.com/blog/component-driven-development/) (article)
- [Why design system are a single point of failure par Dominic Nguyen](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure/) (article)
- [UI Testing Playbook par Varun Vachhar](https://storybook.js.org/blog/ui-testing-playbook/) (article)
- [Visual Testing par Varun Vachhar](https://storybook.js.org/blog/visual-testing-in-storybook/) (article)

## FAQ

#### N'y a-t-il pas plus que cela dans les design system ?

Les design system comprennent (sans s'y limiter) les fichiers de design, les librairies de composants, les design tokens, la documentation, les principes et les flux de travail et de contribution. Le guide est axé sur le point de vue du développeur sur les design system et nous couvrons donc un sous-ensemble de sujets. Plus précisément, les détails techniques, les API et l'infrastructure qui entrent dans la composition des design system de la production.

#### Qu'en est-il de la gouvernance des design system ?

La gouvernance est un sujet nuancé qui est plus vaste et plus spécifique aux organisations que ce que nous pouvons faire tenir en neuf chapitres.

#### Storybook s'intègre-t-il aux outils de design ?

Oui ! La communauté Storybook crée des modules complémentaires qui facilitent l'intégration des outils de design. Par exemple, le [Design System Manager](https://www.invisionapp.com/design-system-manager) d'InVision s'intègre à Storybook pour présenter des stories dans l'application InVision. Il existe également des modules complémentaires créés par la communauté pour les [design tokens](https://github.com/UX-and-I/storybook-design-token), [Sketch](https://github.com/chrisvxd/story2sketch) et [Figma](https://github.com/pocka/storybook-addon-design).

![Intégrations d'outils de design](/design-systems-for-developers/storybook-integrations-design.jpg)

#### Un design system est-il utile pour une seule application ?

Non. La création et la maintenance d'un design system ont un coût. À petite échelle, un design system demande plus d'efforts qu'il n'en rapporte en termes de gain de temps.

#### Comment les applications clientes se protègent-elles des changements inattendus du design system ?

Personne n'est parfait. Votre design system comportera inévitablement un bug qui aura des répercussions sur les applications clientes. Limitez ces incidents en structurant le Storybook de votre application cliente avec des tests automatisés (visuels, unitaires, etc.) de la même manière que nous l'avons fait avec le design system. Ainsi, lorsque vous mettrez à jour les dépendances d'une branche (manuellement ou avec des services automatisés comme [Dependabot](https://dependabot.com/)), la série de tests de votre application cliente détectera les régressions entrantes du design system.

![Mises à jour du design system](/design-systems-for-developers/design-system-update.png)

#### Comment proposer des modifications au design system ?

L'équipe du design system est une équipe de service. Au lieu d'interagir avec les utilisateurs finaux, elle a pour but de rendre les équipes internes travaillant sur les applications plus productives.
Les responsables du design system sont chargés de gérer les demandes et de communiquer sur l'état d'avancement aux autres équipes. De nombreuses équipes utilisent un gestionnaire de tâches comme Jira, Asana ou Trello pour assurer le suivi des propositions.

## Remerciements

Merci à l'incroyable communauté Storybook pour ses retours précieux.

Gert Hengeveld et Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Air), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla et Kathleen McMahon (O'Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent et Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile Six), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D'Amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times), Lee Robinson (Hy-Vee)
