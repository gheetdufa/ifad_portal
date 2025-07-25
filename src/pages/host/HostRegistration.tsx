import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Save, CheckCircle, Building, User, Mail, Phone, Globe, Award, Target, MapPin, Search, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PREFERRED_PREFIXES, CAREER_FIELDS, AVAILABLE_DAYS, IDENTITY_OPTIONS } from '../../types';
import { searchCompanies, inferWebsiteFromCompany, getIndustryFromCompany, getCompanyLogo, CompanyInfo, searchLocations } from '../../utils/companyData';
import SmallerLogo from '../../assets/Smaller_logo.png';

const HostRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    // Personal Information - no prefilled values
    preferredPrefix: '',
    firstName: '',
    lastName: '',
    workEmail: '',
    preferredPhone: '',
    
    // Previous Experience - no prefilled values
    previousHostExperience: false,
    
    // UMD Affiliation - no prefilled values
    isUmdParent: false,
    isUmdAlumni: false,
    
    // Work Information - no prefilled values
    organization: '',
    jobTitle: '',
    companyWebsite: '',
    companyAddress: '',
    cityState: '',
    zipCode: '',
    
    // Career Fields - no prefilled values
    careerFields: [] as string[],
    careerFieldsOther: '',
    
    // Opportunity Type - no prefilled values
    opportunityType: '' as 'in-person' | 'virtual' | '',
    
    // Work Location & Accessibility - no prefilled values
    isDcMetroAccessible: undefined as boolean | undefined,
    workLocationAccessibilityUnsure: false,
    isPhysicalOffice: false,
    isFederalAgency: false,
    
    // Requirements - no prefilled values
    requiresCitizenship: false,
    requiresBackgroundCheck: false,
    
    // Organization Description - no prefilled values
    organizationDescription: '',
    experienceDescription: '',
    
    // Capacity & Availability - minimal default
    maxStudents: 1,
    availableDays: [] as string[],
    availableWinterSession: false,
    additionalInfo: '',
    
    // Recruitment Interest - no prefilled values
    interestedInRecruitment: false,
    
    // Optional Identities - no prefilled values
    sharedIdentities: [] as string[],
    customReligion: '',
    customOther: '',
  });

  // Company autocomplete state
  const [companyQuery, setCompanyQuery] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Memoized search results
  const companySuggestions = useMemo(() => {
    return searchCompanies(companyQuery);
  }, [companyQuery]);
  
  const locationSuggestions = useMemo(() => {
    return searchLocations(locationQuery);
  }, [locationQuery]);
  
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.company-autocomplete') && !target.closest('.location-autocomplete')) {
        setShowCompanySuggestions(false);
        setShowLocationSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Company selection handler with enhanced autofill
  const handleCompanySelect = useCallback((company: CompanyInfo) => {
    setFormData(prev => ({
      ...prev,
      organization: company.name,
      companyWebsite: company.website || prev.companyWebsite,
      // Only add industry to career fields if it's not already there and there's room
      careerFields: company.industry && !prev.careerFields.includes(company.industry) && prev.careerFields.length < 5
        ? [company.industry, ...prev.careerFields]
        : prev.careerFields
    }));
    setCompanyQuery(company.name);
    setShowCompanySuggestions(false);
    
    // Clear validation errors if they exist
    if (validationErrors.organization) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.organization;
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: string) => {
    setFormData(prev => ({ ...prev, cityState: location }));
    setLocationQuery(location);
    setShowLocationSuggestions(false);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Auto-infer website from company name
    if (field === 'organization' && value && !formData.companyWebsite) {
      const inferredWebsite = inferWebsiteFromCompany(value);
      if (inferredWebsite && inferredWebsite !== 'https://www..com') {
        setFormData(prev => ({ ...prev, companyWebsite: inferredWebsite }));
      }
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  const handleCareerFieldsChange = (field: string) => {
    if (formData.careerFields.length >= 5 && !formData.careerFields.includes(field)) {
      setValidationErrors(prev => ({ ...prev, careerFields: 'You can select up to 5 career fields only.' }));
      setTimeout(() => {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.careerFields;
          return newErrors;
        });
      }, 3000);
      return;
    }
    handleMultiSelect('careerFields', field);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = {
      firstName: 'First name',
      lastName: 'Last name', 
      workEmail: 'Work email',
      preferredPhone: 'Phone number',
      organization: 'Organization',
      jobTitle: 'Job title',
      companyAddress: 'Company address',
      cityState: 'City/State',
      zipCode: 'ZIP code',
      opportunityType: 'Opportunity type',
      organizationDescription: 'Organization description',
      experienceDescription: 'Experience description'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${label} is required`;
      }
    }

    if (formData.careerFields.length === 0) {
      errors.careerFields = 'Please select at least one career field';
    }

    if (formData.availableDays.length === 0) {
      errors.availableDays = 'Please select at least one available day';
    }

    if (formData.opportunityType === 'in-person' && formData.isDcMetroAccessible === undefined && !formData.workLocationAccessibilityUnsure) {
      errors.isDcMetroAccessible = 'Please indicate if your work location is DC metro accessible';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please correct the highlighted fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare registration data
      const registrationData = {
        email: formData.workEmail,
        password: 'TempPassword123!', // Will be reset via email
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'host',
        
        // All host-specific fields
        preferredPrefix: formData.preferredPrefix || undefined,
        workEmail: formData.workEmail,
        preferredPhone: formData.preferredPhone,
        previousHostExperience: formData.previousHostExperience,
        isUmdParent: formData.isUmdParent,
        isUmdAlumni: formData.isUmdAlumni,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        companyWebsite: formData.companyWebsite || undefined,
        companyAddress: formData.companyAddress,
        cityState: formData.cityState,
        zipCode: formData.zipCode,
        careerFields: formData.careerFields,
        careerFieldsOther: formData.careerFieldsOther || undefined,
        opportunityType: formData.opportunityType,
        isDcMetroAccessible: formData.isDcMetroAccessible,
        workLocationAccessibilityUnsure: formData.workLocationAccessibilityUnsure,
        isPhysicalOffice: formData.isPhysicalOffice,
        isFederalAgency: formData.isFederalAgency,
        requiresCitizenship: formData.requiresCitizenship,
        requiresBackgroundCheck: formData.requiresBackgroundCheck,
        organizationDescription: formData.organizationDescription,
        experienceDescription: formData.experienceDescription,
        maxStudents: formData.maxStudents,
        availableDays: formData.availableDays,
        availableWinterSession: formData.availableWinterSession,
        additionalInfo: formData.additionalInfo || undefined,
        interestedInRecruitment: formData.interestedInRecruitment,
        sharedIdentities: formData.sharedIdentities,
        customIdentities: {
          ...(formData.customReligion && { religion: formData.customReligion }),
          ...(formData.customOther && { other: formData.customOther }),
        },
        
        // Legacy fields for compatibility
        industry: formData.careerFields[0] || 'Other',
        bio: formData.organizationDescription,
        experienceType: formData.opportunityType === 'in-person' ? 'shadowing' : 'interview',
        location: formData.opportunityType,
        verified: false,
      };

      await register(registrationData);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form sections for progress tracking
  const formSections = [
    'Personal Information',
    'Work Information', 
    'Career Fields & Opportunity',
    'Organization Details',
    'Availability & Preferences',
    'Additional Information'
  ];

  // Calculate form completion percentage
  const getFormProgress = () => {
    const totalFields = 20; // Approximate number of important fields
    let filledFields = 0;
    
    if (formData.firstName) filledFields++;
    if (formData.lastName) filledFields++;
    if (formData.workEmail) filledFields++;
    if (formData.preferredPhone) filledFields++;
    if (formData.organization) filledFields++;
    if (formData.jobTitle) filledFields++;
    if (formData.companyAddress) filledFields++;
    if (formData.cityState) filledFields++;
    if (formData.zipCode) filledFields++;
    if (formData.opportunityType) filledFields++;
    if (formData.careerFields.length > 0) filledFields++;
    if (formData.organizationDescription) filledFields++;
    if (formData.experienceDescription) filledFields++;
    if (formData.availableDays.length > 0) filledFields++;
    if (formData.maxStudents > 0) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16 bg-gradient-to-br from-white via-green-50 to-white border-2 border-green-200 shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-umd-black mb-6">Registration Submitted!</h1>
            <p className="text-xl text-umd-gray-600 mb-10 leading-relaxed">
              Thank you for registering to be a host for the IFAD program. 
              We will review your application and contact you with next steps.
            </p>
            <Button variant="primary" className="bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700">
              <Link to="/host">Go to Dashboard</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <img 
            src={SmallerLogo} 
            alt="University of Maryland Logo" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-umd-red to-red-600 rounded-full shadow-lg">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-umd-black">
              Host Registration
            </h1>
          </div>
          <p className="text-xl text-umd-gray-600 max-w-3xl mx-auto leading-relaxed">
            Register to become a host for the Intern for a Day program and help UMD students explore career opportunities
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Form Progress</span>
            <span className="text-sm font-medium text-gray-700">{getFormProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-umd-red to-red-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getFormProgress()}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="space-y-10">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Preferred Prefix */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Preferred Prefix</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {PREFERRED_PREFIXES.map((prefix) => (
                  <label key={prefix} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredPrefix"
                      value={prefix}
                      checked={formData.preferredPrefix === prefix}
                      onChange={(e) => handleInputChange('preferredPrefix', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{prefix}</span>
                  </label>
                ))}
              </div>
              {formData.preferredPrefix === 'Other' && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Please specify"
                    value={formData.preferredPrefix === 'Other' ? '' : formData.preferredPrefix}
                    onChange={(e) => handleInputChange('preferredPrefix', e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              )}
            </section>

            {/* About You */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6 flex items-center space-x-2">
                <User className="w-6 h-6 text-umd-red" />
                <span>About You</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First & Last Name *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={validationErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                        required
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={validationErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                        required
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Work Email Address *</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.workEmail}
                    onChange={(e) => handleInputChange('workEmail', e.target.value)}
                    className={validationErrors.workEmail ? 'border-red-500 focus:border-red-500' : ''}
                    required
                  />
                  {validationErrors.workEmail && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.workEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Preferred Phone Number *</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.preferredPhone}
                    onChange={(e) => handleInputChange('preferredPhone', e.target.value)}
                    className={validationErrors.preferredPhone ? 'border-red-500 focus:border-red-500' : ''}
                    required
                  />
                  {validationErrors.preferredPhone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.preferredPhone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Previous Host Experience */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Previous Host Experience</h2>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">Have you previously served as a host for Intern for a Day?</p>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="previousHostExperience"
                      checked={formData.previousHostExperience === true}
                      onChange={() => handleInputChange('previousHostExperience', true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="previousHostExperience"
                      checked={formData.previousHostExperience === false}
                      onChange={() => handleInputChange('previousHostExperience', false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </section>

            {/* UMD Affiliation */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">UMD Affiliation</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 font-medium mb-3">Are you a parent or family member to a current UMD student?</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isUmdParent"
                        checked={formData.isUmdParent === true}
                        onChange={() => handleInputChange('isUmdParent', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isUmdParent"
                        checked={formData.isUmdParent === false}
                        onChange={() => handleInputChange('isUmdParent', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-3">Are you a University of Maryland, College Park alumni?</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isUmdAlumni"
                        checked={formData.isUmdAlumni === true}
                        onChange={() => handleInputChange('isUmdAlumni', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isUmdAlumni"
                        checked={formData.isUmdAlumni === false}
                        onChange={() => handleInputChange('isUmdAlumni', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* About Your Work */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6 flex items-center space-x-2">
                <Building className="w-6 h-6 text-umd-red" />
                <span>About Your Work</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Org Name *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Note: if K-12 education, please include the county & school name
                  </p>
                  <div className="relative company-autocomplete">
                    <Input
                      type="text"
                      placeholder="Start typing company name..."
                      value={companyQuery || formData.organization}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCompanyQuery(value);
                        handleInputChange('organization', value);
                        setShowCompanySuggestions(value.length >= 2);
                      }}
                      onFocus={() => setShowCompanySuggestions((companyQuery || formData.organization).length >= 2)}
                      className={`transition-all duration-200 pr-10 ${
                        validationErrors.organization 
                          ? 'border-red-500 focus:border-red-500' 
                          : formData.organization 
                          ? 'border-green-500 focus:border-green-500' 
                          : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {formData.organization && getCompanyLogo(formData.organization) ? (
                        <img
                          src={getCompanyLogo(formData.organization)}
                          alt={`${formData.organization} logo`}
                          className="w-4 h-4 rounded object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {validationErrors.organization && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.organization}</p>
                    )}
                    
                    {/* Company Suggestions Dropdown */}
                    {showCompanySuggestions && companySuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-auto">
                        {companySuggestions.map((company, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleCompanySelect(company)}
                          >
                            {/* Company Logo */}
                            <div className="flex-shrink-0">
                              {company.logoUrl ? (
                                <img
                                  src={company.logoUrl}
                                  alt={`${company.name} logo`}
                                  className="w-8 h-8 rounded object-contain bg-gray-50 p-1"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                  <Building className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                            
                            {/* Company Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{company.name}</div>
                              {company.industry && (
                                <div className="text-xs text-blue-600 mt-1 truncate">{company.industry}</div>
                              )}
                              {company.ticker && (
                                <div className="text-xs text-gray-500 mt-1">{company.ticker}</div>
                              )}
                            </div>
                            
                            {/* Website Icon */}
                            <div className="flex-shrink-0">
                              {company.website && (
                                <Globe className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </button>
                        ))}
                        
                        {/* Footer message */}
                        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                          💡 Don't see your company? Keep typing to add it manually
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="Your Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>Company/Org Website</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://www.company.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    className="transition-colors duration-200"
                  />
                  {formData.companyWebsite && formData.companyWebsite.includes('http') && (
                    <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Website URL detected</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Org Physical Address *
                  </label>
                  <Input
                    type="text"
                    placeholder="123 Main St, Suite 100"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>City, State *</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Ex: College Park, MD</p>
                  <div className="relative location-autocomplete">
                    <Input
                      type="text"
                      placeholder="Start typing city..."
                      value={locationQuery || formData.cityState}
                      onChange={(e) => {
                        const value = e.target.value;
                        setLocationQuery(value);
                        handleInputChange('cityState', value);
                        setShowLocationSuggestions(value.length >= 2);
                      }}
                      onFocus={() => setShowLocationSuggestions((locationQuery || formData.cityState).length >= 2)}
                      className={`transition-all duration-200 ${
                        validationErrors.cityState 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      required
                    />
                    {validationErrors.cityState && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.cityState}</p>
                    )}
                    
                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-48 overflow-auto">
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center space-x-2 transition-colors duration-150"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{location}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code *
                  </label>
                  <Input
                    type="text"
                    placeholder="20742"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Career Fields */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Career Fields</h2>
              <p className="text-gray-700 mb-4">
                Students interested in the following career field(s) would most benefit in connecting with you 
                <strong> (select up to 5, but no more than 5):</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CAREER_FIELDS.map((field) => {
                  const isSelected = formData.careerFields.includes(field);
                  const isDisabled = formData.careerFields.length >= 5 && !isSelected;
                  
                  return (
                    <label 
                      key={field} 
                      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-900' 
                          : isDisabled 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCareerFieldsChange(field)}
                        disabled={isDisabled}
                        className="w-4 h-4 text-blue-600 disabled:opacity-50"
                      />
                      <span className="text-sm font-medium">{field}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
                    </label>
                  );
                })}
              </div>
              {validationErrors.careerFields && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.careerFields}</p>
              )}
              <div className="flex items-center justify-between mt-4">
                <p className={`text-sm font-medium ${
                  formData.careerFields.length >= 5 ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  Selected: {formData.careerFields.length}/5
                </p>
                {formData.careerFields.length >= 5 && (
                  <p className="text-xs text-orange-600 flex items-center space-x-1">
                    <span>⚠️ Maximum selections reached</span>
                  </p>
                )}
              </div>
              {formData.careerFields.includes('Other') && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Please specify other career field"
                    value={formData.careerFieldsOther}
                    onChange={(e) => handleInputChange('careerFieldsOther', e.target.value)}
                    className="max-w-md"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.careerFields.length}/5
              </p>
            </section>

            {/* Type of Opportunity */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Type of Opportunity</h2>
              <p className="text-gray-700 mb-4">
                For the FALL 2025 semester, which option would you like to offer UMD undergraduate students?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                (Note if you would like to offer both options, please complete a form for each type)
              </p>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="opportunityType"
                    value="in-person"
                    checked={formData.opportunityType === 'in-person'}
                    onChange={(e) => handleInputChange('opportunityType', e.target.value)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <div>
                    <span className="font-medium">In-person job shadowing experience.</span>
                    <p className="text-sm text-gray-600">
                      I understand I must be reporting to a physical office/workplace and that I am not teleworking.
                    </p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="opportunityType"
                    value="virtual"
                    checked={formData.opportunityType === 'virtual'}
                    onChange={(e) => handleInputChange('opportunityType', e.target.value)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <div>
                    <span className="font-medium">60-minute virtual informational interviews</span>
                    <p className="text-sm text-gray-600">
                      with UMD students to learn more about my career field.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Work Location Accessibility (only for in-person) */}
            {formData.opportunityType === 'in-person' && (
              <section>
                <h2 className="text-2xl font-bold text-umd-black mb-6">Work Location Accessibility</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 font-medium mb-3">
                      Is the work address you provided DC metro accessible (train or bus) from College Park?
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isDcMetroAccessible"
                          checked={formData.isDcMetroAccessible === true}
                          onChange={() => handleInputChange('isDcMetroAccessible', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isDcMetroAccessible"
                          checked={formData.isDcMetroAccessible === false}
                          onChange={() => handleInputChange('isDcMetroAccessible', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isDcMetroAccessible"
                          checked={formData.workLocationAccessibilityUnsure === true}
                          onChange={() => {
                            handleInputChange('workLocationAccessibilityUnsure', true);
                            handleInputChange('isDcMetroAccessible', undefined);
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Unsure</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-700 font-medium mb-3">
                      As a professional interested in hosting one or more University of Maryland, College Park students 
                      for an in-person job shadowing experience, I understand that I must be reporting to a physical 
                      office/workplace and not teleworking on the day the student job shadows me.
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isPhysicalOffice"
                          checked={formData.isPhysicalOffice === true}
                          onChange={() => handleInputChange('isPhysicalOffice', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isPhysicalOffice"
                          checked={formData.isPhysicalOffice === false}
                          onChange={() => handleInputChange('isPhysicalOffice', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-700 font-medium mb-3">
                      Are you a federal government agency or federal contractor?
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isFederalAgency"
                          checked={formData.isFederalAgency === true}
                          onChange={() => handleInputChange('isFederalAgency', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isFederalAgency"
                          checked={formData.isFederalAgency === false}
                          onChange={() => handleInputChange('isFederalAgency', false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Citizenship & Background Check Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Requirements</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 font-medium mb-3">
                    For this one day job shadowing experience, do you require that the student is a US Citizen?
                  </p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="requiresCitizenship"
                        checked={formData.requiresCitizenship === true}
                        onChange={() => handleInputChange('requiresCitizenship', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="requiresCitizenship"
                        checked={formData.requiresCitizenship === false}
                        onChange={() => handleInputChange('requiresCitizenship', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-3">
                    For this one day job shadowing experience, will the student(s) be required to complete and pay for a background check?
                  </p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="requiresBackgroundCheck"
                        checked={formData.requiresBackgroundCheck === true}
                        onChange={() => handleInputChange('requiresBackgroundCheck', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="requiresBackgroundCheck"
                        checked={formData.requiresBackgroundCheck === false}
                        onChange={() => handleInputChange('requiresBackgroundCheck', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Organization and Experience Description */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6 flex items-center space-x-2">
                <Target className="w-6 h-6 text-umd-red" />
                <span>Organization and Experience Description</span>
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please describe your organization in greater detail. *
                  </label>
                  <p className="text-xs text-gray-500 mb-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    💡 This description will be shared with students to help them identify a good fit. Include your organization's mission, size, culture, and what makes it unique.
                  </p>
                  <div className="relative">
                    <textarea
                      placeholder="Describe your organization, its mission, size, culture, and what makes it unique..."
                      value={formData.organizationDescription}
                      onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                      required
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                        validationErrors.organizationDescription 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {formData.organizationDescription.length}/500
                    </div>
                  </div>
                  {validationErrors.organizationDescription && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.organizationDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please describe what student(s) may experience while spending time with you. *
                  </label>
                  <p className="text-xs text-gray-500 mb-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                    ✨ Include insights into your work, typical activities, and what student career interests would benefit most from this experience.
                  </p>
                  <div className="relative">
                    <textarea
                      placeholder="Describe a typical day, activities the student will observe or participate in, skills they'll learn about, etc..."
                      value={formData.experienceDescription}
                      onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                        validationErrors.experienceDescription 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {formData.experienceDescription.length}/750
                    </div>
                  </div>
                  {validationErrors.experienceDescription && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.experienceDescription}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Capacity & Availability */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Capacity & Availability</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many students are you willing to host this fall semester (late-October 2025 through mid-January 2026)? *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    If more than one student, we ask that you host students on separate days.
                  </p>
                  <div className="flex items-center space-x-4">
                    <select
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <span>student(s)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What days of the week would work best with your schedule for a student to shadow you? *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">(Please select all that apply.)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_DAYS.map((day) => (
                      <label key={day} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.availableDays.includes(day)}
                          onChange={() => handleMultiSelect('availableDays', day)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-3">
                    UMD holds a Winter Session from January 5–23, 2026. Many local students like to conduct their 
                    shadowing experience during this time. Would a shadowing day sometime in this range work with your schedule?
                  </p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="availableWinterSession"
                        checked={formData.availableWinterSession === true}
                        onChange={() => handleInputChange('availableWinterSession', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="availableWinterSession"
                        checked={formData.availableWinterSession === false}
                        onChange={() => handleInputChange('availableWinterSession', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is there any more information you would like to share?
                  </label>
                  <textarea
                    placeholder="Any additional information, special requirements, or details you'd like to share..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Recruitment Interest */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Recruitment Interest</h2>
              <div>
                <p className="text-gray-700 font-medium mb-3">
                  Are you interested in learning more about how to recruit UMD students for jobs and internships within your organization?
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  (If "yes", a member of our Employer Relations team will contact you via email/phone.)
                </p>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="interestedInRecruitment"
                      checked={formData.interestedInRecruitment === true}
                      onChange={() => handleInputChange('interestedInRecruitment', true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="interestedInRecruitment"  
                      checked={formData.interestedInRecruitment === false}
                      onChange={() => handleInputChange('interestedInRecruitment', false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Identities You Choose to Share */}
            <section>
              <h2 className="text-2xl font-bold text-umd-black mb-6">Identities You Choose to Share</h2>
              <p className="text-gray-700 mb-4">
                Please select any identities that you hold and would like to share with UMD students.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                (Optional and not required. This is the final question before submission.)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {IDENTITY_OPTIONS.map((identity) => (
                  <label key={identity} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sharedIdentities.includes(identity)}
                      onChange={() => handleMultiSelect('sharedIdentities', identity)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{identity}</span>
                  </label>
                ))}
              </div>
              
              {/* Custom fields for Religion and Other */}
              {formData.sharedIdentities.includes('Religion') && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Please specify religion"
                    value={formData.customReligion}
                    onChange={(e) => handleInputChange('customReligion', e.target.value)}
                    className="max-w-md"
                  />
                </div>
              )}
              
              {formData.sharedIdentities.includes('Other') && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Please specify other identity"
                    value={formData.customOther}
                    onChange={(e) => handleInputChange('customOther', e.target.value)}
                    className="max-w-md"
                  />
                </div>
              )}
            </section>

            {/* Submit Button */}
            <div className="text-center pt-8 border-t-2 border-gray-100">
              <div className="mb-6">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Ready to submit your host registration?
                </p>
                <p className="text-sm text-gray-500">
                  Please review your information before submitting. You can always update it later.
                </p>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || getFormProgress() < 70}
                className={`px-12 py-4 text-lg font-bold transition-all duration-300 ${
                  getFormProgress() < 70 
                    ? 'opacity-60 cursor-not-allowed bg-gray-400' 
                    : 'bg-gradient-to-r from-umd-red to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
                icon={isSubmitting ? undefined : Save}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : getFormProgress() < 70 ? (
                  `Complete form (${getFormProgress()}%)`
                ) : (
                  'Submit Registration'
                )}
              </Button>
              
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400">
                  By submitting this form, you agree to participate in the UMD IFAD program.
                </p>
                {getFormProgress() < 70 && (
                  <p className="text-xs text-orange-600 flex items-center justify-center space-x-1">
                    <span>⚠️</span>
                    <span>Please complete at least 70% of the form to submit ({70 - getFormProgress()}% remaining)</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default HostRegistration;