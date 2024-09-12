import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { ExifTool } from 'exiftool-vendored'
import { addExifDataToImage } from '../index.js'

test('addExifDataToImage adds EXIF data to the image', async (t) => {
  // Setup
  const testImageName = 'example.png'
  const testDirectory = path.dirname(new URL(import.meta.url).pathname)
  const sourceImagePath = path.join(testDirectory, testImageName)
  const testImagePath = path.join(testDirectory, `test_${testImageName}`)

  // Copy the example image for testing
  await fs.copyFile(sourceImagePath, testImagePath)

  // Cleanup after test
  t.after(async () => {
    try {
      await fs.unlink(testImagePath)
    } catch (error) {
      console.error('Error cleaning up test file:', error)
    }
  })

  // Test metadata
  const metadata = {
    prediction: 'cat'
  }

  // Run the function
  await addExifDataToImage(metadata, testImagePath)

  // Verify the EXIF data
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(testImagePath)
    assert.deepStrictEqual(JSON.parse(exifData.UserComment), metadata)
  } finally {
    await exiftool.end()
  }
})
