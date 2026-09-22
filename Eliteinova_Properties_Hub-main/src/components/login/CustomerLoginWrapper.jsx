// src/components/login/CustomerLoginWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerLogin from './CustomerLogin';

const CustomerLoginWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Open the modal automatically when the URL is /login
  useEffect(() => {
    if (location.pathname === '/login') {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    if (location.pathname === '/login') {
      navigate(-1);
    }
  };

  const handleSwitchToRegister = () => {
    setIsOpen(false);
    navigate('/register');
    // 👉 If/when you build a CustomerRegister modal, trigger it here instead.
  };

  return (
    <>
      <CustomerLogin
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
};

export default CustomerLoginWrapper;