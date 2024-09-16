import { ExifTool } from 'exiftool-vendored'
import { z } from 'zod'

// Do all this ceremony to get the package version
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))

// Define the MediaProvenance schema
const metadataSchema = z.object({
  description: z.string(),
  version: z.string(),
  provider: z.string(),
  metadata: z.record(z.unknown())
})

export default {
  get,
  set
}

export async function set (fullyQualifiedImagePath, metadata) {
  const exiftool = new ExifTool()
  try {
    const provenanceData = {
      description: 'MediaProvenance: A specification for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance',
      version: packageJson.version,
      provider: 'Replicate (https://replicate.com)',
      metadata
    }

    const validatedMetadata = metadataSchema.parse(provenanceData)

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
