export type AnkylosTemplateConfig = {
	type: 'template'
	paths?: string[]
	deps?: string[]
	devDeps?: string[]
}

export type AnkylosPresetConfig = {
	type: 'preset'
	templates: Array<
		| 'editorconfig'
		| 'eslint'
		| 'github'
		| 'husky'
		| 'markdownlint'
		| 'package'
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

export type AnkylosConfig = AnkylosTemplateConfig | AnkylosPresetConfig
