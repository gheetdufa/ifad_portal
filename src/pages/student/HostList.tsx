import React, { useState } from 'react';
import { MapPin, Building, Users, Calendar, Shield, ExternalLink, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

interface Host {
  id: string;
  ifadOption: 'In Person' | 'Virtual';
  spotsAvailable: number;
  careerFields: string[];
  companyName: string;
  jobTitle: string;
  website: string;
  companyDescription: string;
  hostExpectations: string;
  physicalAddress: string;
  workLocation: string;
  dcMetroAccessible: boolean;
  federalAgency: boolean;
  requiresCitizenship: boolean;
  requiresBackgroundCheck: boolean;
  availableDays: string[];
  availableNovemberBreak: boolean;
  umdAlumni: boolean;
  additionalInfo: string;
  hostName: string;
  email: string;
}

const HostList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [selectedCareerField, setSelectedCareerField] = useState('all');

  const sampleHosts: Host[] = [
    {
      id: '1',
      ifadOption: 'In Person',
      spotsAvailable: 2,
      careerFields: ['Technology', 'Software Engineering', 'Data Science'],
      companyName: 'Microsoft Corporation',
      jobTitle: 'Senior Software Engineer',
      website: 'https://microsoft.com',
      companyDescription: 'Microsoft is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
      hostExpectations: 'Students will observe daily software development workflows, participate in team meetings, review code architecture, and learn about agile development practices.',
      physicalAddress: '11900 Democracy Dr, Reston, VA 20190',
      workLocation: 'Reston, VA 20190',
      dcMetroAccessible: true,
      federalAgency: false,
      requiresCitizenship: false,
      requiresBackgroundCheck: false,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      availableNovemberBreak: true,
      umdAlumni: true,
      additionalInfo: 'Flexible with timing, can accommodate students with different academic schedules.',
      hostName: 'Sarah Chen',
      email: 'sarah.chen@microsoft.com'
    },
    {
      id: '2',
      ifadOption: 'Virtual',
      spotsAvailable: 3,
      careerFields: ['Business', 'Marketing', 'Digital Strategy'],
      companyName: 'Deloitte Consulting',
      jobTitle: 'Senior Business Analyst',
      website: 'https://deloitte.com',
      companyDescription: 'Deloitte is a global professional services network providing audit, consulting, financial advisory, risk advisory, tax, and related services.',
      hostExpectations: 'Virtual meetings with clients, data analysis sessions, strategic planning discussions, and insight into consulting project lifecycle.',
      physicalAddress: 'Remote Position',
      workLocation: 'Washington, DC (Remote)',
      dcMetroAccessible: false,
      federalAgency: false,
      requiresCitizenship: false,
      requiresBackgroundCheck: true,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableNovemberBreak: false,
      umdAlumni: true,
      additionalInfo: 'All sessions will be conducted via Microsoft Teams. Students should have reliable internet connection.',
      hostName: 'Michael Rodriguez',
      email: 'mrodriguez@deloitte.com'
    },
    {
      id: '3',
      ifadOption: 'In Person',
      spotsAvailable: 1,
      careerFields: ['Government', 'Public Policy', 'International Relations'],
      companyName: 'U.S. Department of State',
      jobTitle: 'Foreign Service Officer',
      website: 'https://state.gov',
      companyDescription: 'The U.S. Department of State leads Americas foreign policy through diplomacy, advocacy, and assistance by advancing the interests of the American people, their safety and economic prosperity.',
      hostExpectations: 'Observe diplomatic briefings, learn about foreign policy analysis, participate in inter-agency meetings, and understand embassy operations.',
      physicalAddress: '2201 C St NW, Washington, DC 20520',
      workLocation: 'Washington, DC 20520',
      dcMetroAccessible: true,
      federalAgency: true,
      requiresCitizenship: true,
      requiresBackgroundCheck: true,
      availableDays: ['Tuesday', 'Thursday'],
      availableNovemberBreak: true,
      umdAlumni: false,
      additionalInfo: 'Security clearance process required. Student must be able to arrive by 8:00 AM for security screening.',
      hostName: 'Jennifer Park',
      email: 'parkj@state.gov'
    },
    {
      id: '4',
      ifadOption: 'In Person',
      spotsAvailable: 2,
      careerFields: ['Healthcare', 'Research', 'Medicine'],
      companyName: 'Johns Hopkins Hospital',
      jobTitle: 'Clinical Research Coordinator',
      website: 'https://hopkinsmedicine.org',
      companyDescription: 'Johns Hopkins Hospital is a world-renowned medical institution known for its excellence in patient care, research, and medical education.',
      hostExpectations: 'Shadow clinical research activities, observe patient interactions, learn about medical research protocols, and understand healthcare administration.',
      physicalAddress: '1800 Orleans St, Baltimore, MD 21287',
      workLocation: 'Baltimore, MD 21287',
      dcMetroAccessible: false,
      federalAgency: false,
      requiresCitizenship: false,
      requiresBackgroundCheck: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableNovemberBreak: false,
      umdAlumni: true,
      additionalInfo: 'Student must complete HIPAA training before visit. Medical or pre-med students preferred.',
      hostName: 'Dr. Amanda Williams',
      email: 'awilliams@jhmi.edu'
    },
    {
      id: '5',
      ifadOption: 'Virtual',
      spotsAvailable: 4,
      careerFields: ['Finance', 'Investment Banking', 'Economics'],
      companyName: 'Goldman Sachs',
      jobTitle: 'Investment Banking Analyst',
      website: 'https://goldmansachs.com',
      companyDescription: 'Goldman Sachs is a leading global investment banking, securities and investment management firm.',
      hostExpectations: 'Virtual market analysis sessions, client call observations, financial modeling workshops, and investment strategy discussions.',
      physicalAddress: 'Remote Position',
      workLocation: 'New York, NY (Remote)',
      dcMetroAccessible: false,
      federalAgency: false,
      requiresCitizenship: false,
      requiresBackgroundCheck: false,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableNovemberBreak: true,
      umdAlumni: true,
      additionalInfo: 'Fast-paced environment. Students should be comfortable with financial concepts and Excel.',
      hostName: 'David Kim',
      email: 'david.kim@gs.com'
    },
    {
      id: '6',
      ifadOption: 'In Person',
      spotsAvailable: 1,
      careerFields: ['Media', 'Journalism', 'Communications'],
      companyName: 'The Washington Post',
      jobTitle: 'Digital Content Producer',
      website: 'https://washingtonpost.com',
      companyDescription: 'The Washington Post is an American daily newspaper published in Washington, D.C., known for its political reporting and digital innovation.',
      hostExpectations: 'Observe newsroom operations, participate in editorial meetings, learn digital publishing workflows, and understand media production.',
      physicalAddress: '1301 K St NW, Washington, DC 20071',
      workLocation: 'Washington, DC 20071',
      dcMetroAccessible: true,
      federalAgency: false,
      requiresCitizenship: false,
      requiresBackgroundCheck: false,
      availableDays: ['Monday', 'Tuesday', 'Wednesday'],
      availableNovemberBreak: false,
      umdAlumni: false,
      additionalInfo: 'Fast-paced news environment. Students interested in digital media and current events preferred.',
      hostName: 'Lisa Thompson',
      email: 'lisa.thompson@washpost.com'
    }
  ];

  const allCareerFields = Array.from(new Set(sampleHosts.flatMap(host => host.careerFields)));

  const filteredHosts = sampleHosts.filter(host => {
    const matchesSearch = host.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.careerFields.some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterOption === 'all' || 
                         (filterOption === 'inperson' && host.ifadOption === 'In Person') ||
                         (filterOption === 'virtual' && host.ifadOption === 'Virtual') ||
                         (filterOption === 'alumni' && host.umdAlumni) ||
                         (filterOption === 'metro' && host.dcMetroAccessible);

    const matchesCareerField = selectedCareerField === 'all' || 
                              host.careerFields.includes(selectedCareerField);

    return matchesSearch && matchesFilter && matchesCareerField;
  });

  return (
    <div className="min-h-screen bg-umd-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-umd-black mb-2">Available Hosts</h1>
          <p className="text-umd-gray-600">Browse and select hosts for your IFAD experience</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="Search hosts, companies, or job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
            >
              <option value="all">All Options</option>
              <option value="inperson">In Person Only</option>
              <option value="virtual">Virtual Only</option>
              <option value="alumni">UMD Alumni</option>
              <option value="metro">Metro Accessible</option>
            </select>

            <select
              value={selectedCareerField}
              onChange={(e) => setSelectedCareerField(e.target.value)}
              className="px-3 py-2 border border-umd-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
            >
              <option value="all">All Career Fields</option>
              {allCareerFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-umd-gray-600">
            Showing {filteredHosts.length} of {sampleHosts.length} hosts
          </p>
        </div>

        {/* Host Cards */}
        <div className="space-y-6">
          {filteredHosts.map((host) => (
            <Card key={host.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-umd-black mb-1">
                        {host.hostName} - {host.jobTitle}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="w-4 h-4 text-umd-gray-500" />
                        <span className="text-umd-gray-700">{host.companyName}</span>
                        {host.website && (
                          <a 
                            href={host.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-umd-red hover:text-umd-red-dark"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={host.ifadOption === 'In Person' ? 'primary' : 'secondary'}>
                        {host.ifadOption}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-umd-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{host.spotsAvailable} spots</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-umd-black mb-2">Career Fields:</h4>
                    <div className="flex flex-wrap gap-2">
                      {host.careerFields.map((field, index) => (
                        <Badge key={index} variant="outline">{field}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-umd-black mb-2">Company Description:</h4>
                    <p className="text-umd-gray-700 text-sm">{host.companyDescription}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-umd-black mb-2">What to Expect:</h4>
                    <p className="text-umd-gray-700 text-sm">{host.hostExpectations}</p>
                  </div>

                  {host.additionalInfo && (
                    <div className="mb-4">
                      <h4 className="font-medium text-umd-black mb-2">Additional Information:</h4>
                      <p className="text-umd-gray-700 text-sm">{host.additionalInfo}</p>
                    </div>
                  )}
                </div>

                {/* Details Sidebar */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-umd-black mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </h4>
                    <p className="text-sm text-umd-gray-700">{host.workLocation}</p>
                    {host.ifadOption === 'In Person' && (
                      <p className="text-xs text-umd-gray-600 mt-1">{host.physicalAddress}</p>
                    )}
                    {host.dcMetroAccessible && (
                      <Badge variant="success" className="mt-2">Metro Accessible</Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-umd-black mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Availability
                    </h4>
                    <div className="text-sm text-umd-gray-700 space-y-1">
                      <p>Days: {host.availableDays.join(', ')}</p>
                      <p>November Break: {host.availableNovemberBreak ? 'Available' : 'Not Available'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-umd-black mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Additional Information
                    </h4>
                    <div className="text-sm space-y-1">
                      {host.federalAgency && (
                        <Badge variant="warning">Federal Agency</Badge>
                      )}
                      {host.requiresCitizenship && (
                        <Badge variant="warning">US Citizenship Required</Badge>
                      )}
                      {host.requiresBackgroundCheck && (
                        <Badge variant="warning">Background Check Required</Badge>
                      )}
                      {host.umdAlumni && (
                        <Badge variant="primary">UMD Alumni</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      Add to Favorites
                    </Button>
                    <Button className="flex-1" variant="primary">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredHosts.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-umd-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-umd-gray-600 mb-2">No hosts found</h3>
            <p className="text-umd-gray-500">Try adjusting your search criteria or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HostList; 