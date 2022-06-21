import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
    _id: string;
    tokenVersion: number;
}

const tokenPrivateKey = `${process.env.JWT_KEY}`;
const refreshTokenPrivateKey = `${process.env.JWT_REFRESH_KEY}`;

const options = { expiresIn: `${process.env.JWT_ACCESS_EXPIRATION}` };
const refreshOptions = { expiresIn: `${process.env.JWT_REFRESH_EXPIRATION}` };

const generateJwt = (payload: Payload, num: Number) => {
    switch (num) {
        case 1:
            return jwt.sign(payload, tokenPrivateKey, options);
        case 2:
            return jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);

        default:
            return null;
    }
};

const verifyJwt = (token: string, num: Number) => {
    switch (num) {
        case 1:
            return jwt.verify(token, tokenPrivateKey);
        case 2:
            return jwt.verify(token, refreshTokenPrivateKey);

        default:
            return null;
    }
};

export default {
    verifyJwt,
    generateJwt,
};
