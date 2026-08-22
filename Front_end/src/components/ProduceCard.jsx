import { MapPin, Phone, User, Weight } from 'lucide-react';
import './Cards.css';

export const ProduceCard = ({ data }) => {
  const { farmer_name, produce, amount, price, phn_number, location } = data;

  return (
    <div className="glass-card glass-card-hover produce-card animate-fade-in">
      <div className="card-top">
        <div className="produce-header">
          <span className="produce-badge">Fresh Produce</span>
          <h3 className="produce-title">{produce}</h3>
        </div>
        <div className="price-tag">
          <span className="currency">$</span>
          <span className="amount">{price}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="info-pill-row">
          <div className="info-pill">
            <Weight size={15} className="pill-icon text-emerald" />
            <span><strong>{amount}</strong> kg available</span>
          </div>
          {location && (
            <div className="info-pill">
              <MapPin size={15} className="pill-icon text-amber" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="card-divider" />

        <div className="farmer-footer">
          <div className="farmer-info">
            <div className="avatar-circle">
              <User size={16} />
            </div>
            <div>
              <span className="meta-label">Farmer</span>
              <p className="farmer-name">{farmer_name || 'Verified Farmer'}</p>
            </div>
          </div>

          {phn_number && (
            <a href={`tel:${phn_number}`} className="btn btn-secondary btn-sm phone-btn">
              <Phone size={14} />
              <span>{phn_number}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
