---
title: 'Deploy Storybook'
tocTitle: 'Deploy'
description: 'Deploy Storybook online met GitHub en Netlify'
---

In deze tutorial hebben we Storybook op onze development machine uitgevoerd. Misschien wil je dat Storybook ook met het team delen, vooral met de niet-technische leden. Gelukkig is het eenvoudig om Storybook online te deployen.

<div class="aside">
<strong>Heb je Chromatic testing eerder ingesteld?</strong>
<br/>
🎉 Je stories zijn al gedeployed! Chromatic indexeert je stories veilig online en volgt ze over branches en commits. Sla dit hoofdstuk over en ga naar de <a href="/react/en/conclusion">conclusie</a>.
</div>

## Exporteren als een statische app

Om Storybook te deployen, moeten we het eerst exporteren als een statische web-app. Deze functionaliteit is al ingebouwd in Storybook, we moeten het alleen activeren door een script toe te voegen aan `package.json`.

```javascript
// package.json

{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

Wanneer je nu Storybook buildt via `npm run build-storybook`, zal het een statisch Storybook outputten in de folder `storybook-static`.

## Continuous deploy

We willen de nieuwste versie van componenten delen wanneer we code pushen. Om dit te doen moeten we Storybook continu deployen. We zullen op GitHub en Netlify vertrouwen om onze statische site te deployen. We gebruiken het gratis Netlify-abonnement.

### GitHub

Eerst wil je Git instellen voor je project in de lokale folder. Als je hebt gevolgd met het vorige hoofdstuk over testing, ga dan naar het opzetten van een repository op GitHub.

```bash
$ git init
```

Voeg vervolgens bestanden toe aan de eerste commit.

```bash
$ git add .
```

Commit nu de bestanden.

```bash
$ git commit -m "taskbox UI"
```

Ga naar GitHub en stel [hier](https://github.com/new) een repository in. Noem je repo "taskbox".

![GitHub instelling](/intro-to-storybook/github-create-taskbox.png)

Kopieer in de nieuwe repo-setup de oorspronkelijke URL van de repo en voeg deze toe aan je git-project met dit commando:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Tenslotte, push de repo naar GitHub

```bash
$ git push -u origin main
```

### Netlify

Netlify heeft een continuous deployment service waarmee we Storybook kunnen deployen zonder onze eigen CI te hoeven configureren.

<div class="aside">
Als je CI in je bedrijf gebruikt, voeg je een deploy script toe aan je configuratie waarmee <code>storybook-static</code> wordt geüpload naar een statische hostingservice zoals S3.
</div>

[Maak een account aan op Netlify](https://app.netlify.com/start) en klik door naar “create site”.

![Netlify site maken](/intro-to-storybook/netlify-create-site.png)

Klik vervolgens op de GitHub-knop om Netlify met GitHub te verbinden. Hiermee heeft het toegang tot onze remote Taskbox-repo.

Selecteer nu de taskbox GitHub repo uit de lijst met opties.

![Netlify verbinden met repo](/intro-to-storybook/netlify-account-picker.png)

Configureer Netlify door te markeren welk build-commando moet worden uitgevoerd in de CI en in welke folder de statische site wordt ge-output. Kies voor branch `main`. De folder is `storybook-static`. Als build-commando gebruik je `yarn build-storybook`.

![Netlify instellingen](/intro-to-storybook/netlify-settings.png)

Dien het formulier in om de code te bouwen en te deployen op de `main` branch van de taskbox.

Wanneer dat is voltooid, zien we een bevestigingsbericht op Netlify met een link naar het online Taskbox Storybook. Als je mee aan het doen bent, moet je gedeployde Storybook online staan [zoals dit](https://clever-banach-415c03.netlify.com/).

![Netlify Storybook deploy](/intro-to-storybook/netlify-storybook-deploy.png)

We zijn klaar met het instellen van de continuous deployment van je Storybook! Nu kunnen we onze stories delen met teamgenoten via een link.

Dit is handig voor visuele beoordeling als onderdeel van het standaard app-ontwikkelingsproces of gewoon om te pronken met je werk 💅.
