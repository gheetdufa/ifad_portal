import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import apiService from '../services/api';
import SmallerLogo from '../assets/Smaller_logo.png';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email'); return; }
    setIsSubmitting(true);
    try {
      const res = await apiService.forgotPassword(email);
      if (!res.success) throw new Error(res.message);
      setSent(true);
      setTimeout(() => navigate('/reset-password', { state: { email } }), 800);
    } catch (e:any) {
      setError(e.message || 'Failed to send reset code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <img src={SmallerLogo} alt="UMD Logo" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-umd-black">Forgot your password?</h1>
          <p className="text-umd-gray-700 mt-2">Enter your email and we’ll send you a verification code.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-umd-red" />
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">Send Code</Button>
            <Button type="button" variant="outline" className="w-full" onClick={()=>navigate('/login')}>Back to Login</Button>
            {sent && <p className="text-center text-sm text-green-700">Code sent! Redirecting…</p>}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;


