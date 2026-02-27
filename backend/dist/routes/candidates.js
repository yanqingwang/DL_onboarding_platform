"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const knex_1 = __importDefault(require("knex"));
// @ts-ignore - knexfile is JS but works at runtime
const knexfile_1 = __importDefault(require("../../knexfile"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const environment = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(knexfile_1.default[environment]);
// Get all candidates
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const candidates = await db('candidates').select('*').orderBy('id', 'desc');
        res.json(candidates);
    }
    catch (error) {
        console.error('Get candidates error:', error);
        res.status(500).json({ error: 'Failed to get candidates' });
    }
});
// Get single candidate
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await db('candidates')
            .where({ id: Number(id) })
            .first();
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }
        res.json(candidate);
    }
    catch (error) {
        console.error('Get candidate error:', error);
        res.status(500).json({ error: 'Failed to get candidate' });
    }
});
// Create candidate
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, country, jobPosition } = req.body;
        if (!firstName || !lastName || !email) {
            res.status(400).json({ error: 'First name, last name, and email are required' });
            return;
        }
        // Create user account for candidate
        const [userId] = await db('users').insert({
            email,
            password_hash: '$2a$10$dummy', // Will be set by candidate
            role: 'candidate',
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            is_active: true,
        });
        // Create candidate record
        const [candidateId] = await db('candidates').insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || null,
            country: country || 'Malaysia',
            job_position: jobPosition || null,
            status: 'pending',
        });
        const candidate = await db('candidates').where({ id: candidateId }).first();
        res.status(201).json(candidate);
    }
    catch (error) {
        console.error('Create candidate error:', error);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});
// Update candidate
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const candidate = await db('candidates')
            .where({ id: Number(id) })
            .first();
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }
        await db('candidates')
            .where({ id: Number(id) })
            .update({
            ...updates,
            updated_at: new Date(),
        });
        const updated = await db('candidates')
            .where({ id: Number(id) })
            .first();
        res.json(updated);
    }
    catch (error) {
        console.error('Update candidate error:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    }
});
// Delete candidate
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await db('candidates')
            .where({ id: Number(id) })
            .first();
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }
        await db('candidates')
            .where({ id: Number(id) })
            .del();
        res.json({ message: 'Candidate deleted successfully' });
    }
    catch (error) {
        console.error('Delete candidate error:', error);
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
});
exports.default = router;
//# sourceMappingURL=candidates.js.map