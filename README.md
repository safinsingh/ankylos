# `@ankylos` ![CI](https://github.com/safinsingh/ankylos/workflows/CI/badge.svg)

An opinionated set of configuration files & CLI for conveniently bootstrapping
Node projects. ([NPM Organization](https://www.npmjs.com/org/ankylos))

## How does it work?

1. Choose a preset to clone from. Currently, the `next` and `node` presets are
   implemented for Next.js and vanilla Node.js (both using TypeScript)
   respectively.

```sh
~$ ankylos create new-project --preset node
```

2. Run `ankylos bootstrap` within the newly cloned directory. This will read
   from the preset's `ankylos.config.js`, which describes behaviour for
   preset-specific dependencies, dev-dependencies, templates, and NPM scripts.
   For example, the `node` preset has the `editorconfig`, `eslint`, `github`,
   `husky`, `markdownlint`, `package`, `prettier`, `renovate`, and `vscode`
   extensions enabled by default. Each of these plugins is an NPM module
   published under the `@ankylos` organization and contain their own
   `ankylos.config.js`. However, this configuration defines template-specific
   behaviour, such as files to preserve/copy and template-specific dependencies.
   Anyways, the `bootstrap` subcommand will initialize a 4-stage bootstrap
   process:

   **I.** Install all direct dependencies, dev dependencies, and templates under
   the preset's `ankylos.config.js`.

   **II.** Install template dependencies and dev dependencies

   **III.** Prompt for project metadata: name, description, kewords, license

   **IV.** Copy files specified by templates into their respective locations
   relative to the new project

3. Simply `pnpm install` in the current directory and you should be good to go!

## What `ankylos` is NOT supposed to be

- A generic wrapper to encapsulate configuration entirely. The entire point is
  just to bootstrap common configuration and that's all. Things like `prettier`
  will remain `peerDependencies` in `ankylos-template-prettier`, for example.
- A one-size-fits-all tool for all developers. This tool has been developed with
  my personal preferences in mind. If you would like to add a template, feel
  free to create a pull request, but be warned that I may not accept it on
  grounds of personal preference. At that point, feel free to fork the
  repository (keep the LICENSE :)!) and adjust the template to your neds

## Caveats

- Currently only supports `pnpm`. Support for other package managers is not a
  priority.

## Try it out

With all of that said, feel free to try `ankylos` for yourself like so:

```
$ pnpm install --global @ankylos/cli
$ ankylos --help
Usage:
  ankylos [ --help | --version ]
  ankylos create <directory> --preset <next | node>
  ankylos bootstrap [--skip <stages>]

Subcommands:
  create, c         - clone, unzip, and unwrap a new preset
  bootstrap, b      - bootstrap a newly cloned project

Flags:
  -h, --help        - display this help message
  -v, --version     - display the current version of ankylos
  -p, --preset      - preset to clone from
  -s, --skip        - skip the first n stags of the bootstrap process

Arguments:
  directory         - directory to clone preset into

Examples:
  ankylos create new-project --preset next
  ankylos bootstrap
```
