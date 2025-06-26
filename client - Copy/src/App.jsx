import './App.css'
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <span className="logo-icon">🧘‍♀️</span>
            <span className="logo-text">Yoga Guide</span>
          </div>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><a href="#home" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#poses" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Poses</a></li>
            <li><a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
          </ul>
          
          {isLoggedIn && (
            <div className="navbar-user">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-text">Welcome!</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function PoseDetails() {
  return (
    <div className="pose-details-container">
      <h2>Mountain Pose (Tadasana)</h2>
      <img src="https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&w=400&h=300&fit=crop" alt="Mountain Pose" className="pose-details-img" />
      <p><strong>Description:</strong> A foundational yoga pose that promotes balance and calm.</p>
      <p><strong>Difficulty:</strong> Beginner</p>
      <p><strong>Benefits:</strong> Improves posture, balance, and calmness.</p>
      <div>
        <strong>Step-by-step Instructions:</strong>
        <ol>
          <li>Stand tall with feet together, arms at your sides.</li>
          <li>Distribute your weight evenly through your feet.</li>
          <li>Engage your thighs, lift your chest, and reach your arms overhead.</li>
          <li>Breathe deeply and hold for several breaths.</li>
        </ol>
      </div>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function PoseDetailsDownwardDog() {
  return (
    <div className="pose-details-container">
      <h2>Downward Dog (Adho Mukha Svanasana)</h2>
      <img src="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&w=400&h=300&fit=crop" alt="Downward Dog" className="pose-details-img" />
      <p><strong>Description:</strong> A classic yoga pose that strengthens the whole body and stretches the back.</p>
      <p><strong>Difficulty:</strong> Beginner</p>
      <p><strong>Benefits:</strong> Stretches the hamstrings, calves, and spine; strengthens arms and legs.</p>
      <div>
        <strong>Step-by-step Instructions:</strong>
        <ol>
          <li>Start on your hands and knees, wrists under shoulders, knees under hips.</li>
          <li>Spread your fingers wide and press into the mat.</li>
          <li>Tuck your toes and lift your hips up and back, straightening your legs.</li>
          <li>Keep your head between your arms and your heels reaching toward the floor.</li>
          <li>Breathe deeply and hold for several breaths.</li>
        </ol>
      </div>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

// PoseCard component for displaying a single pose
function PoseCard({ pose, showImage }) {
  return (
    <div className="pose-card">
      {showImage && pose.image && <img src={pose.image} alt={pose.name} />}
      <h3>{pose.name}</h3>
      {pose.category && pose.category.length > 2 && (
      <p><b>Category:</b> {pose.category}</p>
      )}
      {pose.difficulty && pose.difficulty.length > 2 && (
      <p><b>Difficulty:</b> {pose.difficulty}</p>
      )}
      {pose.description && pose.description.trim().length > 2 && (
        <p>{pose.description.slice(0, 60)}{pose.description.length > 60 ? '...' : ''}</p>
      )}
    </div>
  );
}

function CategoryPoses() {
  const { category } = useParams();
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/poses')
      .then(res => res.json())
      .then(data => {
        setPoses(Array.isArray(data) ? data.filter(p => p.category?.toLowerCase() === category.toLowerCase()) : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch poses');
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="category-poses-container">
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Poses</h2>
      {loading ? <p>Loading poses...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
        <div className="pose-cards">
          {poses.length === 0 ? <p>No poses found for this category.</p> : poses.map(pose => <PoseCard key={pose._id} pose={pose} showImage={true} />)}
        </div>
      )}
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🧘‍♀️</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue your yoga journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="button-icon">🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              <span className="message-icon">
                {message.includes('successful') ? '✅' : '❌'}
              </span>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Don't have an account? 
              <Link to="/register" className="auth-link"> Create one here</Link>
            </p>
            <Link to="/" className="back-link">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🌟</div>
            <h2>Join Our Community</h2>
            <p>Create your account to start your yoga journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              <span className="message-icon">
                {message.includes('successful') ? '✅' : '❌'}
              </span>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Already have an account? 
              <Link to="/login" className="auth-link"> Sign in here</Link>
            </p>
            <Link to="/" className="back-link">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="landing-container">
      <h1>Yoga Pose Guide</h1>
      <div className="landing-buttons">
        <Link to="/user-auth"><button className="landing-btn">User Login</button></Link>
        <Link to="/admin-auth"><button className="landing-btn">Admin Login</button></Link>
      </div>
    </div>
  );
}

function UserAuthChoice() {
  return (
    <div className="auth-choice-page">
      <div className="auth-choice-background">
        <div className="auth-choice-pattern"></div>
      </div>
      
      <div className="auth-choice-content">
        <div className="auth-choice-card">
          <div className="auth-choice-header">
            <div className="auth-choice-icon">🧘‍♀️</div>
            <h1>Welcome to Yoga Guide</h1>
            <p>Choose how you'd like to access your yoga journey</p>
          </div>
          
          <div className="auth-choice-section">
            <h2>User Access</h2>
            <p className="section-description">
              Join our community of yoga enthusiasts and explore poses, track your progress, and save your favorites.
            </p>
            
            <div className="auth-choice-buttons">
              <Link to="/login" className="choice-button login-btn">
                <div className="button-content">
                  <span className="button-icon">🔑</span>
                  <div className="button-text">
                    <span className="button-title">Sign In</span>
                    <span className="button-subtitle">Access your account</span>
                  </div>
                  <span className="button-arrow">→</span>
                </div>
              </Link>
              
              <Link to="/register" className="choice-button register-btn">
                <div className="button-content">
                  <span className="button-icon">✨</span>
                  <div className="button-text">
                    <span className="button-title">Create Account</span>
                    <span className="button-subtitle">Join our community</span>
                  </div>
                  <span className="button-arrow">→</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="auth-choice-features">
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <span className="feature-text">Access to all yoga poses</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💾</span>
              <span className="feature-text">Save your favorite poses</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Track your progress</span>
            </div>
          </div>
          
          <Link to="/" className="back-to-home">
            <span className="back-icon">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminAuthChoice() {
  return (
    <div className="auth-choice-page admin-choice">
      <div className="auth-choice-background">
        <div className="auth-choice-pattern"></div>
      </div>
      
      <div className="auth-choice-content">
        <div className="auth-choice-card">
          <div className="auth-choice-header">
            <div className="auth-choice-icon">👨‍💼</div>
            <h1>Admin Dashboard</h1>
            <p>Manage and control your yoga platform</p>
          </div>
          
          <div className="auth-choice-section">
            <h2>Admin Access</h2>
            <p className="section-description">
              Access administrative tools to manage content, users, and platform settings with full control.
            </p>
            
            <div className="auth-choice-buttons">
              <Link to="/admin-login" className="choice-button admin-login-btn">
                <div className="button-content">
                  <span className="button-icon">🔐</span>
                  <div className="button-text">
                    <span className="button-title">Admin Login</span>
                    <span className="button-subtitle">Access dashboard</span>
                  </div>
                  <span className="button-arrow">→</span>
                </div>
              </Link>
              
              <Link to="/admin-register" className="choice-button admin-register-btn">
                <div className="button-content">
                  <span className="button-icon">⚡</span>
                  <div className="button-text">
                    <span className="button-title">Create Admin</span>
                    <span className="button-subtitle">Setup new admin</span>
                  </div>
                  <span className="button-arrow">→</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="auth-choice-features">
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span className="feature-text">Manage yoga poses</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span className="feature-text">User management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span className="feature-text">Platform settings</span>
            </div>
          </div>
          
          <Link to="/" className="back-to-home">
            <span className="back-icon">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Admin registration successful!');
        setTimeout(() => navigate('/admin-login'), 1000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="auth-header">
            <div className="auth-icon">⚡</div>
            <h2>Create Admin Account</h2>
            <p>Setup administrative access for the yoga platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👨‍💼</span>
                <input 
                  type="text" 
                  placeholder="Admin Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button admin-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="button-icon">⚡</span>
                  <span>Create Admin</span>
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              <span className="message-icon">
                {message.includes('successful') ? '✅' : '❌'}
              </span>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Already have an admin account? 
              <Link to="/admin-login" className="auth-link"> Sign in here</Link>
            </p>
            <Link to="/" className="back-link">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Admin login successful!');
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h2>Admin Dashboard Access</h2>
            <p>Sign in to manage your yoga platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👨‍💼</span>
                <input 
                  type="text" 
                  placeholder="Admin Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="auth-input"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button admin-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="button-icon">🚀</span>
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              <span className="message-icon">
                {message.includes('successful') ? '✅' : '❌'}
              </span>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Don't have an admin account? 
              <Link to="/admin-register" className="auth-link"> Create one here</Link>
            </p>
            <Link to="/" className="back-link">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  if (!isLoggedIn) {
    return <Landing />;
  }
  return children;
}

function AdminDashboard() {
  // Dummy stats for demonstration
  const stats = [
    { icon: '👥', label: 'Total Users', value: 128 },
    { icon: '🧘‍♂️', label: 'Total Poses', value: 54 },
    { icon: '📝', label: 'Pending Reviews', value: 3 },
    { icon: '⚙️', label: 'Settings', value: 'Configured' },
  ];

  const [section, setSection] = useState('dashboard');

  // Poses state for CRUD
  const [poses, setPoses] = useState([]);
  const [loadingPoses, setLoadingPoses] = useState(false);
  const [poseError, setPoseError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPose, setEditPose] = useState(null);

  // Users state for CRUD
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (section === 'poses') fetchPoses();
    if (section === 'users') fetchUsers();
    // eslint-disable-next-line
  }, [section]);

  const fetchPoses = async () => {
    setLoadingPoses(true);
    setPoseError('');
    try {
      const res = await fetch('http://localhost:5000/api/poses');
      const data = await res.json();
      setPoses(Array.isArray(data) ? data : []);
    } catch (err) {
      setPoseError('Failed to fetch poses');
    } finally {
      setLoadingPoses(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError('');
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to fetch users:', res.status, text);
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUserError('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Add Pose
  const handleAddPose = async (pose) => {
    setPoseError('');
    try {
      const res = await fetch('http://localhost:5000/api/poses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(pose),
      });
      if (!res.ok) throw new Error('Add failed');
      setShowAddModal(false);
      fetchPoses();
    } catch (err) {
      setPoseError('Failed to add pose');
    }
  };

  // Edit Pose
  const handleEditPose = async (pose) => {
    setPoseError('');
    try {
      const res = await fetch(`http://localhost:5000/api/poses/${pose._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(pose),
      });
      if (!res.ok) throw new Error('Edit failed');
      setShowEditModal(false);
      setEditPose(null);
      fetchPoses();
    } catch (err) {
      setPoseError('Failed to update pose');
    }
  };

  // Delete Pose
  const handleDeletePose = async (id) => {
    setPoseError('');
    if (!window.confirm('Delete this pose?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/poses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchPoses();
    } catch (err) {
      setPoseError('Failed to delete pose');
    }
  };

  // Add User
  const handleAddUser = async (user) => {
    setUserError('');
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Add failed');
      setShowAddUserModal(false);
      fetchUsers();
    } catch (err) {
      setUserError('Failed to add user');
    }
  };

  // Edit User
  const handleEditUser = async (user) => {
    setUserError('');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Edit failed');
      setShowEditUserModal(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setUserError('Failed to update user');
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    setUserError('');
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
    } catch (err) {
      setUserError('Failed to delete user');
    }
  };

  // Add/Edit Modal Form
  function PoseModal({ open, onClose, onSubmit, initial }) {
    const [form, setForm] = useState(
      initial || { name: '', category: '', image: '', description: '', difficulty: 'Beginner' }
    );
    useEffect(() => {
      setForm(initial || { name: '', category: '', image: '', description: '', difficulty: 'Beginner' });
    }, [initial, open]);
    if (!open) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>{initial ? 'Edit Pose' : 'Add Pose'}</h3>
          <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, _id: initial?._id }); }}>
            <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select Category</option>
              <option value="Beginner">🌱 Beginner</option>
              <option value="Intermediate">🌿 Intermediate</option>
              <option value="Advanced">🌳 Advanced</option>
              <option value="Flexibility">🧘‍♀️ Flexibility</option>
              <option value="Strength">💪 Strength</option>
              <option value="Relaxation">😌 Relaxation</option>
            </select>
            <input placeholder="Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <div className="modal-actions">
              <button type="submit">{initial ? 'Update' : 'Add'}</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Add/Edit User Modal Form
  function UserModal({ open, onClose, onSubmit, initial }) {
    const [form, setForm] = useState(
      initial ? { username: initial.username, password: '', role: initial.role || 'user', _id: initial._id } : { username: '', password: '', role: 'user' }
    );
    useEffect(() => {
      setForm(initial ? { username: initial.username, password: '', role: initial.role || 'user', _id: initial._id } : { username: '', password: '', role: 'user' });
    }, [initial, open]);
    if (!open) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>{initial ? 'Edit User' : 'Add User'}</h3>
          <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
            <input required placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            <input type="password" placeholder={initial ? "New Password (leave blank to keep)" : "Password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions">
              <button type="submit">{initial ? 'Update' : 'Add'}</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Section content renderers
  function renderSection() {
    if (section === 'dashboard') {
      return (
        <>
          <section className="admin-stats">
            {stats.map((stat, idx) => (
              <div className="admin-stat-card" key={idx}>
                <span className="stat-icon">{stat.icon}</span>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </section>
          <section className="admin-welcome">
            <h2>Yoga Guide Admin Panel</h2>
            <p>
              Use the sidebar to manage yoga poses, users, and platform settings. <br />
              This dashboard gives you a quick overview of your platform's status.
            </p>
          </section>
        </>
      );
    }
    if (section === 'poses') {
      return (
        <section className="admin-section">
          <div className="admin-poses-header">
            <h2>Manage Yoga Poses</h2>
            <button className="add-pose-btn" onClick={() => setShowAddModal(true)}>+ Add Pose</button>
          </div>
          {poseError && <div className="pose-error">{poseError}</div>}
          {loadingPoses ? (
            <div>Loading poses...</div>
          ) : (
            <div className="poses-table-wrapper">
              <table className="poses-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {poses.map(pose => (
                    <tr key={pose._id}>
                      <td>{pose.name}</td>
                      <td>{pose.category}</td>
                      <td>{pose.difficulty}</td>
                      <td>{pose.image ? <img src={pose.image} alt="pose" className="pose-img-thumb" /> : '-'}</td>
                      <td className="pose-desc-cell">{pose.description?.slice(0, 60)}{pose.description?.length > 60 ? '...' : ''}</td>
                      <td>
                        <button className="edit-btn" onClick={() => { setEditPose(pose); setShowEditModal(true); }}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeletePose(pose._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PoseModal open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddPose} />
          <PoseModal open={showEditModal} onClose={() => { setShowEditModal(false); setEditPose(null); }} onSubmit={handleEditPose} initial={editPose} />
        </section>
      );
    }
    if (section === 'users') {
      return (
        <section className="admin-section">
          <div className="admin-poses-header">
            <h2>Manage Users</h2>
            <button className="add-pose-btn" onClick={() => setShowAddUserModal(true)}>+ Add User</button>
          </div>
          {userError && <div className="pose-error">{userError}</div>}
          {loadingUsers ? (
            <div>Loading users...</div>
          ) : (
            <div className="poses-table-wrapper">
              <table className="poses-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="edit-btn" onClick={() => { setEditUser(user); setShowEditUserModal(true); }}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <UserModal open={showAddUserModal} onClose={() => setShowAddUserModal(false)} onSubmit={handleAddUser} />
          <UserModal open={showEditUserModal} onClose={() => { setShowEditUserModal(false); setEditUser(null); }} onSubmit={handleEditUser} initial={editUser} />
        </section>
      );
    }
    if (section === 'settings') {
      return (
        <section className="admin-section">
          <h2>Platform Settings</h2>
          <p>Configure platform-wide settings and preferences. (Feature coming soon!)</p>
          <div className="admin-placeholder">⚙️</div>
        </section>
      );
    }
    return null;
  }

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">⚡</span>
          <span className="sidebar-title">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link${section === 'dashboard' ? ' active' : ''}`} onClick={() => setSection('dashboard')}>Dashboard</button>
          <button className={`sidebar-link${section === 'poses' ? ' active' : ''}`} onClick={() => setSection('poses')}>Manage Poses</button>
          <button className={`sidebar-link${section === 'users' ? ' active' : ''}`} onClick={() => setSection('users')}>Manage Users</button>
          <button className={`sidebar-link${section === 'settings' ? ' active' : ''}`} onClick={() => setSection('settings')}>Settings</button>
          <button className="sidebar-link logout-link" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/admin-login';
          }}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <span className="admin-avatar">👨‍💼</span>
            <div>
              <h1>Welcome, Admin!</h1>
              <p className="admin-subtitle">{section === 'dashboard' ? 'Here is your dashboard overview' : `Section: ${section.charAt(0).toUpperCase() + section.slice(1)}`}</p>
            </div>
          </div>
        </header>
        {renderSection()}
      </main>
    </div>
  );
}

// Homepage with pose previews by category
function HomepageWithPosePreviews() {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/poses')
      .then(res => res.json())
      .then(data => {
        setPoses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch poses');
        setLoading(false);
      });
  }, []);

  // Group poses by category
  const categories = [
    { key: 'Beginner', icon: '🌱', desc: 'Perfect for those new to yoga. Simple poses to build foundation and confidence.' },
    { key: 'Intermediate', icon: '🌿', desc: 'For those with some experience. Challenge yourself with more complex poses.' },
    { key: 'Advanced', icon: '🌳', desc: 'For experienced practitioners. Master challenging poses and sequences.' },
    { key: 'Flexibility', icon: '🧘‍♀️', desc: 'Improve your range of motion with poses designed to enhance flexibility.' },
    { key: 'Strength', icon: '💪', desc: 'Build muscle and endurance with poses that focus on strength building.' },
    { key: 'Relaxation', icon: '😌', desc: 'Find peace and calm with restorative poses for stress relief.' },
  ];

  // Only show category cards on the main explore page
  const showCategoryCards =
    location.pathname === '/poses' ||
    location.pathname === '/explore' ||
    location.pathname === '/poses/' ||
    location.pathname === '/';

  return (
    <div className="homepage-container">
      <Navbar />
      <section id="home" className="home-section">
        <div className="hero-content">
          <h1>Yoga Pose Guide</h1>
          <p className="hero-subtitle">Your journey to wellness starts here</p>
          <p className="hero-description">
            Welcome to your personal yoga guide! Explore various yoga poses, learn their benefits, 
            and start your journey to a healthier lifestyle. Whether you're a beginner or advanced practitioner, 
            discover poses that suit your level and goals.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🧘‍♀️</span>
              <h3>Beginner Friendly</h3>
              <p>Step-by-step instructions for all skill levels</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📚</span>
              <h3>Comprehensive Library</h3>
              <p>Hundreds of poses with detailed explanations</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <h3>Personalized Experience</h3>
              <p>Save your favorite poses and track progress</p>
            </div>
          </div>
        </div>
      </section>
      <section id="poses" className="pose-section">
        <h2>Explore Poses</h2>
        <p className="section-subtitle">Browse yoga poses by category and find what works best for you</p>
        {loading ? <p>Loading poses...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
          <div className="pose-categories">
            {showCategoryCards && categories.map(cat => {
              const catPoses = poses.filter(p => p.category?.toLowerCase() === cat.key.toLowerCase());
              return (
                <div className="category-card" key={cat.key}>
                  <div className="category-icon">{cat.icon}</div>
                  <h3>{cat.key}</h3>
                  <p>{cat.desc}</p>
                  <Link to={`/poses/${cat.key.toLowerCase()}`}><button className="pose-category">Explore {cat.key}</button></Link>
                  {catPoses.length > 0 && (
                    <div className="pose-cards">
                      {catPoses.slice(0, 3).map(pose => <PoseCard key={pose._id} pose={pose} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <section id="about" className="about-section">
        <h2>About Yoga Pose Guide</h2>
        <div className="about-content">
          <p>
            Yoga Pose Guide is a full-stack web application designed to help users learn, explore, and practice yoga poses 
            through detailed instructions, categorized pose lists, and beginner-friendly guides. 
            The application aims to promote healthy living by making yoga accessible to people of all ages and skill levels.
          </p>
          <div className="about-benefits">
            <div className="benefit">
              <h4>Physical Benefits</h4>
              <p>Improve flexibility, strength, and balance</p>
            </div>
            <div className="benefit">
              <h4>Mental Benefits</h4>
              <p>Reduce stress and enhance mindfulness</p>
            </div>
            <div className="benefit">
              <h4>Accessibility</h4>
              <p>Practice anywhere, anytime at your own pace</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/user-auth" element={<UserAuthChoice />} />
      <Route path="/admin-auth" element={<AdminAuthChoice />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pose/mountain" element={<PoseDetails />} />
      <Route path="/pose/downward-dog" element={<PoseDetailsDownwardDog />} />
      <Route path="/poses/:category" element={<CategoryPoses />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/poses" element={
        <ProtectedRoute>
          <HomepageWithPosePreviews />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <HomepageWithPosePreviews />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App
