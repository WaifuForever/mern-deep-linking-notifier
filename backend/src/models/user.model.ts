import mongoose, { Schema } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

export default mongoose.model<IUser>('User', UserSchema);
