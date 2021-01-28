module.exports = {
	type: 'preset',
	templates: [
		'editorconfig',
		'eslint',
		'github',
		'husky',
		'markdownlint',
		'pnpm',
		'prettier',
		'renovate',
		'vscode'
	],
	devDeps: ['ts-node', 'ts-node-dev', 'typescript'],
	scripts: {
		build: 'rm -rf dist/ && tsc',
		start: 'ts-node src/index.ts',
		dev: 'ts-node-dev src/index.ts'
	}
}
