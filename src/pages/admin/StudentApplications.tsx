import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Search, Filter, Eye, CheckCircle, XCircle, Download, Upload,
  GraduationCap, Star, Clock, Mail, Award, BookOpen, Target
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const StudentApplications: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);

  // Mock student application data
  const applications = [
    {
      id: 1,
      studentName: 'Emily Chen',
      email: 'emily.chen@umd.edu',
      phone: '(301) 555-0123',
      major: 'Computer Science',
      graduationYear: 2025,
      gpa: 3.85,
      status: 'submitted',
      submittedDate: '2024-10-15',
      preferredHosts: ['Microsoft', 'Google', 'Apple'],
      experience: ['Software Development Intern at Startup', 'CS Research Assistant'],
      skills: ['Python', 'Java', 'React', 'Machine Learning'],
      careerGoals: 'Software Engineering at a tech company',
      whyIFAD: 'Want to gain industry experience and network with professionals',
      availability: 'Nov 15 - Dec 15, 2024',
      transportation: 'Has car',
      previousIFAD: false,
      rating: 4.2,
      notes: 'Strong technical background, excellent communication skills'
    },
    {
      id: 2,
      studentName: 'Marcus Johnson',
      email: 'marcus.j@umd.edu',
      phone: '(240) 555-0456',
      major: 'Business Administration',
      graduationYear: 2026,
      gpa: 3.72,
      status: 'matched',
      submittedDate: '2024-10-12',
      matchedHost: 'Goldman Sachs - David Kim',
      preferredHosts: ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley'],
      experience: ['Finance Club President', 'Investment Banking Workshop'],
      skills: ['Financial Analysis', 'Excel', 'Bloomberg Terminal', 'Python'],
      careerGoals: 'Investment Banking Analyst',
      whyIFAD: 'Hands-on experience in financial services industry',
      availability: 'Nov 20 - Dec 20, 2024',
      transportation: 'Public transit',
      previousIFAD: false,
      rating: 4.5,
      notes: 'High achiever, strong interest in finance'
    },
    {
      id: 3,
      studentName: 'Sofia Rodriguez',
      email: 'sofia.r@umd.edu',
      phone: '(202) 555-0789',
      major: 'Marketing',
      graduationYear: 2025,
      gpa: 3.91,
      status: 'under_review',
      submittedDate: '2024-10-18',
      preferredHosts: ['Nike', 'Coca-Cola', 'P&G'],
      experience: ['Marketing Agency Intern', 'Social Media Manager for Student Org'],
      skills: ['Digital Marketing', 'Adobe Creative Suite', 'Analytics', 'Content Creation'],
      careerGoals: 'Brand Manager at consumer goods company',
      whyIFAD: 'Learn about brand strategy and consumer insights',
      availability: 'Nov 10 - Dec 10, 2024',
      transportation: 'Has car',
      previousIFAD: true,
      rating: 4.7,
      notes: 'Previous IFAD participant, excellent portfolio'
    },
    {
      id: 4,
      studentName: 'Alex Park',
      email: 'alex.park@umd.edu',
      phone: '(410) 555-0321',
      major: 'Data Science',
      graduationYear: 2025,
      gpa: 3.68,
      status: 'waitlisted',
      submittedDate: '2024-10-20',
      preferredHosts: ['Tesla', 'Netflix', 'Airbnb'],
      experience: ['Data Analytics Intern', 'Machine Learning Research'],
      skills: ['Python', 'R', 'SQL', 'Tableau', 'TensorFlow'],
      careerGoals: 'Data Scientist in tech industry',
      whyIFAD: 'Experience with real-world data problems',
      availability: 'Nov 25 - Dec 25, 2024',
      transportation: 'Public transit',
      previousIFAD: false,
      rating: 3.9,
      notes: 'Strong technical skills, needs to improve presentation skills'
    },
    {
      id: 5,
      studentName: 'Rachel Kim',
      email: 'rachel.kim@umd.edu',
      phone: '(443) 555-0654',
      major: 'Information Systems',
      graduationYear: 2026,
      gpa: 3.95,
      status: 'rejected',
      submittedDate: '2024-10-08',
      preferredHosts: ['Deloitte', 'Accenture', 'McKinsey'],
      experience: ['IT Consulting Project', 'Systems Analysis Intern'],
      skills: ['Project Management', 'SQL', 'Business Analysis', 'Agile'],
      careerGoals: 'IT Consultant',
      whyIFAD: 'Understand consulting industry and client work',
      availability: 'Nov 5 - Dec 5, 2024',
      transportation: 'Has car',
      previousIFAD: false,
      rating: 4.8,
      notes: 'Applied too late for this cycle, encourage for next semester'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Applications', count: applications.length },
    { value: 'submitted', label: 'Submitted', count: applications.filter(a => a.status === 'submitted').length },
    { value: 'under_review', label: 'Under Review', count: applications.filter(a => a.status === 'under_review').length },
    { value: 'matched', label: 'Matched', count: applications.filter(a => a.status === 'matched').length },
    { value: 'waitlisted', label: 'Waitlisted', count: applications.filter(a => a.status === 'waitlisted').length },
    { value: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesFilter = selectedFilter === 'all' || app.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="primary">Submitted</Badge>;
      case 'under_review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'matched':
        return <Badge variant="success">Matched</Badge>;
      case 'waitlisted':
        return <Badge variant="secondary">Waitlisted</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSelectApplication = (appId: number) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(a => a.id));
    }
  };

  const averageGPA = applications.reduce((sum, app) => sum + app.gpa, 0) / applications.length;
  const totalMatched = applications.filter(a => a.status === 'matched').length;
  const matchRate = (totalMatched / applications.length * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Student Applications</h1>
              <p className="text-lg text-umd-gray-600">Review and manage student applications</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" icon={Download}>Export Applications</Button>
            <Button variant="outline" icon={Upload}>Import Data</Button>
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
              <p className="text-sm text-umd-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-umd-black">{applications.length}</p>
              <p className="text-sm text-blue-600">+15% from last cycle</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Match Rate</p>
              <p className="text-2xl font-bold text-umd-black">{matchRate}%</p>
              <p className="text-sm text-green-600">Above target</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Average GPA</p>
              <p className="text-2xl font-bold text-umd-black">{averageGPA.toFixed(2)}</p>
              <p className="text-sm text-umd-gold">High achievers</p>
            </div>
            <Award className="w-8 h-8 text-umd-gold" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-umd-black">
                {applications.filter(a => a.status === 'under_review').length}
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
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
              />
            </div>
            <Button variant="outline" icon={Filter}>Advanced Filter</Button>
          </div>
        </div>
        
        {selectedApplications.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected
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

      {/* Application List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-umd-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Major</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">GPA</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Top Preferences</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Submitted</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b border-umd-gray-100 hover:bg-umd-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleSelectApplication(app.id)}
                      className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-umd-red text-white rounded-full flex items-center justify-center font-medium">
                        {app.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-umd-black">{app.studentName}</p>
                        <p className="text-sm text-umd-gray-600">{app.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <GraduationCap className="w-3 h-3 text-umd-gray-400" />
                          <span className="text-xs text-umd-gray-500">Class of {app.graduationYear}</span>
                          {app.previousIFAD && (
                            <Badge variant="secondary" size="sm">Returning</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-umd-gray-400" />
                      <span className="text-sm text-umd-black">{app.major}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${getGPAColor(app.gpa)}`}>
                      {app.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(app.status)}
                    {app.status === 'matched' && app.matchedHost && (
                      <p className="text-xs text-green-600 mt-1">{app.matchedHost}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {app.preferredHosts.slice(0, 2).map((host, index) => (
                        <div key={index} className="text-xs text-umd-gray-600">
                          {index + 1}. {host}
                        </div>
                      ))}
                      {app.preferredHosts.length > 2 && (
                        <div className="text-xs text-umd-gray-400">
                          +{app.preferredHosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-umd-gold fill-current" />
                      <span className="text-sm text-umd-black">{app.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">{app.submittedDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" icon={Eye}>View</Button>
                      {app.status === 'under_review' && (
                        <>
                          <Button variant="success" size="sm" icon={CheckCircle}>Approve</Button>
                          <Button variant="error" size="sm" icon={XCircle}>Reject</Button>
                        </>
                      )}
                      {app.status === 'submitted' && (
                        <Button variant="warning" size="sm">Review</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-umd-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-umd-gray-600 mb-2">No applications found</h3>
            <p className="text-umd-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentApplications;