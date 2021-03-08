---
title: 'Addons'
tocTitle: 'Addons'
description: 'Leer hoe je add-ons kunt integreren en gebruiken aan de hand van een populair voorbeeld'
commit: 'a23f4d0'
---

Storybook beschikt over een robuust systeem van [add-ons](https://storybook.js.org/docs/react/configure/storybook-addons) waarmee je de developer experience kunt verbeteren voor iedereen in je team. Als je deze tutorial lineair hebt gevolgd, hebben we tot nu toe naar meerdere add-ons verwezen en je zal er al een geïmplementeerd hebben in het [Testing-hoofdstuk](/intro-to-storybook/react/nl/test/).

<div class="aside">
<strong> Op zoek naar een lijst met mogelijke add-ons? </strong>
<br/>
😍 Je kunt de lijst met officieel ondersteunde en goede community-add-ons <a href="https://storybook.js.org/addons">hier bekijken</a>.
</div>

We zouden nog veel kunnen schrijven over het configureren en gebruiken van add-ons voor al je specifieke use-cases. Laten we nu werken aan de integratie van een van de meest populaire add-ons in het ecosysteem van Storybook: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Knobs opzetten

Knobs is een geweldige bron voor designers en developers om te experimenteren en te spelen met componenten in een gecontroleerde omgeving zonder te moeten programmeren! Je levert in wezen dynamisch gedefinieerde velden waarmee een gebruiker de props manipuleert die worden doorgegeven aan de componenten in je stories. Dit is wat gaan we implementeren...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installatie

Eerst moeten we alle benodigde dependencies installeren.

```bash
yarn add -D @storybook/addon-knobs
```

Registreer Knobs in je `.storybook/addons.js` bestand.

```javascript
// .storybook/addons.js

import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
<strong>📝 Addon registratie volgorde is belangrijk!</strong>
<br/>
De volgorde waarin je deze addons opgeeft, bepaalt de volgorde waarin ze verschijnen als tabbladen op je addon paneel (voor degenen die daar verschijnen).
</div>

Dat is het! Tijd om het in een story te gebruiken.

### Gebruik

Laten we het object knob type gebruiken in de `Task` component.

Importeer eerst de `withKnobs` decorator en de `object` knob in `Task.stories.js`:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

Geef vervolgens binnen de stories van `Task`, `withKnobs` als parameter door aan de functie `addDecorator()`:

```javascript
// src/components/Task.stories.js

storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

Integreer ten slotte het knob type `object` in de "standaard"-story:

```javascript
// src/components/Task.stories.js

storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return <Task task={object('task', { ...task })} {...actions} />;
  })
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Nu zou een nieuw tabblad "Knobs" moeten verschijnen naast het tabblad "Action Logger" in het onderste paneel.

Zoals [hier](https://github.com/storybooks/storybook/tree/master/addons/knobs#object) gedocumenteerd, accepteert het knoptype `object` een label en een standaardobject als parameters. Het label is constant en verschijnt links van een tekstveld in je add-on paneel. Het object dat je hebt doorgegeven, wordt weergegeven als een editeerbare JSON-blob. Zolang je geldige JSON indient, wordt je component aangepast op basis van de data die aan het object worden doorgegeven!

## Addons evolueren het bereik van je Storybook

Niet alleen dient je Storybook instantie als een prachtige [CDD-omgeving](https://www.componentdriven.org/), maar nu bieden we ook een interactieve bron van documentatie aan. PropTypes zijn geweldig, maar een designer of iemand die helemaal nieuw is in de code van een component, kan zijn gedrag heel snel achterhalen via Storybook met de knobs add-on geïmplementeerd.

## Knobs gebruiken om edge-cases te vinden

Bovendien, met gemakkelijke toegang tot het bewerken van doorgegeven data aan een component, kunnen QA Engineers of preventieve UI Engineers nu een component tot het uiterste drijven! Wat gebeurt er bijvoorbeeld met `Task` als ons lijstitem een _GIGANTISCHE_ string heeft?

![Oh nee! De uiterst rechtse inhoud is afgebroken!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Dankzij het feit dat we snel verschillende inputs van een component kunnen proberen, kunnen we dergelijke problemen relatief gemakkelijk vinden en oplossen! Laten we het afbrekingsprobleem oplossen door een style toe te voegen aan `Task.js`:

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![Dat is beter](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Een nieuwe Story toevoegen om regressies te vermijden

Natuurlijk kunnen we dit probleem altijd reproduceren door dezelfde input in de knobs in te voeren, maar het is beter om een vaste story te schrijven voor deze input. Dit zal je regressietesten verhogen en de limieten van de componenten duidelijk aangeven voor de rest van je team.

Laten we een story toevoegen voor het lange tekst geval in `Task.stories.js`:

```javascript
// src/components/Task.stories.js

const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />)
  .add('long title', () => <Task task={{ ...task, title: longTitle }} {...actions} />);
```

Nu we de story hebben toegevoegd, kunnen we deze edge-case gemakkelijk reproduceren wanneer we eraan willen werken:

![Hier staat het in Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Als we [visuele regressietests](/intro-to-storybook/react/nl/test/) gebruiken, zullen we ook worden geïnformeerd als we ooit onze ellipsvormende oplossing breken. Dergelijke obscure edge-cases kunnen altijd worden vergeten!

### Merge de wijzigingen

Vergeet niet je wijzigingen te mergen met git!
