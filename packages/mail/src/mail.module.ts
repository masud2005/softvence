import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { MailModuleOptions } from "./options/module-options";
import { MAIL_MODULE_OPTIONS } from "./options";
import { MailService } from "./services/mail.service";

export interface MailModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<MailModuleOptions> | MailModuleOptions;
  inject?: any[];
  imports?: any[];
}

@Global()
@Module({})
export class MailModule {
  /**
   * Register mail module for root app
   * Here is the example of how to use it
   * ```ts
   * MailModule.forRoot({
   *      transport: {
   *          service: "gmail",
   *          auth: {
   *              user: "test@test.com",
   *              pass: "test",
   *          },
   *      },
   *      defaults: {},
   *      templateRenderer: (type, context) => {
   *          switch (type) {
   *              case "otp":
   *                  return generateOtpEmail(context.otp!, context.expire!);
   *              default:
   *                  throw new Error(`Unknown email template type: ${type}`);
   *          }
   *      },
   *      mailQueue: {
   *          queueName: "mail-queue",
   *          host: "localhost",
   *          port: 6379,
   *          username: "default",
   *          password: "default",
   *      },
   * });
   * ```
   */
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      global: true,
      module: MailModule,
      providers: [
        {
          provide: MAIL_MODULE_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }

  static forRootAsync(options: MailModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: MailModule,
      imports: options.imports || [],
      providers: [
        this.createAsyncProviders(options),
        MailService,
      ],
      exports: [MailService],
    };
  }

  private static createAsyncProviders(options: MailModuleAsyncOptions): Provider {
    return {
      provide: MAIL_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
