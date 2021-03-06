import mongoose from 'mongoose';
import supertest from 'supertest';

import { app } from '../../src/config/express.config';
import { IUser } from '../../src/models/user.model';
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

                //console.log(response.body)

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
                    case 422:
                        expect(response.status).toEqual(422);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.unprocessable'),
                        });
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

                    case 422:
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

const listUsers = (
    documents: ISchema[],
    token: string,
    statusCode: number,
    admin?: any,
) => {
    it(`GET /users ${documents.length} documents`, async () => {
        let path = `/users${
            admin === undefined
                ? ''
                : admin
                ? `?admin=${admin}`
                : admin === ''
                ? '?admin='
                : '?admin=false'
        }`;
        console.log(path);
        await supertest(app)
            .get(path)
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body).toMatchObject({
                            message:
                                getMessage('user.list.success') +
                                `: ${documents.length}`,
                            data: documents.map(x => {
                                return schema(x);
                            }),
                            metadata: {},
                        });
                        break;
                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: expect.any(Array),
                        });
                        break;
                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            data: [],
                            metadata: {},
                        });
                        break;
                    default:
                        expect(3).toBe(2);
                        break;
                }
            });
    });
};

const updateUser = (
    payload: any,
    token: string,
    message: string,
    statusCode: number,
    checkChanges: boolean = true,
) => {
    it(`PUT /users ${message}`, async () => {
        //payload._id = payload._id === 1 ? writer._id : artist._id;
        switch (payload._id) {
            case 1:
                payload._id = admin1._id;
                break;
            case 2:
                payload._id = admin2._id;
                break;
            case 3:
                payload._id = user1._id;
                break;
            case 4:
                payload._id = user2._id;
                break;
            case -1:
                payload._id = 'not an id';
                break;

            default:
                payload._id = new mongoose.Types.ObjectId().toString();
        }

        await supertest(app)
            .put('/users')
            .send(payload)
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        console.log(response.body);
                        expect(response.status).toEqual(200);

                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.update.success'),
                            metadata: {},
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

                    case 404:
                        expect(response.status).toEqual(404);

                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            metadata: {},
                        });
                        break;
                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });

    itif(checkChanges)('GET check previous PUT operation', async () => {
        await supertest(app)
            .get(`/users/findOne?_id=${payload._id}`)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);

                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                            data: payload,
                            metadata: {},
                        });
                        break;
                    case 400:
                        expect(response.status).toEqual(200);

                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                            metadata: {},
                        });
                        break;
                    case 401:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            metadata: expect.any(String),
                        });
                        break;

                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            metadata: expect.any(String),
                        });
                        break;
                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
};

const deleteUser = (
    payload: { _id: string | number },
    token: string,
    statusCode: number,
    checkChanges: boolean = true,
) => {
    it('DELETE /users', async () => {
        switch (payload._id) {
            case 1:
                payload._id = admin1._id;
                break;
            case 2:
                payload._id = admin2._id;
                break;
            case 3:
                payload._id = user1._id;
                break;
            case 4:
                payload._id = user2._id;
                break;
            case -1:
                payload._id = new mongoose.Types.ObjectId().toString();
                break;
        }

        await supertest(app)
            .delete(`/users?_id=${payload._id}`)
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);

                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            metadata: {},
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
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                        });
                        break;

                    case 404:
                        expect(response.status).toEqual(404);

                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            metadata: {},
                        });
                        break;
                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });

    itif(checkChanges)('GET check previous DELETE operation', async () => {
        await supertest(app)
            .get(`/users/findOne?_id=${payload._id}`)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(404);

                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            data: payload,
                            metadata: {},
                        });
                        break;
                    case 400:
                        expect(response.status).toEqual(200);

                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                            metadata: {},
                        });
                        break;
                    case 401:
                        expect(response.status).toEqual(200);
                        expect(response.body).toMatchObject({
                            message: getMessage('user.findOne.success'),
                            metadata: {},
                        });
                        break;

                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('user.notFound'),
                            metadata: {},
                        });
                        break;
                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
};

interface ISchema extends IUser {
    _id: string;
}

const schema = (payload: ISchema) => {
    return {
        _id: payload._id,
        email: payload.email,
        name: payload.name,
    };
};

export { createUser, findUser, listUsers, updateUser, deleteUser };
