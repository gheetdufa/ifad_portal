import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Award, CheckCircle, Star, Sparkles, Target, TrendingUp, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LogoWhite from '../assets/logo_white.png';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const studentSteps = [
    { step: 1, title: 'Complete Orientation', description: 'Learn about the program requirements and expectations' },
    { step: 2, title: 'Apply & Select Hosts', description: 'Browse and rank your preferred host professionals' },
    { step: 3, title: 'Get Matched', description: 'Our system matches you with compatible hosts' },
    { step: 4, title: 'Schedule Your Experience', description: 'Coordinate with your host for the shadowing day' },
  ];

  const hostSteps = [
    { step: 1, title: 'Register to Host', description: 'Create your professional profile and availability' },
    { step: 2, title: 'Get Matched with a Student', description: 'We connect you with interested students' },
    { step: 3, title: 'Schedule the Shadowing Day', description: 'Plan the experience with your matched student' },
    { step: 4, title: 'Share Your Experience', description: 'Mentor the next generation of professionals' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Senior',
      content: 'The IFAD program gave me incredible insights into the tech industry. My host at Microsoft showed me what a typical day looks like for a software engineer.',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Professional, Alumni',
      content: 'Hosting students through IFAD is incredibly rewarding. It\'s amazing to see their excitement and help them understand career possibilities.',
      rating: 5,
    },
    {
      name: 'Jennifer Park',
      role: 'Business Major',
      content: 'I shadowed a UMD alumnus at a consulting firm and it completely changed my career direction. The experience was invaluable.',
      rating: 5,
    },
  ];

  const impactStats = [
    { value: '500+', label: 'Students Matched', icon: Users },
    { value: '200+', label: 'Industry Partners', icon: Award },
    { value: '95%', label: 'Satisfaction Rate', icon: Star },
    { value: '50+', label: 'Career Fields', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Dynamic Animation */}
      <section className="relative bg-gradient-to-br from-umd-red via-red-800 to-umd-red-dark text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-umd-gold to-yellow-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-br from-umd-gold to-yellow-300 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-white rounded-full opacity-10 animate-pulse"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Diagonal accent lines */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 border border-white/10 rounded-full animate-spin-slow"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 border border-umd-gold/20 rounded-full animate-spin-slow-reverse"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className={`text-center max-w-5xl mx-auto transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Enhanced Logo with Glow Effect */}
            <div className="flex items-center justify-center mb-12 relative">
              <div className="absolute inset-0 bg-umd-gold/30 rounded-full blur-2xl scale-150 animate-pulse"></div>
              <img 
                src={LogoWhite} 
                alt="University of Maryland Logo" 
                className="relative h-32 md:h-44 w-auto drop-shadow-2xl transform hover:scale-110 transition-all duration-500 hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </div>
            
            {/* Enhanced Headline with Gradient and Shadow */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="block text-white drop-shadow-lg">Explore Careers with</span>
              <span className="block relative">
                <span className="bg-gradient-to-r from-umd-gold via-yellow-300 to-umd-gold bg-clip-text text-transparent animate-gradient-x text-6xl md:text-8xl">
                  Intern For A Day
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-umd-gold via-yellow-300 to-umd-gold bg-clip-text text-transparent opacity-50 blur-sm text-6xl md:text-8xl">
                  Intern For A Day
                </div>
              </span>
            </h1>
            
            {/* Enhanced Description with Better Typography */}
            <div className="relative mb-12">
              <p className="text-xl md:text-2xl text-red-50 leading-relaxed max-w-4xl mx-auto font-light">
                Connect with <span className="text-umd-gold font-semibold">UMD alumni</span> and 
                <span className="text-white font-semibold"> industry professionals</span> for job shadowing experiences 
                that bridge the gap between classroom learning and real-world careers.
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-umd-gold to-transparent"></div>
            </div>
            
            {/* Enhanced Primary Buttons with Glow Effects */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-umd-gold to-yellow-400 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <Button 
                  size="lg" 
                  variant="primary" 
                  icon={Users}
                  className="relative transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-10 py-5 text-xl font-bold bg-gradient-to-r from-umd-red to-red-700 hover:from-red-700 hover:to-umd-red"
                >
                  <Link to="/login?type=student" className="block w-full">Student Portal</Link>
                </Button>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-umd-gold to-yellow-400 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <Button 
                  size="lg" 
                  variant="secondary"
                  icon={Briefcase}
                  className="relative transform hover:scale-110 hover:-rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-10 py-5 text-xl font-bold border-2 border-umd-gold bg-umd-gold text-umd-black hover:bg-yellow-400 hover:border-yellow-400"
                >
                  <Link to="/login?type=host" className="block w-full">Host Portal</Link>
                </Button>
              </div>
            </div>
            
            {/* Enhanced Secondary Actions with Glow Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gray-800 to-black rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="relative transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-8 py-4 text-lg font-bold border-2 border-white bg-black text-white hover:bg-gray-800 hover:text-white backdrop-blur-sm"
                >
                  <Link to="/public-hosts" className="block w-full">Browse Host Directory</Link>
                </Button>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-white to-gray-300 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="relative transform hover:scale-110 hover:-rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] px-8 py-4 text-lg font-bold border-2 border-white bg-white/10 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                >
                  <Link to="/login?type=admin" className="block w-full">Admin Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-umd-black to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-umd-gold rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-umd-gold/20 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-umd-gold to-yellow-400 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Making a real difference in student career development across the University of Maryland
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-umd-gold to-transparent mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`relative group text-center transform transition-all duration-700 hover:scale-110 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-gold/20 to-yellow-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 group-hover:border-umd-gold/50 transition-all duration-500 backdrop-blur-sm">
                    {/* Icon with Enhanced Design */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-umd-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-umd-gold/50 transition-all duration-500 group-hover:rotate-6">
                        <Icon className="w-10 h-10 text-umd-black" />
                      </div>
                      {/* Floating particles */}
                      <div className="absolute top-0 left-1/2 w-2 h-2 bg-umd-gold rounded-full opacity-0 group-hover:opacity-100 animate-float transform -translate-x-1/2 -translate-y-2"></div>
                      <div className="absolute top-2 right-1/4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-200 transform -translate-y-1"></div>
                    </div>
                    
                    {/* Enhanced Number Display */}
                    <div className="relative mb-3">
                      <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-umd-gold group-hover:to-yellow-400 transition-all duration-500">
                        {stat.value}
                      </div>
                    </div>
                    
                    {/* Label with Accent */}
                    <div className="text-gray-400 font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </div>
                    
                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-umd-gold to-yellow-400 group-hover:w-full transition-all duration-500 rounded-t-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Overview - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-40 bg-umd-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-umd-gold rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-umd-black mb-6">
              What is <span className="bg-gradient-to-r from-umd-red to-red-600 bg-clip-text text-transparent">IFAD</span>?
            </h2>
            <p className="text-xl text-umd-gray-700 max-w-4xl mx-auto leading-relaxed">
              The Intern For A Day program provides UMD students with opportunities to explore career paths 
              through job shadowing and informational interviews with industry professionals.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-umd-red to-transparent mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Professional Network Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-red to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <Card className="relative text-center group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white border-0 shadow-lg hover:shadow-umd-red/20 rounded-2xl overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-umd-red/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                
                <div className="relative p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-umd-red to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-umd-black mb-4 group-hover:text-umd-red transition-colors duration-300">
                    Professional Network
                  </h3>
                  <p className="text-umd-gray-600 leading-relaxed">
                    Connect with UMD alumni, parents, and industry partners across various fields
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Flexible Experience Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-gold to-yellow-500 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <Card className="relative text-center group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white border-0 shadow-lg hover:shadow-umd-gold/20 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-umd-gold/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                
                <div className="relative p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-umd-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Calendar className="w-10 h-10 text-umd-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-umd-black mb-4 group-hover:text-umd-gold transition-colors duration-300">
                    Flexible Experience
                  </h3>
                  <p className="text-umd-gray-600 leading-relaxed">
                    Choose from job shadowing, virtual interviews, or both based on your interests
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Career Clarity Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-red to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <Card className="relative text-center group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white border-0 shadow-lg hover:shadow-umd-red/20 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-umd-red/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                
                <div className="relative p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-umd-red to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-umd-black mb-4 group-hover:text-umd-red transition-colors duration-300">
                    Career Clarity
                  </h3>
                  <p className="text-umd-gray-600 leading-relaxed">
                    Gain real-world insights to make informed decisions about your career path
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Students */}
      <section className="py-16 bg-umd-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-umd-black mb-4">How It Works for Students</h2>
            <p className="text-lg text-umd-gray-700">
              Follow these simple steps to participate in the IFAD program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className={`text-center h-full group hover:shadow-xl transition-all duration-500 delay-${index * 100} hover:-translate-y-2`}>
                  <div className="w-12 h-12 bg-umd-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:bg-umd-red-dark transition-colors duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-umd-black mb-2 group-hover:text-umd-red transition-colors duration-300">{step.title}</h3>
                  <p className="text-sm text-umd-gray-600">{step.description}</p>
                </Card>
                
                {index < studentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-umd-gray-400 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Hosts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-umd-black mb-4">How It Works for Hosts</h2>
            <p className="text-lg text-umd-gray-700">
              Share your expertise and help students explore career opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className={`text-center h-full group hover:shadow-xl transition-all duration-500 delay-${index * 100} hover:-translate-y-2`}>
                  <div className="w-12 h-12 bg-umd-gold text-umd-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:bg-umd-gold-dark transition-colors duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-umd-black mb-2 group-hover:text-umd-red transition-colors duration-300">{step.title}</h3>
                  <p className="text-sm text-umd-gray-600">{step.description}</p>
                </Card>
                
                {index < hostSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-umd-gray-400 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-umd-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-umd-black mb-4">Success Stories</h2>
            <p className="text-lg text-umd-gray-700">Hear from students and hosts who've participated</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`group hover:shadow-xl transition-all duration-500 delay-${index * 100} hover:-translate-y-2`}>
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-umd-black group-hover:text-umd-red transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-sm text-umd-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-umd-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-umd-gold text-umd-gold" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-umd-red text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Spring 2025 Timeline</h2>
            <p className="text-red-100 text-lg">Follow the journey from registration to experience</p>
          </div>
          
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Main Timeline Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-white/30"></div>
            
            {/* Timeline Items */}
            <div className="grid grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center group">
                  {/* Circle */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-20 border-4 border-white">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    {/* Connector to timeline */}
                    <div className="absolute top-8 left-8 w-0.5 h-8 bg-white/50 transform -translate-x-0.5"></div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <h3 className="font-bold text-lg text-white mb-2">Host Registration</h3>
                    <p className="text-red-100 font-semibold mb-2">Aug 1 - Sep 29</p>
                    <p className="text-red-200 text-sm">Professionals register to mentor students</p>
                  </div>
                </div>
                
                {/* Arrow to next step */}
                <div className="absolute top-16 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-white/40" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-20 border-4 border-white">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-8 left-8 w-0.5 h-8 bg-white/50 transform -translate-x-0.5"></div>
                  </div>
                  
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <h3 className="font-bold text-lg text-white mb-2">Student Applications</h3>
                    <p className="text-red-100 font-semibold mb-2">Sep 29 - Oct 13</p>
                    <p className="text-red-200 text-sm">Students apply and select host preferences</p>
                  </div>
                </div>
                
                <div className="absolute top-16 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-white/40" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-16 h-16 bg-umd-gold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-20 border-4 border-white">
                      <Calendar className="w-8 h-8 text-umd-black" />
                    </div>
                    <div className="absolute top-8 left-8 w-0.5 h-8 bg-white/50 transform -translate-x-0.5"></div>
                  </div>
                  
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <h3 className="font-bold text-lg text-white mb-2">Matching Complete</h3>
                    <p className="text-red-100 font-semibold mb-2">November 10</p>
                    <p className="text-red-200 text-sm">Students matched with compatible hosts</p>
                  </div>
                </div>
                
                <div className="absolute top-16 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-white/40" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-16 h-16 bg-umd-gold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-20 border-4 border-white">
                      <TrendingUp className="w-8 h-8 text-umd-black" />
                    </div>
                    <div className="absolute top-8 left-8 w-0.5 h-8 bg-white/50 transform -translate-x-0.5"></div>
                  </div>
                  
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <h3 className="font-bold text-lg text-white mb-2">Experiences Begin</h3>
                    <p className="text-red-100 font-semibold mb-2">Nov 15 - Dec 15</p>
                    <p className="text-red-200 text-sm">Shadowing and interviews commence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-8">
            {/* Mobile Step 1 */}
            <div className="relative flex items-start space-x-4 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-16 bg-white/30 mt-2"></div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-bold text-white mb-1">Host Registration</h3>
                <p className="text-red-100 font-semibold text-sm mb-1">Aug 1 - Sep 29</p>
                <p className="text-red-200 text-xs">Professionals register to mentor students</p>
              </div>
            </div>

            {/* Mobile Step 2 */}
            <div className="relative flex items-start space-x-4 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-16 bg-white/30 mt-2"></div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-bold text-white mb-1">Student Applications</h3>
                <p className="text-red-100 font-semibold text-sm mb-1">Sep 29 - Oct 13</p>
                <p className="text-red-200 text-xs">Students apply and select host preferences</p>
              </div>
            </div>

            {/* Mobile Step 3 */}
            <div className="relative flex items-start space-x-4 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-umd-gold rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                  <Calendar className="w-6 h-6 text-umd-black" />
                </div>
                <div className="w-0.5 h-16 bg-white/30 mt-2"></div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-bold text-white mb-1">Matching Complete</h3>
                <p className="text-red-100 font-semibold text-sm mb-1">November 10</p>
                <p className="text-red-200 text-xs">Students matched with compatible hosts</p>
              </div>
            </div>

            {/* Mobile Step 4 */}
            <div className="relative flex items-start space-x-4 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-umd-gold rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                  <TrendingUp className="w-6 h-6 text-umd-black" />
                </div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-bold text-white mb-1">Experiences Begin</h3>
                <p className="text-red-100 font-semibold text-sm mb-1">Nov 15 - Dec 15</p>
                <p className="text-red-200 text-xs">Shadowing and interviews commence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-umd-black to-umd-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join hundreds of UMD students and alumni in building meaningful career connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="primary" 
              icon={ArrowRight}
              className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link to="/login?type=student">Student Registration</Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link to="/register?type=host">Host Registration</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 