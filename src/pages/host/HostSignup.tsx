import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SmallerLogo from '../../assets/Smaller_logo.png';
import { useAuth } from '../../hooks/useAuth';

const HostSignup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.firstName || !formData.lastName) return 'First and last name are required';
    if (!formData.email) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(formData.password)) return 'Password must contain a lowercase letter';
    if (!/(?=.*[A-Z])/.test(formData.password)) return 'Password must contain an uppercase letter';
    if (!/(?=.*\d)/.test(formData.password)) return 'Password must contain a number';
    return '';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setIsSubmitting(true);
    try {
      // Backend compatibility: supply minimal required host fields
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'host',
        // Minimal placeholders to satisfy current backend host validation
        jobTitle: 'Prospective Host',
        organization: 'TBD',
        workLocation: 'virtual',
        workPhone: '555-555-0100',
        careerFields: ['Other'],
      });
      navigate('/login?type=host', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <img src={SmallerLogo} alt="University of Maryland Logo" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-umd-black">Create IFAD Host Account</h1>
          <p className="text-umd-gray-600 mt-2">Create your account to log in and complete your IFAD host profile.</p>
        </div>

        <Card>
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>

            <Input
              type="email"
              placeholder="Work Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-gray-500">Must include at least 8 characters, one uppercase, one lowercase, and one number.</p>

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Create Account
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-umd-gray-600">
            Already have an account?{' '}
            <Link to="/login?type=host" className="text-umd-red hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostSignup;


