export type AnkylosConfig =
	| {
			type: 'template'
			templates: Array<
				| 'editorconfig'
				| 'eslint'
				| 'github'
				| 'husky'
				| 'markdownlint'
				| 'pnpm'
				| 'prettier'
				| 'renovate'
				| 'vscode'
			>
			name?: string
			description?: string
			keywords?: string
			scripts?: {
				[name: string]: string
			}
			license?: 'AGPL-3.0' | 'MPL-2.0'
			deps?: string[]
			devDeps?: string[]
	  }
	| {
			type: 'preset'
			paths?: string[]
			pin: string
			deps?: string[]
			devDeps?: string[]
			rewrites?: { [key: string]: string }
			vars: boolean
	  }
