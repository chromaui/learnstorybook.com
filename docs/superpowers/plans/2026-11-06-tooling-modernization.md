# Tooling Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring learnstorybook.com's toolchain to current stable versions on Node 24 and Yarn 4, one verified commit per subsystem, then rebase the content branch onto it.

**Architecture:** Each task edits `package.json` and the lockfile for one subsystem, migrates that subsystem's config files, and proves the result with the repo's own scripts before committing. Later tasks assume earlier ones landed. Storybook moves from the webpack5 builder to the react-vite framework, with Gatsby's static-query Babel plugin wired through the Vite react plugin.

**Tech Stack:** Node 24, Yarn 4.18.1, Gatsby 5.16, React 18.3, Storybook 10.6 on Vite 8, ESLint 10 flat config, Prettier 3, Husky 9, lint-staged 17, Chromatic 18.

**Spec:** `docs/superpowers/specs/2026-11-06-tooling-modernization-design.md`

## Global Constraints

- Node engines range is `>=22.22.1 <26`; `.nvmrc` and `.node-version` say `24`.
- `packageManager` is `yarn@4.18.1`; `nodeLinker` stays `node-modules`; `npmMinimalAgeGate: 0` stays.
- React stays on 18 (`18.3.1`). No React 19.
- `@storybook/components-marketing` stays at `3.3.0`; `@storybook/theming` stays on the 6.5 line; `framer-motion` stays on 7; `@docsearch/css` stays on 3.
- `gatsby-plugin-google-analytics` stays, on the 5.16 line.
- Every task ends with `yarn install --immutable` exiting 0 before its commit.
- Build verification needs network access: the Gatsby prebuild downloads the Storybook docs tarball.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. `yarn dev` (Gatsby develop) on Node 24, not only `yarn build`: Task 3 adds a develop-server smoke test.
2. `storybook dev` on Vite, not only `storybook build`: Vite prebundling differs between dev and build, so Task 7 smoke-tests both.
3. The pre-commit hook on a staged Markdown file and on a staged JS file: Task 6 exercises both entries with lint-staged directly.
4. A fresh install applying the yarn patch: Task 2 verifies the patched file content in `node_modules` after reinstall, not just lockfile state.
5. `prettier --check .` scanning build output and extracted docs: Task 4a extends `.prettierignore` so the check covers only source.

---

### Task 1: Node 24 and Yarn 4

**Files:**
- Modify: `.nvmrc`, `.node-version`, `package.json`, `.yarnrc.yml`, `.gitignore`, `yarn.lock`

**Interfaces:**
- Produces: Berry-format `yarn.lock`; `packageManager: yarn@4.18.1`; every later task runs `yarn install` under Yarn 4.

- [ ] **Step 1: Select Node 24 for the session**

Run: `fnm ls` and, if a 24.x is listed, `fnm use 24`; otherwise run on the installed Node 25 and note it in the commit message. Expected: `node --version` prints `v24.x` or `v25.6.1`.

- [ ] **Step 2: Edit version pins**

`.nvmrc` and `.node-version` contain `24`. In `package.json` set `"packageManager": "yarn@4.18.1"` and add `"engines": { "node": ">=22.22.1 <26" }`.

- [ ] **Step 3: Rewrite `.yarnrc.yml`**

Exactly two keys: `nodeLinker: node-modules` and `npmMinimalAgeGate: 0`.

- [ ] **Step 4: Replace the `.gitignore` yarn block**

Replace `.yarn/*` with:

```
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

- [ ] **Step 5: Migrate the lockfile**

Run: `yarn install`. Expected: exit 0, `yarn.lock` now starts with `__metadata:`, `git status` shows only the six files above changed.

- [ ] **Step 6: Verify**

Run: `yarn install --immutable && yarn test && yarn build`. Expected: all exit 0; `public/tutorials/index.html` exists.

- [ ] **Step 7: Commit**

`chore: target Node 24 and adopt Yarn 4`

### Task 2: patch-package to yarn patch

**Files:**
- Create: `.yarn/patches/gatsby-plugin-plausible-npm-0.0.7-*.patch`
- Modify: `package.json`
- Delete: `patches/gatsby-plugin-plausible+0.0.7.patch`

**Interfaces:**
- Produces: a `resolutions` entry `"gatsby-plugin-plausible@npm:^0.0.7": "patch:gatsby-plugin-plausible@npm%3A0.0.7#~/.yarn/patches/<file>"`.

- [ ] **Step 1: Open a patch workspace**

Run: `yarn patch gatsby-plugin-plausible`. Expected: prints a temp directory path.

- [ ] **Step 2: Apply the existing diff there**

Run: `patch -p2 -d <tempdir> < patches/gatsby-plugin-plausible+0.0.7.patch`. Expected: `patching file gatsby-ssr.js`, no rejects.

- [ ] **Step 3: Commit the patch into Yarn**

Run: `yarn patch-commit -s <tempdir>`. Expected: a file under `.yarn/patches/` and a `resolutions` entry in `package.json`.

- [ ] **Step 4: Remove patch-package**

In `package.json` delete the `postinstall` script and the `patch-package` devDependency. Run `git rm -r patches`.

- [ ] **Step 5: Verify a fresh install applies it**

Run: `yarn install && yarn install --immutable && grep -c "data-api" node_modules/gatsby-plugin-plausible/gatsby-ssr.js`. Expected: exit 0 and `1`.

- [ ] **Step 6: Commit**

`chore: replace patch-package with yarn patch`

### Task 3: Gatsby 5

**Files:**
- Modify: `package.json`, `src/components/composite/AppLayout.js:120`, `src/components/screens/IndexScreen/index.js:145`, `plugins/gatsby-remark-code-buttons-with-diff-support/index.js:1-8`

**Interfaces:**
- Produces: Gatsby 5 GraphQL schema; `page-data/sq/d` static query output consumed by Task 7.

- [ ] **Step 1: Bump ranges in `package.json`**

`gatsby ^5.16.1`, `gatsby-plugin-google-analytics ^5.16.0`, `gatsby-plugin-google-gtag ^5.16.0`, `gatsby-plugin-react-helmet ^6.16.0`, `gatsby-plugin-sharp ^5.16.0`, `gatsby-plugin-sitemap ^6.16.0`, `gatsby-remark-copy-linked-files ^6.16.0`, `gatsby-remark-images ^7.16.0`, `gatsby-source-filesystem ^5.16.0`, `gatsby-transformer-remark ^6.16.0`, `babel-preset-gatsby ^3.16.0`, `@babel/core ^7.29.0`. Delete the `resolutions.deepmerge` entry. Delete `query-string`.

- [ ] **Step 2: Rewrite the two sort clauses**

Both become `sort: { frontmatter: { order: ASC } }`.

- [ ] **Step 3: Replace query-string in the remark plugin**

`const actions = Object.fromEntries(new URLSearchParams(params));` and drop the `qs` require and the eslint-disable comment if nothing else needs it.

- [ ] **Step 4: Install and build**

Run: `yarn install && yarn install --immutable && yarn test && yarn build`. Expected: exit 0. If the build fails on `deepmerge`, restore the resolution and rerun.

- [ ] **Step 5: Smoke-test serve and develop**

Run `yarn serve` through the browser preview and open `/tutorials/`; expected: the index page lists the guides. Run `yarn dev` the same way; expected: the same page on port 8000 with no console errors from Gatsby.

- [ ] **Step 6: Commit**

`chore: upgrade Gatsby to 5.16`

### Task 4a: Prettier 3 config

**Files:**
- Modify: `package.json`, `.prettierrc.js`, `.prettierignore`

**Interfaces:**
- Produces: `yarn format:check` script used by Task 5, Task 6, and CI.

- [ ] **Step 1: Bump and script**

`prettier ^3.9.10`. Add `"format:check": "prettier --check ."`.

- [ ] **Step 2: Config**

Delete `jsxBracketSameLine` from `.prettierrc.js`.

- [ ] **Step 3: Ignore non-source**

`.prettierignore` lists: `yarn.lock`, `package-lock.json`, `.cache`, `public`, `storybook-static`, `src/content/docs`, `site-metadata.js`, `.yarn`, `node_modules`.

- [ ] **Step 4: Verify the drift set**

Run: `yarn install --immutable && yarn format:check`. Expected: exit 1, every listed path is under `content/`, `src/`, `.storybook/`, `.github/`, `.circleci/`, `docs/`, or the repo root.

- [ ] **Step 5: Commit**

`chore: upgrade Prettier to 3`

### Task 4b: Reformat for Prettier 3

- [ ] **Step 1: Run** `yarn prettier --write .`
- [ ] **Step 2: Verify** `yarn format:check` exits 0 and `git diff --stat` touches only files listed in Task 4a Step 4.
- [ ] **Step 3: Commit** `style: reformat for Prettier 3`

### Task 5: ESLint 10 flat config

**Files:**
- Create: `eslint.config.mjs`
- Delete: `.eslintrc.js`, `.eslintignore`
- Modify: `package.json`

**Interfaces:**
- Produces: `yarn lint` and `yarn format` scripts; `eslint --fix` used by Task 6.

- [ ] **Step 1: Dependencies**

Remove `@babel/eslint-parser`, `eslint-config-airbnb`, `eslint-plugin-prettier`, `prettier-eslint`, `prettier-eslint-cli`, `babel-loader`. Set `eslint ^10.14.0`, `eslint-config-prettier ^10.1.8`, `eslint-plugin-import ^2.32.0`, `eslint-plugin-jsx-a11y ^6.10.2`, `eslint-plugin-react ^7.37.5`, `eslint-plugin-storybook ^10.6.6`. Add `@eslint/js`, `globals`, `eslint-plugin-react-hooks` at latest.

- [ ] **Step 2: Scripts**

`"lint": "eslint ."`, `"format": "prettier --write . && eslint --fix ."`.

- [ ] **Step 3: Write `eslint.config.mjs`**

Default export array, in order: global `ignores` (`.cache`, `public`, `storybook-static`, `node_modules`, `.yarn`, `src/content/docs`, `src/html.js`); `js.configs.recommended`; `react.configs.flat.recommended` and `react.configs.flat['jsx-runtime']`; `reactHooks.configs.flat.recommended`; `jsxA11y.flatConfigs.recommended`; `importPlugin.flatConfigs.recommended`; `...storybook.configs['flat/recommended']`; a repo block with `languageOptions` (ecmaVersion latest, sourceType module, jsx on, `globals.browser`, `graphql: 'readonly'`), `settings.react.version: 'detect'`, and the rules from spec section 5; the `site-metadata.js` override; the Node ESM override for `**/*.test.js`, `src/lib/*.js`, `src/utils/*.js`; `prettier` last.

- [ ] **Step 4: Remove old config**

`git rm .eslintrc.js .eslintignore`.

- [ ] **Step 5: Lint and fix**

Run: `yarn install && yarn install --immutable && yarn lint`. Fix each hit in code or disable the rule with a one-line reason in the config. Expected: `yarn lint` exit 0, `yarn format:check` exit 0.

- [ ] **Step 6: Commit**

`chore: migrate ESLint to 10 with flat config`, body listing every rule disabled and why.

### Task 6: Husky 9 and lint-staged 17

**Files:**
- Modify: `package.json`, `.husky/pre-commit`

- [ ] **Step 1: Bump and scripts**

`husky ^9.1.7`, `lint-staged ^17.6.0`, `"prepare": "husky"`. lint-staged config: `"*.md": ["prettier --write"]`, `"*.{js,mjs}": ["prettier --write", "eslint --fix"]`.

- [ ] **Step 2: Hook file**

`.husky/pre-commit` contains only `yarn lint-staged`.

- [ ] **Step 3: Verify hook install**

Run: `yarn install --immutable && yarn prepare && cat .git/hooks/pre-commit`. Expected: the hook delegates to `.husky/`.

- [ ] **Step 4: Exercise both entries**

Append a trailing space to a line in `README.md` and to a line in `src/lib/getLanguageName.js`, `git add` both, run `yarn lint-staged`. Expected: exit 0 and `git diff --cached` shows no trailing space. Then `git restore --staged --worktree README.md src/lib/getLanguageName.js`.

- [ ] **Step 5: Commit**

`chore: upgrade Husky to 9 and lint-staged to 17`

### Task 7: Storybook 10 on react-vite

**Files:**
- Modify: `.storybook/main.js`, `.storybook/preview.js`, `package.json`, `src/components/screens/ChapterScreen/LanguageSelector.stories.js:2`, `src/components/screens/ChapterScreen/FrameworkSelector.stories.js:2`
- Create (fallback only): `.storybook/gatsby-mock.js`

**Interfaces:**
- Consumes: `page-data/sq/d` from a Gatsby build (Task 3).
- Produces: `yarn storybook` and `yarn build-storybook` scripts used by the Chromatic workflow (Task 8).

- [ ] **Step 1: Dependencies**

Remove `@storybook/react`, `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/addons`, `@storybook/builder-webpack5`, `@storybook/manager-webpack5`, `@storybook/jest`, `@storybook/testing-library`. Add `storybook ^10.6.6`, `@storybook/react-vite ^10.6.6`, `@storybook/addon-docs ^10.6.6`, `@storybook/addon-a11y ^10.6.6`, `@storybook/addon-links ^10.6.6`, `vite ^8.3.6`, `@vitejs/plugin-react ^6.2.1`, `babel-plugin-remove-graphql-queries ^5.16.0`.

- [ ] **Step 2: Scripts**

`"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`. Keep `prestorybook` and `prebuild-storybook`.

- [ ] **Step 3: Rewrite `.storybook/main.js`**

ES module syntax. Export `stories: ['../src/components/**/*.stories.js']`, `addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-links']`, `framework: '@storybook/react-vite'`, `staticDirs: ['../static']`, the existing `env` hook, and `viteFinal(config)` that merges `plugins: [react({ babel: { configFile: false, babelrc: false, plugins: [emotionPlugin, removeGraphqlPlugin] } })]` where `emotionPlugin` is `['@emotion/babel-plugin', { importMap }]` with the import map copied from `babel.config.js` and `removeGraphqlPlugin` is `['babel-plugin-remove-graphql-queries', { stage: 'develop-html', staticQueryDir: 'page-data/sq/d' }]`.

- [ ] **Step 4: Rewrite `.storybook/preview.js`**

Add `import { action } from 'storybook/actions'`. Set `globalThis.___loader`, `globalThis.__PATH_PREFIX__ = ''`, `globalThis.__BASE_PATH__ = ''`, keep `window.___navigate`. Export `default { parameters, decorators }` with the existing values.

- [ ] **Step 5: Stories**

Both files import `{ within, userEvent }` from `storybook/test`.

- [ ] **Step 6: Build**

Run: `yarn install && yarn install --immutable && yarn build-storybook`. Expected: exit 0, `storybook-static/index.html` exists. If Vite fails inside the `gatsby` package, create `.storybook/gatsby-mock.js` per spec section 7 and add `resolve.alias: { gatsby: <path> }` to `viteFinal`, then rerun.

- [ ] **Step 7: Smoke-test dev and build output**

Run `yarn exec storybook dev -p 6006 --ci` through the browser preview. Expected: the sidebar lists the 32 story files and the `Screens/IndexScreen` story renders without a red error overlay. Then serve `storybook-static` and check the same story.

- [ ] **Step 8: Lint**

Run: `yarn lint && yarn format:check`. Expected: exit 0.

- [ ] **Step 9: Commit**

`chore: migrate Storybook to 10 on react-vite`, body stating whether the real `gatsby` package or the mock alias landed.

### Task 8: Chromatic and CI

**Files:**
- Modify: `.github/workflows/chromatic.yml`, `.circleci/config.yml`, `package.json`

- [ ] **Step 1: Chromatic CLI** `chromatic ^18.14.1`.

- [ ] **Step 2: GitHub workflow**

`actions/checkout@v7`; `actions/setup-node@v7` with `node-version: 24`; a `run: corepack enable` step; `run: yarn install --immutable`; keep the telemetry and build-storybook steps; `chromaui/action@v18`; `allowConsoleErrors: true` and `exitZeroOnChanges: true` without trailing commas.

- [ ] **Step 3: CircleCI**

Image `cimg/node:24.22`; cache key `v3-dependencies-{{ checksum "yarn.lock" }}`; steps `corepack enable`, `yarn install --immutable`, save cache, `yarn lint`, `yarn format:check`, `yarn test`, `GATSBY_CPU_COUNT=1 yarn build`.

- [ ] **Step 4: Verify**

Run: `yarn install --immutable && node -e "const y=require('js-yaml');for(const f of ['.github/workflows/chromatic.yml','.circleci/config.yml'])y.load(require('fs').readFileSync(f,'utf8'))"`. Expected: exit 0. Confirm every `yarn <script>` named in both files exists in `package.json`.

- [ ] **Step 5: Commit** `ci: run on Node 24 with Yarn 4 and Chromatic 18`

### Task 9: Remaining libraries

**Files:**
- Modify: `package.json`, `src/utils/source-dx-data.js:1-2`

- [ ] **Step 1: Bumps**

`cheerio ^1.2.0`, `formik ^2.4.9`, `lodash ^4.18.1`, `polished ^4.3.1`, `prismjs ^1.30.0`, `@docsearch/css ^3.9.0`, `framer-motion 7.10.3`, `@storybook/theming ^6.5.16`, `@emotion/babel-plugin ^11.13.5`, `react 18.3.1`, `react-dom 18.3.1`, `@storybook/design-system 7.15.19`. Remove `node-fetch`.

- [ ] **Step 2: Native fetch**

Delete the first two lines of `src/utils/source-dx-data.js`.

- [ ] **Step 3: Verify**

Run: `yarn install && yarn install --immutable && yarn lint && yarn test && yarn build && yarn build-storybook`. Expected: exit 0.

- [ ] **Step 4: Commit** `chore: bump remaining dependencies and drop node-fetch`

### Task 10: README

- [ ] **Step 1: Edit** the two setup lists in `README.md`: install step mentions Node 24 via `.nvmrc` and `corepack enable` for Yarn 4; Storybook step keeps `yarn storybook`.
- [ ] **Step 2: Verify** `yarn format:check` exit 0.
- [ ] **Step 3: Commit** `docs: describe Node 24 and Yarn 4 setup`

### Task 11: Rebase the content branch

- [ ] **Step 1: Rebase**

Run: `git rebase chore/modernize-tooling project/ai-ready-ds-guide`. Expected: one commit replayed, the duplicate tooling commit reported as already applied.

- [ ] **Step 2: Verify on the content branch**

Run: `yarn install --immutable && yarn lint && yarn format:check && yarn test && yarn build && yarn build-storybook`. Expected: exit 0. Fix content-branch lint or format hits in a follow-up commit on that branch.

- [ ] **Step 3: Return** to `chore/modernize-tooling` and report both branch heads. Do not push.
