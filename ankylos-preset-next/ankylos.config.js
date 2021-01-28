module.exports = {
	type: 'preset',
	templates: [
		'editorconfig',
		'eslint',
		'github',
		'husky',
		'markdownlint',
		'package',
		'pnpm',
		'prettier',
		'renovate',
		'vscode'
	],
	deps: ['next', 'react', 'react-dom', 'sass'],
	devDeps: ['@types/react', '@types/node', 'typescript'],
	scripts: {
		build: 'next build',
		start: 'next start',
		dev: 'next dev'
	}
}
