"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const knex_1 = __importDefault(require("knex"));
// @ts-expect-error - knexfile is JS but works at runtime
const knexfile_1 = __importDefault(require("../../knexfile"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
const environment = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(knexfile_1.default[environment]);
const VALID_ROLES = ['super_admin', 'hr_admin', 'interviewer', 'candidate'];
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters' });
            return;
        }
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const userRole = role && VALID_ROLES.includes(role) ? role : 'candidate';
        const passwordHash = await (0, auth_1.hashPassword)(password);
        const [userId] = await db('users').insert({
            email,
            password_hash: passwordHash,
            role: userRole,
            first_name: firstName || null,
            last_name: lastName || null,
            phone: phone || null,
            is_active: true
        });
        const user = await db('users').where({ id: userId }).first();
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            },
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await db('users').where({ email }).first();
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        if (!user.is_active) {
            res.status(403).json({ error: 'Account is disabled' });
            return;
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role
        });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const user = await db('users').where({ id: req.user.id }).first();
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            isActive: user.is_active,
            createdAt: user.created_at
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});
router.get('/roles', (req, res) => {
    res.json({
        roles: Object.values(rbac_1.ROLES)
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map