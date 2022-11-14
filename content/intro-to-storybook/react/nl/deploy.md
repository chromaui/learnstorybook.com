---
title: 'Deploy Storybook'
tocTitle: 'Deploy'
description: 'Leren hoe we Storybook online deployen'
---

Doorheen deze tutorial hebben we componenten lokaal op onze development machine gebouwd. Er komt een punt waar we ons werk willen delen met het team om zo feedback te verkrijgen. Laten we Storybook online deployen om ons team te helpen met het reviewen van de UI implementatie.

## Exporteren als een statische app

Om Storybook te deployen, moeten we het eerst exporteren als een statische web-app. Deze functionaliteit is ingebouwd in Storybook en alreeds geconfigureerd.

`yarn build-storybook` uitvoeren, zal een static Storybook in de `storybook-static` folder opleveren, dewelke dan kan gedeployed worden naar een static site hosting service naar keuze.

## Storybook publiceren

Deze tutorial gebruikt <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, een gratis dienst gemaakt door de mensen die Storybook onderhouden. Het laat ons toe om Storybook veilig in de cloud te deployen.

### Een GitHub repository opzetten

Voor we beginnen, moet onze lokale code synchroniseren met een remote versiecontrolesysteem. Toen we ons project initialiseerden in het [Get started hoofdstuk](/intro-to-storybook/react/nl/get-started), had Create React App (CRA) alreeds een lokale repository voor ons gemaakt. Op dit moment is het oké om onze bestanden toe te voegen aan de eerste commit.

Voor de volgende commando's uit om de veranderingen die we tot dusver hebben gemaakt toe te voegen en te committen.

```shell
git add .
```

Ga naar GitHub om [hier](https://github.com/new) een nieuwe repository voor ons project te creëren. Noem de repo “taskbox”, hetzelfde als ons lokaal project.

![GitHub instelling](/intro-to-storybook/github-create-taskbox.png)

Kopieer in de nieuwe repo-setup de oorspronkelijke URL van de repo en voeg deze toe aan je git-project met dit commando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Tenslotte, push de lokale repo naar de remote repo op GitHub met het volgende:

```shell
git push -u origin main
```

### Voeg Chromatic toe

Voeg de package toe als een development dependency.

```shell
yarn add -D chromatic
```

Eenmaal de package is geïnstalleerd, [log je in op Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) met je Github account (Chromatic zal je voor enkele niet-intrusieve permissies vragen). Dan creëren we ons nieuw project, genoemd "taskbox" en synchroniseren we het met de Github repository die we hebben opgezet.

Klik `Choose Github repo` onder "collaborators" en selecteer je repo.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Kopieer de unieke `project-token` die gegenereerd werd voor je project. Voor het dan uit door het volgende commando uit te voeren op de command line, om zo onze Storybook te bouwen en te deployen. Denk er zeker aan om `project-token` te vervangen door jouw projecttoken.

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic uitvoeren](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Wanneer je klaar bent, zal je een link `https://random-uuid.chromatic.com` verkrijgen naar je gepubliceerde Storybook. Deel de link met je team om feedback te verkrijgen.

### Voeg een GitHub Action toe om Storybook te deployen

Creër een nieuwe folder in de root folder van ons project, genoemd `.github`. Maak hierna nog een `workflows` directory aan binnen deze directory.

Maak een nieuw bestand genoemd `chromatic.yml` aan zoals hierbeneden. Vervang `project-token` met je eigen projecttoken.

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
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/nl/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>Om het korter te houden zijn <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> niet vernoemd. Secrets zijn secure environment variabelen die door Github voorzien zijn zodat je de <code>project-token</code>.</p></div> niet moet hardcoden.

### Commit de action

Voer het volgende commando uit op de commandline uit om de veranderingen die gedaan zijn toe te voegen:

```shell
git add .
```

Commit ze dan door het volgende uit te voeren:

```shell
git commit -m "GitHub action setup"
```

Tenslotte push je ze naar de remote repository met het volgende commando:

```shell
git push origin main
```

Eenmaal je de Github action hebt opgezet, zal je Storybook gedeployed worden naar Chromatic elke keer je code pushed. Je kan all de gepubliceerde Storybook's vinden op je project zijn "build" scherm in Chromatic.

![Chromatic gebruikersdashboard](/intro-to-storybook/chromatic-user-dashboard.png)

Klik op de laatste build, degene die bovenaan staat.

Hierna klik je op de `View Storybook` knop om de laatste versie van je Storybook te bekijken,

![Storybook link op Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Gebruik de link en deel deze met je team. Dit is nuttig als deel van ons standaard app development process of simpelweg om ons werk te laten zien 💅.
