import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs, { readFile } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import MediaProvenance from '../index.js'

// Do all this ceremony to get the package version
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '../package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))

async function runImageTest (t, testImageName) {
  const testDirectory = path.dirname(new URL(import.meta.url).pathname)
  const sourceImagePath = path.join(testDirectory, 'fixtures', testImageName)
  const testImagePath = path.join(testDirectory, `test_${testImageName}`)

  await fs.copyFile(sourceImagePath, testImagePath)

  // Cleanup after the test
  t.after(async () => {
    try {
      await fs.unlink(testImagePath)
    } catch (deleteError) {
      console.error('Error deleting test image:', deleteError)
    }
  })

  // Test metadata
  const metadata = JSON.parse(await fs.readFile(path.join(testDirectory, 'fixtures', 'example.json'), 'utf-8'))

  const expectedResult = {
    description: 'MediaProvenance: A specification for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance',
    version: packageJson.version,
    provider: 'Replicate (https://replicate.com)',
    metadata
  }

  // Verify that the image does not include metadata before adding it
  const initialMetadata = await MediaProvenance.get(testImagePath)
  assert.deepStrictEqual(initialMetadata, null, 'Image should not contain metadata initially')

  // Run the function to add metadata
  await MediaProvenance.set(testImagePath, metadata)

  // Verify the EXIF data after adding metadata
  const readMetadata = await MediaProvenance.get(testImagePath)
  assert.deepStrictEqual(readMetadata, expectedResult, 'Added metadata should match the original metadata')
}

test('write and read metadata for PNG files', async (t) => {
  await runImageTest(t, 'example.png')
})

test('write and read metadata for WebP files', async (t) => {
  await runImageTest(t, 'example.webp')
})

test('write and read metadata for JPG files', async (t) => {
  await runImageTest(t, 'example.jpg')
})
