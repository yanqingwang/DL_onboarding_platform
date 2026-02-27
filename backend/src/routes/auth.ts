import { Router, Response } from 'express';
import knex from 'knex';
// @ts-expect-error - knexfile is JS but works at runtime
import knexConfig from '../../knexfile';
import { generateToken, hashPassword, comparePassword, AuthRequest, authenticate } from '../middleware/auth';
import { UserRole, ROLES } from '../middleware/rbac';

const router = Router();

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

interface RegisterBody {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
}

interface LoginBody {
    email: string;
    password: string;
}

const VALID_ROLES: UserRole[] = ['super_admin', 'hr_admin', 'interviewer', 'candidate'];

router.post('/register', async (req, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body as RegisterBody;

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

        const userRole: UserRole = role && VALID_ROLES.includes(role) ? role : 'candidate';

        const passwordHash = await hashPassword(password);

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

        const token = generateToken({
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
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginBody;

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

        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken({
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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

router.get('/roles', (req, res: Response): void => {
    res.json({
        roles: Object.values(ROLES)
    });
});

export default router;
