import mongoose from 'mongoose';

import { user1, admin1, admin2 } from '../../../mocks/user.mock';
import { adminToken } from '../../../mocks/jwt.mock';
import { createUser, deleteUser } from '../../../helpers/user.helper';

const describeif = (condition: boolean) =>
    condition ? describe : describe.skip;
const runAll = true;
describe('User deleteUser', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString())!;

    describeif(!runAll)('should accept', () => {
        createUser(user1, mockToken, 200);
        createUser(admin1, mockToken, 200);

        deleteUser(admin1, mockToken, 200);
        deleteUser(user1, mockToken, 200);
    });

    describeif(runAll)('should reject', () => {
        describeif(runAll)('invalid arguments', () => {
            describeif(runAll)('invalid format', () => {
                const invalidList = [
                    '',
                    's',
                    'sd',
                    '\n\n\n',
                    '        ',
                    'more than 20 characters for sure',
                    'kKucLRLt9Npgxcep6iWH',
                    'QauOFWloK8pnnliczC4r',
                    'XhQcXH4sk2mWgGyRurQI',
                    'X2O1eZAGsezi8iYlkhmK',
                    '2HakCJ3w9GfHdTU2AKF4',
                    '8zWdnQrnN7629FBGVEeK',
                    'QWslENGzfhkylBgoAJWx',
                ];

                invalidList.forEach(value => {
                    deleteUser({ _id: value }, mockToken, 400, false);
                });
            });

            //prettier-ignore
            describeif(runAll)('no registered _id', () => {
                deleteUser({ _id: -1 }, mockToken, 404);
                deleteUser({ _id: -1 }, mockToken, 404);
                deleteUser({ _id: -1 }, mockToken, 404);
                deleteUser({ _id: -1 }, mockToken, 404);
             
                
            });
        });
    });
});
