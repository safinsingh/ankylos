import type { AnkylosConfig } from '@ankylos/types'

export default <Partial<AnkylosConfig>>{
	eslint: [
		true,
		{
			next: true
		}
	],
	prettier: true,
	editorConfig: true,
	husky: true,
	vscode: true,
	githubCI: true,
	markdownlint: true,
	deps: ['next', 'react', 'react-dom', 'sass'],
	devDeps: ['@types/react', '@types/node'],
	scripts: {
		build: 'next build',
		start: 'next start',
		dev: 'next dev'
	}
}
