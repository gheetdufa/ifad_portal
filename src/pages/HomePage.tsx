import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Star, Target, Briefcase, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import IFADLogoStatic from '../assets/ifad_main_logos/10.png';
import IFADLogoPaperclips from '../assets/ifad_main_logos/2.png';
import Collage1 from '../assets/Collage_2024-12-05_19_51_38.jpg';
import Collage2 from '../assets/Collage_2024-12-05_20_37_53.jpg';
import Collage3 from '../assets/Collage_2024-12-05_20_59_03.jpg';
import Collage4 from '../assets/Collage_2024-12-05_21_00_42.jpg';
import UMDInterns1 from '../assets/2025 UMD interns.jpg';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Gallery images for rotating display
  const galleryImages = [
    { src: Collage1, alt: 'Students at DHS', caption: 'Department of Homeland Security' },
    { src: Collage2, alt: 'Student experiences', caption: 'Professional Networking' },
    { src: Collage3, alt: 'Student team', caption: 'Team Collaboration' },
    { src: Collage4, alt: 'Student presentation', caption: 'Professional Development' },
    { src: UMDInterns1, alt: 'UMD interns group', caption: 'UMD Intern Cohort' },
  ];

  // Auto-rotate gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [galleryImages.length]);

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

  const [activeTimeline, setActiveTimeline] = useState<'host' | 'student'>('student');

  const hostTimeline = [
    { phase: 'Host Registration', date: 'Aug 4 - Sep 29, 2025', description: 'Professionals register to mentor students' },
    { phase: 'Host List Creation', date: 'Sep 29 - Oct 6, 2025', description: 'Draft empty template and create host list' },
    { phase: 'Host Vetting & Confirmation', date: 'Oct 6, 2025', description: 'Complete host vetting and confirm participation' },
  ];

  const studentTimeline = [
    { phase: 'Online Orientation Opens', date: 'Sep 22 - Oct 10, 2025', description: 'Complete mandatory online orientation' },
    { phase: 'In-Person Orientation', date: 'Sep 30 & Oct 6, 2025', description: 'Attend one of two in-person sessions' },
    { phase: 'Student Application Sent', date: 'Oct 16, 2025', description: 'Applications distributed to students' },
    { phase: 'Student Application Due', date: 'Oct 23, 2025', description: 'Submit your application (1 day turnaround)' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Black Background with IFAD Logo and Profile Creation */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex items-center">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - IFAD Logo with Spinning Paperclips */}
            <div className={`flex justify-start transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                
                {/* Static Logo (10.png) - Scaled to 80% */}
                <img 
                  src={IFADLogoStatic} 
                  alt="IFAD Logo" 
                  className="relative h-[36rem] md:h-[44rem] w-auto drop-shadow-2xl transform hover:scale-110 transition-all duration-500 z-10"
                  style={{
                    transform: 'scale(0.8)'
                  }}
                />
                
                {/* Spinning Paperclips (2.png) - Full size, counterclockwise rotation around inner logo */}
                <img 
                  src={IFADLogoPaperclips} 
                  alt="IFAD Paperclips" 
                  className="absolute -top-20 -left-40 h-[44rem] md:h-[56rem] w-auto drop-shadow-2xl z-20"
                  style={{
                    transformOrigin: 'center',
                    animation: 'spin 60s linear infinite reverse',
                    objectFit: 'contain',
                    maxWidth: 'none'
                  }}
                />
              </div>
            </div>
            
            {/* Right side - Profile Creation */}
            <div className={`text-center lg:text-right transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                <span className="block text-white mb-4">Create Your</span>
                <span className="block bg-gradient-to-r from-umd-gold via-yellow-300 to-umd-gold bg-clip-text text-transparent">
                  IFAD Profile
                </span>
              </h1>
              
              {/* Profile Creation Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end mb-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-umd-red to-red-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                  <Button 
                    size="lg" 
                    variant="primary" 
                    icon={Users}
                    className="relative transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-10 py-5 text-xl font-bold bg-gradient-to-r from-umd-red to-red-700 hover:from-red-700 hover:to-umd-red"
                  >
                    <Link to="/register/student" className="block w-full">Student</Link>
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
                    <Link to="/register/host" className="block w-full">Host</Link>
                  </Button>
                </div>
              </div>
              
              {/* Login button */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-white to-gray-200 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                  <Button 
                    size="lg" 
                    variant="primary"
                    icon={Shield}
                    className="relative transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-10 py-5 text-xl font-bold bg-white text-black hover:bg-gray-100 hover:text-black"
                  >
                    <Link to="/login" className="block w-full">Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Intern for a Day - Red Background */}
      <section className="py-20 bg-gradient-to-br from-umd-red via-red-600 to-red-700 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/8 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/6 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
              Intern for a Day
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-200">
                What is Intern for a Day?
              </h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <p className="text-xl md:text-2xl leading-relaxed text-white font-light">
                  The University Career Center's popular Intern for a Day program connects undergraduate UMD undergraduate students with professionals (including alumni, parents/family members, and other off-campus partners) for in-person job shadowing or virtual informational interviewing experiences to explore potential career fields of interest. After participating in a mandatory orientation and completing an application, University Career Center staff match you with a professional of interest for a half- or full-day job shadowing experience or a virtual informational interview.
                </p>
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">👥</div>
                  <h4 className="text-lg font-semibold mb-2">Professional Connections</h4>
                  <p className="text-sm text-red-100">Connect with alumni, parents, and industry partners</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="text-lg font-semibold mb-2">Career Exploration</h4>
                  <p className="text-sm text-red-100">Explore potential career fields of interest</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">🤝</div>
                  <h4 className="text-lg font-semibold mb-2">Personalized Matching</h4>
                  <p className="text-sm text-red-100">Staff-matched experiences tailored to your interests</p>
                </div>
              </div>
            </div>
          </div>
          {/* Browse Host List Button */}
          <div className="flex flex-col items-center mt-12 space-y-4">
            <h4 className="text-2xl font-bold text-white mb-2">Ready to explore?</h4>
            <Button
              size="lg"
              variant="primary"
              className="px-10 py-5 text-xl font-bold bg-black text-white hover:bg-umd-gold hover:text-black shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Link to="/public-hosts" className="block w-full">Browse Host List</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section - White Background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-umd-black mb-4">Current Timeline</h2>
            <p className="text-xl text-umd-gray-700">Fall 2025 IFAD</p>
          </div>
          
          {/* Timeline Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-umd-gray-100 rounded-full p-1 flex items-center">
              <button
                onClick={() => setActiveTimeline('student')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTimeline === 'student'
                    ? 'bg-umd-red text-white shadow-lg transform scale-105'
                    : 'text-umd-gray-600 hover:text-umd-red'
                }`}
              >
                Student Timeline
              </button>
              <button
                onClick={() => setActiveTimeline('host')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTimeline === 'host'
                    ? 'bg-umd-red text-white shadow-lg transform scale-105'
                    : 'text-umd-gray-600 hover:text-umd-red'
                }`}
              >
                Host Timeline
              </button>
            </div>
          </div>
          
          {/* Timeline Content */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Host Timeline */}
              <div className={`transition-all duration-500 ${
                activeTimeline === 'host' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0'
              }`}>
                <h3 className="text-2xl font-bold text-umd-red mb-8 text-center">Host Timeline (Aug 4 - Oct 3, 2025)</h3>
                <div className="space-y-6">
                  {hostTimeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-umd-red rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-umd-black">{item.phase}</h4>
                        <p className="text-umd-red font-medium">{item.date}</p>
                        <p className="text-umd-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Student Timeline */}
              <div className={`transition-all duration-500 ${
                activeTimeline === 'student' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute inset-0'
              }`}>
                <h3 className="text-2xl font-bold text-umd-red mb-8 text-center">Student Timeline (Sep 22 - Oct 31, 2025)</h3>
                <div className="space-y-6">
                  {studentTimeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-umd-red rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-umd-black">{item.phase}</h4>
                        <p className="text-umd-red font-medium">{item.date}</p>
                        <p className="text-umd-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery and Stats Section - Yellow Background */}
      <section className="py-16 bg-umd-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Enhanced Rotating Gallery - Vertical */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-umd-black mb-8 text-center">Program Gallery</h3>
              
              {/* Gallery Container with Floating Effect */}
              <div className="relative w-96 h-[32rem] mx-auto group">
                {/* Animated Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-umd-red/20 via-umd-gold/30 to-umd-red/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
                
                {/* Main Gallery Frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-3xl hover:-translate-y-2 bg-black">
                  {/* Image with Enhanced Transitions */}
                  <div className="relative w-full h-full">
                    <img 
                      src={galleryImages[currentImageIndex].src} 
                      alt={galleryImages[currentImageIndex].alt}
                      className="w-full h-full transition-all duration-1000 transform hover:scale-110"
                      style={{
                        filter: 'brightness(1.1) contrast(1.05)',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        clipPath: 'inset(0 0 10% 0)',
                      }}
                    />
                    
                    {/* Animated Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
                    
                    {/* Floating Caption with Animation */}
                    <div className="absolute bottom-6 left-6 text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                      <h4 className="font-bold text-xl mb-2 drop-shadow-lg">{galleryImages[currentImageIndex].caption}</h4>
                      <div className="w-16 h-1 bg-umd-gold rounded-full transition-all duration-500 group-hover:w-24"></div>
                    </div>
                    
                    {/* Enhanced Navigation Arrows */}
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex - 1 + galleryImages.length) % galleryImages.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex + 1) % galleryImages.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Gallery Indicators */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentImageIndex 
                          ? 'w-8 h-3 bg-umd-red shadow-lg' 
                          : 'w-3 h-3 bg-umd-black/40 hover:bg-umd-black/60 hover:scale-125'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Stats and Testimonials */}
            <div>
              <h3 className="text-2xl font-bold text-umd-black mb-8 text-center">IFAD Impact</h3>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {impactStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-8 h-8 text-umd-red" />
                    </div>
                    <div className="text-2xl font-bold text-umd-black">{stat.value}</div>
                    <div className="text-sm text-umd-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Testimonials */}
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <div>
                        <h4 className="font-semibold text-umd-black text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-umd-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-umd-gray-700 text-sm mb-2">{testimonial.content}</p>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-umd-gold text-umd-gold" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;