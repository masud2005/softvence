import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from '@softvence/s3';

@Module({
  imports: [
    S3Module.forRoot({
      region: 'us-east-1',
      bucket: 'softvence-s3-example',
      accessKeyId: 'AWS_ACCESS_KEY_ID',
      secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
      cache: {
        isCache: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
