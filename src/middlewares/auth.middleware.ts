import { Request, Response, NextFunction } from 'express';

import User from '../models/user.model';
import jwt from '../utils/jwt.util';
import { getMessage } from '../utils/message.util';

export const auth = (roles: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: getMessage('default.unauthorized'),
            });
        }
        const [, token] = req.headers.authorization
            ? req.headers.authorization.split(' ')
            : [, ''];

        let payload: any = null;

        try {
            payload = jwt.verifyJwt(token, 1);
        } catch (err) {
            const answer: { message: string; err?: string } = {
                message: getMessage('default.unauthorized'),
            };
            if (err instanceof Error) answer.err = err.message;

            return res.status(401).json(answer);
        }

        if (payload.role !== 0 && payload.role !== 1)
            return res.status(401).json({
                message: getMessage('default.unauthorized'),
            });

        payload.role = Boolean(payload.role);

        if (!payload.role && roles.includes('admin'))
            return res.status(401).json({
                message: getMessage('default.unauthorized'),
            });

        if (process.env.NODE_ENV == 'test') {
            req.admin = payload.role;
            return next();
        }

        User.exists({
            _id: payload._id,
            admin: payload.role,
            tokenVersion: payload.tokenVersion,
        })
            .then(result => {
                if (!result) {
                    return res.status(401).json({
                        message: getMessage('default.unauthorized'),
                    });
                }

                let current_time = Date.now().valueOf() / 1000;
                if (
                    (payload.exp - payload.iat) / 2 >
                    payload.exp - current_time
                ) {
                    let newToken = jwt.generateJwt(
                        {
                            _id: payload._id,
                            role: Number(payload.role),
                            tokenVersion: payload.tokenVersion,
                        },
                        1,
                    );

                    req.new_token = `${newToken}`;
                    console.log(`New Token: ${newToken}`);
                }
                req.admin = payload.role;
                console.log('shall pass');
                payload = null;
                next();
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json({
                    message: getMessage('default.badRequest'),
                    err: err,
                });
            });
    };
};

export const easyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.headers.authorization) return next();

    const [, token] = req.headers.authorization
        ? req.headers.authorization.split(' ')
        : [, ''];

    let payload: any = null;
    try {
        payload = jwt.verifyJwt(token, 1);
    } catch (err) {
        return next();
    }

    if (payload.role !== 0 && payload.role !== 1) return next();

    payload.role = Boolean(payload.role);

    if (process.env.NODE_ENV == 'test') {
        req.admin = payload.role;
        return next();
    }

    User.exists({
        _id: payload._id,
        admin: payload.role,
        tokenVersion: payload.tokenVersion,
    })
        .then(() => {
            let current_time = Date.now().valueOf() / 1000;
            if ((payload.exp - payload.iat) / 2 > payload.exp - current_time) {
                let newToken = jwt.generateJwt(
                    {
                        _id: payload._id,
                        role: payload.role ? 1 : 0,
                        tokenVersion: payload.tokenVersion,
                    },
                    1,
                );

                req.new_token = `${newToken}`;
                console.log(`New Token: ${newToken}`);
            }
            req.admin = payload.role;
            console.log('shall pass');
            payload = null;
            return next();
        })
        .catch(err => {
            return next();
        });
};
