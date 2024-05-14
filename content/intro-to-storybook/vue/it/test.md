---
title: 'Visual Tests'
tocTitle: 'Visual Testing'
description: 'Impara i modi per testare i componenti UI'
---

Nessun tutorial su Storybook sarebbe completo senza i test. I test sono essenziali per creare interfacce utente di alta qualità. In sistemi modulari, piccole modifiche possono portare a grandi regressioni. Finora, abbiamo incontrato tre tipi di test:

- **Test manuali** si basano sugli sviluppatori che guardano manualmente un componente per verificarne la correttezza. Ci aiutano a fare un controllo di sanità sull'aspetto di un componente durante la sua costruzione.

- **Test di accessibilità** con l'addon a11y verificano che il componente sia accessibile a tutti. Sono ottimi per permetterci di raccogliere informazioni su come le persone con determinati tipi di disabilità utilizzano i nostri componenti.

- **Test di interazione** con la funzione play verificano che il componente si comporti come previsto durante l'interazione con esso. Sono ottimi per testare il comportamento di un componente quando è in uso.

## "Ma sembra giusto?"

Sfortunatamente, i metodi di test sopra menzionati da soli non sono sufficienti per prevenire bug dell'UI. Le interfacce utente sono difficili da testare perché il design è soggettivo e sfumato. I test manuali sono, beh, manuali. Altri test dell'UI, come i test snapshot, generano troppi falsi positivi, e i test unitari a livello di pixel sono scarsamente valutati. Una strategia di test di Storybook completa include anche test di regressione visiva.

## Test visivi per Storybook

I test di regressione visiva, chiamati anche test visivi, sono progettati per individuare cambiamenti nell'aspetto. Funzionano catturando screenshot di ogni storia e confrontandoli commit-per-commit per evidenziare le modifiche. È perfetto per verificare elementi grafici come layout, colore, dimensione e contrasto.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook è uno strumento fantastico per i test di regressione visiva perché ogni storia è essenzialmente una specifica di test. Ogni volta che scriviamo o aggiorniamo una storia, otteniamo una specifica gratuitamente!

Ci sono diversi strumenti per i test di regressione visiva. Raccomandiamo [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un servizio di pubblicazione gratuito realizzato dai manutentori di Storybook che esegue test visivi in un ambiente di browser cloud ultraveloce. Ci permette anche di pubblicare Storybook online, come abbiamo visto nel [capitolo precedente](/intro-to-storybook/vue/it/deploy/).

## Individuare una modifica dell'UI

I test di regressione visiva si basano sul confronto delle immagini della nuova UI renderizzata con le immagini di base. Se viene individuata una modifica dell'UI, ne saremo avvisati.

Vediamo come funziona modificando lo sfondo del componente `Task`.

Inizia creando un nuovo branch per questa modifica:

```shell
git checkout -b change-task-background
```

Modifica `src/components/Task` come segue:

```diff:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label
      :for="'checked' + task.id"
      :aria-label="'archiveTask-' + task.id"
      class="checkbox"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
+       style="background-color: red" />
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>
```

Questo produce un nuovo colore di sfondo per l'elemento.

![cambio sfondo task](/intro-to-storybook/chromatic-task-change-7-0.png)

Aggiungi il file:

```shell
git add .
```

Esegui il Commit:

```shell
git commit -m "change task background to red"
```

E invia le modifiche al repository remoto:

```shell
git push -u origin change-task-background
```

Infine, apri il tuo repository GitHub e crea una pull request per il ramo `change-task-background`.

![Creazione di una PR su GitHub per il task](/github/pull-request-background.png)

Aggiungi un testo descrittivo alla tua pull request e clicca su `Crea pull request`. Clicca sul controllo "🟡 UI Tests" PR in fondo alla pagina.

![PR creata su GitHub per il task](/github/pull-request-background-ok.png)

Ti mostrerà le modifiche dell'UI catturate dal tuo commit.

![Modifiche catturate da Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Ci sono molte modifiche! La gerarchia dei componenti in cui `Task` è un figlio di `TaskList` e `Inbox` significa che una piccola modifica può portare a grandi regressioni. Questa circostanza è precisamente il motivo per cui gli sviluppatori hanno bisogno di test di regressione visiva in aggiunta ad altri metodi di test.

![Piccole modifiche, grandi regressioni nell'UI](/intro-to-storybook/minor-major-regressions.gif)

## Revisionare le modifiche

Il test di regressione visiva garantisce che i componenti non cambino accidentalmente. Ma spetta ancora a noi determinare se le modifiche sono intenzionali o meno.

Se una modifica è intenzionale, dovremo aggiornare l'immagine di base per confrontare i test futuri con l'ultima versione della storia. Se una modifica è non intenzionale, deve essere corretta.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Poiché le app moderne sono costruite a partire dai componenti, è importante che testiamo a livello di componente. Farlo ci aiuta a individuare la causa radice di una modifica, il componente, invece di reagire ai sintomi di una modifica: le schermate e i componenti compositi.

## Unire le modifiche

Quando abbiamo finito di revisionare, siamo pronti a unire le modifiche dell'UI con fiducia, sapendo che gli aggiornamenti non introdurranno accidentalmente bug. Accetta le modifiche se ti piace il nuovo sfondo `rosso`. In caso contrario, torna allo stato precedente.

![Modifiche pronte per essere unite](/intro-to-storybook/chromatic-review-finished.png)

Storybook ci aiuta a **costruire** i componenti; i test ci aiutano a **mantenerli**. Questo tutorial copre quattro tipi di test dell'UI: manuali, di accessibilità, di interazione e di regressione visiva. Puoi automatizzare gli ultimi tre aggiungendoli a un CI come abbiamo appena finito di impostare, e ci aiuta a spedire i componenti senza preoccuparci di bug nascosti. L'intero flusso di lavoro è illustrato di seguito.

![Flusso di lavoro del test di regressione visiva](/intro-to-storybook/cdd-review-workflow.png)
