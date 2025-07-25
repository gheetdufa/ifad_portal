import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Star, Target, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/ui/Button';

// Add custom styles for animations
const customStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}
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
  const [activeTimeline, setActiveTimeline] = useState<'general' | 'host' | 'student'>('general');
  const [activeGeneralSemester, setActiveGeneralSemester] = useState<'fall' | 'spring'>('fall');

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
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // General Timeline Data (from transcript)
  const generalTimelines = {
    fall: [
      { phase: 'Host Registration', period: 'July-Sept', description: 'Host registration is open' },
      { phase: 'Student Orientation', period: 'Early/Mid-Oct', description: 'Students complete a mandatory orientation on workplace etiquette, program logistics, and more' },
      { phase: 'Student Applications', period: 'Mid/Late Oct', description: 'Students apply and rank order their top hosts of interest' },
      { phase: 'Matching Process', period: 'Late Oct/Early Nov', description: 'University Career Center staff match students with hosts & notify both parties' },
      { phase: 'IFAD Experience', period: 'Nov-Jan', description: 'Intern for a Day experience takes place! Students and hosts determine the day that works best with their schedules for the shadowing or virtual informational interviewing experience.' }
    ],
    spring: [
      { phase: 'Host Registration', period: 'Dec/Jan-Feb', description: 'Host registration is open' },
      { phase: 'Student Orientation', period: 'Mid/Late Feb', description: 'Students complete a mandatory orientation on workplace etiquette, program logistics, and more' },
      { phase: 'Student Applications', period: 'Early Mar', description: 'Students apply and rank order their top hosts of interest' },
      { phase: 'Matching Process', period: 'Early/Mid-Mar', description: 'University Career Center staff match students with hosts & notify both parties' },
      { phase: 'IFAD Experience', period: 'Mar-May', description: 'Intern for a Day experience takes place! Students and hosts determine the day that works best with their schedules for the shadowing or virtual informational interviewing experience.' }
    ]
  };

  // Fall 2025 Current Timeline Data
  const fall2025Timeline = {
    student: [
      { step: 'STEP 1', phase: 'Complete Mandatory Orientation', date: 'by Friday, October 10, 2025', description: '' },
      { step: 'STEP 2', phase: 'Receive and Complete IFAD Application', date: 'by Thursday, October 23, 2025', description: '' },
      { step: 'STEP 3', phase: 'University Career Center Matches You with a Host', date: 'late Oct - early Nov', description: '' },
      { step: 'STEP 4', phase: 'Engage in Job Shadowing or Informational Interviewing', date: 'by Jan 2026', description: 'with Your Host' }
    ],
    host: [
      { step: 'STEP 1', phase: 'Complete Host Registration', date: 'by Friday, September 29, 2025', description: '' },
      { step: 'STEP 2', phase: 'Host Vetting and Confirmation', date: 'October 1-6, 2025', description: '' },
      { step: 'STEP 3', phase: 'Receive Student Match from University Career Center', date: 'late Oct - early Nov', description: '' },
      { step: 'STEP 4', phase: 'Host Job Shadowing or Informational Interview', date: 'by Jan 2026', description: 'with Your Student' }
    ]
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Black Background with IFAD Logo */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-umd-gold to-yellow-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-br from-umd-gold to-yellow-300 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-white rounded-full opacity-10 animate-pulse"></div>
          
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 border border-white/10 rounded-full animate-spin-slow"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 border border-umd-gold/20 rounded-full animate-spin-slow-reverse"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - IFAD Logo */}
            <div className={`flex justify-center lg:justify-start lg:-ml-24 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                <img 
                  src={IFADLogoStatic} 
                  alt="IFAD Logo" 
                  className="relative h-[32rem] md:h-[40rem] object-contain drop-shadow-2xl transform hover:scale-110 transition-all duration-500 z-10 -ml-8"
                />
                <img 
                  src={IFADLogoPaperclips} 
                  alt="IFAD Paperclips" 
                  className="absolute -top-16 -left-32 h-[40rem] md:h-[48rem] w-auto drop-shadow-2xl z-20"
                  style={{
                    transformOrigin: 'center',
                    animation: 'spin 60s linear infinite reverse',
                    objectFit: 'contain',
                    maxWidth: 'none'
                  }}
                />
              </div>
            </div>
            
            {/* Right Side - What is IFAD Content */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              {/* Main Title */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight">
                  <span className="block bg-gradient-to-r from-umd-red via-red-400 to-umd-red bg-clip-text text-transparent">
                    INTERN
                  </span>
                  <span className="block bg-gradient-to-r from-umd-gold via-yellow-300 to-umd-gold bg-clip-text text-transparent">
                    FOR A DAY
                  </span>
                </h1>
                <div className="w-full h-2 bg-gradient-to-r from-umd-red to-umd-gold rounded-full"></div>
              </div>
              
              {/* Content Section */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white flex items-center">
                  <div className="w-3 h-3 bg-umd-gold rounded-full mr-4 animate-pulse"></div>
                  What is IFAD?
                </h2>
                
                <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-umd-gold/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-umd-red/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <p className="text-lg md:text-xl leading-relaxed text-white font-light mb-6 text-center">
                      The University Career Center's popular <span className="font-semibold text-umd-gold">Intern for a Day program</span> connects undergraduate UMD students with professionals (including alumni, parents/family members, and other off-campus partners) for <span className="font-semibold text-yellow-200">in-person job shadowing</span> or <span className="font-semibold text-yellow-200">virtual informational interviewing experiences</span> to explore potential career fields of interest.
                    </p>
                    
                    <div className="bg-black/20 rounded-2xl p-4 border-l-4 border-umd-gold mb-6">
                      <p className="text-base text-white leading-relaxed">
                        After participating in a <span className="font-semibold text-umd-gold">mandatory orientation</span> and completing an application, University Career Center staff match you with a professional of interest for a half- or full-day job shadowing experience or a virtual informational interview.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-umd-red/20 to-red-900/20 rounded-2xl p-4 text-center border border-red-400/30">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-2 h-2 bg-umd-gold rounded-full mr-2"></div>
                        <p className="text-base font-bold text-yellow-200 uppercase tracking-wide">Important Notice</p>
                        <div className="w-2 h-2 bg-umd-gold rounded-full ml-2"></div>
                      </div>
                      <p className="text-base text-yellow-100 font-medium">
                        IFAD is currently only available to UMD undergraduate students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How To Participate Section - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-umd-black mb-8">
              How To Participate in Intern for a Day
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Professionals */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-umd-black mb-6">
                For <span className="text-umd-red">Professionals</span> Interested in<br />
                Hosting IFAD Students
              </h3>
              
              <div className="bg-umd-red rounded-3xl p-8 min-h-96 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold mb-4">HOST REGISTRATION PROCESS</div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">1</span>
                      </div>
                      <p className="text-sm leading-relaxed">Complete Host Registration during open period</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">2</span>
                      </div>
                      <p className="text-sm leading-relaxed">Host Vetting and Confirmation process</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">3</span>
                      </div>
                      <p className="text-sm leading-relaxed">Receive Student Match from University Career Center</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">4</span>
                      </div>
                      <p className="text-sm leading-relaxed">Host Job Shadowing or Informational Interview with Your Student</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link to="/register/host" className="bg-white text-umd-red px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      Register as Host
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Students */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-umd-black mb-6">
                For <span className="text-umd-red">UMD undergraduate students</span><br />
                interested in participating in IFAD
              </h3>
              
              <div className="bg-umd-red rounded-3xl p-8 min-h-96 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold mb-4">STUDENT APPLICATION PROCESS</div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">1</span>
                      </div>
                      <p className="text-sm leading-relaxed">Complete Mandatory Orientation on workplace etiquette and program logistics</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">2</span>
                      </div>
                      <p className="text-sm leading-relaxed">Receive and Complete IFAD Application, ranking your top hosts</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">3</span>
                      </div>
                      <p className="text-sm leading-relaxed">University Career Center Matches You with a Host</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-umd-red font-bold text-sm">4</span>
                      </div>
                      <p className="text-sm leading-relaxed">Engage in Job Shadowing or Informational Interviewing with Your Host</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link to="/register/student" className="bg-white text-umd-red px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      Register as Student
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IFAD Timeline Section - Gradient Background */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-umd-red/10 to-transparent rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-umd-gold/10 to-transparent rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-umd-red/5 to-umd-gold/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-umd-red rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-umd-black via-gray-800 to-umd-black">
                IFAD TIMELINE
              </h2>
              <div className="w-3 h-3 bg-umd-gold rounded-full ml-3 animate-pulse"></div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-umd-red to-umd-gold rounded-full mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-umd-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              Here's what the typical timeline looks like for <span className="font-semibold text-umd-red">Intern for a Day</span> in case you'd like to plan for future semesters.
            </p>
          </div>
          
          {/* Enhanced Timeline Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 flex items-center shadow-2xl border border-gray-200/50">
              <button
                onClick={() => setActiveTimeline('general')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-500 relative overflow-hidden ${
                  activeTimeline === 'general'
                    ? 'bg-gradient-to-r from-umd-red to-red-600 text-white shadow-xl transform scale-105'
                    : 'text-umd-gray-600 hover:text-umd-red hover:bg-red-50'
                }`}
              >
                <span className="relative z-10">General Timeline</span>
                {activeTimeline === 'general' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-red/20 to-red-600/20 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTimeline('host')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-500 relative overflow-hidden ${
                  activeTimeline === 'host'
                    ? 'bg-gradient-to-r from-umd-black to-gray-800 text-white shadow-xl transform scale-105'
                    : 'text-umd-gray-600 hover:text-umd-black hover:bg-gray-50'
                }`}
              >
                <span className="relative z-10">Host Timeline</span>
                {activeTimeline === 'host' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-black/20 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTimeline('student')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-500 relative overflow-hidden ${
                  activeTimeline === 'student'
                    ? 'bg-gradient-to-r from-umd-gold to-yellow-500 text-black shadow-xl transform scale-105'
                    : 'text-umd-gray-600 hover:text-umd-gold hover:bg-yellow-50'
                }`}
              >
                <span className="relative z-10">Student Timeline</span>
                {activeTimeline === 'student' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-gold/20 to-yellow-500/20 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>


          {/* General Timeline */}
          {activeTimeline === 'general' && (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              {/* Semester Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 flex items-center shadow-xl border border-white/20">
                  <button
                    onClick={() => setActiveGeneralSemester('fall')}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-500 ${
                      activeGeneralSemester === 'fall'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'text-umd-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    🍂 Fall Semester
                  </button>
                  <button
                    onClick={() => setActiveGeneralSemester('spring')}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-500 ${
                      activeGeneralSemester === 'spring'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                        : 'text-umd-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    🌸 Spring Semester
                  </button>
                </div>
              </div>

              {/* General Timeline Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fall Timeline */}
                <div className={`transition-all duration-700 transform ${
                  activeGeneralSemester === 'fall' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-60 scale-95 translate-x-4'
                }`}>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-xl border border-orange-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-center mb-6">
                        <div className="text-2xl mr-2">🍂</div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                          FALL TIMELINE
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {generalTimelines.fall.map((item, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-orange-200/30 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-black text-orange-700 text-lg mb-1">{item.period}</h4>
                                <p className="text-gray-800 font-bold text-base mb-1">{item.phase}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spring Timeline */}
                <div className={`transition-all duration-700 transform ${
                  activeGeneralSemester === 'spring' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-60 scale-95 -translate-x-4'
                }`}>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border border-green-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-center mb-6">
                        <div className="text-2xl mr-2">🌸</div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                          SPRING TIMELINE
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {generalTimelines.spring.map((item, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-green-200/30 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-black text-green-700 text-lg mb-1">{item.period}</h4>
                                <p className="text-gray-800 font-bold text-base mb-1">{item.phase}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Host Timeline */}
          {activeTimeline === 'host' && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-2xl border border-orange-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-300/30 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-12">
                    <div className="text-3xl mr-3">🍂</div>
                    <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                      FALL 2025 HOST TIMELINE
                    </h3>
                  </div>
                  
                  {/* Timeline Container */}
                  <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-400 rounded-full shadow-lg"></div>
                    
                    <div className="space-y-8">
                      {fall2025Timeline.host.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Timeline Node */}
                          <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                            <span className="text-white font-black text-xl">{index + 1}</span>
                          </div>
                          
                          {/* Timeline Content */}
                          <div className="ml-8 flex-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200/50 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative">
                              {/* Arrow pointing to timeline */}
                              <div className="absolute left-0 top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-white -translate-x-4"></div>
                              
                              <div className="flex items-center mb-3">
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">{item.step}</span>
                                <h4 className="font-black text-orange-700 text-xl">{item.phase}</h4>
                              </div>
                              
                              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-3 border border-orange-300/50">
                                <p className="text-gray-800 font-bold text-lg">{item.date}</p>
                              </div>
                              
                              {item.description && (
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Timeline */}
          {activeTimeline === 'student' && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-2xl border border-orange-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-300/30 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-12">
                    <div className="text-3xl mr-3">🍂</div>
                    <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                      FALL 2025 STUDENT TIMELINE
                    </h3>
                  </div>
                  
                  {/* Timeline Container */}
                  <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-400 rounded-full shadow-lg"></div>
                    
                    <div className="space-y-8">
                      {fall2025Timeline.student.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Timeline Node */}
                          <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                            <span className="text-white font-black text-xl">{index + 1}</span>
                          </div>
                          
                          {/* Timeline Content */}
                          <div className="ml-8 flex-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200/50 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative">
                              {/* Arrow pointing to timeline */}
                              <div className="absolute left-0 top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-white -translate-x-4"></div>
                              
                              <div className="flex items-center mb-3">
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">{item.step}</span>
                                <h4 className="font-black text-orange-700 text-xl">{item.phase}</h4>
                              </div>
                              
                              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-3 border border-orange-300/50">
                                <p className="text-gray-800 font-bold text-lg">{item.date}</p>
                              </div>
                              
                              {item.description && (
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ready to Explore Section - Enhanced Design */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-umd-red/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-umd-gold/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enhanced Header */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-4 h-4 bg-umd-gold rounded-full mr-4 animate-bounce"></div>
              <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
                READY TO EXPLORE?
              </h2>
              <div className="w-4 h-4 bg-umd-red rounded-full ml-4 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="w-48 h-2 bg-gradient-to-r from-umd-red via-umd-gold to-umd-red rounded-full mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
              Take the next step in your professional journey with <span className="font-bold text-umd-gold">IFAD</span>
            </p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-gold via-yellow-400 to-umd-gold rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <Button
                size="lg"
                variant="secondary"
                className="relative px-16 py-8 text-2xl font-black bg-gradient-to-r from-umd-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-umd-gold transform hover:scale-110 transition-all duration-300 rounded-2xl shadow-2xl"
              >
                <Link to="/public-hosts" className="flex items-center space-x-3">
                  <span>🔍</span>
                  <span>Browse Host List</span>
                </Link>
              </Button>
            </div>
            
            <div className="text-3xl font-bold text-gray-400">OR</div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-red via-red-400 to-umd-red rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <Button
                size="lg"
                variant="secondary"
                className="relative px-16 py-8 text-2xl font-black bg-gradient-to-r from-umd-red to-red-400 text-white hover:from-red-400 hover:to-umd-red transform hover:scale-110 transition-all duration-300 rounded-2xl shadow-2xl"
              >
                <Link to="/register/student" className="flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Create a Profile</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Call to Action Subtitle */}
          <div className="mt-12">
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Join hundreds of UMD students who have already discovered their career paths through professional shadowing experiences
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section - Red Background */}
      <section className="py-16 bg-umd-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">IFAD VIDEO</h3>
              <div className="bg-white/10 rounded-lg p-8 h-48 flex items-center justify-center">
                <p className="text-lg">Video Content</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">IFAD FEEDBACK</h3>
              <div className="bg-white/10 rounded-lg p-8 h-48 flex items-center justify-center">
                <p className="text-lg">Feedback System</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">IFAD MEDIA GALLERY</h3>
              <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                {/* Image Gallery - 4:5 Aspect Ratio */}
                <div className="relative w-full max-w-xs mx-auto" style={{ aspectRatio: '4/5' }}>
                  <img 
                    src={galleryImages[currentImageIndex].src} 
                    alt={galleryImages[currentImageIndex].alt}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white shadow-lg scale-125' : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Caption overlay */}
                  <div className="absolute bottom-8 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-sm py-2 px-3 rounded-b-lg">
                    <p className="font-medium text-center">{galleryImages[currentImageIndex].caption}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mt-16 text-center">
            <p className="text-lg">
              Questions?{' '}
              <a href="mailto:IFAD@UMD.EDU" className="underline hover:text-umd-gold transition-colors font-bold">
                Email IFAD@UMD.EDU
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;