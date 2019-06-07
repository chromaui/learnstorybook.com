---
title: "Teste de componentes de interface de utilizador"
tocTitle: "Testes"
description: "Aprendizagem das formas de teste dos componentes interface utilizador"
---

Qualquer tutorial de Storybook não estaria completo sem serem mencionados os testes. Estes são essenciais na criação de interfaces de utilizador de alta qualidade. Nos sistemas modulares, ajustes minúsculos poderão levar a regressões gigantescas. Até agora foram descritos três tipos de testes:

- **Testes visuais** dependem do programador para olhar para o componente manualmente e verificar se está tudo de acordo. Ajudam a manter um nível de coerência em termos de aparência á medida que é construído.
- **Testes snapshot** com o extra Storyshots é capturado o markup renderizado do componente. Ajudam a ficar a par das alterações no markup que causam erros de renderização e avisos.
- **Unit tests** com Jest é verificado que o output de um determinado componente mantém-se idêntico dado um input fixo. São óptimos para efectuar testes das qualidades funcionais de um componente.

## "Mas aparenta ser correcto"?

Infelizmente as metodologias de teste acima mencionadas, sozinhas não são suficientes para prevenir problemas no interface de utilizador. Estes são complicados para testar, visto que o design é algo subjectivo e com nuances. Os testes visuais são demasiado manuais, os testes de snapshot poderão originar demasiados falsos positivos quando usados para interface de utilizador e os testes unitários ao nível de pixel são pobres. Uma estratégia de testes considerada completa para o Storybook incluí também testes visuais de regressão.

## Testes visuais de regressão para o Storybook

Os testes visuais de regressão são desenhados para capturar alterações de aparência. Trabalham com capturas de cada estória e são depois comparadas commit a commit contra as alterações. Isto é perfeito para verificar elementos gráficos, tais como o layout, cor, tamanho e contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

O Storybook é uma ferramenta fantástica para este tipo de testes, por que cada estória é na sua essência uma especificação de teste. Cada vez que é escrita ou atualizada uma estória, obtemos uma especificação de graça!

Existem inúmeras ferramentas para este propósito. Para equipas profissionais é recomendado o [**Chromatic**](https://www.chromaticqa.com/), um extra desenvolvido pela equipa de manutenção do Storybook que efectua testes na núvem.

## Configuração de testes de regressão visual

O Chromatic é um extra sem complicações para este tipo de testes. Visto que é um serviço pago (mas com o período de testes grátis), logo poderá não ser para toda a gente. No entanto este é um exemplo de uma ferramenta ao nível profissional que irá usada gratuitamente.
Em seguida vai ser elaborada uma breve introdução desta.

## Inicialização Git

Será necessário configurar o Git para o projecto, isto dentro da pasta local.
Chromatic recorre á Git history para se manter a par dos componentes de interface de utilizador.

```bash
$ git init
```

Em seguida são adicionados os ficheiros ao primeiro commit.

```bash
$ git add .
```

É feito o commit dos ficheiros.

```bash
$ git commit -m "taskbox UI"
```

### Obter o Chromatic

Adiciona-se o pacote como dependência.

```bash
yarn add storybook-chromatic
```

O Chromatic é importado no ficheiro `.storybook/config.js`.

```javascript
import { configure } from "@storybook/angular";
import "storybook-chromatic";
import "../src/styles.less";

// automatically import all files ending in *.stories.ts
const req = require.context("../src/", true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

É feita a [autenticação na plataforma Chromatic](https://www.chromaticqa.com/start), com a conta GitHub (O Chromatic pede permissões ligeiras). Em seguida criado um projecto com o nome "taskbox" e copie e guarde o `app-code` único.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Executa-se o comando de testes na consola de forma a configurar os testes visuais de regressão para o Storybook. Não esquecer de adicionar o `app-code` fornecido ao invés de `<app-code>`.

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

<div class="aside">
    O argumento <code>--do-not-start</code> é uma opção que informa o Chromatic para não iniciar o Storybook. Isto usado se o Storybook já se encontrar em execução. Caso contrário omite-se o <code>--do-not-start</code>.
</div>

Assim que o primeiro teste estiver concluído, é obtida a base de testes para cada estória. Por outras palavras, uma captura de cada estória considerada "boa". Alterações futuras a estas estórias, irão ser comparadas com esta base.

![Bases Chromatic](/chromatic-baselines.png)

## Captura de uma alteração no interface utilizador

Os testes de regressão visual dependem da comparação de imagens do novo código do interface de utilizador que foi agora renderizado com as imagens de base. Se for capturada uma alteração no interface de utilizador irá surgir uma notificação. Para isto ser observado altera-se o fundo do componente `Task`:

![alteração código](/chromatic-change-to-task-component.png)

O que irá gerar uma nova cor de fundo para o item.

![alteração da cor de fundo da tarefa](/chromatic-task-change.png)

Usando agora o comando de testes, para efectuar um outro teste com o Chromatic.

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

Ao abrir-se o link, irão ser apresentadas a alterações.

![Alterações interface utilizador no Chromatic](/chromatic-catch-changes.png)

Pode constatar-se um grande número de alterações! Significa que uma alteração pequena irá originar uma regressão enorme, isto na hierarquia de componentes cuja `Task` é filha de `TaskList` e `Inbox`.
É precisamente por esta circunstância que os programadores necessitam de testes visuais de regressão além de outras metodologias de teste.

![Regressoes grandes com alterações de interface de utilizador pequenas](/minor-major-regressions.gif)

## Revisão de alterações

Os testes de regressão visual garantem que os componentes não se alteram por acidente. Mas cabe ao programador determinar quais as alterações intencionais e as que não o são.

Se uma alteração é intencional, é necessária a atualização da linha de base de forma que os testes futuros sejam comparados com a versão da estória mais recente. Se não o é, é necessário corrigir.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Visto que as aplicações modernas são construidas a partir de componentes, é importante testar ao nível destes. Ao efectuar-se isto ajuda a identificar a principal causa da alteração, ou seja o componente ao invés de reagir aos sintomas de uma alteração, ecrãs ou componentes compostos.

## Fusão de alterações

Assim que for terminada a revisão, será possível fundir as alterações com confiança, sabendo que as atualizações não introduzem acidentalmente problemas ou erros. Se o novo fundo `red` for aceitável, terão que ser aceites as alterações, caso contrário, será necessário reverter para o estado anterior.

![Alterações prontas para serem fundidas](/chromatic-review-finished.png)

O Storybook ajuda na **construção** de componentes; os testes ajudam na sua **manutenção**. Os quatro tipos de teste abordados neste tutorial são, visuais, snapshot,unitários e regressão visual. Os últimos três podem ser automatizados através da adição destes ao script de IC (integração continua, CI na forma nativa). Isto ajuda na implementação de componentes sem ser necessária a preocupação com problemas errantes que possam surgir. O fluxo completo é ilustrado abaixo.

![Fluxo de testes de regressão visual](/cdd-review-workflow.png)
