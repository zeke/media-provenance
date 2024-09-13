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
