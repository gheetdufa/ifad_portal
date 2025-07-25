import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, Filter, Eye, CheckCircle, XCircle, Mail, Download, Upload,
  Edit3, Building, Star, Clock, TrendingUp
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const HostManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHosts, setSelectedHosts] = useState<number[]>([]);

  // Mock host data - in production, this would come from API
  const hosts = [
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
      notes: 'Excellent mentor, very responsive to communications.'
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
      notes: 'New host - awaiting background verification.'
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
      notes: 'Top-rated host, provides excellent industry insights.'
    },
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
      notes: 'Has not responded to recent communications. May need follow-up.'
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
      notes: 'Company policy prevents external shadowing programs.'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Hosts', count: hosts.length },
    { value: 'verified', label: 'Verified', count: hosts.filter(h => h.status === 'verified').length },
    { value: 'pending', label: 'Pending Review', count: hosts.filter(h => h.status === 'pending').length },
    { value: 'inactive', label: 'Inactive', count: hosts.filter(h => h.status === 'inactive').length },
    { value: 'rejected', label: 'Rejected', count: hosts.filter(h => h.status === 'rejected').length }
  ];

  const filteredHosts = hosts.filter(host => {
    const matchesFilter = selectedFilter === 'all' || host.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
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

  const handleSelectHost = (hostId: number) => {
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
      setSelectedHosts(filteredHosts.map(h => h.id));
    }
  };

  const totalCapacity = hosts.filter(h => h.status === 'verified').reduce((sum, h) => sum + h.maxStudents, 0);
  const totalActive = hosts.filter(h => h.status === 'verified').length;
  const averageRating = hosts.filter(h => h.rating).reduce((sum, h, _, arr) => sum + (h.rating || 0) / arr.length, 0);

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
                onClick={() => setSelectedFilter(option.value)}
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
                <Button variant="outline" size="sm" icon={Mail}>Send Email</Button>
                <Button variant="outline" size="sm" icon={CheckCircle}>Bulk Approve</Button>
                <Button variant="outline" size="sm" icon={XCircle}>Bulk Reject</Button>
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
                      checked={selectedHosts.includes(host.id)}
                      onChange={() => handleSelectHost(host.id)}
                      className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-umd-red text-white rounded-full flex items-center justify-center font-medium">
                        {host.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-umd-black">{host.name}</p>
                        <p className="text-sm text-umd-gray-600">{host.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm text-umd-black">{host.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">{host.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(host.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">
                      {host.studentsHosted}/{host.maxStudents}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {host.rating ? (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-umd-gold fill-current" />
                        <span className="text-sm text-umd-black">{host.rating}</span>
                        <span className="text-xs text-umd-gray-500">({host.reviews})</span>
                      </div>
                    ) : (
                      <span className="text-sm text-umd-gray-500">No reviews</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">{host.registeredDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" icon={Eye}>View</Button>
                      <Button variant="outline" size="sm" icon={Edit3}>Edit</Button>
                      {host.status === 'pending' && (
                        <>
                          <Button variant="success" size="sm" icon={CheckCircle}>Approve</Button>
                          <Button variant="error" size="sm" icon={XCircle}>Reject</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-umd-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-umd-gray-600 mb-2">No hosts found</h3>
            <p className="text-umd-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HostManagement;