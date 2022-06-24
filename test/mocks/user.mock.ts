import { IUser } from '../../src/models/user.model';

type MockUser = IUser & { _id: string, name?: any, email?: any, password?: any};

export const admin1: MockUser = {
    email: 'goog@gmail.com',
    password: 'thisisanamazinG2passwrod@',
    name: 'Jojo',
    _id: '',
    admin: true,
};

export const admin2: MockUser = {
    email: '321goog@gmail.com',
    password: 'thisisanamaz312inGpasswrod@',
    admin: true,
    _id: '',
    name: 'Jojos',
};

export const admin3: MockUser = {
    email: 'goofmail.com',
    password: 'thisisannGpasswrod@',
    admin: true,
    _id: '',
    name: '',
};

export const user1: MockUser = {
    email: 'goo@sail.com',
    password: 'thisisanamazinG2passwrod@',
    name: 'Matt',
    _id: '',
    admin: false,
};

export const user2: MockUser = {
    email: 'lool@gmail.com',
    password: 'thisisanamaz312inrealGpasswrod@',
    admin: false,
    _id: '',
    name: 'Matts',
};

export const user3: MockUser = {
    email: 'crapmai.lcom',
    password: 'thisisannfakepasswrod@',
    _id: '',
    admin: false,
    name: '',
};
