import { test } from 'node:test'
import assert from 'node:assert/strict'
import dedent from 'dedent'
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

  // Delete temp files after each test
  t.after(async () => {
    try {
      await fs.unlink(testImagePath)
    } catch (deleteError) {
      console.error('Error deleting test image:', deleteError)
    }
  })

  const provider = 'Replicate (https://replicate.com)'
  const rawReplicatePredictionData = JSON.parse(await fs.readFile(path.join(testDirectory, 'fixtures', 'example.json'), 'utf-8'))
  const { model, input, output, ...meta } = rawReplicatePredictionData

  const expectedResult = {
    description: dedent`
      MediaProvenance (v${packageJson.version}): A spec for describing the origins of AI-generated images.
      See https://github.com/zeke/media-provenance
    `,
    provider,
    model,
    input,
    output,
    meta
  }

  // Verify that the image does not include metadata before adding it
  const initialMetadata = await MediaProvenance.get(testImagePath)
  assert.deepStrictEqual(initialMetadata, null, 'Image should not contain metadata initially')

  // Add data to image
  await MediaProvenance.set(testImagePath, {
    provider,
    model,
    input,
    output,
    meta
  })

  // Verify the data was addeed
  const readMetadata = await MediaProvenance.get(testImagePath)
  assert.deepStrictEqual(
    JSON.parse(JSON.stringify(readMetadata)),
    JSON.parse(JSON.stringify(expectedResult)),
    'Added metadata should match the original metadata (ignoring key order)'
  )
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
