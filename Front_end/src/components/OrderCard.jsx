import { ShoppingBag, Clock, Phone, User } from 'lucide-react';
import './Cards.css';

export const OrderCard = ({ data }) => {
  const { buyer_name, order, phn_number, deadline } = data;

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'No deadline specified';

  return (
    <div className="glass-card glass-card-hover order-card animate-fade-in">
      <div className="card-top">
        <div className="produce-header">
          <span className="order-badge">Buyer Demand</span>
          <h3 className="produce-title">{order}</h3>
        </div>
        <div className="order-icon-circle">
          <ShoppingBag size={20} />
        </div>
      </div>

      <div className="card-body">
        {deadline && (
          <div className="deadline-box">
            <Clock size={15} className="deadline-icon" />
            <div className="deadline-text">
              <span className="meta-label">Required By</span>
              <span className="deadline-val">{formattedDeadline}</span>
            </div>
          </div>
        )}

        <div className="card-divider" />

        <div className="farmer-footer">
          <div className="farmer-info">
            <div className="avatar-circle buyer-avatar">
              <User size={16} />
            </div>
            <div>
              <span className="meta-label">Buyer</span>
              <p className="farmer-name">{buyer_name || 'Verified Buyer'}</p>
            </div>
          </div>

          {phn_number && (
            <a href={`tel:${phn_number}`} className="btn btn-primary btn-sm phone-btn">
              <Phone size={14} />
              <span>{phn_number}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
