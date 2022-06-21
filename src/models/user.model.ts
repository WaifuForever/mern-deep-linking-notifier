import mongoose, { Schema } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    name: string;
    admin?: boolean;
    tokenVersion?: number;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        admin: {
            type: Boolean,
            default: false,
            select: false,
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
