import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import candidateRoutes from './routes/candidates';
import './i18n';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Blue-Collar Onboarding Platform API',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/auth/register',
      '/auth/login',
      '/auth/me',
      '/auth/roles',
      '/api/candidates',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
