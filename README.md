# EXIF Stash

A simple Node.js module for storing (and retrieving) JSON metadata in image files.

Supports PNG, JPG, and WebP image formats.

## Installation

You'll need [Node.js](https://nodejs.org/en/download/prebuilt-installer) 18 or later to use this module.

```
npm install exif-stash
```

## API

### `addDataToImage(imagePath, metadata)`

Add metadata to an image file.

- `imagePath`: The path to the image file where the metadata will be stored.
- `metadata`: A JSON object containing the metadata to be stored.

Returns nothing.

Example:

```js
import { addDataToImage } from 'exif-stash'

const filePath = 'path/to/my/image.jpg'
const data = {
  "title": "My Image",
  "description": "This is a test image",
  "tags": ["test", "image"]
}

await addDataToImage(filePath, data)
```


### `readDataFromImage(imagePath)`

Read metadata from an image file.

- `imagePath`: The path to the image file where the metadata will be read.

Returns a JSON object containing the metadata.

Example:

```js
import { readDataFromImage } from 'exif-stash'

const filePath = 'path/to/my/image.jpg'
const data = await readDataFromImage(filePath)
```

## Notes

- Data is stored using EXIF, a popular image format metadata format.
- Data is stored as a JSON string in the `UserComment` field.
- This package doesn't provide raw access to EXIF data. If you need to read and write raw EXIF data, you can use the [`exiftool`](https://exiftool.org/) command line tool or the [exiftool-vendored](https://github.com/photostructure/exiftool-vendored) npm package.



