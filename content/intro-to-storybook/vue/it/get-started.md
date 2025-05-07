---
title: 'Tutorial di Storybook per Vue'
tocTitle: 'Inizia'
description: 'Configura Storybook nel tuo ambiente di sviluppo'
commit: 'e2984d1'
---

Storybook funziona in parallelo con la tua app in modalità di sviluppo. Ti aiuta a costruire componenti dell'interfaccia utente isolati dalla logica aziendale e dal contesto della tua app. Questa edizione del tutorial Intro to Storybook è per Vue; esistono altre edizioni per [React](/intro-to-storybook/react/it/get-started), [React Native](/intro-to-storybook/react-native/en/get-started/), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started).

![Storybook e la tua app](/intro-to-storybook/storybook-relationship.jpg)

## Configura Storybook per Vue

Dovremo seguire alcuni passi per configurare il processo di build nel nostro ambiente. Per iniziare, vogliamo utilizzare [degit](https://github.com/Rich-Harris/degit) per configurare il nostro sistema di build. Utilizzando questo pacchetto, puoi scaricare dei "modelli" (applicazioni parzialmente costruite con alcune configurazioni predefinite) per aiutarti a velocizzare il tuo flusso di lavoro di sviluppo.

Esegui i seguenti comandi:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 Questo modello contiene gli stili necessari, le risorse e le configurazioni essenziali per questa versione del tutorial.
</div>

Ora possiamo rapidamente verificare che i vari ambienti della nostra applicazione stiano funzionando correttamente:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

Le principali modalità della nostra app frontend sono: sviluppo di componenti (Storybook) e l'applicazione stessa.

![Principali modalità](/intro-to-storybook/app-main-modalities-vue.png)

A seconda della parte dell'app su cui stai lavorando, potresti voler eseguire uno o più di questi contemporaneamente. Dato che il nostro focus attuale è la creazione di un singolo componente dell'interfaccia utente, continueremo con l'esecuzione di Storybook.

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
