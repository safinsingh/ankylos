export type AnkylosConfig = {
	eslint:
		| boolean
		| [
				boolean,
				{
					next: boolean
				}
		  ]
	prettier: boolean
	editorConfig: boolean
	husky: boolean
	vscode: boolean
	githubCI: boolean
	markdownlint: boolean
	name: string
	description: string
	keywords: string
	deps: string[]
	devDeps: string[]
	scripts: {
		[name: string]: string
	}
	license: 'AGPL-3.0' | 'MPL-2.0'
}
