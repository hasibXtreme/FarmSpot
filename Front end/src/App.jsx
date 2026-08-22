import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Homepage } from './pages/homePage.jsx';
import { Loginpage } from './pages/loginPage.jsx';
import { Registerpage } from './pages/registerPage.jsx';
import { Orderpage } from './pages/order.jsx';
import { Productpage } from './pages/product.jsx';
import { Sprout } from 'lucide-react';
import './App.css';

function App() {
  const [email, setemail] = useState('');
  const [isauthenticated, setauth] = useState(false);
  const [loading, setloading] = useState(true);
  const [role, setrole] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/verify', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setauth(true);
          setemail(data.email);
          setrole(data.role);
        }
      })
      .catch((err) => console.error('Verification error:', err))
      .finally(() => {
        setloading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary-800)' }}>
          <Sprout size={20} />
          <span>Loading AgriDirect...</span>
        </div>
      </div>
    );
  }

  const handleloginsuccess = (useremail, authenticated, userrole) => {
    setemail(useremail);
    setauth(authenticated);
    setrole(userrole);
  };

  const handlelogout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setemail('');
    setrole('');
    setauth(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage onloginsuccess={handleloginsuccess} />} />
        <Route
          path="/order-page"
          element={
            isauthenticated ? (
              <Orderpage email={email} role={role} onlogout={handlelogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/product-page"
          element={
            isauthenticated ? (
              <Productpage email={email} role={role} onlogout={handlelogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isauthenticated ? (
              <Homepage email={email} role={role} onlogout={handlelogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
