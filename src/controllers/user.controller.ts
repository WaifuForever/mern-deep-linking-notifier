import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
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
            console.log(result);
            return res.status(200).json({ message: 'User created', metadata: {} });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

const list = async (req: Request, res: Response) => {
    User.find()
        .then(result => {
            return res
                .status(200)
                .json({ message: 'Users list retrieved', data: result });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

const findById = async (req: Request, res: Response) => {
    const { _id } = req.query;

    User.findById(_id)
        .then(result => {
            if (!result)
                return res.status(404).json({ message: 'User not found' });
            return res
                .status(200)
                .json({ message: 'User retrieved', data: result });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

const update = async (req: Request, res: Response) => {
    User.updateOne({ _id: req.body._id }, req.body)
        .then(result => {
            if (result.matchedCount !== 0)
                return res
                    .status(200)
                    .json({ message: 'User updated', data: result });
            return res.status(404).json({ message: 'User not found' });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

const remove = async (req: Request, res: Response) => {
    User.deleteOne({ _id: req.query._id })
        .then(result => {
            if (result.deletedCount !== 0) return res.status(200).json();
            return res.status(404).json({ message: 'User not found' });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

export default { store, list, findById, update, remove };
