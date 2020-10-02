---
title: 'Storybook für React Tutorial'
tocTitle: 'Leg los'
description: 'Richte Storybook in deiner Entwicklungsumgebung ein'
commit: '8741257'
---

Storybook läuft parallel zu deiner App im Entwicklungs-Modus. Es hilft dir, UI-Komponenten unabhängig von Business-Logik und vom Kontext deiner App zu entwickeln. Diese Edition von "Lerne Storybook" ist für React; es gibt andere Editionen für [Vue](/vue/de/get-started) und [Angular](/angular/de/get-started).

![Storybook und deine App](/intro-to-storybook/storybook-relationship.jpg)

## React-Storybook einrichten

Es sind einige Schritte nötig, um den Build-Prozess in deiner Umgebung einzurichten. Lass uns zu Beginn [Create React App](https://github.com/facebook/create-react-app) (CRA) nutzen, um dein Build System inkl. [Storybook](https://storybook.js.org/) einzurichten und [Jest](https://facebook.github.io/jest/)-Tests in der von dir erstellten App zu ermöglichen. Dazu führen wir folgende Befehle aus:

```bash
# Create our application:
npx create-react-app taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

Wir können einfach feststellen, ob die verschiedenen Umgebungen deiner App richtig funktionieren:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
  HINWEIS: Wenn <code>yarn test</code> einen Fehler wirft, musst du evtl. <code>watchman</code> installieren, wie in <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">diesem Issue</a> empfohlen.
</div>

Unsere drei Frontend-App-Modalitäten: Automatisierte Tests (Jest), Komponenten-Entwicklung (Storybook) und die App selbst.

![3 Modalitäten](/intro-to-storybook/app-three-modalities.png)

Abhängig davon, in welchem Teil der App du gerade arbeitest, möchtest du evtl. eine oder mehrere hiervon gleichzeitig laufen lassen. Da unser Fokus auf der Erstellung einer einzelnen UI-Komponente liegt, lassen wir hier nur Storybook laufen.

## CSS wiederverwenden

In Taskbox werden Design-Elemente vom GraphQL- und React-Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858) wiederverwendet, sodass wir in diesem Tutorial kein CSS schreiben müssen. Wir kompilieren einfach das LESS zu einer einzigen CSS Datei und inkludieren es in unserer App. Kopiere [dieses kompilierte CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) und füge es in die Datei src/index.css ein, nach der Konvention von CRA.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Wenn du das Styling anpassen willst, findest du die LESS-Quelldateien im GitHub-Repo.
</div>

## Assets hinzufügen

Wir müssen noch die font- und icon-[Verzeichnisse](https://github.com/chromaui/learnstorybook-code/tree/master/public) im Ordner `public/` hinzufügen. Nachdem wir das Styling und die Assets hinzugefügt haben, sieht die App noch ein bisschen seltsam aus. Das ist OK. Noch müssen wir nicht an der App arbeiten. Wir legen jetzt los und bauen unsere erste Komponente!
