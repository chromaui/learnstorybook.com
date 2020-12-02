---
title: 'Tutorial React per Storybook'
tocTitle: 'Per iniziare'
description: 'Inizializza Storybook nel tuo ambiente di sviluppo'
commit: 'b935904'
---

Storybook gira parallelamente alla tua applicazione in modalità sviluppo. Ti aiuta a costruire i componenti della UI isolati dalla logica applicativa e dal contesto della tua applicazione. Questa edizione di Learn Storybook è per React; altre edizioni esistono per [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) e [Svelte](/svelte/en/get-started).

![Storybook e la tua applicazione](/intro-to-storybook/storybook-relationship.jpg)

## Inizializza React Storybook

Abbiamo bisogno di seguire alcuni passaggi al fine di ottenere l'inizializzazione del tuo ambiente. Per iniziare, vogliamo usare [Create React App](https://github.com/facebook/create-react-app) (CRA) per inizializzare il nostro sistema, e abilitare [Storybook](https://storybook.js.org/) e i test [Jest](https://facebook.github.io/jest/) nella nostra applicazione. Esegui i seguenti comandi:

```bash
# Crea la nostra applicazione:
npx create-react-app taskbox

cd taskbox

# Aggiungi Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
A causa di un recente aggiornamento di React e CRA, per poter eseguire Storybook senza problemi, dovrai effettuare il downgrade del pacchetto <code>react-scripts</code> alla precedente versione. La versione 3.4.3 per entrambi i pacchetti funzionerà correttamente. Anche <code>React</code> e <code>ReactDOM</code> richiederanno un downgrade alla versione precedente. La versione <code>16.14.0</code> di entrambi i pacchetti lavorerà correttamente.
<p>Vedi la documentazione ufficiale di Yarn su come <a href="https://yarnpkg.com/cli/add">aggiungere</a> e <a href="https://yarnpkg.com/cli/remove">rimuovere</a> pacchetti.</p>
</div>

<div class="aside">
In questa versione del tutorial, useremo <code>yarn</code> per eseguire la maggior parte dei comandi. 
Se hai installato Yarn, ma preferisci usare <code>npm</code>, non preoccuparti, potrai comunque seguire il tutorial senza problemi. Basta aggiungere il flag <code>--use-npm</code> al primo comando sopraindicato e sia CRA che Storybook saranno inizializzati con questo strumento. Inoltre mentre avanzi nel tutorial, non dimenticare di adattare i comandi utilizzati con la loro controparte <code>npm</code>.
</div>

Andiamo a verificare velocemente che i vari ambienti della nostra applicazione funzionino correttamente:

```bash
# Esegui il test runner (Jest) in un terminale:
yarn test --watchAll

# Avvia il component explorer sulla porta 6006:
yarn storybook

# Avvia l'applicazione frontend sulla porta 3000:
yarn start
```

<div class="aside"> 
Avrai notato che abbiamo aggiunto il flag <code>--watchAll</code> al nostro comando di test, non preoccuparti è voluto, questo piccolo cambiamento ci assicurerà che tutti i test siano eseguiti e ogni cosa sia a posto con la nostra applicazione. Mentre procedi in questo tutorial ti verranno presentati diversi scenari di test, quindi probabilmente potresti voler considerare di aggiungere il flag nello script test del tuo <code>package.json</code> per assicurarti che l'intera suite di test venga eseguita.
</div>

Le tre modalità di applicazione frontend: test automatici (Jest), sviluppo di componenti (Storybook), e l'applicazione stessa.

![3 modalità](/intro-to-storybook/app-three-modalities.png)

A seconda con quale parte dell'applicazione stai lavorando, potresti voler eseguire una o più di queste modalità simultaneamente. Siccome il nostro attuale obbiettivo è quello di creare un singolo componente di UI, inizieremo con l'eseguire Storybook.

## Riusa i CSS

Taskbox riusa gli elementi di progettazione dal Tutorial GraphQL e React [applicazione di esempio](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), così non dovremo scrivere i CSS in questo tutorial. Copia e incolla [questo CSS compilato](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) nel file `src/index.css`.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Se desideri modificare lo stile, i file LESS sorgenti sono disponibili <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">qui</a>.
</div>

## Aggiungi risorse

Per far combaciare il design previsto, dovrai scaricare sia le cartelle dei font che delle icone e piazzare il loro contenuto dentro la tua cartella `public`. Inserisci i seguenti comandi nel tuo terminale:

```bash
npx degit chromaui/learnstorybook-code/public/font public/font
npx degit chromaui/learnstorybook-code/public/icon public/icon
```

<div class="aside">
Andiamo ad usare <a href="https://github.com/Rich-Harris/degit">degit</a> per scaricare le cartelle da GitHub. Se vuoi farlo manualmente, puoi prelevare le cartelle <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">qui</a>.
</div>

Dopo aver aggiunto lo stile e le risorse, l'applicazione sarà visualizzata in un modo un po' strano. Va tutto bene. Non stiamo lavorando sull'applicazione sin da subito. Stiamo iniziando a costruire il nostro primo componente!
