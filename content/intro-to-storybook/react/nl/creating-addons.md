---
title: 'Bonus: maak een addons'
tocTitle: 'Bonus: Maken van addons'
description: 'Leer hoe je je eigen add-ons kunt bouwen die je ontwikkeling boosten'
commit: 'bebba5d'
---

Eerder, hebben we een belangrijke feature van Storybook geïntroduceerd: het robuuste [addons](https://storybook.js.org/addons/introduction/) ecosysteem. Addons worden gebruikt om je developer ervaring en workflows te verbeteren.

In dit bonushoofdstuk, gaan we een kijkje nemen over het schrijven van onze eigen add-on. Je denkt misschien dat het schrijven ervan  als een overweldigende taak klinkt, maar dat is het eigenlijk niet, we moeten maar een aantal stappen nemen om te starten, en dan kunnen we eraan beginnen.

Laat ons eerst vastleggen wat onze add-on zal doen.

## De add-on die we gaan schrijven

Voor dit voorbeeld, laten we ervan uitgaan dat ons team een aantal design assets heeft die op een manier gerelateerd zijn aan de bestaande UI componenten. Kijkende naar de huidige Storybook UI, lijkt het erop dat deze relatie niet echt duidelijk is. Hoe kunnen we dit oplossen?

**Onze add-on moet**:

- het design asset weergeven in een paneel
- zowel afbeeldingen als url's voor embedding ondersteunen
- zou meerdere assets moeten ondersteunen, voor het geval dat er meerdere versies of thema's zijn

De manier waarop we onze lijst van assets gaan vastmaken aan de stories is door [parameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options), wat een Storybook optie is die ons toelaat om custom parameters te injecteren in onze stories. De manier om het te gebruiken, is redelijk gelijkaardig aan hoe we een decorator hebben gebruikt in vorige hoofdstukken.

```javascript
export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## Setup

We hebben vastgelegd wat onze add-on zal doen, nu is het tijd om eraan te beginnen werken.

Maak een bestand aan in de root folder van ons project, genoemd `.babelrc` met het volgende:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

Het toevoegen van dit bestand zal ons toelaten om de correcte preset en opties te gebruiken voor de add-on die we zullen ontwikkelen.
 
Maak hierna, in je `.storybook` folder, een nieuwe folder aan, genoemd `design-add-on` en maak hierin een nieuw bestand aan genaamd `register.js`.

Dat is het! We zijn klaar voor het ontwikkelen van onze add-on.

<div class="aside">We gaan onze code>.storybook</code> folder gebruiken als een placeholder voor onze add-on. De reden hierachter is om een ongecompliceerde aanpak te behouden en te voorkomen dat deze te ingewikkeld wordt. Indien deze add-on getransformeerd wordt in een echte add-on, is het noodzakelijk deze te verplaatsen naar een aparte package met zijn eigen bestand- en folderstructuur.</div>

## Het schrijven van de add-on

Voeg het volgende toe aan je recent gecreëerde bestand:

```javascript
//.storybook/design-add-on/register.js
import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-add-on', () => {
  addons.add('design-add-on/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```
In dit nieuwe bestand gaan we enkele dependencies importeren die we nodig hebben. Mogelijks moet je deze ook installeren met behulp van `npm` of`yarn`.

Dit zijn de dependencies die we nodig zullen hebben: `react`, `@storybook/api`, `storybook/addons` en `@storybook/components`.

In het zonet aangemaakte bestand gaan we deze dependencies importeren:

```js
import React, { useMemo, Fragment } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
```

Nu registreren we een nieuwe add-on met storybook en voegen we een paneel toe:

```js
addons.register('my/design-assets', () => {
  addons.add(PANEL_ID, {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```
Dit is de typische standaardcode om je op weg te helpen. Doornemen wat de code doet:

- We registreren een nieuwe add-on in onze Storybook.
- Voeg een nieuw UI-element toe voor onze add-on met enkele opties (een titel die onze add-on en het gebruikte type element definieert) en render het voorlopig met wat tekst.

Als we Storybook op dit punt starten, kunnen we de add-on nog niet zien. Zoals we eerder deden met de Knobs add-on, moeten we onze eigen add-on registreren in het bestand `.storybook / main.js`. Voeg gewoon het volgende toe aan de reeds bestaande lijst met `addons`:

```js
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // same as before
    './.storybook/design-add-on/register.js', // our add-on
  ],
};
```

![design assets add-on die in Storybook wordt uitgevoerd](/intro-to-storybook/create-add-on-design-assets-added.png)

Succes! We hebben onze nieuw gemaakte add-on toegevoegd aan de Storybook UI.

<div class="aside"> Met Storybook kun je niet alleen panelen toevoegen, maar een hele reeks verschillende soorten UI-componenten. En de meeste, zo niet alle, zijn al gemaakt in de @storybook/components package, zodat je niet al te veel tijd hoeft te verspillen aan het implementeren van de UI en je je kunt concentreren op het schrijven van features. </div>

### De content component creëren

We hebben ons eerste doel bereikt. Tijd om aan het tweede te gaan werken.

Om dit te voltooien, moeten we enkele wijzigingen aanbrengen in onze imports en een nieuwe component introduceren die de asset informatie weergeeft.

Breng de volgende wijzigingen aan in het add-on-bestand:

```javascript
//.storybook/design-add-on/register.js
import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

We hebben de component gemaakt en de imports aangepast. Het enige dat ontbreekt, is de component met ons paneel te verbinden waarna we een werkende add-on zullen hebben die in staat is om informatie weer te geven met betrekking tot onze stories.

Je code zou er als volgt uit moeten zien:

```javascript
//.storybook/design-add-on/register.js
import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-add-on', () => {
  addons.add('design-add-on/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Merk op dat we de [useParameter](https://storybook.js.org/docs/addons/api/#useparameter) gebruiken, deze handige "hook" stelt ons in staat om de informatie te lezen die wordt geleverd door de `parameters` optie voor elke story, dat in ons geval ofwel een pad naar een item is ofwel een lijst met paden is. Je zult het binnenkort in actie zien.

### Onze add-on gebruiken in een story

We hebben alle benodigde onderdelen met elkaar verbonden. Maar hoe kunnen we zien of het echt werkt en iets laat zien?

Om dit te doen, gaan we een kleine wijziging aanbrengen in het bestand `Task.stories.js` en de [parameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options) optie toevoegen.

```javascript
// src/components/Task.stories.js
export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};
/* same as before  */
```

Ga je gang en start je Storybook opnieuw en selecteer de Task story, je zou zoiets als dit moeten zien:

! [Storybook die inhoud toont met design assets addons](/intro-to-storybook/create-add-on-design-assets-inside-story.png)

### Inhoud tonen in onze add-on

In dit stadium kunnen we zien dat de add-on werkt zoals het hoort, maar laten we nu de `Content` component wijzigen om daadwerkelijk weer te geven wat we willen:

```javascript
//.storybook/design-add-on/register.js
import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

Als je goed kijkt, zul je zien dat we de `styled` tag gebruiken, deze tag komt uit de `@storybook/theming` package. Door deze tag te gebruiken, kunnen we niet alleen het thema van Storybook, maar ook de UI aanpassen aan onze behoeften. Ook [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate), wat een echt handige hook is, waarmee we in de interne state van Storybook kunnen tappen, zodat we elk stukje beschikbare informatie kunnen ophalen. In ons geval gebruiken we het om alleen de id van elke aangemaakte story op te halen.

### De eigenlijke assets tonen

Om de assets die in onze add-on worden weergegeven daadwerkelijk te zien, moeten we ze naar de `public` folder kopiëren en de `parameters` optie van de story aanpassen om deze wijzigingen weer te geven.

Storybook pikt de wijziging op en laadt de items, maar voorlopig alleen de eerste.

![eigenlijke assets geladen](/intro-to-storybook/design-assets-image-loaded.png)

## Stateful addons

Omze over onze oorspronkelijke doelstellingen te gaan:

- ✔️ Toon het design asset in een paneel
- ✔️ Ondersteuning van afbeeldingen, maar ook het inbedden van URL's 
- ❌ Moet meerdere assets ondersteunen, voor het geval er meerdere versies of thema's zouden zijn

We zijn er bijna, er is nog maar 1 doelstelling over.

Voor de laatste hebben we een soort status nodig, we zouden React's `useState` hook kunnen gebruiken, of als we met class components zouden werken `this.setState()`. Maar in plaats daarvan gaan we Storybook's eigen `useAddonState` gebruiken, wat ons een middel geeft om de add-on status te persisteren en te vermijden dat we extra logica moeten schrijven om de lokale statate te persisteren. We zullen ook een ander UI-element uit Storybook gebruiken, de `ActionBar`, waarmee we tussen items kunnen wisselen.

We moeten onze imports aanpassen voor onze behoeften:

```javascript
//.storybook/design-add-on/register.js
import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```


En onze `Content` component aanpassen, zodat we kunnen wisselen tussen assets:

```javascript
//.storybook/design-add-on/register.js
const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // add-on state being persisted here
  const [selected, setSelected] = useAddonState('my/design-add-on', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## add-on gebouwd

We hebben bereikt wat we wilden doen, namelijk het maken van een volledig functionerende Storybook add-on die de design assets weergeeft die verband houden met de UI-componenten.

<details>
  <summary>Klik om te vergroten en de volledige gebruikte code te zien in dit voorbeeld</summary>

```javascript
// .storybook/design-add-on/register.js
import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-add-on', 0); // add-on state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-add-on', () => {
  addons.add('design-add-on/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>


## Wat is het volgende?

De volgende logische stap voor onze add-on, zou zijn om er een eigen package van te maken en deze toe te staan te verspreiden met je team en eventueel met de rest van de gemeenschap.

Maar dat valt buiten de scope van deze tutorial. Dit voorbeeld laat zien hoe je de Storybook API kunt gebruiken om je eigen custom add-on te maken om je ontwikkelingsworkflow verder te verbeteren.

Leer meer over het verder customizen van je add-on:

- [knoppen toevoegen in de Storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communiceren via het kanaal met het iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/add-on-roundtrip/README.md)
- [stuur commands en resultaten](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [analyse uitvoeren op de html/css output van je component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [componenten wrappen, opnieuw renderen met nieuwe data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [DOM events afvuren, DOM veranderingen maken](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [tests runnen](https://github.com/storybookjs/storybook/tree/next/addons/jest)

En nog veel meer!

<div class="apart"> Mocht je een nieuwe add-on maken en je zou deze graag gefeatured zien, voel je dan vrij om een PR te openen in de Storybook-documentatie om deze gefeatured te zien.</div>

### Dev Kits

Om je te helpen bij het schrijven van addons heeft het Storybook-team `dev-kits` ontwikkeld.

Deze packages zijn als kleine startersets waarmee je je eigen add-on kan ontwikkelen.
De add-on die we zojuist hebben gemaakt, is gebaseerd op de dev-kit `add-on-parameters`.

Je kan deze en andere dev-kits hier vinden:
https://github.com/storybookjs/storybook/tree/next/dev-kits

Meer dev-kits zullen in de toekomst beschikbaar worden.

## Addons delen met team

Addons zijn tijdbesparende toevoegingen aan je workflow, maar het kan moeilijk zijn voor niet-technische teamgenoten en reviewers om te profiteren van hun functies. Je kunt niet garanderen dat mensen Storybook op hun lokale computer zullen draaien. Daarom kan het erg nuttig zijn om je Storybook op een online locatie te plaatsen waar iedereen naar kan verwijzen. In het volgende hoofdstuk doen we precies dat!
