---
title: 'Conclusão'
tocTitle: 'Conclusão'
description: 'Sistemas de design prósperos economizam tem e aumentam produtividade'
---

Estudos suportados por pesquisa sugerem que a reutilização de código podem gerar entre [42-81% de economia de tempo](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) e aumentar a produtividade em [40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf). Não deverá ser surpresa então, que os sistemas de design que ajudam a facilitar a partilha de **código de interface de utilizador**, estão a ganhar uma popularidade crescente entre programadores.

Nos últimos anos, o Tom e eu, observámos inúmeras equipas veteranas ancorar as suas ferramentas de trabalho associadas ao sistema de design em torno do Storybook. Concentraram-se na redução da sobrecarga de comunicação, arquitetura duradoura e automatização de tarefas manuais repetitivas. Esperamos que ao destilarem estas táticas de senso comum, irá ajudar no florescimento do vosso sistema de design.

Muito obrigado por terem aprendido connosco. Subscrevam a lista de correspondência da Chroma, para receberem notificações quando artigos úteis ou guias tais como este são publicados.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/bface0?as_embed"></iframe>

## Código de exemplo usado neste tutorial

Se estiver a programar connosco, os vossos repositórios deverão assemelhar-se ao seguinte:

- [Repositório de exemplo do sistema de design](https://github.com/chromaui/learnstorybook-design-system)
- [Repositório da aplicação de exemplo](https://github.com/chromaui/learnstorybook-design-system-example-app)

O código de exemplo é baseado no [próprio sistema de design do Storybook](https://github.com/storybookjs/design-system) (SDS), que alimenta a experiência de utilizador para milhares de programadores. O SDS é um trabalho em curso: encorajamos as contribuições vindas da comunidade. Como contribuidores, irão obter uma experiência prática, baseadas nas melhores práticas dos sistemas de design, mas também com técnicas emergentes. O SDS é também onde a equipa do Storybook demonstra as mais recentes funcionalidades.

## Acerca de nós

O _Sistemas de Design para Programadores_, na forma original, _Design Systems for Developers_ foi criado por [Dominic Nguyen](https://twitter.com/domyen) e o [Tom Coleman](https://twitter.com/tmeasday).
O Dominic desenhou o interface de utilizador, todo o branding e o sistema de design. O Tom é um membro do comité de direção do Storybook para a arquitetura frontend. Trabalhou no Component Story Format, API dos extras e API de parâmetros.

Orientação especializada por parte do [Kyle Suss](https://github.com/kylesuss), líder técnico do sistema de design do Storybook e também [Michael Shilman](https://twitter.com/mshilman), o criador do Storybook Docs.

O conteúdo, código e produção são fornecidos pela [Chromatic](https://www.chromatic.com/). A InVision’s [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) ajudou de forma graciosa com uma doação que ajudou no ínicio do processo. Estamos à procura de patrocinadores para uma manutenção contínua e também guias novos tais como este sempre que possível. Enviem um email ao [Dominic](mailto:dom@chromatic.com), para mais detalhes.

## Expanda a sua perspetiva

Vale muito a pena expandir o vosso foco, de forma a obter uma perspetiva holística aos sistemas de design.

- [Atomic Design por Brad Frost](http://atomicdesign.bradfrost.com/) (livro)
- [Eightshapes por Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
- [Building Design Systems por Sarrah Vesselov e Taurie Davis](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (livro)

Mais acerca dos autores:

- [Introdução ao Storybook](http://learnstorybook.com/intro-to-storybook) (guia)
- [Component-Driven Development por Tom Coleman](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (artigo)
- [Why design systems are a single point of failure por Dominic Nguyen](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) (artigo)
- [Delightful Storybook Workflow por Dominic Nguyen](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) (artigo)
- [Visual Testing por Tom Coleman](https://blog.hichroma.com/visual-testing-the-pragmatic-way-to-test-uis-18c8da617ecf) (artigo)

## Perguntas frequentes

#### Não existe mais nada acerca dos sistemas de design?

Os sistemas de design incluem os ficheiros de design, bibliotecas de componentes, tokens, documentação, princípios e fluxos de contribuição (mas não estão limitados a estes). O guia está direcionado para a perspetiva do programador relativamente aos sistemas de design, como tal são abordados em mais detalhe um subconjunto de tópicos. Em particular os detalhes referentes a engenharia, API e infraestrutura.

#### E o que diz respeito à governança dos sistemas de design?

A governança é um tópico cheio de nuances que é mais extensivo e específico ás organizações, tal que não iria caber em nove capítulos.

#### O Storybook integra-se com outras ferramentas de design?

Sim! A comunidade Storybook cria extras que fazem com que a integração de ferramentas de design se torne bastante fácil. Por exemplo o [Design System Manager](https://www.invisionapp.com/design-system-manager) da InVision integra-se com o Storybook, para demonstrar as estórias existentes na aplicação da InVision. Existem também extras da comunidade para [tokens de design](https://github.com/UX-and-I/storybook-design-token), [Sketch](https://github.com/chrisvxd/story2sketch), e [Figma](https://github.com/pocka/storybook-addon-designs).

![Integrações de ferramentas de design](/design-systems-for-developers/storybook-integrations-design.jpg)

#### É necessário um sistema de design para uma só aplicação?

Não. Existe um custo associado á oportunidade de criar e manter um sistema de design. Em escalas pequenas o sistema de design requer um esforço adicional do que o retorno obtido em termos de economia de tempo.

#### Como é que as aplicações consumidoras protegem-se de alterações inesperadas do sistema de design?

Ninguém é perfeito. O vosso sistema de design irá ser lançado com algum erro que irá causar impacto nas aplicações que o consomem. Pode mitigar esta perturbação através da instrumentalização do Storybook da aplicação cliente, através de testes automáticos (visuais, unitários, etc.) da mesma forma que seria feito no sistema de design. Desta forma quando atualizar as dependências num ramo (quer manualmente, quer automaticamente através de serviços tais como [Dependabot](https://dependabot.com/)), os testes da vossa aplicação cliente irão capturar quaisquer regressões oriundas do sistema de design.

![Updates do sistema de design](/design-systems-for-developers/design-system-update.png)

#### Como propor ajustes ao sistema de design?

A equipa do sistema de design é uma equipa de serviços. Ao invés de ligar-se com os utilizadores finais, esta existe para tornar as equipas internas da aplicação mais produtivas. Os guardiões do sistema de design são responsáveis por gerir pedidos e socializar com outras equipas. Muitas equipas usam um gestor de tarefas tal como o Jira, Asana, ou o Trello para manter um registo das propostas.

## Agradecimentos

Muito obrigado a comunidade fantástica do Storybook, pelo seu feedback inestimável.

Gert Hengeveld and Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Acorns), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla and Kathleen McMahon (O’Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent and Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile Six), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D’Amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times), Lee Robinson (Hy-Vee)
