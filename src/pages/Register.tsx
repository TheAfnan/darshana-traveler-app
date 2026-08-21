import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth/SignInModal.css'; // Reuse the CSS

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.phone, formData.password);
      navigate('/travelhub');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="signin-modal-container" style={{ transform: 'none', margin: '0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        
        {/* Left Side: Illustration */}
        <div className="signin-modal-left">
          <img 
            src="/images/hero.png" 
            alt="Travel Illustration" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.backgroundColor = '#FFE0B2';
              }
            }} 
          />
        </div>

        {/* Right Side: Register Form */}
        <div className="signin-modal-right">
          <h2 className="signin-modal-title">Darshana</h2>
          <p className="signin-modal-subtitle">Create Your Account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="signin-form-group">
              <input 
                type="text" 
                name="name"
                className="signin-input-field" 
                placeholder="Full Name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="signin-form-group">
              <input 
                type="email" 
                name="email"
                className="signin-input-field" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="signin-form-group">
              <input 
                type="tel" 
                name="phone"
                className="signin-input-field" 
                placeholder="Mobile Number" 
                required 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="signin-form-group">
              <input 
                type="password" 
                name="password"
                className="signin-input-field" 
                placeholder="Password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="signin-form-group">
              <input 
                type="password" 
                name="confirmPassword"
                className="signin-input-field" 
                placeholder="Confirm Password" 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="signin-btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
