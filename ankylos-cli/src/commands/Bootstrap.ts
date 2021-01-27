import type { GluegunToolbox } from 'gluegun'
import { existsSync } from 'fs'
import path from 'path'
import type { AnkylosConfig } from '@ankylos/types'

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

		// lol screw you eslint
		// eslint-disable-next-line
		const config = require(path.resolve(
			path.join(process.cwd(), 'ankylos.config.js')
		)) as Partial<AnkylosConfig>

		if (!(config?.type === 'preset')) {
			fail('You cannot bootstrap anything except a preset!')
		}
	}
}
