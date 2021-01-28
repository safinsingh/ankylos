import { bold, cyan } from 'chalk'

export const HELP_MSG = `${bold('Usage')}:
	ankylos [ --help | --version ]
	ankylos create <directory> --preset <next | node>
	ankylos bootstrap [--skip <stages>]

${bold('Subcommands')}:
	create, c         - clone, unzip, and unwrap a new preset
	bootstrap, b      - bootstrap a newly cloned preset

${bold('Flags')}:
	-h, --help        - display this help message
	-v, --version     - display the current version of ankylos
	-p, --preset      - preset to clone from
	-s, --skip        - skip the first n stags of the bootstrap process

${bold('Arguments')}:
	directory         - directory to clone preset into

${bold('Examples')}:
	ankylos create new-project --preset next
	ankylos bootstrap
`

export const FINISH_CREATE_MSG = `
${bold(
	'ankylos'
)} has finished creating your project! You can bootstrap it with the following:

    ${bold(`${cyan('~$')} cd <project>`)}
    ${bold(`${cyan('~$')} ankylos bootstrap`)}
`

export const FINISH_MSG = `
${bold(
	'ankylos'
)} has finished bootstrapping your project! Run the following to get started:

    ${bold(`${cyan('~$')} pnpm install`)}
    ${bold(`${cyan('~$')} code .`)}
`
