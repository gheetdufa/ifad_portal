import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCheck, FileText, BarChart3, Settings, TrendingUp, CheckCircle, 
  Clock, Mail, Database, Download, Upload, Shield, Target,
  Play, Pause, RotateCcw, Loader2, RefreshCw, AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AwsStatusChecker from '../../components/admin/AwsStatusChecker';
import AdminNotifications from '../../components/admin/AdminNotifications';
import { apiService, DashboardStats, RecentActivity } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Data fetching functions
  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const [statsResponse, activityResponse] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getRecentActivity()
      ]);

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      } else {
        setError(statsResponse.message || 'Failed to load dashboard stats');
      }

      if (activityResponse.success) {
        setRecentActivity(activityResponse.data);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getQuickStats = () => {
    if (!dashboardStats) return [];
    
    // Use safe property access with fallbacks to match our backend response
    const totalHosts = dashboardStats.totalHosts || 0;
    const pendingHosts = dashboardStats.pendingHosts || 0;
    const approvedHosts = dashboardStats.approvedHosts || 0;
    const totalStudents = dashboardStats.totalStudents || 0;
    const totalApplications = dashboardStats.totalApplications || 0;

    return [
      { 
        label: 'Total Hosts', 
        value: totalHosts.toString(), 
        change: totalHosts > 0 ? 'Registered' : 'No hosts yet', 
        icon: Users,
        color: 'text-blue-600',
      },
      { 
        label: 'Pending Review', 
        value: pendingHosts.toString(), 
        change: pendingHosts > 0 ? 'Need attention' : 'All reviewed', 
        icon: Clock,
        color: 'text-orange-600',
      },
      { 
        label: 'Approved Hosts', 
        value: approvedHosts.toString(), 
        change: approvedHosts > 0 ? 'Ready to host' : 'None approved yet', 
        icon: CheckCircle,
        color: 'text-green-600',
      },
      { 
        label: 'Students', 
        value: totalStudents.toString(), 
        change: totalStudents > 0 ? 'Registered' : 'No students yet', 
        icon: Target,
        color: 'text-umd-red',
      },
    ];
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-umd-red" />
            <h1 className="text-3xl font-bold text-umd-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <AdminNotifications />
            {lastRefresh && (
              <span className="text-sm text-umd-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              icon={isRefreshing ? Loader2 : RefreshCw}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>
        <p className="text-lg text-umd-gray-600">
          Manage the IFAD program and monitor key metrics
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </div>

      {/* AWS Status Checker */}
      <div className="mb-8">
        <AwsStatusChecker />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-umd-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-umd-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-umd-gray-200 rounded w-24"></div>
                </div>
                <div className="w-8 h-8 bg-umd-gray-200 rounded"></div>
              </div>
            </Card>
          ))
        ) : (
          getQuickStats().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-umd-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-umd-black group-hover:text-umd-red transition-colors duration-300">{stat.value}</p>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </Card>
            );
          })
        )}
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
                          <Badge variant="error" size="sm">{dashboardStats?.pendingHosts || 0} pending</Badge>
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
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center p-3 bg-umd-gray-50 rounded-lg">
                    <div className="h-8 bg-umd-gray-200 rounded w-8 mx-auto mb-2"></div>
                    <div className="h-3 bg-umd-gray-200 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-umd-black">{dashboardStats?.verifiedHosts || 0}</p>
                  <p className="text-xs text-umd-gray-600">Verified Hosts</p>
                </div>
                <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-umd-black">{dashboardStats?.completedOrientations || 0}</p>
                  <p className="text-xs text-umd-gray-600">Orientations</p>
                </div>
                <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-umd-black">{dashboardStats?.submittedApplications || 0}</p>
                  <p className="text-xs text-umd-gray-600">Applications</p>
                </div>
                <div className="text-center p-3 bg-umd-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-umd-black">{dashboardStats?.totalMatches || 0}</p>
                  <p className="text-xs text-umd-gray-600">Matches</p>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-umd-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" icon={Users} className="w-full justify-start">
                <Link to="/admin/hosts">Manage Hosts</Link>
              </Button>
              <Button variant="outline" icon={FileText} className="w-full justify-start">
                <Link to="/admin/applications">Student Applications</Link>
              </Button>
              <Button variant="outline" icon={UserCheck} className="w-full justify-start">
                <Link to="/admin/matching">Run Matching</Link>
              </Button>
              <Button variant="outline" icon={BarChart3} className="w-full justify-start">
                <Link to="/admin/reports">Reports & Analytics</Link>
              </Button>
              <Button variant="outline" icon={Clock} className="w-full justify-start">
                <Link to="/admin/timeline">Timeline Management</Link>
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
              {isLoading ? (
                // Loading skeleton for activities
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 animate-pulse">
                    <div className="w-2 h-2 bg-umd-gray-200 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-umd-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-umd-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-umd-gray-50 rounded">
                    <div className="w-2 h-2 bg-umd-red rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-umd-black">{activity.message}</p>
                      <p className="text-xs text-umd-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-umd-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-umd-gray-500">No recent activity</p>
                  <p className="text-xs text-umd-gray-400">Activity will appear here as users interact with the system</p>
                </div>
              )}
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