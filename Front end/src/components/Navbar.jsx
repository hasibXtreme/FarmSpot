import { Link, useLocation } from 'react-router-dom';
import { Sprout, LogOut, PlusCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import './Navbar.css';

export const Navbar = ({ email, role, onLogout }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Sprout size={22} className="brand-logo-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AgriDirect</span>
            <span className="brand-subtitle">Fresh Produce Network</span>
          </div>
        </Link>

        <div className="navbar-actions">
          {email && (
            <div className="user-profile-chip">
              <div className="user-avatar">
                {role === 'farmer' ? <Sprout size={16} /> : <ShoppingBag size={16} />}
              </div>
              <div className="user-details">
                <span className="user-email">{email}</span>
                <span className={`user-role-badge badge-${role === 'farmer' ? 'emerald' : 'amber'}`}>
                  {role}
                </span>
              </div>
            </div>
          )}

          {isHomePage ? (
            role === 'farmer' ? (
              <Link to="/product-page" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>Add Product</span>
              </Link>
            ) : (
              <Link to="/order-page" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>Create Order</span>
              </Link>
            )
          ) : (
            <Link to="/" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
          )}

          {onLogout && (
            <button onClick={onLogout} className="btn btn-danger-soft btn-sm" title="Log Out">
              <LogOut size={16} />
              <span className="hide-mobile">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
