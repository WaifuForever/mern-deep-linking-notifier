import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import { getMessage } from '../utils/message.util';
import { hashPassword } from '../utils/password.util';

const store = async (req: Request, res: Response) => {
    const { email, name, password, admin }: IUser = req.body;

    const newUser: IUser = {
        email: email,
        password: await hashPassword(password),
        name: name,
        admin: admin,
    };

    User.create(newUser)
        .then(result => {
            //console.log(result);
            return res.status(200).json({
                message: getMessage('user.valid.sign_up.success'),
                data: {
                    _id: result._id,
                },
                metadata: {},
            });
        })
        .catch(err => {
            return res.status(422).json({
                message: getMessage('default.unprocessable'),
            });
        });
};

const list = async (req: Request, res: Response) => {
    const search = req.admin
        ? req.query.admin === undefined
            ? {}
            : { admin: req.query.admin }
        : { admin: false };

    const selection = req.admin
        ? { _id: 1, email: 1, name: 1, admin: 1 }
        : { _id: 1, email: 1, name: 1 };

    User.find(search)
        .select(selection)
        .then(result => {
            return res.status(200).json({
                message: getMessage('user.list.success') + `: ${result.length}`,
                data: result,
                metadata: {},
            });
        })
        .catch(err => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                error: err,
            });
        });
};

const findById = async (req: Request, res: Response) => {
    const { _id } = req.query;

    User.findById(_id)
        .then(result => {
            if (!result)
                return res.status(404).json({
                    message: getMessage('user.notFound'),
                    metadata: {},
                });
            return res.status(200).json({
                message: getMessage('user.findOne.success'),
                data: result,
                metadata: {},
            });
        })
        .catch(err => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                error: err,
            });
        });
};

const update = async (req: Request, res: Response) => {
    User.updateOne({ _id: req.body._id }, req.body)
        .then(result => {
            if (result.matchedCount !== 0)
                return res.status(200).json({
                    message: getMessage('user.update.success'),
                    metadata: {},
                });
            return res
                .status(404)
                .json({ message: getMessage('user.notFound'), metadata: {} });
        })
        .catch(err => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                error: err,
            });
        });
};

const remove = async (req: Request, res: Response) => {
    const { _id } = req.query;
    const search = _id !== req.auth ? { _id: _id, admin: false } : { _id: _id };

    User.deleteOne(search)
        .then(result => {
            if (result.deletedCount !== 0)
                return res.status(200).json({ metadata: {} });
            return res.status(404).json({
                message: getMessage('user.notFound'),
                metadata: {},
            });
        })
        .catch(err => {
            return res.status(400).json({
                message: getMessage('default.badRequest'),
                data: err,
            });
        });
};

export default { store, list, findById, update, remove };
