import { ExifTool } from 'exiftool-vendored'
import { z } from 'zod'
import dedent from 'dedent'

// Do all this ceremony to get the package version
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import zodToJsonSchema from 'zod-to-json-schema'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))

const schema = z.object({
  description: z.string().describe('An explanatory blurb about the MediaProvenance spec itself. This is set automatically by tools.'),
  provider: z.string().describe('The app or service that ran the model.'),
  model: z.string().describe('The model used to generate the image'),
  input: z.record(z.any()).describe('The input parameters to the model'),
  output: z.any().describe('The output of the model'),
  meta: z.record(z.unknown()).describe('Extra metadata')
})

console.log(JSON.stringify(zodToJsonSchema(schema, 'MediaProvenance'), null, 2))

export default {
  get,
  set,
  schema
}

export async function set (fullyQualifiedImagePath, provenanceData) {
  const exiftool = new ExifTool()
  try {
    const description = dedent`
      MediaProvenance (v${packageJson.version}): A spec for describing the origins of AI-generated images.
      See https://github.com/zeke/media-provenance
    `
    const provenanceDataWithDescription = { description, ...provenanceData }

    const validatedMetadata = schema.parse(provenanceDataWithDescription)

    const json = JSON.stringify(validatedMetadata, null, 2)

    await exiftool.write(fullyQualifiedImagePath, {
      MakerNote: json
    }, ['-overwrite_original_in_place'])
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid metadata:', error.errors)
    } else {
      console.error('Error writing EXIF data:', error)
    }
    throw error
  } finally {
    await exiftool.end()
  }
}

export async function get (fullyQualifiedImagePath) {
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(fullyQualifiedImagePath)
    if (exifData.MakerNote) {
      return JSON.parse(exifData.MakerNote)
    }
    return null
  } catch (error) {
    console.error('Error reading EXIF data:', error)
    return null
  } finally {
    await exiftool.end()
  }
}
