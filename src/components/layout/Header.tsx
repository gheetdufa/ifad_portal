import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import SmallerLogo from '../../assets/Smaller_logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student';
      case 'host': return '/host';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const navigation = user ? [
    { name: 'Dashboard', href: getDashboardPath(), icon: Home },
  ] : [];

  return (
    <header className="bg-white shadow-sm border-b border-umd-gray-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-umd-red/50 rounded-lg" aria-label="Go to homepage">
            <img 
              src={SmallerLogo} 
              alt="University of Maryland Logo" 
              className="h-14 w-auto"
            />
          </Link>
          
          {/* Centered Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-bold text-umd-black">Intern for a Day</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-umd-red/50 ${
                    location.pathname === item.href
                      ? 'text-umd-red bg-umd-red/5'
                      : 'text-umd-gray-700 hover:text-umd-red hover:bg-umd-gray-50'
                  }`}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-umd-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-umd-gray-500 capitalize">{user.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                  className="text-umd-gray-600"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2" role="navigation" aria-label="Authentication and registration">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-umd-gray-700 hover:text-umd-red focus:outline-none focus:ring-4 focus:ring-umd-red/50"
                >
                  <Link to="/login" className="block w-full" aria-label="Login to your account">Login</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-umd-gray-700 hover:text-umd-red focus:outline-none focus:ring-4 focus:ring-umd-red/50"
                >
                  <Link to="/register/student" className="block w-full" aria-label="Register as a student">Student</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-umd-gray-700 hover:text-umd-red focus:outline-none focus:ring-4 focus:ring-umd-red/50"
                >
                  <Link to="/register/host" className="block w-full" aria-label="Register as a host">Host</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-umd-gray-600 hover:text-umd-red hover:bg-umd-gray-50 focus:outline-none focus:ring-4 focus:ring-umd-red/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-umd-gray-200" id="mobile-menu">
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-4 focus:ring-umd-red/50 ${
                      location.pathname === item.href
                        ? 'text-umd-red bg-umd-red/5'
                        : 'text-umd-gray-700 hover:text-umd-red hover:bg-umd-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;