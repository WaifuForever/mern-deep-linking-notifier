import mongoose from 'mongoose';
import supertest from 'supertest';

import { app } from '../../src/config/express.config';
import { getMessage } from '../../src/utils/message.util';
import { admin1, admin2, user1, user2 } from '../mocks/user.mock';

const itif = (condition: boolean) => (condition ? it : it.skip);

const createUser = (payload: any, token: string, statusCode: number) => {
    it('POST /sign-up', async () => {
        await supertest(app)
            .post('/users')
            .set('Authorization', 'Bearer ' + token)
            .send(payload)
            .then(response => {
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                //console.log(response)

                payload._id = response.body.data?._id
                    ? response.body.data._id
                    : new mongoose.Types.ObjectId().toString();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.valid.sign_up.success'),
                            data: { _id: response.body.data._id },
                        });

                        break;

                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: expect.any(Array),
                        });
                        break;

                    case 401:
                        expect(response.status).toEqual(401);
                        break;

                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });

    it('check for the previous request', async () => {
        await supertest(app)
            .get(`/users/findOne?_id=${payload._id}`)
            .send(payload)
            .then(response => {
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                //console.log(response)

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                            data: schema(payload),
                        });

                        break;

                    case 400:
                        //console.log(payload)
                        expect(response.status).toEqual(404);
                        expect(response.body.metadata).toBeDefined();
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                        });
                        break;

                    case 401:
                        expect(response.status).toEqual(404);
                        expect(response.body.metadata).toBeDefined();
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                        });

                        break;

                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
};

const findUser = (
    payload: { _id: string | string[]; [key: string]: any },
    token: string,
    statusCode: number,
) => {
    it('GET /users/findOne', async () => {
        let path = Array.isArray(payload._id)
            ? `/users/findOne?_id=${payload._id[0]}&_id${payload._id[1]}`
            : `/users/findOne?_id=${payload._id}`;
        await supertest(app)
            .get(path)
            .send(payload)
            .then(response => {
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                //console.log(response.body)

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                        });

                        break;

                    case 400:
                        //console.log(payload)
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                        });
                        break;

                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body.metadata).toBeDefined();
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                        });

                        break;

                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
};

const schema = (payload: { _id: string; email: string; name: string }) => {
    return {
        _id: payload._id,
        email: payload.email,
        name: payload.name,
    };
};

export { createUser, findUser };
