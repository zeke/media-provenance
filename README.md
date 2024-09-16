# MediaProvenance

A specification, library, and CLI for describing the origins of AI-generated images.

This package provides a JavaScript API and CLI for storing and retrieving metadata in image files, so creators can share the origins of their images with others.

Supports PNG, JPG, and WebP image formats.

Example metadata:

```json
{
  "description": "MediaProvenance: A specification for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance",
  "version": "1.0.0",
  "provider": "Replicate (https://replicate.com)",
  "metadata": {
    "id": "qfjk4jqdpdrm20chdnpscydpe4",
    "model": "black-forest-labs/flux-schneell",
    "version": "fe82ca7f3f7efe4ad452c49a31e20d18b31d498bddbc1d61860703e0339406ba",
    "input": {
      "prompt": "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot",
      "num_outputs": 1,
      "aspect_ratio": "1:1",
      "output_format": "webp",
      "output_quality": 80
    },
    "output": [
      "https://replicate.delivery/yhqm/A8gbZlebANWBFSU1mTWSznUwZ0XGtflFAQ8DT35trPNvUaUTA/out-0.webp"
    ],
    "completed_at": "2024-08-20T01:36:47.839339Z",
    "created_at": "2024-08-20T01:36:46.515000Z"
  }
}
```

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

This will output a JSON object like this:

```json
{
  "description": "MediaProvenance: A specification for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance",
  "version": "1.0.0",
  "provider": "Replicate (https://replicate.com)",
  "metadata": {
    "inputs": [
      {
        "model": "stability-ai/sdxl",
        "prompt": "A beautiful landscape with a river and mountains",
        "num_outputs": 3,
        "seed": 42
      }
    ],
    "outputs": [
      "https://example.com/output-1.png",
      "https://example.com/output-2.png",
      "https://example.com/output-3.png"
    ]
  }
}
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