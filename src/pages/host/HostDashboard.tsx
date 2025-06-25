import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, CheckCircle, Users, Edit, ArrowRight, Mail, Phone, MapPin, Building, Briefcase, Settings, Star, TrendingUp, Award, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const HostDashboard: React.FC = () => {
  // Mock host data - in production, this would come from API
  const hostData = {
    firstName: 'Ms.',
    lastName: 'Harper',
    jobTitle: 'Software Engineering Manager',
    organization: 'Tech Innovators Inc.',
    industry: 'Technology',
    email: 'harper@techinnovators.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, College Park, MD 20742',
    verified: true,
    maxStudents: 2,
    profileImage: '👩‍💼', // In real app, this would be an image URL
    matchedStudents: [
      {
        id: '1',
        firstName: 'Alex',
        lastName: 'Chen',
        major: 'Computer Science',
        graduationYear: 2025,
        email: 'achen@umd.edu',
        phone: '(555) 987-6543'
      },
    ],
    experienceType: 'both',
    location: 'virtual',
    bio: 'I am a software engineering manager with 8 years of experience in the tech industry. I\'m passionate about mentoring the next generation of developers.',
    internshipFocus: 'Software Engineering'
  };

  const upcomingTasks = [
    {
      id: 1,
      title: 'Schedule with Alex Chen',
      description: 'Coordinate your shadowing experience',
      priority: 'high' as const,
      dueDate: '2024-11-25',
    },
    {
      id: 2,
      title: 'Complete Host Survey',
      description: 'Share feedback about the program',
      priority: 'medium' as const,
      dueDate: '2024-12-20',
    },
    {
      id: 3,
      title: 'Update Profile Information',
      description: 'Review and update your hosting preferences',
      priority: 'low' as const,
      dueDate: '2024-12-31',
    },
  ];

  const programStats = [
    { label: 'Students Matched', value: hostData.matchedStudents.length.toString(), icon: User, color: 'text-umd-red', bgColor: 'bg-red-50', shadowColor: 'shadow-red-200' },
    { label: 'Available Spots', value: (hostData.maxStudents - hostData.matchedStudents.length).toString(), icon: Users, color: 'text-umd-gold', bgColor: 'bg-yellow-50', shadowColor: 'shadow-yellow-200' },
    { label: 'Program Status', value: 'Active', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', shadowColor: 'shadow-green-200' },
  ];

  const profileFields = [
    { label: 'Company', value: hostData.organization, icon: Building },
    { label: 'Email', value: hostData.email, icon: Mail },
    { label: 'Phone', value: hostData.phone, icon: Phone },
    { label: 'Address', value: hostData.address, icon: MapPin },
    { label: 'Internship Focus', value: hostData.internshipFocus, icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-umd-red/10 to-umd-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Header */}
        <div className="mb-12 relative">
          <div className="bg-gradient-to-r from-umd-red via-red-600 to-umd-red rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
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
                <div className="text-8xl animate-bounce">{hostData.profileImage}</div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-slideInLeft">
                    Welcome, {hostData.firstName} <span className="bg-gradient-to-r from-white via-umd-gold to-white bg-clip-text text-transparent animate-gradient-x">{hostData.lastName}</span>!
                  </h1>
                  <p className="text-xl md:text-2xl text-red-100 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                    {hostData.jobTitle} at {hostData.organization}
                  </p>
                  <p className="text-lg text-red-200 mt-2 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                    Manage your hosting experience and connect with students
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 animate-slideInRight">
                {hostData.verified ? (
                  <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-300/30 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 text-green-200" />
                                         <Badge variant="success">Verified Host</Badge>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-300/30 px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-yellow-200" />
                                         <Badge variant="warning">Pending Verification</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {programStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${stat.bgColor} border-2 border-transparent hover:border-white hover:shadow-lg hover:${stat.shadowColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${stat.color} mx-auto mb-4 p-3 rounded-full ${stat.bgColor.replace('50', '100')} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <p className="text-4xl font-bold text-umd-black group-hover:text-umd-red transition-colors duration-500 mb-2">{stat.value}</p>
                  <p className="text-lg text-umd-gray-600 group-hover:text-umd-black transition-colors duration-300">{stat.label}</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-umd-red to-umd-gold transition-all duration-500 group-hover:w-full"></div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Profile Summary */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-gray-50 to-white border-2 border-transparent hover:border-umd-red/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-umd-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-umd-black group-hover:text-umd-red transition-colors duration-300">Your Profile</h2>
                  <Button variant="outline" size="sm" icon={Edit} className="hover:bg-umd-red hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/host/profile">Edit</Link>
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {profileFields.map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-umd-red/5 hover:to-umd-gold/5 transition-all duration-300 group/item border border-transparent hover:border-umd-red/20">
                        <div className="p-2 bg-umd-red/10 rounded-lg group-hover/item:bg-umd-red group-hover/item:text-white transition-all duration-300">
                          <Icon className="w-5 h-5 text-umd-red group-hover/item:text-white" />
                        </div>
                        <div className="flex justify-between w-full items-center">
                          <div>
                            <span className="text-sm font-medium text-umd-gray-600 group-hover/item:text-umd-black">{field.label}</span>
                            <p className="text-umd-black font-medium">{field.value}</p>
                          </div>
                          <Button variant="outline" size="sm" className="hover:bg-umd-red hover:text-white hover:scale-105 transition-all duration-300">
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-umd-red/5 hover:to-umd-gold/5 transition-all duration-300 group/item border border-transparent hover:border-umd-red/20">
                    <div className="p-2 bg-umd-red/10 rounded-lg group-hover/item:bg-umd-red transition-all duration-300">
                      <User className="w-5 h-5 text-umd-red group-hover/item:text-white" />
                    </div>
                    <div className="flex justify-between w-full">
                      <div>
                        <span className="text-sm font-medium text-umd-gray-600 group-hover/item:text-umd-black">Professional Bio</span>
                        <p className="text-umd-black mt-1 leading-relaxed">{hostData.bio}</p>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-umd-red hover:text-white hover:scale-105 transition-all duration-300">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Matched Students */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50 to-white border-2 border-transparent hover:border-blue-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-umd-black mb-8 group-hover:text-blue-600 transition-colors duration-300">Your Matched Students</h2>
                
                {hostData.matchedStudents.length > 0 ? (
                  <div className="space-y-6">
                    {hostData.matchedStudents.map((student) => (
                      <div key={student.id} className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl hover:from-blue-50 hover:to-blue-100 transition-all duration-500 group/student border-2 border-transparent hover:border-blue-200 hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-umd-red to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover/student:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-lg">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-umd-black group-hover/student:text-blue-600 transition-colors duration-300">
                                {student.firstName} {student.lastName}
                              </h3>
                              <p className="text-umd-gray-600 text-lg">
                                {student.major} • Class of {student.graduationYear}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-umd-gray-500 flex items-center">
                                  <Mail className="w-4 h-4 mr-1" /> {student.email}
                                </span>
                                <span className="text-sm text-umd-gray-500 flex items-center">
                                  <Phone className="w-4 h-4 mr-1" /> {student.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm" icon={Mail} className="hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300">
                              Contact
                            </Button>
                            <Button variant="primary" size="sm" icon={Calendar} className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-300">
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                      <Users className="w-12 h-12 text-umd-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-umd-gray-900 mb-3">No matches yet</h3>
                    <p className="text-lg text-umd-gray-600">
                      You'll be notified when students are matched with you.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Program Guidelines */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-green-50 to-white border-2 border-transparent hover:border-green-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-umd-black mb-8 group-hover:text-green-600 transition-colors duration-300">Hosting Guidelines</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group/guideline border-l-4 border-blue-500">
                    <div className="w-6 h-6 bg-blue-600 rounded-full mt-1 flex items-center justify-center group-hover/guideline:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">Before the Experience</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Coordinate with your matched student(s) to schedule the experience and share any preparation materials.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group/guideline border-l-4 border-green-500">
                    <div className="w-6 h-6 bg-green-600 rounded-full mt-1 flex items-center justify-center group-hover/guideline:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">During the Experience</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Share insights about your career path, daily responsibilities, and industry trends. Encourage questions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 group/guideline border-l-4 border-yellow-500">
                    <div className="w-6 h-6 bg-yellow-600 rounded-full mt-1 flex items-center justify-center group-hover/guideline:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-umd-black mb-2">After the Experience</h3>
                      <p className="text-umd-gray-600 leading-relaxed">
                        Complete the host feedback survey and consider connecting with students on LinkedIn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Enhanced Upcoming Tasks */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-purple-50 to-white border-2 border-transparent hover:border-purple-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-purple-600 transition-colors duration-300">Upcoming Tasks</h3>
                <div className="space-y-6">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-gradient-to-r from-white to-purple-50 rounded-xl hover:from-purple-50 hover:to-purple-100 transition-all duration-300 border border-transparent hover:border-purple-200 group/task">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-umd-black group-hover/task:text-purple-600 transition-colors duration-300">{task.title}</h4>
                                                 <Badge 
                           variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'primary'} 
                           size="sm"
                         >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-umd-gray-600 mb-2 leading-relaxed">{task.description}</p>
                      <p className="text-sm text-umd-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-orange-50 to-white border-2 border-transparent hover:border-orange-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-orange-600 transition-colors duration-300">Quick Actions</h3>
                <div className="space-y-4">
                  <Button variant="primary" className="w-full justify-start bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-300 shadow-lg" icon={Settings}>
                    <Link to="/host/settings">Account Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300" icon={Edit}>
                    <Link to="/host/profile">Edit Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-500 hover:text-white hover:scale-105 transition-all duration-300" icon={Calendar}>
                    <Link to="/host/availability">Update Availability</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-500 hover:text-white hover:scale-105 transition-all duration-300" icon={Users}>
                    <Link to="/host/students">View All Students</Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Enhanced Program Information */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-emerald-50 to-white border-2 border-transparent hover:border-emerald-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-emerald-600 transition-colors duration-300">Program Dates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Host Registration</span>
                    <span className="text-green-600 font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Student Matching</span>
                    <span className="text-umd-red font-bold">Nov 10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-umd-gray-600 font-medium">Experience Window</span>
                    <span className="text-umd-black font-bold">Nov 15 - Dec 15</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Support */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-indigo-50 to-white border-2 border-transparent hover:border-indigo-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-umd-black mb-6 group-hover:text-indigo-600 transition-colors duration-300">Need Help?</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-indigo-500 hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/host/faq">Host FAQ</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/contact">Contact Program Team</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-orange-500 hover:text-white hover:scale-105 transition-all duration-300">
                    <Link to="/host/resources">Host Resources</Link>
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

export default HostDashboard;