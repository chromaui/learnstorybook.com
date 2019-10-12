---
title: 'Arquitetar sistemas'
tocTitle: 'Arquitectura'
description: 'Como extrair um sistema de design a partir de bibliotecas de componentes'
commit: b696f85
---

No capítulo 2, vamos extrair um sistema de design de bibliotecas de componentes existentes. Ao longo do trajeto, iremos determinar quais os componentes pertencem ao sistema de design e delinear quais os desafios comuns que os programadores encontram inicialmente.

Em grandes empresas, este exercicio é feito em conjunção com as equipas de design, engenharia e de produto. A Chroma (companhia por detrás do Storybook) e o Storybook partilham uma equipa de infraestrutura de frontend bastante jovial, que auxilia quase 800 contribuidores de código aberto ao longo de mais de 3 propriedades. Por isso vamos delinear todo o processo para você.

## O desafio

Se trabalha numa equipa de desenvolvimento, já deve ter reparado que equipas grandes não são muito eficientes. Falhas de comunicação aumentam à medida que as equipas crescem. Os padrões do IU existentes ficam por documentar ou perdem-se por completo. O que significa que os programadores passam mais tempo a reinventar a roda ao invés de construir novas funcionalidades. Com o decorrer do tempo os projetos estão cheios de componentes que são usados uma única vez.

Nós demos de caras com este problema. Apesar das melhores intenções de uma equipa experiente, os componentes de interface de utilizador eram constantemente reconstruídos, ou colados. Os padrões de IU que deveriam ser os mesmos, começaram a divergir em aparência e funcionalidade. Cada componente tornou-se um floco de neve único, o que fez com que se tornasse impossível para os novos programadores distinguirem qual a fonte de verdade, quanto mais contribuir.

![Divergência de IU](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## Criar um sistema de design

Um sistema de design consolida componentes de IU comuns, que estão centralizados num único repositório que é bem gerido e é depois distribuido através de um gestor de pacotes. Os programadores importam os componentes de IU estandardizados, em vez de colar o mesmo código de IU em diversos projectos.

A maioria dos sistemas de design não são construídos de raíz. Pelo contrário, são construídos a partir de componentes de IU já validados e que são usados numa empresa, sendo posteriormente empacotados como um sistema de design. O nosso projecto não é excepção. Vamos ser selectivos na escolha dos nossos componentes a partir das bibliotecas de componentes existentes de forma a poupar tempo e agilizar a entrega do sistema de design a outras partes interessadas.

![O que é um sistema de design](/design-systems-for-developers/design-system-contents.jpg)

## Onde é que o sistema de design vive?

Pode pensar num sistema de design como uma outra biblioteca de componentes qualquer, mas ao invés de servir uma só aplicação, irá servir toda uma organização. O sistema de design foca-se nas primitivas do IU enquanto que as bibliotecas de componentes especificas ao projecto podem conter tudo desde componentes compostos até ecrãs.

Como tal, o nosso sistema de design deverá ser independente de qualquer projecto, mas também uma dependência de todos os projectos. Todas as alterações efectuadas, propagam-se ao longo da organização através de um pacote com um número de versão associado que é distribuido através de um gestor de pacotes. Caso seja necessário, os projetos podem reutilizar os componentes do sistema de design e customizá-los consoante as necessidades. Estas restrições oferecem-nos o plano para organizar os nossos projetos de frontend.

![Quem usa um sistema de design](/design-systems-for-developers/design-system-consumers.jpg)

## Configuração do nosso repositório com o create-react-app e Gitub

De acordo com a pesquisa feita pelo [State of JS](https://stateofjs.com/) o React continua a ser a camada de visualização mais popular. Um número extremamente grande de Storybooks usam o React e como tal, neste tutorial vamos usar React também, em conjunção com o popular [create-react-app](https://github.com/facebook/create-react-app) para gerar o código base para o nosso projeto.

```bash
npx create-react-app learnstorybook-design-system
```

<div class="aside">Outros metodos válidos para gerar sistemas de design, incluem expedir HTML/CSS de forma crua, utilizar outras camadas de visualização, compilar componentes com Svelte, ou até recorrer a componentes web. Fica à escolha do leitor escolher o que se adequa para a sua equipa.</div>

Assim que o create-react-app inicializar o repositório, este pode ser adicionado ao GitHub (que iremos usar para hospedar o código do nosso sistema de design). Faça a autenticação em GitHub.com e crie um novo repositório:

![Criar um novo repositório GitHub](/design-systems-for-developers/create-github-repository.png)

Utilize as instruções fornecidas pelo GitHub para adicionar a localização remota do seu repositório (que neste momento estará quase vazio) e também submeter o código existente.

```bash
cd learnstorybook-design-system
git remote add origin https://github.com/chromaui/learnstorybook-design-system.git
git push -u origin master
```

Não se esqueça de substituir `chromaui` pelo seu nome de utilizador.

![Adição inicial ao repositório GitHub](/design-systems-for-developers/created-github-repository.png)

## O que pertence e não pertence

Os sistemas de design deverão somente conter [componentes de apresentação](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) e componentes puros. Estes tipos de componentes lidam com a aparência do IU. Reagem exclusivamente aos adereços (props na forma original), não contêm qualquer tipo de lógica de negócio associada à aplicação e são agnósticos relativamente á forma como os dados são carregados. Estas propriedades são essenciais para permitir a reutilização do componente.

Os sistemas de design não são o super conjunto de cada biblioteca de componentes de uma organização. Gerir isso seria uma dor de cabeça. 

Componentes específicos á aplicação que contêm qualquer tipo de lógica de negócio, não deverão ser incluídos, visto que estes iriam prejudicar a sua reutilização por fazerem com que todos os projetos consumidores tenham que ter as mesmas restrições de negócio.

Omitam os componentes únicos, que não estão a ser reutilizados. Mesmo que se espere que qualquer dia façam parte do sistema de design, as equipas mais pequenas têm tendência em evitar manter código excessivo sempre que possível.

## Criar um inventário

A primeira tarefa é criar um inventário de todos os componentes, de forma a identificar quais são os mais usados. Isto muitas das vezes envolve catalogar manualmente ecrãs em vários websites, ou aplicações, de forma a reconhecer quais os padrões de IU comuns. Designers como [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/) e [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517) publicaram metodologias extremamente valiosas para catalogar componentes e como tal não vamos entrar em mais detalhes neste tutorial.

Heurísticas úteis para programadores:

- Se o padrão de IU é usado mais que três vezes, transforma-se num componente de IU reutilizável.
- Se o componente é usado em 3 ou mais projectos/equipas, coloca-se no vosso sistema de design.

![Conteúdo de um sistema de design](/design-systems-for-developers/design-system-grid.png)

Seguindo este método, ficamos com as seguintes primitivas do IU: Avatar, Badge, Button,Checkbox, Input, Radio, Select,Textarea,Highlight(para código), Icon, Link,Tooltip entre outras. Estes blocos de construção, são posteriormente configurados de diversas formas para obter um sem número de funcionalidades únicas e layouts nas aplicações cliente.

![Variações num componente](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

Adicione os componentes que foram encontrados, transferindo-os localmente e adicione-os ao seu repositório, além de remover os ficheiros gerados pelo Create React App:

```bash
rm -rf src/*

svn export https://github.com/chromaui/learnstorybook-design-system/tags/download-1/src
```

<div class="aside">
<p>Foi usado o <code>svn</code> (Subversion), para transferir a pasta com os ficheiros do GitHub de forma fácil. Se não tiver o Subversion instalado, ou quiser transferir os ficheiros manualmente, pode obtê-los directamente <a href="https://github.com/chromaui/learnstorybook-design-system/tree/download-1/src">aqui</a>.</p>

<p>
Para o exemplo de código fornecido, seleccionámos somente um subconjunto destes componentes de forma a tornar a racionalização do repositório deveras simples. Algumas equipas incluem ainda outros componentes customizados a partir de bibliotecas de terceiros no seu sistema de design, tais como tabelas (Tables) e formulários (Forms).</p></div>

Será necessário actualizar as dependências dos nossos componentes.

```bash
yarn add prop-types styled-components polished
```

<div class="aside">CSS-in-JS: Vamos utilizar <a href="https://www.styled-components.com">styled-components</a>, uma biblioteca que permite definir os estilos em termos de componente. Existem outros métodos válidos para estilizar componentes, tais como por exemplo, a manipulação de classes manualmente, CSS modules, etc.</div>

Além dos componentes do IU, faz sentido incluír também constantes para tipografia, cores, espaçamento etc. que são reutilizadas noutros projectos. Na nomenclatura de sistemas de design, as variáveis de estilo globais, são designadas "tokens de design". Neste guia não iremos aprofundar a teoria por detrás de "tokens de design", pode aprender mais online(fica aqui um [bom artigo](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)).

Faça o download dos nossos tokens de design e adicione-os ao seu repositório.

```bash
svn export https://github.com/chromaui/learnstorybook-design-system/tags/download-2/src/shared src/shared
```

<div class="aside">
<p>Pode fazer o download dos ficheiros directamente do GitHub <a href="https://github.com/chromaui/learnstorybook-design-system/tree/download-2/src/shared">aqui</a>.</p>
</div>

## Vamos começar a programar

Definimos o que se pretende construir e como tudo se vai encaixar, está na hora de começar a trabalhar. No capítulo 3 vão ser apresentadas as ferramentas fundamentais para sistemas de design. A pasta, ou diretório de componentes de IU que se encontra ainda num estado cru será catalogada e visualizada com a ajuda do Storybook.
