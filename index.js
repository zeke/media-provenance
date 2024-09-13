import { ExifTool } from 'exiftool-vendored'

export async function addDataToImage (metadata, fullyQualifiedImagePath) {
  const exiftool = new ExifTool()
  try {
    const json = JSON.stringify(metadata, null, 2)

    await exiftool.write(fullyQualifiedImagePath, {
      UserComment: json
    }, ['-overwrite_original_in_place'])
  } catch (exifError) {
    console.error('Error writing EXIF data:', exifError)
  } finally {
    await exiftool.end()
  }
}

export async function readDataFromImage (fullyQualifiedImagePath) {
  const exiftool = new ExifTool()
  try {
    const exifData = await exiftool.read(fullyQualifiedImagePath)
    if (exifData.UserComment) {
      return JSON.parse(exifData.UserComment)
    }
    return null
  } catch (exifError) {
    console.error('Error reading EXIF data:', exifError)
    return null
  } finally {
    await exiftool.end()
  }
}
