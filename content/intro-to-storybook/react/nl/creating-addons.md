---
title: 'Bonus: maak een addons'
tocTitle: 'Bonus: Maken van addons'
description: 'Leer hoe je je eigen add-ons kunt bouwen die je ontwikkeling boosten'
commit: 'bebba5d'
---

Met de add-on-architectuur van Storybook kan je de functieset uitbreiden en aanpassen aan je behoeften.

Het schrijven van je eigen add-on klinkt misschien een beetje overweldigend, maar zoals je in deze tutorial zal zien, kan het vrij eenvoudig zijn.

We gaan samen een add-on schrijven, laten we eerst kijken wat onze add-on zal doen:

## De add-on die we gaan schrijven

Je team heeft design assets die enigszins verband houden met de UI-componenten. Die relatie is niet echt duidelijk vanuit de UI van Storybook. Laten we dat oplossen!

We gaan een add-on schrijven die onze design assets naast onze component toont!

![Storybook en jouw app](/intro-to-storybook/design-assets-addon.png)

**Onze addon moet**:

- het design asset weergeven in een paneel
- zowel afbeeldingen als url's voor embedding ondersteunen
- zou meerdere assets moeten ondersteunen, voor het geval dat er meerdere versies of thema's zijn

De manier waarop we de lijst met assets met stories gaan associeren, is via parameters.

Zo zal het eruit zien wanneer iemand design assets aan zijn story toevoegt:

```js
import Component from './component';

export default {
  title: 'Component',
  component: Component,
  parameters: {
    assets: ['path/to/asset.png'],
  },
};

export const variant = () => <Component />;
```

Met onze publieke API gedefinieerd, kunnen we beginnen met het schrijven van de add-on om deze in de UI van Storybook te laten verschijnen.

## Het schrijven van de addon

Laten we een nieuw bestand aanmaken: `.storybook/addons/design-assets.js`. (je zal mogelijks de `addons` folder moeten aanmaken)

> **Opmerking:**
> We maken deze add-on voor storybook in de storybook config folder die standaard `.storybook` is.
> Op een gegeven moment in de toekomst zouden we deze add-on naar zijn eigen package moeten verplaatsen, laten we ons eerst concentreren op het schrijven van de add-on en deze werkende te krijgen.

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

Storybook laadt het bestand dat we zonet hebben aangemaakt niet automatisch, we moeten een verwijzing naar `.storybook/addons/design-assets.js` toevoegen aan het bestand dat alle add-ons registreert.
Het bestand waar dit gebeurt is `.storybook/addons.js`, dus voeg deze lijn toe aan dat bestand:

```js
import './addons/design-assets';
```

Wanneer we nu storybook starten, zouden we eigenlijk een paneel aan de UI toegevegd moeten zien.
Met Storybook kan je niet alleen panelen toevoegen, maar ook een lijst met typen van UI's.

Maar nu gaan we een component schrijven die inhaakt op de state van Storybook en de parameters van de huidige story zal ophalen:

```js
export const Content = () => {
  const results = useParameter('assets', []);

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

Nu hoeven we alleen nog maar deze component aan de rendering van ons geregistreerde paneel te koppelen en we hebben onze werkende add-on:

```js
import React, { useMemo } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

// this is often placed in a constants.js file
const ADDON_ID = 'storybook/parameter';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = `assets`;

// this is often placed in a panel.js file
const Content = () => {
  const results = useParameter(PARAM_KEY, []);

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

// this is often placed in a register.js file
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'parameter',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Op dit punt kunnen we tussen stories in Storybook navigeren en de lijst met design assets bekijken die geassocieerd zijn met de geselecteerde story.

Laten we de `Content` component veranderen zodat deze daadwerkelijk de assets weergeeft:

```js
import React, { Fragment, useMemo } from 'react';

import { useParameter, useStorybookState } from '@storybook/api';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';

const ADDON_ID = 'storybook/parameter';
const PARAM_KEY = `assets`;

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

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return <Asset url={url} />;
};
```

Opmerking: Styling in storybook wordt gedaan via `@storybook/theming` waarin `styled` wordt ge-exposed als een named export. Hiermee kan je een nieuwe component voor Storybook's UI maken die reageert op Storybook's thema.
Als je dit gebruikt, moet je ook `@storybook/theming` toevoegen aan je`package.json`.

## Stateful add-ons

Dus 1 van onze doelen was:

> - zou meerdere assets moeten ondersteunen, voor het geval er meerdere versies of thema's zijn

Om dit te doen, hebben we state nodig, namelijk: "welke asset is momenteel geselecteerd".

We zouden `useState` van react kunnen gebruiken of we zouden`this.setState` in een class component kunnen gebruiken. Maar laten we in plaats daarvan storybook's `useAddonState` gebruiken!

```js
export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return <Asset url={url} />;
};
```

## Gebruik Storybook-UI in je custom add-on

Nu hebben we state, maar geen manier om de state te veranderen.
We kunnen natuurlijk onze eigen UI maken, maar laten we in plaats daarvan een UI gebruiken die storybook al heeft gemaakt.

De UI-component van Storybook is te vinden in de package `@storybook/components`.

Laten we de `ActionBar` component gebruiken:

```js
import { ActionBar } from '@storybook/components';

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState(ADDON_ID, 0);
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

## Volledige broncode van onze add-on

```js
// constants.js
export const ADDON_ID = 'storybook/design-assets';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `assets`;
```

```js
// register.js
import React from 'react';

import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ADDON_ID, PANEL_ID } from './constants';
import { Content } from './panel';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'design assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

```js
// panel.js
import React, { Fragment, useMemo } from 'react';

import { useParameter, useAddonState, useStorybookState } from '@storybook/api';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { PARAM_KEY, ADDON_ID } from './constants';

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
  if (url.match(/\.(mp4|ogv|webm)/)) {
    // do video viewer
    return <div>not implemented yet, sorry</div>;
  }

  return <Iframe title={url} src={url} />;
};

const getUrl = input => (typeof input === 'string' ? input : input.url);

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

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

## Je add-on extracten naar zijn eigen package

Nadat je add-on werkt zoals voorzien, wil je deze waarschijnlijk naar zijn eigen pakket extracten.

Indien het nuttig voor je is, is het waarschijnlijk ook nuttig voor iemand anders.

Je kan een PR openen in de storybook documentatie om je add-on daar in de verf te zetten.

## Wat is het volgende?

Dit is een voorbeeld van een add-on die parameters gebruikt en in een paneel weergeeft, maar dat is slechts een van de vele opties die je hebt.

Met deze principes kan je je custom UI op verschillende plaatsen in storybook's UI weergeven.

Je kan:

- [knoppen toevoegen in de Storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communiceren via het kanaal met het iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [stuur commands en resultaten](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [analyse uitvoeren op de html/css output van je component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [componenten wrappen, opnieuw renderen met nieuwe data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [DOM events afvuren, DOM veranderingen maken](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [tests runnen](https://github.com/storybookjs/storybook/tree/next/addons/jest)

En nog veel meer!

# Dev Kits

Om je te helpen bij het schrijven van add-ons heeft het Storybook-team `dev-kits` ontwikkeld.

Deze packages zijn als kleine startersets waarmee je je eigen add-on kan ontwikkelen.
De add-on die we zojuist hebben gemaakt, is gebaseerd op de dev-kit `addon-parameters`.

Je kan de dev-kits hier vinden:
https://github.com/storybookjs/storybook/tree/next/dev-kits

Meer dev-kits zullen in de toekomst beschikbaar worden.
