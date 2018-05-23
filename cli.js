#!/usr/bin/env node

/**
 * @file Command line interface (CLI).
 * @author Simon Finney <simonjfinney@gmail.com>
 */

const {
  copySync,
  readFileSync,
  writeFileSync,
  writeJsonSync,
} = require('fs-extra');
const { compile } = require('handlebars');
const ignore = require('ignore');
const { prompt } = require('inquirer');
const gitignore = require('parse-gitignore');
const { basename, resolve } = require('path');

const manifest = require('./package.json');

const packageManifest = 'package.json';
const readme = 'README.md';
const templates = 'templates';

// Files to ignore during the copy.
const ignoredFiles = [
  'cli.js',
  packageManifest,
  readme,
  templates,
  'yarn.lock',
];

// Adds patterns to ignore when copying.
const ig = ignore()
  .add(gitignore('.gitignore'))
  .add(ignoredFiles);

// The source destination to copy from.
const source = __dirname;

// The destination directory to copy to.
const destination = process.cwd();

// The properties to remove from the package manifest.
const propertiesToRemove = [
  'author',
  'bin',
  'bugs',
  'description',
  'dependencies',
  'homepage',
  'keywords',
  'repository',
];

// Prompts to ask the consumer.
const prompts = [
  {
    name: 'name',
    defaultValue: basename(destination), // Uses the current directory name.
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
  propertiesToRemove.forEach(
    propertyToRemove => delete manifest[propertyToRemove]
  );

  // Copies over the source to the destination, ignoring the defined patterns.
  copySync(source, destination, {
    filter: path => !ig.ignores(path),
  });

  // Copies a new package manifest with the prompt inputs.
  writeJsonSync(
    resolve(destination, packageManifest),
    Object.assign({}, manifest, answers),
    {
      spaces: '\t',
    }
  );

  // Templates and generates a new `README.md` using the prompt inputs.
  const result = compile(
    readFileSync(resolve(source, templates, readme), {
      encoding: 'utf8',
    })
  )({ name: answers.name });

  writeFileSync(resolve(destination, readme), result);
});
