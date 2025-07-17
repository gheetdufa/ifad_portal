import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Briefcase, Shield, UserPlus } from 'lucide-react';
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

  const [userType, setUserType] = useState(searchParams.get('type') || 'student');

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Use demo credentials based on user type
      const demoEmail = userType === 'admin' ? 'admin@umd.edu' : 
                       userType === 'host' ? 'host@example.com' : 'student@umd.edu';
      await login(demoEmail, 'password');
      
      // Redirect based on user type
      const redirectPath = userType === 'admin' ? '/admin' : 
                          userType === 'host' ? '/host' : '/student';
      navigate(redirectPath);
    } catch {
      setError('Login failed');
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
          <Button
            onClick={handleSubmit}
            className="w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            size="lg"
            loading={isLoading}
          >
            Login/Continue
          </Button>

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
                      <Link to="/register/host" className="block w-full">Register as Host</Link>
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

        {/* Demo credentials info */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Student:</strong> student@umd.edu / password</p>
              <p><strong>Host:</strong> host@example.com / password</p>
              <p><strong>Admin:</strong> admin@umd.edu / password</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;