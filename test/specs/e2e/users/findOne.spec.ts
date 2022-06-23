import mongoose from 'mongoose';

import { user1, admin1, admin2 } from '../../../mocks/user.mock';
import { adminToken } from '../../../mocks/jwt.mock';
import { createUser, findUser } from '../../../helpers/user.helper';

const describeif = (condition: boolean) =>
    condition ? describe : describe.skip;
const runAll = true;
describe('Author', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString())!;

    describeif(!runAll)('should accept', () => {
        createUser(user1, mockToken, 200);
        createUser(admin1, mockToken, 200);

        findUser(admin1, mockToken, 200);
        findUser(user1, mockToken, 200);
    });

    describeif(runAll)('should reject', () => {
        describeif(runAll)('invalid arguments', () => {
            describeif(runAll)('invalid type', () => {
                findUser(
                    { _id: ['dfsdf', 'asdasda', 'xcxzlcz'] },
                    mockToken,
                    400,
                );
            });

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
                    findUser({ _id: value }, mockToken, 400);
                });
            });

            //prettier-ignore
            describeif(!runAll)('no registered _id', () => {
                findUser({ _id: new mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findUser({ _id: new mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findUser({ _id: new mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findUser({ _id: new mongoose.Types.ObjectId().toString() }, mockToken, 404);
             
                
            });
        });
    });
});
