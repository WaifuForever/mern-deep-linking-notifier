import mongoose from 'mongoose';
import { createUser } from '../../../helpers/user.helper';
import { adminToken } from '../../../mocks/jwt.mock';
import { user1 } from '../../../mocks/user.mock';


const describeif = (condition: boolean) => (condition ? describe : describe.skip);;
const runAll = true;

describe('User', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString());

    describeif(runAll)('should accept', () => {
        createUser(user1, 200);
    })
})