import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, User, Search, Filter, Eye, CheckCircle, XCircle, Mail, Download, Upload,
  Edit3, Building, Briefcase, Star, Clock, TrendingUp, MessageSquare,
  Phone, Globe, MapPin, FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AdminNotifications from '../../components/admin/AdminNotifications';
import { apiService } from '../../services/api';

const HostManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hosts, setHosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load hosts from API
  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async (append = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get hosts from backend with filters and pagination
      const response = await apiService.getHosts({
        status: selectedFilter as any,
        lastKey: append ? lastKey || undefined : undefined,
        limit: 25,
      });
      
      if (response.success) {
        const newHosts = response.data.hosts || [];
        setHosts(prev => append ? [...prev, ...newHosts] : newHosts);
        const nextKey = (response.data as any).lastEvaluatedKey || null;
        setLastKey(nextKey);
        setHasMore(!!nextKey);
      } else {
        setError(response.message || 'Failed to load hosts');
        // Fallback to empty array if API fails
        setHosts([]);
      }
    } catch (err) {
      console.error('Error loading hosts:', err);
      setError('Failed to load hosts');
      setHosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Use real data from backend API only
  const displayHosts = hosts;

  const mockHosts = [ // This is kept only for reference, not used
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      email: 'sarah.johnson@microsoft.com',
      phone: '(206) 555-0123',
      status: 'verified',
      registeredDate: '2024-08-15',
      lastActive: '2024-11-20',
      studentsHosted: 3,
      maxStudents: 2,
      experience: ['Software Development', 'Cloud Computing', 'AI/ML'],
      rating: 4.8,
      reviews: 12,
      website: 'https://microsoft.com',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      notes: 'Excellent mentor, very responsive to communications.',
      registrationData: {
        organizationDescription: 'Microsoft is a multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
        experienceDescription: 'Students will shadow me during product planning meetings, code reviews, and team collaboration sessions. They will gain insights into software development lifecycle, agile methodologies, and cloud computing technologies.',
        careerFields: ['Software Development', 'Cloud Computing', 'AI/ML'],
        opportunityType: 'in-person',
        requiresCitizenship: false,
        requiresBackgroundCheck: false,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    },
    {
      id: 2,
      name: 'David Kim',
      title: 'Investment Banking Associate',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      email: 'david.kim@gs.com',
      phone: '(212) 555-0456',
      status: 'pending',
      registeredDate: '2024-11-18',
      lastActive: '2024-11-18',
      studentsHosted: 0,
      maxStudents: 1,
      experience: ['Investment Banking', 'Financial Analysis', 'Client Relations'],
      rating: null,
      reviews: 0,
      website: 'https://goldmansachs.com',
      linkedin: 'https://linkedin.com/in/davidkim',
      notes: 'New host - awaiting background verification.',
      registrationData: {
        organizationDescription: 'Goldman Sachs is a leading global investment banking, securities and investment management firm.',
        experienceDescription: 'Students will observe client meetings, financial modeling sessions, and market analysis. They will learn about investment strategies, risk assessment, and client relationship management.',
        careerFields: ['Investment Banking', 'Financial Analysis', 'Client Relations'],
        opportunityType: 'virtual',
        requiresCitizenship: true,
        requiresBackgroundCheck: true,
        availableDays: ['Monday', 'Wednesday', 'Friday']
      }
    },
    {
      id: 3,
      name: 'Maria Garcia',
      title: 'Marketing Director',
      company: 'Nike',
      location: 'Portland, OR',
      email: 'maria.garcia@nike.com',
      phone: '(503) 555-0789',
      status: 'verified',
      registeredDate: '2024-09-03',
      lastActive: '2024-11-19',
      studentsHosted: 5,
      maxStudents: 3,
      experience: ['Brand Marketing', 'Digital Strategy', 'Consumer Research'],
      rating: 4.9,
      reviews: 8,
      website: 'https://nike.com',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      notes: 'Top-rated host, provides excellent industry insights.',
      registrationData: {
        organizationDescription: 'Nike is a multinational corporation engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.',
        experienceDescription: 'Students will participate in brand strategy sessions, campaign development meetings, and consumer research reviews. They will gain insights into brand management, digital marketing, and consumer behavior analysis.',
        careerFields: ['Brand Marketing', 'Digital Strategy', 'Consumer Research'],
        opportunityType: 'in-person',
        requiresCitizenship: false,
        requiresBackgroundCheck: false,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday']
      }
    }
  ];

  // Display only real data from backend

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">⚠️ Error loading hosts</div>
          <p className="text-umd-gray-600 mb-4">{error}</p>
          <Button onClick={loadHosts}>Retry</Button>
        </Card>
      </div>
    );
  }

  const mockHosts2 = [
    {
      id: 4,
      name: 'John Chen',
      title: 'Data Scientist',
      company: 'Tesla',
      location: 'Austin, TX',
      email: 'john.chen@tesla.com',
      phone: '(512) 555-0321',
      status: 'inactive',
      registeredDate: '2024-07-12',
      lastActive: '2024-10-15',
      studentsHosted: 2,
      maxStudents: 2,
      experience: ['Data Science', 'Machine Learning', 'Analytics'],
      rating: 4.5,
      reviews: 6,
      website: 'https://tesla.com',
      linkedin: 'https://linkedin.com/in/johnchen',
      notes: 'Has not responded to recent communications. May need follow-up.',
      registrationData: {
        organizationDescription: 'Tesla is an electric vehicle and clean energy company focused on accelerating the world\'s transition to sustainable energy.',
        experienceDescription: 'Students will observe data analysis sessions, machine learning model development, and strategic planning meetings. They will learn about automotive analytics, predictive modeling, and sustainable technology implementation.',
        careerFields: ['Data Science', 'Machine Learning', 'Analytics'],
        opportunityType: 'in-person',
        requiresCitizenship: false,
        requiresBackgroundCheck: true,
        availableDays: ['Monday', 'Thursday', 'Friday']
      }
    },
    {
      id: 5,
      name: 'Amanda Wilson',
      title: 'Product Manager',
      company: 'Apple',
      location: 'Cupertino, CA',
      email: 'amanda.wilson@apple.com',
      phone: '(408) 555-0654',
      status: 'rejected',
      registeredDate: '2024-10-28',
      lastActive: '2024-10-28',
      studentsHosted: 0,
      maxStudents: 1,
      experience: ['Product Management', 'UX Research', 'Strategy'],
      rating: null,
      reviews: 0,
      website: 'https://apple.com',
      linkedin: 'https://linkedin.com/in/amandawilson',
      notes: 'Company policy prevents external shadowing programs.',
      registrationData: {
        organizationDescription: 'Apple designs, manufactures, and markets consumer electronics, computer software, and online services.',
        experienceDescription: 'Students would observe product planning sessions, user research activities, and cross-functional team meetings. They would learn about product lifecycle management, user experience design, and strategic planning.',
        careerFields: ['Product Management', 'UX Research', 'Strategy'],
        opportunityType: 'virtual',
        requiresCitizenship: false,
        requiresBackgroundCheck: true,
        availableDays: ['Tuesday', 'Thursday']
      }
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Hosts', count: displayHosts.length },
    { value: 'approved', label: 'Approved', count: displayHosts.filter(h => h.status === 'approved').length },
    { value: 'pending', label: 'Pending Review', count: displayHosts.filter(h => h.status === 'pending').length },
    { value: 'rejected', label: 'Rejected', count: displayHosts.filter(h => h.status === 'rejected').length }
  ];

  const filteredHosts = displayHosts.filter(host => {
    const matchesFilter = selectedFilter === 'all' || host.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      (host.contactName && host.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (host.companyName && host.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (host.location && host.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSelectHost = (hostId: string) => {
    setSelectedHosts(prev => 
      prev.includes(hostId) 
        ? prev.filter(id => id !== hostId)
        : [...prev, hostId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHosts.length === filteredHosts.length) {
      setSelectedHosts([]);
    } else {
      setSelectedHosts(filteredHosts.map(h => String(h.id)));
    }
  };

  const totalCapacity = hosts.filter(h => h.status === 'approved').length * 2; // Assuming 2 students per host
  const totalActive = hosts.filter(h => h.status === 'approved').length;
  const averageRating = 4.5; // Mock rating since our backend doesn't have ratings yet

  // Verification and management functions
  const handleViewHost = (host: any) => {
    setSelectedHost(host);
    setShowDetailModal(true);
  };

  const handleVerifyHost = async (hostId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const response = await apiService.updateHostStatus(hostId.toString(), status);
      if (response.success) {
        alert(`Host ${action}d successfully`);
        // Refresh the hosts data
        await loadHosts();
      } else {
        alert('Failed to update host: ' + response.message);
      }
    } catch (error) {
      console.error('Error processing host verification:', error);
      alert('Failed to process host verification');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'email') => {
    if (selectedHosts.length === 0) return;
    
    setIsProcessing(true);
    try {
      for (const hostId of selectedHosts) {
        if (action === 'approve' || action === 'reject') {
          await handleVerifyHost(hostId, action);
        } else if (action === 'email') {
          // Handle bulk email
          console.log('Sending email to hosts:', selectedHosts);
        }
      }
      setSelectedHosts([]);
      alert(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error('Error processing bulk action:', error);
      alert('Failed to process bulk action');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendNotificationEmail = async (hostId: string, type: 'approved' | 'rejected' | 'request_info') => {
    try {
      // In real implementation, would call email service
      console.log(`Sending ${type} email to host ${hostId}`);
      alert(`${type} email sent successfully`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const handleInlineUpdate = async (host: any, field: string, value: any) => {
    setIsProcessing(true);
    try {
      const response = await apiService.updateHost(String(host.id), { [field]: value });
      if (!response.success) throw new Error(response.message);
      await loadHosts();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update host');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Host Management</h1>
              <p className="text-lg text-umd-gray-600">Manage host registrations and profiles</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <AdminNotifications />
            <Button variant="outline" icon={Download}>Export Data</Button>
            <Button variant="outline" icon={Upload}>Import Hosts</Button>
            <Link to="/admin">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-umd-black">{totalCapacity}</p>
              <p className="text-sm text-green-600">+12% from last cycle</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Active Hosts</p>
              <p className="text-2xl font-bold text-umd-black">{totalActive}</p>
              <p className="text-sm text-blue-600">Ready to host</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-umd-black">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-umd-gold">⭐ Host satisfaction</p>
            </div>
            <Star className="w-8 h-8 text-umd-gold" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-umd-black">
                {hosts.filter(h => h.status === 'pending').length}
              </p>
              <p className="text-sm text-orange-600">Need attention</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={async () => {
                  setSelectedFilter(option.value);
                  setLastKey(null);
                  await loadHosts(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === option.value
                    ? 'bg-umd-red text-white'
                    : 'bg-umd-gray-100 text-umd-gray-700 hover:bg-umd-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umd-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
              />
            </div>
            <Button variant="outline" icon={Filter}>Advanced Filter</Button>
          </div>
        </div>
        
        {selectedHosts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedHosts.length} host{selectedHosts.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={Mail}
                  onClick={() => handleBulkAction('email')}
                  disabled={isProcessing}
                >
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={CheckCircle}
                  onClick={() => handleBulkAction('approve')}
                  disabled={isProcessing}
                  className="hover:bg-green-500 hover:text-white"
                >
                  Bulk Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={XCircle}
                  onClick={() => handleBulkAction('reject')}
                  disabled={isProcessing}
                  className="hover:bg-red-500 hover:text-white"
                >
                  Bulk Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Host List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-umd-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedHosts.length === filteredHosts.length && filteredHosts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Host</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Company</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Registered</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.map((host) => (
                <tr key={host.id} className="border-b border-umd-gray-100 hover:bg-umd-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                        checked={selectedHosts.includes(String(host.id))}
                       onChange={() => handleSelectHost(String(host.id))}
                      className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-umd-red text-white rounded-full flex items-center justify-center font-medium">
                        {host.contactName ? host.contactName.split(' ').map((n: string) => n[0]).join('') : 'H'}
                      </div>
                      <div>
                        <input
                          className="font-medium text-umd-black bg-transparent border-b border-transparent focus:border-umd-red focus:outline-none"
                          defaultValue={host.contactName || 'Unknown'}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val && val !== host.contactName) handleInlineUpdate(host, 'contactName', val);
                          }}
                        />
                        <input
                          className="text-sm text-umd-gray-600 bg-transparent border-b border-transparent focus:border-umd-red focus:outline-none"
                          defaultValue={host.position || ''}
                          placeholder="Title"
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val !== host.position) handleInlineUpdate(host, 'position', val);
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-umd-gray-400" />
                      <input
                        className="text-sm text-umd-black bg-transparent border-b border-transparent focus:border-umd-red focus:outline-none"
                        defaultValue={host.companyName || ''}
                        placeholder="Company"
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val !== host.companyName) handleInlineUpdate(host, 'companyName', val);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="text-sm text-umd-black bg-transparent border-b border-transparent focus:border-umd-red focus:outline-none"
                      defaultValue={host.location || ''}
                      placeholder="Location"
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val !== host.location) handleInlineUpdate(host, 'location', val);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(host.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">
                      0/2
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-gray-500">No reviews</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">{new Date(host.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Eye}
                        onClick={() => handleViewHost(host)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Edit3}
                        onClick={() => {
                          setSelectedHost(host);
                          // In real implementation, would navigate to edit page
                          alert('Edit functionality coming soon');
                        }}
                      >
                        Edit
                      </Button>
                      {host.status === 'pending' && (
                        <>
                          <Button 
                            variant="success" 
                            size="sm" 
                            icon={CheckCircle}
                        onClick={() => handleVerifyHost(String(host.id), 'approve')}
                            disabled={isProcessing}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="error" 
                            size="sm" 
                            icon={XCircle}
                            onClick={() => handleVerifyHost(String(host.id), 'reject')}
                            disabled={isProcessing}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {host.status === 'verified' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Mail}
                        onClick={() => sendNotificationEmail(String(host.id), 'approved')}
                          className="hover:bg-blue-500 hover:text-white"
                        >
                          Contact
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="p-4 flex justify-center">
            <Button variant="outline" onClick={() => loadHosts(true)} disabled={isLoading}>
              Load More
            </Button>
          </div>
        )}
        
        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-umd-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-umd-gray-600 mb-2">No hosts found</h3>
            <p className="text-umd-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>

      {/* Detailed Host View Modal */}
      {showDetailModal && selectedHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-umd-black">Host Details</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-umd-black mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-umd-red" />
                  Personal Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-umd-red text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {(selectedHost.contactName || selectedHost.email || 'H')
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </div>
                    <div>
                      <h4 className="text-lg font-bold text-umd-black">{selectedHost.contactName || selectedHost.email}</h4>
                      <p className="text-umd-gray-600">{selectedHost.position || 'No position'}</p>
                      <div className="flex items-center mt-2">
                        {getStatusBadge(selectedHost.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm">{selectedHost.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm">{selectedHost.phone || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm">{selectedHost.companyName || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm">{selectedHost.location || '—'}</span>
                    </div>
                    {selectedHost.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-umd-gray-400" />
                        <a href={selectedHost.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {selectedHost.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div>
                <h3 className="text-xl font-bold text-umd-black mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-umd-red" />
                  Program Details
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Max Students</label>
                      <p className="text-lg font-bold text-umd-black">{selectedHost.maxStudents}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Students Hosted</label>
                      <p className="text-lg font-bold text-umd-black">{selectedHost.studentsHosted}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Opportunity Type</label>
                      <p className="text-sm font-medium text-umd-black capitalize">{selectedHost.registrationData?.opportunityType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rating</label>
                      <div className="flex items-center space-x-1">
                        {selectedHost.rating ? (
                          <>
                            <Star className="w-4 h-4 text-umd-gold fill-current" />
                            <span className="text-sm font-bold">{selectedHost.rating}</span>
                            <span className="text-xs text-gray-500">({selectedHost.reviews} reviews)</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No reviews yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Career Fields</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedHost.registrationData?.careerFields?.map((field: string, index: number) => (
                        <Badge key={index} variant="secondary">{field}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Available Days</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedHost.registrationData?.availableDays?.map((day: string, index: number) => (
                        <Badge key={index} variant="primary">{day}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Requires Citizenship</label>
                      <p className="text-sm font-medium text-umd-black">
                        {selectedHost.registrationData?.requiresCitizenship ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Background Check</label>
                      <p className="text-sm font-medium text-umd-black">
                        {selectedHost.registrationData?.requiresBackgroundCheck ? 'Required' : 'Not Required'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Description */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-umd-black mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-umd-red" />
                Organization Description
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{selectedHost.registrationData?.organizationDescription}</p>
              </div>
            </div>

            {/* Experience Description */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-umd-black mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-umd-red" />
                Experience Description
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{selectedHost.registrationData?.experienceDescription}</p>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-umd-black mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-umd-red" />
                Admin Notes
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-gray-700">{selectedHost.notes}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {selectedHost.status === 'pending' && (
                <>
                  <Button 
                    variant="success" 
                    icon={CheckCircle}
                    onClick={() => {
                      setShowDetailModal(false);
                      handleVerifyHost(String(selectedHost.id), 'approve');
                    }}
                    disabled={isProcessing}
                  >
                    Approve Host
                  </Button>
                  <Button 
                    variant="error" 
                    icon={XCircle}
                    onClick={() => {
                      setShowDetailModal(false);
                      handleVerifyHost(String(selectedHost.id), 'reject');
                    }}
                    disabled={isProcessing}
                  >
                    Reject Host
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                icon={Mail}
                onClick={() => sendNotificationEmail(String(selectedHost.id), 'approved')}
              >
                Send Email
              </Button>
              <Button 
                variant="outline" 
                icon={Edit3}
                onClick={() => {
                  setShowDetailModal(false);
                  alert('Edit functionality coming soon');
                }}
              >
                Edit Profile
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostManagement;