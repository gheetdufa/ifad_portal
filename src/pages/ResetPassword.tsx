import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import apiService from '../services/api';
import SmallerLogo from '../assets/Smaller_logo.png';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const presetEmail = location?.state?.email || '';
  const [email, setEmail] = useState(presetEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !code || !newPassword) { setError('Please fill all fields'); return; }
    setIsSubmitting(true);
    try {
      const res = await apiService.resetPassword(email, code, newPassword);
      if (!res.success) throw new Error(res.message);
      setDone(true);
      setTimeout(()=>navigate('/login'), 1000);
    } catch (e:any) {
      setError(e.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <img src={SmallerLogo} alt="UMD Logo" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-umd-black">Reset your password</h1>
          <p className="text-umd-gray-700 mt-2">Enter the verification code sent to your email and choose a new password.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg" />
            <input type="text" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Verification code" className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg" />
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg" />
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">Reset Password</Button>
            <Button type="button" variant="outline" className="w-full" onClick={()=>navigate('/login')}>Back to Login</Button>
            {done && <p className="text-center text-sm text-green-700">Password reset! Redirecting…</p>}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;


