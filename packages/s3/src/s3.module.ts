import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import {
  S3_MODULE_OPTIONS,
  S3ModuleAsyncOptions,
  S3ModuleOptions,
} from "./constants/s3.options";
import { S3Service } from "./services/s3.service";

@Global()
@Module({})
export class S3Module {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      global: true,
      providers: [
        {
          provide: S3_MODULE_OPTIONS,
          useValue: options,
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    return {
      module: S3Module,
      global: true,
      imports: options.imports || [],
      providers: [this.createAsyncProviders(options), S3Service],
      exports: [S3Service],
    };
  }

  private static createAsyncProviders(options: S3ModuleAsyncOptions): Provider {
    return {
      provide: S3_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
