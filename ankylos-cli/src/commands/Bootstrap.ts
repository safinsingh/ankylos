import type { GluegunPrint, GluegunPrompt, GluegunToolbox } from 'gluegun'
import fs from 'fs-extra'
import path from 'path'
import type {
	AnkylosConfig,
	AnkylosPresetConfig,
	AnkylosTemplateConfig
} from '@ankylos/types'
import { promisify } from 'util'
import child_process, { exec as cbExec } from 'child_process'
import { bold, green } from 'chalk'
import type { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'

import { fail, success } from '../logger'
import { FINISH_MSG } from '../help'

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
	configuration: AnkylosPresetConfig,
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
	configuration: AnkylosPresetConfig,
	print: GluegunPrint
) => {
	if (configuration?.type !== 'preset') return []
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
}

const stage3 = async (configuration: AnkylosConfig, prompt: GluegunPrompt) => {
	if (configuration?.type !== 'preset') return
	const { ask } = prompt

	const questions: PromptOptions[] = [
		{
			type: 'input',
			name: 'name',
			message: 'Project name?'
		},
		{
			type: 'input',
			name: 'description',
			message: 'Project description?'
		},
		{
			type: 'input',
			name: 'keywords',
			message: 'Project keywords? (separate with spaces)'
		},
		{
			type: 'select',
			name: 'license',
			message: 'Project license?',
			choices: ['MPL-2.0', 'AGPL-3.0']
		}
	]

	const { name, description, keywords, license } = await ask(questions)
	if (configuration.templates.includes('package')) {
		let base = (
			await fs.readFile(
				path.join(
					'node_modules',
					'@ankylos',
					'template-package',
					'package.export.json'
				)
			)
		).toString()

		Object.entries({
			'{{ name }}': name.replace(' ', '-'),
			'{{ description }}': description,
			'{{ license }}': license,
			'{{ keywords }}': `[${keywords
				.split(' ')
				.map((k) => `"${k}"`)
				.join(', ')}]`
		}).forEach(([k, v]) => {
			base = base.replaceAll(k, v)
		})

		const currentPkg = JSON.parse(
			(await fs.readFile('package.json')).toString()
		)

		const baseParsed = JSON.parse(base)
		const newPkg = {
			...baseParsed,
			dependencies: {
				...currentPkg.dependencies
			},
			devDependencies: {
				...currentPkg.devDependencies
			},
			peerDependencies: {
				...currentPkg.devDependencies
			},
			scripts: { ...baseParsed.scripts, ...configuration.scripts }
		}

		await fs.writeFile('package.json', JSON.stringify(newPkg, null, '\t'))
	}

	success('Stage 3 bootstrap is complete!')
}

const stage4 = async (configuration: AnkylosPresetConfig) => {
	const { templates } = configuration

	await Promise.all(
		(templates ?? []).map((tpl) => {
			const dir = path.join(
				process.cwd(),
				'node_modules',
				'@ankylos',
				`template-${tpl}`
			)

			// eslint-disable-next-line
			const cfg = require(dir) as AnkylosTemplateConfig

			return Promise.all(
				(cfg.paths ?? []).map(async (p) => {
					const fdir = path.dirname(path.resolve(p))
					if (!fs.existsSync(fdir)) {
						await fs.mkdir(fdir, { recursive: true })
					}

					await fs.copy(path.join(dir, p), p, {
						overwrite: true,
						recursive: true
					})
				})
			)
		})
	)

	success('Stage 4 bootstrap is complete!')
}

const run = async (toolbox: GluegunToolbox) => {
	const {
		print,
		parameters: { options },
		prompt
	} = toolbox

	const skip = options.skip ?? options.s ?? 0
	if (!fs.existsSync('ankylos.config.js')) {
		fail(
			'Could not fine `ankylos.config.js`! Are you in an @ankylos project directory?'
		)
	}

	// lol screw you eslint
	// eslint-disable-next-line
	const config = require(path.join(
		process.cwd(),
		'ankylos.config.js'
	)) as AnkylosConfig

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

	if (skip < 2) await stage2(config, print)

	/* STAGE 3 BOOTSTRAP
	 * Ask for project metadata
	 * Correctly fill in variables for package.json in temp file
	 * Merge package.json, write to it FORMATTED
	 */

	if (skip < 3) await stage3(config, prompt)

	/* STAGE 4 BOOTSTRAP
	 * Recursively copy paths from templates
	 */
	if (skip < 4) await stage4(config)

	await fs.unlink('ankylos.config.js')
	console.log(FINISH_MSG)
}

export default {
	name: 'bootstrap',
	alias: 'b',
	run
}
