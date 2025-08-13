import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Building, Users, Calendar, Search, GraduationCap, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import SmallerLogo from '../assets/Smaller_logo.png';
import { apiService } from '../services/api';

interface PublicHost {
  id: string;
  ifadOption: string;
  spotsAvailable: number;
  careerFields: string[];
  companyName: string;
  jobTitle: string;
  website: string;
  companyDescription: string;
  hostExpectations: string;
  workLocation: string;
  dcMetroAccessible: string;
  federalAgency: string;
  requiresCitizenship: string;
  requiresBackgroundCheck: string;
  availableDays: string;
  springBreakAvailable: string;
  umdAlumni: string;
  additionalInfo: string;
}

const PublicHostList: React.FC = () => {
  const [hosts, setHosts] = useState<PublicHost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [selectedCareerField, setSelectedCareerField] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPublicHosts();
      
      if (response.success && Array.isArray(response.data?.hosts)) {
        setHosts(response.data.hosts as any);
      } else {
        // No fallback: show empty list when API has no data
        setHosts([]);
      }
    } catch (error) {
      console.error('Failed to load hosts:', error);
      setHosts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const allCareerFields = Array.from(
    new Set(
      (Array.isArray(hosts) ? hosts : []).reduce<string[]>((acc, host) => {
        const cf = Array.isArray(host.careerFields) ? host.careerFields : [];
        return acc.concat(cf);
      }, [])
    )
  );

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = host.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.careerFields.some(field => field.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         host.workLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterOption === 'all' || 
                         (filterOption === 'virtual' && host.ifadOption.includes('virtual')) ||
                         (filterOption === 'inperson' && host.ifadOption.includes('In-person')) ||
                         (filterOption === 'alumni' && host.umdAlumni === 'Yes') ||
                         (filterOption === 'metro' && host.dcMetroAccessible === 'Yes');

    const matchesCareerField = selectedCareerField === 'all' || 
                              host.careerFields.includes(selectedCareerField);

    return matchesSearch && matchesFilter && matchesCareerField;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-umd-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-umd-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <img 
              src={SmallerLogo} 
              alt="University of Maryland Logo" 
              className="h-20 w-auto"
            />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building className="w-8 h-8 text-umd-red animate-pulse" />
            <h1 className="text-4xl font-bold text-umd-black">
              Public Host Directory
            </h1>
          </div>
          <p className="text-lg text-umd-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our community of professionals offering virtual and in-person shadowing opportunities. 
            <span className="block mt-2 text-sm text-umd-gray-500">
              *Personal contact information is redacted for privacy and will only be shared with the student(s) matched with the host
            </span>
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umd-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search companies, roles, or fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-umd-gray-200 focus:border-umd-red transition-colors duration-300"
              />
            </div>

            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="px-4 py-2 border border-umd-gray-200 rounded-lg focus:border-umd-red focus:ring-1 focus:ring-umd-red transition-colors duration-300"
            >
              <option value="all">All Options</option>
              <option value="virtual">Virtual Only</option>
              <option value="inperson">In-Person Only</option>
              <option value="alumni">UMD Alumni</option>
              <option value="metro">Metro Accessible</option>
            </select>

            <select
              value={selectedCareerField}
              onChange={(e) => setSelectedCareerField(e.target.value)}
              className="px-4 py-2 border border-umd-gray-200 rounded-lg focus:border-umd-red focus:ring-1 focus:ring-umd-red transition-colors duration-300"
            >
              <option value="all">All Career Fields</option>
              {allCareerFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-umd-gray-600">
            Showing <span className="font-semibold text-umd-red">{filteredHosts.length}</span> opportunities
          </p>
        </div>

        {/* Host Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredHosts.map((host) => (
                          <Card 
                key={host.id} 
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-l-4 border-l-umd-red`}
              >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-umd-black group-hover:text-umd-red transition-colors duration-300">
                      {host.companyName}
                    </h3>
                    <p className="text-lg text-umd-gray-700 font-medium">{host.jobTitle}</p>
                    {host.website && (
                      <a 
                        href={host.website.startsWith('http') ? host.website : `https://${host.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-umd-red hover:text-umd-red-dark text-sm inline-flex items-center space-x-1 mt-1"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={host.ifadOption.includes('virtual') ? 'secondary' : 'primary'}>
                      {host.ifadOption.includes('virtual') ? 'Virtual' : 'In-Person'}
                    </Badge>
                    <div className="flex items-center space-x-1 text-umd-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{host.spotsAvailable} spot{host.spotsAvailable !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Career Fields */}
                <div>
                  <h4 className="text-sm font-semibold text-umd-gray-700 mb-2">Career Fields:</h4>
                  <div className="flex flex-wrap gap-2">
                    {host.careerFields.map((field, index) => (
                                          <Badge key={index} variant="secondary">
                        {field}
                    </Badge>
                    ))}
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <h4 className="text-sm font-semibold text-umd-gray-700 mb-2">About the Organization:</h4>
                  <p className="text-sm text-umd-gray-600 leading-relaxed">{host.companyDescription}</p>
                </div>

                {/* Experience Details */}
                <div>
                  <h4 className="text-sm font-semibold text-umd-gray-700 mb-2">What to Expect:</h4>
                  <p className="text-sm text-umd-gray-600 leading-relaxed">{host.hostExpectations}</p>
                </div>

                {/* Location and Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-umd-gray-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-umd-gray-500" />
                    <span className="text-sm text-umd-gray-600">{host.workLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-umd-gray-500" />
                    <span className="text-sm text-umd-gray-600">{host.availableDays}</span>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="pt-4 border-t border-umd-gray-200">
                  <h4 className="text-sm font-semibold text-umd-gray-700 mb-3">Requirements:</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center space-x-2">
                      {host.requiresCitizenship === 'Yes' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${host.requiresCitizenship === 'Yes' ? 'text-green-700' : 'text-gray-600'}`}>
                        US Citizenship Required
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {host.requiresBackgroundCheck === 'Yes' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${host.requiresBackgroundCheck === 'Yes' ? 'text-green-700' : 'text-gray-600'}`}>
                        Background Check Required
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {host.federalAgency === 'Yes' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${host.federalAgency === 'Yes' ? 'text-green-700' : 'text-gray-600'}`}>
                        Federal Agency
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {host.dcMetroAccessible === 'Yes' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${host.dcMetroAccessible === 'Yes' ? 'text-green-700' : 'text-gray-600'}`}>
                        DC Metro Accessible
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-umd-gray-700 mb-2">Additional Information:</h4>
                  <div className="flex flex-wrap gap-2">
                    {host.umdAlumni === 'Yes' && (
                      <Badge variant="success">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        UMD Alumni
                      </Badge>
                    )}
                    {host.springBreakAvailable === 'Yes' && (
                      <Badge variant="secondary">Spring Break Available</Badge>
                    )}
                    {host.ifadOption.includes('virtual') && (
                      <Badge variant="secondary">Virtual Interview</Badge>
                    )}
                    {host.ifadOption.includes('In-person') && (
                      <Badge variant="primary">In-Person Experience</Badge>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {host.additionalInfo && (
                  <div className="pt-2 border-t border-umd-gray-100">
                    <p className="text-xs text-umd-gray-500 italic">{host.additionalInfo}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-umd-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-umd-gray-700 mb-2">No hosts found</h3>
            <p className="text-umd-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-umd-red to-umd-red-dark text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="mb-6 text-red-100">
                Sign up to connect with these amazing professionals and start your IFAD journey!
              </p>
              <div className="space-x-4">
                <Button variant="secondary" size="lg">
                  Student Registration
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-umd-red">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicHostList; 