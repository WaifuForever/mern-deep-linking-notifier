import jwt from '../../src/utils/jwt.util';

export const adminToken = (_id: string) => {
    return jwt.generateJwt(
        {
            _id: _id,
            tokenVersion: 0,
        },
        1,
    );
};
