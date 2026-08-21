import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login'; // ✅ FIXED (correct lowercase)

const LoginOverlay: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If logged in → hide modal
    if (isAuthenticated) {
      setShowModal(false);
      return;
    }

    // If user is on login/register or guide flows → don't show modal
    if (
      location.pathname.toLowerCase() === '/login' ||
      location.pathname.toLowerCase() === '/register' ||
      location.pathname.toLowerCase().includes('guide')
    ) {
      setShowModal(false);
      return;
    }

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('loginModalDismissed');

    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, location.pathname]);

  const handleClose = () => {
    setShowModal(false);
    sessionStorage.setItem('loginModalDismissed', 'true');
  };

  if (!showModal) return null;

  return <Login isModal={true} onClose={handleClose} />;
};

export default LoginOverlay;
