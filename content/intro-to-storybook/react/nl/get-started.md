---
title: 'Storybook voor React tutorial'
tocTitle: 'Begin'
description: 'Stel Storybook in voor je ontwikkelomgeving'
commit: '8741257'
---

Storybook wordt naast je app in _development mode_ uitgevoerd. Het helpt je om UI componenten te bouwen die geïsoleerd zijn van de business logica en context van je applicatie. Deze versie van Learn Storybook is voor React; er zijn andere versies voor [Vue](/vue/en/get-started) en[Angular](/angular/en/get-started).

![Storybook en jouw app](/intro-to-storybook/storybook-relationship.jpg)

## Stel React Storybook in

We moeten een paar stappen volgen om het build proces in je omgeving op te zetten. Om te beginnen willen we [Create React App](https://github.com/facebook/create-react-app) (CRA) gebruiken om ons buildsysteem in te stellen en [Storybook](https://storybook.js.org/) en [Jest](https://facebook.github.io/jest/) testen in te schakelen voor onze gemaakte app. Voer daartoe de volgende commando's uit:

```bash
# Create our application:
npx create-react-app taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

We kunnen snel controleren of de verschillende omgevingen van onze applicatie correct werken:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
  OPMERKING: Als <code>yarn test</code> een fout veroorzaakt, moet je mogelijk <code>watchman</code> installeren zoals geadviseerd in <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">dit issue</a>.
</div>

Onze drie front-end app-modaliteiten: geautomatiseerde testen (Jest), component development (Storybook) en de app zelf.

![3 modaliteiten](/intro-to-storybook/app-three-modalities.png)

Afhankelijk van het gedeelte van de app waaraan je werkt, wil je misschien een of meer van deze tegelijkertijd uitvoeren. Aangezien onze huidige focus ligt op het creëren van een enkele UI-component, zullen we het houden bij het werken met Storybook.

## CSS herbruiken

Taskbox herbruikt design elementen uit de GraphQL en React Tutorial [voorbeeld-app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), dus we hoeven geen CSS te schrijven in deze tutorial. We compileren gewoon de LESS tot een enkel CSS-bestand en voegen het toe aan onze app. Kopieer en plak [deze gecompileerde CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) in het `src/index.css`-bestand volgens de conventie van CRA.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Indien je de stijl wilt wijzigen, de bron LESS bestanden zijn in de GitHub-repo voorzien.
</div>

## Assets toevoegen

We moeten ook de [mappen](https://github.com/chromaui/learnstorybook-code/tree/master/public) voor lettertypes en iconen toevoegen aan de folder `public/`. Na het toevoegen van styling en assets zal de app een beetje vreemd renderen. Dat is geen probleem. We werken momenteel niet aan de app. We beginnen met het bouwen van onze eerste component!
