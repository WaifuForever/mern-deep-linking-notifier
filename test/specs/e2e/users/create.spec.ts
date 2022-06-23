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

    describeif(!runAll)('should fail', () => {
        describeif(runAll)('invalid arguments', () => {
            createUser(admin3, mockToken!, 400);
            createUser(user3, mockToken!, 400);

            describeif(!runAll)('invalid name', () => {
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
                    const invalidList = [
                        '',
                        's',
                        'sd',
                        '\n\n\n',
                        '        ',
                        'more than 20 characters for sure',
                    ];

                    invalidList.forEach(value => {
                        createUser(wrongName(''), mockToken!, 400);
                    });
                });
            });

            describeif(!runAll)('invalid email', () => {
                const wrongEmail = (change: any) => {
                    let temp = { ...admin2 };
                    //can't send a null value
                    if (change) temp['email'] = change;
                    else delete temp.email;

                    return temp;
                };

                describeif(runAll)('invalid type', () => {
                    createUser(wrongEmail(2), mockToken!, 400);

                    createUser(wrongEmail(true), mockToken!, 400);

                    createUser(wrongEmail(false), mockToken!, 400);

                    createUser(wrongEmail(['']), mockToken!, 400);

                    createUser(
                        wrongEmail(JSON.stringify({ ...admin2 })),
                        mockToken!,
                        400,
                    );

                    createUser(wrongEmail(undefined), mockToken!, 400);
                });

                describeif(runAll)('invalid format', () => {
                    const invalidList = [
                        'plainaddress',
                        '#@%^%#$@#$@#.com',
                        '@example.com',
                        'Joe Smith <email@example.com>',
                        'email.example.com',
                        'email@example@example.com',
                        '.email@example.com',
                        'email.@example.com',
                        ' email..email@example.com',
                        'あいうえお@example.com',
                        'email@example.com (Joe Smith)',
                        'email@example',
                        'email@-example.com',
                        'email@example.web',
                        'email@111.222.333.44444',
                        'email@example..com',
                        'Abc..123@example.com',
                        '',
                        's',
                        'sd',
                        '\n\n\n',
                        '         ',
                        'crazy thing for sure 4ddb',
                    ];
                    invalidList.forEach(value => {
                        createUser(wrongEmail(value), mockToken!, 400);
                    });
                });
            });
            describeif(runAll)('invalid password', () => {
                const wrongPassword = (change: any) => {
                    let temp = { ...admin2 };
                    //can't send a null value
                    if (change) temp['password'] = change;
                    else delete temp.password;

                    return temp;
                };

                describeif(runAll)('invalid type', () => {
                    createUser(wrongPassword(2), mockToken!, 400);

                    createUser(wrongPassword(true), mockToken!, 400);

                    createUser(wrongPassword(false), mockToken!, 400);

                    createUser(wrongPassword(['']), mockToken!, 400);

                    createUser(
                        wrongPassword(JSON.stringify({ ...admin2 })),
                        mockToken!,
                        400,
                    );

                    createUser(wrongPassword(undefined), mockToken!, 400);
                });

                describeif(runAll)('invalid format', () => {
                    const invalidList = [
                        '0.0.0.000',
                        '0000',
                        '000007',
                        '007bond',
                        'thisisaWeakPassword',
                        'weakPassword123',
                        'weakpassword@123',
                        'weakpassword',
                        'weak@password',
                        'weak',
                        'weakPassword@asd',
                        '',
                        's',
                        'sd',
                        '\n\n\n',
                        '        ',
                        'more than 20 characters for sure',
                    ];

                    invalidList.forEach(value => {
                        createUser(wrongPassword(''), mockToken!, 400);
                    });
                });
            });
        });
    });
});
