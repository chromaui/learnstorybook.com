---
title: 'Test UI componenten'
tocTitle: 'Testen'
description: 'Leer manieren om UI componenten te testen'
commit: '3e283f7'
---

Geen Storybook tutorial zou compleet zijn zonder testen. Testen is essentieel voor het maken van UI's van hoge kwaliteit. In modulaire systemen kunnen kleine tweaks leiden tot grote regressies. Tot nu toe zijn we drie soorten tests tegengekomen:

- **Visuele tests** vertrouwen erop dat developers handmatig naar een component kijken om te controleren of deze correct is. Ze helpen ons om het uiterlijk van een component tijdens het bouwen te controleren.
- **Snapshot tests** met Storyshots leggen de gerenderde markup van een component vast. Ze helpen ons op de hoogte te blijven van markup-wijzigingen die renderfouten en waarschuwingen veroorzaken.
- **Unit tests** met Jest controleren of de output van een component hetzelfde blijft gegeven een vaste input. Ze zijn geweldig voor het testen van de functionele kwaliteiten van een component.

## “Maar ziet het er goed uit?”

Helaas zijn de bovengenoemde testmethoden alleen niet voldoende om UI-bugs te voorkomen. UI's zijn lastig te testen omdat design subjectief en genuanceerd is. Visuele tests zijn te handmatig, snapshot tests veroorzaken te veel valse positieven bij gebruik voor UI en unit tests op pixelniveau zijn van slechte waarde. Een complete Storybook-teststrategie omvat ook visuele regressie tests.

## Visuele regressie tests voor Storybook

Visuele regressie tests zijn ontworpen om veranderingen in het uiterlijk te ontdekken. Ze werken door screenshots van elke story te nemen en ze commit-tot-commit te vergelijken om eventuele veranderingen te tonen. Dit is perfect voor het verifiëren van grafische elementen zoals lay-out, kleur, grootte en contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is een fantastisch hulpmiddel voor visuele regressie tests, omdat elke story in wezen een testspecificatie is. Elke keer dat we een story schrijven of bijwerken, krijgen we gratis een specificatie!

Er zijn een aantal hulpmiddelen voor visuele regressie tests. Voor professionele teams raden we [**Chromatic**](https://www.chromatic.com/) aan, een add-on gemaakt door de ontwikkelaars van Storybook die tests in de cloud uitvoert.

## Visuele regressie tests opzetten

Chromatic is een add-on voor Storybook voor visuele regressie tests en reviews in de cloud. Omdat het een betaalde service is (met een gratis proefperiode), is het misschien niet voor iedereen geschikt. Chromatic is echter een leerzaam voorbeeld van een visuele productietestworkflow die we gratis gaan uitproberen. Laten we eens kijken.

### Breng git up to date

Create React App heeft een git repo aangemaakt voor je project; laten we de wijzigingen inchecken die we hebben aangebracht:

```bash
$ git add -A
```

Commit nu de bestanden.

```bash
$ git commit -m "taskbox UI"
```

### Download Chromatic

Voeg de package toe als dependency.

```bash
yarn add chromatic
```

Import Chromatic in je `.storybook/config.js` bestand.

```javascript
// .storybook/config.js

import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';
import 'chromatic';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Vervolgens [log je in op Chromatic](https://www.chromatic.com/start) met je GitHub-account (Chromatic vraagt alleen om lichte permissies). Maak een project aan met de naam "taskbox" en kopieer je unieke `project-token`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Voer het test commando uit op de command line om visuele regressietests in te stellen voor Storybook. Vergeet niet om je unieke project-token toe te voegen in plaats van `<project-token>`.

```bash
npx chromatic --project-token=<project-token>
```

<div class="aside">
Als je Storybook een afwijkend build script heeft dan moet je mogelijk [opties toevoegen](https://www.chromatic.com/docs/setup#command-options) aan dit commando.
</div>

Zodra de eerste test is voltooid, hebben we test baselines voor elke story. Met andere woorden, screenshots van elke story die bekend staan als "goed". Toekomstige wijzigingen in die stories zullen worden vergeleken met de baselines.

![Chromatic baselines](/intro-to-storybook/chromatic-baselines.png)

## Ontdek een visuele wijziging

Visuele regressie tests zijn afhankelijk van het vergelijken van afbeeldingen van de nieuw gerenderde code met eerder genomen afbeeldingen, pixel voor pixel. Als een visuele wijziging wordt ontdekt, wordt je hiervan op de hoogte gebracht. Zie hoe het werkt door de background color van de component `Task` aan te passen:

![code wijziging](/intro-to-storybook/chromatic-change-to-task-component.png)

Dit levert een nieuwe background color op voor het item.

![task background wijziging](/intro-to-storybook/chromatic-task-change.png)

Gebruik het test commando van eerder om nog een Chromatic test uit te voeren.

```bash
npx chromatic --project-token=<project-token>
```

Volg de link naar de web UI waar je wijzigingen ziet.

![UI wijzigingen in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Er zijn veel veranderingen! De componenthiërarchie waarbij `Task` een child is van `TaskList` en `Inbox` betekent dat één kleine tweak leidt tot grote regressies. Deze omstandigheid is precies waarom developers visuele regressie tests nodig hebben naast andere testmethoden.

![UI kleine wijzigingen, grote regressies](/intro-to-storybook/minor-major-regressions.gif)

## Wijzigingen reviewen

Visuele regressie tests zorgen ervoor dat componenten niet per ongeluk veranderen. Maar het is nog steeds aan jou om te bepalen of veranderingen opzettelijk zijn of niet.

Als een wijziging opzettelijk is, moet je de _baseline_ bijwerken zodat toekomstige tests worden vergeleken met de nieuwste versie van de story. Als een wijziging onbedoeld is, moet deze worden gecorrigeerd.

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

Storybook helpt je componenten **te bouwen**; testing helpt je ze **te onderhouden**. De vier soorten UI-tests die in deze tutorial worden behandeld, zijn visuele-, snapshot-, unit- en visuele regressie tests. Je kan de laatste drie automatiseren door ze toe te voegen aan je CI-script. Dit helpt je componenten te shippen zonder je zorgen te hoeven maken over verdoken bugs. De hele workflow wordt hieronder geïllustreerd.

![Visuele regressie testing workflow](/intro-to-storybook/cdd-review-workflow.png)
