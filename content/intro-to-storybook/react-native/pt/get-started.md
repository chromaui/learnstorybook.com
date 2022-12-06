---
title: 'Tutorial do Storybook para React Native'
tocTitle: 'Introdução'
description: 'Configure o Storybook no seu ambiente de desenvolvimento'
---

O Storybook executa paralelamente à aplicação em desenvolvimento. Isso lhe ajuda a construir componentes de interface (UI) isolados da lógica de negócio e contexto em sua aplicação. Esta edição de Tutorial do Storybook é destinada para React Native; Existem outras edições de tutorial para [React](/intro-to-storybook/react/pt/get-started), [Vue](/intro-to-storybook/vue/pt/get-started) and [Angular](/intro-to-storybook/angular/pt/get-started).

![Storybook e sua aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configuração do Storybook para React Native

Precisamos seguir alguns passos para configurar o processo de compilação em seu ambiente de desenvolvimento. Para começar, precisamos do [Expo](https://expo.io/tools) para compilação e permitir ao  [Storybook](https://storybook.js.org/) e o [Jest](https://facebook.github.io/jest/) fazerem testes em nossa aplicação.

Antes de iniciar o tutorial, leve em conta as seguintes considerações:

- Todos os códigos foram desenvolvidos para a plataforma android, Se você quiser utilizar o IOS, alguns componentes podem precisar ser atualizados para funcionar corretamente.

- Você vai precisar de um simulador funcional ou um dispositivo físico correntamente configurado para maximizar sua experiência, A [documentação do react-native](https://facebook.github.io/react-native/docs/getting-started) Tem instruções mais detalhadas de como fazer isso.

- Por todo o tutorial, o <code>yarn</code> vai ser utilizado. Se você quiser usar o <code>npm</code>, selecione a opção apropriada quando você estiver inicializando a aplicação e substitua todos os comandos seguintes por npm.

Agora, depois de ver tudo isso, Vamos executar os seguintes comandos:

```shell:clipboard=false
# Create our application:
expo init --template tabs@sdk-36 taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init --type react_native

```

<div class="aside">
  <p>Durante o processo de instalação do Storybook,
você será solicitado a instalar o react-native-server, faça isso pois ajurá muito em todo o tutorial.</p>
</div>

### Configuração do Jest com React Native

Nós temos duas de três modalidades configuradas em nossa aplicação, mas nós ainda vamos precisar de mais uma, precisaremos configurar o [Jest](https://facebook.github.io/jest/) para poder testar nossa aplicação.

Crie uma nova pasta chamada `__mocks__` em sua aplicação e adicione um arquivo chamado `globalMock.js` dentro dela como a seguir:

```javascript
jest.mock('global', () => ({
  ...global,
  WebSocket: function WebSocket() {},
}));
```

Atualize a linha `jest` no `package.json` para:

```json:clipboard=false
"jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?@react-native|react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)"
    ],
    "setupFilesAfterEnv": [
      "<rootDir>/__mocks__/globalMock.js"
    ]
  }
```

Agora podemos verificar rapidamente se os vários ambientes de nossa aplicação estão funcionando corretamente:

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 7007:
yarn storybook

# Run the frontend app proper on port 19002:
yarn web
```

![3 modalidades](/intro-to-storybook/app-three-modalities-rn.png)

Verificando o Storybook neste ponto, você pode ver que não há "stories" exibidos. Tudo bem, cuidaremos disso em breve, por enquanto, vamos continuar trabalhando para configurar nosso aplicativo corretamente.

Dependendo da parte da aplicação em que você está trabalhando, convém executar um ou mais deles simultaneamente. Como nosso foco atual é criar um único componente de interface do usuário, continuaremos executando o Storybook

## Reutilizando CSS

Reutilizaremos elementos de design do Tutorial GraphQL e React localizado neste [examplo](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), Então, nós não vamos precisar escrever CSS neste tutorial. Diferentemente de outros tutoriais, nós não copiaremos o CSS compilado, pois o React Native lida com a estilização de uma maneira totalmente diferente, mas, em vez disso, crie um novo arquivo `constants/globalStyles.js` e adicione o seguinte:

<details>
  <summary>Clique para expandir e ver todo o conteúdo do arquivo</summary>

```js:title=constants/globalStyles.js
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

</details>

![Interface Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Se você quiser mudar algo da estilização, os arquivos de código estarão disponíveis no respositório do GitHub. Não se esqueça de ajustar de acordo com a maneira própria de estilizar do React Native.
</div>

## Adicionando ícones e fontes

Para corresponder ao design pretendido, você precisará baixar os arquivos de fonte e ícone e colocá-los dentro da pasta `assets`.

<div class="aside">
<p>Nós vamos usar o <code>svn</code> (Subversion) para baixar facilmente uma pasta de arquivos do GitHub. Se você não tiver o Subversion instalado ou quiser fazer manualmente, você pode pegar os ícones diretamente <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">daqui</a> e os arquivos de fonte <a href="https://github.com/google/fonts/tree/master/ofl/nunitosans">aqui</a>.</p></div>

```shell:clipboard=false
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/icon assets/icon
svn export https://github.com/google/fonts/trunk/ofl/nunitosans assets/font
```

Em seguida, os ícones e fontes precisam ser carregados dentro da aplicação, precisaremos então atualizar o arquivo `hooks/useCachedResources.js` para:

```js:title=hooks/useCachedResources.js
async function loadResourcesAndDataAsync() {
  try {
    SplashScreen.preventAutoHideAsync();

    // Load fonts
    await Font.loadAsync({
      ...Ionicons.font,
      'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
      percolate: require('../assets/icon/percolate.ttf'),
      'NunitoSans-Bold': require('../assets/font/NunitoSans-Bold.ttf'),
      'NunitoSans-Italic': require('../assets/font/NunitoSans-Italic.ttf'),
      NunitoSans: require('../assets/font/NunitoSans-Regular.ttf'),
    });
  } catch (e) {
    // We might want to provide this error information to an error reporting service
    console.warn(e);
  } finally {
    setLoadingComplete(true);
    SplashScreen.hideAsync();
  }
}
```

Para usar os ícones da fonte `percolate` de maneira correta e com segurança no React Native, precisamos criar uma ponte que mapeará cada ícone individual para seu arquivo correspondente.

Crie um novo arquivo chamado `/constants/Percolate.js` com o seguinte conteúdo:

<details>
  <summary>Clique para expandir e ver todo o conteúdo do arquivo</summary>

```js:title=constants/Percolate.js
/**
 * PercolateIcons icon set component.
 * Usage: <PercolateIcons name="icon-name" size={20} color="#4F8EF7" />
 */

import { createIconSet } from '@expo/vector-icons';
const glyphMap = {
  graphql: 59658,
  redux: 59656,
  grid: 59657,
  redirect: 59655,
  grow: 59651,
  lightning: 59652,
  'request-change': 59653,
  transfer: 59654,
  calendar: 59650,
  sidebar: 59648,
  tablet: 59649,
  atmosphere: 58993,
  browser: 58994,
  database: 58995,
  'expand-alt': 58996,
  mobile: 58997,
  watch: 58998,
  home: 58880,
  'user-alt': 58881,
  user: 58882,
  'user-add': 58883,
  users: 58884,
  profile: 58885,
  bookmark: 58886,
  'bookmark-hollow': 58887,
  star: 58888,
  'star-hollow': 58889,
  circle: 58890,
  'circle-hollow': 58891,
  heart: 58892,
  'heart-hollow': 58893,
  'face-happy': 58894,
  'face-sad': 58895,
  'face-neutral': 58896,
  lock: 58897,
  unlock: 58898,
  key: 58899,
  'arrow-left-alt': 58900,
  'arrow-right-alt': 58901,
  sync: 58902,
  reply: 58903,
  expand: 58904,
  'arrow-left': 58905,
  'arrow-up': 58906,
  'arrow-down': 58907,
  'arrow-right': 58908,
  'chevron-down': 58909,
  back: 58910,
  download: 58911,
  upload: 58912,
  proceed: 58913,
  info: 58914,
  question: 58915,
  alert: 58916,
  edit: 58917,
  paintbrush: 58918,
  close: 58919,
  trash: 58920,
  cross: 58921,
  delete: 58922,
  power: 58923,
  add: 58924,
  plus: 58925,
  document: 58926,
  'graph-line': 58927,
  'doc-chart': 58928,
  'doc-list': 58929,
  category: 58930,
  copy: 58931,
  book: 58932,
  certificate: 58934,
  print: 58935,
  'list-unordered': 58936,
  'graph-bar': 58937,
  menu: 58938,
  filter: 58939,
  ellipsis: 58940,
  cog: 58941,
  wrench: 58942,
  nut: 58943,
  camera: 58944,
  eye: 58945,
  photo: 58946,
  video: 58947,
  speaker: 58948,
  phone: 58949,
  flag: 58950,
  pin: 58951,
  compass: 58952,
  globe: 58953,
  location: 58954,
  search: 58955,
  timer: 58956,
  time: 58957,
  dashboard: 58958,
  hourglass: 58959,
  play: 58960,
  stop: 58961,
  email: 58962,
  comment: 58963,
  link: 58964,
  paperclip: 58965,
  box: 58966,
  structure: 58967,
  commit: 58968,
  cpu: 58969,
  memory: 58970,
  outbox: 58971,
  share: 58972,
  button: 58973,
  check: 58974,
  form: 58975,
  admin: 58976,
  paragraph: 58977,
  bell: 58978,
  rss: 58979,
  basket: 58980,
  credit: 58981,
  support: 58982,
  shield: 58983,
  beaker: 58984,
  google: 58985,
  gdrive: 58986,
  youtube: 58987,
  facebook: 58988,
  'thumbs-up': 58989,
  twitter: 58990,
  github: 58991,
  meteor: 58992,
};

const iconSet = createIconSet(glyphMap, 'percolate');

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;
```

</details>

Para poder ver o Storybook no React Native, precisaremos atualizar o arquivo `screens/LinksScreen.js` para:

```js:title=screens/LinksScreen.js
import * as React from 'react';
import StorybookUIRoot from '../storybook';

export default function LinksScreen() {
  return <StorybookUIRoot />;
}
```

E finalmente o `navigation/BottomTabNavigator.js` para:

```js:title=navigation/BottomTabNavigator.js
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Taskbox"
        component={HomeScreen}
        options={{
          title: 'Taskbox',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: 'Storybook',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Como começar';
    case 'Links':
      return 'Seu Storybook';
  }
}
```

E finalmente, nós vamos precisar fazer uma pequena mudança no nosso aquivo de configuração do Storybook. Como usamos o expo para compilar nosso aplicativo, podemos remover com segurança alguns itens da configuração que não são necessários. Mude o conteúdo do arquivo para:

```js:title=storybook/index.js
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
```

<div class="aside"><p>Estamos adicionando o <code>asyncStorage:null</code> devido ao fato de que a partir do React Native 0.59, o Async Storage foi descontinuado. Se precisar usá-lo em seu aplicativo, você terá que adicioná-lo manualmente instalando o pacote <code>@react-native-async-storage/async-storage</code> e ajustando o código de acordo com ele. Você pode ler mais informacões sobre como configurar o Storybook com Async Storage <a href="https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage">aqui</a>.
Como este tutorial não vai usar nenhuma funcionalidade do Async Storage, nós podemos tranquilamente adicionar este elemento na configuração do Storybook.</p></div>

Depois de adicionar os ícones, fontes e estilizações, o aplicativo pode estar renderizando um pouco estranho. Está tudo bem. Nós não vamos trabalhar com o aplicativo agora. Estamos começando com a construção do nosso primeiro componente!
