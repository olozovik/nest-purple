import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constants';

describe('Auth controller (e2e)', () => {
    let app: INestApplication;

    const authDto: AuthDto = {
        email: 'test@test.com',
        password: '12345',
    };

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(authDto)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.access_token).toBeDefined();
            });
    });

    it('/auth/login (POST) - wrong login', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...authDto, email: 'test@test.commm' })
            .expect(401, {
                message: USER_NOT_FOUND,
                statusCode: 401,
                error: 'Unauthorized',
            });
    });

    it('/auth/login (POST) - wrong password', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...authDto, password: '12345_' })
            .expect(401, {
                message: WRONG_PASSWORD,
                statusCode: 401,
                error: 'Unauthorized',
            });
    });

    afterAll(() => {
        disconnect();
    });
});
