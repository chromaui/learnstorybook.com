---
title: 'Addons'
tocTitle: 'Addons'
description: 'Impara come integrare e utilizzare il popolare addon Controls'
commit: '40befd8'
---

Storybook ha un robusto ecosistema di [addons](https://storybook.js.org/docs/react/configure/storybook-addons) che puoi utilizzare per migliorare l'esperienza dello sviluppatore per tutti nel tuo team. Visualizzali tutti [qui](https://storybook.js.org/addons).

Se hai seguito questo tutorial, hai già incontrato diversi addon e ne hai configurato uno nel capitolo [Testing](/intro-to-storybook/react/en/test/).

Esistono addon per ogni possibile caso d'uso, e ci vorrebbe una vita per scrivere su tutti. Integriamo uno degli addon più popolari: [Controls](https://storybook.js.org/docs/react/essentials/controls).

## Cos'è Controls?

Controls permette a designer e sviluppatori di esplorare facilmente il comportamento dei componenti _giocando_ con i suoi argomenti. Nessun codice richiesto. Controls crea un pannello addon accanto alle tue storie, così puoi modificarne gli argomenti in tempo reale.

Le installazioni fresche di Storybook includono Controls di serie. Nessuna configurazione extra necessaria.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-7-0.mp4"
    type="video/mp4"
  />
</video>

## Gli Addons sbloccano nuovi flussi di lavoro in Storybook

Storybook è un meraviglioso [ambiente di sviluppo guidato dai componenti](https://www.componentdriven.org/). L'addon Controls evolve Storybook in uno strumento di documentazione interattiva.

### Utilizzare Controls per trovare casi limite

Con Controls, gli ingegneri QA, gli ingegneri UI o qualsiasi altro stakeholder possono spingere il componente al limite! Considerando l'esempio seguente, cosa succederebbe al nostro `Task` se aggiungessimo una stringa **ENORME**?

![Oh no! Il contenuto più a destra è tagliato!](/intro-to-storybook/task-edge-case-7-0.png)

Non va bene! Sembra che il testo fuoriesca oltre i limiti del componente Task.

Controls ci ha permesso di verificare rapidamente diversi input per un componente, in questo caso, una stringa lunga, e ha ridotto il lavoro necessario per scoprire problemi dell'UI.

Ora risolviamo il problema del fuoriuscire aggiungendo uno stile a `Task.jsx`:

```diff:title=src/components/Task.jsx
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
+         style={{ textOverflow: 'ellipsis' }}
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

![Molto meglio.](/intro-to-storybook/edge-case-solved-with-controls-7-0.png)

Problema risolto! Il testo viene ora troncato quando raggiunge il limite dell'area del Task, utilizzando un elegante ellissi.

### Aggiungere una nuova storia per evitare regressioni

In futuro, potremo riprodurre manualmente questo problema inserendo la stessa stringa tramite Controls. Ma è più facile scrivere una storia che mette in mostra questo caso limite. Ciò espande la nostra copertura dei test di regressione e delinea chiaramente i limiti del componente (o dei componenti) per il resto del team.

Aggiungi una nuova storia per il caso del testo lungo in `Task.stories.jsx`:

```js:title=src/components/Task.stories.jsx
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
    src="/intro-to-storybook/task-stories-long-title-7-0.mp4"
    type="video/mp4"
  />
</video>

Se stiamo facendo [test visivi](/intro-to-storybook/react/en/test/), saremo anche informati se la soluzione di troncamento si rompe. I casi limite estremi sono inclini a essere dimenticati senza copertura dei test!

<div class="aside"><p>💡 Controls è un ottimo modo per far giocare con i tuoi componenti e storie anche chi non è uno sviluppatore. Può fare molto di più di quanto abbiamo visto qui; ti consigliamo di leggere la <a href="https://storybook.js.org/docs/react/essentials/controls">documentazione ufficiale</a> per saperne di più. Tuttavia, ci sono molti altri modi per personalizzare Storybook in modo che si adatti al tuo flusso di lavoro con gli addon. Nella <a href="https://storybook.js.org/docs/react/addons/writing-addons">guida alla creazione di un addon</a> ti insegneremo a farlo, creando un addon che ti aiuterà a potenziare il tuo flusso di lavoro di sviluppo.</p></div>

### Merge delle Modifiche

Non dimenticare di fare merge alle tue modifiche con git!
