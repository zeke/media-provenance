import { ExifTool } from 'exiftool-vendored'

export async function addExifDataToImage (metadata, fullyQualifiedImagePath) {
  const exiftool = new ExifTool()
  try {
    const json = JSON.stringify(metadata, null, 2)

    // Write prediction data to EXIF
    await exiftool.write(fullyQualifiedImagePath, {
      UserComment: json
    })
  } catch (exifError) {
    console.error('Error writing EXIF data:', exifError)
  }
}

// Remove the example usage from this file
