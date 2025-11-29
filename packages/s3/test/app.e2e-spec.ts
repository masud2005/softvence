import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { S3Module } from '../src/s3.module';
import { S3Service } from '../src/services/s3.service';

describe('S3Module (e2e)', () => {
  let app: INestApplication;
  let s3Service: S3Service;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        S3Module.forRoot({
          region: 'us-east-1',
          bucket: 'test-bucket',
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    s3Service = app.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(s3Service).toBeDefined();
  });
});
