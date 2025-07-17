import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCheck, FileText, BarChart3, Settings, TrendingUp, CheckCircle, 
  Clock, Mail, Database, Download, Upload, Shield, Target,
  Play, Pause, RotateCcw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const AdminDashboard: React.FC = () => {
  // const [currentStep, setCurrentStep] = useState('step2b'); // Current active step - unused

  // Mock admin data - in production, this would come from API
  const programStats = {
    totalHosts: 127,
    verifiedHosts: 89,
    pendingHosts: 8,
    totalStudents: 234,
    completedOrientations: 189,
    submittedApplications: 156,
    totalMatches: 78,
    completedExperiences: 12,
  };

  // IFAD Workflow Steps
  const workflowSteps = [
    {
      id: 'step1',
      title: 'Prep & Plan',
      period: 'May - August',
      status: 'completed',
      items: [
        'Submit marketing and communication request for IFAD',
        'Create HS Links for IFAD Orientation, Student Applications & Final Matched',
        'Update Marketing Graphics & Webpages',
        'Update Email Template for Info Sharing & Recruitment',
        'Update IFAD Timeline & Division of Responsibilities',
        'Update IFAD Google Calendar & Room Reservations'
      ]
    },
    {
      id: 'step2a',
      title: 'Host Registration Prep',
      period: 'Aug 1 - Sept 29',
      status: 'completed',
      items: [
        'Prep the Host Registration Form (Qualtrics)',
        'Start from last semester\'s version',
        'Update language, dates, and "number of students willing to host"',
        'Test the host registration form before going live'
      ]
    },
    {
      id: 'step2b',
      title: 'Host Registration & Recruitment',
      period: 'Aug 1 - Sept 29, 2025',
      status: 'current',
      items: [
        'Open Registration & Send Host Outreach Emails',
        'Use IFAD alumni/host list, ERE internship listserv, and UCC contacts',
        'LinkedIn Post & Share (UCC)',
        'Monitor Responses Weekly',
        'Schedule email reminders & send gentle nudges',
        'Review & vet hosts'
      ]
    },
    {
      id: 'step2c',
      title: 'Host Vetting & Host List',
      period: 'Sept 16 - Oct 3, 2025',
      status: 'upcoming',
      items: [
        'Vet New Hosts: Google them, check their org site, or LinkedIn',
        'Track & Compile Host Registration',
        'Track Responses Weekly & Vet (NO commas, apostrophes, dashes)',
        'Keep org names consistent',
        'Confirm Host Participation',
        'Build Final Host List (for Students)'
      ]
    },
    {
      id: 'step3',
      title: 'Student Recruitment & Participation',
      period: 'Sept 29 - Oct 13',
      status: 'upcoming',
      items: [
        'Student Mandatory Orientation',
        'Update Online Orientation & Request Open Enrollment',
        'Schedule and run 1-2 in-person orientation sessions',
        'IFAD Student Recruitment (Email & Outreach)',
        'IFAD Student Application',
        'Close student application & verify student status'
      ]
    },
    {
      id: 'step4',
      title: 'Student-Host Matching',
      period: 'Oct 21 - Nov 10',
      status: 'upcoming',
      items: [
        'Export student application raw data',
        'Send raw data to IFAD tech lead to identify popular hosts',
        'Manually match students to popular hosts (Oct 23-24)',
        'Create CSV files for matching',
        'Run Python matching algorithm for automated matches (Oct 27-28)',
        'Send matching emails to students and hosts via Brevo (Oct 29-31)'
      ]
    },
    {
      id: 'step3b',
      title: 'Unmatched & Round II',
      period: 'Oct 31 - Nov 7',
      status: 'upcoming',
      items: [
        'Create Google Form for unmatched hosts and students for Round II',
        'Run Round II matching, either manually or via Python',
        'Notify matched and unmatched hosts and students by Nov 10',
        'Send thank you emails to hosts'
      ]
    },
    {
      id: 'step5',
      title: 'Experience Survey & Wrap-up',
      period: 'Dec 1 - Jan 26',
      status: 'upcoming',
      items: [
        'Send host and student experience surveys on December 1',
        'Close surveys by Jan 9, 2026',
        'Begin host survey analysis and data compilation on Jan 12',
        'Complete survey analysis and prepare summary report by Jan 26',
        'Draft and send thank you notes to hosts and partners',
        'Share success stories and key data with marketing and campus teams'
      ]
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'host_registration',
      message: 'New host registered: Sarah Johnson (Microsoft)',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'application_submitted',
      message: '5 new student applications submitted',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      type: 'host_verified',
      message: 'Host verified: David Kim (Goldman Sachs)',
      timestamp: '6 hours ago',
    },
    {
      id: 4,
      type: 'match_completed',
      message: 'Manual matching completed: 12 new matches',
      timestamp: '1 day ago',
    },
  ];

  const quickStats = [
    { 
      label: 'Total Hosts', 
      value: programStats.totalHosts.toString(), 
      change: '+12%', 
      icon: Users,
      color: 'text-blue-600',
    },
    { 
      label: 'Applications', 
      value: programStats.submittedApplications.toString(), 
      change: '+23%', 
      icon: FileText,
      color: 'text-green-600',
    },
    { 
      label: 'Matches Made', 
      value: programStats.totalMatches.toString(), 
      change: '+18%', 
      icon: UserCheck,
      color: 'text-purple-600',
    },
    { 
      label: 'Completion Rate', 
      value: '89%', 
      change: '+5%', 
      icon: TrendingUp,
      color: 'text-umd-red',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Play className="w-5 h-5 text-umd-red" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-umd-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-umd-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-umd-red bg-red-50';
      case 'upcoming':
        return 'border-umd-gray-200 bg-umd-gray-50';
      default:
        return 'border-umd-gray-200 bg-umd-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-umd-red" />
          <h1 className="text-3xl font-bold text-umd-black">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-umd-gray-600">
          Manage the IFAD program and monitor key metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-umd-black group-hover:text-umd-red transition-colors duration-300">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium`}>
                    {stat.change} from last cycle
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* IFAD Workflow Management */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-umd-black">IFAD Workflow Management</h2>
              <Badge variant="primary">Spring 2025</Badge>
            </div>
            
            <div className="space-y-4">
              {workflowSteps.map((step) => (
                <div key={step.id} className={`border-2 rounded-lg p-4 ${getStatusColor(step.status)} transition-all duration-300 hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <h3 className="font-semibold text-umd-black">{step.title}</h3>
                        <p className="text-sm text-umd-gray-600">{step.period}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {step.status === 'current' && (
                        <>
                          <Button variant="outline" size="sm" icon={Pause}>
                            Pause
                          </Button>
                          <Button variant="primary" size="sm">
                            Manage
                          </Button>
                        </>
                      )}
                      {step.status === 'upcoming' && (
                        <Button variant="outline" size="sm" icon={Play}>
                          Start
                        </Button>
                      )}
                      {step.status === 'completed' && (
                        <Button variant="outline" size="sm" icon={RotateCcw}>
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-600' : 
                          step.status === 'current' ? 'bg-umd-red' : 'bg-umd-gray-300'
                        }`}></div>
                        <span className="text-sm text-umd-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  {step.status === 'current' && (
                    <div className="mt-4 p-3 bg-white rounded border border-umd-red">
                      <h4 className="font-medium text-umd-black mb-2">Priority Actions:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-umd-gray-700">Review pending hosts</span>
                          <Badge variant="error" size="sm">{programStats.pendingHosts} pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-umd-gray-700">Send reminder emails</span>
                          <Button variant="outline" size="sm" icon={Mail}>Send</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Matching Tools - Hand Matching First */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-umd-black mb-6">Matching Tools</h2>
            <div className="space-y-4">
              <div className="p-4 border-2 border-umd-red bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-umd-red" />
                    <div>
                      <h3 className="font-semibold text-umd-black">Manual Matching (Priority)</h3>
                      <p className="text-sm text-umd-gray-600">Hand-match students to popular hosts first</p>
                    </div>
                  </div>
                  <Badge variant="error">Step 1</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="primary" size="sm" icon={Download}>
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" icon={Users}>
                    Popular Hosts
                  </Button>
                  <Button variant="outline" size="sm" icon={Target}>
                    Manual Match
                  </Button>
                  <Button variant="outline" size="sm" icon={Database}>
                    Save Matches
                  </Button>
                </div>
              </div>

              <div className="p-4 border-2 border-umd-gold bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-umd-gold" />
                    <div>
                      <h3 className="font-semibold text-umd-black">Automated Matching</h3>
                      <p className="text-sm text-umd-gray-600">Run Python algorithm for remaining matches</p>
                    </div>
                  </div>
                  <Badge variant="warning">Step 2</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="secondary" size="sm" icon={Upload}>
                    Load CSV
                  </Button>
                  <Button variant="outline" size="sm" icon={Settings}>
                    Algorithm
                  </Button>
                  <Button variant="outline" size="sm" icon={Play}>
                    Run Matching
                  </Button>
                  <Button variant="outline" size="sm" icon={Mail}>
                    Send Emails
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Overview */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-umd-black mb-4">Program Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-umd-black">{programStats.verifiedHosts}</p>
                <p className="text-xs text-umd-gray-600">Verified Hosts</p>
              </div>
              <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-umd-black">{programStats.completedOrientations}</p>
                <p className="text-xs text-umd-gray-600">Orientations</p>
              </div>
              <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-umd-black">{programStats.submittedApplications}</p>
                <p className="text-xs text-umd-gray-600">Applications</p>
              </div>
              <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-umd-black">{programStats.totalMatches}</p>
                <p className="text-xs text-umd-gray-600">Matches</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-umd-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" icon={Users} className="w-full justify-start">
                <Link to="/admin/hosts">Manage Hosts</Link>
              </Button>
              <Button variant="outline" icon={FileText} className="w-full justify-start">
                <Link to="/admin/students">Student Applications</Link>
              </Button>
              <Button variant="outline" icon={UserCheck} className="w-full justify-start">
                <Link to="/admin/matching">Run Matching</Link>
              </Button>
              <Button variant="outline" icon={BarChart3} className="w-full justify-start">
                <Link to="/admin/reports">Reports & Analytics</Link>
              </Button>
              <Button variant="outline" icon={Mail} className="w-full justify-start">
                <Link to="/admin/communication">Send Communications</Link>
              </Button>
              <Button variant="outline" icon={Settings} className="w-full justify-start">
                <Link to="/admin/settings">System Settings</Link>
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-umd-black mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-umd-gray-50 rounded">
                  <div className="w-2 h-2 bg-umd-red rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-umd-black">{activity.message}</p>
                    <p className="text-xs text-umd-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Status */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-umd-black mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-umd-gray-600">Host Registration</span>
                <Badge variant="success" size="sm">Open</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-umd-gray-600">Student Applications</span>
                <Badge variant="warning" size="sm">Opening Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-umd-gray-600">Matching System</span>
                <Badge variant="primary" size="sm">Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-umd-gray-600">Email System</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;