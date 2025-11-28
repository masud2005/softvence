# @softvence/s3

A powerful and flexible NestJS module for uploading files to AWS S3 with built-in caching, automatic folder organization, and hash-based deduplication.

## Features

✨ **Smart File Upload** - Upload single or multiple files to AWS S3 with ease  
🗂️ **Auto Organization** - Automatically organizes files into folders based on MIME type (images, videos, audio, documents)  
⚡ **Built-in Caching** - Optional caching layer using `node-cache` to prevent duplicate uploads  
🔒 **Hash-based Deduplication** - Uses SHA256 hashing to detect and prevent duplicate file uploads  
📦 **TypeScript Support** - Fully typed with TypeScript for better developer experience  
🎯 **NestJS Integration** - Seamlessly integrates with NestJS applications

## Installation

```bash
npm install @softvence/s3
# or
yarn add @softvence/s3
# or
pnpm add @softvence/s3
```

## Prerequisites

- Node.js >= 16
- NestJS >= 11.0.0
- AWS S3 bucket with appropriate credentials

## Quick Start

### 1. Import the Module

Import `S3Module` in your application module and configure it with your AWS credentials:

```typescript
import { Module } from "@nestjs/common";
import { S3Module } from "@softvence/s3";

@Module({
  imports: [
    S3Module.forRoot({
      region: "us-east-1",
      bucket: "my-bucket-name",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      cache: {
        isCache: true, // Enable caching
        options: {
          stdTTL: 86400, // Cache TTL in seconds (default: 1 day)
          checkperiod: 120, // Cache check period in seconds
        },
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Use in Your Service/Controller

Inject `S3Service` and start uploading files:

```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { S3Service } from "@softvence/s3";

@Controller("upload")
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("single")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.s3Service.uploadFile(file);
    return result;
  }

  @Post("multiple")
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.s3Service.uploadFiles(files);
    return results;
  }
}
```

## Configuration

### S3ModuleOptions

| Option            | Type             | Required | Description                                     |
| ----------------- | ---------------- | -------- | ----------------------------------------------- |
| `region`          | `string`         | ✅       | AWS region (e.g., 'us-east-1')                  |
| `bucket`          | `string`         | ✅       | S3 bucket name                                  |
| `accessKeyId`     | `string`         | ✅       | AWS access key ID                               |
| `secretAccessKey` | `string`         | ✅       | AWS secret access key                           |
| `endpoint`        | `string`         | ❌       | Custom S3 endpoint (for S3-compatible services) |
| `cache`           | `S3CacheOptions` | ❌       | Cache configuration                             |

### S3CacheOptions

| Option                | Type      | Default | Description                   |
| --------------------- | --------- | ------- | ----------------------------- |
| `isCache`             | `boolean` | `false` | Enable/disable caching        |
| `options.stdTTL`      | `number`  | `86400` | Cache TTL in seconds (1 day)  |
| `options.checkperiod` | `number`  | `120`   | Cache check period in seconds |

### Metadata Options

| Option           | Type     | Default    | Description                        |
| ---------------- | -------- | ---------- | ---------------------------------- |
| `maxFileSize`    | `number` | `20971520` | Maximum file size in bytes (20 MB) |
| `maxFiles`       | `number` | `20`       | Maximum number of files to upload  |
| `actualFileName` | `string` | `""`       | Custom file name (optional)        |
| `fileHash`       | `string` | `""`       | Custom file hash (optional)        |

## Usage Examples

### Basic Single File Upload

```typescript
import { Injectable } from "@nestjs/common";
import { S3Service } from "@softvence/s3";

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadProfilePicture(file: Express.Multer.File) {
    const result = await this.s3Service.uploadFile(file);

    console.log("File uploaded:", result.url);
    console.log("Bucket:", result.bucket);
    console.log("File size:", result.size);
    console.log("MIME type:", result.mimeType);

    return result;
  }
}
```

### Upload with Custom Metadata

```typescript
async uploadWithMetadata(file: Express.Multer.File) {
  const result = await this.s3Service.uploadFile(file, {
    maxFileSize: 10 * 1024 * 1024, // 10 MB limit
    actualFileName: 'custom-name',
  });

  return result;
}
```

### Multiple Files Upload

```typescript
async uploadGallery(files: Express.Multer.File[]) {
  const results = await this.s3Service.uploadFiles(files, {
    maxFiles: 5, // Limit to 5 files
    maxFileSize: 5 * 1024 * 1024, // 5 MB per file
  });

  return results.map(r => ({
    url: r.url,
    originalName: r.originalName,
    cached: r.cached,
  }));
}
```

### Complete Controller Example

```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { S3Service } from "@softvence/s3";

@Controller("files")
export class FilesController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const result = await this.s3Service.uploadFile(file, {
      maxFileSize: 2 * 1024 * 1024, // 2 MB
    });

    return {
      message: "Avatar uploaded successfully",
      url: result.url,
      cached: result.cached,
    };
  }

  @Post("documents")
  @UseInterceptors(FilesInterceptor("documents", 10))
  async uploadDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.s3Service.uploadFiles(files, {
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10 MB per file
    });

    return {
      message: `${results.length} documents uploaded successfully`,
      files: results.map((r) => ({
        url: r.url,
        name: r.originalName,
        size: r.size,
        folder: r.folder,
      })),
    };
  }
}
```

### Using Environment Variables

Create a `.env` file:

```env
AWS_REGION=us-east-1
AWS_BUCKET=my-s3-bucket
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

Configure the module:

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "@softvence/s3";

@Module({
  imports: [
    ConfigModule.forRoot(),
    S3Module.forRoot({
      region: process.env.AWS_REGION!,
      bucket: process.env.AWS_BUCKET!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      cache: {
        isCache: true,
      },
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

For dynamic configuration using `ConfigService`:

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "@softvence/s3";

@Module({
  imports: [
    ConfigModule.forRoot(),
    {
      module: S3Module,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        region: configService.get("AWS_REGION")!,
        bucket: configService.get("AWS_BUCKET")!,
        accessKeyId: configService.get("AWS_ACCESS_KEY_ID")!,
        secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY")!,
        cache: {
          isCache: true,
          options: {
            stdTTL: 86400,
          },
        },
      }),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

## API Reference

### S3Service

#### `uploadFile(file: Express.Multer.File, metadata?: Metadata): Promise<S3Response>`

Uploads a single file to S3.

**Parameters:**

- `file` - Multer file object
- `metadata` - Optional metadata configuration

**Returns:** Promise resolving to `S3Response`

**Throws:** `BadRequestException` if upload fails

---

#### `uploadFiles(files: Express.Multer.File[], metadata?: Metadata): Promise<S3Response[]>`

Uploads multiple files to S3.

**Parameters:**

- `files` - Array of Multer file objects
- `metadata` - Optional metadata configuration

**Returns:** Promise resolving to array of `S3Response`

**Throws:**

- `BadRequestException` if no files provided
- `BadRequestException` if file count exceeds `maxFiles`

### S3Response Type

```typescript
type S3Response = {
  url: string; // Full S3 URL
  bucket: string; // Bucket name
  region: string; // AWS region
  originalName: string; // Original file name
  size: number; // File size in bytes
  mimeType: string; // MIME type
  extension: string; // File extension
  folder: string; // Auto-assigned folder (images/videos/audio/documents)
  hash?: string; // SHA256 hash (for cached/small files)
  cached?: boolean; // Whether file was returned from cache
  cacheKey?: string; // Cache key if cached
  uploadedAt: Date; // Upload timestamp
  metadata?: Metadata; // User-provided metadata
};
```

## Folder Organization

Files are automatically organized into folders based on their MIME type:

| MIME Type Pattern | Folder       |
| ----------------- | ------------ |
| `image/*`         | `images/`    |
| `video/*`         | `videos/`    |
| `audio/*`         | `audio/`     |
| All others        | `documents/` |

**Example URLs:**

- Image: `https://my-bucket.s3.us-east-1.amazonaws.com/images/abc123.jpg`
- Video: `https://my-bucket.s3.us-east-1.amazonaws.com/videos/xyz789.mp4`
- PDF: `https://my-bucket.s3.us-east-1.amazonaws.com/documents/doc456.pdf`

## Caching Behavior

When caching is enabled:

1. **Small files** (< `maxFileSize`) are hashed using SHA256
2. **Hash is checked** against the cache before uploading
3. **If found in cache**, the cached URL is returned immediately (no S3 upload)
4. **If not found**, file is uploaded and cached for future requests
5. **Cache TTL** determines how long the entry stays in cache

**Benefits:**

- Prevents duplicate uploads
- Reduces S3 costs
- Faster response times for duplicate files

## Best Practices

### 1. **Use Environment Variables**

Never hardcode AWS credentials. Always use environment variables or a secure configuration service.

```typescript
S3Module.forRoot({
  region: process.env.AWS_REGION!,
  bucket: process.env.AWS_BUCKET!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
```

### 2. **Enable Caching for Performance**

Enable caching to improve performance and reduce costs:

```typescript
cache: {
  isCache: true,
  options: {
    stdTTL: 86400, // 1 day
  },
}
```

### 3. **Set Appropriate File Size Limits**

Protect your application from large file uploads:

```typescript
await this.s3Service.uploadFile(file, {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
});
```

### 4. **Validate File Types**

Use NestJS pipes to validate file types before upload:

```typescript
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async upload(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.s3Service.uploadFile(file);
}
```

### 5. **Handle Errors Gracefully**

Always wrap uploads in try-catch blocks:

```typescript
try {
  const result = await this.s3Service.uploadFile(file);
  return { success: true, url: result.url };
} catch (error) {
  console.error("Upload failed:", error);
  throw new BadRequestException("Failed to upload file");
}
```

### 6. **Configure S3 Bucket CORS**

If accessing files from a browser, configure CORS on your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 7. **Use IAM Policies**

Grant minimal required permissions to your AWS user/role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Error Handling

The service throws `BadRequestException` in the following cases:

- No files uploaded
- File count exceeds `maxFiles` limit
- S3 upload fails

**Example:**

```typescript
import { BadRequestException } from "@nestjs/common";

try {
  const result = await this.s3Service.uploadFile(file);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error("Upload error:", error.message);
  }
  throw error;
}
```

## TypeScript Support

All types are exported and can be imported:

```typescript
import {
  S3Service,
  S3ModuleOptions,
  S3Response,
  Metadata,
  S3CacheOptions,
} from "@softvence/s3";
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Sabbir Hossain Shuvo](mailto:softvenceomega@gmail.com)

## Repository

- **GitHub:** [softvence-agency/softvence](https://github.com/softvence-agency/softvence)
- **Issues:** [Report a bug](https://github.com/softvence-agency/softvence/issues)

## Support

For questions and support, please open an issue on GitHub.

---

**Made with ❤️ by the Softvence Team**
