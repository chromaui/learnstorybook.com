---
title: 'Test UI componenten'
tocTitle: 'Testen'
description: 'Leer manieren om UI componenten te testen'
commit: '3e283f7'
---

Geen Storybook tutorial zou compleet zijn zonder testen. Testen is essentieel voor het maken van UI's van hoge kwaliteit. In modulaire systemen kunnen kleine tweaks leiden tot grote regressies. Tot nu toe zijn we drie soorten tests tegengekomen:

- **Manuele tests** vertrouwen erop dat developers handmatig naar een component kijken om te controleren of deze correct is. Ze helpen ons om het uiterlijk van een component tijdens het bouwen te controleren.
- **Snapshot tests** met Storyshots leggen de gerenderde markup van een component vast. Ze helpen ons op de hoogte te blijven van markup-wijzigingen die renderfouten en waarschuwingen veroorzaken.
- **Unit tests** met Jest controleren of de output van een component hetzelfde blijft gegeven een vaste input. Ze zijn geweldig voor het testen van de functionele kwaliteiten van een component.

## “Maar ziet het er goed uit?”

Helaas zijn de bovengenoemde testmethoden alleen niet voldoende om UI-bugs te voorkomen. UI's zijn lastig te testen omdat design subjectief en genuanceerd is. Visuele tests zijn te handmatig, snapshot tests veroorzaken te veel valse positieven bij gebruik voor UI en unit tests op pixelniveau zijn van slechte waarde. Een complete Storybook-teststrategie omvat ook visuele regressie tests.

## Visuele tests voor Storybook

Visuele regressie tests, ook visuele tests genoemd, zijn ontworpen om veranderingen in het uiterlijk te ontdekken. Ze werken door screenshots van elke story te nemen en ze commit-tot-commit te vergelijken om eventuele veranderingen te tonen. Dit is perfect voor het verifiëren van grafische elementen zoals lay-out, kleur, grootte en contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is een fantastisch hulpmiddel voor visuele regressie tests, omdat elke story in wezen een testspecificatie is. Elke keer dat we een story schrijven of bijwerken, krijgen we gratis een specificatie!

Er zijn een aantal hulpmiddelen voor visuele regressie tests. Voor professionele teams raden we [**Chromatic**](https://www.chromatic.com/) aan, een add-on gemaakt door de ontwikkelaars van Storybook die tests in de cloud uitvoert. Het laat ons ook toe om Storybook online te publiceren zoals we gezien hebben in het [vorige hoofdstuk](/react/nl/deploy/)

## Een UI wijziging opmerken

Visuele regressie tests vertrouwen op het vergelijken van beelden de nieuwe gerenderde UI code en de baseline beelden. Als er een UI verandering opgemerkt wordt, worden we hierover gewaarschuwd.

Laten we zien hoe het werkt door the achtergrond van de `Task` component aan te passen.

Start met het aanmaken van een nieuwe branch voor deze verandering:

```bash
git checkout -b change-task-background
```

Verander `Task` naar het volgende:

```js
// src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
    style={{ textOverflow: 'ellipsis', background: 'red' }}
  />
</div>
```

Dit geeft een nieuwe achtergrondkleur weer voor het item.

![task achtergrond wijziging](/intro-to-storybook/chromatic-task-change.png)

Voeg het bestand toe:

```bash
git add src\components\Task.js
```

Commit het:

```bash
git commit -m “change task background to red”
```

En push de wijzigingen naar de remote repo:

```bash
git push -u origin change-task-background
```

Tot slot, open je Github repository en open een pull request voor de `change-task-background` branch.

![Een PR in GitHub aanmaken voor task](/github/pull-request-background.png)

Voeg een descriptieve tekst toe aan je pull request en klik `Create pull request`. Klik op de "🟡 UI Tests" PR check onderaan de pagina.

![Een PR in GitHub aangemaakt voor task](/github/pull-request-background-ok.png)

Dit zal je tonen hoe de UI wijzigingen door jouw commit zijn opgemerkt.

![Chromatic merkt wijzigingen op](/intro-to-storybook/chromatic-catch-changes.png)

Er zijn veel wijzigingen! De component hiërarchie waar `Task` een kind is van `TaskList` en `Inbox` betekent dat één kleine verandering een sneeuwbaleffect kan teweegbrengen tot grote regressies. Deze omstandigheid is precies waarom developers visuele regressietests nodig hebben in aanvulling op andere testmethodes.
 
![UI kleine wijzigingen grote regressies](/intro-to-storybook/minor-major-regressions.gif)

## Wijzigingen reviewen

Visuele regressie tests zorgen ervoor dat componenten niet per ongeluk veranderen. Maar het is nog steeds aan ons om te bepalen of veranderingen opzettelijk zijn of niet.

Als een wijziging opzettelijk is, moeten we de _baseline_ bijwerken zodat toekomstige tests worden vergeleken met de nieuwste versie van de story. Als een wijziging onbedoeld is, moet deze worden gecorrigeerd.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Aangezien moderne apps zijn opgebouwd uit componenten, is het belangrijk dat we op componentniveau testen. Hierdoor kunnen we de oorzaak van een verandering, de component, identificeren in plaats van te reageren op symptomen van een verandering, de schermen en samengestelde componenten.

## Wijzigingen mergen

Wanneer we klaar zijn met reviewen, zijn we klaar om UI-wijzigingen met vertrouwen te mergen - wetende dat updates niet per ongeluk bugs zullen introduceren. Als je van de nieuwe `red` achtergrond houdt, accepteer dan de wijzigingen, zo niet, revert naar de vorige versie.

![Wijzigingen klaar om gemerged te worden](/intro-to-storybook/chromatic-review-finished.png)

Storybook helpt ons componenten **te bouwen**; testing helpt ons ze **te onderhouden**. De vier soorten UI-tests die in deze tutorial zijn behandeld, zijn visuele-, snapshot-, unit- en visuele regressie tests. De laatste drie kunnen geautomatiseerd worden door ze aan een CI toe te voegen, zoals we dit net hebben opgezet. Dit helpt ons componenten te shippen zonder je zorgen te hoeven maken over verdoken bugs. De hele workflow wordt hieronder geïllustreerd.

![Visuele regressie testing workflow](/intro-to-storybook/cdd-review-workflow.png)
