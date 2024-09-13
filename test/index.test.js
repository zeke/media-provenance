import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { ExifTool } from 'exiftool-vendored'
import { addDataToImage } from '../index.js'

test('addDataToImage adds EXIF data to the image', async (t) => {
  // Setup
  const testImageName = 'example.png'
  const testDirectory = path.dirname(new URL(import.meta.url).pathname)
  const sourceImagePath = path.join(testDirectory, testImageName)
  const testImagePath = path.join(testDirectory, `test_${testImageName}`)

  // Copy the example image for testing
  await fs.copyFile(sourceImagePath, testImagePath)

  // Test metadata
  const metadata = {
    prediction: 'cat'
  }

  // Run the function
  await addDataToImage(metadata, testImagePath)

  // Verify the EXIF data
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(testImagePath)
    assert.deepStrictEqual(JSON.parse(exifData.UserComment), metadata)
  } catch (error) {
    console.error('Error reading EXIF data:', error)
    throw error
  } finally {
    await exiftool.end()
  }
})
