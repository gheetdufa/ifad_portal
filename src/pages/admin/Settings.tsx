import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Save, RotateCcw, Eye, EyeOff,
  Calendar, Users, Mail, Database, Shield, Globe,
  Bell, AlertTriangle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      programName: 'IFAD Spring 2025',
      semester: 'Spring 2025',
      academicYear: '2024-2025',
      coordinatorName: 'Dr. Sarah Williams',
      coordinatorEmail: 'swilliams@umd.edu',
      departmentName: 'Career & Professional Development',
      maxStudentsPerHost: 3,
      programDuration: '6 weeks'
    },
    timeline: {
      hostRegistrationStart: '2024-08-01',
      hostRegistrationEnd: '2024-09-29',
      studentApplicationStart: '2024-09-29',
      studentApplicationEnd: '2024-10-13',
      matchingStart: '2024-10-21',
      matchingEnd: '2024-10-31',
      experienceStart: '2024-11-01',
      experienceEnd: '2024-12-15',
      surveyStart: '2024-12-01',
      surveyEnd: '2025-01-09'
    },
    notifications: {
      emailNotifications: true,
      hostReminders: true,
      studentReminders: true,
      matchNotifications: true,
      reminderFrequency: 'weekly',
      escalationEmails: true,
      adminNotifications: true
    },
    integrations: {
      casAuthentication: true,
      casServerUrl: 'https://shib.umd.edu/idp/shibboleth',
      emailService: 'brevo',
      emailAPIKey: 'xkeysib-****-****-****-********',
      databaseBackup: true,
      backupFrequency: 'daily',
      dataRetentionPeriod: '7 years'
    },
    matching: {
      algorithmType: 'weighted',
      preferenceWeight: 40,
      skillsWeight: 25,
      careerGoalsWeight: 20,
      gpaWeight: 10,
      experienceWeight: 5,
      geographicPreference: true,
      transportationMatching: true,
      capacityRespecting: true,
      manualOverride: true
    },
    security: {
      sessionTimeout: 60,
      passwordPolicy: 'strong',
      twoFactorAuth: false,
      auditLogging: true,
      dataEncryption: true,
      accessControlEnabled: true,
      ipWhitelisting: false,
      rateLimiting: true
    }
  });

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'timeline', label: 'Program Timeline', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'matching', label: 'Matching Algorithm', icon: Users },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleInputChange = (section: string, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    setHasUnsavedChanges(false);
    // Show success toast
  };

  const handleReset = () => {
    // Reset to last saved state
    setHasUnsavedChanges(false);
    // Show reset toast
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">System Settings</h1>
              <p className="text-lg text-umd-gray-600">Configure IFAD program settings and preferences</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="warning">Unsaved Changes</Badge>
            )}
            <Button variant="outline" icon={RotateCcw} onClick={handleReset}>Reset</Button>
            <Button variant="primary" icon={Save} onClick={handleSave}>Save Changes</Button>
            <Link to="/admin">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-medium text-umd-black mb-4">Settings Categories</h3>
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-umd-red text-white'
                        : 'text-umd-gray-700 hover:bg-umd-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'general' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Program Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.programName}
                    onChange={(e) => handleInputChange('general', 'programName', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={settings.general.semester}
                    onChange={(e) => handleInputChange('general', 'semester', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  >
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Summer 2024">Summer 2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={settings.general.academicYear}
                    onChange={(e) => handleInputChange('general', 'academicYear', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Program Duration
                  </label>
                  <input
                    type="text"
                    value={settings.general.programDuration}
                    onChange={(e) => handleInputChange('general', 'programDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Coordinator Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.coordinatorName}
                    onChange={(e) => handleInputChange('general', 'coordinatorName', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Coordinator Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.coordinatorEmail}
                    onChange={(e) => handleInputChange('general', 'coordinatorEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.departmentName}
                    onChange={(e) => handleInputChange('general', 'departmentName', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Max Students Per Host
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.general.maxStudentsPerHost}
                    onChange={(e) => handleInputChange('general', 'maxStudentsPerHost', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'timeline' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">Program Timeline</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Host Registration Start
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.hostRegistrationStart}
                      onChange={(e) => handleInputChange('timeline', 'hostRegistrationStart', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Host Registration End
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.hostRegistrationEnd}
                      onChange={(e) => handleInputChange('timeline', 'hostRegistrationEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Student Application Start
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.studentApplicationStart}
                      onChange={(e) => handleInputChange('timeline', 'studentApplicationStart', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Student Application End
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.studentApplicationEnd}
                      onChange={(e) => handleInputChange('timeline', 'studentApplicationEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Matching Period Start
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.matchingStart}
                      onChange={(e) => handleInputChange('timeline', 'matchingStart', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Matching Period End
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.matchingEnd}
                      onChange={(e) => handleInputChange('timeline', 'matchingEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Experience Period Start
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.experienceStart}
                      onChange={(e) => handleInputChange('timeline', 'experienceStart', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Experience Period End
                    </label>
                    <input
                      type="date"
                      value={settings.timeline.experienceEnd}
                      onChange={(e) => handleInputChange('timeline', 'experienceEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">Notification Settings</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Enable Email Notifications', description: 'Send automated emails for program events' },
                    { key: 'hostReminders', label: 'Host Reminder Emails', description: 'Send reminders to hosts for registration and deadlines' },
                    { key: 'studentReminders', label: 'Student Reminder Emails', description: 'Send reminders to students for applications and deadlines' },
                    { key: 'matchNotifications', label: 'Match Notifications', description: 'Notify users when matches are made' },
                    { key: 'escalationEmails', label: 'Escalation Emails', description: 'Send urgent notifications to administrators' },
                    { key: 'adminNotifications', label: 'Admin Notifications', description: 'Receive notifications about system events' }
                  ].map(setting => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-umd-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-umd-black">{setting.label}</h3>
                        <p className="text-sm text-umd-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications[setting.key as keyof typeof settings.notifications] as boolean}
                          onChange={(e) => handleInputChange('notifications', setting.key, e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-umd-red/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-umd-red"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Reminder Frequency
                  </label>
                  <select
                    value={settings.notifications.reminderFrequency}
                    onChange={(e) => handleInputChange('notifications', 'reminderFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'integrations' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">System Integrations</h2>
              <div className="space-y-6">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-800">CAS Authentication</h3>
                    <Badge variant={settings.integrations.casAuthentication ? 'success' : 'error'}>
                      {settings.integrations.casAuthentication ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      CAS Server URL
                    </label>
                    <input
                      type="url"
                      value={settings.integrations.casServerUrl}
                      onChange={(e) => handleInputChange('integrations', 'casServerUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={settings.integrations.casAuthentication}
                      onChange={(e) => handleInputChange('integrations', 'casAuthentication', e.target.checked)}
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-blue-700">Enable CAS Authentication</span>
                  </label>
                </div>

                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-800">Email Service (Brevo)</h3>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      API Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showAPIKey ? 'text' : 'password'}
                        value={settings.integrations.emailAPIKey}
                        onChange={(e) => handleInputChange('integrations', 'emailAPIKey', e.target.value)}
                        className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon={showAPIKey ? EyeOff : Eye}
                        onClick={() => setShowAPIKey(!showAPIKey)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Database className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-purple-800">Database Backup</h3>
                    <Badge variant={settings.integrations.databaseBackup ? 'success' : 'warning'}>
                      {settings.integrations.databaseBackup ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.integrations.backupFrequency}
                        onChange={(e) => handleInputChange('integrations', 'backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Data Retention Period
                      </label>
                      <select
                        value={settings.integrations.dataRetentionPeriod}
                        onChange={(e) => handleInputChange('integrations', 'dataRetentionPeriod', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="1 year">1 Year</option>
                        <option value="3 years">3 Years</option>
                        <option value="5 years">5 Years</option>
                        <option value="7 years">7 Years</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={settings.integrations.databaseBackup}
                      onChange={(e) => handleInputChange('integrations', 'databaseBackup', e.target.checked)}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" 
                    />
                    <span className="text-sm text-purple-700">Enable Automated Backups</span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'matching' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">Matching Algorithm Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                    Algorithm Type
                  </label>
                  <select
                    value={settings.matching.algorithmType}
                    onChange={(e) => handleInputChange('matching', 'algorithmType', e.target.value)}
                    className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                  >
                    <option value="weighted">Weighted Scoring</option>
                    <option value="preference">Preference-Based</option>
                    <option value="hybrid">Hybrid Approach</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-medium text-umd-black mb-4">Algorithm Weights</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'preferenceWeight', label: 'Host Preference', max: 100 },
                      { key: 'skillsWeight', label: 'Skills Match', max: 100 },
                      { key: 'careerGoalsWeight', label: 'Career Goals', max: 100 },
                      { key: 'gpaWeight', label: 'GPA', max: 100 },
                      { key: 'experienceWeight', label: 'Previous Experience', max: 100 }
                    ].map(weight => (
                      <div key={weight.key}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-umd-gray-700">
                            {weight.label}
                          </label>
                          <span className="text-sm font-medium text-umd-black">
                            {settings.matching[weight.key as keyof typeof settings.matching]}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={weight.max}
                          value={settings.matching[weight.key as keyof typeof settings.matching] as number}
                          onChange={(e) => handleInputChange('matching', weight.key, parseInt(e.target.value))}
                          className="w-full h-2 bg-umd-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-umd-black mb-4">Matching Constraints</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'geographicPreference', label: 'Geographic Preference', description: 'Consider location when matching' },
                      { key: 'transportationMatching', label: 'Transportation Matching', description: 'Match based on transportation needs' },
                      { key: 'capacityRespecting', label: 'Respect Host Capacity', description: 'Never exceed host maximum students' },
                      { key: 'manualOverride', label: 'Allow Manual Override', description: 'Permit manual changes to algorithm matches' }
                    ].map(constraint => (
                      <div key={constraint.key} className="flex items-center justify-between p-4 border border-umd-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-umd-black">{constraint.label}</h4>
                          <p className="text-sm text-umd-gray-600">{constraint.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.matching[constraint.key as keyof typeof settings.matching] as boolean}
                            onChange={(e) => handleInputChange('matching', constraint.key, e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-umd-red/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-umd-red"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h2 className="text-xl font-semibold text-umd-black mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">Security Notice</h3>
                  </div>
                  <p className="text-sm text-red-700">
                    Changes to security settings may affect user access. Please review carefully before saving.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umd-gray-700 mb-2">
                      Password Policy
                    </label>
                    <select
                      value={settings.security.passwordPolicy}
                      onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
                      className="w-full px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    >
                      <option value="basic">Basic (8+ characters)</option>
                      <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
                      <option value="complex">Complex (16+ chars, symbols required)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Require 2FA for admin accounts' },
                    { key: 'auditLogging', label: 'Audit Logging', description: 'Log all admin actions and system events' },
                    { key: 'dataEncryption', label: 'Data Encryption', description: 'Encrypt sensitive data at rest' },
                    { key: 'accessControlEnabled', label: 'Access Control', description: 'Enforce role-based access control' },
                    { key: 'ipWhitelisting', label: 'IP Whitelisting', description: 'Restrict admin access to specific IP addresses' },
                    { key: 'rateLimiting', label: 'Rate Limiting', description: 'Limit API requests to prevent abuse' }
                  ].map(setting => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-umd-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-umd-black">{setting.label}</h4>
                        <p className="text-sm text-umd-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.security[setting.key as keyof typeof settings.security] as boolean}
                          onChange={(e) => handleInputChange('security', setting.key, e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-umd-red/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-umd-red"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;