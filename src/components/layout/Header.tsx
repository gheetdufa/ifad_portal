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
    <header className="bg-white shadow-sm border-b border-umd-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={SmallerLogo} 
              alt="University of Maryland Logo" 
              className="h-14 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-umd-black">University Career Center</h1>
              <p className="text-xs text-umd-gray-600">Intern for a Day</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? 'text-umd-red bg-umd-red/5'
                      : 'text-umd-gray-700 hover:text-umd-red hover:bg-umd-gray-50'
                  }`}
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-umd-red hover:bg-red-700 text-white"
                >
                  <Link to="/login" className="block w-full">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-umd-gray-600 hover:text-umd-red hover:bg-umd-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-umd-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'text-umd-red bg-umd-red/5'
                        : 'text-umd-gray-700 hover:text-umd-red hover:bg-umd-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
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