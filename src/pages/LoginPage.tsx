import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Briefcase, Shield, UserPlus } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LogoBlack from '../assets/logo_black.png';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');

  const [userType, setUserType] = useState(searchParams.get('type') || 'student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[login] submitting');
      const u = await login(formData.email, formData.password);
      console.log('[login] result user:', u);
      // Redirect immediately based on role to avoid bounce
      if (u) {
        const isHost = u.role === 'host';
        const nextPath = isHost ? '/host/registration' : (u.role === 'admin' ? '/admin' : '/student');
        console.log('[login] navigating to', nextPath);
        navigate(nextPath, { replace: true });
        return;
      }
    } catch (error) {
      console.error('[login] error', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const startReset = async () => {
    try {
      setError('');
      const email = resetEmail || formData.email;
      if (!email) { setError('Enter your email to reset password'); return; }
      const res = await apiService.forgotPassword(email);
      if (!res.success) throw new Error(res.message);
      setShowReset(true);
      setResetEmail(email);
    } catch (e:any) {
      setError(e.message || 'Failed to send reset code');
    }
  };

  const confirmReset = async () => {
    try {
      setError('');
      if (!resetEmail || !resetCode || !resetNewPassword) { setError('Fill all reset fields'); return; }
      const res = await apiService.resetPassword(resetEmail, resetCode, resetNewPassword);
      if (!res.success) throw new Error(res.message);
      setShowReset(false);
      setResetCode(''); setResetNewPassword('');
    } catch (e:any) {
      setError(e.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-umd-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src={LogoBlack} 
            alt="University of Maryland Logo" 
            className="h-32 w-auto mx-auto mb-6 transform hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-3xl font-bold text-umd-black mb-4">
            Welcome to IFAD
          </h2>
          
          {/* User Type Selector */}
          <div className="flex justify-center space-x-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                userType === 'student' 
                  ? 'bg-umd-red text-white shadow-lg transform scale-105' 
                  : 'bg-umd-gray-100 text-umd-gray-700 hover:bg-umd-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('host')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                userType === 'host' 
                  ? 'bg-umd-red text-white shadow-lg transform scale-105' 
                  : 'bg-umd-gray-100 text-umd-gray-700 hover:bg-umd-gray-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Host</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                userType === 'admin' 
                  ? 'bg-umd-red text-white shadow-lg transform scale-105' 
                  : 'bg-umd-gray-100 text-umd-gray-700 hover:bg-umd-gray-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
          
          <p className="text-umd-gray-600">
            Sign in to your {userType} portal
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-umd-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-umd-red"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-umd-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-umd-red pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
              loading={isLoading}
            >
              Sign In
            </Button>

            {/* Forgot password */}
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm text-umd-red hover:underline">Forgot password?</Link>
            </div>
          </form>

            {/* Registration Section */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-umd-gray-600 mb-3">
                  Don't have an account?
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {userType === 'student' && (
                    <Button
                      variant="outline"
                      size="md"
                      icon={UserPlus}
                      className="w-full transform hover:scale-105 transition-all duration-300"
                    >
                      <Link to="/register/student" className="block w-full">Register as Student</Link>
                    </Button>
                  )}
                  {userType === 'host' && (
                    <Button
                      variant="outline"
                      size="md"
                      icon={UserPlus}
                      className="w-full transform hover:scale-105 transition-all duration-300"
                    >
                      <Link to="/signup/host" className="block w-full">Create Host Account</Link>
                    </Button>
                  )}
                  {userType === 'admin' && (
                    <div className="text-center">
                      <p className="text-xs text-umd-gray-500 italic">
                        Admin accounts are created by system administrators only
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-umd-gray-500 hover:text-umd-red transition-colors duration-300"
          >
            ← Back to Homepage
          </Link>
        </div>

        {/* Help text */}
        <Card className="bg-umd-gray-50 border-umd-gray-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-umd-gray-700 mb-2">Need Help?</h3>
            <div className="text-xs text-umd-gray-600 space-y-1">
              <p>Use your University of Maryland credentials to sign in.</p>
              <p>Contact IT support if you're having trouble accessing your account.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;