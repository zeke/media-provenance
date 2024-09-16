# MediaProvenance

A Node.js module for storing (and retrieving) JSON metadata in image files.

Supports PNG, JPG, and WebP image formats.

## Why?

Ever come across an AI-generated image and wondered about its origins?

MediaProvenance is a simple way to store and retrieve metadata in image files, so creators can share the origins of their images with others.

## Installation

You'll need [Node.js](https://nodejs.org/en/download/prebuilt-installer) 18 or later to use this module.

```
npm install media-provenance
```

## API

### `set(imagePath, metadata)`

Add metadata to an image file.

- `imagePath`: The path to the image file where the metadata will be stored.
- `metadata`: A JSON object containing the metadata to be stored.

Returns nothing.

Example:

```js
import MediaProvenance from 'media-provenance'

const filePath = 'path/to/my/image.jpg'
const data = {
  "title": "My Image",
  "description": "This is a test image",
  "tags": ["test", "image"]
}

await MediaProvenance.set(filePath, data)
```


### `get(imagePath)`

Read metadata from an image file.

- `imagePath`: The path to the image file where the metadata will be read.

Returns a JSON object containing the metadata.

Example:

```js
import MediaProvenance from 'media-provenance'

const filePath = 'path/to/my/image.jpg'
const data = await MediaProvenance.get(filePath)
```

## Notes

- Data is stored using EXIF, a popular image format metadata format.
- Data is stored as a JSON string in the `UserComment` field.
- This package doesn't provide raw access to EXIF data. If you need to read and write raw EXIF data, you can use the [`exiftool`](https://exiftool.org/) command line tool or the [exiftool-vendored](https://github.com/photostructure/exiftool-vendored) npm package.



