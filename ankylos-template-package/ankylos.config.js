module.exports = {
	type: 'template',
	pin: '0.2.0',
	paths: ['package.export.json'],
	rewrites: {
		'package.export.json': 'package.json'
	},
	vars: true
}
