import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Send, Users, FileText, Settings, Clock, CheckCircle,
  Edit3, Eye, Trash2, Copy, Filter, Search, Calendar,
  MessageSquare, Bell, Archive, Star, Paperclip
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Mock email campaign data
  const emailCampaigns = [
    {
      id: 1,
      name: 'Host Registration Reminder',
      subject: 'Last Call: IFAD Spring 2025 Host Registration',
      type: 'reminder',
      recipients: 245,
      sent: 245,
      opened: 178,
      clicked: 45,
      status: 'sent',
      sentDate: '2024-11-15',
      template: 'host-reminder'
    },
    {
      id: 2,
      name: 'Student Orientation Invitation',
      subject: 'IFAD Spring 2025: Mandatory Orientation Sessions',
      type: 'invitation',
      recipients: 234,
      sent: 234,
      opened: 198,
      clicked: 156,
      status: 'sent',
      sentDate: '2024-10-28',
      template: 'student-orientation'
    },
    {
      id: 3,
      name: 'Match Notification - Students',
      subject: 'Your IFAD Host Match is Here!',
      type: 'notification',
      recipients: 123,
      sent: 0,
      opened: 0,
      clicked: 0,
      status: 'draft',
      sentDate: null,
      template: 'match-notification'
    },
    {
      id: 4,
      name: 'Welcome New Hosts',
      subject: 'Welcome to IFAD Spring 2025!',
      type: 'welcome',
      recipients: 45,
      sent: 45,
      opened: 42,
      clicked: 38,
      status: 'sent',
      sentDate: '2024-09-15',
      template: 'host-welcome'
    }
  ];

  const emailTemplates = [
    {
      id: 'host-reminder',
      name: 'Host Registration Reminder',
      category: 'Host Communications',
      subject: 'Reminder: IFAD Host Registration Deadline Approaching',
      lastModified: '2024-11-10',
      usage: 15,
      status: 'active'
    },
    {
      id: 'student-orientation',
      name: 'Student Orientation Invitation',
      category: 'Student Communications',
      subject: 'IFAD Orientation: Your Next Step to Professional Experience',
      lastModified: '2024-10-25',
      usage: 8,
      status: 'active'
    },
    {
      id: 'match-notification',
      name: 'Match Notification',
      category: 'Matching Communications',
      subject: 'Your IFAD Match is Ready!',
      lastModified: '2024-10-30',
      usage: 0,
      status: 'draft'
    },
    {
      id: 'host-welcome',
      name: 'Host Welcome Email',
      category: 'Host Communications',
      subject: 'Welcome to IFAD - Next Steps',
      lastModified: '2024-09-10',
      usage: 25,
      status: 'active'
    },
    {
      id: 'experience-survey',
      name: 'Experience Survey Request',
      category: 'Survey Communications',
      subject: 'Share Your IFAD Experience - Survey Inside',
      lastModified: '2024-12-01',
      usage: 0,
      status: 'draft'
    }
  ];

  const quickActions = [
    {
      id: 'remind-hosts',
      title: 'Send Host Reminder',
      description: 'Remind pending hosts to complete registration',
      recipients: 23,
      template: 'host-reminder',
      priority: 'high'
    },
    {
      id: 'orientation-followup',
      title: 'Orientation Follow-up',
      description: 'Follow up with students who missed orientation',
      recipients: 12,
      template: 'student-orientation',
      priority: 'medium'
    },
    {
      id: 'match-notifications',
      title: 'Send Match Notifications',
      description: 'Notify students and hosts of their matches',
      recipients: 246,
      template: 'match-notification',
      priority: 'high'
    },
    {
      id: 'survey-requests',
      title: 'Experience Surveys',
      description: 'Send post-experience survey to completed matches',
      recipients: 78,
      template: 'experience-survey',
      priority: 'low'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="success">Sent</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge variant="warning">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, sent: number) => {
    if (sent === 0) return 0;
    return ((clicked / sent) * 100).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Communication Center</h1>
              <p className="text-lg text-umd-gray-600">Manage emails, templates, and communications</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="primary" icon={Send}>Compose Email</Button>
            <Button variant="outline" icon={Settings}>Email Settings</Button>
            <Link to="/admin">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'quick-actions', label: 'Quick Actions', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: Clock }
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
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-umd-black">{emailCampaigns.length}</p>
                  <p className="text-sm text-blue-600">This semester</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">Emails Sent</p>
                  <p className="text-2xl font-bold text-umd-black">
                    {emailCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)}
                  </p>
                  <p className="text-sm text-green-600">All campaigns</p>
                </div>
                <Send className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-umd-black">
                    {(emailCampaigns.reduce((sum, campaign) => 
                      sum + (campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0), 0
                    ) / emailCampaigns.filter(c => c.sent > 0).length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-umd-gold">Above industry avg</p>
                </div>
                <Eye className="w-8 h-8 text-umd-gold" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-umd-gray-600">Avg Click Rate</p>
                  <p className="text-2xl font-bold text-umd-black">
                    {(emailCampaigns.reduce((sum, campaign) => 
                      sum + (campaign.sent > 0 ? (campaign.clicked / campaign.sent) * 100 : 0), 0
                    ) / emailCampaigns.filter(c => c.sent > 0).length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-purple-600">Strong engagement</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Campaign List */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-umd-black">Email Campaigns</h2>
              <div className="flex space-x-2">
                <Button variant="outline" icon={Filter}>Filter</Button>
                <Button variant="primary" icon={Send}>New Campaign</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-umd-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Campaign</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Recipients</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Open Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Click Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Sent Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-umd-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-umd-gray-100 hover:bg-umd-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-umd-black">{campaign.name}</p>
                          <p className="text-sm text-umd-gray-600">{campaign.subject}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" size="sm">{campaign.type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-black">{campaign.recipients}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-black">
                          {calculateOpenRate(campaign.opened, campaign.sent)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-black">
                          {calculateClickRate(campaign.clicked, campaign.sent)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-umd-gray-600">
                          {campaign.sentDate || 'Not sent'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" icon={Eye}>View</Button>
                          {campaign.status === 'draft' && (
                            <Button variant="outline" size="sm" icon={Edit3}>Edit</Button>
                          )}
                          <Button variant="outline" size="sm" icon={Copy}>Clone</Button>
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

      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Template Management */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-umd-black">Email Templates</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umd-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="pl-10 pr-4 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <Button variant="primary" icon={FileText}>New Template</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-umd-black">{template.name}</h3>
                        <p className="text-sm text-umd-gray-600">{template.category}</p>
                      </div>
                      {getStatusBadge(template.status)}
                    </div>
                    
                    <div className="p-3 bg-umd-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-umd-gray-800">Subject:</p>
                      <p className="text-sm text-umd-gray-600">{template.subject}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-umd-gray-500">
                      <span>Used {template.usage} times</span>
                      <span>Modified {template.lastModified}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" icon={Eye} className="flex-1">Preview</Button>
                      <Button variant="outline" size="sm" icon={Edit3} className="flex-1">Edit</Button>
                      <Button variant="outline" size="sm" icon={Copy}>Clone</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'quick-actions' && (
        <div className="space-y-6">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-umd-black">{action.title}</h3>
                        <Badge 
                          variant={action.priority === 'high' ? 'error' : action.priority === 'medium' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-umd-gray-600">{action.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Recipients:</span>
                      <span className="font-medium text-blue-800">{action.recipients}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-blue-800">Template:</span>
                      <span className="text-sm text-blue-600">{action.template}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="primary" size="sm" icon={Send} className="flex-1">
                      Send Now
                    </Button>
                    <Button variant="outline" size="sm" icon={Calendar}>Schedule</Button>
                    <Button variant="outline" size="sm" icon={Eye}>Preview</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-medium text-umd-black mb-4">Email Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Delivery Rate</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Open Rate</span>
                  <span className="font-medium text-blue-600">72.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Click Rate</span>
                  <span className="font-medium text-purple-600">25.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Unsubscribe Rate</span>
                  <span className="font-medium text-red-600">0.3%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-medium text-umd-black mb-4">Best Performing</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Highest Open Rate</p>
                  <p className="text-xs text-green-600">Student Orientation (84.6%)</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Highest Click Rate</p>
                  <p className="text-xs text-blue-600">Host Welcome (84.4%)</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Most Engaged</p>
                  <p className="text-xs text-purple-600">Match Notifications</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-medium text-umd-black mb-4">Engagement Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">This Week</span>
                  <span className="text-sm text-green-600">↑ 12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">This Month</span>
                  <span className="text-sm text-green-600">↑ 8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Peak Hours</span>
                  <span className="text-sm text-umd-black">9-11 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-umd-gray-600">Best Day</span>
                  <span className="text-sm text-umd-black">Tuesday</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;