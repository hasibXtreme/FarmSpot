import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import './AuthPages.css';

export const Loginpage = ({ onloginsuccess }) => {
  const [password, setpassword] = useState('');
  const [error, seterror] = useState('');
  const [email, setemail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    seterror('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onloginsuccess(email, true, data.role);
        navigate('/');
      } else {
        seterror(data.message || 'Invalid credentials');
      }
    } catch {
      seterror('Error logging in. Please check your connection.');
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your produce network & active orders</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlelogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                onChange={(e) => setemail(e.target.value)}
                value={email}
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
                placeholder="••••••••"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                required
              />
              <Lock size={18} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <LogIn size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Haven't registered yet?{' '}
            <Link to="/register" className="auth-link">
              Create an account <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
