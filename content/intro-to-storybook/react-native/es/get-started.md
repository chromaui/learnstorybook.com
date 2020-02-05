---
title: 'Tutorial Storybook para React Native'
tocTitle: 'Empezando'
description: 'Configurar Storybook en tu entorno de desarrollo'
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de interfaz de usuario aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para React Native; existe otras ediciones para [Vue](/vue/es/get-started), [Angular](/angular/es/get-started) y [React](/react/es/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurar Storybook con React Native

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [Expo](https://expo.io/tools) para configurar nuestro sistema de build, y añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para testear nuestra aplicación creada.

Antes de sumergirse en el tutorial, tenga en cuenta las siguientes consideraciones:

- Todo el código estaba destinado a la plataforma Android; si desea utilizar IOS, es posible que algunos componentes deban actualizarse para que funcionen correctamente.

- Necesitará un simulador que funcione o un dispositivo físico configurado correctamente para maximizar su experiencia, los documentos de [react-native](https://facebook.github.io/react-native/docs/getting-started) tienen instrucciones más detalladas sobre cómo lograr esto.

- A lo largo de este tutorial, se utilizará yarn. Si desea utilizar npm, seleccione la opción adecuada durante el proceso de inicialización de la aplicación y reemplace todos los comandos posteriores con npm.


Con eso fuera del camino, ejecutemos los siguientes comandos:

```bash
# Create our application:
expo init --template tabs taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init --type react_native

```

<div class="aside">
  <p>Durante el proceso de instalación de Storybook, se le pedirá que instale react-native-server, hágalo ya que este paquete será de gran ayuda durante todo el tutorial.</p>
</div>

También queremos agregar otro paquete y hacer un cambio en `storybook/rn-addons.js` para permitir que las acciones (las verá en acción más adelante en el tutorial) se registren correctamente en la IU de Storybook.

Ejecute el siguiente comando:

```bash
yarn add -D @storybook/addon-ondevice-actions
```

Cambie `storybook/rn-addons.js` a lo siguiente:

```javascript
import '@storybook/addon-ondevice-actions/register';
```

### Configurar Jest con React Native

Tenemos dos de las tres modalidades configuradas en nuestra aplicación, pero aún necesitamos una, necesitamos configurar [Jest](https://facebook.github.io/jest/) para habilitar las pruebas.

Cree una nueva carpeta llamada `__mocks__` y agregue un nuevo archivo `globalMock.js` con lo siguiente:

```javascript
jest.mock('global', () => ({
  ...global,
  WebSocket: function WebSocket() {},
}));
```

Actualice el campo `jest` en` package.json`:

```json
"jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)"
    ],
    "setupFilesAfterEnv": [
      "<rootDir>/__mocks__/globalMock.js"
    ]
  }
```

Ahora podemos comprobar rápidamente que los diversos entornos de nuestra aplicación funcionan correctamente:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 7007:
yarn storybook

# Run the frontend app proper on port 19002:
yarn start
```

![3 modalidades](/intro-to-storybook/app-three-modalities-rn.png)

Dependiendo de en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Reusa CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Al contrario de los otros tutoriales, no copiaremos sobre el CSS compilado, ya que React Native maneja el estilo de una manera completamente diferente, sino que crea un nuevo archivo `constants/globalStyles.js` y agrega lo siguiente:

```javascript
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  TaskBox: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#26c6da',
  },
  CheckBox: {
    borderColor: '#26c6da',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
    height: 18,
    width: 18,
  },
  GlowCheckbox: {
    borderColor: '#eee',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 1,
    backgroundColor: '#eee',
    color: 'transparent',
    height: 20,
    width: 20,
  },
  GlowText: {
    backgroundColor: '#eee',
    color: 'transparent',
  },
  ListItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 48,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ListItemInputTask: {
    backgroundColor: 'transparent',
    width: '95%',
    padding: 10,
    fontFamily: 'NunitoSans',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  ListItemInputTaskArchived: {
    color: '#aaa',
    width: '95%',
    padding: 10,
    fontFamily: 'NunitoSans',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  LoadingItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    flex: 1,
    height: 48,
    justifyContent: 'space-around',
    paddingLeft: 16,
    width: '100%',
  },
  ListItems: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: 288,
  },
  WrapperMessage: {
    position: 'absolute',
    top: '40%',
    right: 0,
    bottom: 'auto',
    left: 0,
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
  },
  PageListsShow: {
    minHeight: '100vh',
    backgroundColor: 'white',
  },
  PageListsShowhead: {
    backgroundColor: '#d3edf4',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  TitleMessage: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'NunitoSans',
    fontWeight: '800',
    color: '#555',
  },
  SubtitleMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontFamily: 'NunitoSans',
  },
  titlepage: {
    fontSize: 20,
    lineHeight: 24,
  },
  TitleWrapper: {
    fontFamily: 'NunitoSans',
    fontWeight: '800',
    color: '#1c3f53',
    maxWidth: '100%',
  },
});
```

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si desea modificar el estilo, los archivos LESS de origen se proporcionan en el repositorio de GitHub. Y ajústelo en consecuencia para el estilo React Native.
</div>

## Añadiendo recursos

Agregue los directorios de fuentes e íconos descargándolos a su computadora y colocándolos en su repositorio.

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon assets/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font assets/font
```

<div class="aside"> Svn (Subversion) se usó para facilitar la transferencia de carpetas de GitHub. Si no tiene instalado Subversion o simplemente desea hacerlo manualmente, puede obtener las carpetas directamente <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">aquí</a>.</p></div>

A continuación, los recursos deben cargarse en la aplicación, para eso vamos a actualizar `App.js` a lo siguiente:

```javascript
// App.js

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'percolate': require('./assets/icon/percolate.ttf'),
      'NunitoSans-Bold': require('./assets/font/NunitoSans-Bold.ttf'),
      'NunitoSans-Italic': require('./assets/font/NunitoSans-Italic.ttf'),
      'NunitoSans': require('./assets/font/NunitoSans-Regular.ttf'),
    }),
  ]);
}
```

Para utilizar los iconos de la fuente `percolate` de forma segura y correcta en React Native, necesitamos crear un puente que asigne cada icono individual a su correspondiente en el archivo de la fuente.

Cree un nuevo archivo `/constants/Percolate.js` con lo siguiente:

```javascript
/**
 * PercolateIcons icon set component.
 * Usage: <PercolateIcons name="icon-name" size={20} color="#4F8EF7" />
 */

import { createIconSet } from '@expo/vector-icons';
const glyphMap = {
  'graphql': 59658,
  'redux': 59656,
  'grid': 59657,
  'redirect': 59655,
  'grow': 59651,
  'lightning': 59652,
  'request-change': 59653,
  'transfer': 59654,
  'calendar': 59650,
  'sidebar': 59648,
  'tablet': 59649,
  'atmosphere': 58993,
  'browser': 58994,
  'database': 58995,
  'expand-alt': 58996,
  'mobile': 58997,
  'watch': 58998,
  'home': 58880,
  'user-alt': 58881,
  'user': 58882,
  'user-add': 58883,
  'users': 58884,
  'profile': 58885,
  'bookmark': 58886,
  'bookmark-hollow': 58887,
  'star': 58888,
  'star-hollow': 58889,
  'circle': 58890,
  'circle-hollow': 58891,
  'heart': 58892,
  'heart-hollow': 58893,
  'face-happy': 58894,
  'face-sad': 58895,
  'face-neutral': 58896,
  'lock': 58897,
  'unlock': 58898,
  'key': 58899,
  'arrow-left-alt': 58900,
  'arrow-right-alt': 58901,
  'sync': 58902,
  'reply': 58903,
  'expand': 58904,
  'arrow-left': 58905,
  'arrow-up': 58906,
  'arrow-down': 58907,
  'arrow-right': 58908,
  'chevron-down': 58909,
  'back': 58910,
  'download': 58911,
  'upload': 58912,
  'proceed': 58913,
  'info': 58914,
  'question': 58915,
  'alert': 58916,
  'edit': 58917,
  'paintbrush': 58918,
  'close': 58919,
  'trash': 58920,
  'cross': 58921,
  'delete': 58922,
  'power': 58923,
  'add': 58924,
  'plus': 58925,
  'document': 58926,
  'graph-line': 58927,
  'doc-chart': 58928,
  'doc-list': 58929,
  'category': 58930,
  'copy': 58931,
  'book': 58932,
  'certificate': 58934,
  'print': 58935,
  'list-unordered': 58936,
  'graph-bar': 58937,
  'menu': 58938,
  'filter': 58939,
  'ellipsis': 58940,
  'cog': 58941,
  'wrench': 58942,
  'nut': 58943,
  'camera': 58944,
  'eye': 58945,
  'photo': 58946,
  'video': 58947,
  'speaker': 58948,
  'phone': 58949,
  'flag': 58950,
  'pin': 58951,
  'compass': 58952,
  'globe': 58953,
  'location': 58954,
  'search': 58955,
  'timer': 58956,
  'time': 58957,
  'dashboard': 58958,
  'hourglass': 58959,
  'play': 58960,
  'stop': 58961,
  'email': 58962,
  'comment': 58963,
  'link': 58964,
  'paperclip': 58965,
  'box': 58966,
  'structure': 58967,
  'commit': 58968,
  'cpu': 58969,
  'memory': 58970,
  'outbox': 58971,
  'share': 58972,
  'button': 58973,
  'check': 58974,
  'form': 58975,
  'admin': 58976,
  'paragraph': 58977,
  'bell': 58978,
  'rss': 58979,
  'basket': 58980,
  'credit': 58981,
  'support': 58982,
  'shield': 58983,
  'beaker': 58984,
  'google': 58985,
  'gdrive': 58986,
  'youtube': 58987,
  'facebook': 58988,
  'thumbs-up': 58989,
  'twitter': 58990,
  'github': 58991,
  'meteor': 58992,
};

const iconSet = createIconSet(glyphMap, 'percolate');

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;
```

Para ver Storybook en React Native vamos a actualizar `screens\SettingsScreen.js` a lo siguiente:

```javascript
import React from 'react';
import StorybookUIRoot from '../storybook/';
export default function SettingsScreen() {
  return <StorybookUIRoot />;
}

SettingsScreen.navigationOptions = {
  title: 'Storybook',
};
```

Y finalmente `navigation\MainTabNavigator.js` a lo siguiente:

```javascript
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Storybook',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
```

Después de añadir los estilos y recursos, nuestra aplicación se renderizará de forma un poco extraña. Está bien. No estamos trabajando en la aplicación ahora mismo. ¡Comenzamos con la construcción de nuestro primer componente!
