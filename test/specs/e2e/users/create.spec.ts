import mongoose from 'mongoose';
import { createUser } from '../../../helpers/user.helper';
import { adminToken } from '../../../mocks/jwt.mock';
import {
    admin1,
    admin2,
    admin3,
    user1,
    user2,
    user3,
} from '../../../mocks/user.mock';

const describeif = (condition: boolean) =>
    condition ? describe : describe.skip;
const runAll = true;

describe('User', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString());

    describeif(!runAll)('should accept', () => {
        describeif(runAll)('create admin', () => {
            createUser(admin1, mockToken!, 200);
            createUser(admin2, mockToken!, 200);
        });
        describeif(runAll)('create user', () => {
            createUser(user1, mockToken!, 200);
            createUser(user2, mockToken!, 200);
        });
    });

    describeif(runAll)('should fail', () => {
        describeif(runAll)('invalid arguments', () => {
            createUser(admin3, mockToken!, 400);
            createUser(user3, mockToken!, 400);

            describeif(runAll)('invalid name', () => {
                const wrongName = (change: any) => {
                    let temp = { ...admin2 };
                    //can't send a null value
                    if (change) temp['name'] = change;
                    else delete temp.name;

                    return temp;
                };

                describeif(runAll)('invalid type', () => {
                    createUser(wrongName(2), mockToken!, 400);

                    createUser(wrongName(true), mockToken!, 400);

                    createUser(wrongName(false), mockToken!, 400);

                    createUser(wrongName(['']), mockToken!, 400);

                    createUser(
                        wrongName(JSON.stringify({ ...admin2 })),
                        mockToken!,
                        400,
                    );

                    createUser(wrongName(undefined), mockToken!, 400);
                });

                describeif(runAll)('invalid format', () => {
                    createUser(wrongName(''), mockToken!, 400);

                    createUser(wrongName('s'), mockToken!, 400);

                    createUser(wrongName('sd'), mockToken!, 400);

                    createUser(wrongName('\n\n\n'), mockToken!, 400);

                    createUser(wrongName('       '), mockToken!, 400);

                    createUser(
                        wrongName('more than 20 characters for sure'),
                        mockToken!,
                        400,
                    );
                });
            });
        });
    });
});
