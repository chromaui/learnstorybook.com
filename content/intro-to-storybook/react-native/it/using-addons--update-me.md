---
title: 'Addons'
tocTitle: 'Addons'
description: 'Impara come integrare e utilizzare gli addon usando un esempio popolare'
---

Storybook offre un robusto sistema di [addon](https://storybook.js.org/docs/react/configure/storybook-addons) che puoi utilizzare per migliorare l'esperienza di sviluppo per tutti i membri del tuo team.

<div class="aside">
<strong>Stai cercando un elenco di possibili addon?</strong>
<br/>
😍 Puoi vedere l'elenco degli addon ufficialmente supportati e di quelli supportati con forza dalla community <a href="https://storybook.js.org/addons">qui</a>.
</div>

Potremmo scrivere all'infinito su come configurare e utilizzare gli addon per tutti i tuoi casi d'uso specifici. Per ora, concentriamoci sull'integrazione di uno degli addon più popolari nell'ecosistema di Storybook: [knobs](https://github.com/storybookjs/addon-knobs).

## Configurare Knobs

Knobs è una risorsa fantastica che permette a designer e sviluppatori di sperimentare e giocare con i componenti in un ambiente controllato, senza bisogno di scrivere codice! In pratica, ti vengono forniti dei campi definiti dinamicamente con cui un utente può manipolare le prop passate ai componenti nelle tue storie. Ecco cosa andremo a implementare...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installazione

Per prima cosa, dobbiamo installare tutte le dipendenze necessarie.

```shell
yarn add -D @storybook/addon-knobs @storybook/addon-ondevice-knobs
```

Registra Knobs nel tuo file `storybook/addons.js`.

```js:title=storybook/addons.js
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

E anche in `storybook/rn-addons.js`.

```js:title=storybook/rn-addons.js
import '@storybook/addon-ondevice-actions/register';
import '@storybook/addon-ondevice-knobs/register';
```

<div class="aside">
<strong>📝 L'ordine di registrazione degli addon è importante!</strong>
<br/>
L'ordine in cui elenchi questi addon determina l'ordine in cui appaiono come tab nel tuo pannello addon (per quelli che vi compaiono).
</div>

Ed è tutto! È il momento di usarlo in una storia.

### Utilizzo

Usiamo il knob di tipo object nel componente `Task`.

Per prima cosa, importa il decoratore `withKnobs` e il knob di tipo `object` in `Task.stories.js`:

```js:title=components/Task.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
```

Ora, all'interno delle storie di `Task`, passa `withKnobs` come parametro alla funzione `addDecorator()`:

```js:title=components/Task.stories.js
storiesOf('Task', module).addDecorator(withKnobs).add(/*...*/);
```

Infine, integra il knob di tipo `object` all'interno della storia "default":

```js:title=components/Task.stories.js
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => <Task task={object('task', { ...task })} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Ora dovrebbe apparire una nuova tab "Knobs" accanto alla tab "Action Logger" nel pannello inferiore.

Come documentato [qui](https://github.com/storybookjs/addon-knobs#object), il knob di tipo `object` accetta come parametri un'etichetta e un oggetto di default. L'etichetta è costante e viene mostrata a sinistra di un campo di testo nel tuo pannello addon. L'oggetto che hai passato verrà rappresentato come un blob JSON modificabile. Fintanto che invii JSON valido, il tuo componente si adatterà in base ai dati passati all'oggetto!

## Gli addon ampliano l'ambito del tuo Storybook

La tua istanza di Storybook non è solo un meraviglioso [ambiente CDD](https://www.componentdriven.org/), ma ora fornisce anche una fonte interattiva di documentazione. Le PropTypes sono ottime, ma un designer o chiunque sia completamente nuovo al codice di un componente sarà in grado di capirne rapidamente il comportamento tramite Storybook, una volta implementato l'addon knobs.

## Usare Knobs per trovare casi limite

Inoltre, grazie al facile accesso alla modifica dei dati passati a un componente, gli ingegneri QA o gli ingegneri UI preventivi possono ora spingere un componente al limite! Ad esempio, cosa succede a `Task` se l'elemento della lista ha una stringa _ENORME_?

![Oh no! Il contenuto più a destra è tagliato!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Grazie alla possibilità di provare rapidamente input diversi per un componente, possiamo individuare e risolvere questo tipo di problemi con relativa facilità! Risolviamo il problema del contenuto che fuoriesce aggiungendo uno stile a `Task.js`:

```js:title=components/Task.js
// This is the input for our task title. It was changed to a simple text contrary to textinput,
// to illustrate how to see what's intended
<Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={
    state === 'TASK_ARCHIVED' ? styles.list_item_input_TASK_ARCHIVED : styles.list_item_input_TASK
  }
>
  {title}
</Text>
```

![Molto meglio.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Aggiungere una nuova storia per evitare regressioni

Certo, possiamo sempre riprodurre questo problema inserendo lo stesso input nei knobs, ma è meglio scrivere una storia fissa per questo input. Ciò aumenterà la copertura dei tuoi test di regressione e delineerà chiaramente i limiti del componente (o dei componenti) al resto del tuo team.

Aggiungiamo una storia per il caso del testo lungo in Task.stories.js:

```js:title=components/Task.stories.js
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />)
  .add('long title', () => <Task task={{ ...task, title: longTitle }} {...actions} />);
```

Ora che abbiamo aggiunto la storia, possiamo riprodurre questo caso limite con facilità ogni volta che vogliamo lavorarci:

![Eccolo in Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

### Merge delle modifiche

Non dimenticare di fare merge alle tue modifiche con git!
