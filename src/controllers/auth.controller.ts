import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import jwt from '../utils/jwt.util';
import { getMessage } from '../utils/message.util';
import { matchPassword } from '../utils/password.util';

const signIn = async (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: getMessage('default.unauthorized'),
        });
    }
    const [hashType, hash] = req.headers.authorization!.split(' ');

    if (hashType !== 'Basic') {
        return res.status(401).json({
            message: getMessage('default.unauthorized'),
        });
    }

    const [email, supposedPassword] = Buffer.from(hash, 'base64')
        .toString()
        .split(':');

    const user = await User.findOne({ email: email }).select([
        'password',
        'tokenVersion',
        'admin',
    ]);

    const match = user
        ? await matchPassword(user.password, supposedPassword)
        : null;

    if (!match) {
        return res.status(401).json({
            message: getMessage('default.unauthorized'),
        });
    }
    const payload = {
        _id: user!._id.toString(),
        role: user!.admin ? 1 : 0,
        tokenVersion: user!.tokenVersion!,
    };

    const token = jwt.generateJwt(payload, 1);
    const refreshToken = jwt.generateJwt(payload, 2);

    req.headers.authorization = `Bearer ${token}`;

    return res.status(200).json({
        data: { accessToken: token },
        message: getMessage('user.valid.sign_in.success'),
    });
};

export default { signIn };
