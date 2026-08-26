---
title: 'Effettuare il deploy di Storybook'
tocTitle: 'Deploy'
description: 'Effettua il deploy di Storybook online con GitHub e Netlify'
---

Durante questo tutorial abbiamo eseguito Storybook sulla nostra macchina di sviluppo. Probabilmente vorrai anche condividere quello Storybook con il team, specialmente con i membri non tecnici. Per fortuna, è facile effettuare il deploy di Storybook online.

## Esportare come app statica

Per effettuare il deploy di Storybook, dobbiamo prima esportarlo come un'app web statica. Questa funzionalità è già integrata in Storybook ed Expo, dobbiamo solo attivarla aggiungendo uno script al `package.json`.

```json:clipboard=false
// package.json

{
  "scripts": {
    "build-static-webapp":"expo build:web"
  }
}
```

<div class="aside"><p>Al momento della scrittura di questo tutorial, il processo di build web di Expo è ancora in beta e potrebbe essere soggetto a modifiche in futuro.</p></div>

Ora, quando compili l'app con `yarn build-static-webapp`, verranno generati sia l'app che uno Storybook statico nella directory `web-build`.

## Deploy continuo

Vogliamo condividere la versione più recente dei componenti ogni volta che inviamo del codice. Per farlo, dobbiamo effettuare il deploy continuo di Storybook. Ci affideremo a GitHub e Netlify per effettuare il deploy del nostro sito statico. Utilizzeremo il piano gratuito di Netlify.

### GitHub

Quando il progetto è stato inizializzato con Expo, un repository locale è già stato configurato per te. A questo punto è sicuro aggiungere i file al primo commit.

```shell
git add .
```

Ora esegui il commit dei file.

```shell
git commit -m "taskbox UI"
```

### Configura un repository su GitHub

Vai su GitHub e configura un repository [qui](https://github.com/new). Chiama il tuo repo “taskbox”.

![Configurazione GitHub](/intro-to-storybook/github-create-taskbox.png)

Copia l'URL origin del tuo nuovo repo e aggiungilo al tuo progetto git con questo comando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Infine, invia il repo a GitHub

```shell
git push -u origin main
```

### Netlify

Netlify ha un servizio di deploy continuo integrato che ci permetterà di effettuare il deploy di Storybook senza dover configurare la nostra CI.

<div class="aside">
Se utilizzi la CI nella tua azienda, aggiungi uno script di deploy alla tua configurazione che carichi <code>web-build</code> su un servizio di hosting statico come S3.
</div>

[Crea un account su Netlify](https://app.netlify.com/start) e clicca su “create site”.

![Creazione del sito su Netlify](/intro-to-storybook/netlify-create-site.png)

Successivamente, clicca sul pulsante GitHub per connettere Netlify a GitHub. Questo gli permette di accedere al nostro repository remoto Taskbox.

Ora seleziona il repo GitHub taskbox dall'elenco delle opzioni.

![Connessione di Netlify al repo](/intro-to-storybook/netlify-account-picker.png)

Configura Netlify indicando quale comando di build eseguire nella sua CI e in quale directory viene generato il sito statico. Come branch scegli `main`. La directory è `web-build`. Come comando di build usa `yarn build-static-webapp`.

![Impostazioni di Netlify](/intro-to-storybook/netlify-settings-rn.png)

Invia il modulo per compilare ed effettuare il deploy del codice sul branch `main` di taskbox.

Una volta terminato, vedremo un messaggio di conferma su Netlify con un link allo Storybook di Taskbox online. Se stai seguendo il tutorial, il tuo Storybook di cui hai effettuato il deploy dovrebbe essere online [così](https://clever-banach-415c03.netlify.com/).

<div class="aside"><p>Se il tuo deploy fallisce indicando che la cartella non è presente, avvia una build locale, poi decommenta la cartella build dal file <code>.gitignore</code>.</p><p>Esegui il commit delle modifiche: la CI di Netlify dovrebbe quindi rilevarlo e riuscirà a compilare l'app insieme a Storybook.</p></div>

![Deploy di Storybook su Netlify](/intro-to-storybook/netlify-storybook-deploy.png)

Abbiamo terminato di configurare il deploy continuo del tuo Storybook! Ora possiamo condividere le nostre storie con i colleghi tramite un link.

È utile per la revisione visiva come parte del normale processo di sviluppo dell'app, oppure semplicemente per mostrare il proprio lavoro 💅.
