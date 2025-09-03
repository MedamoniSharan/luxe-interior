import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthRequired from './components/AuthRequired';
import Footer from './components/Footer';
import Navbar from './components/NavBar';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import SignupPage from './pages/SignupPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

function App() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={
            <AuthRequired>
              <CartPage />
            </AuthRequired>
          } />
          <Route path="/product/:id" element={
            <AuthRequired>
              <ProductDetailPage />
            </AuthRequired>
          } />
          <Route path="/transactions" element={
            <AuthRequired>
              <TransactionHistoryPage />
            </AuthRequired>
          } />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;