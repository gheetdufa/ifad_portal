import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Star, Target, Briefcase, ChevronDown, ChevronUp, Video, MessageSquareQuote } from 'lucide-react';
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
  
  @keyframes rotateClockwise {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-rotate-clockwise {
    animation: rotateClockwise 40s linear infinite;
  }

  @keyframes marqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee {
    animation: marqueeScroll 60s linear infinite;
    will-change: transform;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}
import InternForADayRing from '../assets/intern_for_a_day_ring.svg';
import InternForADayText from '../assets/intern_for_a_day_text.svg';
// Slideshow assets (all from photo_slideshow folder)
import Homeland1 from '../assets/photo_slideshow/homeland security.png';
import Homeland2 from '../assets/photo_slideshow/homeland_security.png';
import Homeland3 from '../assets/photo_slideshow/Screenshot 2025-08-12 015401.png';
import Homeland4 from '../assets/photo_slideshow/Screenshot 2025-08-12 015415.png';
import UMDInterns1 from '../assets/photo_slideshow/2025 UMD interns.jpg';
import BHChambers from '../assets/photo_slideshow/BH-Chambers.webp';
import Image001 from '../assets/photo_slideshow/image001-1.webp';
import JudgeOffice from '../assets/photo_slideshow/judge office.jpg';
// New slideshow images
import Medical from '../assets/photo_slideshow/medical.jpg';
import Podcast from '../assets/photo_slideshow/podcast.png';
import News from '../assets/photo_slideshow/news.jpg';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState<'general' | 'host' | 'student'>('general');
  const [activeGeneralSemester, setActiveGeneralSemester] = useState<'fall' | 'spring'>('fall');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Gallery images for rotating display
  const galleryImages = [
    { src: UMDInterns1, alt: 'Navy Federal Credit Union visit', caption: 'Navy Federal Credit Union' },
    { src: Homeland1, alt: 'Homeland Security networking event', caption: 'Homeland Security – Networking' },
    { src: BHChambers, alt: 'BH-Chambers experience', caption: 'BH-Chambers' },
    { src: Homeland2, alt: 'Homeland Security office visit', caption: 'Homeland Security – Office Visit' },
    { src: Image001, alt: 'Circuit Court for Montgomery County', caption: 'Circuit Court for Montgomery County' },
    { src: Homeland3, alt: 'Homeland Security team discussion', caption: 'Homeland Security – Team Collaboration' },
    { src: Medical, alt: 'Visit to hospital', caption: 'Visit to Hospital' },
    { src: Homeland4, alt: 'Homeland Security presentation', caption: 'Homeland Security – Presentation' },
    { src: Podcast, alt: 'Brand Groupies', caption: 'Brand Groupies' },
    { src: JudgeOffice, alt: 'Circuit Court for Montgomery County offices', caption: 'Montgomery County Circuit Court' },
    { src: News, alt: "Voice of America's English to Africa division", caption: "Voice of America's English to Africa Division" },
  ];

  // Feedback quotes for scrolling marquee in Student Experience section
  const feedbackQuotes: { text: string; source: string }[] = [
    {
      text:
        "I hosted 3 virtual participants -- all were curious, well prepared (had researched me on Linked in and had looked at my organization's web page) and open to suggestions. I lined two of them up for an additional interview with colleagues.",
      source: 'United State Department of Agriculture',
    },
    {
      text:
        'This year was the best year yet! The students were actively interested in my field of work and not just my company. They asked thoughtful questions and showed their excitement.',
      source: 'LinkedIn',
    },
    {
      text:
        'The Intern for a Day program is a great initiative, and it was a pleasure hosting students. It allows them to gain real-world experience and insights into our industry. We appreciate the opportunity to help foster their career development.',
      source: 'Beta Systems International',
    },
    {
      text:
        'I thoroughly enjoyed having the interns. Each one was very respectful and ready to listen and learn. Some gelled with the team so well it felt like they were one of the staff, and by the end of the day we were sad to see them go. I would definitely host students again and would love to make this a regular event each spring and fall.',
      source: 'Carrie Murray Nature Center',
    },
    {
      text:
        'My biggest highlight was seeing opportunities available that I never had thought about. I was able to learn about a career that involved traveling the world, while on a good salary and being trained to work for the company.',
      source: 'UMD Student Match w/ U.S. Department of State Diplomatic Security Service',
    },
    {
      text:
        'My experience made me realize that I needed to change my major. Especially speaking to employees of the company that specialized/had leadership roles where I wanted to be in the future.',
      source: 'UMD Student Match w/ Crosby Marketing',
    },
    {
      text: 'I definitely gained networking skills and insight into the industry I explored.',
      source: 'UMD Student Match w/ ESPN',
    },
    {
      text:
        'I had never previously considered how different fields within the scope of social and behavioral sciences are connected to one another, but this experience showed me how skills learned in psychology and disability skills were interconnected. With this knowledge, I gained insight on how the data-driven aspect, along with the ABA facilitation, helps to fit the needs of each student.',
      source: 'UMD Student Match w/ Ivymount',
    },
    {
      text:
        "The highlight of my day was when the nurse that was helping the mother deliver her baby asked me if I wanted to help with the delivery process. I was ecstatic when she asked me to hold one of the mother's legs so that it would be easier for her to push, and I honestly believe labor and delivery is such a rewarding field because after 3 hours of witnessing the mother struggle to push, the look on her face when she finally was able to meet her baby boy was priceless.",
      source: 'UMD Student Match',
    },
    {
      text:
        'In speaking with Ms. Hymes about my internship plans for the summer, she informed me initially that the 2018 internship class for VOA English to Africa was full, but after sending my thank you note and expressing interest in a fall internship spot, she told me that there was one more summer spot available, and I jumped at it!',
      source: 'UMD Student Match w/ VOA English to Africa',
    },
  ];

  // Function to change image with transition
  const changeImage = (newIndex: number) => {
    if (newIndex === currentImageIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setIsTransitioning(false);
    }, 250); // Half of the transition duration
  };

  // Auto-rotate gallery
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % galleryImages.length;
      changeImage(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentImageIndex, galleryImages.length]);

  // General Timeline Data (from transcript)
  const generalTimelines = {
    fall: [
      { phase: 'Host Registration', period: 'July-Sept', description: 'Host registration is open' },
      { phase: 'Student Orientation', period: 'Early/Mid-Oct', description: 'Students complete a mandatory orientation on workplace etiquette, program logistics, and more' },
      { phase: 'Student Applications', period: 'Mid/Late Oct', description: 'Students apply and rank order their top hosts of interest' },
      { phase: 'Matching Process', period: 'Late Oct/Early Nov', description: 'University Career Center staff match students with hosts & notify both parties' },
      { phase: 'IFAD Experience', period: 'Early Nov-Late Jan', description: 'Intern for a Day experience takes place! Students and hosts determine the day that works best with their schedules for the shadowing or virtual informational interviewing experience.' }
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
      { step: 'STEP 3', phase: 'Receive Student Match(es) from University Career Center', date: 'late Oct - early Nov', description: '' },
      { step: 'STEP 4', phase: 'Host Job Shadowing or Informational Interview', date: 'by Jan 2026', description: 'with Your Student(s)' }
    ]
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Black Background with IFAD Logo */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen md:min-h-[95vh] flex items-center" role="banner" aria-label="IFAD Program Introduction">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - IFAD Logo */}
            <div className={`flex justify-center lg:justify-start lg:-ml-64 xl:-ml-80 2xl:-ml-96 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                <div className="relative h-[28rem] sm:h-[36rem] md:h-[43rem] lg:h-[52rem] xl:h-[66rem] flex items-center justify-center group">
                  {/* Rotating Ring */}
                  <img 
                    src={InternForADayRing} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-contain animate-rotate-clockwise group-hover:scale-110 transition-all duration-500"
                    aria-hidden="true"
                  />
                  {/* Static Text - Made smaller */}
                  <img 
                    src={InternForADayText} 
                    alt="Intern for a Day Program Logo - University of Maryland Career Center" 
                    className="relative w-[70%] h-[70%] md:w-[72%] md:h-[72%] object-contain drop-shadow-2xl transform group-hover:scale-110 transition-all duration-500 z-10 focus:outline-none focus:ring-4 focus:ring-umd-gold/50"
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
            
            {/* Right Side - What is IFAD Content */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              {/* Main Title */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 leading-none tracking-tight">
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
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">
                  What is Intern for a Day (IFAD)?
                </h2>
                
                <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-umd-gold/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-umd-red/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-white font-light mb-4 sm:mb-6 text-left">
                      The University of Maryland University Career Center's popular <span className="font-semibold text-umd-gold">Intern for a Day (IFAD) program</span> connects undergraduate UMD students with professionals (including alumni, parents/family members, and other off-campus partners) for <span className="italic text-white">in-person job shadowing</span> or <span className="italic text-white">virtual informational interviewing</span> experiences to explore potential career fields of interest.
                    </p>
                    
                    <div className="bg-black/20 rounded-2xl p-4 border-l-4 border-umd-gold mb-6">
                      <p className="text-base text-white leading-relaxed">
                        After participating in a <span className="font-semibold text-umd-gold">mandatory orientation</span> and completing an application, University Career Center staff match you with a professional of interest for a half- or full-day job shadowing experience or a virtual informational interview.
                      </p>
                      <p className="text-sm text-umd-gold leading-relaxed mt-3 italic">
                        <strong>Please note:</strong> Due to the high demand and limited host availability, we cannot guarantee that all students who apply will be matched in the program.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-umd-red/20 to-red-900/20 rounded-2xl p-4 text-center border border-red-400/30">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-2 h-2 bg-umd-gold rounded-full mr-2"></div>
                        <p className="text-base font-bold text-umd-gold uppercase tracking-wide">Important Notice</p>
                        <div className="w-2 h-2 bg-umd-gold rounded-full ml-2"></div>
                      </div>
                      <p className="text-base text-umd-gold font-medium">
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

      {/* Scrolling Feedback Marquee – relocated down to Student Experience */}

      {/* How To Participate Section - White Background */}
      <section className="py-8 sm:py-12 bg-white relative overflow-hidden" role="main" aria-label="Participation Information">
        {/* Subtle Background Images */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img 
            src={Homeland2} 
            alt="" 
            className="absolute top-10 right-10 w-48 h-48 object-cover rounded-full blur-sm"
            aria-hidden="true"
          />
          <img 
            src={UMDInterns1} 
            alt="" 
            className="absolute bottom-10 left-10 w-40 h-40 object-cover rounded-full blur-sm"
            aria-hidden="true"
          />
          <img 
            src={Homeland3} 
            alt="" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full blur-sm opacity-30"
            aria-hidden="true"
          />
        </div>
        
        <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
          <div className="space-y-6">
            {/* Section Headers */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                For Professionals
              </h2>
              <div></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                For Students
              </h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              
              {/* For Professionals - Host Box */}
              <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl p-6 shadow-xl border border-orange-200/50 relative overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg mb-3">
                      <span className="text-2xl">🏢</span>
                    </div>
                  </div>
                
                <h3 className="text-base font-bold text-orange-700 mb-3">
                  To register and participate in Intern for a Day as a HOST:
                </h3>
                
                {/* Steps */}
                <div className="space-y-2 mb-4">
                  {[
                    "Create an Intern for a Day (IFAD) host profile",
                    "Host complete the host registration to be an IFAD host for 20xx semester during the opening period",
                    "IFAD Coordinators will begin the matching process after student applications are submitted",
                    "Host & student(s) will be notified about their matching status via email",
                    "Host & student(s) schedules IFAD experience based on availabilities",
                    "Host complete the IFAD experience with student(s) by the end of the semester",
                    "Host completes the host experience survey and provides feedback"
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white/60 rounded-lg p-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white font-bold text-xs">{index + 1}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                
                {/* Notice */}
                <div className="bg-amber-50 border-l-4 border-orange-500 p-3 mb-4 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>NOTE:</strong> We cannot guarantee we will be able to match you with a student, but we will try our best! You will be notified regardless of whether you were matched or not.
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col gap-3 sm:gap-2">
                  <a 
                    href="/register/host" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-center text-base min-h-[48px] touch-manipulation"
                  >
                    Create IFAD Host Profile
                  </a>
                  <a 
                    href="/login" 
                    className="bg-white text-orange-600 border-2 border-orange-500 px-6 py-4 rounded-lg font-bold hover:bg-orange-50 transition-all duration-300 text-center text-base min-h-[48px] touch-manipulation"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>

              {/* IFAD Media Gallery Section - Middle Column */}
              <div className="bg-gradient-to-br from-umd-gold/20 via-yellow-50 to-umd-gold/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-yellow-200/60 h-full flex flex-col justify-start">
                {/* Image Gallery - Natural photo dimensions */}
                <div className="flex-grow flex items-center justify-center">
                  <div className="max-w-lg max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[750px] bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                      src={galleryImages[currentImageIndex].src} 
                      alt={galleryImages[currentImageIndex].alt}
                      className={`w-full h-auto object-contain shadow-lg max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[750px] transition-opacity duration-500 ease-in-out ${
                        isTransitioning ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Picture Navigation Dots */}
                <div className="flex justify-center mt-4 space-x-3 sm:space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeImage(index)}
                      className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-umd-gold touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[24px] sm:min-w-[24px] flex items-center justify-center ${
                        index === currentImageIndex ? 'bg-umd-gold shadow-lg scale-125' : 'bg-gray-400 hover:bg-gray-600'
                      }`}
                      aria-label={`View image ${index + 1} of ${galleryImages.length}: ${galleryImages[index].caption}`}
                      aria-pressed={index === currentImageIndex}
                    />
                  ))}
                </div>
                
                {/* Caption below gallery */}
                <div className="mt-4 text-center">
                  <p className={`text-base sm:text-lg md:text-xl font-semibold text-gray-800 transition-opacity duration-500 ease-in-out ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}>
                    {galleryImages[currentImageIndex].caption}
                  </p>
                </div>
              </div>

              {/* For Students - Student Box */}
              <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-6 shadow-xl border border-green-200/50 relative overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg mb-3">
                      <span className="text-2xl">🎓</span>
                    </div>
                  </div>
                
                <h3 className="text-base font-bold text-green-700 mb-3">
                  To participate in Intern for a Day as a UMD STUDENT:
                </h3>
                
                {/* Steps */}
                <div className="space-y-2 mb-4">
                  {[
                    "Create an Intern for a Day (IFAD) student profile",
                    "Interested students complete the mandatory IFAD orientation for 20xx semester (see Handshake for details)",
                    "Students who complete the IFAD mandatory orientation will receive an IFAD application after the asynchronous orientation closes.",
                    "Students complete and submit the IFAD student application by the designated deadline",
                    "IFAD Coordinators will immediately begin the matching process after student applications are submitted",
                    "Student & host will be notified about their matching status via email",
                    "Student will reach out to the host to schedule the experience & provide an introduction.",
                    "Student complete the IFAD experience with host match by the end of the semester",
                    "Student complete the student experience survey and provide feedback"
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white/60 rounded-lg p-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white font-bold text-xs">{index + 1}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                
                {/* Notice */}
                <div className="bg-amber-50 border-l-4 border-green-500 p-3 mb-4 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>NOTE:</strong> We cannot guarantee we will be able to match you with a host, but we will try our best! You will be notified regardless of whether you were matched or not.
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col gap-3 sm:gap-2">
                  <a 
                    href="/register/student" 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-center text-base min-h-[48px] touch-manipulation"
                  >
                    Create IFAD Student Profile
                  </a>
                  <a 
                    href="/login" 
                    className="bg-white text-green-600 border-2 border-green-500 px-6 py-4 rounded-lg font-bold hover:bg-green-50 transition-all duration-300 text-center text-base min-h-[48px] touch-manipulation"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
            
            </div>
          </div>
        </div>
      </section>


      {/* IFAD Timeline Section - TEMPORARILY HIDDEN */}
      {/* 
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
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
          
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 flex items-center space-x-2 shadow-2xl border border-gray-200/50" role="tablist" aria-label="Timeline Options">
              <button
                onClick={() => setActiveTimeline('general')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-700 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-umd-red/50 ${
                  activeTimeline === 'general'
                    ? 'bg-gradient-to-r from-umd-red to-red-600 text-white shadow-xl transform scale-105'
                    : 'text-gray-800 hover:text-white hover:bg-umd-red/90 bg-white border-2 border-transparent hover:border-umd-red'
                }`}
                role="tab"
                aria-selected={activeTimeline === 'general'}
                aria-controls="general-timeline-panel"
                tabIndex={activeTimeline === 'general' ? 0 : -1}
              >
                <span className="relative z-10">General Timeline</span>
                {activeTimeline === 'general' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-red/30 to-red-600/30 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTimeline('host')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-700 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-umd-red/50 ${
                  activeTimeline === 'host'
                    ? 'bg-gradient-to-r from-umd-red to-red-600 text-white shadow-xl transform scale-105'
                    : 'text-gray-800 hover:text-white hover:bg-umd-red/90 bg-white border-2 border-transparent hover:border-umd-red'
                }`}
                role="tab"
                aria-selected={activeTimeline === 'host'}
                aria-controls="host-timeline-panel"
                tabIndex={activeTimeline === 'host' ? 0 : -1}
              >
                <span className="relative z-10">Host Timeline</span>
                {activeTimeline === 'host' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-red/30 to-red-600/30 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTimeline('student')}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-700 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-umd-red/50 ${
                  activeTimeline === 'student'
                    ? 'bg-gradient-to-r from-umd-red to-red-600 text-white shadow-xl transform scale-105'
                    : 'text-gray-800 hover:text-white hover:bg-umd-red/90 bg-white border-2 border-transparent hover:border-umd-red'
                }`}
                role="tab"
                aria-selected={activeTimeline === 'student'}
                aria-controls="student-timeline-panel"
                tabIndex={activeTimeline === 'student' ? 0 : -1}
              >
                <span className="relative z-10">Student Timeline</span>
                {activeTimeline === 'student' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-umd-red/30 to-red-600/30 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {activeTimeline === 'general' && (
            <div className="max-w-6xl mx-auto animate-fadeIn" role="tabpanel" id="general-timeline-panel" aria-labelledby="general-timeline-tab">
              <div className="flex justify-center mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 flex items-center shadow-xl border border-white/20">
                  <button
                    onClick={() => setActiveGeneralSemester('fall')}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 ${
                      activeGeneralSemester === 'fall'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-800 hover:text-white hover:bg-orange-500 bg-white border-2 border-transparent hover:border-orange-500'
                    }`}
                    aria-pressed={activeGeneralSemester === 'fall'}
                  >
                    <span aria-hidden="true">🍂</span> Fall Semester
                  </button>
                  <button
                    onClick={() => setActiveGeneralSemester('spring')}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-green-500/50 ${
                      activeGeneralSemester === 'spring'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-800 hover:text-white hover:bg-green-500 bg-white border-2 border-transparent hover:border-green-500'
                    }`}
                    aria-pressed={activeGeneralSemester === 'spring'}
                  >
                    <span aria-hidden="true">🌸</span> Spring Semester
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {activeTimeline === 'host' && (
            <div className="max-w-4xl mx-auto animate-fadeIn" role="tabpanel" id="host-timeline-panel" aria-labelledby="host-timeline-tab">
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
                  
                  <div className="relative">
                    <div className="absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-400 rounded-full shadow-lg"></div>
                    
                    <div className="space-y-8">
                      {fall2025Timeline.host.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                            <span className="text-white font-black text-xl">{index + 1}</span>
                          </div>
                          
                          <div className="ml-8 flex-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200/50 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative">
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

          {activeTimeline === 'student' && (
            <div className="max-w-4xl mx-auto animate-fadeIn" role="tabpanel" id="student-timeline-panel" aria-labelledby="student-timeline-tab">
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
                  
                  <div className="relative">
                    <div className="absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-400 rounded-full shadow-lg"></div>
                    
                    <div className="space-y-8">
                      {fall2025Timeline.student.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                            <span className="text-white font-black text-xl">{index + 1}</span>
                          </div>
                          
                          <div className="ml-8 flex-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200/50 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative">
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
      */}


      {/* Ready to Explore Section - Enhanced Design */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
                READY TO EXPLORE?
              </h2>
              <div className="w-4 h-4 bg-umd-red rounded-full ml-4 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="w-48 h-2 bg-gradient-to-r from-umd-red via-umd-gold to-umd-red rounded-full mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
              Take the next step in your professional journey with <span className="font-bold text-umd-gold">IFAD</span>
            </p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-gold via-yellow-400 to-umd-gold rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <Button
                size="lg"
                variant="secondary"
                className="relative px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-umd-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-umd-gold transform hover:scale-110 transition-all duration-300 rounded-2xl shadow-2xl"
              >
                <a href="/public-hosts" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
                  <span>🔍</span>
                  <span>Browse Host List</span>
                </a>
              </Button>
            </div>
            
            <div className="text-3xl font-bold text-gray-400">OR</div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-umd-red via-red-400 to-umd-red rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <Button
                size="lg"
                variant="secondary"
                className="relative px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-umd-red to-red-400 text-white hover:from-red-400 hover:to-umd-red transform hover:scale-110 transition-all duration-300 rounded-2xl shadow-2xl"
              >
                <a href="/register/student" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Create a Profile</span>
                </a>
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

      {/* Footer Section - Additional Resources */}
      <section className="py-12 sm:py-16 lg:py-20 bg-umd-red text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-umd-gold/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              More about IFAD
            </h2>
            <div className="w-32 h-1 bg-umd-gold rounded-full mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
              Get more information about the Intern for a Day (IFAD) program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Program Overview */}
            <div className="group h-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 text-center h-full flex flex-col">
                <div className="flex items-center justify-center mb-4">
                  <Video className="text-white" size={40} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Program Overview</h3>
                <p className="text-red-100 mb-6 leading-relaxed">
                  Watch our comprehensive video to learn more about the IFAD experience and hear from past participants.
                </p>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/20 mt-auto">
                  <video 
                    controls 
                    className="w-full h-auto max-h-48 sm:max-h-56 md:max-h-64 object-cover"
                    poster=""
                    preload="metadata"
                    playsInline
                    controlsList="nodownload"
                  >
                    <source src="/videos/20250729_102029 - Tracy Owusu.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="group h-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                <div className="flex items-center justify-center mb-4">
                  <MessageSquareQuote className="text-white" size={40} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">Testimonials</h3>
                
                {/* Rotating Testimonials (gallery-like, single card) */}
                <div className="bg-white rounded-xl p-6 border border-white/30 relative shadow-lg overflow-hidden mx-auto max-w-2xl flex-1 flex items-center justify-center">
                  <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {(() => {
                      const item = feedbackQuotes[currentImageIndex % feedbackQuotes.length];
                      return (
                        <figure>
                          <blockquote className="text-gray-800 leading-relaxed italic text-center">{`“${item.text}”`}</blockquote>
                          <figcaption className="mt-4 text-center text-sm"><span className="font-bold text-gray-900">{item.source}</span></figcaption>
                        </figure>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Information */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Questions?</h3>
              <p className="text-red-100 text-base sm:text-lg">
                For more information about the IFAD program, contact us at <a href="mailto:ifad@umd.edu" className="text-umd-gold hover:text-yellow-300 transition-colors duration-300 underline">
                  ifad@umd.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;