import mongoose from 'mongoose';
import { createUser, updateUser } from '../../../helpers/user.helper';
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

describe('User createUser', () => {
    let mockToken = adminToken(new mongoose.Types.ObjectId().toString())!;

    describeif(!runAll)('should accept', () => {
        createUser(admin2, mockToken, 200);
        createUser(user2, mockToken, 200);

        updateUser({ _id: 2, name: "Miyata" }, mockToken, "change name", 200);
        updateUser({ _id: 4, name: "Yuahn" }, mockToken, "change name", 200);
       
    });

    describeif(runAll)('should fail', () => {
        describeif(runAll)('mock data', () => {
            createUser(admin2, mockToken, 200);
            createUser(user2, mockToken, 200);
        })
        describeif(runAll)('invalid arguments', () => { 
            describeif(runAll)('invalid id', () => {
                updateUser({ _id: 1, name: "John" }, mockToken, "change name", 400, false);
                updateUser({ _id: 3, name: "John" }, mockToken, "change name", 400, false);
                updateUser({ _id: -1, name: "John" }, mockToken, "change name", 400, false);
                updateUser({ _id: 0, name: "John" }, mockToken, "change name", 404, false);
            })

            
            describeif(runAll)('invalid name', () => {
                describeif(!runAll)('invalid type', () => {
                    updateUser({ _id: 2, name: 2 }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: 2 }, mockToken, "change name", 400);

                    updateUser({ _id: 2, name: true }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: true }, mockToken, "change name", 400);

                    updateUser({ _id: 2, name: 2 }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: 2 }, mockToken, "change name", 400);
                    
                    updateUser({ _id: 2, name: [''] }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: [''] }, mockToken, "change name", 400);

                    updateUser({ _id: 2, name: [] }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: [] }, mockToken, "change name", 400);

                    updateUser({ _id: 2, name: JSON.stringify({ ...admin2 }) }, mockToken, "change name", 400);
                    updateUser({ _id: 4, name: JSON.stringify({ ...admin2 }) }, mockToken, "change name", 400);
                    
                
                    updateUser({ _id: 4, name: [] }, mockToken, "change name", 400);
               

                    
                });

                describeif(runAll)('invalid format', () => {
                    const invalidList = [
                        '',
                        's',
                        'jojos2',
                        "dasdasd@",
                        'sd',
                        '\n\n\n',
                        '        ',
                        'more than 20 characters for sure',
                    ];

                    invalidList.forEach(value => {
                        updateUser({ _id: 4, name: value}, mockToken, "change name", 400);
                    });
                });
            });

        });
    });
});
