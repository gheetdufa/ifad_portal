import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import LogoWhite from '../../assets/logo_white.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-umd-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-start">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img 
              src={LogoWhite} 
              alt="University of Maryland Logo" 
              className="h-36 w-auto focus:outline-none focus:ring-4 focus:ring-umd-gold/50"
              tabIndex="0"
            />
          </div>

          {/* Right side - Contact Info */}
          <div className="text-right">
            <div className="text-lg font-bold text-umd-gray-300 mb-2">
              University Career Center & The President's Promise
            </div>
            <div className="text-sm text-umd-gray-300 mb-1">
              3100 Hornbake Library, South Wing
            </div>
            <div className="text-sm text-umd-gray-300 mb-3">
              301.314.7225
            </div>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-umd-gray-300">Questions?</span>
              <Mail size={16} className="text-umd-gold flex-shrink-0" aria-hidden="true" />
              <a href="mailto:ifad@umd.edu" className="text-umd-gray-300 hover:text-umd-gold transition-colors focus:outline-none focus:ring-4 focus:ring-umd-gold/50 rounded" aria-label="Send email to IFAD program">
                ifad@umd.edu
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;