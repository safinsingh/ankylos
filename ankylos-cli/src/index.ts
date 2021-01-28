import type { GluegunToolbox } from 'gluegun'
import { build } from 'gluegun'

import { DEFAULT_MSG, HELP_MSG } from './help'

build('ankylos')
	.src(__dirname)
	.help({
		name: 'help',
		alias: 'h',
		dashed: true,
		run: (toolbox: GluegunToolbox) => toolbox.print.info(HELP_MSG)
	})
	.version()
	.checkForUpdates(5)
	.defaultCommand({
		run: (toolbox: GluegunToolbox) => toolbox.print.info(DEFAULT_MSG)
	})
	.create()
	.run()
