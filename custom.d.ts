declare namespace Express {
    export interface Request {
        admin?: boolean;
        auth?: string;
        new_token?: string;
    }
}