import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as yup from 'yup';
import { SchemaOf } from 'yup';
import { AnyObject } from 'yup/lib/types';
import User, { IUser } from '../models/user.model';
import { getMessage } from '../utils/message.util';

const isValidMongoIdRequired = (value: string) => {
    return (
        mongoose.Types.ObjectId.isValid(value) &&
        String(new mongoose.Types.ObjectId(value)) === value
    );
};

type tRules = {
    email: yup.StringSchema<string | undefined, AnyObject, string | undefined>;
    name: yup.StringSchema<string | undefined, AnyObject, string | undefined>;
    admin: yup.BooleanSchema<
        boolean | undefined,
        AnyObject,
        boolean | undefined
    >;
    password: yup.StringSchema<
        string | undefined,
        AnyObject,
        string | undefined
    >;
    mongoId: yup.StringSchema<
        string | undefined,
        AnyObject,
        string | undefined
    >;
};

const rules: tRules = {
    email: yup.string().email(),
    name: yup
        .string()
        .min(3)
        .max(15)
        .strict()
        .trim()
        .matches(/^([^0-9]*)$/, 'no numbers allowed'),
    admin: yup.boolean(),
    password: yup
        .string()
        .min(8, getMessage('user.invalid.password.short'))
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            getMessage('user.invalid.password.weak'),
        ),
    mongoId: yup
        .string()
        .test('isValidMongoId', getMessage('invalid.object.id'), value =>
            isValidMongoIdRequired(value!),
        ),
};

const store = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        email: rules.email.required(),
        password: rules.password.required(),
        name: rules.name.required(),
        admin: rules.admin.required(),
    });
    req.params = req.query = {};
    schema
        .validate(req.body, { stripUnknown: true })
        .then(result => {
            req.body = result;
            next();
        })
        .catch((err: any) => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                data: err.errors,
            });
        });
};

const list = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        admin: rules.admin,
    });
    req.body = {};

    schema
        .validate(req.query, { stripUnknown: true })
        .then(result => {
            req.query = result;
            next();
        })
        .catch((err: any) => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                data: err.errors,
            });
        });
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        _id: rules.mongoId.required(),
    });
    req.params = req.body = {};

    schema
        .validate(req.query, { stripUnknown: true })
        .then(result => {
            req.query = result;
            next();
        })
        .catch((err: any) => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                data: err.errors,
            });
        });
};
type looseObject = {
    [key in keyof tRules]: any;
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        email: rules.email,
        name: rules.name,
        _id: rules.mongoId.required(),
    });

    var obj: looseObject = {
        email: undefined,
        name: undefined,
        admin: undefined,
        password: undefined,
        mongoId: undefined,
    };

    Object.keys(req.body).forEach(value => {
        obj[value as keyof tRules] = rules[value as keyof tRules];
    });

    req.params = req.query = {};
    schema
        .validate(req.body, { stripUnknown: true })
        .then(result => {
            req.body = result;
            next();
        })
        .catch((err: any) => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                data: err.errors,
            });
        });
};

export default { store, list, findById, update };
