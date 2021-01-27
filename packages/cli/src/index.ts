import { build } from 'gluegun'

build('ankylos')
	.src(__dirname)
	.help()
	.version()
	.checkForUpdates(5)
	.create()
	.run()
