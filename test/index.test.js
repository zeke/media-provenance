import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { addDataToImage, readDataFromImage } from '../index.js'

test('write and read metadata for PNG files', async (t) => {
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
  await addDataToImage(testImagePath, metadata)

  // Verify the EXIF data
  const readMetadata = await readDataFromImage(testImagePath)
  assert.deepStrictEqual(readMetadata, metadata)
})

test('write and read metadata for WebP files', async (t) => {
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
  await addDataToImage(testImagePath, metadata)

  // Verify the EXIF data
  const readMetadata = await readDataFromImage(testImagePath)
  assert.deepStrictEqual(readMetadata, metadata)
})

test('write and read metadata for JPG files', async (t) => {
  const testImageName = 'example.jpg'
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
  await addDataToImage(testImagePath, metadata)

  // Verify the EXIF data
  const readMetadata = await readDataFromImage(testImagePath)
  assert.deepStrictEqual(readMetadata, metadata)
})
