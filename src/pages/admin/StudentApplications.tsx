import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Search, Filter, Eye, CheckCircle, XCircle, Download, Upload,
  GraduationCap, Star, Clock, Mail, Award, BookOpen, Target
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { apiService } from '../../services/api';

const StudentApplications: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all'); // status filter
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Load applications
  const loadApplications = async (append = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const resp = await apiService.getAdminApplications({
        semester: selectedSemester || undefined,
        status: selectedFilter as any,
        limit: 25,
        lastKey: append ? lastKey || undefined : undefined,
      });
      if (resp.success) {
        const newItems = resp.data.applications || [];
        setApplications(prev => append ? [...prev, ...newItems] : newItems);
        const nextKey = (resp.data as any).lastEvaluatedKey || null;
        setLastKey(nextKey);
        setHasMore(!!nextKey);
      } else {
        setApplications([]);
        setError(resp.message || 'Failed to load applications');
      }
    } catch (e) {
      console.error('Load applications failed', e);
      setApplications([]);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedSemester]);

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
      (app.studentName && app.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.major && app.major.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const handleSelectApplication = (appId: string) => {
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
      setSelectedApplications(filteredApplications.map(a => String(a.id)));
    }
  };

  const gpaValues = applications.map(a => a.gpa).filter((g: any) => typeof g === 'number');
  const averageGPA = gpaValues.length > 0 ? gpaValues.reduce((s: number, g: number) => s + g, 0) / gpaValues.length : 0;
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
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setLastKey(null);
              }}
              className="px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
            >
              <option value="">All Semesters</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Fall 2024">Fall 2024</option>
            </select>
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
                      checked={selectedApplications.includes(String(app.id))}
                      onChange={() => handleSelectApplication(String(app.id))}
                      className="rounded border-umd-gray-300 text-umd-red focus:ring-umd-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-umd-red text-white rounded-full flex items-center justify-center font-medium">
                        {(app.studentName || 'S').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-umd-black">{app.studentName || app.name || 'Student'}</p>
                        <p className="text-sm text-umd-gray-600">{app.email || '—'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <GraduationCap className="w-3 h-3 text-umd-gray-400" />
                          <span className="text-xs text-umd-gray-500">{app.graduationYear ? `Class of ${app.graduationYear}` : '—'}</span>
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
                      <span className="text-sm text-umd-black">{app.major || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${getGPAColor(app.gpa || 0)}`}>
                      {typeof app.gpa === 'number' ? app.gpa.toFixed(2) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(app.status || 'submitted')}
                    {app.status === 'matched' && app.matchedHost && (
                      <p className="text-xs text-green-600 mt-1">{app.matchedHost}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {(app.preferredHosts || []).slice(0, 2).map((host: string, index: number) => (
                        <div key={index} className="text-xs text-umd-gray-600">
                          {index + 1}. {host}
                        </div>
                      ))}
                      {Array.isArray(app.preferredHosts) && app.preferredHosts.length > 2 && (
                        <div className="text-xs text-umd-gray-400">
                          +{app.preferredHosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-umd-gold fill-current" />
                      <span className="text-sm text-umd-black">{app.rating ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-umd-black">{app.submittedDate || app.createdAt || '—'}</span>
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
        {hasMore && (
          <div className="p-4 flex justify-center">
            <Button variant="outline" onClick={() => loadApplications(true)} disabled={isLoading}>Load More</Button>
          </div>
        )}
        
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