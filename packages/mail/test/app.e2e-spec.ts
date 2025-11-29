import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MailModule } from '../src/mail.module';
import { MailService } from '../src/services/mail.service';

describe('MailModule (e2e)', () => {
  let app: INestApplication;
  let mailService: MailService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MailModule.forRoot({
          transport: {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
              user: 'user',
              pass: 'pass',
            },
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    mailService = app.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });
});
