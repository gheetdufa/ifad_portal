import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, UserCheck, Download, Upload, Play, Settings, BarChart3, 
  AlertTriangle, CheckCircle, Clock, Star, TrendingUp, Mail, Database, Eye, Filter
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MatchingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [matchingStatus] = useState('ready'); // ready, running, completed

  // Mock matching data
  const matchingStats = {
    totalStudents: 156,
    totalHosts: 89,
    manualMatches: 45,
    automaticMatches: 78,
    unmatchedStudents: 33,
    hostCapacityUsed: 123,
    totalHostCapacity: 178,
    popularHosts: 15,
    round1Completed: true,
    round2InProgress: false
  };

  const popularHosts = [
    { name: 'Microsoft - Sarah Johnson', applications: 23, capacity: 2, matches: 2 },
    { name: 'Google - Tech Team', applications: 19, capacity: 3, matches: 3 },
    { name: 'Goldman Sachs - David Kim', applications: 17, capacity: 1, matches: 1 },
    { name: 'Nike - Maria Garcia', applications: 15, capacity: 3, matches: 3 },
    { name: 'Apple - Product Team', applications: 14, capacity: 2, matches: 2 }
  ];

  const recentMatches = [
    {
      id: 1,
      student: 'Emily Chen',
      host: 'Microsoft - Sarah Johnson',
      type: 'manual',
      confidence: 95,
      timestamp: '2 hours ago',
      status: 'confirmed'
    },
    {
      id: 2,
      student: 'Marcus Johnson',
      host: 'Goldman Sachs - David Kim',
      type: 'manual',
      confidence: 92,
      timestamp: '3 hours ago',
      status: 'confirmed'
    },
    {
      id: 3,
      student: 'Alex Park',
      host: 'Tesla - John Chen',
      type: 'automatic',
      confidence: 78,
      timestamp: '1 day ago',
      status: 'pending'
    },
    {
      id: 4,
      student: 'Sofia Rodriguez',
      host: 'Nike - Maria Garcia',
      type: 'automatic',
      confidence: 85,
      timestamp: '1 day ago',
      status: 'confirmed'
    }
  ];

  const algorithmSettings = {
    priorityWeights: {
      hostPreference: 40,
      skillsMatch: 25,
      careerGoals: 20,
      gpa: 10,
      previousExperience: 5
    },
    constraints: {
      maxStudentsPerHost: true,
      geographicPreference: true,
      transportationRequirements: true,
      availabilityOverlap: true
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Matching System</h1>
              <p className="text-lg text-umd-gray-600">Match students with hosts using manual and automated tools</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" icon={Download}>Export Matches</Button>
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
              <p className="text-sm text-umd-gray-600">Total Matches</p>
              <p className="text-2xl font-bold text-umd-black">{matchingStats.manualMatches + matchingStats.automaticMatches}</p>
              <p className="text-sm text-green-600">
                {((matchingStats.manualMatches + matchingStats.automaticMatches) / matchingStats.totalStudents * 100).toFixed(1)}% of students
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Capacity Used</p>
              <p className="text-2xl font-bold text-umd-black">
                {matchingStats.hostCapacityUsed}/{matchingStats.totalHostCapacity}
              </p>
              <p className="text-sm text-blue-600">
                {(matchingStats.hostCapacityUsed / matchingStats.totalHostCapacity * 100).toFixed(1)}% utilized
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Unmatched Students</p>
              <p className="text-2xl font-bold text-umd-black">{matchingStats.unmatchedStudents}</p>
              <p className="text-sm text-orange-600">Need Round 2</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-umd-gray-600">Popular Hosts</p>
              <p className="text-2xl font-bold text-umd-black">{matchingStats.popularHosts}</p>
              <p className="text-sm text-umd-red">High demand</p>
            </div>
            <Star className="w-8 h-8 text-umd-red" />
          </div>
        </Card>
      </div>

      {/* Matching Status Banner */}
      {matchingStats.round1Completed && (
        <Card className="mb-8 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Round 1 Matching Completed</h3>
                <p className="text-sm text-green-600">
                  Manual matching finished. Ready to proceed with automated matching for remaining students.
                </p>
              </div>
            </div>
            <Button variant="success" icon={Play}>Start Round 2</Button>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'manual', label: 'Manual Matching', icon: Target },
          { id: 'automatic', label: 'Automated Matching', icon: BarChart3 },
          { id: 'results', label: 'Match Results', icon: UserCheck },
          { id: 'settings', label: 'Algorithm Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-umd-red text-white'
                  : 'bg-umd-gray-100 text-umd-gray-700 hover:bg-umd-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Matching Tools */}
          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Manual Matching Workflow</h2>
            <div className="space-y-4">
              <div className="p-4 border-2 border-umd-red bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-umd-red text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="font-semibold text-umd-black">Export & Analyze Data</h3>
                </div>
                <p className="text-sm text-umd-gray-600 mb-4">
                  Export student applications and identify popular hosts for manual matching priority.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="primary" size="sm" icon={Download}>Export Student Data</Button>
                  <Button variant="outline" size="sm" icon={BarChart3}>Popular Hosts Report</Button>
                </div>
              </div>

              <div className="p-4 border-2 border-umd-gold bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-umd-gold text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="font-semibold text-umd-black">Manual Match Creation</h3>
                </div>
                <p className="text-sm text-umd-gray-600 mb-4">
                  Manually assign students to popular hosts using CSV templates or direct interface.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="sm" icon={Upload}>Upload CSV Matches</Button>
                  <Button variant="outline" size="sm" icon={Target}>Interactive Matching</Button>
                </div>
              </div>

              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="font-semibold text-umd-black">Verify & Save</h3>
                </div>
                <p className="text-sm text-umd-gray-600 mb-4">
                  Review manual matches and save to the system before proceeding to automated matching.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" icon={Eye}>Review Matches</Button>
                  <Button variant="success" size="sm" icon={Database}>Save to System</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Popular Hosts */}
          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Popular Hosts (Priority Matching)</h2>
            <div className="space-y-4">
              {popularHosts.map((host, index) => (
                <div key={index} className="p-4 border border-umd-gray-200 rounded-lg hover:bg-umd-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-umd-black">{host.name}</h3>
                    <Badge variant={host.matches === host.capacity ? 'success' : 'warning'}>
                      {host.matches}/{host.capacity} filled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-umd-gray-600">
                    <span>{host.applications} applications</span>
                    <Button variant="outline" size="sm">Assign Students</Button>
                  </div>
                  <div className="mt-3 bg-umd-gray-200 rounded-full h-2">
                    <div 
                      className="bg-umd-red rounded-full h-2" 
                      style={{ width: `${(host.matches / host.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'automatic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Automated Matching */}
          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Automated Matching Algorithm</h2>
            <div className="space-y-6">
              <div className="p-4 border border-umd-gray-200 rounded-lg">
                <h3 className="font-medium text-umd-black mb-3">Algorithm Status</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${matchingStatus === 'ready' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-umd-gray-600">Ready to run</span>
                </div>
                <Button variant="primary" icon={Play} className="w-full">
                  Run Automated Matching
                </Button>
              </div>

              <div className="p-4 border border-umd-gray-200 rounded-lg">
                <h3 className="font-medium text-umd-black mb-3">Matching Weights</h3>
                <div className="space-y-3">
                  {Object.entries(algorithmSettings.priorityWeights).map(([key, weight]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-umd-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-umd-gray-200 rounded-full h-2">
                          <div 
                            className="bg-umd-red rounded-full h-2" 
                            style={{ width: `${weight}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-umd-black w-8">{weight}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-umd-gray-200 rounded-lg">
                <h3 className="font-medium text-umd-black mb-3">Constraints</h3>
                <div className="space-y-2">
                  {Object.entries(algorithmSettings.constraints).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-umd-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <Badge variant={enabled ? 'success' : 'secondary'}>
                        {enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Progress & Results */}
          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Matching Progress</h2>
            <div className="space-y-6">
              <div className="text-center p-6 border border-umd-gray-200 rounded-lg">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-umd-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (matchingStats.manualMatches + matchingStats.automaticMatches) / matchingStats.totalStudents)}`}
                      className="text-umd-red"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-umd-black">
                      {Math.round((matchingStats.manualMatches + matchingStats.automaticMatches) / matchingStats.totalStudents * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-umd-gray-600">Students Matched</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Manual Matches</span>
                  </div>
                  <span className="text-sm font-bold text-blue-800">{matchingStats.manualMatches}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Automatic Matches</span>
                  </div>
                  <span className="text-sm font-bold text-green-800">{matchingStats.automaticMatches}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Unmatched</span>
                  </div>
                  <span className="text-sm font-bold text-orange-800">{matchingStats.unmatchedStudents}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-8">
          {/* Recent Matches */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-umd-black">Recent Matches</h2>
              <div className="flex space-x-2">
                <Button variant="outline" icon={Filter}>Filter</Button>
                <Button variant="outline" icon={Download}>Export</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-umd-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Host</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Confidence</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((match) => (
                    <tr key={match.id} className="border-b border-umd-gray-100 hover:bg-umd-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-umd-red text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {match.student.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-umd-black">{match.student}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-black">{match.host}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={match.type === 'manual' ? 'primary' : 'secondary'}>
                          {match.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${getConfidenceColor(match.confidence)}`}>
                          {match.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(match.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-gray-600">{match.timestamp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" icon={Eye}>View</Button>
                          <Button variant="outline" size="sm" icon={Mail}>Email</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Algorithm Configuration</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-umd-black mb-4">Matching Weights</h3>
                <div className="space-y-4">
                  {Object.entries(algorithmSettings.priorityWeights).map(([key, weight]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-umd-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <span className="text-sm font-medium text-umd-black">{weight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={weight}
                        className="w-full h-2 bg-umd-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="primary" className="w-full">Save Configuration</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-umd-black mb-6">Matching Constraints</h2>
            <div className="space-y-4">
              {Object.entries(algorithmSettings.constraints).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-umd-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-umd-black capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h3>
                    <p className="text-sm text-umd-gray-600">
                      {key === 'maxStudentsPerHost' && 'Respect host capacity limits'}
                      {key === 'geographicPreference' && 'Consider location preferences'}
                      {key === 'transportationRequirements' && 'Match transportation needs'}
                      {key === 'availabilityOverlap' && 'Ensure schedule compatibility'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-umd-red/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-umd-red"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MatchingSystem;