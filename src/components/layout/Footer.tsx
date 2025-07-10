import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-umd-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-umd-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">UM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">IFAD Portal</h3>
                <p className="text-umd-gray-400 text-sm">University of Maryland Career Center</p>
              </div>
            </div>
            <p className="text-umd-gray-300 text-sm leading-relaxed max-w-md">
              Connecting UMD students with professionals for meaningful career exploration 
              through job shadowing and informational interviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-umd-gray-300 hover:text-umd-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-umd-gray-300 hover:text-umd-gold transition-colors">
                  About IFAD
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-umd-gray-300 hover:text-umd-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-umd-gray-300 hover:text-umd-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-umd-gold flex-shrink-0" />
                <span className="text-umd-gray-300">
                  3100 Hornbake Library<br />
                  University of Maryland<br />
                  College Park, MD 20742
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-umd-gold flex-shrink-0" />
                <span className="text-umd-gray-300">(301) 405-4774</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-umd-gold flex-shrink-0" />
                <span className="text-umd-gray-300">IFAD@umd.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-umd-gray-800 mt-8 pt-8 text-center">
          <p className="text-umd-gray-400 text-sm">
            © 2024 University of Maryland Career Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;