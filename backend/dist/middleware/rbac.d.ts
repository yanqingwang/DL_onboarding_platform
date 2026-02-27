import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export type UserRole = 'super_admin' | 'hr_admin' | 'interviewer' | 'candidate';
export declare const ROLES: Record<UserRole, string>;
export declare const ROLE_HIERARCHY: Record<UserRole, number>;
export declare const authorize: (...allowedRoles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorizeAtLeast: (minimumRole: UserRole) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isAdmin: () => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isSuperAdmin: () => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isHRAdmin: () => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isInterviewer: () => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.d.ts.map