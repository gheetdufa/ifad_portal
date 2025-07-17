import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Save, CheckCircle, User, Mail, Phone, BookOpen, Calendar, Award, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SmallerLogo from '../../assets/Smaller_logo.png';

const StudentRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    uidNumber: '',
    email: '',
    phone: '',
    colleges: [] as string[],
    majors: '',
    academicYear: '',
    graduationDate: '',
    hearAboutProgram: [] as string[],
    previousParticipation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const collegeOptions = [
    'College of Agriculture and Natural Resources',
    'School of Architecture, Planning, and Preservation',
    'College of Arts and Humanities',
    'College of Behavioral and Social Sciences',
    'Robert H. Smith School of Business',
    'College of Computer, Mathematical and Natural Sciences',
    'College of Education',
    'A. James Clark School of Engineering',
    'Philip Merrill College of Journalism',
    'College of Information',
    'School of Public Health',
    'School of Public Policy',
    'Letters and Sciences',
    'Other'
  ];

  const academicYearOptions = [
    '1st-year (freshman)',
    'Sophomore',
    'Junior',
    'Senior',
    'Other…'
  ];

  const hearAboutOptions = [
    'Social media (Instagram, LinkedIn, etc).',
    'Family or Friend',
    'University Career Center Staff',
    'Other Faculty/Staff outside of University Career Center',
    'University Career Center website',
    'Academic Department',
    'Handshake',
    'UCC\'s e-Newsletter',
    'UCC\'s Career Event/Presentation',
    'Other…'
  ];

  const previousParticipationOptions = [
    'I have been previously matched with a host through Intern for a Day, but was unable to complete my shadowing/informational interviewing experience.',
    'I applied in a previous semester, but was not matched with a host.',
    'Yes, I have participated in Intern for a Day in a previous semester.',
    'No, I have not participated in Intern for a Day in a previous semester.'
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16 bg-gradient-to-br from-white via-blue-50 to-white border-2 border-blue-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-umd-black mb-6 animate-slideInUp">Application Submitted!</h1>
              <p className="text-xl text-umd-gray-600 mb-10 leading-relaxed animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                Thank you for applying to the Intern for a Day program. You will receive a confirmation email shortly.
              </p>
              <Button variant="primary" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-lg text-lg px-8 py-3 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                <Link to="/student">Go to Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-umd-red/10 to-umd-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8 animate-slideInDown">
            <div className="p-4 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 hover:scale-105 transition-transform duration-300">
              <img 
                src={SmallerLogo} 
                alt="University of Maryland Logo" 
                className="h-20 w-auto"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6 animate-slideInLeft">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-umd-black bg-gradient-to-r from-umd-black via-blue-600 to-umd-black bg-clip-text">
                Student Registration
              </h1>
            </div>
            <p className="text-xl text-umd-gray-600 max-w-3xl mx-auto leading-relaxed animate-slideInRight">
              Complete your application for the Intern for a Day Fall 2024 program
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-slideInUp">
          <Card className="space-y-10 bg-gradient-to-br from-white via-gray-50 to-white border-2 border-transparent hover:border-blue-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
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
                  <div className="group/field md:col-span-2">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                      Your First & Last Name *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-purple-600 transition-colors duration-300">
                      Your UID Number *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="UID Number"
                        value={formData.uidNumber}
                        onChange={(e) => handleInputChange('uidNumber', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
                      />
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-purple-500 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-green-600 transition-colors duration-300">
                      Verifying Your Email Address *
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
                    <p className="text-xs text-umd-gray-500 mt-1">
                      This is where your Intern for a Day Fall 2024 Feedback Survey will be sent
                    </p>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-orange-600 transition-colors duration-300">
                      Preferred Phone Number *
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="(XXX) XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="pl-10 border-2 border-gray-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-300"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-orange-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Enhanced Academic Information Section */}
              <section className="group">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-emerald-600 transition-colors duration-300">Academic Information</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-4 group-hover/field:text-emerald-600 transition-colors duration-300">
                      Select Your College(s) *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300">
                      {collegeOptions.map((college) => (
                        <label key={college} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-white to-emerald-50 rounded-lg hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200 group/option">
                          <input
                            type="checkbox"
                            checked={formData.colleges.includes(college)}
                            onChange={() => handleMultiSelect('colleges', college)}
                            className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-umd-black group-hover/option:text-emerald-600 transition-colors duration-300 leading-relaxed">{college}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group/field">
                      <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-blue-600 transition-colors duration-300">
                        List Your Major(s) OR Intended Major(s) *
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter your major(s)"
                          value={formData.majors}
                          onChange={(e) => handleInputChange('majors', e.target.value)}
                          required
                          className="pl-10 border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-all duration-300"
                        />
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-blue-500 transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="group/field">
                      <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-purple-600 transition-colors duration-300">
                        Academic Year *
                      </label>
                      <select
                        value={formData.academicYear}
                        onChange={(e) => handleInputChange('academicYear', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 transition-all duration-300"
                        required
                      >
                        <option value="">Select Academic Year</option>
                        {academicYearOptions.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="group/field md:col-span-2">
                      <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-orange-600 transition-colors duration-300">
                        Expected Graduation Date *
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Month/Year (e.g., May 2025)"
                          value={formData.graduationDate}
                          onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                          required
                          className="pl-10 border-2 border-gray-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-300"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover/field:text-orange-500 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Enhanced Program Information Section */}
              <section className="group">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-purple-600 transition-colors duration-300">Program Information</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-4 group-hover/field:text-purple-600 transition-colors duration-300">
                      How did you hear about this program? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                      {hearAboutOptions.map((option) => (
                        <label key={option} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-white to-purple-50 rounded-lg hover:from-purple-50 hover:to-purple-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200 group/option">
                          <input
                            type="checkbox"
                            checked={formData.hearAboutProgram.includes(option)}
                            onChange={() => handleMultiSelect('hearAboutProgram', option)}
                            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-umd-black group-hover/option:text-purple-600 transition-colors duration-300 leading-relaxed">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="block text-sm font-medium text-umd-black mb-2 group-hover/field:text-indigo-600 transition-colors duration-300">
                      Previous Participation *
                    </label>
                    <div className="space-y-3 bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300">
                      {previousParticipationOptions.map((option) => (
                        <label key={option} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-white to-indigo-50 rounded-lg hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-200 group/option">
                          <input
                            type="radio"
                            name="previousParticipation"
                            value={option}
                            checked={formData.previousParticipation === option}
                            onChange={(e) => handleInputChange('previousParticipation', e.target.value)}
                            className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            required
                          />
                          <span className="text-sm text-umd-black group-hover/option:text-indigo-600 transition-colors duration-300 leading-relaxed">{option}</span>
                        </label>
                      ))}
                    </div>
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-2xl px-12 py-4 text-lg font-bold relative overflow-hidden group/submit"
                  icon={isSubmitting ? undefined : Save}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default StudentRegistration; 