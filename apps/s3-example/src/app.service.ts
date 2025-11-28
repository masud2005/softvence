import { Injectable } from '@nestjs/common';
import { S3Service } from '@softvence/s3';

@Injectable()
export class AppService {
  constructor(private readonly service: S3Service) {}
  getHello(): string {
    // const res = this.service.uploadFiles();
    return 'Hello World!';
  }
}
