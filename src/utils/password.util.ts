import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, salt?: number) => {
    return await bcrypt.hash(
        password,
        salt ? salt : process.env.HASH_SALT ? Number(process.env.HASH_SALT) : 10,
    );
};

export const matchPassword = async (
    password: string,
    supposedPassword: string,
) => {
    return await bcrypt.compare(supposedPassword, password);
};
