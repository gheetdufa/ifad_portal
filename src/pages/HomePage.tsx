import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Award, CheckCircle, Star, Target, TrendingUp, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LogoWhite from '../assets/logo_white.png';
import Collage1 from '../assets/Collage_2024-12-05_19_51_38.jpg';
import Collage2 from '../assets/Collage_2024-12-05_20_37_53.jpg';
import Collage3 from '../assets/Collage_2024-12-05_20_59_03.jpg';
import Collage4 from '../assets/Collage_2024-12-05_21_00_42.jpg';
import UMDInterns1 from '../assets/2025 UMD interns.jpg';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const studentSteps = [
    { 
      step: 1, 
      title: 'Complete Mandatory Orientation', 
      description: 'Complete the required online orientation to learn program expectations, professional etiquette, and safety guidelines',
      detail: 'Takes approximately 30-45 minutes to complete',
      icon: '🎓'
    },
    { 
      step: 2, 
      title: 'Browse & Apply', 
      description: 'Explore our extensive directory of professionals and submit your application with ranked host preferences',
      detail: 'Choose from 200+ industry professionals across 50+ career fields',
      icon: '🔍'
    },
    { 
      step: 3, 
      title: 'Get Matched', 
      description: 'University Career Center staff carefully match you with a compatible professional based on your interests and preferences',
      detail: 'Matching considers career interests, location preferences, and availability',
      icon: '🤝'
    },
    { 
      step: 4, 
      title: 'Experience Your Future', 
      description: 'Participate in your half-day or full-day job shadowing experience or virtual informational interview',
      detail: 'Gain real-world insights and build professional connections',
      icon: '🚀'
    },
  ];

  const hostSteps = [
    { step: 1, title: 'Register to Host', description: 'Create your professional profile and availability' },
    { step: 2, title: 'Get Matched with Students', description: 'We connect you with interested students based on your capacity' },
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
    { value: '500+', label: 'Students Matched (per semester)', icon: Users },
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

      {/* Media Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-umd-black mb-4">
              <span className="bg-gradient-to-r from-umd-red to-red-600 bg-clip-text text-transparent">Program</span> Gallery
            </h2>
            <p className="text-xl text-umd-gray-700">
              See our students in action during their shadowing experiences
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-umd-red to-transparent mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src={Collage1} alt="Students at DHS" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-lg">Department of Homeland Security</h3>
                <p className="text-sm text-gray-200">Students exploring cybersecurity careers</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src={Collage2} alt="Student experiences" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-lg">Professional Networking</h3>
                <p className="text-sm text-gray-200">Building meaningful connections</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src={Collage3} alt="Student team" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <p className="text-sm text-gray-200">Learning through hands-on experience</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src={Collage4} alt="Student presentation" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-lg">Professional Development</h3>
                <p className="text-sm text-gray-200">Gaining industry insights</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 md:col-span-2">
              <img src={UMDInterns1} alt="UMD interns group" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-semibold text-lg">UMD Intern Cohort</h3>
                <p className="text-sm text-gray-200">Celebrating successful placements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Path to Career Discovery - Enhanced */}
      <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-umd-red rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-umd-gold rounded-full animate-spin-slow-reverse"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced header section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-umd-red to-red-700 rounded-2xl shadow-xl mb-6 transform hover:scale-110 transition-all duration-500">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-umd-black mb-6">
              Your Path to <span className="bg-gradient-to-r from-umd-red to-red-600 bg-clip-text text-transparent">Career Discovery</span>
            </h2>
            
            {/* Enhanced bullet points with better visual design */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-umd-red to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-umd-gray-700 leading-relaxed font-medium">
                    Join <span className="text-umd-red font-bold">hundreds of UMD undergraduate students</span> who have transformed their career perspectives
                  </p>
                </div>
                
                <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-umd-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <Briefcase className="w-6 h-6 text-umd-black" />
                  </div>
                  <p className="text-umd-gray-700 leading-relaxed font-medium">
                    Gain <span className="text-umd-gold font-bold">hands-on professional experiences</span> in your field of interest
                  </p>
                </div>
                
                <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-umd-red to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-umd-gray-700 leading-relaxed font-medium">
                    Follow this <span className="text-umd-red font-bold">roadmap to career discovery success</span>
                  </p>
                </div>
              </div>
              
              {/* Call to action prompt */}
              <div className="bg-gradient-to-r from-umd-red/10 to-red-600/10 rounded-xl p-6 border border-umd-red/20">
                <p className="text-lg text-umd-red font-semibold text-center mb-2">
                  Ready to transform your career journey?
                </p>
                <p className="text-umd-gray-600 text-center">
                  Follow the simple steps below to get started with your professional discovery experience
                </p>
              </div>
            </div>
          </div>

          {/* Streamlined Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {studentSteps.map((step, index) => (
              <div key={step.step} className="relative group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center min-h-[260px] flex flex-col">
                  {/* Step number with icon */}
                  <div className="relative mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-umd-red to-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-300">
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-umd-gold text-umd-black rounded-full flex items-center justify-center text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-umd-black mb-3 group-hover:text-umd-red transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-umd-gray-600 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-umd-red font-semibold bg-umd-red/10 px-2 py-1 rounded-full inline-block mx-auto">
                        {step.detail}
                      </p>
                    )}
                  </div>
                  
                  {/* Action button for Step 1 */}
                  {step.step === 1 && (
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        className="bg-umd-red text-white font-bold px-4 py-2 hover:bg-umd-red-dark transition-all duration-300 shadow-md hover:shadow-lg text-xs w-full"
                      >
                        <a href="https://umd-ucc.catalog.instructure.com/courses/intern-for-a-day-spring-2025-mandatory-orientation" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                          🎓 Start Orientation
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Arrow connector for desktop */}
                {index < studentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-umd-red/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Enhanced call to action */}
          <div className="text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-umd-red to-red-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <Button 
                size="lg" 
                variant="primary" 
                icon={ArrowRight}
                className="relative bg-gradient-to-r from-umd-red to-red-700 hover:from-red-700 hover:to-umd-red shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-bold"
              >
                <Link to="/login?type=student" className="block w-full">Start Your Journey Today</Link>
              </Button>
            </div>
            <p className="text-sm text-umd-gray-500 mt-3">
              Join the hundreds of students who have already transformed their careers
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-umd-red text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Fall 2025 Timeline</h2>
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
                    <p className="text-red-100 font-semibold mb-2">Aug 11 - Sep 29</p>
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
                    <p className="text-red-100 font-semibold mb-2">Sep 30 - Oct 14</p>
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
                    <p className="text-red-100 font-semibold mb-2">November 15</p>
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
                    <p className="text-red-100 font-semibold mb-2">Nov 25 - Dec 20</p>
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
                <p className="text-red-100 font-semibold text-sm mb-1">Aug 11 - Sep 29</p>
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
                <p className="text-red-100 font-semibold text-sm mb-1">Sep 30 - Oct 14</p>
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
                <p className="text-red-100 font-semibold text-sm mb-1">November 15</p>
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
                <p className="text-red-100 font-semibold text-sm mb-1">Nov 25 - Dec 20</p>
                <p className="text-red-200 text-xs">Shadowing and interviews commence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Hosts */}
      <section className="py-16 bg-gradient-to-br from-umd-black via-gray-900 to-umd-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">For Professionals Interested in Hosting an Intern for a Day Student(s)</h2>
            <p className="text-lg text-gray-100 leading-relaxed">
              Share your expertise and help students explore career opportunities
            </p>
            <div className="mt-6 p-6 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 max-w-4xl mx-auto">
              <p className="text-lg text-white font-semibold mb-3">
                Host registration for Intern for a Day in FALL 2025 will open Monday, August 11, through Monday, September 29, 2025.
              </p>
              <p className="text-gray-100 leading-relaxed">
                If you are a professional interested in participating in Intern for a Day as a host, please log in to the host portal and register for this semester.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className={`text-center h-full transition-all duration-500 delay-${index * 100} bg-umd-gold border-umd-gold`}>
                  <div className="w-12 h-12 bg-white text-umd-gold rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                   </div>
                  <h3 className="text-lg font-semibold text-umd-black mb-2 transition-colors duration-300 group-hover:text-umd-gold">{step.title}</h3>
                  <p className="text-sm text-umd-black">{step.description}</p>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-umd-black to-umd-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join hundreds of UMD students and professionals in building meaningful career connections
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
              <Link to="/login?type=host">Host Registration</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 