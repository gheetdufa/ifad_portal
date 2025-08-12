import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Building, MapPin, Globe, Save, ArrowLeft, 
  Edit3, Briefcase, Star, FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { PREFERRED_PREFIXES, CAREER_FIELDS, AVAILABLE_DAYS } from '../../types';

const HostProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    preferredPrefix: '',
    firstName: '',
    lastName: '',
    workEmail: '',
    preferredPhone: '',
    organization: '',
    jobTitle: '',
    companyWebsite: '',
    companyAddress: '',
    cityState: '',
    zipCode: '',
    careerFields: [] as string[],
    careerFieldsOther: '',
    opportunityType: 'in-person' as 'in-person' | 'virtual',
    maxStudents: 1,
    availableDays: [] as string[],
    availableWinterSession: false,
    organizationDescription: '',
    experienceDescription: '',
    additionalInfo: '',
    requiresCitizenship: false,
    requiresBackgroundCheck: false,
  });

  // Mock current host data - in production, this would come from API
  const currentHostData = {
    id: 1,
    preferredPrefix: 'Ms.',
    firstName: 'Sarah',
    lastName: 'Johnson',
    workEmail: 'sarah.johnson@microsoft.com',
    preferredPhone: '(206) 555-0123',
    organization: 'Microsoft',
    jobTitle: 'Senior Software Engineer',
    companyWebsite: 'https://microsoft.com',
    companyAddress: '1 Microsoft Way',
    cityState: 'Redmond, WA',
    zipCode: '98052',
    careerFields: ['Software Development', 'Cloud Computing', 'AI/ML'],
    careerFieldsOther: '',
    opportunityType: 'in-person' as const,
    maxStudents: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableWinterSession: true,
    organizationDescription: 'Microsoft is a multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
    experienceDescription: 'Students will shadow me during product planning meetings, code reviews, and team collaboration sessions. They will gain insights into software development lifecycle, agile methodologies, and cloud computing technologies.',
    additionalInfo: 'I prefer to work with students who have some basic programming knowledge.',
    requiresCitizenship: false,
    requiresBackgroundCheck: false,
    verified: true,
    rating: 4.8,
    reviews: 12,
    studentsHosted: 3,
    registeredDate: '2024-08-15',
    lastActive: '2024-11-20',
  };

  useEffect(() => {
    // Initialize edit data with current data
    setEditData(currentHostData);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setEditData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real implementation, would call API to save changes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(currentHostData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/host">
                <Button variant="outline" icon={ArrowLeft}>Back to Dashboard</Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-umd-black">Host Profile</h1>
                <p className="text-lg text-umd-gray-600">Manage your hosting profile and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button 
                  variant="primary" 
                  icon={Edit3}
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="success" 
                    icon={Save}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-umd-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-white font-bold text-2xl">
                    {currentHostData.firstName[0]}{currentHostData.lastName[0]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-umd-black mb-2">
                  {currentHostData.preferredPrefix} {currentHostData.firstName} {currentHostData.lastName}
                </h2>
                <p className="text-umd-gray-600 mb-4">{currentHostData.jobTitle}</p>
                <p className="text-umd-gray-600 mb-6">{currentHostData.organization}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-umd-gray-600">Status</span>
                    <Badge variant="success">Verified Host</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-umd-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-umd-gold fill-current" />
                      <span className="text-sm font-bold">{currentHostData.rating}</span>
                      <span className="text-xs text-umd-gray-500">({currentHostData.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-umd-gray-600">Students Hosted</span>
                    <span className="font-bold text-umd-black">{currentHostData.studentsHosted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-umd-gray-600">Max Capacity</span>
                    <span className="font-bold text-umd-black">{currentHostData.maxStudents}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card>
              <h3 className="text-xl font-bold text-umd-black mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-umd-red" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Prefix</label>
                  {isEditing ? (
                    <select
                      value={editData.preferredPrefix}
                      onChange={(e) => handleInputChange('preferredPrefix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    >
                      <option value="">Select prefix</option>
                      {PREFERRED_PREFIXES.map(prefix => (
                        <option key={prefix} value={prefix}>{prefix}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.preferredPrefix}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-gray-500" />
                    Work Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData.workEmail}
                      onChange={(e) => handleInputChange('workEmail', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.workEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editData.preferredPhone}
                      onChange={(e) => handleInputChange('preferredPhone', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.preferredPhone}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Work Information */}
            <Card>
              <h3 className="text-xl font-bold text-umd-black mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-umd-red" />
                Work Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.organization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.jobTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-gray-500" />
                    Company Website
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={editData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    />
                  ) : (
                    <a href={currentHostData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      {currentHostData.companyWebsite}
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    City, State
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.cityState}
                      onChange={(e) => handleInputChange('cityState', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.cityState}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    />
                  ) : (
                    <p className="text-umd-black font-medium">{currentHostData.companyAddress}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Program Information */}
            <Card>
              <h3 className="text-xl font-bold text-umd-black mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-umd-red" />
                Program Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Fields (up to 5)</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {CAREER_FIELDS.map(field => (
                        <label key={field} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.careerFields.includes(field)}
                            onChange={() => handleMultiSelect('careerFields', field)}
                            disabled={editData.careerFields.length >= 5 && !editData.careerFields.includes(field)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{field}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentHostData.careerFields.map(field => (
                        <Badge key={field} variant="secondary">{field}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
                    {isEditing ? (
                      <select
                        value={editData.opportunityType}
                        onChange={(e) => handleInputChange('opportunityType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                      >
                        <option value="in-person">In-person job shadowing</option>
                        <option value="virtual">Virtual informational interview</option>
                      </select>
                    ) : (
                      <p className="text-umd-black font-medium capitalize">
                        {currentHostData.opportunityType === 'in-person' ? 'In-person job shadowing' : 'Virtual informational interview'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                    {isEditing ? (
                      <select
                        value={editData.maxStudents}
                        onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-umd-black font-medium">{currentHostData.maxStudents}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {AVAILABLE_DAYS.map(day => (
                        <label key={day} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.availableDays.includes(day)}
                            onChange={() => handleMultiSelect('availableDays', day)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentHostData.availableDays.map(day => (
                        <Badge key={day} variant="primary">{day}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Descriptions */}
            <Card>
              <h3 className="text-xl font-bold text-umd-black mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-umd-red" />
                Descriptions
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description</label>
                  {isEditing ? (
                    <textarea
                      value={editData.organizationDescription}
                      onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent resize-none"
                      placeholder="Describe your organization..."
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{currentHostData.organizationDescription}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Description</label>
                  {isEditing ? (
                    <textarea
                      value={editData.experienceDescription}
                      onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent resize-none"
                      placeholder="Describe what students will experience..."
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{currentHostData.experienceDescription}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                  {isEditing ? (
                    <textarea
                      value={editData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent resize-none"
                      placeholder="Any additional information..."
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{currentHostData.additionalInfo || 'No additional information provided.'}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Requirements */}
            <Card>
              <h3 className="text-xl font-bold text-umd-black mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-umd-red" />
                Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requires US Citizenship</label>
                  {isEditing ? (
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="requiresCitizenship"
                          checked={editData.requiresCitizenship === true}
                          onChange={() => handleInputChange('requiresCitizenship', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="requiresCitizenship"
                          checked={editData.requiresCitizenship === false}
                          onChange={() => handleInputChange('requiresCitizenship', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-umd-black font-medium">
                      {currentHostData.requiresCitizenship ? 'Yes' : 'No'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requires Background Check</label>
                  {isEditing ? (
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="requiresBackgroundCheck"
                          checked={editData.requiresBackgroundCheck === true}
                          onChange={() => handleInputChange('requiresBackgroundCheck', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="requiresBackgroundCheck"
                          checked={editData.requiresBackgroundCheck === false}
                          onChange={() => handleInputChange('requiresBackgroundCheck', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-umd-black font-medium">
                      {currentHostData.requiresBackgroundCheck ? 'Required' : 'Not Required'}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;