import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

const store = async (req: Request, res: Response) => {
    const { email, name, password }: IUser = req.body;

    const newUser: IUser = {
        email: email,
        password: password,
        name: name,
        admin: true,
    };

    User.create(newUser)
        .then(result => {
            console.log(result);
            return res.status(200).json({ message: 'User created' });
        })
        .catch(err => {
            return res.status(400).json({ message: 'bad request', error: err });
        });
};

export default { store };
