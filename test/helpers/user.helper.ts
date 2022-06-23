import supertest from 'supertest';

import { app } from '../../src/config/express.config';
import { getMessage } from '../../src/utils/message.util';

const itif = (condition: boolean) => (condition ? it : it.skip);

const createUser = (payload: any, token:string, statusCode: number) => {
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
    
                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('user.valid.sign_up.success'),
                        });

                        break;

                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: expect.any(String),
                            status: 400,
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
};

export { createUser };
