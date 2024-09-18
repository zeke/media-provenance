![media-provenance](https://github.com/user-attachments/assets/a9e555c3-b972-42ab-a2e6-ea2fa5e47cc8)

# MediaProvenance

A spec for describing the origins of AI-generated images.

This project defines a specification for describing metadata about AI-generated images, and includes tooling for storing that metadata in image files.

This npm package provides a **JavaScript API** and **command-line interface** for storing and retrieving metadata in image files, so creators can share the origins of their images with others.

Supports PNG, JPG, and WebP image formats for now, but there's room to grow to other formats like video and audio.

## Example 

Run this on an image that's been annotated with provenance data (like the example image at the top of this README):

```
npx media-provenance https://github.com/user-attachments/assets/a9e555c3-b972-42ab-a2e6-ea2fa5e47cc8
```

And you'll see output like this:

```json
{
  "description": "MediaProvenance (v1.0.2): A spec for describing the origins of AI-generated images.\nSee https://github.com/zeke/media-provenance",
  "provider": "Replicate (https://replicate.com/)",
  "model": "apolinario/flux-tarot-v1",
  "input": {
    "aspect_ratio": "16:9",
    "output_format": "jpg",
    "prompt": "a woman at a drafting table closely inspecting a detailed and colorful printed image with a magnifying glass, the words \"Media Provenance\" in large letters above, in the style of TOK a trtcrd, tarot style",
    "replicate_weights": "https://replicate.delivery/yhqm/P0f0U8kSZX3WPyee7NQHScd7S3IwjvC2tWKfiKG7nIOQdXONB/trained_model.tar"
  },
  "output": [
    "https://replicate.delivery/yhqm/B0ftAmvmkX1yNqgOdxdJ0fvTNwMxUKVegpSVlnmC4dbvXE8mA/out-0.jpg"
  ],
  "meta": {
    "id": "9cw1f0gcznrm20cj0f481wrg4g",
    "version": "6c4ebdf049df552f8c02b3a7bbb3afec3d37b20924282bab8744f1168b6de470",
    "status": "succeeded",
    "created_at": "2024-09-18T06:18:15.165Z",
    "metrics": {
      "predict_time": 2.952753868
    }
  }
}
```

Use [jq](https://jqlang.github.io/jq/) to pretty-print the JSON and dig into the data:

```sh
# show the whole thing
npx media-provenance path/to/some/ai/generated/image.jpg | jq

# show the prompt used to generate the image
npx media-provenance path/to/some/ai/generated/image.jpg | jq .input.prompt
```

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/download/prebuilt-installer) 18 or later to use this module, either in a Node.js script or as a CLI.

## Usage (Node.js)

Start by installing the package:

```
npm install media-provenance
```

Then there are two methods you can use: `get` and `set`.

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
  "provider": "Replicate (https://replicate.com)",
  "model": "stability-ai/sdxl",
  "input": {
    "prompt": "A beautiful landscape with a river and mountains",
    "num_outputs": 3,
    "seed": 42
  },
  "output": [
    "https://example.com/output-1.png",
    "https://example.com/output-2.png",
    "https://example.com/output-3.png"
  ], 
  "meta": {
    "completed_at": "2024-08-20T01:36:47.839339Z",
    "created_at": "2024-08-20T01:36:46.515000Z"
  }
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

To use this as a CLI, install it globally:

```
npm install -g media-provenance
```

The CLI installs itself with a few aliases. Pick the one you can remember best:

- `media-provenance`
- `provenance`
- `mp`


Get data from a local file:

```
mp path/to/image.jpg
```

Get data from a URL:

```
mp https://github.com/user-attachments/assets/a9e555c3-b972-42ab-a2e6-ea2fa5e47cc8 | jq
```

Set data:

```
mp set path/to/image.jpg path/to/metadata.json
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