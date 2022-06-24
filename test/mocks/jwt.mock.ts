import jwt from '../../src/utils/jwt.util';

export const adminToken = (_id: string) => {
    return jwt.generateJwt(
        {
            _id: _id,
            role: 1,
            tokenVersion: 0,
        },
        1,
    );
};

export const userToken = (_id: string) => {
    return jwt.generateJwt(
        {
            _id: _id,
            role: 0,
            tokenVersion: 0,
        },
        1,
    );
};
