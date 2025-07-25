import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Download, Users, Target, Star,
  FileText, Eye, Mail, ChevronDown, ChevronUp, Globe
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Mock analytics data
  const programMetrics = {
    current: {
      totalHosts: 127,
      totalStudents: 234,
      totalMatches: 123,
      completionRate: 89,
      satisfactionScore: 4.6,
      industryDiversity: 15,
      geographicReach: 8
    },
    previous: {
      totalHosts: 115,
      totalStudents: 198,
      totalMatches: 98,
      completionRate: 85,
      satisfactionScore: 4.4,
      industryDiversity: 12,
      geographicReach: 6
    }
  };

  const industryBreakdown = [
    { industry: 'Technology', hosts: 32, students: 68, matches: 45, percentage: 36.6 },
    { industry: 'Finance', hosts: 28, students: 52, matches: 35, percentage: 28.5 },
    { industry: 'Healthcare', hosts: 18, students: 31, matches: 18, percentage: 14.6 },
    { industry: 'Consulting', hosts: 15, students: 29, matches: 15, percentage: 12.2 },
    { industry: 'Marketing', hosts: 12, students: 22, matches: 10, percentage: 8.1 }
  ];

  const geographicData = [
    { location: 'Washington DC Metro', hosts: 45, students: 89, matches: 67 },
    { location: 'Baltimore, MD', hosts: 28, students: 52, matches: 28 },
    { location: 'New York, NY', hosts: 22, students: 38, matches: 15 },
    { location: 'Northern Virginia', hosts: 18, students: 31, matches: 8 },
    { location: 'Other', hosts: 14, students: 24, matches: 5 }
  ];

  const timelineData = [
    { phase: 'Host Registration', planned: 120, actual: 127, startDate: '08/01', endDate: '09/29' },
    { phase: 'Student Applications', planned: 200, actual: 234, startDate: '09/29', endDate: '10/13' },
    { phase: 'Manual Matching', planned: 50, actual: 45, startDate: '10/21', endDate: '10/24' },
    { phase: 'Automated Matching', planned: 80, actual: 78, startDate: '10/27', endDate: '10/31' },
    { phase: 'Experience Period', planned: 130, actual: 123, startDate: '11/01', endDate: '12/15' }
  ];

  const satisfactionData = [
    { category: 'Overall Experience', students: 4.7, hosts: 4.5 },
    { category: 'Communication', students: 4.6, hosts: 4.6 },
    { category: 'Learning Value', students: 4.8, hosts: 4.3 },
    { category: 'Organization', students: 4.4, hosts: 4.7 },
    { category: 'Support', students: 4.5, hosts: 4.4 }
  ];

  const reports = [
    {
      id: 'program-overview',
      title: 'Program Overview Report',
      description: 'Comprehensive summary of current program status and key metrics',
      type: 'Executive Summary',
      lastUpdated: '2 hours ago',
      status: 'current'
    },
    {
      id: 'matching-analysis',
      title: 'Matching Algorithm Analysis',
      description: 'Detailed analysis of matching success rates and algorithm performance',
      type: 'Technical Report',
      lastUpdated: '1 day ago',
      status: 'current'
    },
    {
      id: 'satisfaction-survey',
      title: 'Satisfaction Survey Results',
      description: 'Analysis of student and host feedback from completed experiences',
      type: 'Survey Analysis',
      lastUpdated: '3 days ago',
      status: 'current'
    },
    {
      id: 'industry-trends',
      title: 'Industry Participation Trends',
      description: 'Trends in industry participation and host diversity over time',
      type: 'Trend Analysis',
      lastUpdated: '1 week ago',
      status: 'current'
    },
    {
      id: 'geographic-reach',
      title: 'Geographic Reach Report',
      description: 'Analysis of geographic distribution of hosts and student placements',
      type: 'Geographic Analysis',
      lastUpdated: '1 week ago',
      status: 'current'
    }
  ];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous * 100);
    return {
      value: Math.abs(change).toFixed(1),
      positive: change >= 0
    };
  };

  const getStatusColor = (planned: number, actual: number) => {
    const percentage = (actual / planned) * 100;
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Reports & Analytics</h1>
              <p className="text-lg text-umd-gray-600">Program insights and performance metrics</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
            >
              <option value="current">Spring 2025</option>
              <option value="previous">Fall 2024</option>
              <option value="comparison">Compare Periods</option>
            </select>
            <Button variant="outline" icon={Download}>Export All</Button>
            <Link to="/admin">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Participation',
            value: programMetrics.current.totalHosts + programMetrics.current.totalStudents,
            previous: programMetrics.previous.totalHosts + programMetrics.previous.totalStudents,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            label: 'Match Success Rate',
            value: `${(programMetrics.current.totalMatches / programMetrics.current.totalStudents * 100).toFixed(1)}%`,
            previous: (programMetrics.previous.totalMatches / programMetrics.previous.totalStudents * 100),
            icon: Target,
            color: 'text-green-600'
          },
          {
            label: 'Satisfaction Score',
            value: programMetrics.current.satisfactionScore.toFixed(1),
            previous: programMetrics.previous.satisfactionScore,
            icon: Star,
            color: 'text-umd-gold'
          },
          {
            label: 'Industry Diversity',
            value: programMetrics.current.industryDiversity,
            previous: programMetrics.previous.industryDiversity,
            icon: Globe,
            color: 'text-purple-600'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          const change = typeof metric.previous === 'number' ? 
            calculateChange(
              typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value,
              metric.previous
            ) : null;
          
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-umd-black">{metric.value}</p>
                  {change && (
                    <p className={`text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {change.positive ? '+' : '-'}{change.value}% from previous
                    </p>
                  )}
                </div>
                <Icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-umd-black">Industry Participation</h2>
            <Button variant="outline" size="sm" icon={Download}>Export</Button>
          </div>
          <div className="space-y-4">
            {industryBreakdown.map((industry, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-umd-black">{industry.industry}</span>
                  <span className="text-sm text-umd-gray-600">{industry.matches} matches</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-umd-gray-200 rounded-full h-2">
                    <div 
                      className="bg-umd-red rounded-full h-2" 
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-umd-black w-12">
                    {industry.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-umd-gray-500">
                  <span>{industry.hosts} hosts</span>
                  <span>{industry.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-umd-black">Geographic Reach</h2>
            <Button variant="outline" size="sm" icon={Download}>Export</Button>
          </div>
          <div className="space-y-4">
            {geographicData.map((location, index) => (
              <div key={index} className="p-4 border border-umd-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-umd-black">{location.location}</span>
                  <Badge variant="primary">{location.matches} matches</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-umd-gray-600">
                  <div className="text-center">
                    <div className="font-medium text-umd-black">{location.hosts}</div>
                    <div>Hosts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-umd-black">{location.students}</div>
                    <div>Students</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-umd-black">
                      {(location.matches / location.students * 100).toFixed(0)}%
                    </div>
                    <div>Match Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline Performance */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-umd-black">Timeline Performance</h2>
            <Button variant="outline" size="sm" icon={Download}>Export</Button>
          </div>
          <div className="space-y-4">
            {timelineData.map((phase, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-umd-black">{phase.phase}</span>
                  <span className="text-sm text-umd-gray-600">
                    {phase.startDate} - {phase.endDate}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-umd-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${
                        phase.actual >= phase.planned ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((phase.actual / phase.planned) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(phase.planned, phase.actual)}`}>
                    {phase.actual}/{phase.planned}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Satisfaction Scores */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-umd-black">Satisfaction Scores</h2>
            <Button variant="outline" size="sm" icon={Download}>Export</Button>
          </div>
          <div className="space-y-4">
            {satisfactionData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-umd-black">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-umd-gold fill-current" />
                    <span className="text-sm text-umd-gray-600">
                      Avg: {((category.students + category.hosts) / 2).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm text-blue-800">Students</span>
                    <span className="font-medium text-blue-800">{category.students.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-800">Hosts</span>
                    <span className="font-medium text-green-800">{category.hosts.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Report Library */}
      <Card className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-umd-black">Report Library</h2>
          <Button variant="primary" icon={FileText}>Generate Custom Report</Button>
        </div>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-umd-gray-200 rounded-lg">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-umd-gray-50"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-umd-red text-white rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-umd-black">{report.title}</h3>
                    <p className="text-sm text-umd-gray-600">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="secondary" size="sm">{report.type}</Badge>
                      <span className="text-xs text-umd-gray-500">Updated {report.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" icon={Eye}>View</Button>
                  <Button variant="outline" size="sm" icon={Download}>Download</Button>
                  {expandedReport === report.id ? (
                    <ChevronUp className="w-5 h-5 text-umd-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-umd-gray-400" />
                  )}
                </div>
              </div>
              {expandedReport === report.id && (
                <div className="px-4 pb-4 border-t border-umd-gray-200">
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" size="sm" icon={Download}>PDF</Button>
                    <Button variant="outline" size="sm" icon={Download}>Excel</Button>
                    <Button variant="outline" size="sm" icon={Mail}>Email Report</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;