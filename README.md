# Softvence 🚀

> A modern monorepo of reusable NestJS packages and utilities for building scalable applications

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/repo)

## 📦 Packages

This monorepo contains a collection of production-ready NestJS packages designed to accelerate your development workflow.

### Available Packages

| Package                              | Version | Description                                                   |
| ------------------------------------ | ------- | ------------------------------------------------------------- |
| [`@softvence/s3`](./packages/s3)     | `0.0.1` | AWS S3 file upload service with caching and auto-organization |
| [`@softvence/mail`](./packages/mail) | `0.0.1` | Email service powered by Nodemailer with template support     |

### Package Details

#### 📤 [@softvence/s3](./packages/s3)

A powerful NestJS module for uploading files to AWS S3 with built-in features:

- ✨ Single and multiple file uploads
- 🗂️ Automatic folder organization by MIME type
- ⚡ Built-in caching with hash-based deduplication
- 🔒 SHA256 file hashing
- 📦 Full TypeScript support

[View Documentation →](./packages/s3/README.md)

#### 📧 [@softvence/mail](./packages/mail)

A flexible email service for NestJS applications:

- 📨 Built on Nodemailer
- 🎨 Template system with built-in OTP template
- 🔧 Support for all major email providers (Gmail, SendGrid, SMTP, etc.)
- 📬 Rich email options (attachments, CC, BCC, priority)
- ⚡ Optional queue integration

[View Documentation →](./packages/mail/README.md)

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18
- **pnpm**: >= 9.0.0
- **NestJS**: >= 11.0.0 (for using the packages)

### Installation

Install pnpm if you haven't already:

```bash
npm install -g pnpm
```

Clone the repository:

```bash
git clone https://github.com/softvence-agency/softvence.git
cd softvence
```

Install dependencies:

```bash
pnpm install
```

## 📖 Using the Packages

### Installing a Package

You can install any package from this monorepo in your NestJS application:

```bash
npm install @softvence/s3
# or
npm install @softvence/mail
```

### Quick Example - S3 Package

```typescript
import { Module } from "@nestjs/common";
import { S3Module } from "@softvence/s3";

@Module({
  imports: [
    S3Module.forRoot({
      region: "us-east-1",
      bucket: "my-bucket",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }),
  ],
})
export class AppModule {}
```

### Quick Example - Mail Package

```typescript
import { Module } from "@nestjs/common";
import { MailModule } from "@softvence/mail";

@Module({
  imports: [
    MailModule.forRoot({
      transport: {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
})
export class AppModule {}
```

## 🛠️ Development

### Project Structure

```
softvence/
├── apps/              # Applications
├── packages/          # Shared packages
│   ├── s3/           # S3 upload service
│   ├── mail/         # Email service
│   └── typescript-config/  # Shared TypeScript configs
├── package.json       # Root package configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── turbo.json        # Turborepo configuration
```

### Available Scripts

```bash
# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types

# Publish packages
pnpm publish-packages
```

### Building Packages

Build all packages in the monorepo:

```bash
pnpm build
```

Build a specific package:

```bash
cd packages/s3
pnpm build
```

### Running Tests

```bash
# Run tests for all packages
pnpm test

# Run tests for a specific package
cd packages/mail
pnpm test
```

## 🏗️ Monorepo Architecture

This project uses:

- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Turborepo](https://turbo.build/repo)** - High-performance build system for monorepos
- **[Changesets](https://github.com/changesets/changesets)** - Version management and changelog generation

### Why Monorepo?

- 📦 **Code Sharing** - Share code between packages easily
- 🔄 **Atomic Changes** - Make changes across multiple packages in a single commit
- 🚀 **Faster Builds** - Turborepo caches and parallelizes builds
- 📝 **Consistent Tooling** - Shared configuration across all packages
- 🔗 **Better Collaboration** - All packages in one place

## 📚 Documentation

Each package has its own comprehensive documentation:

- [S3 Package Documentation](./packages/s3/README.md)
- [Mail Package Documentation](./packages/mail/README.md)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding a New Package

1. Create a new directory in `packages/`:

   ```bash
   mkdir packages/my-package
   cd packages/my-package
   ```

2. Initialize the package:

   ```bash
   pnpm init
   ```

3. Add the package to `pnpm-workspace.yaml` (already included via `packages/*`)

4. Follow the existing package structure and conventions

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Code Style

- Use TypeScript for all packages
- Follow the existing code style
- Run `pnpm format` before committing
- Ensure `pnpm lint` passes
- Add tests for new features

### Commit Convention

We follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
chore: maintenance tasks
test: add tests
refactor: code refactoring
```

## 📋 Publishing Packages

This monorepo uses Changesets for version management:

1. Create a changeset:

   ```bash
   pnpm changeset
   ```

2. Commit the changeset:

   ```bash
   git add .
   git commit -m "chore: add changeset"
   ```

3. Publish packages:
   ```bash
   pnpm publish-packages
   ```

## 🔧 Troubleshooting

### pnpm Installation Issues

If you encounter issues with pnpm:

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build Failures

If builds fail:

```bash
# Clean build artifacts
pnpm clean

# Rebuild all packages
pnpm build
```

### Turborepo Cache Issues

Clear Turborepo cache:

```bash
rm -rf .turbo
pnpm build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Sabbir Hossain Shuvo** - [softvenceomega@gmail.com](mailto:softvenceomega@gmail.com)

## 🔗 Links

- **Repository**: [github.com/softvence-agency/softvence](https://github.com/softvence-agency/softvence)
- **Issues**: [github.com/softvence-agency/softvence/issues](https://github.com/softvence-agency/softvence/issues)
- **Discussions**: [github.com/softvence-agency/softvence/discussions](https://github.com/softvence-agency/softvence/discussions)

## 🌟 Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by the Softvence Team**
