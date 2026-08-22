import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ProduceCard } from '../components/ProduceCard';
import { Sprout, Weight, DollarSign, Phone, MapPin, PlusCircle, AlertCircle, Eye } from 'lucide-react';
import './FormPages.css';

export const Productpage = ({ email, role, onlogout }) => {
  const [produce, setproduce] = useState('');
  const [amount, setamount] = useState('');
  const [price, setprice] = useState('');
  const [location, setlocation] = useState('');
  const [phn_number, setphone] = useState('');
  const [error, seterror] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/product', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ produce, amount, price, location, phn_number }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        seterror('Error submitting produce listing. Please try again.');
      }
    } catch {
      seterror('Network error. Unable to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewData = {
    produce: produce || 'Fresh Tomatoes',
    amount: amount || '100',
    price: price || '25',
    location: location || 'Green Valley Farm',
    phn_number: phn_number || '+1 555-0192',
    farmer_name: email ? email.split('@')[0] : 'Farmer Account',
  };

  return (
    <div className="dashboard-layout">
      <Navbar email={email} role={role} onLogout={onlogout} />

      <main className="main-content animate-fade-in">
        <div className="form-page-grid">
          <div className="form-card glass-card">
            <div className="form-header">
              <div className="form-header-icon">
                <Sprout size={24} />
              </div>
              <div>
                <h2>List Fresh Crop Produce</h2>
                <p>Post your harvested crops for local produce buyers to discover.</p>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlesubmit} className="styled-form">
              <div className="form-group">
                <label className="form-label">Produce Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Organic Apples, Fresh Carrots"
                    value={produce}
                    onChange={(e) => setproduce(e.target.value)}
                    required
                  />
                  <Sprout size={18} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Quantity (kg)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 50"
                      value={amount}
                      onChange={(e) => setamount(e.target.value)}
                      required
                    />
                    <Weight size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 120"
                      value={price}
                      onChange={(e) => setprice(e.target.value)}
                      required
                    />
                    <DollarSign size={18} />
                  </div>
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
                <label className="form-label">Farm Location / Region</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., District 4, Springfield"
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
                    required
                  />
                  <MapPin size={18} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Publishing Yield...' : 'Publish Produce Listing'}</span>
              </button>
            </form>
          </div>

          <div className="preview-column">
            <div className="preview-header">
              <Eye size={16} />
              <span>Live Listing Preview</span>
            </div>
            <ProduceCard data={previewData} />
          </div>
        </div>
      </main>
    </div>
  );
};