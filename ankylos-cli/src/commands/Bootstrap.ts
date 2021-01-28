import type { GluegunPrint, GluegunToolbox } from 'gluegun'
import { existsSync } from 'fs'
import path from 'path'
import type { AnkylosConfig } from '@ankylos/types'
import { promisify } from 'util'
import child_process, { exec as cbExec } from 'child_process'
import { bold, green } from 'chalk'

import { fail, success } from '../logger'

const exec = promisify(cbExec).bind(child_process)

const installDeps = async (print: GluegunPrint, deps?: string[]) => {
	const depStr = deps?.join(' ')
	if (depStr) {
		const spinner = print.spin(
			`Installing immediate dependencies: ${bold(green(depStr))}`
		)

		try {
			await exec(`pnpm add ${depStr}`)
			spinner.stop()
		} catch (e) {
			spinner.stop()
			fail(`Error spawning child process: ${e.message}`)
		}
	}
}

const installDevDeps = async (print: GluegunPrint, devDeps?: string[]) => {
	const devDepStr = devDeps?.join(' ')

	if (devDepStr) {
		const spinner = print.spin(
			`Installing immediate dev dependencies: ${bold(green(devDepStr))}`
		)

		try {
			await exec(`pnpm add -D ${devDepStr}`)
			spinner.stop()
		} catch (e) {
			spinner.stop()
			fail(`Error spawning child process: ${e.message}`)
		}
	}
}

const stage1 = async (
	configuration: Partial<AnkylosConfig>,
	print: GluegunPrint
) => {
	if (configuration?.type !== 'preset') return
	const { deps, devDeps, templates } = configuration

	await installDeps(print, deps)
	await installDevDeps(print, devDeps)

	if (templates) {
		const spinner = print.spin(
			`Installing templates: ${bold(green(templates.join(' ')))}`
		)

		try {
			await exec(
				`pnpm add -D ${templates
					.map((tpl) => `@ankylos/template-${tpl}`)
					.join(' ')}`
			)
			spinner.stop()
		} catch (e) {
			spinner.stop()
			fail(`Error spawning child process: ${e.message}`)
		}
	}

	success('Stage 1 bootstrap is complete!')
}

const stage2 = async (
	configuration: Partial<AnkylosConfig>,
	print: GluegunPrint
) => {
	if (configuration?.type !== 'preset') return
	const { templates } = configuration

	const tplInfo: AnkylosConfig[] = []
	for (const tpl of templates ?? []) {
		tplInfo.push(
			// eslint-disable-next-line
			require(path.join(
				process.cwd(),
				'node_modules',
				'@ankylos',
				`template-${tpl}`
			))
		)
	}

	const tplDeps = { deps: [], devDeps: [] } as {
		deps: string[]
		devDeps: string[]
	}
	tplInfo.forEach((el) => {
		if (el.deps) el.deps.forEach((d) => tplDeps.deps.push(d))
		if (el.devDeps) el.devDeps.forEach((d) => tplDeps.devDeps.push(d))
	})

	await installDeps(print, tplDeps.deps)
	await installDevDeps(print, tplDeps.devDeps)

	success('Stage 2 bootstrap is complete!')
	return tplInfo ?? []
}

export default {
	name: 'bootstrap',
	alias: 'b',
	run: async (toolbox: GluegunToolbox) => {
		const {
			print,
			parameters: { options }
		} = toolbox

		const skip = options.skip ?? options.s ?? 0
		if (!existsSync('ankylos.config.js')) {
			fail(
				'Could not fine `ankylos.config.js`! Are you in an @ankylos project directory?'
			)
		}

		// lol screw you eslint
		// eslint-disable-next-line
		const config = require(path.resolve(
			path.join(process.cwd(), 'ankylos.config.js')
		)) as Partial<AnkylosConfig>

		if (config?.type !== 'preset') {
			fail('You cannot bootstrap anything except a preset!')
			return
		}

		/* STAGE 1 BOOTSTRAP
		 * Install all dependencies
		 * Install all dev dependencies
		 * Install all plugins
		 */

		if (skip < 1) await stage1(config, print)

		/* STAGE 2 BOOTSTRAP
		 * Install all dependencies of templates
		 * Install all dev dependencies of templates
		 */

		//  TODO: think about skip here... tplInfo is required but i guess i could abstract
		await stage2(config, print)

		/* STAGE 3 BOOTSTRAP
		 * Ask for project metadata
		 * Correctly fill in variables for package.json in temp file
		 * Merge package.json, write to it FORMATTED
		 */

		/* STAGE 4 BOOTSTRAP
		 * Recursively copy paths from templates
		 * Fill in template variables
		 * Clean out dev dependencies and call pnpm i one last time
		 */
	}
}
