#!/usr/bin/env node

import { program } from 'commander'
import { readFile } from 'node:fs/promises'
import { get, set } from './index.js'

program
  .name('media-provenance')
  .description('CLI to get and set media provenance data')
  .version('1.0.0')

program
  .command('get <image>')
  .description('Get provenance data from an image')
  .action(async (image) => {
    try {
      const data = await get(image)
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

program
  .command('set <image> <json>')
  .description('Set provenance data for an image')
  .action(async (image, json) => {
    try {
      const data = JSON.parse(await readFile(json, 'utf-8'))
      await set(image, data)
      console.log('Provenance data set successfully')
    } catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

program.parse(process.argv)
