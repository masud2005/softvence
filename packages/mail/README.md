# @softvence/mail

A powerful and flexible NestJS mail service built on top of Nodemailer with built-in template support, custom template rendering, and optional queue integration.

## Features

✨ **Easy Integration** - Seamlessly integrates with NestJS applications  
📧 **Nodemailer Powered** - Built on the reliable Nodemailer library  
🎨 **Template System** - Built-in OTP template with customizable template renderer  
🔧 **Flexible Configuration** - Support for all major email providers (Gmail, SendGrid, etc.)  
📬 **Rich Email Options** - Support for attachments, CC, BCC, priority, and custom headers  
⚡ **Queue Support** - Optional mail queue integration for async processing  
📦 **TypeScript Support** - Fully typed with TypeScript for better developer experience

## Installation

```bash
npm install @softvence/mail
# or
yarn add @softvence/mail
# or
pnpm add @softvence/mail
```

## Prerequisites

- Node.js >= 16
- NestJS >= 11.0.0
- Email service credentials (Gmail, SendGrid, SMTP, etc.)

## Quick Start

### 1. Import the Module

Import `MailModule` in your application module and configure it with your email service credentials:

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
      defaults: {
        from: '"My App" <noreply@myapp.com>',
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Use in Your Service/Controller

Inject `MailService` and start sending emails:

```typescript
import { Injectable } from "@nestjs/common";
import { MailService } from "@softvence/mail";

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async sendOTP(email: string, otp: string) {
    await this.mailService.send({
      to: email,
      subject: "Your OTP Code",
      template: "otp",
      context: {
        otp,
        expire: "5m",
      },
    });
  }
}
```

## Configuration

### MailModuleOptions

| Option             | Type                                     | Required | Description                        |
| ------------------ | ---------------------------------------- | -------- | ---------------------------------- |
| `transport`        | `SMTPTransport \| SMTPTransport.Options` | ✅       | Nodemailer transport configuration |
| `defaults`         | `nodemailer.Transporter['options']`      | ❌       | Default mail options (from, etc.)  |
| `templateRenderer` | `(type, context) => string`              | ❌       | Custom template renderer function  |
| `mailQueue`        | `boolean \| QueueConfig`                 | ❌       | Mail queue configuration           |

### Transport Configuration

The `transport` option accepts any valid Nodemailer transport configuration. Here are common examples:

#### Gmail

```typescript
transport: {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // Use App Password, not regular password
  },
}
```

#### SendGrid

```typescript
transport: {
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: 'your-sendgrid-api-key',
  },
}
```

#### Custom SMTP

```typescript
transport: {
  host: 'smtp.example.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'username',
    pass: 'password',
  },
}
```

### MailSendOptions

| Option        | Type                          | Description                           |
| ------------- | ----------------------------- | ------------------------------------- |
| `to`          | `string \| string[]`          | Recipient email address(es)           |
| `subject`     | `string`                      | Email subject                         |
| `template`    | `MailTemplateType`            | Built-in template name (e.g., 'otp')  |
| `context`     | `MailContext`                 | Template context data                 |
| `html`        | `string`                      | Raw HTML content (overrides template) |
| `text`        | `string`                      | Plain text content                    |
| `from`        | `string`                      | Sender email (overrides default)      |
| `cc`          | `string \| string[]`          | CC recipients                         |
| `bcc`         | `string \| string[]`          | BCC recipients                        |
| `replyTo`     | `string`                      | Reply-to address                      |
| `priority`    | `'high' \| 'normal' \| 'low'` | Email priority                        |
| `attachments` | `any[]`                       | Email attachments                     |
| `headers`     | `Record<string, string>`      | Custom email headers                  |

### TTL Constants

The package includes predefined TTL (Time To Live) constants for OTP expiration:

```typescript
import { TTL } from "@softvence/mail";

// Seconds: '10s', '30s'
// Minutes: '1m', '2m', '3m', '4m', '5m', '10m', '15m', '30m'
// Hours: '1h', '2h', '6h', '12h'
// Days: '1d', '3d', '7d', '14d', '30d'
// Weeks: '1w', '2w', '4w'
// Months: '1mo', '3mo', '6mo'
```

## Usage Examples

### Basic Email Sending

```typescript
import { Injectable } from "@nestjs/common";
import { MailService } from "@softvence/mail";

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailService.send({
      to: email,
      subject: "Welcome to Our Platform!",
      html: `<h1>Hello ${name}!</h1><p>Welcome to our platform.</p>`,
    });
  }
}
```

### Using Built-in OTP Template

```typescript
import { Injectable } from "@nestjs/common";
import { MailService } from "@softvence/mail";

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async sendOTP(email: string) {
    const otp = this.generateOTP(); // Your OTP generation logic

    await this.mailService.send({
      to: email,
      subject: "Your Verification Code",
      template: "otp",
      context: {
        otp,
        expire: "5m", // OTP expires in 5 minutes
      },
    });
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
```

### Sending to Multiple Recipients

```typescript
async sendBulkNotification(emails: string[], message: string) {
  await this.mailService.send({
    to: emails, // Array of email addresses
    subject: 'Important Notification',
    html: `<p>${message}</p>`,
  });
}
```

### Email with Attachments

```typescript
import * as fs from 'fs';

async sendInvoice(email: string, invoicePath: string) {
  await this.mailService.send({
    to: email,
    subject: 'Your Invoice',
    html: '<p>Please find your invoice attached.</p>',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: invoicePath,
      },
      {
        filename: 'logo.png',
        content: fs.readFileSync('./assets/logo.png'),
      },
    ],
  });
}
```

### Email with CC and BCC

```typescript
async sendReport(to: string, cc: string[], bcc: string[]) {
  await this.mailService.send({
    to,
    cc,
    bcc,
    subject: 'Monthly Report',
    html: '<h1>Monthly Report</h1><p>Report content here...</p>',
    priority: 'high',
  });
}
```

### Custom Template Renderer

Create custom templates by providing a `templateRenderer` function:

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
      templateRenderer: (type, context) => {
        switch (type) {
          case "otp":
            return `
              <div style="font-family: Arial, sans-serif;">
                <h1>Your OTP Code</h1>
                <p>Your verification code is: <strong>${context.otp}</strong></p>
                <p>Expires in: ${context.expire}</p>
              </div>
            `;
          case "welcome":
            return `
              <div style="font-family: Arial, sans-serif;">
                <h1>Welcome ${context.name}!</h1>
                <p>Thank you for joining our platform.</p>
              </div>
            `;
          case "password-reset":
            return `
              <div style="font-family: Arial, sans-serif;">
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${context.resetLink}">Reset Password</a>
              </div>
            `;
          default:
            throw new Error(`Unknown template type: ${type}`);
        }
      },
    }),
  ],
})
export class AppModule {}
```

Then use your custom templates:

```typescript
// Send welcome email
await this.mailService.send({
  to: "user@example.com",
  subject: "Welcome!",
  template: "welcome",
  context: { name: "John Doe" },
});

// Send password reset email
await this.mailService.send({
  to: "user@example.com",
  subject: "Reset Your Password",
  template: "password-reset",
  context: { resetLink: "https://example.com/reset?token=abc123" },
});
```

### Using Environment Variables

Create a `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="My App" <noreply@myapp.com>
```

Configure the module:

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "@softvence/mail";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule.forRoot({
      transport: {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

For dynamic configuration using `ConfigService`:

```typescript
import { Module } from "@nestjs/module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailModule } from "@softvence/mail";

@Module({
  imports: [
    ConfigModule.forRoot(),
    {
      module: MailModule,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get("EMAIL_SERVICE"),
          auth: {
            user: configService.get("EMAIL_USER"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
        },
        defaults: {
          from: configService.get("EMAIL_FROM"),
        },
      }),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

### Complete Controller Example

```typescript
import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { MailService } from "@softvence/mail";

class SendEmailDto {
  to: string;
  subject: string;
  message: string;
}

class SendOTPDto {
  email: string;
}

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("send")
  async sendEmail(@Body() dto: SendEmailDto) {
    try {
      await this.mailService.send({
        to: dto.to,
        subject: dto.subject,
        html: `<p>${dto.message}</p>`,
      });

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      throw new BadRequestException("Failed to send email");
    }
  }

  @Post("send-otp")
  async sendOTP(@Body() dto: SendOTPDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailService.send({
      to: dto.email,
      subject: "Your OTP Code",
      template: "otp",
      context: {
        otp,
        expire: "5m",
      },
    });

    return {
      success: true,
      message: "OTP sent successfully",
      // In production, don't return the OTP
      // Store it in cache/database instead
    };
  }
}
```

## Built-in Templates

### OTP Template

The package includes a built-in OTP (One-Time Password) template with a professional design:

```typescript
await this.mailService.send({
  to: "user@example.com",
  subject: "Your Verification Code",
  template: "otp",
  context: {
    otp: "123456",
    expire: "5m", // Any TTL constant
  },
});
```

The OTP template features:

- Clean, responsive design
- Prominent OTP display
- Expiration time notice
- Professional styling
- Mobile-friendly layout

## API Reference

### MailService

#### `send(options: MailSendOptions): Promise<void>`

Sends an email with the specified options.

**Parameters:**

- `options` - Mail send options (see MailSendOptions table above)

**Returns:** Promise that resolves when email is sent

**Throws:** `BadGatewayException` if email sending fails

**Example:**

```typescript
await this.mailService.send({
  to: "user@example.com",
  subject: "Hello",
  html: "<p>Hello World!</p>",
});
```

## Best Practices

### 1. **Use Environment Variables**

Never hardcode email credentials. Always use environment variables:

```typescript
MailModule.forRoot({
  transport: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
});
```

### 2. **Use App Passwords for Gmail**

If using Gmail, create an App Password instead of using your regular password:

1. Enable 2-Factor Authentication
2. Go to Google Account → Security → App Passwords
3. Generate a new app password
4. Use this password in your configuration

### 3. **Handle Errors Gracefully**

Always wrap email sending in try-catch blocks:

```typescript
try {
  await this.mailService.send(options);
  this.logger.log("Email sent successfully");
} catch (error) {
  this.logger.error("Failed to send email", error);
  // Handle error appropriately
}
```

### 4. **Use Templates for Consistency**

Create reusable templates for common email types:

```typescript
templateRenderer: (type, context) => {
  const templates = {
    otp: generateOtpTemplate,
    welcome: generateWelcomeTemplate,
    "password-reset": generatePasswordResetTemplate,
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown template: ${type}`);
  }

  return template(context);
};
```

### 5. **Validate Email Addresses**

Validate email addresses before sending:

```typescript
import { IsEmail } from "class-validator";

class SendEmailDto {
  @IsEmail()
  to: string;

  subject: string;
  message: string;
}
```

### 6. **Use Queue for Bulk Emails**

For sending bulk emails, consider using a queue system to avoid blocking:

```typescript
MailModule.forRoot({
  transport: {
    /* ... */
  },
  mailQueue: {
    queueName: "mail-queue",
    host: "localhost",
    port: 6379,
    username: "default",
    password: "default",
  },
});
```

### 7. **Test Email Configuration**

Test your email configuration in development:

```typescript
@Injectable()
export class MailService {
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email server connection successful");
    } catch (error) {
      console.error("❌ Email server connection failed", error);
    }
  }
}
```

### 8. **Use Proper From Addresses**

Use a proper "from" address with display name:

```typescript
defaults: {
  from: '"My App Support" <support@myapp.com>',
}
```

### 9. **Implement Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 emails per minute
    }),
  ],
})
```

### 10. **Log Email Activities**

Log all email activities for debugging and monitoring:

```typescript
await this.mailService.send(options);
this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
```

## Error Handling

The service throws `BadGatewayException` when email sending fails:

```typescript
import { BadGatewayException } from "@nestjs/common";

try {
  await this.mailService.send(options);
} catch (error) {
  if (error instanceof BadGatewayException) {
    console.error("Email service error:", error.message);
    // Handle email service errors
  }
  throw error;
}
```

## TypeScript Support

All types are exported and can be imported:

```typescript
import {
  MailService,
  MailModuleOptions,
  MailSendOptions,
  MailTemplateType,
  MailContext,
  TTL,
  TTLKey,
} from "@softvence/mail";
```

## Common Email Providers

### Gmail

```typescript
transport: {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
}
```

### SendGrid

```typescript
transport: {
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
}
```

### Mailgun

```typescript
transport: {
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD,
  },
}
```

### Amazon SES

```typescript
transport: {
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  auth: {
    user: process.env.AWS_SES_USERNAME,
    pass: process.env.AWS_SES_PASSWORD,
  },
}
```

### Outlook/Office 365

```typescript
transport: {
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password',
  },
}
```

## Troubleshooting

### Gmail "Less Secure Apps" Error

**Solution:** Use App Passwords instead of regular passwords. Enable 2FA and generate an app password.

### Connection Timeout

**Solution:** Check your firewall settings and ensure the SMTP port is not blocked.

### Authentication Failed

**Solution:** Verify your credentials and ensure you're using the correct username/password format for your provider.

### Emails Going to Spam

**Solution:**

- Use a verified domain
- Set up SPF, DKIM, and DMARC records
- Use a reputable email service provider
- Avoid spam trigger words in subject/content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Sabbir Hossain Shuvo](mailto:devlopersabbir@gmail.com)

## Repository

- **GitHub:** [devlopersabbir/softvence](https://github.com/devlopersabbir/softvence)
- **Issues:** [Report a bug](https://github.com/devlopersabbir/softvence/issues)

## Support

For questions and support, please open an issue on GitHub.

---

**Made with ❤️ by the Softvence Team**
