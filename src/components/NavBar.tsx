import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sofa, LogOut, LogIn, UserPlus, ShoppingCart, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { cartItems, cartTotal } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        delay: 0.2
      }
    }
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Services', path: '/services' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact Us', path: '/contact' },
  ];

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-primary-900/95 backdrop-blur-md shadow-md' : 'py-4 bg-primary-900'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sofa size={28} className="text-secondary-400" />
          <span className="text-xl font-serif font-bold text-white">Intoeries</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-white hover:text-secondary-400 transition-colors ${
                location.pathname === link.path ? 'text-secondary-400' : ''
              }`}
            >
              {link.text}
            </Link>
          ))}
                    {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link 
                to="/cart" 
                className="relative flex items-center text-white hover:text-secondary-400 transition-colors"
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <div className="absolute -top-2 -right-2 flex flex-col items-center">
                    <span className="bg-secondary-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                    {cartTotal > 0 && (
                      <span className="text-xs text-secondary-400 whitespace-nowrap mt-1">
                        ₹{cartTotal.toFixed(2)}
                    </span>
                    )}
                  </div>
                )}
              </Link>
              <Link 
                to="/transactions" 
                className="flex items-center space-x-1 text-white hover:text-secondary-400 transition-colors"
              >
                <Receipt size={18} />
                <span>Transactions</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-1 text-white hover:text-secondary-400 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-white hover:text-secondary-400 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center space-x-1 text-secondary-400 hover:text-secondary-300 transition-colors"
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-primary-900/95 backdrop-blur-md"
        >
          <div className="container-custom py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg text-white hover:text-secondary-400 transition-colors py-2 px-4 ${
                  location.pathname === link.path ? 'text-secondary-400' : ''
                }`}
              >
                {link.text}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className="flex items-center justify-between text-white hover:text-secondary-400 transition-colors py-2 px-4"
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingCart size={20} />
                    <span>Cart ({cartItems.length})</span>
                  </div>
                  {cartTotal > 0 && (
                    <span className="text-secondary-400">₹{cartTotal.toFixed(2)}</span>
                  )}
                </Link>
                <Link 
                  to="/transactions" 
                  className="flex items-center space-x-2 text-white hover:text-secondary-400 transition-colors py-2 px-4"
                >
                  <Receipt size={20} />
                  <span>Transactions</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 text-white hover:text-secondary-400 transition-colors py-2 px-4"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 text-white hover:text-secondary-400 transition-colors py-2 px-4"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center space-x-2 text-secondary-400 hover:text-secondary-300 transition-colors py-2 px-4"
                >
                  <UserPlus size={20} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;