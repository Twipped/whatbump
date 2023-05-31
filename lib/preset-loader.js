import { promisify } from 'node:util';

import presetLoader from 'conventional-changelog-preset-loader';

function noop () { }

export default async function presetResolver (preset) {
  const presetPackage = await presetLoader(preset);
  let pp;

  // handle traditional node-style callbacks
  if (typeof presetPackage === 'function') {
    pp = await promisify(presetPackage)();
  }

  // handle object literal or Promise instance
  if (typeof presetPackage === 'object' && typeof presetPackage.then === 'function') {
    pp = await presetPackage;
  }

  if (!pp) {
    throw new Error('Preset package must be a promise, function, or object');
  }

  const whatBump = pp?.recommendedBumpOpts?.whatBump || noop;
  const parserOpts = pp?.recommendedBumpOpts?.parserOpts;
  const writerOpts = pp?.writerOpts;

  return { whatBump, parserOpts, writerOpts };
}
