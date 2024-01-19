import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TravelInfoDto } from '@/partners/dtos/partners.in.dto';

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
      clientLanguage: 'FR',
      countryOfDestination: 'UK',
      countryOfOrigin: 'FR',
      travelEndDate: new Date('2024-12-12'),
      travelStartDate: new Date('2025-12-12'),
    };

    let accountKey: string;

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
    });

    it('/partner/travelInfo (POST)', () => {
      return request(app.getHttpServer())
        .post('/partners/travelInfo')
        .set('account-key', accountKey)
        .send(travelInfoBase)
        .expect(400);
    });

    it('/partner/travelInfo (POST) invalid clientEmail', async () => {
      return request(app.getHttpServer())
        .post('/partners/travelInfo')
        .set('account-key', accountKey)
        .send({ ...travelInfoBase, clientEmail: 'invalid' })
        .expect(400);
    });

    it('/partner/travelInfo (POST) ', async () => {
      return request(app.getHttpServer())
        .post('/partners/travelInfo')
        .set('account-key', accountKey)
        .send(travelInfoBase)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBe('ok');
        });
    });
  });
});
