---
title: 'Déployer Storybook'
tocTitle: 'Déployer'
description: 'Déployer Storybook en ligne avvec GitHub et Netlify'
commit: 'd32196c'
---

Dans ce tutoriel, nous avons exécuté Storybook sur notre machine de développement. Vous pouvez également partager ce Storybook avec l'équipe, en particulier avec les membres non techniques. Heureusement, il est facile de déployer Storybook en ligne.

<div class="aside">
<strong>Avez-vous configuré les tests Chromatic plus tôt ?</strong>
<br/>
🎉 Vos histoires sont déjà déployées ! Chromatic indexe en tout sécurité vos histoires en lignes et les suit à travers les branches et les commits. Sautez ce chapitre et allez à la <a href="/intro-to-storybook/vue/fr/conclusion">conclusion</a>.
</div>

## Exportation en tant qu'application statique

Pour déployer Storybook, nous commençons premièrement par l'exporter comme une application web statique. Cette fonctionnalité est déjà intégrée dans Storybook, nous devons juste la changer comme nous l'avons fait auparavant lorsque le projet a été initialisé dans la [section de démarrage](/intro-to-storybook/vue/fr/get-started/).

```json::clipboard=false
{
  "scripts": {
   "build-storybook": "build-storybook -s public"
  }
}
```

Maintenant, lorsque vous exécutez Storybook via `yarn build-storybook`, cela vous créera votre application web statique dans le répertoire `storybook-static`.

## Déploiement continu

Nous voulons partager la dernière version des composants dès lors que nous poussons des développements. Pour faire cela, nous devons déployer en continu Storybook. Nous comptons sur GitHub and Netlify pour déployer notre site statique. Nous utiliserons le plan gratuit de Netlify.

### GitHub

Si vous suivez le chapitre de test précédent, passez à la fconfiguration d'un référentiel sur GitHub.

Lorsque le projet a été initialisée avec le Vue CLI, un référentiel local était déjà configuré pour vous. A ce stade, il est sûr d'ajouter les fichiers au premier commit.

```shell
git add .
```

Maintenant, commitez les fichiers.

```shell
git commit -m "taskbox UI"
```

### Configurez un référentiel GitHub

Allez sur GitHub et configurez un référentiel [ici](https://github.com/new). Nommez votre repo “taskbox”.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

Dans la nouvelle configuration du repo, copiez l'URL d'origin du repo et ajoutez-la à votre projet git avec cette commande :

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Et pour finir pousser vos modifications sur le repo GitHub

```shell
git push -u origin master
```

### Netlify

Netlify possède un service de déploiement continu intégré qui nous permettra de déployer storybook sans avoir à configurer notre propre CI.

<div class="aside">
Si vous utilisez CI dans votre entreprise, ajoutez un script de déploiement à votre configuration qui télécharge <code>storybook-static</code> vers un service d'hébergement statique comme S3.
</div>

[Créer un compte sur Netlify](https://app.netlify.com/start) et cloquez sur "créer un site".

![Créer un site netlify](/intro-to-storybook/netlify-create-site.png)

Ensuite, cliquez sur le bouton GitHub pour connecter Netlify sur GitHub. Cela lui permet d'accéder à notre repo taskbox.

Maintenant, sélectionnez le repo GitHub taskbox à partir de la liste des options.

![Connectez Netlify à votre repo](/intro-to-storybook/netlify-account-picker.png)

Configurez Netlify en surlignant la commande de build à construire dans son CI et le répertoire dans lequel le site statique est généré. Pour la branche, choisissez `master`. Le répertoire est `storybook-static`. La commande de build utilise `yarn build-storybook`.

![Paramètres Netlify](/intro-to-storybook/netlify-settings.png)

<div class="aside"><p>Si votre déploiement échoue avec Netlify, ajoutez l'option <a href="https://storybook.js.org/docs/vue/api/cli-options#build-storybookk">--quiet </a>  à votre script <code>build-storybook</code>.</p></div>

Soumettez le formulaire pour construire et déployer le code de la branche `master` du repo taskbox.

Une fois terminé, nous verrons un message de confirmation sur Netlify avec un lien vers le Storybook taskbox en ligne. Si vous suivez le tutoriel, votre Storybook déployé devrait être en ligne [comme cela](https://clever-banach-415c03.netlify.app/).

![Déploiement du Storybook sur Netlify](/intro-to-storybook/netlify-storybook-deploy.png)

Nous avons terminé la configuration du déploiement continu de votre Storybook ! Maintenant, nous pouvons partager nos stories avec nos coéquipiers avec un lien.

Cela est utile pour un revue visuelle d'une partie du développement de l'application ou simplement pour montrer le travail 💅.
