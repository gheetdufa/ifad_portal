import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle, Database } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { awsTimelineService } from '../../services/aws-timeline';

interface AwsStatusCheckerProps {
  className?: string;
}

const AwsStatusChecker: React.FC<AwsStatusCheckerProps> = ({ className }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkAwsStatus = async () => {
    setIsChecking(true);
    try {
      const response = await awsTimelineService.checkConnection();
      
      if (response.success) {
        setConnectionStatus('connected');
        setStatusMessage(response.message || 'AWS services are operational');
      } else {
        setConnectionStatus('error');
        setStatusMessage(response.error || 'AWS connection failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      setStatusMessage('Failed to check AWS status');
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (autoRefresh) {
      checkAwsStatus();
      const interval = setInterval(checkAwsStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = () => {
    if (isChecking) {
      return <Badge variant="primary" size="sm">Checking...</Badge>;
    }

    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="success" size="sm">Connected</Badge>;
      case 'error':
        return <Badge variant="error" size="sm">Error</Badge>;
      default:
        return <Badge variant="warning" size="sm">Unknown</Badge>;
    }
  };

  const formatLastChecked = () => {
    if (!lastChecked) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - lastChecked.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return lastChecked.toLocaleDateString();
  };

  return (
    <Card className={`border-l-4 ${
      connectionStatus === 'connected' ? 'border-l-green-500' : 
      connectionStatus === 'error' ? 'border-l-red-500' : 'border-l-yellow-500'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-umd-gray-600" />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-umd-black">AWS Services Status</h3>
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
            <p className="text-sm text-umd-gray-600">{statusMessage}</p>
            <p className="text-xs text-umd-gray-500">Last checked: {formatLastChecked()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-umd-red focus:ring-umd-red"
            />
            <label htmlFor="auto-refresh" className="text-xs text-umd-gray-600">
              Auto-refresh
            </label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={checkAwsStatus}
            disabled={isChecking}
            className="min-w-[80px]"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Check Now'
            )}
          </Button>
        </div>
      </div>

      {connectionStatus === 'connected' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-umd-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-umd-gray-700">DynamoDB</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-umd-gray-700">SNS Notifications</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-umd-gray-700">Timeline API</span>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            AWS services are experiencing issues. Timeline management may be affected.
            <br />
            <span className="text-xs text-red-600">Check AWS console or contact system administrator.</span>
          </p>
        </div>
      )}
    </Card>
  );
};

export default AwsStatusChecker;