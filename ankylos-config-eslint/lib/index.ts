export = {
	extends: ['@kiwi'],
	rules: {
		'no-await-in-loop': 0,
		'padding-line-between-statements': 0,
		'import/order': [
			'error',
			{
				'newlines-between': 'always',
				'groups': [
					['builtin', 'external'],
					['internal'],
					['parent', 'sibling'],
					['index', 'object']
				]
			}
		],
		'no-nested-ternary': 0
	}
}
