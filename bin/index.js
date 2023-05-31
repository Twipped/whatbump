#!/usr/bin/env node

import minimist from 'minimist';
import { readPackageUp } from 'read-pkg-up';
import parseRepo from 'parse-repo';

import whatbump from '../lib/index.js';

const HELP = `
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

    --changelog        Output changelog body

    --json             Output both bump level and changelog as a JSON object

    --version=...      Starting semver version number. If not provided, whatbump will look
                       for a package.json in the target directory.
    
    --repo=...         Repo url for creating links in the changelog. If not provided, whatbump will look
                       for it in a package.json in the target directory.
`;

main().then(
  (result) => { process.stdout.write((result || '') + '\n'); },
  // eslint-disable-next-line no-console
  (err) => { console.error(err); }
);


async function main () {
  const {
    _: [ cwd ] = process.cwd(),
    base = 'origin/main',
    ref = 'HEAD',
    'type-filter': typeFilter = 'fix, feat, feature, breaking',
    preset = 'conventionalcommits',
    changelog: showChangelog,
    preid,
    version,
    repo,
    'no-pkg': noPkgJson,
    json,
    help,
  } = minimist(process.argv.slice(2));

  if (help) return HELP;

  const context = noPkgJson ? {} : await loadPackageContext(cwd);
  if (version) context.version = version;
  if (repo) context.repoUrl = repo;
  if (preid) context.preid = preid;

  if (context.repoUrl) {
    Object.assign(context, parseRepo(context.repoUrl));
    if (!context.host.startsWith('http')) {
      context.host = 'https://' + context.host;
    }
  }

  const result = await whatbump({
    cwd,
    base,
    ref,
    preset,
    types: typeFilter.split(/,\s?/).map((s) => s.trim()),
    context,
  });

  if (json) return JSON.stringify(result, null, 2);
  if (showChangelog) return result.changelog;
  return result.level;
}

async function loadPackageContext (cwd) {
  const { packageJson: pkg } = await readPackageUp({ cwd });
  const { version } = pkg;

  return {
    version,
    repoUrl: pkg?.repository?.url,
  };
}
