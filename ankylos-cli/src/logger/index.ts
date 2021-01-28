import { bold, cyan, green, red, yellow, magenta } from 'chalk'

// :)
const { log, error } = console

function logBuilder(ctx: string) {
	return `[ ${ctx} ] =>`
}

export function info(message: string) {
	log(cyan(bold(logBuilder('info'))), message)
}

export function rawInfo() {
	return cyan(bold(logBuilder('info')))
}

export function success(message: string) {
	log(green(bold(logBuilder('scss'))), message)
}

export function fail(message: string) {
	error(red(bold(logBuilder('fail'))), message)
	process.exit(1)
}

export function warn(message: string) {
	log(yellow(bold(logBuilder('warn'))), message)
}

export function update(message: string) {
	log(magenta(bold(logBuilder('updt'))), message)
}
