---
title: 'Addons'
tocTitle: 'Addons'
description: 'Impara come integrare e utilizzare il popolare addon Controls'
commit: '13da85f'
---

Storybook ha un robusto ecosistema di [addons](https://storybook.js.org/docs/vue/configure/storybook-addons) che puoi utilizzare per migliorare l'esperienza dello sviluppatore per tutti nel tuo team. Visualizzali tutti [qui](https://storybook.js.org/addons).

Se hai seguito questo tutorial, hai già incontrato diversi addon e ne hai configurato uno nel capitolo [Testing](/intro-to-storybook/vue/it/test/).

Esistono addon per ogni possibile caso d'uso, e ci vorrebbe una vita per scrivere su tutti. Integriamo uno degli addon più popolari: [Controls](https://storybook.js.org/docs/vue/essentials/controls).

## Cos'è Controls?

Controls permette a designer e sviluppatori di esplorare facilmente il comportamento dei componenti _giocando_ con i suoi argomenti. Nessun codice richiesto. Controls crea un pannello addon accanto alle tue storie, così puoi modificarne gli argomenti in tempo reale.

Le installazioni fresche di Storybook includono Controls di serie. Nessuna configurazione extra necessaria.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-non-react.mp4"
    type="video/mp4"
  />
</video>

## Gli Addons sbloccano nuovi flussi di lavoro in Storybook

Storybook è un meraviglioso [ambiente di sviluppo guidato dai componenti](https://www.componentdriven.org/). L'addon Controls evolve Storybook in uno strumento di documentazione interattiva.

### Utilizzare Controls per trovare casi limite

Con Controls, gli ingegneri QA, gli ingegneri UI o qualsiasi altro stakeholder possono spingere il componente al limite! Considerando l'esempio seguente, cosa succederebbe al nostro `Task` se aggiungessimo una stringa **ENORME**?

![Oh no! Il contenuto più a destra è tagliato!](/intro-to-storybook/task-edge-case-non-react.png)

Non va bene! Sembra che il testo fuoriesca oltre i limiti del componente Task.

Controls ci ha permesso di verificare rapidamente diversi input per un componente, in questo caso, una stringa lunga, e ha ridotto il lavoro necessario per scoprire problemi dell'UI.

Ora risolviamo il problema del fuoriuscire aggiungendo uno stile a `Task.vue`:

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
+       style="text-overflow: ellipsis;" />
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

![Molto meglio.](/intro-to-storybook/edge-case-solved-controls-non-react.png)

Problema risolto! Il testo viene ora troncato quando raggiunge il limite dell'area del Task, utilizzando un elegante ellissi.

### Aggiungere una nuova storia per evitare regressioni

In futuro, potremo riprodurre manualmente questo problema inserendo la stessa stringa tramite Controls. Ma è più facile scrivere una storia che mette in mostra questo caso limite. Ciò espande la nostra copertura dei test di regressione e delinea chiaramente i limiti del componente (o dei componenti) per il resto del team.

Aggiungi una nuova storia per il caso del testo lungo in `Task.stories.js`:

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};
```

Ora possiamo riprodurre e lavorare su questo caso limite con facilità.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-non-react.mp4"
    type="video/mp4"
  />
</video>

Se stiamo facendo [test visivi](/intro-to-storybook/vue/it/test/), saremo anche informati se la soluzione di troncamento si rompe. I casi limite estremi sono inclini a essere dimenticati senza copertura dei test!

<div class="aside"><p>💡 Controls è un ottimo modo per far giocare con i tuoi componenti e storie anche chi non è uno sviluppatore. Può fare molto di più di quanto abbiamo visto qui; ti consigliamo di leggere la <a href="https://storybook.js.org/docs/vue/essentials/controls">documentazione ufficiale</a> per saperne di più. Tuttavia, ci sono molti altri modi per personalizzare Storybook in modo che si adatti al tuo flusso di lavoro con gli addon. Nella <a href="https://storybook.js.org/docs/vue/addons/writing-addons">guida alla creazione di un addon</a> ti insegneremo a farlo, creando un addon che ti aiuterà a potenziare il tuo flusso di lavoro di sviluppo.</p></div>

### Merge delle Modifiche

Non dimenticare di fare merge alle tue modifiche con git!
