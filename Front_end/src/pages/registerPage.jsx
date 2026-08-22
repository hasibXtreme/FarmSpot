import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, User, UserCheck, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import './AuthPages.css';

export const Registerpage = () => {
  const [email, setemail] = useState('');
  const [password, setpass] = useState('');
  const [name, setname] = useState('');
  const [error, seterror] = useState('');
  const [role, setrole] = useState('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();
    seterror('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        seterror(data.message || 'Registration failed');
      }
    } catch {
      seterror('Registration error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sprout size={26} />
          </div>
          <h1 className="auth-title">Join AgriDirect</h1>
          <p className="auth-subtitle">Connect directly with local farmers and produce buyers</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleregister} className="auth-form">
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div className="role-selector-grid">
              <div
                className={`role-option-card ${role === 'buyer' ? 'selected' : ''}`}
                onClick={() => setrole('buyer')}
              >
                <div className="role-icon">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <span className="role-title">Buyer</span>
                  <span className="role-desc">Sourcing fresh produce</span>
                </div>
              </div>

              <div
                className={`role-option-card ${role === 'farmer' ? 'selected' : ''}`}
                onClick={() => setrole('farmer')}
              >
                <div className="role-icon">
                  <Sprout size={20} />
                </div>
                <div>
                  <span className="role-title">Farmer</span>
                  <span className="role-desc">Selling farm yields</span>
                </div>
              </div>
            </div>
            {/* Hidden select to ensure id select-role is preserved for DOM selectors */}
            <select
              id="select-role"
              value={role}
              onChange={(e) => setrole(e.target.value)}
              style={{ display: 'none' }}
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
              <User size={18} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
              <Mail size={18} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                className="form-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setpass(e.target.value)}
                required
              />
              <Lock size={18} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            <UserCheck size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
