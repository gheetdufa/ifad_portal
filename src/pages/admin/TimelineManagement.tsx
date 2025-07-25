import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Save, RotateCcw, Settings, Clock, RefreshCw, 
  CheckCircle, AlertCircle, Database, ArrowRight, Toggle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { awsTimelineService, type TimelineData } from '../../services/aws-timeline';

const TimelineManagement: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState<TimelineData>({
    semester: 'fall',
    year: 2025,
    hostRegistrationStart: '2025-08-01',
    hostRegistrationEnd: '2025-09-29',
    hostVettingStart: '2025-10-01',
    hostVettingEnd: '2025-10-06',
    studentOrientationStart: '2025-09-22',
    studentOrientationEnd: '2025-10-10',
    studentApplicationStart: '2025-10-16',
    studentApplicationEnd: '2025-10-23',
    matchingStart: '2025-10-28',
    matchingEnd: '2025-11-07',
    experienceStart: '2025-11-01',
    experienceEnd: '2026-01-31',
    surveyStart: '2025-12-01',
    surveyEnd: '2026-01-09'
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [awsConnectionStatus, setAwsConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check AWS connection and load timeline on component mount
  useEffect(() => {
    checkAwsConnection();
    loadTimelineFromAws();
  }, []);

  const checkAwsConnection = async () => {
    setAwsConnectionStatus('checking');
    try {
      const response = await awsTimelineService.checkConnection();
      setAwsConnectionStatus(response.success ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('AWS connection failed:', error);
      setAwsConnectionStatus('disconnected');
    }
  };

  const loadTimelineFromAws = async () => {
    try {
      const response = await awsTimelineService.getActiveTimeline();
      if (response.success && response.data) {
        setActiveTimeline(response.data);
      }
    } catch (error) {
      console.error('Failed to load timeline from AWS:', error);
    }
  };

  const handleDateChange = (field: keyof TimelineData, value: string) => {
    if (field === 'semester' || field === 'year') return; // Handle these separately
    
    setActiveTimeline(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const toggleSemester = () => {
    const newSemester = activeTimeline.semester === 'fall' ? 'spring' : 'fall';
    const newYear = activeTimeline.semester === 'fall' 
      ? activeTimeline.year + 1 
      : activeTimeline.year;

    // Generate default dates based on semester
    const defaultDates = generateDefaultDates(newSemester, newYear);
    
    setActiveTimeline({
      ...activeTimeline,
      semester: newSemester,
      year: newYear,
      ...defaultDates
    });
    setHasUnsavedChanges(true);
  };

  const generateDefaultDates = (semester: 'fall' | 'spring', year: number) => {
    if (semester === 'fall') {
      return {
        hostRegistrationStart: `${year}-08-01`,
        hostRegistrationEnd: `${year}-09-29`,
        hostVettingStart: `${year}-10-01`,
        hostVettingEnd: `${year}-10-06`,
        studentOrientationStart: `${year}-09-22`,
        studentOrientationEnd: `${year}-10-10`,
        studentApplicationStart: `${year}-10-16`,
        studentApplicationEnd: `${year}-10-23`,
        matchingStart: `${year}-10-28`,
        matchingEnd: `${year}-11-07`,
        experienceStart: `${year}-11-01`,
        experienceEnd: `${year + 1}-01-31`,
        surveyStart: `${year}-12-01`,
        surveyEnd: `${year + 1}-01-09`
      };
    } else {
      return {
        hostRegistrationStart: `${year - 1}-12-01`,
        hostRegistrationEnd: `${year}-02-28`,
        hostVettingStart: `${year}-03-01`,
        hostVettingEnd: `${year}-03-07`,
        studentOrientationStart: `${year}-02-15`,
        studentOrientationEnd: `${year}-03-05`,
        studentApplicationStart: `${year}-03-08`,
        studentApplicationEnd: `${year}-03-15`,
        matchingStart: `${year}-03-18`,
        matchingEnd: `${year}-03-25`,
        experienceStart: `${year}-03-15`,
        experienceEnd: `${year}-05-15`,
        surveyStart: `${year}-04-15`,
        surveyEnd: `${year}-06-01`
      };
    }
  };

  const saveToAws = async () => {
    if (awsConnectionStatus !== 'connected') {
      alert('AWS connection is not available. Please check your configuration.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await awsTimelineService.saveTimeline(activeTimeline);
      
      if (response.success) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        
        // Publish update notification
        await awsTimelineService.publishTimelineUpdate(response.data!);
        
        alert('Timeline data saved successfully to AWS!');
      } else {
        throw new Error(response.error || 'Failed to save timeline');
      }
    } catch (error) {
      console.error('Failed to save to AWS:', error);
      alert(`Failed to save timeline data to AWS: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    const defaultDates = generateDefaultDates(activeTimeline.semester, activeTimeline.year);
    setActiveTimeline({
      ...activeTimeline,
      ...defaultDates
    });
    setHasUnsavedChanges(true);
  };

  const timelinePhases = [
    {
      title: 'Host Registration',
      startField: 'hostRegistrationStart' as keyof TimelineData,
      endField: 'hostRegistrationEnd' as keyof TimelineData,
      description: 'Period when professionals can register to host students',
      color: 'blue'
    },
    {
      title: 'Host Vetting & Confirmation',
      startField: 'hostVettingStart' as keyof TimelineData,
      endField: 'hostVettingEnd' as keyof TimelineData,
      description: 'Administrative review and confirmation of host applications',
      color: 'purple'
    },
    {
      title: 'Student Orientation',
      startField: 'studentOrientationStart' as keyof TimelineData,
      endField: 'studentOrientationEnd' as keyof TimelineData,
      description: 'Mandatory orientation for participating students',
      color: 'green'
    },
    {
      title: 'Student Applications',
      startField: 'studentApplicationStart' as keyof TimelineData,
      endField: 'studentApplicationEnd' as keyof TimelineData,
      description: 'Period when students can submit applications and rank hosts',
      color: 'orange'
    },
    {
      title: 'Matching Process',
      startField: 'matchingStart' as keyof TimelineData,
      endField: 'matchingEnd' as keyof TimelineData,
      description: 'Administrative matching of students with hosts',
      color: 'red'
    },
    {
      title: 'IFAD Experience',
      startField: 'experienceStart' as keyof TimelineData,
      endField: 'experienceEnd' as keyof TimelineData,
      description: 'Active shadowing and informational interview period',
      color: 'indigo'
    },
    {
      title: 'Survey & Feedback',
      startField: 'surveyStart' as keyof TimelineData,
      endField: 'surveyEnd' as keyof TimelineData,
      description: 'Post-experience feedback collection period',
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-umd-red" />
            <div>
              <h1 className="text-3xl font-bold text-umd-black">Timeline Management</h1>
              <p className="text-lg text-umd-gray-600">Manage IFAD program timeline and AWS integration</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="warning">Unsaved Changes</Badge>
            )}
            <Button variant="outline" icon={RotateCcw} onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button 
              variant="primary" 
              icon={isLoading ? RefreshCw : Save} 
              onClick={saveToAws}
              disabled={isLoading || awsConnectionStatus !== 'connected'}
              className={isLoading ? 'animate-pulse' : ''}
            >
              {isLoading ? 'Saving to AWS...' : 'Save to AWS'}
            </Button>
            <Link to="/admin">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* AWS Connection Status */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-umd-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-umd-black">AWS Integration Status</h3>
              <p className="text-sm text-umd-gray-600">Timeline data synchronization with AWS DynamoDB</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {awsConnectionStatus === 'checking' && (
              <Badge variant="secondary">
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Checking...
              </Badge>
            )}
            {awsConnectionStatus === 'connected' && (
              <Badge variant="success">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            )}
            {awsConnectionStatus === 'disconnected' && (
              <Badge variant="error">
                <AlertCircle className="w-4 h-4 mr-1" />
                Disconnected
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              icon={RefreshCw} 
              onClick={checkAwsConnection}
            >
              Test Connection
            </Button>
          </div>
        </div>
        {lastSaved && (
          <div className="mt-4 text-sm text-umd-gray-600">
            Last saved to AWS: {lastSaved.toLocaleString()}
          </div>
        )}
      </Card>

      {/* Semester Toggle */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-umd-black mb-2">Current Program Semester</h3>
            <p className="text-umd-gray-600">Toggle between Fall and Spring semester configurations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-umd-black">
                {activeTimeline.semester.charAt(0).toUpperCase() + activeTimeline.semester.slice(1)} {activeTimeline.year}
              </div>
              <div className="text-sm text-umd-gray-600">
                {activeTimeline.semester === 'fall' ? 'Academic Year ' + activeTimeline.year + '-' + (activeTimeline.year + 1) : 'Academic Year ' + (activeTimeline.year - 1) + '-' + activeTimeline.year}
              </div>
            </div>
            <Button 
              variant="primary" 
              icon={Toggle} 
              onClick={toggleSemester}
              className="px-6 py-3"
            >
              Switch to {activeTimeline.semester === 'fall' ? 'Spring ' + (activeTimeline.year + 1) : 'Fall ' + activeTimeline.year}
            </Button>
          </div>
        </div>
      </Card>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {timelinePhases.map((phase, index) => (
          <Card key={phase.title} className={`${getColorClasses(phase.color)} border-2`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{phase.title}</h3>
                  <p className="text-sm opacity-75">{phase.description}</p>
                </div>
              </div>
              <Clock className="w-5 h-5 opacity-60" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={activeTimeline[phase.startField] as string}
                  onChange={(e) => handleDateChange(phase.startField, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent bg-white"
                />
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 opacity-40" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={activeTimeline[phase.endField] as string}
                  onChange={(e) => handleDateChange(phase.endField, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent bg-white"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Panel */}
      {hasUnsavedChanges && (
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Unsaved Changes</h3>
                <p className="text-sm text-yellow-700">You have unsaved changes to the timeline. Save to AWS to apply these changes.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={resetToDefaults}>
                Discard Changes
              </Button>
              <Button 
                variant="primary" 
                icon={Save} 
                onClick={saveToAws}
                disabled={awsConnectionStatus !== 'connected'}
              >
                Save to AWS
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TimelineManagement;