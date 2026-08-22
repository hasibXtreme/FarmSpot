import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ProduceCard } from '../components/ProduceCard';
import { OrderCard } from '../components/OrderCard';
import { PlusCircle, Search, Layers, ShieldCheck, Inbox } from 'lucide-react';
import './Dashboard.css';

export const Homepage = ({ email, onlogout, role }) => {
  const [datas, setdatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return;

    let isMounted = true;

    const endpoint =
      role === 'farmer'
        ? '/api/order/recent'
        : '/api/product/today';

    fetch(endpoint, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setdatas(data);
        } else {
          setdatas([]);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        if (isMounted) setdatas([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [role]);

  const handlelogout = () => {
    onlogout();
    navigate('/login');
  };

  // Filter items based on search term
  const filteredData = Array.isArray(datas)
    ? datas.filter((item) => {
        const query = searchTerm.toLowerCase();
        if (role === 'farmer') {
          return (
            (item.buyer_name && item.buyer_name.toLowerCase().includes(query)) ||
            (item.order && item.order.toLowerCase().includes(query)) ||
            (item.phn_number && item.phn_number.includes(query))
          );
        } else {
          return (
            (item.produce && item.produce.toLowerCase().includes(query)) ||
            (item.farmer_name && item.farmer_name.toLowerCase().includes(query)) ||
            (item.location && item.location.toLowerCase().includes(query)) ||
            (item.phn_number && item.phn_number.includes(query))
          );
        }
      })
    : [];

  return (
    <div className="dashboard-layout">
      <Navbar email={email} role={role} onLogout={handlelogout} />

      <main className="main-content animate-fade-in">
        {/* Role Dashboard Hero */}
        <div className="hero-banner glass-card">
          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={14} />
              <span>Verified {role === 'farmer' ? 'Farmer Portal' : 'Buyer Hub'}</span>
            </div>

            <h1 className="hero-title">
              {role === 'farmer' ? 'Incoming Buyer Demand' : "Today's Fresh Produce"}
            </h1>

            <p className="hero-subtitle">
              {role === 'farmer'
                ? 'Review recent crop requests from verified buyers and get in direct contact.'
                : 'Browse fresh farm produce harvested today directly from local farmers.'}
            </p>

            <div className="hero-actions">
              {role === 'farmer' ? (
                <Link to="/product-page" className="btn btn-primary">
                  <PlusCircle size={18} />
                  <span>Post Fresh Crop Yield</span>
                </Link>
              ) : (
                <Link to="/order-page" className="btn btn-primary">
                  <PlusCircle size={18} />
                  <span>Request Specific Produce</span>
                </Link>
              )}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Layers size={20} />
              </div>
              <div>
                <span className="stat-value">{datas.length}</span>
                <span className="stat-label">
                  {role === 'farmer' ? 'Active Orders' : 'Available Products'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={
                role === 'farmer'
                  ? 'Search by buyer name, crop order, phone...'
                  : 'Search by produce type, farmer name, location...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid or Skeleton/Empty State */}
        {isLoading ? (
          <div className="loading-screen" style={{ minHeight: '300px' }}>
            <div className="spinner"></div>
            <p>Fetching market data...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="cards-grid">
            {role === 'farmer'
              ? filteredData.map((data, index) => (
                  <OrderCard key={data.id || index} data={data} />
                ))
              : filteredData.map((data, index) => (
                  <ProduceCard key={data.id || index} data={data} />
                ))}
          </div>
        ) : (
          <div className="empty-state glass-card">
            <div className="empty-icon-wrapper">
              <Inbox size={36} />
            </div>
            <h3>No {role === 'farmer' ? 'buyer orders' : 'produce listings'} found</h3>
            <p>
              {searchTerm
                ? 'No items match your search filter. Try clearing the search query.'
                : role === 'farmer'
                ? 'There are currently no active buyer requests. Check back soon or list your crops!'
                : 'No fresh produce has been posted today yet. Place an order or check back later!'}
            </p>
            {searchTerm ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            ) : role === 'farmer' ? (
              <Link to="/product-page" className="btn btn-primary btn-sm">
                Add Products Now
              </Link>
            ) : (
              <Link to="/order-page" className="btn btn-primary btn-sm">
                Place an Order
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
