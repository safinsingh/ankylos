import got from 'got'
import getNpmTarballUrl from 'get-npm-tarball-url'

export const getLatestTarballUrl = async (pkg: string) => {
	const { body } = await got('https://registry.npmjs.org/' + pkg)
	const response = JSON.parse(body)
	return getNpmTarballUrl(pkg, response['dist-tags']['latest'])
}
