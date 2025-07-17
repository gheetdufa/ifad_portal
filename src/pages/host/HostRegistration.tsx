import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Save, CheckCircle, Building, User, Mail, Phone, Globe, Award, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SmallerLogo from '../../assets/Smaller_logo.png';

const HostRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    organization: '',
    industry: '',
    bio: '',
    experienceType: '',
    location: '',
    maxStudents: '1',
    availability: '',
    linkedin: '',
    alumniConnection: '',
    yearsExperience: '',
    preferredStudentLevel: [] as string[],
    specializations: '',
    mentorshipExperience: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const experienceTypeOptions = [
    'Job Shadowing Only',
    'Informational Interview Only',
    'Both Job Shadowing and Informational Interview'
  ];

  const locationOptions = [
    'In-Person',
    'Virtual',
    'Both In-Person and Virtual'
  ];

  const studentLevelOptions = [
    'First-year students',
    'Sophomores',
    'Juniors',
    'Seniors',
    'Graduate students',
    'Any level'
  ];

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Consulting',
    'Government',
    'Non-Profit',
    'Education',
    'Engineering',
    'Marketing/Advertising',
    'Media/Communications',
    'Legal',
    'Research',
    'Entrepreneurship',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16 bg-gradient-to-br from-white via-green-50 to-white border-2 border-green-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-umd-black mb-6 animate-slideInUp">Registration Submitted!</h1>
              <p className="text-xl text-umd-gray-600 mb-10 leading-relaxed animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                Thank you for registering to be a host for the Intern for a Day program. 
                We will review your application and contact you soon.
              </p>
              <Button variant="primary" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-300 shadow-lg text-lg px-8 py-3 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                <Link to="/host">Go to Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-umd-red/10 to-umd-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8 animate-slideInDown">
            <div className="p-4 bg-white rounded-2xl shadow-2xl border-2 border-umd-red/20 hover:scale-105 transition-transform duration-300">
              <img 
                src={SmallerLogo} 
                alt="University of Maryland Logo" 
                className="h-20 w-auto"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6 animate-slideInLeft">
              <div className="p-3 bg-gradient-to-br from-umd-red to-red-600 rounded-full shadow-lg">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-umd-black bg-gradient-to-r from-umd-black via-umd-red to-umd-black bg-clip-text">
                Host Registration
              </h1>
            </div>
            <p className="text-xl text-umd-gray-600 max-w-3xl mx-auto leading-relaxed animate-slideInRight">
              Register to become a host for the Intern for a Day program and help UMD students explore career opportunities
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-slideInUp">
          <Card className="space-y-10 bg-gradient-to-br from-white via-gray-50 to-white border-2 border-transparent hover:border-umd-red/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-umd-red/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              {/* Enhanced Personal Information Section */}
              <section className="group">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-blue-600 transition-colors duration-300">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                      First Name *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-all duration-300"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-blue-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                      Last Name *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-all duration-300"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-blue-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-green-600 transition-colors duration-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-green-500 hover:border-green-300 transition-all duration-300"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-green-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-purple-600 transition-colors duration-300">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="(XXX) XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-purple-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-indigo-600 transition-colors duration-300">
                      LinkedIn Profile (Optional)
                    </label>
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="pl-10 border-2 border-gray-200 focus:border-indigo-500 hover:border-indigo-300 transition-all duration-300"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-indigo-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-orange-600 transition-colors duration-300">
                      UMD Alumni Connection *
                    </label>
                    <select
                      value={formData.alumniConnection}
                      onChange={(e) => handleInputChange('alumniConnection', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select your connection to UMD</option>
                      <option value="alumni">UMD Alumni</option>
                      <option value="parent">Parent of UMD Student/Alumni</option>
                      <option value="employer">Employer of UMD Alumni</option>
                      <option value="partner">Industry Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Enhanced Professional Information Section */}
              <section className="group">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-emerald-600 transition-colors duration-300">Professional Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-emerald-600 transition-colors duration-300">
                      Job Title *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Senior Software Engineer"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-emerald-500 hover:border-emerald-300 transition-all duration-300"
                      />
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-emerald-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-red-600 transition-colors duration-300">
                      Organization *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Company Name"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-red-500 hover:border-red-300 transition-all duration-300"
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                      Industry *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-purple-600 transition-colors duration-300">
                      Years of Experience *
                    </label>
                    <select
                      value={formData.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select Experience Level</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16+">16+ years</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 group/field">
                  <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-green-600 transition-colors duration-300">
                    Professional Bio *
                  </label>
                  <textarea
                    placeholder="Tell us about your career journey, expertise, and what you'd like to share with students..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 transition-all duration-300 resize-none"
                  />
                </div>
              </section>

              {/* Enhanced Program Preferences Section */}
              <section className="group">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-purple-600 transition-colors duration-300">Program Preferences</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                      Type of Experience *
                    </label>
                    <select
                      value={formData.experienceType}
                      onChange={(e) => handleInputChange('experienceType', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select Experience Type</option>
                      {experienceTypeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-green-600 transition-colors duration-300">
                      Location Preference *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select Location</option>
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-orange-600 transition-colors duration-300">
                      Maximum Students *
                    </label>
                    <select
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-all duration-300"
                      required
                    >
                      <option value="1">1 student</option>
                      <option value="2">2 students</option>
                      <option value="3">3 students</option>
                      <option value="4">4 students</option>
                      <option value="5">5+ students</option>
                    </select>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-indigo-600 transition-colors duration-300">
                      Availability Window *
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300 transition-all duration-300"
                      required
                    >
                      <option value="">Select Availability</option>
                      <option value="weekdays-morning">Weekdays - Morning (8am-12pm)</option>
                      <option value="weekdays-afternoon">Weekdays - Afternoon (12pm-5pm)</option>
                      <option value="weekdays-evening">Weekdays - Evening (5pm-8pm)</option>
                      <option value="weekends">Weekends</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 group/field">
                  <label className="block text-sm font-medium text-umd-black mb-4 group-hover/field:text-purple-600 transition-colors duration-300">
                    Preferred Student Level(s) *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {studentLevelOptions.map((level) => (
                      <label key={level} className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-purple-50 hover:to-purple-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200 group/option">
                        <input
                          type="checkbox"
                          checked={formData.preferredStudentLevel.includes(level)}
                          onChange={() => handleMultiSelect('preferredStudentLevel', level)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-umd-black group-hover/option:text-purple-600 transition-colors duration-300">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Enhanced Submit Section */}
              <div className="text-center pt-8 border-t-2 border-gray-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-300 shadow-2xl px-12 py-4 text-lg font-bold relative overflow-hidden group/submit"
                  icon={isSubmitting ? undefined : Save}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </span>
                </Button>
                <p className="text-sm text-umd-gray-500 mt-4">
                  By submitting this form, you agree to participate in the UMD Intern for a Day program.
                </p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default HostRegistration; 