import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Calendar, CheckCircle, Clock, AlertTriangle, Edit, Mail, 
  RefreshCw, FileText, UserCheck, Settings, Building, Briefcase, MapPin 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { apiService } from '../../services/api';

const HostDashboard: React.FC = () => {
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('pending');
  const [registrationStatus, setRegistrationStatus] = useState('not_registered'); // 'not_registered', 'registered', 'pending'
  const [currentSemester, setCurrentSemester] = useState('Fall 2025');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  // Check profile and registration status on component mount
  useEffect(() => {
    checkHostStatus();
  }, [currentSemester]);

  const checkHostStatus = async () => {
    try {
      setIsLoading(true);
      // Load profile
      const profileResponse = await apiService.getProfile();
      if (profileResponse.success) {
        const isVerified = !!profileResponse.data.verified;
        const stageIsIncomplete = profileResponse.data.profileStage === 'incomplete';
        const status: 'incomplete' | 'pending' | 'approved' = stageIsIncomplete ? 'incomplete' : (isVerified ? 'approved' : 'pending');
        setProfileStatus(status);
        setProfile(profileResponse.data);
        // If incomplete, redirect handled by router gate; still set state
        
        // Check registration regardless of approval per updated policy
        {
          try {
            // Use server-determined current semester by omitting param
            let regResponse = await apiService.getSemesterRegistration();
            if (regResponse.success && regResponse.data.registered) {
              setRegistrationStatus('registered');
              if (regResponse.data.semester) setCurrentSemester(regResponse.data.semester);
            } else {
              // Fallback: explicitly check Fall2025 to handle season gap
              const fallbackSemester = 'Fall2025';
              regResponse = await apiService.getSemesterRegistration(fallbackSemester);
              if (regResponse.success && regResponse.data.registered) {
                setRegistrationStatus('registered');
                setCurrentSemester(regResponse.data.semester || fallbackSemester);
              } else {
                setRegistrationStatus('not_registered');
              }
            }
          } catch {
            setRegistrationStatus('not_registered');
          }
        }
      }
    } catch (error) {
      console.error('Error checking host status:', error);
      setProfileStatus('pending');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkHostStatus();
    setIsRefreshing(false);
  };

  const TimelineCard: React.FC = () => {
    const items = [
      { label: 'Profile Created', status: 'done' as const, desc: 'Your host profile has been created' },
      { label: 'Semester Registration', status: registrationStatus === 'registered' ? 'done' : 'todo', desc: registrationStatus === 'registered' ? `Registered for ${currentSemester}` : `Register for ${currentSemester}` },
      { label: 'Admin Review', status: profileStatus === 'approved' ? 'done' : 'inprogress', desc: profileStatus === 'approved' ? 'Approved by an administrator' : 'We are reviewing your information' },
      { label: 'Matching & Scheduling', status: registrationStatus === 'registered' ? 'todo' : 'locked', desc: 'We will match you with students based on interests' },
    ];

    const getStatusBadge = (s: 'done' | 'inprogress' | 'todo' | 'locked') => {
      switch (s) {
        case 'done':
          return <Badge variant="success" className="ml-2">Done</Badge>;
        case 'inprogress':
          return <Badge variant="warning" className="ml-2">In progress</Badge>;
        case 'todo':
          return <Badge variant="secondary" className="ml-2">Next</Badge>;
        default:
          return <Badge variant="secondary" className="ml-2">Locked</Badge>;
      }
    };

    return (
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline</h2>
        <div className="space-y-4">
          {items.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {idx === 0 && <User className="w-4 h-4 text-gray-700" />}
                {idx === 1 && <CheckCircle className={`w-4 h-4 ${step.status === 'done' ? 'text-green-600' : 'text-yellow-600'}`} />}
                {idx === 2 && <Calendar className="w-4 h-4 text-umd-red" />}
                {idx === 3 && <Clock className="w-4 h-4 text-umd-black" />}
              </div>
              <div>
                <div className="font-semibold text-gray-900 flex items-center">
                  {step.label}
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const ProfileSummaryCard: React.FC = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Information</h2>
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-800"><User className="w-4 h-4 text-umd-red" /><span>{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '—'}</span></div>
        <div className="flex items-center space-x-2 text-gray-800"><Mail className="w-4 h-4 text-umd-red" /><span>{profile?.email || '—'}</span></div>
        <div className="flex items-center space-x-2 text-gray-800"><Building className="w-4 h-4 text-umd-red" /><span>{profile?.organization || '—'}</span></div>
        <div className="flex items-center space-x-2 text-gray-800"><Briefcase className="w-4 h-4 text-umd-red" /><span>{profile?.jobTitle || '—'}</span></div>
        <div className="flex items-center space-x-2 text-gray-800"><MapPin className="w-4 h-4 text-umd-red" /><span>{profile?.workLocation || '—'}</span></div>
        <div className="pt-2"><Link to="/host/registration"><Button variant="outline" icon={Edit}>Edit Profile</Button></Link></div>
      </div>
    </Card>
  );

  const ResourcesCard: React.FC = () => (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
      <p className="text-sm text-umd-black">
        Email us at <a href="mailto:ifad@umd.edu" className="text-umd-red underline">ifad@umd.edu</a>
      </p>
    </Card>
  );

  // Mock host data - in production, this would come from the API
  const hostData = {
    firstName: 'Ms.',
    lastName: 'Harper',
    jobTitle: 'Software Engineering Manager',
    organization: 'Tech Innovators Inc.',
    industry: 'Technology',
    email: 'harper@techinnovators.com',
    phone: '(555) 123-4567',
    profileImage: '👩‍💼',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Profile Approved</span>
        </Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Pending Admin Review</span>
        </Badge>;
      case 'rejected':
        return <Badge variant="error" className="flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Profile Rejected</span>
        </Badge>;
      default:
        return null;
    }
  };

  const renderStatusBanner = () => {
    const rawPrefix = (profile?.preferredPrefix || '').trim();
    const prefixText = rawPrefix && rawPrefix.toLowerCase() !== 'none' ? rawPrefix + ' ' : '';
    const fullName = `${prefixText}${[profile?.firstName, profile?.lastName].filter(Boolean).join(' ')}`.trim();
    if (profileStatus === 'incomplete') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Welcome, {fullName || 'Host'}</h1>
            <p className="font-semibold text-blue-900">Complete your host profile to continue</p>
            <p className="text-sm text-blue-800">Provide organization, role, location, and experience details.</p>
          </div>
          <Link to="/host/registration">
            <Button variant="primary" icon={Edit} className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">Complete Profile</Button>
          </Link>
        </div>
      );
    }
    if (profileStatus === 'pending') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold text-yellow-900 mb-1">Welcome, {fullName || 'Host'}</h1>
              <p className="font-semibold text-yellow-900">Your host profile is under review</p>
              <p className="text-sm text-yellow-800">You can still update your profile and register for the semester</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isRefreshing ? 'Checking...' : 'Check Status'}
          </Button>
        </div>
      );
    }
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-green-900 mb-1">Welcome, {fullName || 'Host'}</h1>
            <p className="font-semibold text-green-900">Your host profile is approved</p>
            {registrationStatus !== 'registered' ? (
              <p className="text-sm text-green-800">Next: register for {currentSemester} to receive student matches</p>
            ) : (
              <p className="text-sm text-green-800">You are registered for {currentSemester}</p>
            )}
          </div>
        </div>
        {registrationStatus !== 'registered' && (
          <Link to="/host/semester-registration">
            <Button variant="primary" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">
              Register for {currentSemester}
            </Button>
          </Link>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {renderStatusBanner()}

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/host/registration">
              <Button variant="outline" icon={Edit}>Edit Profile</Button>
            </Link>
            {registrationStatus !== 'registered' && (
              <Link to="/host/semester-registration">
                <Button variant="outline" icon={Calendar}>Register for {currentSemester}</Button>
              </Link>
            )}
            <Button variant="outline" icon={RefreshCw} onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? 'Checking...' : 'Refresh Status'}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TimelineCard />
          </div>
          <div className="space-y-6">
            <ProfileSummaryCard />
            <ResourcesCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;