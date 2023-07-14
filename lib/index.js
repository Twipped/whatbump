import {
  getCommits,
  parseCommits,
} from '@coveo/semantic-monorepo-tools';
import changelogWriter from "conventional-changelog-writer";
import { Readable } from 'node:stream';
import { SemVer } from 'semver';

import presetLoader from './preset-loader.js';
import revertFilter from 'conventional-commits-filter';

const VERSIONS = [ 'major', 'minor', 'patch' ];

export default async function main ({
  cwd,
  base,
  ref,
  preset,
  types,
  context,
}) {
  const { whatBump, parserOpts, writerOpts } = await presetLoader(preset);

  let commits = await getCommits(cwd, base, ref);
  commits = parseCommits(commits, parserOpts);
  commits = revertFilter(commits).filter(({ type }) => type && types.includes(type));
  // if (!commits.length) return { level: null, changelog: null };

  const { level } = commits.length ? whatBump(commits) : {};
  const bump = VERSIONS[level] || '';

  let version = context.version;
  if (version && bump) {
    const sv = new SemVer(version);
    version = sv.inc(bump, context.preid).version || context.version;
  }

  const changelog = bump && await genChangelog(commits, {
    ...context,
    version: context.name ? `${context.name}@${version}` : version,
  }, writerOpts);

  return {
    level: bump,
    currentVersion: context.version,
    version,
    commits,
    changelog,
  };
}

async function genChangelog (
  commits,
  context,
  options
) {
  const changelogStream = changelogWriter(context, options);
  const commitStream = Readable.from(commits);
  const chunks = [];
  for await (const chunk of commitStream.pipe(changelogStream)) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}
