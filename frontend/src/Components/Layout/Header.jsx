import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = ({ cartItems }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Function to update user state from localStorage
  const updateUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
  };

  useEffect(() => {
    // Initialize user
    updateUser();

    // Listen to custom events
    window.addEventListener('userChanged', updateUser);

    return () => {
      window.removeEventListener('userChanged', updateUser);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success('Logged out', { position: 'bottom-right' });

    // Dispatch custom event so header updates instantly
    window.dispatchEvent(new Event('userChanged'));
    navigate('/login');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar row" style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff' }}>
      <div className="col-6 col-md-3">
        <Link to="/">
          <img src="./images/shopit_logo.png" alt="logo" style={{ height: '40px' }} />
        </Link>
      </div>

      <div className="col-6 col-md-9 d-flex justify-content-end align-items-center">
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative', marginRight: '20px' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              {user.name} ▼
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                color: '#333',
                minWidth: '120px',
                borderRadius: '5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                zIndex: 1000,
              }}>
                <Link
                  to="/me"
                  onClick={() => setDropdownOpen(false)}
                  style={{ padding: '10px', display: 'block', textDecoration: 'none', color: '#333' }}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  style={{ padding: '10px', width: '100%', textAlign: 'left', border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{ marginRight: '20px', color: '#fff' }}>Login</Link>
        )}

        <Link to="/cart" style={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>
          Cart ({cartItems ? cartItems.length : 0})
        </Link>
      </div>
    </nav>
  );
};

export default Header;