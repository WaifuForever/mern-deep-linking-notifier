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

    describeif(runAll)('should accept', () => {
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
        });
    });
});
