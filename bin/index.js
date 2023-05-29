#!/usr/bin/env node

import minimist from 'minimist';

import main from '../lib/index.js';

const {
  _: [dir] = process.cwd(),
  base = 'origin/main',
  ref = 'HEAD',
  'type-filter': typeFilter = 'fix, feat, feature, breaking',
  preset = 'conventionalcommits',
  help
} = minimist(process.argv.slice(2));
const TYPES = typeFilter.split(/,\s?/).map((s) => s.trim());

if (help) {
  process.stdout.write(`
  Get a recommended version bump based on conventional commits

  Usage: whatbump [options] [path]

  Options:
    --base=...         Git ref or sha to compare against when viewing differences.
                       Defaults to 'main'
    
    --ref=...          Git ref of sha to use as the current state.
                       Defaults to 'HEAD'

    --preset=...       Changelog processor to use for determining bump method.
                       Defaults to conventionalcommits

    --type-filter=...  Comma separated list of commit types to accept, ignoring all other
                       types. Defaults to "fix, feat, feature, breaking"

`);
  process.exit(0);
}

main({
  dir,
  base,
  ref,
  preset,
  types: typeFilter.split(/,\s?/).map((s) => s.trim())
}).then(
  (level) => console.log(level),
  (err) => console.error(err)
);

