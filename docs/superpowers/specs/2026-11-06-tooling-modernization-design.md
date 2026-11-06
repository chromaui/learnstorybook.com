# Tooling modernization for learnstorybook.com

- Date: 2026-11-06
- Branch: `chore/modernize-tooling`, cut from `master` at 0435e725 and carrying the
  "Minimal amount of modernisation to run repo" commit (38d39cae)
- Status: design approved in conversation, spec awaiting review

## Context

The repository's build, lint, and Storybook tooling has not been maintained for several
years. The `project/ai-ready-ds-guide` branch adds new guide content on top of a small
tooling fix. That fix now lives on its own branch so the toolchain can be modernized
independently. Once this work is done, the content branch is rebased onto this branch.
The cherry-picked tooling commit has the same patch-id as the original, so the rebase
drops the duplicate automatically.

## Goal

Bring every dependency and the surrounding toolchain to its latest stable version wherever
peer constraints allow, in small verified commits.

Done means that on Node 24 with Yarn 4 all of the following pass:

- `yarn install --immutable`
- `yarn build`
- `yarn lint` and `yarn format:check`
- `yarn test`
- `yarn build-storybook`
- a browser smoke test of the served site and of the built Storybook
- CircleCI, the Chromatic GitHub workflow, and the README reflect the new setup

## Non-goals

- React 19. Gatsby 5 accepts it, but the Chromatic UI packages below are frozen on
  React 17 peers and already run on 18 by tolerance. 18.3.1 is the target.
- Migrating `react-helmet` to Gatsby's Head API.
- Replacing the 46 `@storybook/theming` imports with direct emotion imports.
- Removing `gatsby-plugin-google-analytics`. It stays, bumped to the Gatsby 5 line.
- Content changes beyond the one-off Prettier 3 reformat.
- Moving Storybook to the webpack5 framework. The user chose `@storybook/react-vite`.

## Constraints found during research

| Constraint | Source | Consequence |
| --- | --- | --- |
| Node must be `>=18 <26` | gatsby 5.16.1 engines | Node 24 LTS is the target; Node 26 is excluded |
| Node must be `>=22.22.1` | lint-staged 17 engines | engines range starts at 22.22.1 |
| `@storybook/components-marketing` 3.3.0 is the latest release | npm | It pins `@storybook/theming ^6.5`, `framer-motion ^7`, `@docsearch/css ^3`, React peers up to 17 |
| `@storybook/design-system` 7.15.19 is the latest release | npm | Minor bump from the pinned 7.8.5, same React peers |
| `eslint-config-airbnb` 19.0.4 is eslintrc-only and last released in 2021 | npm | Replaced by a lean maintained set |
| `@babel/eslint-parser` 8 needs Babel 8, Gatsby needs Babel 7 | npm peers | Parser dropped; espree parses the codebase |
| ESLint 9 reached end of life in 2026 | ESLint release dates | ESLint 10 is the only supported line |
| `@vitejs/plugin-react` 6 requires Vite 8 | npm peers | Vite 8.3 with plugin-react 6.2 |
| Yarn 4.18 runs here without corepack; lockfile is still v1 | local inspection | Lockfile is migrated once and committed |
| `query-string` 8+ is ESM-only | npm | Replaced by `URLSearchParams` in its single consumer |

## Decisions made with the user

- ESLint rule set: lean maintained set, not airbnb through a compat shim.
- Storybook: migrate to 10 now, on the react-vite framework.
- Cleanups included: patch-package to `yarn patch`; design-system bump to 7.15.19.
- Cleanups excluded: dropping the Google Analytics plugin.

## Design by area

### 1. Node and Yarn

Files: `.nvmrc`, `.node-version`, `package.json`, `.yarnrc.yml`, `.gitignore`, `yarn.lock`.

- `.nvmrc` and `.node-version` become `24`.
- `packageManager` becomes `yarn@4.18.1`. An `engines.node` of `>=22.22.1 <26` documents
  the combined Gatsby and lint-staged constraint. Yarn 4 does not enforce engines, so this
  is documentation, not a gate.
- `.yarnrc.yml` keeps `nodeLinker: node-modules` and `npmMinimalAgeGate: 0`. It drops
  `enableScripts: true` and `approvedGitRepositories`, which are defaults and unused since
  the lockfile has no git dependencies.
- `.gitignore` replaces the blanket `.yarn/*` with the standard Berry block that tracks
  `.yarn/patches`, `.yarn/plugins`, `.yarn/releases`, `.yarn/sdks`, `.yarn/versions` and
  ignores `.pnp.*`.
- One `yarn install` migrates `yarn.lock` to the Berry format. The migrated lockfile is
  committed before any dependency changes so later diffs stay readable.

### 2. patch-package to yarn patch

Files: `package.json`, `patches/gatsby-plugin-plausible+0.0.7.patch`, `.yarn/patches/`.

- The existing patch is re-applied through `yarn patch gatsby-plugin-plausible` and
  committed as a `patch:` protocol resolution in `package.json`.
- `patch-package` and the `postinstall` script are removed, along with the `patches/`
  directory.

### 3. Gatsby 5

Files: `package.json`, `src/components/composite/AppLayout.js`,
`src/components/screens/IndexScreen/index.js`,
`plugins/gatsby-remark-code-buttons-with-diff-support/index.js`.

- `gatsby` and every `gatsby-*` dependency move to the matching 5.16 line (`gatsby`,
  `gatsby-plugin-google-analytics`, `gatsby-plugin-google-gtag`, `gatsby-plugin-react-helmet`,
  `gatsby-plugin-sharp`, `gatsby-plugin-sitemap`, `gatsby-remark-copy-linked-files`,
  `gatsby-remark-images`, `gatsby-source-filesystem`, `gatsby-transformer-remark`).
  `babel-preset-gatsby` moves to 3. `gatsby-plugin-plausible` and
  `gatsby-remark-code-titles` have no newer versions and stay.
- The two page queries using the Gatsby 4 `sort: { order, fields: [frontmatter___order] }`
  form are rewritten to the nested `sort: { frontmatter: { order: ASC } }` form.
- The `resolutions.deepmerge` entry is removed. It is restored only if the build fails
  without it.
- The custom remark plugin parses its code-fence parameters with `URLSearchParams`
  instead of `query-string`, which is then removed.
- `@babel/core` stays on the 7 line at its latest 7.x, since `babel-preset-gatsby` and
  Gatsby itself require Babel 7.

### 4. Prettier 3

Files: `.prettierrc.js`, 20 Markdown files under `content/`, `src/components/basics/ShadowBox.js`,
`src/html.js`.

- `jsxBracketSameLine` is removed from the config. Its value matched Prettier 3's default
  for the replacement option, so output is unchanged for that rule. All other options stay.
- The 22 files that Prettier 3 formats differently are rewritten in one dedicated commit
  so the config commit and the formatting commit can be reviewed separately.

### 5. ESLint 10

Files: `eslint.config.mjs` (new), `.eslintrc.js` and `.eslintignore` (deleted), `package.json`.

- Flat config composed of, in order: `@eslint/js` recommended, `eslint-plugin-react`
  recommended and jsx-runtime, `eslint-plugin-react-hooks` recommended,
  `eslint-plugin-jsx-a11y` recommended, `eslint-plugin-import` recommended,
  `eslint-plugin-storybook` recommended, then `eslint-config-prettier`.
- Language options: latest ECMAScript, module source type, JSX enabled, browser globals,
  plus the `graphql` global as read-only. The default espree parser replaces
  `@babel/eslint-parser`.
- Repo rules carried over: `import/no-extraneous-dependencies` allowing devDependencies in
  `**/*.stories.js`, `**/*.test.js`, `.storybook/**`, and `eslint.config.mjs`;
  `jsx-a11y/anchor-is-valid` configured for `GatsbyLink` with `to`;
  `react/jsx-filename-extension` allowing `.js` and `.jsx`. The airbnb-only rules the repo
  switched off (`react/jsx-props-no-spreading`, `react/jsx-one-expression-per-line`,
  `react/jsx-wrap-multilines`) need no counterpart because the lean set never enables them.
- Overrides carried over: `site-metadata.js` with `import/extensions` and
  `import/no-unresolved` off; `**/*.test.js`, `src/lib/*.js`, `src/utils/*.js` with Node
  globals and `import/extensions` off.
- Ignores carried over from `.eslintignore`: `.cache`, `public`, `src/html.js`,
  `node_modules`, `storybook-static`, plus `.yarn` and `src/content/docs`.
- Removed packages: `@babel/eslint-parser`, `eslint-config-airbnb`,
  `eslint-plugin-prettier`, `prettier-eslint`, `prettier-eslint-cli`, `babel-loader`.
  Added: `@eslint/js`, `globals`, `eslint-plugin-react-hooks`.
- Scripts: `lint` stays `eslint .`; `format` becomes `prettier --write . && eslint --fix .`;
  a new `format:check` runs `prettier --check .`. Prettier no longer runs as an ESLint rule.
- Expected behaviour change: formatting problems were warnings inside `yarn lint` and are
  now a hard failure of `yarn format:check` in CI. Rule differences between airbnb and the
  lean set are resolved by fixing code or, where a rule adds no value for this repo,
  disabling it with a one-line comment in the config.

### 6. Husky and lint-staged

Files: `package.json`, `.husky/pre-commit`.

- `prepare` becomes `husky`. The pre-commit hook drops the shebang and the `husky.sh`
  sourcing line, which Husky 9 deprecates and Husky 10 rejects, leaving `yarn lint-staged`.
- lint-staged config drops the obsolete `git add` entry and adds a `*.{js,mjs}` entry
  running `prettier --write` then `eslint --fix`. Markdown keeps `prettier --write`.

### 7. Storybook 10 on Vite

Files: `.storybook/main.js`, `.storybook/preview.js`, `package.json`,
`src/components/screens/ChapterScreen/LanguageSelector.stories.js`,
`src/components/screens/ChapterScreen/FrameworkSelector.stories.js`.

- Dependencies: `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`,
  `@storybook/addon-a11y`, `@storybook/addon-links`, all at 10.6; `vite` 8.3;
  `@vitejs/plugin-react` 6.2; `babel-plugin-remove-graphql-queries` 5.16 declared
  explicitly since the config imports it. Removed: `@storybook/react`,
  `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/addons`,
  `@storybook/builder-webpack5`, `@storybook/manager-webpack5`, `@storybook/jest`,
  `@storybook/testing-library`.
- `main.js` keeps its name and is written in ES module syntax, which Storybook's config
  loader accepts regardless of the package's module type. It exports: the same stories glob; the three addons;
  `framework: '@storybook/react-vite'`; `staticDirs: ['../static']` replacing the old `-s`
  flag; the existing `env` hook for the Algolia key; and a `viteFinal` that merges a
  `@vitejs/plugin-react` instance configured with `configFile: false`, `babelrc: false`,
  and exactly two Babel plugins: `@emotion/babel-plugin` with the existing theming import
  map, and `babel-plugin-remove-graphql-queries` with `stage: 'develop-html'` and
  `staticQueryDir: 'page-data/sq/d'`. Config-file loading is off so the Gatsby preset's
  browser targets and core-js injection do not apply inside Vite.
- `preview.js` moves to a default export with the same `parameters` and `decorators`,
  imports `action` from `storybook/actions` (today it is used without an import), and sets
  `___loader`, `__PATH_PREFIX__`, `__BASE_PATH__` on `globalThis` and `___navigate` on
  `window`.
- The two stories importing from `@storybook/testing-library` import the same helpers from
  `storybook/test`.
- Scripts: `storybook` becomes `storybook dev -p 6006`; `build-storybook` becomes
  `storybook build`. The `prestorybook` and `prebuild-storybook` Gatsby builds stay,
  because the static query results that the Babel plugin inlines come from them.
- Fallback: Vite prebundles Gatsby's untranspiled ESM browser entry, which webpack never
  had to. If that fails on undefined globals or `process` references, `viteFinal` adds a
  `resolve.alias` from `gatsby` to `.storybook/gatsby-mock.js`, a small module exporting
  `Link` as an anchor that calls `window.___navigate`, `navigate`, `withPrefix`, a no-op
  `graphql`, and a `useStaticQuery` stub. The stub is unreachable once the Babel plugin
  has inlined the query data and exists only so the import resolves. This is the same
  pattern Gatsby documents for Jest. Which path landed is reported in the commit message.

### 8. Chromatic and CI

Files: `.github/workflows/chromatic.yml`, `.circleci/config.yml`, `package.json`.

- `chromatic` CLI moves to 18.
- The GitHub workflow moves `actions/checkout` and `actions/setup-node` to v7 with Node 24, adds a `corepack enable` step before `yarn install --immutable`,
  moves `chromaui/action` to v18, and fixes the trailing comma that currently sets
  `allowConsoleErrors` to the string `true,`.
- CircleCI moves to `cimg/node:24.22`, enables corepack, installs immutably, caches
  `node_modules` keyed on the `yarn.lock` checksum, and runs `yarn lint`,
  `yarn format:check`, `yarn test`, then the existing `GATSBY_CPU_COUNT=1 yarn build`.

### 9. Remaining libraries

Files: `package.json`, `src/utils/source-dx-data.js`.

- Bumped within allowed majors: `cheerio` 1.2, `formik` 2.4, `lodash` 4.18, `polished` 4.3,
  `prismjs` 1.30, `@docsearch/css` 3.9, `framer-motion` 7.10, `@storybook/theming` latest
  6.5, `@emotion/babel-plugin` 11.13, `react` and `react-dom` 18.3.1.
- `node-fetch` is removed; its single consumer uses the global `fetch` available on Node 18+.
- Unchanged because no newer release exists or the peer is frozen:
  `@storybook/components-marketing`, `react-github-button`, `react-helmet`, `pluralize`,
  `prop-types`, `gatsby-plugin-plausible`, `gatsby-remark-code-titles`.

### 10. README

File: `README.md`.

- The contributor setup steps mention Node 24 via `.nvmrc`, Yarn 4 through corepack, and
  the new `storybook dev` entry point. No other README changes.

## Commit sequence

Each step is one commit and is verified before the next starts.

| # | Commit | Verification |
| --- | --- | --- |
| 1 | Target Node 24 and adopt Yarn 4 | `yarn install --immutable`, `yarn build`, `yarn test` |
| 2 | Replace patch-package with yarn patch | immutable install, patched file content check, `yarn build` |
| 3 | Upgrade Gatsby to 5.16 and plugins | immutable install, `yarn build`, `yarn test`, served site renders |
| 4a | Upgrade Prettier to 3 | `yarn format:check` lists exactly the 22 known files |
| 4b | Reformat for Prettier 3 | `yarn format:check` clean |
| 5 | Migrate ESLint to 10 flat config | `yarn lint` clean, `yarn format:check` clean |
| 6 | Upgrade Husky 9 and lint-staged 17 | `yarn prepare`, a throwaway commit exercises the hook, then is dropped |
| 7 | Migrate Storybook to 10 on react-vite | `yarn build-storybook`, stories render in the browser pane |
| 8 | Update Chromatic, CircleCI, and GitHub workflow | YAML parses, scripts referenced exist, CI runs on push |
| 9 | Bump remaining libraries and drop node-fetch | immutable install, `yarn build`, `yarn test` |
| 10 | Document the new setup in the README | read-through |

The Gatsby prebuild scripts download the Storybook docs tarball from GitHub, so build
verification needs network access.

## Risks and fallbacks

- Gatsby inside Vite may not prebundle cleanly. Fallback: the alias mock described in
  section 7.
- The lean ESLint set may surface rule hits airbnb did not. Each is fixed or disabled with
  a one-line reason; the lint commit message lists the rules disabled.
- The design-system minor bump may change visuals. Chromatic surfaces any diff on the
  pull request.
- Removing `resolutions.deepmerge` may break the Gatsby build. It is restored in the same
  commit if so.
- Netlify is configured outside the repo. It reads `.nvmrc` for Node and enables corepack
  when `packageManager` is set, but that cannot be verified from the repository. The first
  deploy preview is the check, and a `NODE_VERSION` or corepack setting may need changing
  in the Netlify UI.

## After this branch

- Rebase `project/ai-ready-ds-guide` onto `chore/modernize-tooling`. The duplicate tooling
  commit drops automatically by patch-id.
- Decide whether this spec file ships in the pull request or is removed first.
