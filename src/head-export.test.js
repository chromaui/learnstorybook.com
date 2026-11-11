const { test } = require('node:test');
const assert = require('node:assert/strict');
const { globSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { transformAsync } = require('@babel/core');

/**
 * Gatsby compiles every page file twice: once without its `Head` export for the page itself, once
 * without its default export for the document head, each time pruning what only the removed export
 * used. Anything else that still refers to the removed binding (`Head.propTypes = …`, say) throws
 * a ReferenceError when that module loads, and only the develop server shows it because the
 * production build strips propTypes anyway. This runs Gatsby's own transform over every file that
 * exports a `Head` and checks that no reference is left dangling.
 */
async function unboundIdentifiers(file, apis) {
  let globals;
  await transformAsync(readFileSync(file, 'utf8'), {
    filename: file,
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('babel-preset-gatsby/babel-preset-react'),
        { useBuiltIns: true, pragma: 'React.createElement', development: true },
      ],
    ],
    plugins: [
      ...(apis.length
        ? [[require.resolve('gatsby/dist/utils/babel/babel-plugin-remove-api'), { apis }]]
        : []),
      () => ({
        visitor: {
          Program: {
            exit(programPath) {
              programPath.scope.crawl();
              globals = Object.keys(programPath.scope.globals);
            },
          },
        },
      }),
    ],
  });
  return globals;
}

const headExporters = globSync('**/*.js', { cwd: __dirname, exclude: ['**/*.test.js'] }).filter(
  (file) =>
    /^export (?:function|const) Head\b/m.test(readFileSync(path.join(__dirname, file), 'utf8'))
);

test('at least one page file exports a Head', () => {
  assert.ok(headExporters.length > 0, 'no file under src exports a Head');
});

for (const file of headExporters) {
  const fullPath = path.join(__dirname, file);

  for (const [removed, module] of [
    ['Head', 'page'],
    ['default', 'head'],
  ]) {
    test(`${file} resolves every identifier once Gatsby strips its ${removed} export`, async () => {
      const before = await unboundIdentifiers(fullPath, []);
      const after = await unboundIdentifiers(fullPath, [removed]);
      assert.deepEqual(
        after.filter((id) => !before.includes(id)),
        [],
        `identifiers left dangling in the ${module} module`
      );
    });
  }
}
