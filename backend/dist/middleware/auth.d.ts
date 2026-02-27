import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const generateToken: (user: {
    id: number;
    email: string;
    role: string;
}) => string;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map