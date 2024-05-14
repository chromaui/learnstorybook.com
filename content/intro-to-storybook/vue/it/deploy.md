---
title: 'Effettuare il deploy di Storybook'
tocTitle: 'Deploy'
description: 'Impara come effettuare il deploy di Storybook online'
commit: '4b1cd77'
---

Durante questo tutorial, abbiamo costruito componenti sulla nostra macchina di sviluppo locale. Ad un certo punto, avremo bisogno di condividere il nostro lavoro per ottenere feedback dal team. Effettuiamo il deploy di Storybook online per aiutare i membri del team a revisionare l'implementazione dell'UI.

## Esportare come app statica

Per effettuare il deploy di Storybook, dobbiamo prima esportarlo come un'app web statica. Questa funzionalità è già integrata in Storybook e preconfigurata.

Eseguendo `yarn build-storybook` verrà generato un Storybook statico nella cartella `storybook-static`, che può poi essere effettuato il deploy su qualsiasi servizio di hosting per siti statici.

## Pubblicare Storybook

Questo tutorial utilizza <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, un servizio di pubblicazione gratuito realizzato dai manutentori di Storybook. Ci permette di effettuare il deploy e ospitare il nostro Storybook in modo sicuro e protetto nel cloud.

### Configura un repository su GitHub

Prima di iniziare, il nostro codice locale deve essere sincronizzato con un servizio remoto di controllo versione. Quando abbiamo impostato il nostro progetto nel [capitolo di introduzione](/intro-to-storybook/vue/it/get-started), abbiamo già inizializzato un repository locale. A questo punto, abbiamo già un set di commit che possiamo inviare a un repository remoto.

Vai su GitHub e crea un nuovo repository per il nostro progetto [qui](https://github.com/new). Nominare il repo "taskbox", come il nostro progetto locale.

![Configurazione GitHub](/intro-to-storybook/github-create-taskbox.png)

Nel nuovo repo, prendi l'URL origin del repository e aggiungilo al tuo progetto git con questo comando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Infine, invia il nostro repository locale al repository remoto su GitHub con:

```shell
git push -u origin main
```

### Get Chromatic

Aggiungi il pacchetto come dipendenza di sviluppo.

```shell
yarn add -D chromatic
```

Una volta installato il pacchetto, [accedi a Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) con il tuo account GitHub (Chromatic chiederà solo permessi leggeri), poi creeremo un nuovo progetto chiamato "taskbox" e lo sincronizzeremo con il repository GitHub che abbiamo configurato.

Clicca su `Scegli repo GitHub` sotto la sezione collaboratori e seleziona il tuo repo.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copia l'unico `project-token` che è stato generato per il tuo progetto. Poi eseguilo emettendo il seguente comando nella riga di comando per costruire ed effettuare il deploy del nostro Storybook. Assicurati di sostituire `project-token` con il tuo token di progetto.

```shell
yarn chromatic --project-token=<project-token>
```

![Esecuzione di Chromatic](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Quando avrai terminato, otterrai un link `https://random-uuid.chromatic.com` al tuo Storybook pubblicato. Condividi il link con il tuo team per ottenere feedback.

![Storybook pubblicato con il pacchetto chromatic](/intro-to-storybook/chromatic-manual-storybook-deploy.png)

Evviva! Abbiamo pubblicato Storybook con un solo comando, ma eseguire manualmente un comando ogni volta che vogliamo avere un feedback sull'implementazione dell'UI è ripetitivo. Idealmente, pubblicheremmo la versione più recente dei componenti ogni volta che inviamo del codice. Avremo bisogno di effettuare il deploy continuo di Storybook.

## Deploy continuo con Chromatic

Ora che abbiamo ospitato il nostro progetto in un repository GitHub, possiamo utilizzare un servizio di integrazione continua (CI) per effettuare automaticamente il deploy del nostro Storybook. [GitHub Actions](https://github.com/features/actions) è un servizio CI gratuito integrato in GitHub che rende la pubblicazione automatica facile.

### Aggiungi una GitHub Action per effettuare il deploy di Storybook

Nella cartella radice del nostro progetto, crea una nuova directory chiamata `.github`, poi crea un'altra directory `workflows` al suo interno.

Crea un nuovo file chiamato `chromatic.yml` come quello di seguito.

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/vue/en/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>💡 Per brevità, non sono stati menzionati i <a href=" https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository ">segreti di GitHub</a>. I segreti sono variabili d'ambiente sicure fornite da GitHub in modo da non dover inserire direttamente nel codice il <code>project-token</code>.</p></div>

### Esegui il commit dell'azione

Nella riga di comando, emetti il seguente comando per aggiungere le modifiche che hai effettuato:

```shell
git add .
```

Poi esegui il commit scrivendo:

```shell
git commit -m "GitHub action setup"
```

Infine, inviali al repository remoto con:

```shell
git push origin main
```

Una volta configurata l'azione di GitHub, il tuo Storybook verrà effettuato il deploy su Chromatic ogni volta che invii del codice. Puoi trovare tutti gli Storybook pubblicati nella schermata di build del tuo progetto su Chromatic.

![Dashboard utente di Chromatic](/intro-to-storybook/chromatic-user-dashboard.png)

Clicca sulla build più recente. Dovrebbe essere quella in cima alla lista.

Poi, clicca sul pulsante `Visualizza Storybook` per vedere la versione più recente del tuo Storybook.

![Link a Storybook su Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Usa il link e condividilo con i membri del tuo team. È utile come parte del processo standard di sviluppo dell'app o semplicemente per mostrare il lavoro 💅.
