---
title: 'Déployer Storybook'
tocTitle: 'Déployer'
description: 'Déployer Storybook en ligne avvec GitHub et Netlify'
commit: '809a7fd'
---

Tout au long de ce tutoriel, nous avons construit des composants sur notre machine de développement local. À un moment donné, nous devrons partager notre travail pour obtenir les commentaires de l'équipe. Déployons Storybook en ligne pour aider les coéquipiers à examiner l'interface utilisateur.

## Exportation en tant qu'application statique

Pour déployer Storybook, nous commençons premièrement par l'exporter comme une application web statique. Cette fonctionnalité est déjà intégrée à Storybook and pré-configurée.

L'exécution de `yarn build-storybook` produira un Storybook statique dans le répertoire `storybook-static`, qui peut ensuite être déployé sur n'importe quel service d'hébergement de site statique.

## Publier Storybook

Ce tutoriel utilise <a href="https://www.chromatic.com/">Chromatic</a>, un service de publication gratuit créé par les responsables de Storybook. Cela nous permet de déployer et d'héberger notre Storybook en toute sécurité dans le cloud.

### Configurez un référentiel GitHub

Avant de commencer, notre code local doit se synchroniser avec un service de contrôle de version distant. Lorsque notre projet a été initialisé dans le chapitre [Prise en main](/vue/fr/get-started), nous avons déjà initialisé un référentiel local. À ce stade, nous avons déjà un ensemble de commits que nous pouvons pousser vers un référentiel distant.

Allez sur GitHub et créez un nouveau référentiel pour notre projet [ici](https://github.com/new). Nommez votre référentiel “taskbox”, identique à notre projet local.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

Dans le nouveau référentiel, copiez l'URL d'origin du référentiel et ajoutez-la à votre projet git avec cette commande :

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Et pour finir pousser vos modifications sur le référentiel GitHub

```bash
$ git push -u origin main
```

### Obtenir Chromatic

Ajoutez le paquet comme une dépendance de développement.

```bash
yarn add -D chromatic
```

Une fois le package installé, [connectez-vous à Chromatic](https://www.chromatic.com/start) avec votre compte GitHub (Chromatic ne demandera que des autorisations légères). Ensuite, nous allons créer un nouveau projet appelé "taskbox" et le synchroniser avec le référentiel GithHub que nous avons configuré.

Cliquez sur `Choisir le dépôt GitHub` sous collaborateurs et sélectionnez votre dépôt.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copiez le `project-token` unique qui a été généré pour votre projet. Ensuite, exécutez-le, en émettant ce qui suit dans la ligne de commande, pour créer et déployer notre Storybook. Assurez-vous de remplacer le `project-token` par votre jeton de projet.

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Une fois terminé, vous obtiendrez un lien `https://random-uuid.chromatic.com` vers votre Storybook publié. Partagez le lien avec votre équipe pour obtenir des commentaires.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

Hourra ! Nous avons publié Storybook avec une seule commande, mais exécuter manuellement à chaque fois que nous voulons obtenir des commentaires sur l'implémentation de l'interface utilisateur est répétitif. Idéalement, nous publierions la dernière version des composants chaque fois que nous pousserons du code. Nous devrons déployer continuellement Storybook.

## Déploiement continu avec Chromatic

Maintenant que notre projet est hébergé dans un référentiel GitHub, nous pouvons utiliser un service d'intégration continue (CI) pour déployer automatiquement notre Storybook. [GitHub Actions](https://github.com/features/actions) est un service CI gratuit intégré à GitHub qui facilite la publication automatique.

### Ajouter une GitHub Action pour déployer Storybook

Dans le dossier racine de notre projet, créez un nouveau répertoire appelé `.github` puis créez un autre répertoire de `workflows` à l'intérieur de celui-ci.

Créez un nouveau fichier appelé `chromatic.yml` comme celui ci-dessous. Remplacez pour changer le `project-token` par votre jeton de projet.

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
          #👇 Chromatic projectToken, see https://www.learnstorybook.com/intro-to-storybook/vue/en/deploy/ to obtain it
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">
<p>💡 Par souci de concision <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">, les secrets GitHub</a> n'ont pas été mentionnés. Les secrets sont des variables d'environnement sécurisées fournies par GitHub afin que vous n'ayez pas besoin de coder en dur le <code>project-token</code>.</p></div>

### Valider l'action

Dans la ligne de commande, exécutez la commande suivante pour ajouter les modifications apportées :

```bash
git add .
```

Puis validez-les en exécutant :

```bash
git commit -m "GitHub action setup"
```

Enfin, poussez-les vers le référentiel distant avec :

```bash
git push origin main
```

Une fois que vous avez configuré l'action GitHub. Votre Storybook sera déployé sur Chromatic chaque fois que vous poussez du code. Vous pouvez trouver tous les Storybook de votre projet publiés dans Chromatic.

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

Cliquez sur la dernière version, elle devrait être celle du haut.

Ensuite, cliquez sur le bouton `Afficher Storybook` pour voir la dernière version de votre Storybook.

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Utilisez le lien et partagez-le avec les membres de votre équipe. Ceci est utile dans le cadre du processus de développement d'application standard ou simplement pour montrer le travail 💅.
