/**
 * @file Command line interface (CLI).
 * @author Simon Finney <simonjfinney@gmail.com>
 */

const { prompt } = require('inquirer');
const { basename } = require('path');

const manifest = require('./package.json');

// The properties to remove from the package manifest.
const properties = [
  'description',
  'author',
  'repository',
  'keywords',
  'bugs',
  'homepage',
  'dependencies',
  'bin',
];

const prompts = [
  {
    name: 'name',
    defaultValue: basename(process.cwd()), // Uses the current directory name.
  },
  {
    name: 'version',
    defaultValue: '0.1.0',
  },
];

prompt(
  prompts.map(({ defaultValue, name }) => ({
    name,
    type: 'input',
    message: name,
    default: defaultValue,
  }))
).then(answers => {
  // Deletes each unneccessary property from the package manifest.
  properties.forEach(property => delete manifest[property]);

  Object.assign({}, manifest, answers);
});
