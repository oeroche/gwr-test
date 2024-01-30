import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TravelInfoDto } from '@/partners/dtos/partners.in.dto';
import * as crypto from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(401);
  });

  describe('auth', () => {
    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user1@email.com', password: 'password' })
        .expect(201)
        .expect((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    it('/auth/login (POST) - invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid', password: 'invalid' })
        .expect(400);
    });

    it('/auth/login (POST) - missing credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid' })
        .expect(400);
    });

    it('/auth/generateApiKey (POST) - missing token', () => {
      return request(app.getHttpServer())
        .post('/auth/generateApiKey')
        .expect(401);
    });

    it('/auth/generateApiKey (POST) - valid token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user1@email.com', password: 'password' })
        .expect(201);

      const token = res.body.token;
      return request(app.getHttpServer())
        .post('/auth/generateApiKey')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.accountKey).toBeDefined();
        });
    });
  });

  describe('partner', () => {
    const travelInfoBase: Omit<TravelInfoDto, 'toTravelInfoEntity'> = {
      clientEmail: 'client@email.com',
      clientLanguage: 'fr',
      countryOfDestination: 'us',
      countryOfOrigin: 'fr',
      travelEndDate: new Date('2025-12-12'),
      travelStartDate: new Date('2024-12-12'),
    };

    let accountKey: string;
    let signSecret: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user1@email.com', password: 'password' });

      const token = res.body.token;
      const accountKeyRes = await request(app.getHttpServer())
        .post('/auth/generateApiKey')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
      accountKey = accountKeyRes.body.accountKey;
      signSecret = accountKeyRes.body.signSecret;
    });

    it('/partners/travels/record (POST)', () => {
      const signature = crypto
        .createHmac('sha256', signSecret)
        .update(
          JSON.stringify({ payload: travelInfoBase, timestamp: Date.now() }),
        )
        .digest('base64');

      return request(app.getHttpServer())
        .post('/partners/travels/record')
        .set('account-key', accountKey)
        .set('x-signature', signature)
        .send(travelInfoBase)
        .expect(400);
    });

    it('/partners/travels/record (POST) invalid clientEmail', async () => {
      return request(app.getHttpServer())
        .post('/partners/travels/record')
        .set('account-key', accountKey)
        .send({ ...travelInfoBase, clientEmail: 'invalid' })
        .expect(400);
    });

    it('/partners/travels/record (POST) should return ok ', async () => {
      const timestamp = Date.now().toString();
      const signature = crypto
        .createHmac('sha256', signSecret)
        .update(JSON.stringify({ payload: travelInfoBase, timestamp }))
        .digest('base64');

      return request(app.getHttpServer())
        .post('/partners/travels/record')
        .set('account-key', accountKey)
        .set('x-signature', signature)
        .set('x-timestamp', timestamp.toString())
        .send(travelInfoBase)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBe('ok');
        });
    });
  });
});
