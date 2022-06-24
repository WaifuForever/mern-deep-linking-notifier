declare namespace Express {
    export interface Request {
        admin?: boolean;
        new_token?: string;
    }
}