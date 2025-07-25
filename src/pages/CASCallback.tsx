import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { casService, CASValidationResponse } from '../services/cas';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import LogoBlack from '../assets/logo_black.png';

const CASCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithCAS } = useAuth();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleCASCallback();
  }, []);

  const handleCASCallback = async () => {
    try {
      const ticket = searchParams.get('ticket');
      
      if (!ticket) {
        setError('No CAS ticket found in URL');
        setStatus('error');
        return;
      }

      // Clean the ticket from URL
      casService.cleanUrlFromTicket();

      // Validate the CAS ticket
      const validationResponse: CASValidationResponse = await casService.validateTicket(ticket);
      
      if (!validationResponse.success) {
        setError(validationResponse.error?.message || 'CAS validation failed');
        setStatus('error');
        return;
      }

      if (!validationResponse.username) {
        setError('No username returned from CAS');
        setStatus('error');
        return;
      }

      // Login with CAS credentials
      await loginWithCAS({
        username: validationResponse.username,
        directoryId: validationResponse.username, // UMD returns Directory ID as username
        attributes: validationResponse.attributes || {},
      });

      setStatus('success');
      
      // Redirect to student dashboard after successful login
      setTimeout(() => {
        navigate('/student', { replace: true });
      }, 1500);

    } catch (error: any) {
      console.error('CAS callback error:', error);
      setError(error.message || 'Authentication failed');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    // Redirect back to login page
    navigate('/login?type=student', { replace: true });
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-umd-red animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-umd-black">Authenticating...</h2>
            <p className="text-umd-gray-600">
              Verifying your UMD credentials with CAS
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-umd-black">Authentication Successful!</h2>
            <p className="text-umd-gray-600">
              Redirecting you to your student dashboard...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-umd-black">Authentication Failed</h2>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-umd-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-umd-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src={LogoBlack} 
            alt="University of Maryland Logo" 
            className="h-24 w-auto mx-auto mb-6"
          />
        </div>

        <Card className="p-8">
          {renderContent()}
        </Card>

        {status === 'error' && (
          <div className="text-center">
            <a 
              href="/login" 
              className="text-sm text-umd-gray-500 hover:text-umd-red transition-colors duration-300"
            >
              ← Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CASCallback;