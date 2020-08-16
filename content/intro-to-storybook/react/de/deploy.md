---
title: 'Storybook deployen'
tocTitle: 'Deployment'
description: 'Deploye Storybook online mit GitHub und Netlify'
---

Bisher haben wir Storybook in diesem Tutorial immer auf unserer Entwickler-Maschine laufen lassen. Wahrscheinlich möchtest du das Storybook auch mit deinem Team teilen, insbesondere mit Nicht-Technikern. Glücklicherweise lässt sich Storybook ziemlich einfach online deployen.

<div class="aside">
<strong>Hast du bereits Tests mit Chromatic eingerichtet?</strong>
<br/>
🎉 Deine Stories sind bereits deployed! Chromatic indiziert deine Stories auf sichere Weise online und verfolgt ihren Stand über Branches und Commits hinweg. Überspringe dieses Kapitel und gehe direkt zum <a href="/react/de/conclusion">Fazit</a>.
</div>

## Eine statische App exportieren

Um Storybook zu deployen, müssen wir zunächst eine statische Web-App exportieren. Die Funktionalität dafür ist bereits in Storybook integriert, wir müssen sie nur aktivieren, indem wir ein Script in der `package.json` hinzufügen.

```javascript
// package.json

{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

Wenn du Storybook jetzt via `npm run build-storybook` baust, wird automatisch ein statisches Storybook im Verzeichnis `storybook-static` generiert.

## Continuous Deployment

Wir wollen die neueste Version unserer Komponenten verfügbar machen, wann immer wir Code pushen. Dazu müssen wir Continuous Deployment (CD) für Storybook einrichten. Wir nutzen dazu GitHub und Netlify, um unsere statische Seite zu deployen. Von Netlify nutzen wir dabei das kostenlose Paket.

### GitHub

Als Erstes musst du Git für dein lokales Projekt-Verzeichnis einrichten. Wenn du bereits das vorherige Kapitel "Tests" gelesen hast, springe zum Aufsetzen eines GitHub-Repository.

```bash
$ git init
```

Füge Dateien zum ersten Commit hinzu.

```bash
$ git add .
```

Committe die Dateien.

```bash
$ git commit -m "taskbox UI"
```

Gehe auf GitHub und setze [hier](https://github.com/new) ein Repository auf. Nenne es "taskbox".

![GitHub einrichten](/intro-to-storybook/github-create-taskbox.png)

Kopiere die Origin-URL des neu aufgesetzten Repos und füge es deinem Git-Projekt mit folgendem Befehl hinzu:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Zuletzt pushe das Repo auf GitHub.

```bash
$ git push -u origin master
```

### Netlify

Netlify hat einen eingebauten Continuous-Deployment-Service, der uns ermöglicht, Storybook zu deployen, ohne eine eigene CI aufzubauen.

<div class="aside">
Wenn dein Unternehmen CI einsetzt, füge ein Deployment-Script zu eurer Config hinzu, das <code>storybook-static</code> auf einen statischen Hosting-Service wie S3 hochlädt.
</div>

[Erstelle einen Netlify-Account](https://app.netlify.com/start) und klicke auf “create site”.

![Netlify Seite anlegen](/intro-to-storybook/netlify-create-site.png)

Als nächstes, klicke auf den GitHub-Button, um Netlify mit GitHub zu verbinden. Das ermöglicht Netlify, unser `taskbox`-Remote-Repo zuzugreifen.

Wähle nun das `taskbox`-GitHub-Repo aus der Liste aus.

![Netlify mit Repo verbinden](/intro-to-storybook/netlify-account-picker.png)

Konfiguriere Netlify, indem du angibst, welcher Build-Befehl ("Build command") in der CI ausgeführt werden soll und in welchem Verzeichnis die statische Seite abgelegt wird ("Publish directory"). Als Branch wähle `master`. Das Verzeichnis ist `.storybook-static`. Als Build-Befehl gib `yarn build-storybook` ein.

![Netlify-Einstellungen](/intro-to-storybook/netlify-settings.png)

<div class="aside">
<p>
Sollte dein Deployment mit Netlify fehlschlagen, füge deinem <code>build-storybook</code>-Script das <code><a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet</a></code>-Flag hinzu.
</p>
</div>

Schicke das Formular ab, um den Code auf dem `master`-Branch von `taskbox` zu bauen und zu deployen.

Wenn das erledigt ist, sehen wir eine Bestätigungs-Nachricht auf Netlify mit einem Link zum online verfügbaren `taskbox`-Storybook. Hast du alle Anweisungen befolgt, sollte dein Storybook unter einer Subdomain wie [dieser hier](https://clever-banach-415c03.netlify.app/) zu erreichen sein.

![Deploytes Storybook auf Netlify](/intro-to-storybook/netlify-storybook-deploy.png)

Wir haben die Einrichtung von Continuous Deployment für unser Storybook abgeschlossen. Ab jetzt können wir unsere Stories mit den Mitgliedern in unserem Team per Link teilen.

Das ist hilfreich für visuelle Reviews als Bestandteil des Standard-App-Entwicklungs-Prozesses oder einfach, um mit seiner Arbeit zu prahlen 💅.
