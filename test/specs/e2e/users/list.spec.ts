import mongoose from 'mongoose';

import { admin1, admin2, user1, user2 } from '../../../mocks/user.mock';
import { adminToken, userToken } from '../../../mocks/jwt.mock';
import { createUser, listUsers } from '../../../helpers/user.helper';

const describeif = (condition: boolean) =>
    condition ? describe : describe.skip;
const runAll = true;
describe('User listUser', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString())!;
    let mockToken2 = userToken(new mongoose.Types.ObjectId().toString())!;

    describeif(runAll)('should accept', () => {
        listUsers([], mockToken, 200);
        
        createUser(admin1, mockToken, 200);
        listUsers([admin1], mockToken, 200, true);
        listUsers([], mockToken, 200, false);
        listUsers([admin1], mockToken, 200);

        listUsers([], mockToken2, 200, true);
        listUsers([], mockToken2, 200, false);
        listUsers([], mockToken2, 200);


        createUser(admin2, mockToken, 200);
        listUsers([admin1, admin2], mockToken, 200, true);
        listUsers([], mockToken, 200, false);
        listUsers([admin1, admin2], mockToken, 200);

        listUsers([], mockToken2, 200, true);
        listUsers([], mockToken2, 200, false);
        listUsers([], mockToken2, 200);

        createUser(user1, mockToken, 200);
        listUsers([admin1, admin2], mockToken, 200, true);
        listUsers([user1], mockToken, 200, false);
        listUsers([admin1, admin2, user1], mockToken, 200);

        listUsers([user1], mockToken2, 200, true);
        listUsers([user1], mockToken2, 200, false);
        listUsers([user1], mockToken2, 200);

        createUser(user2, mockToken, 200);
        listUsers([admin1, admin2], mockToken, 200, true);
        listUsers([user1, user2], mockToken, 200, false);
        listUsers([admin1, admin2, user1, user2], mockToken, 200);

        listUsers([user1, user2], mockToken2, 200, true);
        listUsers([user1, user2], mockToken2, 200, false);
        listUsers([user1, user2], mockToken2, 200);
        
    });

    describeif(!runAll)('should reject', () => {
        //ensure you have created authors beforehand, otherwise it will break
        describeif(runAll)('mock data', () => {
            createUser(admin1, mockToken, 200);
            createUser(admin2, mockToken, 200);
        });
        describeif(!runAll)('invalid arguments', () => {
            describeif(!runAll)('invalid name', () => {
                //prettier-ignore
                describeif(runAll)('invalid type', () => {
                    
                    listUsers([admin2], mockToken, 400);                 
                    listUsers([admin2], mockToken, 400);
                    
                })
                //prettier-ignore
                describeif(!runAll)('invalid format', () => {                    
                    listUsers([admin1], mockToken, 400);
                    listUsers( [admin1], mockToken, 400);
                    listUsers( [admin1], mockToken, 400);
                    listUsers( [admin1], mockToken, 400);
                    listUsers( [admin1], mockToken, 400);            
                    listUsers( [admin2], mockToken, 400);
                    listUsers( [admin2], mockToken, 400);
                    listUsers([admin2], mockToken, 400);
                    listUsers( [admin2], mockToken, 400);
                    
                })
            });
        
        });
    });
});
