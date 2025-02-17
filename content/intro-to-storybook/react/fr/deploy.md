---
title: 'Déployer Storybook'
tocTitle: 'Déploiement'
description: 'Découvrez comment déployer Storybook en ligne'
commit: '4531813'
---

Tout au long de ce tutoriel, nous avons construit des composants sur notre machine de développement en local. À un moment donné, nous devrons partager notre travail pour avoir des retours de l'équipe. Déployons Storybook en ligne pour aider nos coéquipiers à examiner l'implémentation de l'interface utilisateur.

## Exporter en tant qu'application statique

Pour déployer Storybook, nous devons d'abord l'exporter sous la forme d'une application web statique. Cette fonctionnalité est déjà intégrée à Storybook et pré-configurée.

L'exécution de `yarn build-storybook` produira un Storybook statique dans le répertoire `storybook-static`, qui peut ensuite être déployé sur n'importe quel service d'hébergement de site statique.

## Publier Storybook

Ce tutoriel utilise [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un service de publication gratuit réalisé par les mainteneurs de Storybook. Il nous permet de déployer et d'héberger notre Storybook en toute sécurité dans le cloud.

### Configurer un dépôt dans GitHub

Avant de commencer, notre code local doit se synchroniser avec un service de contrôle de version à distance. Lorsque notre projet a été configuré dans le chapitre [Débuter](/intro-to-storybook/react/fr/get-started/), nous avons initialisé un dépôt en local. À ce stade, nous avons déja quelques commits que nous pouvons pousser sur GitHub.

Aller sur GitHub and crééz un nouveau dépôt pour votre projet [ici](https://github.com/new). Nommer le dépôt “taskbox”, comme votre projet en local.

![Configuration de GitHub](/intro-to-storybook/github-create-taskbox.png)

Récupérer l'URL du dépôt et ajouter le dans votre configuration de projet avec la commande suivante:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Enfin, poussez votre projet en local sur GitHub avec:

```shell
git push -u origin main
```

### Obtenir Chromatic

Ajoutez le paquet comme une dépendance de type développement.

```shell
yarn add -D chromatic
```

Une fois le paquet installé, [connectez-vous à Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) avec votre compte GitHub (Chromatic ne vous demandera que des permissions légères). Ensuite, crééons un nouveau projet appelé "taskbox" et synchronisons le avec le dépôt GitHub que nous avons mis en place.

Cliquez sur `Choisir le dépôt GitHub` sous collaborateurs et sélectionnez votre dépôt.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copiez l'unique `projet-token` qui a été généré pour votre projet. Puis exécutez-le en émettant ce qui suit dans la ligne de commande, pour construire et déployer notre Storybook. Veillez à remplacer le `project-token` par votre token de votre projet.

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic lancé](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Lorsque vous aurez terminé, vous recevrez un lien `https://random-uuid.chromatic.com` vers votre Storybook publié. Partagez ce lien avec votre équipe pour obtenir des retours.

![Storybook deployé avec chromatic](/intro-to-storybook/chromatic-manual-storybook-deploy-6-4.png)

Magnifique! Nous avons publié Storybook avec une seule commande, mais l'exécution manuelle d'une commande chaque fois que nous voulons avoir un retour sur la mise en œuvre de l'UI est répétitive. L'idéal serait de publier la dernière version des composants chaque fois que nous ajoutons du code sur le dépôt GitHub. Nous devons déployer Storybook en continu.

## Déploiement continu avec Chromatic

Maintenant que notre projet est hébergé sur un dépôt GitHub, nous pouvons utiliser un service d'intégration continue (CI) pour déployer notre Storybook automatiquement. [GitHub Actions](https://github.com/features/actions) est un service d'intégration continue gratuit intégré à GitHub qui facilite la publication automatique.

### Ajouter une action GitHub pour déployer Storybook

Dans le dossier racine de notre projet, créez un nouveau répertoire appelé `.github` puis créez un autre répertoire `workflows` à l'intérieur de celui-ci.

Créez un nouveau fichier appelé `chromatic.yml` comme celui ci-dessous.

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  chromatic:
    name: 'Run Chromatic'
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@latest
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/fr/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">

💡 Pour des raisons de sécurité les [secrets GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) n'ont pas été mentionnés. Les secrets sont des variables d'environnement sécurisées fournies par GitHub afin que vous n'ayez pas besoin de coder directement le `project-token`.

</div>

### Commiter l'action

Sur un terminal en ligne de commande, lancez la commande suivante pour ajouter les modifications qui ont été effectuées:

```shell
git add .
```

Faites un commit:

```shell
git commit -m "GitHub action setup"
```

Enfin, envoyer les vers Github:

```shell
git push origin main
```

Une fois que vous avez mis en place l'action GitHub, votre Storybook sera déployé sur Chromatic chaque fois que vous enverrez du code. Vous pouvez trouver tous les Storybook publiés sur l'écran de compilation de votre projet dans Chromatic.

![Tableau de bord chromatique de l'utilisateur](/intro-to-storybook/chromatic-user-dashboard.png)

Cliquez sur le dernier build, cela doit être celui du haut.

Ensuite, cliquez sur le bouton `View Storybook` pour voir la dernière version de votre Storybook.

![Lien Storybook sur Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Utilisez le lien et partagez-le avec les membres de votre équipe. Ceci est utile dans le cadre du processus de développement standard d'une application ou simplement pour montrer son travail 💅.
