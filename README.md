# MediaProvenance

A spec for describing the origins of AI-generated images.

This project defines a specification for describing metadata about AI-generated images, and includes tooling for storing that metadata in image files.

This package provides a JavaScript API and CLI for storing and retrieving metadata in image files, so creators can share the origins of their images with others.

Supports PNG, JPG, and WebP image formats for now, but there's room to grow to other formats like video and audio.


Example metadata:

```json
{
  "description": "MediaProvenance (v1.0.0): A spec for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance",
  "provider": "Replicate (https://replicate.com)",
  "model": "black-forest-labs/flux-schneell",
  "input": {
    "prompt": "black forest gateau cake spelling out the words FLUX SCHNELL, tasty, food photography, dynamic shot",
    "num_outputs": 1,
    "aspect_ratio": "1:1",
    "output_format": "webp",
    "output_quality": 80
  },
  "output": [
    "https://replicate.delivery/yhqm/A8gbZlebANWBFSU1mTWSznUwZ0XGtflFAQ8DT35trPNvUaUTA/out-0.webp"
  ],
  "meta": {
    "completed_at": "2024-08-20T01:36:47.839339Z",
    "created_at": "2024-08-20T01:36:46.515000Z"
  }
}
```

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
  "description": "MediaProvenance: A spec for describing the origins of AI-generated images. See https://github.com/zeke/media-provenance",
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

## Schema

This is the JSON schema for the MediaProvenance format:

<!--BEGIN SCHEMA-->
```json
{
  "$ref": "#/definitions/MediaProvenance",
  "definitions": {
    "MediaProvenance": {
      "type": "object",
      "properties": {
        "description": {
          "type": "string",
          "description": "An explanatory blurb about the MediaProvenance spec itself. This is set automatically by tools."
        },
        "provider": {
          "type": "string",
          "description": "The app or service that ran the model."
        },
        "model": {
          "type": "string",
          "description": "The model used to generate the image"
        },
        "input": {
          "type": "object",
          "additionalProperties": {},
          "description": "The input parameters to the model"
        },
        "output": {
          "description": "The output of the model"
        },
        "meta": {
          "type": "object",
          "additionalProperties": {},
          "description": "Extra metadata"
        }
      },
      "required": [
        "description",
        "provider",
        "model",
        "input",
        "meta"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
<!--END SCHEMA-->

## Notes

- Data is stored using [EXIF](https://en.wikipedia.org/wiki/Exif), a popular image format metadata format.
- Data is stored as a JSON string in the [`MakerNote`](https://exiftool.org/idiosyncracies.html) field, which is one of the few EXIF fields that allows for arbitrary data.
- Data _could_ be stored using `XMP`, an alternative to EXIF created by Adobe that supports more formats. Avoided that for now because it's XML. :[

## Tips

- This package doesn't provide raw access to EXIF data. If you need to read and write raw EXIF data, you can use the [`exiftool`](https://exiftool.org/) command line tool or the [exiftool-vendored](https://github.com/photostructure/exiftool-vendored) npm package.