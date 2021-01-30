const childProcess = require('child_process')
const { existsSync } = require('fs')
const { promisify } = require('util')

const exec = promisify(childProcess.exec).bind(childProcess)

const buildConfig = (cfg) => {
	if (existsSync(`ankylos-config-${cfg}/dist/`)) {
		exec(`pnpm build --prefix ankylos-config-${cfg}`)
	}
}

buildConfig('eslint')
buildConfig('prettier')
