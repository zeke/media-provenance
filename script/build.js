#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import zodToJsonSchema from 'zod-to-json-schema'
import { schema } from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const readmePath = join(__dirname, '..', 'README.md')

async function updateReadme () {
  try {
    // Read the README.md file
    const readmeContent = await readFile(readmePath, 'utf-8')

    // Convert Zod schema to JSON schema
    const jsonSchema = zodToJsonSchema(schema, 'MediaProvenance')

    // Format the JSON schema
    const formattedSchema = JSON.stringify(jsonSchema, null, 2)

    // Replace the content between the tags
    const updatedContent = readmeContent.replace(
      /<!--BEGIN SCHEMA-->[\s\S]*<!--END SCHEMA-->/,
      `<!--BEGIN SCHEMA-->\n\`\`\`json\n${formattedSchema}\n\`\`\`\n<!--END SCHEMA-->`
    )

    // Write the updated content back to README.md
    await writeFile(readmePath, updatedContent, 'utf-8')

    console.log('README.md has been updated with the schema.')
  } catch (error) {
    console.error('Error updating README.md:', error)
  }
}

updateReadme()
