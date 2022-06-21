import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as yup from 'yup';
import User, { IUser } from '../models/user.model';

const isValidMongoIdRequired = (value: string) => {
    return (
        mongoose.Types.ObjectId.isValid(value) &&
        String(new mongoose.Types.ObjectId(value)) === value
    );
};
const rules = {
    email: yup.string().email(),
    name: yup.string().min(3).max(15),
    password: yup
        .string()
        .min(8)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Weak password! It must contains at least one uppercase/lowercase/special character',
        ),
    mongoId: yup
        .string()
        .test('isValidMongoId', 'invalid object id', value =>
            isValidMongoIdRequired(value!),
        ),
};

const store = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        email: rules.email.required(),
        password: rules.password.required(),
        name: rules.name.required(),
    });
    req.params = req.query = {};
    schema
        .validate(req.body, { stripUnknown: true })
        .then(() => next())
        .catch((err: any) => {
            return res.status(400).json({
                message: 'bad request',
                data: err.errors,
            });
        });
};

const list = async (req: Request, res: Response, next: NextFunction) => {
    req.body = req.params = req.query = {};
    next();
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
       _id: rules.mongoId.required()
    });
    req.params = req.body = {};

    schema
        .validate(req.query, { stripUnknown: true })
        .then(() => next())
        .catch((err: any) => {
            return res.status(400).json({
                message: 'bad request',
                data: err.errors,
            });
        });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        email: rules.email.required(),
        name: rules.name.required(),
        _id: rules.mongoId.required()
    });
    req.params = req.query = {};
    schema
        .validate(req.body, { stripUnknown: true })
        .then(() => next())
        .catch((err: any) => {
            return res.status(400).json({
                message: 'bad request',
                data: err.errors,
            });
        });
};


export default { store, list, findById, update };
