export declare type AnkylosConfig = {
    type: 'template';
    templates: Array<'editorconfig' | 'eslint' | 'github' | 'husky' | 'markdownlint' | 'pnpm' | 'prettier' | 'renovate' | 'vscode'>;
    deps: string[];
    devDeps: string[];
    scripts?: {
        [name: string]: string;
    };
    name?: string;
    description?: string;
    keywords?: string;
    license?: 'AGPL-3.0' | 'MPL-2.0';
} | {
    type: 'preset';
    paths?: string[];
    pin: string;
};
