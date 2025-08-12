import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SmallerLogo from '../../assets/Smaller_logo.png';

const HostSemesterRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    confirmInfo: false,
    understandPhysicalOffice: false,
    opportunityType: '' as 'in-person' | 'virtual' | 'both' | '',
    maxStudents: 1,
    availableDays: [] as string[],
    winterSessionAvailable: false,
    interestedInRecruitment: false,
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: any) => {
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
    setError('');

    // Validation
    if (!formData.confirmInfo) {
      setError('Please confirm your host profile information is up-to-date');
      return;
    }

    if (!formData.opportunityType) {
      setError('Please select an opportunity type');
      return;
    }

    if (formData.opportunityType === 'in-person' && !formData.understandPhysicalOffice) {
      setError('Please confirm you understand the physical office requirement');
      return;
    }

    if (formData.availableDays.length === 0) {
      setError('Please select at least one available day');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API call to register for semester
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      setIsSubmitted(true);
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16 bg-gradient-to-br from-white via-green-50 to-white border-2 border-green-200 shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-umd-black mb-6">Thank you so much for registering to be a host for an internship for a day in Fall 2025!</h1>
            
            <div className="max-w-3xl mx-auto text-left space-y-6 mb-10">
              <p className="text-lg text-umd-gray-700 leading-relaxed">
                We are so excited that you're willing and interested in supporting University of Maryland students 
                as they seek to gain further insight into a career path that interests them. Your support means so much to us.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-xl font-semibold text-umd-black mb-4">As far as the next steps are concerned:</h2>
                <div className="space-y-4 text-umd-gray-700">
                  <p><strong>(1)</strong> Host registration will remain open until Monday, September 29, 2025. At that point, we will put together a list of hosts for the Fall semester, which will then be shared with students interested in participating in Intern for a Day.</p>
                  
                  <p><strong>(2)</strong> Students will register for a mandatory orientation (either an in-person option or an asynchronous virtual option), which will be available to them between Monday, September 22, 2025, and Friday, October 10, 2025</p>
                  
                  <p><strong>(3)</strong> All students who complete the mandatory orientation will receive an application, on which they will provide us with their preferences regarding available hosts by the end of the day on Thursday, October 23, 2025. At this point, we will begin our matching process and connect you with the students you were matched with using the email you provided in your registration form in early to late-October.</p>
                </div>
              </div>
              
              <p className="text-lg text-umd-gray-700 leading-relaxed">
                We will be in touch with you along the way, but please feel free to contact us with any questions, 
                concerns, or updates at <a href="mailto:ifad@umd.edu" className="text-blue-600 hover:underline">ifad@umd.edu</a>. 
                Thanks again, and we're excited to have you as a host this semester!
              </p>
              
              <div className="text-center">
                <p className="text-lg font-medium text-umd-gray-700 italic">
                  With love & light,<br />
                  J. Sak & Marisha Addison
                </p>
              </div>
            </div>
            
            <Button variant="primary" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">
              <Link to="/host">Go to Dashboard</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <img 
            src={SmallerLogo} 
            alt="University of Maryland Logo" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-umd-red to-red-600 rounded-full shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-umd-black">
              Intern For A Day Host Registration!
            </h1>
          </div>
        </div>

        {/* Information Section */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-umd-black mb-4">UNIVERSITY OF MARYLAND, COLLEGE PARK</h2>
              <h3 className="text-xl font-semibold text-umd-red mb-2">Fall 2025 INTERN FOR A DAY HOST REGISTRATION</h3>
              <p className="text-lg font-medium text-gray-700">Deadline to register: Sunday, September 29, 2025</p>
              <p className="text-sm text-gray-600 mt-2">Please read the details below.</p>
            </div>

            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                We are continuing to offer two options for host to participate in Intern for a Day:
                Professionals will be able to select if they want to host students for either (1) half-day or full-day 
                in-person job shadowing experience local to DC-Maryland-Virginia OR (2) one hour virtual informational 
                interviews with students.
              </p>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-umd-black mb-2">In-Person Job Shadowing Option: More Info</h4>
                <p>
                  To offer an in-person job shadowing experience, the professional must be reporting to a physical 
                  office/workplace and not teleworking the day the student job shadows. At this time, we are only 
                  requesting hosts in Maryland, DC, & Virginia for in-person job shadowing. Please plan for at least 
                  a half-day job shadowing experience.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-umd-black mb-2">Virtual Informational Interviews Option: More Info</h4>
                <p>
                  Due to the prevalence of hybrid work and telework, we want to once again offer a virtual option 
                  for our students and professionals to connect. We ask that you offer approximately one hour of 
                  time for each virtual informational interview to give the students good insight into your background, 
                  current work, and industry.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Registration Form Header */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-umd-black">Complete the IFAD Host Registration Form!</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Completing this form indicates that you want to either host one or more University of Maryland, 
                College Park undergraduate student(s) for a voluntary job shadowing experience for one day or 
                conduct virtual informational interviews with our students.
              </p>
              <p>
                We will match students with professionals for both in-person job shadowing and virtual informational 
                interviews. After matching takes place, the exact day and time for the experience will be determined 
                between you and the student(s). We cannot guarantee we will be able to match you with a student, but 
                we will try our best! Students and hosts will be matched in late-October in order to allow plenty of 
                time for shadowing or interviewing to occur before the close of the semester in December 2025.
              </p>
              <p>
                This registration form will take approximately 5 minutes to complete.
              </p>
              <p>
                If you have additional questions about the program, please email{' '}
                <a href="mailto:ifad@umd.edu" className="text-blue-600 hover:underline">ifad@umd.edu</a>.
              </p>
              <p className="font-semibold text-lg text-umd-red">
                Register to be an IFAD host this semester!
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-umd-black mb-6">REGISTRATION QUESTIONS</h2>
            </div>

            {/* Profile Confirmation */}
            <section>
              <p className="text-gray-700 mb-4">
                Please make sure the information in your IFAD host profile is accurate and most up-to-date. 
                If there are updates, please update or correct your profile before registering as an IFAD host this semester.
              </p>
              <label className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confirmInfo}
                  onChange={(e) => handleInputChange('confirmInfo', e.target.checked)}
                  className="w-5 h-5 text-blue-600 mt-1"
                  required
                />
                <span className="text-sm">
                  I confirm that my information in the HOST INFORMATION document is the SAME, and would like to be 
                  registered as a host automatically for the FALL 2025 IFAD program.
                </span>
              </label>
            </section>

            {/* Physical Office Understanding */}
            <section>
              <label className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.understandPhysicalOffice}
                  onChange={(e) => handleInputChange('understandPhysicalOffice', e.target.checked)}
                  className="w-5 h-5 text-blue-600 mt-1"
                />
                <span className="text-sm">
                  As a professional interested in hosting one or more University of Maryland, College Park students 
                  for an in-person job shadowing experience, I understand that I must be reporting to a physical 
                  office/workplace and not teleworking on the day the student job shadows me.
                </span>
              </label>
            </section>

            {/* Opportunity Type */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                For the FALL 2025 semester, which option would you like to offer UMD undergraduate students?
              </h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="opportunityType"
                    value="in-person"
                    checked={formData.opportunityType === 'in-person'}
                    onChange={(e) => handleInputChange('opportunityType', e.target.value)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <span>In-person job shadowing experience</span>
                </label>
                <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="opportunityType"
                    value="virtual"
                    checked={formData.opportunityType === 'virtual'}
                    onChange={(e) => handleInputChange('opportunityType', e.target.value)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <span>Virtual informational interviews</span>
                </label>
              </div>
            </section>

            {/* Student Capacity */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                How many students are you willing to host this semester (late-October 2025 through mid-January 2026)?
              </h3>
              <div className="flex items-center space-x-4">
                <select
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span>student(s)</span>
              </div>
            </section>

            {/* Available Days */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                What days of the week would work best with your schedule for a student to shadow you?
              </h3>
              <p className="text-sm text-gray-600 mb-3">Please select all that apply.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <label key={day} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={() => handleMultiSelect('availableDays', day)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Winter Session */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                UMD holds a Winter Session from January 5-23, 2026. Many local students like to conduct their 
                shadowing experience during this time. Would a shadowing day some time in this range work with your schedule?
              </h3>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="winterSessionAvailable"
                    checked={formData.winterSessionAvailable === true}
                    onChange={() => handleInputChange('winterSessionAvailable', true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="winterSessionAvailable"
                    checked={formData.winterSessionAvailable === false}
                    onChange={() => handleInputChange('winterSessionAvailable', false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>No</span>
                </label>
              </div>
            </section>

            {/* Recruitment Interest */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                Are you interested in learning more about how to recruit UMD students for jobs and internships within your organization?
              </h3>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="interestedInRecruitment"
                    checked={formData.interestedInRecruitment === true}
                    onChange={() => handleInputChange('interestedInRecruitment', true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="interestedInRecruitment"
                    checked={formData.interestedInRecruitment === false}
                    onChange={() => handleInputChange('interestedInRecruitment', false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>No</span>
                </label>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <h3 className="text-xl font-semibold text-umd-black mb-4">
                Is there any more information you would like to share?
              </h3>
              <textarea
                placeholder="Any additional information you'd like to share..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </section>

            {/* Submit Button */}
            <div className="text-center pt-8 border-t-2 border-gray-100">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Register for Fall 2025 IFAD'
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default HostSemesterRegistration;