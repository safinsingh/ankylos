import type { GluegunToolbox } from 'gluegun'
import { existsSync } from 'fs'
import path from 'path'

import { fail } from '../logger'

export default {
	name: 'bootstrap',
	alias: 'b',
	run: async (_toolbox: GluegunToolbox) => {
		if (!existsSync('ankylos.config.js')) {
			fail(
				'Could not fine `ankylos.config.js`! Are you in an @ankylos project directory?'
			)
		}

		const config = require(path.resolve(
			path.join(process.cwd(), 'ankylos.config.js')
		))
		console.log(config)
	}
}
