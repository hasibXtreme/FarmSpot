import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { OrderCard } from '../components/OrderCard';
import { ShoppingBag, Phone, Calendar, PlusCircle, AlertCircle, Eye } from 'lucide-react';
import './FormPages.css';

export const Orderpage = ({ email, role, onlogout }) => {
  const [phn_number, setphone] = useState('');
  const [order, setorder] = useState('');
  const [deadline, setdeadline] = useState('');
  const [error, seterror] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleorder = async (e) => {
    e.preventDefault();
    seterror('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order, phn_number, deadline }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        seterror('Error submitting buy order request.');
      }
    } catch {
      seterror('Network error. Unable to create order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewData = {
    order: order || '200kg Fresh Strawberries',
    phn_number: phn_number || '+1 555-0188',
    deadline: deadline || new Date().toISOString(),
    buyer_name: email ? email.split('@')[0] : 'Buyer Account',
  };

  return (
    <div className="dashboard-layout">
      <Navbar email={email} role={role} onLogout={onlogout} />

      <main className="main-content animate-fade-in">
        <div className="form-page-grid">
          <div className="form-card glass-card">
            <div className="form-header">
              <div className="form-header-icon order-header-icon">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2>Create Produce Demand Order</h2>
                <p>Submit your crop requirement so local farmers can fulfill your order.</p>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleorder} className="styled-form">
              <div className="form-group">
                <label className="form-label">Produce Requirement Details</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 200 kg Organic Sweet Potatoes"
                    value={order}
                    onChange={(e) => setorder(e.target.value)}
                    required
                  />
                  <ShoppingBag size={18} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., +1 234 567 8900"
                    value={phn_number}
                    onChange={(e) => setphone(e.target.value)}
                    required
                  />
                  <Phone size={18} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fulfillment Deadline</label>
                <div className="input-wrapper">
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={deadline}
                    onChange={(e) => setdeadline(e.target.value)}
                    required
                  />
                  <Calendar size={18} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Posting Demand...' : 'Post Order Requirement'}</span>
              </button>
            </form>
          </div>

          <div className="preview-column">
            <div className="preview-header">
              <Eye size={16} />
              <span>Live Order Preview</span>
            </div>
            <OrderCard data={previewData} />
          </div>
        </div>
      </main>
    </div>
  );
};
