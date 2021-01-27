import type { GluegunToolbox } from 'gluegun'

export default {
	name: 'test',
	alias: 't',
	run: async (toolbox: GluegunToolbox) => {
		const { print } = toolbox

		print.fancy('test!')
	}
}
