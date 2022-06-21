declare namespace Express {
    export interface Request {
        auth?: string;
        new_token?: string;
    }
}