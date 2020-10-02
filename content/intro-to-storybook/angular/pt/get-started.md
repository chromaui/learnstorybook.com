---
title: 'Storybook para o Angular tutorial'
tocTitle: 'Introdução'
description: 'Configuração do Angular Storybook no ambiente de desenvolvimento'
---

O Storybook executa paralelamente à aplicação em desenvolvimento.
Ajuda-o a construir componentes de interface de utilizador (UI na forma original) isolados da lógica de negócio e contexto da aplicação.
Esta edição de Aprendizagem de Storybook é destinada para Angular.
Encontram-se disponíveis outras edições quer para [Vue](/vue/pt/get-started), quer para [React](/react/pt/get-started).

![Storybook e a aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configuração de Storybook com Angular

Precisamos de alguns passos extra para configurar o processo de compilação no nosso ambiente de desenvolvimento. Para começar queremos usar o pacote [@angular/cli](https://cli.angular.io/), para compilação e permitir ao [Storybook](https://storybook.js.org/) e
[Jest](https://facebook.github.io/jest/) fazerem testes na nossa aplicação. Vamos executar os seguintes comandos:

Para tal vamos executar os seguintes comandos:

```bash
# Create our application (using less as the style pre processor):
npx -p @angular/cli ng new taskbox --style css

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

## Configurar o Jest para funcionar com Angular

Já temos dois dos três ambientes configurados na nossa aplicação, mas ainda é necessário um, precisamos configurar o [Jest](https://facebook.github.io/jest/) para efetuar testes na nossa aplicação:

Execute o comando seguinte numa consola:

```bash
npm install -D jest @types/jest jest-preset-angular@7.1.1 @testing-library/angular @testing-library/jest-dom @babel/preset-env @babel/preset-typescript
```

Uma vez terminado o processo de instalação destes novos pacotes, crie uma pasta (ou diretório) `src\jest-config` onde serão adicionados alguns ficheiros.

Vamos começar por adicionar um ficheiro (ou arquivo) chamado `globalMocks.ts` com o seguinte:

```typescript
// src/jest-config/globalMocks.ts
const mock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});
```

Adicionamos um outro chamado `setup.ts` com o seguinte conteúdo:

```typescript
// src/jest-config/setup.ts
import 'jest-preset-angular';
import './globalMocks';

Object.defineProperty(global, 'Promise', { writable: false, value: global.Promise });
```

Em seguida, uma vez mais dentro da mesma pasta (ou diretório) um outro ficheiro chamado `styleMock.js` com o seguinte conteúdo:

```javascript
// src/jest-config/styleMock.js
module.exports = {};
```

E finalmente dentro desta pasta (ou diretório), um último ficheiro chamado `fileMock.js` com o conteúdo seguinte:

```javascript
// src/jest-config/fileMock.js
module.exports = 'file-stub';
```

E finalmente na raíz do projeto crie um ficheiro chamado `babel.config.js` com o conteúdo seguinte:

```javascript
// babel.config.js
module.exports = function(api) {
  process.env.NODE_ENV === 'development' ? api.cache(false) : api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ];
  const plugins = [];
  return {
    presets,
    plugins,
  };
};
```

Uma vez criados estes ficheiros (ou arquivos) vamos ter que adicionar um novo elemento ao ficheiro `package.json` com o seguinte:

```json
{
  ....
   "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": [
      "<rootDir>/src/jest-config/setup.ts"
    ],
    "transformIgnorePatterns":[
      "node_modules/(?!@storybook/*)"
    ],
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/storybook-static/",
      "<rootDir>/src/test.ts"
    ],
    "coveragePathIgnorePatterns": [
      "/jest-config/",
      "/node_modules/"
    ],
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-preset-angular/AngularSnapshotSerializer.js",
      "<rootDir>/node_modules/jest-preset-angular/HTMLCommentSerializer.js"
    ],
    "globals": {
      "ts-jest": {
        "tsConfig": "<rootDir>/tsconfig.spec.json",
        "stringifyContentPathRegex": "\\.html$",
        "diagnostics": false,
        "isolatedModules": true,
        "astTransformers": [
          "<rootDir>/node_modules/jest-preset-angular/InlineHtmlStripStylesTransformer"
        ]
      }
    },
    "moduleNameMapper": {
      "\\.(css|less)$": "<rootDir>/src/jest-config/styleMock.js",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/jest-config/fileMock.js"
    },
    "transform": {
      "^.+\\.(ts|html)$": "ts-jest",
      "^.+\\.js$": "babel-jest"
    },
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node",
      ".html"
    ]
  }
}
```

Em seguida vão ter que ser feitas algumas alterações aos ficheiros (ou arquivos) que o `@angular/cli` adicionou quando o projeto foi inicializado. Mas especificamente `tsconfig.spec.json`,`tsconfig.json` and `tsconfig.app.json`.

Começando pelo `tsconfig.spec.json` adicione os elementos seguintes ao `compilerOptions`:

```json
{
 "compilerOptions": {
  ....
  "module": "commonjs",
  "allowJs": true,
  }
}
```

E altere o elemento `types` para o seguinte:

```json
{
  "compilerOptions": {
    "types": ["jest", "jquery", "jsdom", "node"]
  }
}
```

Uma vez terminadas estas alterações passamos agora para o ficheiro (ou arquivo) `tsconfig.json`. Uma vez mais adicione o seguinte ao elemento `compilerOptions`, `emitDecoratorMetadata: true`

E finalmente no ficheiro (ou arquivo) `tsconfig.app.json`, adicione a referência à pasta (ou diretório) que acabámos de criar, dentro do elemento `exclude`. Transformando o conteúdo deste elemento no seguinte:

```json
{
  "exclude": ["src/test.ts", "src/**/*.spec.ts", "**/*.stories.ts", "src/jest-config"]
}
```

Estamos quase lá, faltam somente três alterações adicionais para terminar a configuração do Jest com o Angular e o Storybook. Vamos a isto então!

Adicione o seguinte ao ficheiro `.storybook/tsconfig.json`:

```json
{
  ...
  "compilerOptions": {
    "skipLibCheck": true,
    ....
  },
  ...
}

```

Com estas alterações todas, vamos precisar de um script para que os nossos testes possam ser feitos, então vamos adicionar o script seguinte no ficheiro `package.json`:

```json
{
  ....
  "scripts":{
    ...
     "jest": "jest --watch"
  }
}
```

E finalmente atualizar o ficheiro (ou arquivo) de testes que foi criado durante a inicialização da nossa aplicação, mas especificamente o ficheiro (ou arquivo) `src/app/app.component.spec.ts` para o seguinte:

```typescript
import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render the component', async () => {
    const { getByText } = await render(AppComponent);
    expect(getByText('Welcome'));
  });
});
```

Podemos rapidamente verificar que os vários ambientes da nossa aplicação estão a funcionar corretamente:

```bash
# Run the test runner (Jest) in a terminal (we will add Jest along the way):
npm run jest

# Start the component explorer on port 6006:
npm run storybook

# Run the frontend app proper on port 4200:
npm run start
```

As três modalidades de frontend da aplicação: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities-angular.png)

Dependendo de qual parte da aplicação em que está a trabalhar, pode querer executar uma ou mais simultaneamente.
Mas, visto que o nosso foco é a criação de um único componente de interface de utilizador (UI na forma original), vamos ficar somente pela execução do Storybook.

## Reutilização CSS

A Taskbox reutiliza elementos de design deste [tutorial React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), logo não precisamos escrever CSS neste tutorial. Copie e cole o [CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) no ficheiro (ou arquivo) `src/styles.css`.

E faça uma pequena alteração de forma que os ícones da fonte `percolate` que vamos usar sejam adicionados de forma correta na nossa aplicação Angular.

```css
@font-face {
  font-family: 'percolate';
  src: url('/assets/icon/percolate.eot?-5w3um4');
  src: url('/assets/icon/percolate.eot?#iefix5w3um4') format('embedded-opentype'), url('/assets/icon/percolate.woff?5w3um4')
      format('woff'), url('/assets/icon/percolate.ttf?5w3um4') format('truetype'), url('/assets/icon/percolate.svg?5w3um4')
      format('svg');
  font-weight: normal;
  font-style: normal;
}
```

![Interface Utilizador Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se quiser alterar os estilos, os arquivos ou ficheiros LESS originais encontram-se disponíveis no repositório GitHub.
</div>

## Adicionar recursos

De forma a igualar o design pretendido do tutorial, terá que transferir as pastas (ou diretórios) dos ícones e fontes para dentro da pasta `src/assets`.

<div class="aside"> Foi usado o svn (Subversion) para facilitar a transferência das pastas (ou diretórios) do GitHub. Se não tiver o subversion instalado, ou pretender transferir manualmente, pode obtê-las <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">aqui</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon src/assets/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font src/assets/font
```

Após adicionar os estilos e assets, a aplicação irá renderizar de forma estranha. Tudo bem. Não vamos trabalhar nela agora. Vamos antes começar por construir o nosso primeiro componente.
