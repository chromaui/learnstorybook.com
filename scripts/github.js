const fs = require('fs');
const shell = require('shelljs');

function getDirectories(path) {
  return fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory());
}

const contentDirectories = getDirectories('./content');

// console.log(shell.exec('git log --pretty=format:"%an%x09" content | sort | uniq'));
const directoryStats = contentDirectories.map(directory => {
  console.log(
    shell.exec(
      `git shortlog 72f788267af11594e8c86c9673fb21146c04b1e5 -n -s -- content/intro-to-storybook/`
    )
  );
});
