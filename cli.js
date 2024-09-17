#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { get, set } from './index.js'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

function usage () {
  console.log(`
Usage: media-provenance [<image>] <command>

Commands:
  get <image>      Get provenance data from an image
  set <image> <json>   Set provenance data for an image

If <image> is provided as the first argument without a command, it defaults to 'get' command.
`)
  process.exit()
}

async function main () {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    usage()
  }

  if (args.includes('-v') || args.includes('--version')) {
    usage()
  }

  const command = args[0]

  const filePath = resolve(process.cwd(), command)
  if (existsSync(filePath)) {
    const data = await get(command)
    console.log(JSON.stringify(data, null, 2))
  }

  if (command === 'get') {
    if (args.length !== 2) {
      usage()
    }
    try {
      const data = await get(args[1])
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  }

  if (command === 'set') {
    if (args.length !== 3) {
      usage()
    }
    try {
      const data = JSON.parse(await readFile(args[2], 'utf-8'))
      await set(args[1], data)
      console.log('Provenance data set successfully')
    } catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  } else {
    console.error(`Unknown command: ${command}`)
    usage()
  }
}

main().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
