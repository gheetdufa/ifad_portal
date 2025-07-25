// Company data and autofill utilities with extensive database

export interface CompanyInfo {
  name: string;
  website?: string;
  domain?: string;
  industry?: string;
  location?: string;
  logoUrl?: string;
  ticker?: string;
  aliases?: string[]; // Alternative names/spellings
}

// Comprehensive companies database with logos and aliases
export const COMMON_COMPANIES: CompanyInfo[] = [
  // Major Tech Companies
  { 
    name: 'Microsoft', 
    website: 'https://www.microsoft.com', 
    domain: 'microsoft.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    ticker: 'MSFT',
    aliases: ['Microsoft Corporation', 'MS']
  },
  { 
    name: 'Google', 
    website: 'https://www.google.com', 
    domain: 'google.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/google.com',
    ticker: 'GOOGL',
    aliases: ['Alphabet Inc', 'Alphabet', 'Google LLC']
  },
  { 
    name: 'Amazon', 
    website: 'https://www.amazon.com', 
    domain: 'amazon.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    ticker: 'AMZN',
    aliases: ['Amazon.com', 'AWS', 'Amazon Web Services']
  },
  { 
    name: 'Apple', 
    website: 'https://www.apple.com', 
    domain: 'apple.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    ticker: 'AAPL',
    aliases: ['Apple Inc', 'Apple Computer']
  },
  { 
    name: 'Meta', 
    website: 'https://www.meta.com', 
    domain: 'meta.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/meta.com',
    ticker: 'META',
    aliases: ['Facebook', 'Meta Platforms', 'Instagram', 'WhatsApp']
  },
  { 
    name: 'Netflix', 
    website: 'https://www.netflix.com', 
    domain: 'netflix.com', 
    industry: 'Arts and Entertainment',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
    ticker: 'NFLX'
  },
  { 
    name: 'Salesforce', 
    website: 'https://www.salesforce.com', 
    domain: 'salesforce.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/salesforce.com',
    ticker: 'CRM'
  },
  { 
    name: 'Adobe', 
    website: 'https://www.adobe.com', 
    domain: 'adobe.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/adobe.com',
    ticker: 'ADBE',
    aliases: ['Adobe Systems']
  },
  { 
    name: 'Oracle', 
    website: 'https://www.oracle.com', 
    domain: 'oracle.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/oracle.com',
    ticker: 'ORCL',
    aliases: ['Oracle Corporation']
  },
  { 
    name: 'IBM', 
    website: 'https://www.ibm.com', 
    domain: 'ibm.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/ibm.com',
    ticker: 'IBM',
    aliases: ['International Business Machines', 'Big Blue']
  },
  { 
    name: 'Intel', 
    website: 'https://www.intel.com', 
    domain: 'intel.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/intel.com',
    ticker: 'INTC',
    aliases: ['Intel Corporation']
  },
  { 
    name: 'NVIDIA', 
    website: 'https://www.nvidia.com', 
    domain: 'nvidia.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/nvidia.com',
    ticker: 'NVDA',
    aliases: ['Nvidia Corporation']
  },
  { 
    name: 'Tesla', 
    website: 'https://www.tesla.com', 
    domain: 'tesla.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/tesla.com',
    ticker: 'TSLA',
    aliases: ['Tesla Inc', 'Tesla Motors']
  },
  { 
    name: 'Uber', 
    website: 'https://www.uber.com', 
    domain: 'uber.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/uber.com',
    ticker: 'UBER',
    aliases: ['Uber Technologies']
  },
  { 
    name: 'Lyft', 
    website: 'https://www.lyft.com', 
    domain: 'lyft.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/lyft.com',
    ticker: 'LYFT'
  },
  { 
    name: 'Spotify', 
    website: 'https://www.spotify.com', 
    domain: 'spotify.com', 
    industry: 'Arts and Entertainment',
    logoUrl: 'https://logo.clearbit.com/spotify.com',
    ticker: 'SPOT'
  },
  { 
    name: 'Zoom', 
    website: 'https://www.zoom.us', 
    domain: 'zoom.us', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/zoom.us',
    ticker: 'ZM',
    aliases: ['Zoom Video Communications']
  },
  { 
    name: 'Slack', 
    website: 'https://www.slack.com', 
    domain: 'slack.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/slack.com',
    aliases: ['Slack Technologies']
  },
  { 
    name: 'Twitter', 
    website: 'https://www.twitter.com', 
    domain: 'twitter.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/twitter.com',
    aliases: ['X', 'X Corp']
  },
  { 
    name: 'LinkedIn', 
    website: 'https://www.linkedin.com', 
    domain: 'linkedin.com', 
    industry: 'Computing/Computer Science and Technology',
    logoUrl: 'https://logo.clearbit.com/linkedin.com',
    aliases: ['LinkedIn Corporation']
  },
  { 
    name: 'TikTok', 
    website: 'https://www.tiktok.com', 
    domain: 'tiktok.com', 
    industry: 'Arts and Entertainment',
    logoUrl: 'https://logo.clearbit.com/tiktok.com',
    aliases: ['ByteDance']
  },

  // Financial Services - Including Capital One
  { 
    name: 'Capital One', 
    website: 'https://www.capitalone.com', 
    domain: 'capitalone.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/capitalone.com',
    ticker: 'COF',
    aliases: ['Capital One Financial Corporation', 'Capital One Bank']
  },
  { 
    name: 'JPMorgan Chase', 
    website: 'https://www.jpmorganchase.com', 
    domain: 'jpmorganchase.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/jpmorganchase.com',
    ticker: 'JPM',
    aliases: ['Chase', 'JP Morgan', 'JPMorgan', 'Chase Bank']
  },
  { 
    name: 'Bank of America', 
    website: 'https://www.bankofamerica.com', 
    domain: 'bankofamerica.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/bankofamerica.com',
    ticker: 'BAC',
    aliases: ['BofA', 'BoA']
  },
  { 
    name: 'Goldman Sachs', 
    website: 'https://www.goldmansachs.com', 
    domain: 'goldmansachs.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/goldmansachs.com',
    ticker: 'GS',
    aliases: ['Goldman Sachs Group']
  },
  { 
    name: 'Morgan Stanley', 
    website: 'https://www.morganstanley.com', 
    domain: 'morganstanley.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/morganstanley.com',
    ticker: 'MS'
  },
  { 
    name: 'Wells Fargo', 
    website: 'https://www.wellsfargo.com', 
    domain: 'wellsfargo.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/wellsfargo.com',
    ticker: 'WFC',
    aliases: ['Wells Fargo & Company']
  },
  { 
    name: 'Citigroup', 
    website: 'https://www.citigroup.com', 
    domain: 'citigroup.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/citigroup.com',
    ticker: 'C',
    aliases: ['Citi', 'Citibank', 'Citicorp']
  },
  { 
    name: 'American Express', 
    website: 'https://www.americanexpress.com', 
    domain: 'americanexpress.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/americanexpress.com',
    ticker: 'AXP',
    aliases: ['Amex', 'AmEx']
  },
  { 
    name: 'Discover', 
    website: 'https://www.discover.com', 
    domain: 'discover.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/discover.com',
    ticker: 'DIS',
    aliases: ['Discover Financial Services', 'Discover Card']
  },
  { 
    name: 'Charles Schwab', 
    website: 'https://www.schwab.com', 
    domain: 'schwab.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/schwab.com',
    ticker: 'SCHW',
    aliases: ['Schwab', 'Charles Schwab Corporation']
  },
  { 
    name: 'Fidelity', 
    website: 'https://www.fidelity.com', 
    domain: 'fidelity.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/fidelity.com',
    aliases: ['Fidelity Investments', 'FMR LLC']
  },
  { 
    name: 'Vanguard', 
    website: 'https://www.vanguard.com', 
    domain: 'vanguard.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/vanguard.com',
    aliases: ['The Vanguard Group']
  },
  { 
    name: 'BlackRock', 
    website: 'https://www.blackrock.com', 
    domain: 'blackrock.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/blackrock.com',
    ticker: 'BLK'
  },

  // Consulting (Big 4 + MBB)
  { 
    name: 'McKinsey & Company', 
    website: 'https://www.mckinsey.com', 
    domain: 'mckinsey.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/mckinsey.com',
    aliases: ['McKinsey', 'McKinsey and Company']
  },
  { 
    name: 'Boston Consulting Group', 
    website: 'https://www.bcg.com', 
    domain: 'bcg.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/bcg.com',
    aliases: ['BCG']
  },
  { 
    name: 'Bain & Company', 
    website: 'https://www.bain.com', 
    domain: 'bain.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/bain.com',
    aliases: ['Bain', 'Bain and Company']
  },
  { 
    name: 'Deloitte', 
    website: 'https://www.deloitte.com', 
    domain: 'deloitte.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/deloitte.com',
    aliases: ['Deloitte Touche Tohmatsu', 'Deloitte Consulting', 'DTT']
  },
  { 
    name: 'PwC', 
    website: 'https://www.pwc.com', 
    domain: 'pwc.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/pwc.com',
    aliases: ['PricewaterhouseCoopers', 'PricewaterhouseCoopers LLP']
  },
  { 
    name: 'KPMG', 
    website: 'https://www.kpmg.com', 
    domain: 'kpmg.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/kpmg.com',
    aliases: ['KPMG LLP']
  },
  { 
    name: 'EY', 
    website: 'https://www.ey.com', 
    domain: 'ey.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/ey.com',
    aliases: ['Ernst & Young', 'Ernst and Young', 'E&Y']
  },
  { 
    name: 'Accenture', 
    website: 'https://www.accenture.com', 
    domain: 'accenture.com', 
    industry: 'Consulting',
    logoUrl: 'https://logo.clearbit.com/accenture.com',
    ticker: 'ACN'
  },

  // Healthcare & Pharmaceuticals
  { 
    name: 'Johnson & Johnson', 
    website: 'https://www.jnj.com', 
    domain: 'jnj.com', 
    industry: 'Health and Healthcare',
    logoUrl: 'https://logo.clearbit.com/jnj.com',
    ticker: 'JNJ',
    aliases: ['J&J', 'JNJ']
  },
  { 
    name: 'Pfizer', 
    website: 'https://www.pfizer.com', 
    domain: 'pfizer.com', 
    industry: 'Health and Healthcare',
    logoUrl: 'https://logo.clearbit.com/pfizer.com',
    ticker: 'PFE'
  },
  { 
    name: 'UnitedHealth Group', 
    website: 'https://www.unitedhealthgroup.com', 
    domain: 'unitedhealthgroup.com', 
    industry: 'Health and Healthcare',
    logoUrl: 'https://logo.clearbit.com/unitedhealthgroup.com',
    ticker: 'UNH',
    aliases: ['UnitedHealthcare', 'United Healthcare']
  },
  { 
    name: 'CVS Health', 
    website: 'https://www.cvshealth.com', 
    domain: 'cvshealth.com', 
    industry: 'Health and Healthcare',
    logoUrl: 'https://logo.clearbit.com/cvshealth.com',
    ticker: 'CVS',
    aliases: ['CVS', 'CVS Pharmacy']
  },
  { 
    name: 'Moderna', 
    website: 'https://www.modernatx.com', 
    domain: 'modernatx.com', 
    industry: 'Health and Healthcare',
    logoUrl: 'https://logo.clearbit.com/modernatx.com',
    ticker: 'MRNA'
  },

  // Government/Defense Contractors
  { 
    name: 'Lockheed Martin', 
    website: 'https://www.lockheedmartin.com', 
    domain: 'lockheedmartin.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/lockheedmartin.com',
    ticker: 'LMT'
  },
  { 
    name: 'Boeing', 
    website: 'https://www.boeing.com', 
    domain: 'boeing.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/boeing.com',
    ticker: 'BA',
    aliases: ['The Boeing Company']
  },
  { 
    name: 'Raytheon Technologies', 
    website: 'https://www.rtx.com', 
    domain: 'rtx.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/rtx.com',
    ticker: 'RTX',
    aliases: ['RTX', 'Raytheon']
  },
  { 
    name: 'Northrop Grumman', 
    website: 'https://www.northropgrumman.com', 
    domain: 'northropgrumman.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/northropgrumman.com',
    ticker: 'NOC'
  },
  { 
    name: 'General Dynamics', 
    website: 'https://www.generaldynamics.com', 
    domain: 'generaldynamics.com', 
    industry: 'Engineering',
    logoUrl: 'https://logo.clearbit.com/generaldynamics.com',
    ticker: 'GD'
  },

  // Universities & Education
  { 
    name: 'University of Maryland', 
    website: 'https://www.umd.edu', 
    domain: 'umd.edu', 
    industry: 'Education',
    logoUrl: 'https://logo.clearbit.com/umd.edu',
    aliases: ['UMD', 'University of Maryland College Park', 'UMCP']
  },
  { 
    name: 'Johns Hopkins University', 
    website: 'https://www.jhu.edu', 
    domain: 'jhu.edu', 
    industry: 'Education',
    logoUrl: 'https://logo.clearbit.com/jhu.edu',
    aliases: ['JHU', 'Johns Hopkins']
  },
  { 
    name: 'Georgetown University', 
    website: 'https://www.georgetown.edu', 
    domain: 'georgetown.edu', 
    industry: 'Education',
    logoUrl: 'https://logo.clearbit.com/georgetown.edu',
    aliases: ['Georgetown']
  },
  { 
    name: 'George Washington University', 
    website: 'https://www.gwu.edu', 
    domain: 'gwu.edu', 
    industry: 'Education',
    logoUrl: 'https://logo.clearbit.com/gwu.edu',
    aliases: ['GWU', 'GW', 'George Washington']
  },

  // Media & Communications
  { 
    name: 'The Washington Post', 
    website: 'https://www.washingtonpost.com', 
    domain: 'washingtonpost.com', 
    industry: 'Communications, Journalism, Media',
    logoUrl: 'https://logo.clearbit.com/washingtonpost.com',
    aliases: ['Washington Post', 'WaPo']
  },
  { 
    name: 'CNN', 
    website: 'https://www.cnn.com', 
    domain: 'cnn.com', 
    industry: 'Communications, Journalism, Media',
    logoUrl: 'https://logo.clearbit.com/cnn.com',
    aliases: ['Cable News Network']
  },
  { 
    name: 'NBC Universal', 
    website: 'https://www.nbcuniversal.com', 
    domain: 'nbcuniversal.com', 
    industry: 'Communications, Journalism, Media',
    logoUrl: 'https://logo.clearbit.com/nbcuniversal.com',
    aliases: ['NBCU', 'NBC', 'Universal']
  },
  { 
    name: 'The New York Times', 
    website: 'https://www.nytimes.com', 
    domain: 'nytimes.com', 
    industry: 'Communications, Journalism, Media',
    logoUrl: 'https://logo.clearbit.com/nytimes.com',
    aliases: ['NYT', 'New York Times']
  },

  // Retail & E-commerce
  { 
    name: 'Walmart', 
    website: 'https://www.walmart.com', 
    domain: 'walmart.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/walmart.com',
    ticker: 'WMT',
    aliases: ['Walmart Inc']
  },
  { 
    name: 'Target', 
    website: 'https://www.target.com', 
    domain: 'target.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/target.com',
    ticker: 'TGT',
    aliases: ['Target Corporation']
  },
  { 
    name: 'Home Depot', 
    website: 'https://www.homedepot.com', 
    domain: 'homedepot.com', 
    industry: 'Business',
    logoUrl: 'https://logo.clearbit.com/homedepot.com',
    ticker: 'HD',
    aliases: ['The Home Depot']
  },

  // Non-profits
  { 
    name: 'American Red Cross', 
    website: 'https://www.redcross.org', 
    domain: 'redcross.org', 
    industry: 'NonProfit and Social Services',
    logoUrl: 'https://logo.clearbit.com/redcross.org',
    aliases: ['Red Cross']
  },
  { 
    name: 'United Way', 
    website: 'https://www.unitedway.org', 
    domain: 'unitedway.org', 
    industry: 'NonProfit and Social Services',
    logoUrl: 'https://logo.clearbit.com/unitedway.org'
  },
  { 
    name: 'Habitat for Humanity', 
    website: 'https://www.habitat.org', 
    domain: 'habitat.org', 
    industry: 'NonProfit and Social Services',
    logoUrl: 'https://logo.clearbit.com/habitat.org'
  },

  // Government Agencies
  { 
    name: 'National Institutes of Health', 
    website: 'https://www.nih.gov', 
    domain: 'nih.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/nih.gov',
    aliases: ['NIH']
  },
  { 
    name: 'Centers for Disease Control and Prevention', 
    website: 'https://www.cdc.gov', 
    domain: 'cdc.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/cdc.gov',
    aliases: ['CDC']
  },
  { 
    name: 'Food and Drug Administration', 
    website: 'https://www.fda.gov', 
    domain: 'fda.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/fda.gov',
    aliases: ['FDA']
  },
  { 
    name: 'National Security Agency', 
    website: 'https://www.nsa.gov', 
    domain: 'nsa.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/nsa.gov',
    aliases: ['NSA']
  },
  { 
    name: 'Central Intelligence Agency', 
    website: 'https://www.cia.gov', 
    domain: 'cia.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/cia.gov',
    aliases: ['CIA']
  },
  { 
    name: 'Federal Bureau of Investigation', 
    website: 'https://www.fbi.gov', 
    domain: 'fbi.gov', 
    industry: 'Government and International Relations',
    logoUrl: 'https://logo.clearbit.com/fbi.gov',
    aliases: ['FBI']
  }
];

// Enhanced search function with fuzzy matching and alias support
export const searchCompanies = (query: string): CompanyInfo[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase().trim();
  const results: { company: CompanyInfo; score: number }[] = [];
  
  COMMON_COMPANIES.forEach(company => {
    let score = 0;
    
    // Exact name match (highest priority)
    if (company.name.toLowerCase() === lowercaseQuery) {
      score = 1000;
    }
    // Name starts with query (high priority)
    else if (company.name.toLowerCase().startsWith(lowercaseQuery)) {
      score = 900;
    }
    // Name contains query
    else if (company.name.toLowerCase().includes(lowercaseQuery)) {
      score = 800;
    }
    
    // Check aliases for exact matches
    if (company.aliases) {
      for (const alias of company.aliases) {
        if (alias.toLowerCase() === lowercaseQuery) {
          score = Math.max(score, 950);
        } else if (alias.toLowerCase().startsWith(lowercaseQuery)) {
          score = Math.max(score, 850);
        } else if (alias.toLowerCase().includes(lowercaseQuery)) {
          score = Math.max(score, 750);
        }
      }
    }
    
    // Domain matching
    if (company.domain?.toLowerCase().includes(lowercaseQuery)) {
      score = Math.max(score, 700);
    }
    
    // Industry matching (lower priority)
    if (company.industry?.toLowerCase().includes(lowercaseQuery)) {
      score = Math.max(score, 300);
    }
    
    if (score > 0) {
      results.push({ company, score });
    }
  });
  
  // Sort by score (descending) and return top 8 results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(result => result.company);
};

export const getCompanyByName = (name: string): CompanyInfo | undefined => {
  const lowercaseName = name.toLowerCase().trim();
  
  // First, try exact name match
  let company = COMMON_COMPANIES.find(c => 
    c.name.toLowerCase() === lowercaseName
  );
  
  // If not found, try alias matching
  if (!company) {
    company = COMMON_COMPANIES.find(c => 
      c.aliases?.some(alias => alias.toLowerCase() === lowercaseName)
    );
  }
  
  return company;
};

export const inferWebsiteFromCompany = (companyName: string): string => {
  const company = getCompanyByName(companyName);
  if (company?.website) {
    return company.website;
  }
  
  // Try to infer website from company name
  const cleanName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/inc|corp|corporation|company|llc|ltd|group/g, ''); // Remove common suffixes
  
  if (cleanName && cleanName.length > 2) {
    return `https://www.${cleanName}.com`;
  }
  
  return '';
};

export const getIndustryFromCompany = (companyName: string): string => {
  const company = getCompanyByName(companyName);
  return company?.industry || '';
};

export const getCompanyLogo = (companyName: string): string | undefined => {
  const company = getCompanyByName(companyName);
  return company?.logoUrl;
};

// Email domain to company mapping for work email validation
export const getCompanyFromEmailDomain = (email: string): CompanyInfo | undefined => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return undefined;
  
  return COMMON_COMPANIES.find(company => company.domain === domain);
};

// Enhanced location suggestions
export const COMMON_LOCATIONS = [
  // DC Metro Area
  'Washington, DC',
  'Arlington, VA',
  'Alexandria, VA',
  'Bethesda, MD',
  'Rockville, MD',
  'Silver Spring, MD',
  'College Park, MD',
  'Baltimore, MD',
  'Annapolis, MD',
  'McLean, VA',
  'Tysons, VA',
  'Reston, VA',
  'Fairfax, VA',
  'Gaithersburg, MD',
  'Frederick, MD',
  'Falls Church, VA',
  
  // Major US Cities
  'New York, NY',
  'San Francisco, CA',
  'Seattle, WA',
  'Chicago, IL',
  'Boston, MA',
  'Atlanta, GA',
  'Austin, TX',
  'Denver, CO',
  'Los Angeles, CA',
  'Philadelphia, PA',
  'Dallas, TX',
  'Houston, TX',
  'Miami, FL',
  'Phoenix, AZ',
  'San Diego, CA',
  'Portland, OR',
  'Nashville, TN',
  'Charlotte, NC',
  'Raleigh, NC',
  'Richmond, VA'
];

export const searchLocations = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return COMMON_LOCATIONS.filter(location =>
    location.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 8);
};