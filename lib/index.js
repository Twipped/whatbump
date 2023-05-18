#!/usr/bin/env node

import {
  getCommits,
  parseCommits
} from '@coveo/semantic-monorepo-tools';

import presetLoader from './preset-loader.js';
import revertFilter from 'conventional-commits-filter';

const VERSIONS = ['major', 'minor', 'patch'];

export default async function main({
  dir,
  base,
  ref,
  preset,
  types,
}) {
  const { whatBump, parserOpts } = await presetLoader(preset);

  let commits = await getCommits(dir, base, ref);
  commits = parseCommits(commits, parserOpts);
  commits = revertFilter(commits).filter(({ type }) => types.includes(type));
  if (!commits.length) return '';

  const { level } = whatBump(commits);
  return VERSIONS[level];
}
