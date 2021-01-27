import { build } from 'gluegun'

const ankylosCLI = build('ankylos').src(__dirname).help().version().create()

ankylosCLI.run()
