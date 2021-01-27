import { bold, cyan, green } from 'chalk'

export const HELP_MSG = `Version: ${green(bold('0.1.0'))}
Usage:   ${cyan(bold('ankylos'))} [command] [flags]
         ${cyan(bold('ankylos'))} [ -h | --help | -v | --version ]

Commands:
         ${bold('create, c')} <directory> --template <tpl>
         ${bold('bootstrap, b')}`
