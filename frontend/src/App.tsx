import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('login');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
      fetchCandidates();
    }
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (e) {
      console.error('Fetch candidates error:', e);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('dashboard');
        fetchCandidates();
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (e) {
      console.error('Login error:', e);
      alert('Login failed - cannot connect to server');
    }
    setLoading(false);
  };

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('dashboard');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (e) {
      console.error('Register error:', e);
      alert('Registration failed - cannot connect to server');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    setCandidates([]);
  };

  const addCandidate = async (candidate: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candidate),
      });
      if (res.ok) {
        fetchCandidates();
        alert('Candidate added successfully!');
        setView('candidates');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add candidate');
      }
    } catch (e) {
      console.error('Add candidate error:', e);
      alert('Failed to add candidate - cannot connect to server');
    }
    setLoading(false);
  };

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} loading={loading} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Blue-Collar Onboarding Platform</h1>
        <div className="user-info">
          <span>
            Welcome, {user?.firstName} ({user?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <nav className="app-nav">
        <button
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={view === 'candidates' ? 'active' : ''}
          onClick={() => setView('candidates')}
        >
          Candidates
        </button>
        <button
          className={view === 'add-candidate' ? 'active' : ''}
          onClick={() => setView('add-candidate')}
        >
          Add Candidate
        </button>
      </nav>
      <main className="app-main">
        {view === 'dashboard' && <Dashboard candidates={candidates} />}
        {view === 'candidates' && <CandidateList candidates={candidates} />}
        {view === 'add-candidate' && <AddCandidateForm onSubmit={addCandidate} loading={loading} />}
      </main>
    </div>
  );
}

function LoginPage({
  onLogin,
  onRegister,
  loading,
}: {
  onLogin: any;
  onRegister: any;
  loading: boolean;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('hr_admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onRegister(email, password, firstName, lastName, role);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Blue-Collar Onboarding Platform</h1>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="hr_admin">HR Admin</option>
                <option value="interviewer">Interviewer</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="switch-mode">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ candidates }: { candidates: any[] }) {
  const stats = {
    total: candidates.length,
    pending: candidates.filter((c: any) => c.status === 'pending').length,
    interviewed: candidates.filter((c: any) => c.status === 'interviewed').length,
    hired: candidates.filter((c: any) => c.status === 'hired').length,
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Candidates</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card interviewed">
          <h3>Interviewed</h3>
          <p className="stat-number">{stats.interviewed}</p>
        </div>
        <div className="stat-card hired">
          <h3>Hired</h3>
          <p className="stat-number">{stats.hired}</p>
        </div>
      </div>
    </div>
  );
}

function CandidateList({ candidates }: { candidates: any[] }) {
  return (
    <div className="candidate-list">
      <h2>Candidates</h2>
      {candidates.length === 0 ? (
        <p>No candidates yet. Add your first candidate!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job Position</th>
              <th>Status</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c: any) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>
                  {c.first_name} {c.last_name}
                </td>
                <td>{c.email}</td>
                <td>{c.phone || '-'}</td>
                <td>{c.job_position || '-'}</td>
                <td>
                  <span className={`status ${c.status}`}>{c.status}</span>
                </td>
                <td>{c.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AddCandidateForm({ onSubmit, loading }: { onSubmit: any; loading: boolean }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Malaysia',
    jobPosition: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="add-candidate-form">
      <h2>Add New Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
        />
        <select
          value={formData.country}
          onChange={e => setFormData({ ...formData, country: e.target.value })}
        >
          <option value="Malaysia">Malaysia</option>
          <option value="Philippines">Philippines</option>
          <option value="Thailand">Thailand</option>
        </select>
        <input
          type="text"
          placeholder="Job Position"
          value={formData.jobPosition}
          onChange={e => setFormData({ ...formData, jobPosition: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
}

export default App;
