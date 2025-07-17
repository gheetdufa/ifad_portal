import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Building, Users, Calendar, Search, GraduationCap, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import SmallerLogo from '../assets/Smaller_logo.png';

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
    // Convert CSV data to usable format - sample hosts with redacted personal info
    const processedHosts: PublicHost[] = [
      {
        id: '1',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 1,
        careerFields: ['Agriculture/Environment', 'Consulting', 'Engineering', 'Science and Research'],
        companyName: 'Stantec',
        jobTitle: 'Associate',
        website: 'www.stantec.com',
        companyDescription: 'Stantec is a global leader in sustainable engineering, architecture, and environmental consulting. We are designers, engineers, scientists, project managers, and strategic advisors.',
        hostExpectations: 'Students will learn about environmental services, assessment and remediation of contaminated sites, working with various engineers and scientists in evaluating chemicals and remediation strategies.',
        workLocation: 'Naples, FL 34105',
        dcMetroAccessible: 'No',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'Yes',
        additionalInfo: 'Flexible with timing, can accommodate students with different academic schedules.'
      },
      {
        id: '2',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 1,
        careerFields: ['Architecture/Real Estate', 'Business'],
        companyName: 'Jersey Mikes',
        jobTitle: 'Director of Real Estate',
        website: 'www.jerseymikes.com',
        companyDescription: 'Director of Real Estate for Jersey Mikes Subs. Finding sites and negotiating deals in partnership with franchisees across the northeast region.',
        hostExpectations: 'Students will learn about career paths in real estate, site selection, deal negotiation, and working with franchisees.',
        workLocation: 'Manasquan, NJ',
        dcMetroAccessible: 'No',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'Yes',
        additionalInfo: '8-9 year career in real estate with various job experiences.'
      },
      {
        id: '3',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 1,
        careerFields: ['Business', 'Consulting', 'Human Resources'],
        companyName: 'T-Rex Solutions LLC',
        jobTitle: 'Talent Management, Senior Manager',
        website: 'T-RexsolutionsLLC.com',
        companyDescription: 'T-Rex Solutions LLC is a leading IT professional services firm helping federal government modernize, protect, and scale its systems and data.',
        hostExpectations: 'Share experience with students interested in pursuing jobs in Human Resources or Government Contracting Industry.',
        workLocation: 'Bethesda, MD 20817',
        dcMetroAccessible: 'Yes',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Morning schedule preferred',
        springBreakAvailable: 'No',
        umdAlumni: 'No',
        additionalInfo: 'Morning schedule preferred'
      },
      {
        id: '4',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 1,
        careerFields: ['Cybersecurity', 'Engineering', 'Government and International Relations', 'Law and Law Enforcement', 'Military'],
        companyName: 'Diplomatic Security Service',
        jobTitle: 'Special Agent',
        website: 'https://www.state.gov/about-us-bureau-of-diplomatic-security/',
        companyDescription: 'DSS Special Agents are sworn federal law enforcement officers, specially trained Foreign Service security professionals and U.S. Diplomats.',
        hostExpectations: 'Learn about protecting American diplomats, conducting investigations, handling fraud cases, counterintelligence, and international security operations.',
        workLocation: 'Washington, DC 20520',
        dcMetroAccessible: 'Yes',
        federalAgency: 'Yes',
        requiresCitizenship: 'Yes',
        requiresBackgroundCheck: 'Yes',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'Yes',
        additionalInfo: 'High-security environment with extensive background requirements.'
      },
      {
        id: '5',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 2,
        careerFields: ['Agriculture/Environment'],
        companyName: 'Choose Clean Water Coalition',
        jobTitle: 'Policy Specialist',
        website: 'https://www.choosecleanwater.org/',
        companyDescription: 'The Choose Clean Water Coalition advocates for clean rivers and streams in the Chesapeake Bay region, coordinating policy and advocacy.',
        hostExpectations: 'Gain insight into environmental advocacy work and learn about being a leader in environmental policy.',
        workLocation: 'Annapolis, MD 21401',
        dcMetroAccessible: 'No',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'Yes',
        additionalInfo: 'Focus on environmental advocacy and policy work.'
      },
      {
        id: '6',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 2,
        careerFields: ['Computing/Computer Science and Technology', 'Data Science and Analytics'],
        companyName: 'Capital One',
        jobTitle: 'Cyber Technical Associate',
        website: 'capitalone.com',
        companyDescription: 'Capital One is a tech company masquerading as a bank, focusing on technology innovation in financial services.',
        hostExpectations: 'Anyone interested in anything remotely related to technology will benefit from a conversation about tech careers in banking.',
        workLocation: 'McLean, VA 22102',
        dcMetroAccessible: 'Yes',
        federalAgency: 'No',
        requiresCitizenship: 'Yes',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'Yes',
        additionalInfo: 'Strong focus on technology and innovation in financial services.'
      },
      {
        id: '7',
        ifadOption: '60-minute virtual informational interviews',
        spotsAvailable: 2,
        careerFields: ['Health and Healthcare'],
        companyName: 'CVS Pharmacy',
        jobTitle: 'Pharmacist',
        website: 'CVS.com',
        companyDescription: 'CVS pharmacy plays an important role in healthcare by providing pharmaceutical care at retail level.',
        hostExpectations: 'Students can learn about the role a pharmacist plays at retail level as well as other healthcare settings.',
        workLocation: 'Olney, MD',
        dcMetroAccessible: 'No',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'Yes',
        umdAlumni: 'No',
        additionalInfo: 'Focus on retail pharmacy and healthcare delivery.'
      },
      {
        id: '8',
        ifadOption: 'In-person',
        spotsAvailable: 1,
        careerFields: ['Agriculture/Environment', 'Government and International Relations', 'Policy and Advocacy', 'Science and Research'],
        companyName: 'CropLife America',
        jobTitle: 'Senior Manager, Federal Government Relations',
        website: 'https://www.croplifeamerica.org/',
        companyDescription: 'CropLife America represents developers, manufacturers, and distributors of plant science solutions for agriculture and pest management.',
        hostExpectations: 'Experience federal government relations, meetings on Capitol Hill with Members of Congress, and agricultural policy advocacy.',
        workLocation: 'Arlington, VA 22203',
        dcMetroAccessible: 'Yes',
        federalAgency: 'No',
        requiresCitizenship: 'No',
        requiresBackgroundCheck: 'No',
        availableDays: 'Any weekday (Mon-Fri)',
        springBreakAvailable: 'No',
        umdAlumni: 'Yes',
        additionalInfo: 'In-person experience includes Capitol Hill meetings and agricultural advocacy.'
      }
    ];

    setHosts(processedHosts);
    setIsLoading(false);
  }, []);

  const allCareerFields = Array.from(new Set(hosts.flatMap(host => host.careerFields)));

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
              *Personal contact information is redacted for privacy
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