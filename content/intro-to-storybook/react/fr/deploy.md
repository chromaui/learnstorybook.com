---
title: 'Déployer Storybook'
tocTitle: 'Déploiement'
description: 'Découvrez comment déployer Storybook en ligne'
commit: '8652d73'
---

Tout au long de ce tutoriel, nous avons construit des composants sur notre machine de développement local. À un moment donné, nous devrons partager notre travail pour obtenir les réactions de l'équipe. Déployons Storybook en ligne pour aider nos coéquipiers à examiner la mise en œuvre de l'UI.

## Exporter sous forme d'application statique

Pour déployer Storybook, nous devons d'abord l'exporter sous la forme d'une application web statique. Cette fonctionnalité est déjà intégrée à Storybook et pré-configurée.

L'exécution de `yarn build-storybook` produira un Storybook statique dans le répertoire `storybook-static`, qui peut ensuite être déployé sur n'importe quel service d'hébergement de site statique.

## Publier Storybook

Ce tutoriel utilise <a href="https://www.chromatic.com/">Chromatic</a>, un service de publication gratuit réalisé par les mainteneurs de Storybook. Il nous permet de déployer et d'héberger notre Storybook en toute sécurité dans le cloud.

### Configurer un repo dans GitHub

Avant de commencer, notre code local doit se synchroniser avec un service de contrôle de version à distance. Lorsque notre projet a été initialisé dans le chapitre [Débuter](/intro-to-storybook/react/fr/get-started/), Create React App (CRA) a déjà crée un repo local pour nous. À ce stade, il est sans danger d'ajouter nos fichiers au premier commit.

Utilisez les commandes suivantes pour ajouter et faire un commit sur les modifications que nous avons effectuées jusqu'à présent.

```bash
$ git add .
```

Followed by:

```bash
$ git commit -m "taskbox UI"
```

Allez sur GitHub et créez un nouveau repo pour notre projet [ici](https://github.com/new). Nommez le repo "taskbox", comme notre projet local.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

Dans le nouveau repo, saisissez l'URL d'origine du repo et ajoutez-le à votre projet git avec cette commande :

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Enfin, transférer notre repo locale vers la repo à distance sur GitHub avec:

```bash
$ git push -u origin main
```

### Obtenir Chromatic

Ajoutez le paquet comme une dev dependency.

```bash
yarn add -D chromatic
```

Une fois le paquet installé, [connectez-vous à Chromatic](https://www.chromatic.com/start) avec votre compte GitHub (Chromatic ne vous demandera que des permissions légères). Ensuite, nous créerons un nouveau projet appelé "taskbox" et le synchroniserons avec le dépôt GithHub que nous avons mis en place.

Cliquez sur `Choisir le dépôt GitHub` sous collaborateurs et sélectionnez votre dépôt.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copiez l'unique `projet-token` qui a été généré pour votre projet. Puis exécutez-le, en émettant ce qui suit dans la ligne de commande, pour construire et déployer notre Storybook. Veillez à remplacer le `project-token` par votre token de votre projet.

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatique est en marche](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Lorsque vous aurez terminé, vous recevrez un lien `https://random-uuid.chromatic.com` vers votre Storybook publié. Partagez ce lien avec votre équipe pour obtenir des avis.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

Hourra! Nous avons publié Storybook avec une seule commande, mais l'exécution manuelle d'une commande chaque fois que nous voulons avoir un retour sur la mise en œuvre de l'UI est répétitive. L'idéal serait de publier la dernière version des composants chaque fois que nous envoyons le code sur le repo Github. Nous devrons déployer Storybook en continu.

## Déploiement continu avec Chromatic

Maintenant que notre projet est hébergé dans un dépôt GitHub, nous pouvons utiliser un service d'intégration continue (CI) pour déployer notre Storybook automatiquement. [GitHub Actions](https://github.com/features/actions) est un service d'intégration continue gratuit intégré à GitHub qui facilite la publication automatique.

### Ajouter une action GitHub pour déployer Storybook

Dans le dossier racine de notre projet, créez un nouveau répertoire appelé `.github` puis créez un autre répertoire `workflows` à l'intérieur de celui-ci.

Créez un nouveau fichier appelé `chromatic.yml` comme celui ci-dessous. Remplacez ce fichier par votre token de projet pour changer `project-token`.

```yaml
# .github/workflows/chromatic.yml

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
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/en/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>Pour des raisons de brièveté <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">les secrets de GitHub</a> n'ont pas été mentionnés. Les secrets sont des variables d'environnement sécurisées fournies par GitHub afin que vous n'ayez pas besoin de coder en dur le <code>projet-token</code>.</p></div>

### Commit l'action

Dans la ligne de commande, lancez la commande suivante pour ajouter les modifications qui ont été effectuées :

```bash
git add .
```

Faite un commit:

```bash
git commit -m "GitHub action setup"
```

Enfin, les envoyer vers le repo à distance avec :

```bash
git push origin main
```

Une fois que vous avez mis en place l'action GitHub. Votre Storybook sera déployé sur Chromatic chaque fois que vous enverrez du code. Vous pouvez trouver tous les Storybook publiés sur l'écran de compilation de votre projet dans Chromatic.

![Tableau de bord chromatique de l'utilisateur](/intro-to-storybook/chromatic-user-dashboard.png)

Cliquez sur la dernière compilation, elle doit être celle du haut.

Ensuite, cliquez sur le bouton `View Storybook` pour voir la dernière version de votre Storybook.

![Lien Storybook sur Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Utilisez le lien et partagez-le avec les membres de votre équipe. Ceci est utile dans le cadre du processus de développement standard d'une application ou simplement pour montrer son travail 💅.
