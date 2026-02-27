"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInterviewer = exports.isHRAdmin = exports.isSuperAdmin = exports.isAdmin = exports.authorizeAtLeast = exports.authorize = exports.ROLE_HIERARCHY = exports.ROLES = void 0;
exports.ROLES = {
    super_admin: 'super_admin',
    hr_admin: 'hr_admin',
    interviewer: 'interviewer',
    candidate: 'candidate'
};
exports.ROLE_HIERARCHY = {
    super_admin: 4,
    hr_admin: 3,
    interviewer: 2,
    candidate: 1
};
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const userRole = req.user.role;
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
exports.authorize = authorize;
const authorizeAtLeast = (minimumRole) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const userRole = req.user.role;
        const userLevel = exports.ROLE_HIERARCHY[userRole] || 0;
        const requiredLevel = exports.ROLE_HIERARCHY[minimumRole] || 0;
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
exports.authorizeAtLeast = authorizeAtLeast;
const isAdmin = () => (0, exports.authorize)('super_admin', 'hr_admin');
exports.isAdmin = isAdmin;
const isSuperAdmin = () => (0, exports.authorize)('super_admin');
exports.isSuperAdmin = isSuperAdmin;
const isHRAdmin = () => (0, exports.authorize)('super_admin', 'hr_admin');
exports.isHRAdmin = isHRAdmin;
const isInterviewer = () => (0, exports.authorize)('super_admin', 'hr_admin', 'interviewer');
exports.isInterviewer = isInterviewer;
//# sourceMappingURL=rbac.js.map