import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, CheckCircle, AlertCircle, Target, Award, TrendingUp, Clock, Star } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressTracker from '../../components/ProgressTracker';

const StudentDashboard: React.FC = () => {
  // Mock student data - in production, this would come from API
  const studentData = {
    firstName: 'Alex',
    orientationCompleted: true,
    applicationSubmitted: false,
    matched: false,
    matchedHost: null,
  };

  const progressSteps = [
    {
      id: 'orientation',
      title: 'Complete Orientation',
      description: 'Learn about program requirements and expectations',
      status: studentData.orientationCompleted ? 'completed' as const : 'current' as const,
    },
    {
      id: 'application',
      title: 'Submit Application',
      description: 'Browse hosts and submit your ranked preferences',
      status: studentData.applicationSubmitted ? 'completed' as const : 
              studentData.orientationCompleted ? 'current' as const : 'upcoming' as const,
    },
    {
      id: 'matching',
      title: 'Matching Process',
      description: 'We match you with compatible hosts',
      status: studentData.matched ? 'completed' as const : 
              studentData.applicationSubmitted ? 'current' as const : 'upcoming' as const,
    },
    {
      id: 'experience',
      title: 'Schedule Experience',
      description: 'Coordinate with your host for the shadowing day',
      status: studentData.matched ? 'current' as const : 'upcoming' as const,
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Application Deadline Reminder',
      message: 'Applications are due October 13th. Don\'t miss out!',
      type: 'warning' as const,
      date: '2024-10-08',
    },
    {
      id: 2,
      title: 'New Hosts Added',
      message: 'We\'ve added 15 new hosts across various industries.',
      type: 'primary' as const,
      date: '2024-10-05',
    },
    {
      id: 3,
      title: 'Orientation Now Available',
      message: 'Complete your orientation to begin the application process.',
      type: 'primary' as const,
      date: '2024-09-29',
    },
  ];

  const quickStats = [
    { label: 'Available Hosts', value: '127', icon: Users, color: 'text-umd-red', bgColor: 'bg-red-50', shadowColor: 'shadow-red-200' },
    { label: 'Days Remaining', value: '5', icon: Calendar, color: 'text-umd-gold', bgColor: 'bg-yellow-50', shadowColor: 'shadow-yellow-200' },
    { label: 'Career Fields', value: '50+', icon: Target, color: 'text-green-600', bgColor: 'bg-green-50', shadowColor: 'shadow-green-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-umd-red/10 to-umd-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Header */}
        <div className="mb-12 relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            {/* Floating geometric shapes */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-8 w-6 h-6 bg-umd-gold/30 rotate-45 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/15 rounded-full animate-bounce"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-8xl animate-bounce">🎓</div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-slideInLeft">
                    Welcome back, <span className="bg-gradient-to-r from-white via-umd-gold to-white bg-clip-text text-transparent animate-gradient-x">{studentData.firstName}</span>!
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                    Your IFAD Journey Awaits
                  </p>
                  <p className="text-lg text-blue-200 mt-2 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                    Track your progress and manage your IFAD experience
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 animate-slideInRight">
                <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-blue-200" />
                  <Badge variant="primary">Spring 2025</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${stat.bgColor} border-2 border-transparent hover:border-white hover:shadow-lg hover:${stat.shadowColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${stat.color} mx-auto mb-4 p-3 rounded-full ${stat.bgColor.replace('50', '100')} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <p className="text-4xl font-bold text-umd-black group-hover:text-blue-600 transition-colors duration-500 mb-2">{stat.value}</p>
                  <p className="text-lg text-umd-gray-600 group-hover:text-umd-black transition-colors duration-300">{stat.label}</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:w-full"></div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Progress Tracker */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50 to-white border-2 border-transparent hover:border-blue-200 relative overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-umd-black group-hover:text-blue-600 transition-colors duration-300">Your Progress</h2>
                  </div>
                  <Badge variant="primary">Spring 2025</Badge>
                </div>
                <ProgressTracker steps={progressSteps} />
              </div>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-green-50 to-white border-2 border-transparent hover:border-green-200 relative overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-green-600 transition-colors duration-300">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {!studentData.orientationCompleted && (
                    <Button
                      variant="primary"
                      icon={BookOpen}
                      iconPosition="left"
                      className="justify-start h-auto p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group/action hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/action:translate-x-full transition-transform duration-700"></div>
                      <Link to="/student/orientation" className="flex flex-col items-start relative z-10">
                        <span className="font-bold text-lg">Complete Orientation</span>
                        <span className="text-sm opacity-90">Required before applying</span>
                      </Link>
                    </Button>
                  )}
                  
                  {studentData.orientationCompleted && !studentData.applicationSubmitted && (
                    <Button
                      variant="primary"
                      icon={Users}
                      iconPosition="left"
                      className="justify-start h-auto p-6 bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 group/action hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/action:translate-x-full transition-transform duration-700"></div>
                      <Link to="/student/application" className="flex flex-col items-start relative z-10">
                        <span className="font-bold text-lg">Start Application</span>
                        <span className="text-sm opacity-90">Browse hosts and apply</span>
                      </Link>
                    </Button>
                  )}

                  {studentData.orientationCompleted && (
                    <Button
                      variant="outline"
                      icon={Users}
                      iconPosition="left"
                      className="justify-start h-auto p-6 hover:bg-purple-500 hover:text-white group/action hover:scale-105 transition-all duration-300 border-2 hover:border-purple-500"
                    >
                      <Link to="/student/host-list" className="flex flex-col items-start">
                        <span className="font-bold text-lg">Browse Hosts</span>
                        <span className="text-sm opacity-90">Explore opportunities</span>
                      </Link>
                    </Button>
                  )}

                  {studentData.matched && (
                    <Button
                      variant="secondary"
                      icon={Calendar}
                      iconPosition="left"
                      className="justify-start h-auto p-6 hover:bg-orange-500 hover:text-white group/action hover:scale-105 transition-all duration-300 border-2 hover:border-orange-500"
                    >
                      <Link to="/student/schedule" className="flex flex-col items-start">
                        <span className="font-bold text-lg">Schedule Experience</span>
                        <span className="text-sm opacity-90">Coordinate with host</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Enhanced Program Information */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-purple-50 to-white border-2 border-transparent hover:border-purple-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-purple-600 transition-colors duration-300">Program Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300 group/info border-l-4 border-umd-red">
                    <div className="w-6 h-6 bg-umd-red rounded-full mt-1 flex items-center justify-center group-hover/info:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">What to Expect</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Participate in job shadowing, informational interviews, or both depending on your host's availability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 group/info border-l-4 border-umd-gold">
                    <div className="w-6 h-6 bg-umd-gold rounded-full mt-1 flex items-center justify-center group-hover/info:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">Duration</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Experiences typically last 2-4 hours and can be virtual or in-person.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group/info border-l-4 border-green-600">
                    <div className="w-6 h-6 bg-green-600 rounded-full mt-1 flex items-center justify-center group-hover/info:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">Follow-up</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Complete a feedback survey after your experience to help improve the program.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Enhanced Current Status */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-emerald-50 to-white border-2 border-transparent hover:border-emerald-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-emerald-600 transition-colors duration-300">Current Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Orientation</span>
                    {studentData.orientationCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-umd-red" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Application</span>
                    {studentData.applicationSubmitted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Match Status</span>
                    {studentData.matched ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-umd-gray-300"></div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Important Dates */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-orange-50 to-white border-2 border-transparent hover:border-orange-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-orange-600 transition-colors duration-300">Important Dates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Application Deadline</span>
                    <span className="text-umd-red font-bold">Oct 13</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Matching Complete</span>
                    <span className="text-umd-black font-bold">Nov 10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Experiences Begin</span>
                    <span className="text-umd-black font-bold">Nov 15</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Announcements */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-indigo-50 to-white border-2 border-transparent hover:border-indigo-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-indigo-600 transition-colors duration-300">Announcements</h3>
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-gradient-to-r from-white to-indigo-50 rounded-xl hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 border border-transparent hover:border-indigo-200 group/announcement">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-umd-black group-hover/announcement:text-indigo-600 transition-colors duration-300">
                          {announcement.title}
                        </h4>
                        <Badge variant={announcement.type} size="sm">
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-umd-gray-600 mb-2 leading-relaxed">{announcement.message}</p>
                      <p className="text-sm text-umd-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced Help & Support */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-teal-50 to-white border-2 border-transparent hover:border-teal-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-teal-600 transition-colors duration-300">Need Help?</h3>
                <div className="space-y-4">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-teal-500 hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/student/faq" className="flex items-center">
                      <span>Frequently Asked Questions</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/student/contact" className="flex items-center">
                      <span>Contact Support</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;