module.exports = {
	type: 'preset',
	templates: [
		'editorconfig',
		'eslint',
		'github',
		'husky',
		'markdownlint',
		'package',
		'prettier',
		'renovate',
		'vscode'
	],
	devDeps: ['ts-node', 'ts-node-dev', 'typescript'],
	scripts: {
		build: '[ -d "dist" ] && rm -rf dist; tsc',
		start: 'ts-node src/index.ts',
		dev: 'ts-node-dev src/index.ts'
	}
}
