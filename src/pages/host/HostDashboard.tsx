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
  const [showOneTimeApproved, setShowOneTimeApproved] = useState(false);
  const [currentSemester] = useState('Fall 2025');
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
      // Check if host profile is approved
      const profileResponse = await apiService.getProfile();
      if (profileResponse.success) {
        const isVerified = !!profileResponse.data.verified;
        const stage = profileResponse.data.profileStage === 'incomplete' ? 'incomplete' : undefined;
        const status: 'incomplete' | 'pending' | 'approved' = stage ? 'incomplete' : (isVerified ? 'approved' : 'pending');
        setProfileStatus(status);
        setProfile(profileResponse.data);
        if (status === 'approved') {
          const seen = localStorage.getItem('ifad_host_seenApproved') === '1';
          if (!seen) {
            setShowOneTimeApproved(true);
            localStorage.setItem('ifad_host_seenApproved', '1');
          }
        }
        
        // Check registration regardless of approval per updated policy
        if (true) {
          try {
            const regResponse = await apiService.getSemesterRegistration(currentSemester);
            if (regResponse.success && regResponse.data.registered) {
              setRegistrationStatus('registered');
            } else {
              setRegistrationStatus('not_registered');
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
      { label: 'Admin Review', status: profileStatus === 'approved' ? 'done' : 'inprogress', desc: profileStatus === 'approved' ? 'Approved by an administrator' : 'We are reviewing your information' },
      { label: 'Semester Registration', status: profileStatus !== 'approved' ? 'locked' : registrationStatus === 'registered' ? 'done' : 'todo', desc: profileStatus !== 'approved' ? 'Available after approval' : registrationStatus === 'registered' ? `Registered for ${currentSemester}` : `Register for ${currentSemester}` },
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

  const renderProfilePendingView = () => (
    <div className="space-y-8 py-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-semibold text-yellow-900">Your host profile is under review</p>
            <p className="text-sm text-yellow-800">You can still update your profile and register for the semester</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {isRefreshing ? 'Checking...' : 'Check Status'}
        </Button>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/host/registration">
            <Button variant="outline" icon={Edit}>Edit/Complete Profile</Button>
          </Link>
          <Link to="/host/semester-registration">
            <Button variant="outline" icon={Calendar}>Register for {currentSemester}</Button>
          </Link>
        </div>
      </Card>

      {/* Dashboard grid with timeline and info */}
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
  );

  const renderIncompleteProfileView = () => (
    <div className="space-y-8 py-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Complete your host profile to continue</h2>
        <p className="text-sm text-blue-800">Please provide your organization, role, location, and experience details so students can learn about your site.</p>
        <div className="mt-4">
          <Link to="/host/registration">
            <Button variant="primary" icon={Edit} className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">Complete Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderApprovedNotRegisteredView = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Approved! 🎉</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Great news! Your host profile has been approved. Now you can register for the {currentSemester} semester 
        to start hosting UMD students.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Ready for the next step?</h3>
        <div className="space-y-2 text-left text-green-800">
          <p>✅ <strong>Step 1:</strong> Profile created & approved</p>
          <p>📝 <strong>Step 2:</strong> Register for {currentSemester} semester</p>
          <p>🤝 <strong>Step 3:</strong> Get matched with students</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Link to="/host/semester-registration">
          <Button variant="primary" size="lg" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">
            Register for {currentSemester}
          </Button>
        </Link>
        <Link to="/host/registration">
          <Button variant="outline" icon={Edit}>
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* One-time plus full dashboard layout */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 space-y-6">
          <TimelineCard />
        </div>
        <div className="space-y-6">
          <ProfileSummaryCard />
          <ResourcesCard />
        </div>
      </div>
    </div>
  );

  const renderApprovedBannerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Your host profile is approved</p>
            <p className="text-sm text-green-800">Next: register for {currentSemester} to receive student matches</p>
          </div>
        </div>
        <Link to="/host/semester-registration">
          <Button variant="primary" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">
            Register for {currentSemester}
          </Button>
        </Link>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/host/registration">
            <Button variant="outline" icon={Edit}>Edit Profile</Button>
          </Link>
          <Button variant="outline" icon={RefreshCw} onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Checking...' : 'Refresh Status'}
          </Button>
        </div>
      </Card>

      {/* Full dashboard grid */}
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
  );

  const renderRegisteredView = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-umd-red to-red-600 text-white rounded-xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="text-6xl">{hostData.profileImage}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {hostData.firstName} {hostData.lastName}!
              </h1>
              <div className="flex items-center space-x-4 text-red-100 mb-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>{hostData.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{hostData.jobTitle}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-green-200">Registered for {currentSemester}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <Calendar className="w-8 h-8 text-umd-red mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Semester</h3>
          <p className="text-2xl font-bold text-umd-red">{currentSemester}</p>
        </Card>
        <Card className="text-center p-6">
          <UserCheck className="w-8 h-8 text-umd-gold mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Matches</h3>
          <p className="text-2xl font-bold text-umd-gold">Coming Soon</p>
        </Card>
        <Card className="text-center p-6">
          <FileText className="w-8 h-8 text-umd-black mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
          <p className="text-sm text-gray-600">Wait for student matching</p>
        </Card>
      </div>

      {/* Action Items */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border border-umd-gold/40 bg-umd-gold/10">
                <div className="w-8 h-8 bg-umd-red text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Student Matching (Late October)</h3>
              <p className="text-gray-600">
                We'll match you with UMD students based on their interests and your expertise. 
                You'll be notified via email when matches are available.
              </p>
            </div>
          </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg border border-umd-red/20 bg-umd-red/5">
                <div className="w-8 h-8 bg-umd-red text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Coordinate Experience</h3>
              <p className="text-gray-600">
                Work with matched students to schedule your job shadowing or interview sessions 
                for late October through mid-January 2026.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/host/registration">
          <Button variant="outline" icon={Edit}>
            Edit Profile
          </Button>
        </Link>
        <Button variant="outline" icon={Mail}>
          Contact Support
        </Button>
        <Button variant="outline" icon={Settings}>
          Settings
        </Button>
      </div>
    </div>
  );

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          {profileStatus === 'incomplete' && renderIncompleteProfileView()}
          {profileStatus === 'pending' && renderProfilePendingView()}
          {profileStatus === 'approved' && showOneTimeApproved && registrationStatus === 'not_registered' && renderApprovedNotRegisteredView()}
          {profileStatus === 'approved' && !showOneTimeApproved && registrationStatus === 'not_registered' && renderApprovedBannerDashboard()}
          {profileStatus === 'approved' && registrationStatus === 'registered' && renderRegisteredView()}
        </Card>
      </div>
    </div>
  );
};

export default HostDashboard;