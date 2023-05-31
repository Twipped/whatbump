whatbump
===

Extremely basic utility to find out what semantic version bump should occur for a given folder based upon conventional commit messages. Outputs `major`, `minor`, `patch` or an empty string based upon what semantic release the commits describe.

## Installation:

```sh
npm install -g whatbump
```

## Usage:

```sh
whatbump [options] [path]
```

**Options:**

| Options | Descrioption | Default |
| --- | --- | --- |
| `--base` | Git ref or sha to compare against when viewing differences.| `main` |
| `--ref` | Git ref of sha to use as the current state. | `HEAD` |
| `--preset` | Changelog processor to use for determining bump method.  |`conventionalcommits` |
| `--type-filter` | Comma separated list of commit types to accept, ignoring all other types. | `fix, feat, feature, breaking` |
|  `--changelog`     |   Output changelog body| |
|  `--json`          |   Output both bump level and changelog as a JSON object| |
|  `--version`   |   Starting semver version number. If not provided, whatbump will look for a package.json in the target directory. | |
|  `--repo`      |   Repo url for creating links in the changelog. If not provided, whatbump will look for it in a package.json in the target directory. | |

## API

Note: Invoking the api directly requires supplying all of the below config options. There are no defaults, like above.

```js
import whatbump from 'whatbump';

const {
  level, // bumping level (major, minor, patch)
  version, // new version number
  commits, // array of parsed commits that were found
  changelog, // generated changelog result
} = await whatbump({
  cwd,  // directory to read commits from
  base, // Git ref or sha to compare against when viewing differences.
  ref,  // Git ref of sha to use as the current state
  preset, // Commit analysis preset
  types, // Array of the commit types that should be analyized
  context: {
    version, // current starting semver version
    repoUrl  // repo url (for generating changelog links)
  }
});
```