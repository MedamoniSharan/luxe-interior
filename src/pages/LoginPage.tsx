import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sofa, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const validateIdentifier = (value: string) => {
    // Check if it's an email
    if (value.includes('@')) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    // Check if it's a phone number
    return /^[6-9]\d{9}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Validate identifier
    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email address or 10-digit mobile number');
      setIsSubmitting(false);
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await login(identifier, password);
      
      if (result?.error) {
        setError(result.error.message || 'Failed to login. Please try again.');
      } else {
        console.log('🎉 Login successful, navigating to:', from);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-elegant">
          <div className="p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center mb-6">
                <Sofa size={32} className="text-secondary-400" />
                <span className="text-2xl font-serif font-bold text-white ml-2">Luxe Interiors</span>
              </Link>
              <h1 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/80">Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-white/90 text-sm font-medium mb-2">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or mobile number"
                  className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                  required
                />
              </div>

                {error && <p className="mt-2 text-sm text-error-500">{error}</p>}

              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full btn btn-secondary"
              >
                {isLoading || isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLoading ? 'Loading...' : 'Signing In...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In <ArrowRight className="ml-2" size={18} />
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="py-4 px-8 bg-white/5 border-t border-white/10 text-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link to="/signup" className="text-secondary-400 hover:text-secondary-300 font-medium">
                Sign up <ChevronRight className="inline" size={14} />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;