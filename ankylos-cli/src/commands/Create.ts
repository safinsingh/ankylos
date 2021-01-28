import { createWriteStream, existsSync } from 'fs'
import stream from 'stream'
import { promisify } from 'util'
import fs from 'fs-extra'
import path from 'path'
import type { GluegunToolbox } from 'gluegun'
import getNpmTarballUrl from 'get-npm-tarball-url'
import got from 'got'
import tempy from 'tempy'
import { SingleBar, Presets } from 'cli-progress'
import decompress from 'decompress'
import rmfr from 'rmfr'
import fg from 'fast-glob'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import decompressTargz from 'decompress-targz'

import { fail, info, success, rawInfo } from '../logger'
import { FINISH_CREATE_MSG } from '../help'

const pipeline = promisify(stream.pipeline)

export default {
	name: 'create',
	alias: 'c',
	run: async (toolbox: GluegunToolbox) => {
		const {
			parameters: { options, first }
		} = toolbox

		if (!first) {
			fail('You must provide a directory to create a project!')
			return
		}

		if (options.preset !== 'node' && options.preset !== 'next') {
			fail("Key `preset` must be of type 'node' | 'next'!")
			return
		}

		info(`Downloading tarball for @ankylos/preset-${options.preset}...`)
		const url = getNpmTarballUrl(
			`@ankylos/preset-${options.preset}`,
			'0.2.0'
		)
		const loc = tempy.file({ extension: '.tar.gz' })

		const downloadStream = got.stream(url)
		const fileStream = createWriteStream(loc)

		const downloadBar = new SingleBar(
			{
				hideCursor: true,
				format: `${rawInfo()} [{bar}] {percentage}%`
			},
			Presets.rect
		)

		downloadBar.start(100, 0)
		downloadStream.on('downloadProgress', ({ percent }) => {
			const percentage = Math.round(percent * 100)
			downloadBar.update(percentage)
		})

		try {
			await pipeline(downloadStream, fileStream)
			downloadBar.stop()
			success(`Tarball streamed to ${loc}`)
		} catch (e) {
			downloadBar.stop()
			fail(`Could not write file to system: ${e.message}`)
		}

		await decompress(loc, first, {
			plugins: [decompressTargz()]
		})

		const entries = await fg(`${first}/package/**`, {
			dot: true,
			onlyFiles: true
		})

		for (const file of entries) {
			const dest = file.replace(`/package`, '')
			const dir = path.dirname(path.resolve(dest))

			if (!existsSync(dir)) {
				// Promise.all with this seemed to cause issues...
				await fs.mkdir(dir, { recursive: true })
			}

			await fs.rename(file, dest)
		}

		// TODO: what if they have a file/directory named 'package'?
		await rmfr(path.join(first, 'package'))
		success(`Unzipped and unwrapped tarball to ${first}!`)

		console.log(FINISH_CREATE_MSG)
	}
}
