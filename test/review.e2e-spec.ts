import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
    name: 'Test',
    title: 'Title',
    description: 'Description',
    rating: 5,
    productId,
};

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/review (POST)', async () => {
        return request(app.getHttpServer())
            .post('/review')
            .send(testDto)
            .expect(201)
            .then(({ body }: request.Response) => {
                createdId = body._id;
                expect(createdId).toBeDefined();
            });
    });

    it('/review (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/review')
            .send({ ...testDto, rating: 7 })
            .expect(400);
    });

    it('/review/byProduct/:productId (GET) - found product', async () => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + productId)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBeGreaterThan(0);
            });
    });

    it('/review/byProduct/:productId (GET) - not found product', async () => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + new Types.ObjectId().toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(0);
            });
    });

    it('/review/:id (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
            .expect(200);
    });

    it('/review/:id (DELETE) - not existing review', () => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .expect(404, {
                message: REVIEW_NOT_FOUND,
                statusCode: 404,
            });
    });

    afterAll(() => {
        disconnect();
    });
});
