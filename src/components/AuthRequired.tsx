import { ReactNode } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthRequiredProps {
  children: ReactNode;
  redirectToLogin?: boolean;
}

const AuthRequired = ({ children, redirectToLogin = true }: AuthRequiredProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (redirectToLogin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-serif text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login or sign up to view product details.</p>
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Sign Up
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default AuthRequired;