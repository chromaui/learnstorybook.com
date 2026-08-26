---
title: 'Tutorial di Storybook per React Native'
tocTitle: 'Inizia'
description: 'Configura Storybook nel tuo ambiente di sviluppo'
---

Storybook ti aiuta a costruire componenti dell'interfaccia utente isolati dalla logica aziendale e dal contesto della tua app. Questa edizione del tutorial Intro to Storybook è per React Native; esistono altre edizioni per [React](/intro-to-storybook/react/it/get-started/), [Vue](/intro-to-storybook/vue/it/get-started/), [Angular](/intro-to-storybook/angular/en/get-started/), [Svelte](/intro-to-storybook/svelte/en/get-started/).

![Storybook e la tua app](/intro-to-storybook/storybook-relationship.jpg)

## Configura Storybook per React Native

Dovremo seguire alcuni passi per iniziare. In questo tutorial utilizzeremo questo [template](https://github.com/chromaui/intro-storybook-react-native-template), in cui abbiamo già configurato un'app React Native utilizzando [Expo](https://expo.io/tools) e aggiunto [Storybook](https://storybook.js.org/) al progetto.

Prima di iniziare, ci sono alcune cose da considerare:

- Per aiutarti durante il tutorial, avrai bisogno di un telefono o di un simulatore già configurato per eseguire l'applicazione. Per maggiori informazioni, consulta la documentazione di Expo su come [eseguire su iOS](https://docs.expo.dev/workflow/ios-simulator/) e [Android](https://docs.expo.dev/workflow/android-studio-emulator/).
- Questo tutorial si concentrerà su iOS/Android. React Native può avere come target anche altre piattaforme che non saranno trattate in questo tutorial.
- Avrai anche bisogno di [Node.js](https://nodejs.org/en/download/) configurato sulla tua macchina.

Per prima cosa, scarica il template che abbiamo creato per questo tutorial.

```shell
npx degit chromaui/intro-storybook-react-native-template#main taskbox
```

Successivamente, installiamo le dipendenze ed eseguiamo l'app per assicurarci che tutto funzioni come previsto.

```shell
cd taskbox
yarn install
```

Ora che hai l'app, eseguiamola per assicurarci che tutto funzioni come previsto.

Puoi scegliere iOS o Android ed eseguire uno dei due per assicurarti che l'app funzioni.

```shell:clipboard=false

# Run the application on iOS
yarn ios

# Run the application on Android
yarn android

# Run Storybook on iOS
yarn storybook:ios

# Run Storybook on Android
yarn storybook:android
```

<div class="aside">

💡 In questo tutorial verrà utilizzato [Yarn](https://yarnpkg.com/). Se stai seguendo il tutorial ma non lo hai configurato, puoi facilmente sostituire i comandi con quelli del tuo package manager preferito (ad es. [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/)).

</div>

Quando esegui l'applicazione con `yarn ios` dovresti vedere questo renderizzato sul dispositivo:

<img src="/intro-to-storybook/react-native-expo-getting-started.png" alt="schermata iniziale di expo" height="600">

Quando esegui Storybook con `yarn storybook:ios` dovresti vedere questo:

<img src="/intro-to-storybook/react-native-hello-world.png" alt="interfaccia utente di Storybook" height="600">

## Come funziona

Una volta inizializzato, il template fornisce già la configurazione necessaria per iniziare a sviluppare la nostra applicazione con React Native. Prima di iniziare a costruire la nostra UI da zero, prendiamoci un momento per vedere come funziona Storybook all'interno di un'applicazione React Native e cosa cambia.

In React Native, Storybook è un componente che puoi renderizzare all'interno della tua app, al contrario delle altre versioni per framework in cui Storybook viene eseguito autonomamente.

Per questo motivo, abbiamo bisogno di un modo per passare dall'app a Storybook. Per farlo utilizziamo le variabili d'ambiente, che vedremo brevemente ora.

<div class="aside">

💡 Consulta la [documentazione di Expo](https://docs.expo.dev/guides/environment-variables/) per maggiori dettagli su come utilizzare le variabili d'ambiente.

</div>

Nel nostro progetto è presente un file di configurazione per Expo chiamato `app.config.js`; in questo file configuriamo cose come il nome della nostra app e le costanti che possiamo utilizzare in tutta l'app.

In questo file impostiamo la costante `storybookEnabled` al valore della variabile d'ambiente `STORYBOOK_ENABLED`, che vedremo a breve.

```js:title=app.config.js
export default ({ config }) => ({
  ...config,
  name: 'Storybook Tutorial Template',
  slug: 'storybook-tutorial-template',
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
});
```

Questo ci permette di accedere alla variabile `storybookEnabled` nella nostra app utilizzando il pacchetto `expo-constants`, e la usiamo per determinare se renderizzare Storybook o la tua app.

```jsx:title=App.js
import Constants from 'expo-constants';

function App() {
  // ... removed for brevity
}

// Default to rendering your app
let AppEntryPoint = App;

// Render Storybook if storybookEnabled is true
if (Constants.expoConfig.extra.storybookEnabled === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

export default AppEntryPoint;
```

Nel file `package.json`, vediamo alcuni nuovi script di Storybook. Li utilizziamo per passare quella variabile d'ambiente alla nostra applicazione, che sostituisce il punto di ingresso con l'interfaccia di Storybook utilizzando `cross-env` per assicurarsi che funzioni su tutte le piattaforme (Windows/macOS/Linux).

```json:title=package.json
{
  "scripts": {
    "storybook": "cross-env STORYBOOK_ENABLED='true' expo start",
    "storybook:ios": "cross-env STORYBOOK_ENABLED='true' expo ios",
    "storybook:android": "cross-env STORYBOOK_ENABLED='true' expo android"
  }
}
```

Qui è dove la nostra variabile d'ambiente `STORYBOOK_ENABLED` viene impostata su true, il che indica alla nostra app di renderizzare Storybook invece della nostra app.

<div class="aside">
💡 Esistono altri modi per configurare Storybook, questo è solo il modo più semplice per iniziare.
</div>

## Applica i cambiamenti

A questo punto è sicuro aggiungere i nostri file a un repository locale. Esegui i seguenti comandi per inizializzare un repository locale, aggiungi e applica le modifiche fatte fino ad ora.

```shell
git init
```

Seguito da:

```shell
git add .
```

Poi:

```shell
git commit -m "first commit"
```

E infine:

```shell
git branch -M main
```

Iniziamo a costruire il nostro primo componente!
