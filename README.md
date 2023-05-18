whatbump
===

Extremely basic utility to find out what semantic version bump should occur for a given folder based upon conventional commit messages. Outputs `major`, `minor`, `patch` or an empty string based upon what semantic release the commits describe.

## Usage:

```
whatbump [options] [path]
```

**Options:**

| Options | Descrioption | Default |
| --- | --- | --- |
| `--base` | Git ref or sha to compare against when viewing differences.| `main` |
| `--ref` | Git ref of sha to use as the current state. | `HEAD` |
| `--preset` | Changelog processor to use for determining bump method.  |`conventionalcommits` |
| `--type-filter` | Comma separated list of commit types to accept, ignoring all other types. | `fix, feat, feature, breaking` |
