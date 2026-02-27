import { Router, Response } from 'express';
import knex from 'knex';
// @ts-ignore - knexfile is JS but works at runtime
import knexConfig from '../../knexfile';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

interface CandidateBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  jobPosition?: string;
}

// Get all candidates
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const candidates = await db('candidates').select('*').orderBy('id', 'desc');
    res.json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Failed to get candidates' });
  }
});

// Get single candidate
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: 'Failed to get candidate' });
  }
});

// Create candidate
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, country, jobPosition } = req.body as CandidateBody;

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
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

// Update candidate
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Delete candidate
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

export default router;
