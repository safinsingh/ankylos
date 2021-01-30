const childProcess = require('child_process')
const fg = require('fast-glob')
const { promises: fs } = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const { cwd } = process

const rgx = /pub\((patch|min|maj)\)/
const exec = promisify(childProcess.exec).bind(childProcess)

const main = async () => {
	const message = (await exec('git log --format=%B -n 1')).stdout.trim()
	if (!rgx.test(message)) return

	const [, lvl] = message.match(rgx)
	let idx

	if (lvl === 'patch') idx = 2
	if (lvl === 'min') idx = 1
	if (lvl === 'maj') idx = 0

	let semver
	const entries = fg.stream('../ankylos-*', { onlyDirectories: true })
	for await (const directory of entries) {
		const loc = join(cwd(), directory, 'package.json')
		const raw = await fs.readFile(loc)
		const pkg = JSON.parse(raw)

		semver = pkg.version.split('.').map((v) => parseInt(v, 10))
		semver[idx] += 1
		for (let i = 0; i < idx; i++) {
			semver[idx] = 0
		}

		pkg.version = semver.map((i) => i.toString()).join('.')
		await fs.writeFile(loc, `${JSON.stringify(pkg, null, '\t')}\n`)
	}

	await exec('git config --global user.name "Safin Singh"')
	await exec('git config --global user.email "safin.singh@gmail.com"')
	await exec(
		`git commit -m "Publish v${semver.map((i) => i.toString()).join('.')}"`
	)
	await exec(`git tag v${semver.map((i) => i.toString()).join('.')}`)
}

main()
