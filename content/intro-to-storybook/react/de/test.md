---
title: 'UI-Komponenten testen'
tocTitle: 'Tests'
description: 'Lerne, wie man UI-Komponenten testen kann'
commit: '3e283f7'
---

Kein Storybook-Tutorial ist vollständig ohne Tests. Tests sind essenziell für die Erstellung hochwertiger UIs. In modularen Systemen können auch kleinste Änderungen einen langen Rattenschwanz nach sich ziehen. Bisher sind uns drei Arten von Tests begegnet:

- **Visuelle Tests** verlassen sich darauf, dass die Entwickler manuell auf eine Komponente schauen, um deren Korrektheit zu bestätigen. Sie helfen uns dabei, das Erscheinungsbild einer Komponente einem Gesundheitscheck zu unterziehen.
- **Snapshot-Tests** mit Storyshots erfassen das gerenderte Markup einer Komponente. Sie helfen uns, Änderungen am Markup im Blick zu behalten, die Fehler und Warnungen beim Rendering verursachen.
- **Unit-Tests** mit Jest stellen sicher, dass der Output einer Komponente bei einem definierten Input gleich bleibt. Sie sind großartig, um die Funktionen einer Komponente zu testen.

## “Aber sieht es auch gut aus?”

Leider reichen die zuvor erwähnten Arten von Tests nicht aus, um UI-Fehler zu vermeiden. UIs zu testen ist knifflig, da Designs subjektiv und detailreich sind. Visuelle Tests sind zu händisch, Snapshot-Tests lösen zu viele Fehlalarme aus, wenn man sie für UIs einsetzt, und Unit-Tests auf Pixel-Ebene liefern einen zu geringen Mehrwert. Eine vollständige Storybook Test-Strategie umfasst auch visuelle Regressions-Tests.

## Visuelle Regressions-Tests für Storybook

Visuelle Regressions-Tests dienen dazu, optische Veränderungen zu identifizieren. Sie speichern Screenshots von jeder Story und vergleichen diese zwischen Commits, um Veränderungen sichtbar zu machen. Dies ist perfekt dafür geeignet, grafische Elemente wie Layout, Farbe, Größe und Kontrast zu verifizieren.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook eignet sich prima für visuelle Regressions-Tests, da jede Story im Grunde eine eigene Test-Spezifikation darstellt. Immer, wenn wir eine Story schreiben oder aktualisieren, bekommen wir dadurch auch gleich eine Spec geliefert.

Es gibt eine ganze Reihe von Tools für visuelle Regressions-Tests. Für professionelle Teams empfehlen wir [**Chromatic**](https://www.chromatic.com/), eine von den Autoren hinter Storybook entwickelte Erweiterung, die Tests in der Cloud ausführt.

## Einrichtung visueller Regressions-Tests

Chromatic ist ein leicht anzubindendes Storybook-Addon für visuelle Regressions-Tests und -Reviews in der Cloud. Da es ein Bezahldienst ist (mit kostenlosem Probezeitraum), mag es nicht für jedermann geeignet sein. Dennoch ist Chromatic ein lehrreiches Beispiel für einen Workflow mit visuellen Regressions-Tests in Produktion, den wir kostenlos ausprobieren können. Schauen wir mal rein.

### Git auf den aktuellen Stand bringen

`create-react-app` hat ein Git Repo für unser Projekt angelegt; lass uns unsere bisherigen Änderungen mal einchecken:

```shell
git add -A
```

Nun committe die Dateien.

```bash
git commit -m "taskbox UI"
```

### Chromatic installieren

Füge das Paket als Abhängigkeit hinzu.

```shell
yarn add chromatic
```

Jetzt melde dich mit deinem GitHub Account [in Chromatic an](https://www.chromatic.com/start) (Chromatic erfordert nur wenige Berechtigungen). Erstelle ein Projekt namens "taskbox" und kopiere deinen eindeutigen `project-token`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Führe den Test-Befehl in der Kommandozeile aus, um visuelle Regressions-Tests für Storybook einzurichten. Vergiss nicht, deinen eindeutigen project-token anstelle von `<project-token>` einzusetzen.

```bash
npx chromatic --project-token=<project-token>
```

Ist der erste Test einmal durchgelaufen, haben wir Test-Baselines für alle unsere Stories. Anders gesagt, Screenshots von jeder Story, die als "richtig" angesehen werden. Zukünftige Änderungen an den Stories werden mit diesen Baselines verglichen werden.

![Chromatic Baselines](/intro-to-storybook/chromatic-baselines.png)

## Veränderungen in der UI erfassen

Visuelle Regressions-Tests basieren auf dem Vergleichen von Bildern eines neu gerenderten UI-Codes mit den Baseline-Bildern. Wird eine Veränderung in der UI festgestellt, wird man darüber benachrichtigt. Schau dir an diesem Beispiel an, wie es funktioniert, in dem wir die Hintergrundfarbe der `Task`-Komponente verändern:

![Code-Anpassung](/intro-to-storybook/chromatic-change-to-task-component.png)

Hierdurch erhalten wir eine neue Hintergrundfarbe für die Aufgabe.

![Aufgabe mit geändertem Hintergrund](/intro-to-storybook/chromatic-task-change.png)

Führe den Befehl von vorhin aus, um einen weiteren Chromatic-Test zu starten.

```shell
npx chromatic --project-token=<project-token>
```

Folge dem Link zur Weboberfläche, wo du die Veränderungen sehen kannst.

![UI-Änderungen in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Es gibt eine ganze Reihe von Veränderungen! Durch die Komponenten-Hierarchie, in der `Task` ein Kind von `TaskList` und `Inbox` ist, löst eine kleine Änderung eine Kettenreaktion vieler weiterer Regressionen aus. Dieser Umstand ist genau der Grund dafür, warum Entwickler visuelle Regressions-Tests ergänzend zu anderen Test-Methoden benötigen.

![Kleine UI-Änderung löst große Regressionen aus](/intro-to-storybook/minor-major-regressions.gif)

## Veränderungen auswerten

Visuelle Regressions-Tests stellen sicher, dass Komponenten sich nicht unbeabsichtigt verändern. Aber letzten Endes liegt es an dir, festzustellen, ob Änderungen beabsichtigt sind, oder nicht.

Ist eine Änderung beabsichtigt, muss die Baseline aktualisiert werden, damit zukünftige Tests mit der aktuellsten Version der Story verglichen werden. Ist eine Änderung jedoch unbeabsichtigt entstanden, muss sie behoben werden.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Da sich moderne Apps aus Komponenten zusammensetzen, ist es wichtig, dass wir auf Komponenten-Ebene testen. Das hilft uns dabei, den Ursprung eines Problems leichter zu identifizieren, anstatt auf seine Symptome in Screens und Kompositionen zu reagieren.

## Änderungen übernehmen

Sobald wir mit der Auswertung fertig sind, können wir die Änderungen in der UI mit gutem Gefühl übernehmen -- in der Gewissheit, dass die Änderungen keine unbeabsichtigten Bugs verursachen. Wenn dir der neue rote Hintergrund gefällt, akzeptiere die Änderungen. Andernfalls gehe zum vorherigen Zustand zurück.

![Änderungen, bereit übernommen zu werden](/intro-to-storybook/chromatic-review-finished.png)

Storybook hilft dir dabei, Komponenten zu **bauen**; Tests helfen dir dabei, sie zu **warten**. Die vier Typen von UI-Tests, die in diesem Tutorial behandelt werden, sind visuelle, Snapshot-, Unit- und visuelle Regressions-Tests. Die letzten drei kannst du automatisieren, indem du sie deinem CI-Script hinzufügst. Das hilft dir dabei, Komponenten auszuliefern, ohne dass du dich um versteckte Bugs sorgen musst. Der gesamte Workflow ist unten dargestellt.

![Workflow für visuelle Regressions-Tests](/intro-to-storybook/cdd-review-workflow.png)
