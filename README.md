# MediaProvenance

A Node.js module for storing (and retrieving) JSON metadata in image files.

Supports PNG, JPG, and WebP image formats.

## Why?

Ever come across an AI-generated image and wondered about its origins?

MediaProvenance is a simple way to store and retrieve metadata in image files, so creators can share the origins of their images with others.

## Installation

You'll need [Node.js](https://nodejs.org/en/download/prebuilt-installer) 18 or later to use this module.

It's not published to npm yet, but you can install it directly from GitHub:

```
npm install zeke/media-provenance
```

## JavaScript API 

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

## CLI (Command Line Interface)

Install the CLI globally:

```
npm install -g zeke/media-provenance
```

Set data:

```
media-provenance set path/to/image.jpg path/to/metadata.json
```

Get data:

```
media-provenance get path/to/image.jpg
```

## Notes

- Data is stored using [EXIF](https://en.wikipedia.org/wiki/Exif), a popular image format metadata format.
- Data is stored as a JSON string in the [`MakerNote`](https://exiftool.org/idiosyncracies.html) field, which is one of the few EXIF fields that allows for arbitrary data.
- Data _could_ be stored using `XMP`, an alternative to EXIF created by Adobe that supports more formats.

## Tips

- This package doesn't provide raw access to EXIF data. If you need to read and write raw EXIF data, you can use the [`exiftool`](https://exiftool.org/) command line tool or the [exiftool-vendored](https://github.com/photostructure/exiftool-vendored) npm package.