import { bold, cyan, green } from 'chalk'

export const HELP_MSG = `
Version: ${green(bold('0.1.0'))}
Usage:   ${cyan(bold('ankylos'))} [command] [flags]
         ${cyan(bold('ankylos'))} [ -h | --help | -v | --version ]

Commands:
         ${bold('create, c')} <directory> --preset <pt>
         ${bold('bootstrap, b')} [ -s | --skip ] <stages>`

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
