import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export type UserRole = 'super_admin' | 'hr_admin' | 'interviewer' | 'candidate';

export const ROLES: Record<UserRole, string> = {
    super_admin: 'super_admin',
    hr_admin: 'hr_admin',
    interviewer: 'interviewer',
    candidate: 'candidate'
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    super_admin: 4,
    hr_admin: 3,
    interviewer: 2,
    candidate: 1
};

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const userRole = req.user.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                error: 'Insufficient permissions',
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
                currentRole: userRole
            });
            return;
        }

        next();
    };
};

export const authorizeAtLeast = (minimumRole: UserRole) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const userRole = req.user.role as UserRole;
        const userLevel = ROLE_HIERARCHY[userRole] || 0;
        const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

        if (userLevel < requiredLevel) {
            res.status(403).json({
                error: 'Insufficient permissions',
                message: `This action requires at least ${minimumRole} role`,
                currentRole: userRole
            });
            return;
        }

        next();
    };
};

export const isAdmin = () => authorize('super_admin', 'hr_admin');
export const isSuperAdmin = () => authorize('super_admin');
export const isHRAdmin = () => authorize('super_admin', 'hr_admin');
export const isInterviewer = () => authorize('super_admin', 'hr_admin', 'interviewer');
