import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { ExifTool } from 'exiftool-vendored'
import { addDataToImage } from '../index.js'

test('addDataToImage works for PNG files', async (t) => {
  const testImageName = 'example.png'
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

  // Run the function
  await addDataToImage(metadata, testImagePath)

  // Verify the EXIF data
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(testImagePath)
    assert.deepStrictEqual(JSON.parse(exifData.UserComment), metadata)
  } finally {
    await exiftool.end()
  }
})

test('addDataToImage works for WebP files', async (t) => {
  const testImageName = 'example.webp'
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

  // Run the function
  await addDataToImage(metadata, testImagePath)

  // Verify the EXIF data
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(testImagePath)
    assert.deepStrictEqual(JSON.parse(exifData.UserComment), metadata)
  } finally {
    await exiftool.end()
  }
})
