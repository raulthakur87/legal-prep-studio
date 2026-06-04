// Legal subjects and topics for the study prep system

export const LEGAL_SUBJECTS = {
  'IPC': {
    name: 'Indian Penal Code, 1860',
    topics: [
      'General Principles of Criminal Law',
      'Punishment and Sentencing',
      'Defenses in Criminal Law',
      'Specific Offenses Against Person',
      'Offenses Against Property',
      'Offenses Against Public Order',
      'Offenses Against the State'
    ]
  },
  'CrPC': {
    name: 'Code of Criminal Procedure, 1973',
    topics: [
      'Jurisdiction and Powers',
      'Arrest and Bail',
      'Investigation Process',
      'Criminal Trial Procedure',
      'Evidence in Criminal Cases',
      'Punishment and Sentencing',
      'Criminal Appeals'
    ]
  },
  'IEA': {
    name: 'Indian Evidence Act, 1872',
    topics: [
      'Burden of Proof',
      'Admissibility of Evidence',
      'Examination of Witnesses',
      'Expert Evidence',
      'Hearsay Rule and Exceptions',
      'Documentary Evidence',
      'Best Evidence Rule'
    ]
  },
  'ICA': {
    name: 'Indian Contract Act, 1872',
    topics: [
      'Formation of Contract',
      'Offer and Acceptance',
      'Consideration',
      'Capacity of Parties',
      'Discharge of Contract',
      'Breach and Remedies',
      'Special Contracts'
    ]
  },
  'NI': {
    name: 'Negotiable Instruments Act, 1881',
    topics: [
      'Cheques and Bills of Exchange',
      'Promissory Notes',
      'Holder and Holder in Due Course',
      'Negotiation and Endorsement',
      'Discharge of Instruments',
      'Crossing of Cheques',
      'Liability of Parties'
    ]
  },
  'Tort': {
    name: 'Law of Torts',
    topics: [
      'Negligence',
      'Nuisance',
      'Defamation',
      'Vicarious Liability',
      'Strict Liability',
      'Trespass',
      'Conversion and Trover'
    ]
  },
  'Constitutional Law': {
    name: 'Constitutional Law of India',
    topics: [
      'Preamble and Basic Structure',
      'Fundamental Rights',
      'Directive Principles of State Policy',
      'Powers of Parliament',
      'Powers of State Legislature',
      'Judicial Review',
      'Constitutional Amendments'
    ]
  },
  'Administrative Law': {
    name: 'Administrative Law',
    topics: [
      'Natural Justice and Procedural Fairness',
      'Ultra Vires Acts',
      'Delegated Legislation',
      'Judicial Review of Administrative Action',
      'Remedies - Certiorari, Mandamus, Prohibition',
      'Liability of State',
      'Right to Information'
    ]
  },
  'Family Law': {
    name: 'Family Law',
    topics: [
      'Marriage and Matrimonial Relations',
      'Divorce and Separation',
      'Guardianship and Custody',
      'Succession and Inheritance',
      'Maintenance and Alimony',
      'Hindu Law Principles',
      'Muslim Law Principles'
    ]
  },
  'Labor Law': {
    name: 'Labor and Employment Law',
    topics: [
      'Master-Servant Relationship',
      'Wages and Working Hours',
      'Workplace Safety',
      'Industrial Relations',
      'Strikes and Lockouts',
      'Social Security Benefits',
      'Dispute Resolution'
    ]
  },
  'Property Law': {
    name: 'Law of Property',
    topics: [
      'Ownership and Possession',
      'Transfer of Property',
      'Lease and Tenancy',
      'Mortgages',
      'Rights and Liabilities of Landlord',
      'Registration of Property',
      'Adverse Possession'
    ]
  },
  'Cyber Law': {
    name: 'Cyber Law and IT Law',
    topics: [
      'Information Technology Act 2000',
      'Digital Signatures',
      'E-commerce and Digital Contracts',
      'Data Protection and Privacy',
      'Cybercrime and Offenses',
      'Intellectual Property in Digital Domain',
      'Cloud Computing and Legal Issues'
    ]
  },
  'Constitutional Law': {
    name: 'Constitutional Law',
    topics: [
      'Fundamental Rights and Duties',
      'Separation of Powers',
      'Federalism',
      'Parliamentary Sovereignty',
      'Judicial Review',
      'Emergency Provisions',
      'Constitutional Amendments'
    ]
  },
  'BSA': {
    name: 'Bharatiya Sakshya Adhiniyam, 2023',
    topics: [
      'Overview and Transition from IEA',
      'Burden and Standard of Proof',
      'Admissibility of Evidence',
      'Examination of Witnesses',
      'Documentary Evidence',
      'Digital Evidence and Section 65B',
      'Hearsay and Exceptions'
    ]
  },
  'BNS': {
    name: 'Bharatiya Nyaya Sanhita, 2023',
    topics: [
      'Overview and Transition from IPC',
      'General Principles',
      'Offenses Against Person',
      'Offenses Against Property',
      'Offenses Against Public Order',
      'New Offenses in BNS',
      'Punishment Framework'
    ]
  },
  'BNSS': {
    name: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    topics: [
      'Overview and Transition from CrPC',
      'Jurisdiction and Powers',
      'Arrest, Bail and Custody',
      'Investigation Process',
      'Criminal Trial Procedure',
      'New Procedures in BNSS',
      'Appeals and Revisions'
    ]
  },
  'Patent Law': {
    name: 'Patent Law',
    topics: [
      'Patentability Requirements',
      'Patent Application Process',
      'Prosecution and Opposition',
      'Patent Infringement',
      'Defenses in Patent Cases',
      'Compulsory License',
      'International Patent Treaties'
    ]
  },
  'Environmental Law': {
    name: 'Environmental Law',
    topics: [
      'Constitutional Provisions',
      'Environmental Protection Act',
      'Water Pollution Control',
      'Air Pollution Control',
      'Hazardous Waste Management',
      'Public Interest Litigation',
      'Sustainable Development'
    ]
  },
  'Corporate Law': {
    name: 'Corporate and Company Law',
    topics: [
      'Company Formation',
      'Share Capital and Shares',
      'Board of Directors',
      'Shareholder Rights and Meetings',
      'Dividend and Distributions',
      'Winding Up',
      'Mergers and Acquisitions'
    ]
  },
  'Tax Law': {
    name: 'Tax Law',
    topics: [
      'Income Tax Fundamentals',
      'Assessment Procedure',
      'Deductions and Exemptions',
      'Business Income',
      'Capital Gains',
      'Tax Evasion vs Tax Avoidance',
      'GST Basics'
    ]
  }
};

export const GENERATION_MODES = [
  {
    id: 'study-notes',
    name: 'Study Notes',
    description: 'Comprehensive notes with bare acts, case law, and practical insights'
  },
  {
    id: 'worksheet',
    name: 'Practice Worksheet',
    description: 'Hypotheticals, short-answer, and essay questions with model answers'
  },
  {
    id: 'interview-qa',
    name: 'Interview Q&A',
    description: 'Expert-level answers for AI annotation and judiciary interviews'
  },
  {
    id: 'bare-act-summary',
    name: 'Bare Act Summary',
    description: 'Section-wise analysis of Indian statutes'
  },
  {
    id: 'case-analysis',
    name: 'Case Analysis',
    description: 'Landmark judgments with ratio, obiter, and practical significance'
  },
  {
    id: 'comparative-analysis',
    name: 'Comparative Analysis',
    description: 'Compare concepts across Indian laws (e.g., IPC vs BNS)'
  }
];

export const DEPTH_LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Simple language, basic concepts, foundational understanding'
  },
  {
    id: 'practitioner',
    name: 'Practitioner',
    description: 'Reflects 8-10 years of legal practice, practical insights'
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Advanced jurisprudence, complex case law, subtle distinctions'
  },
  {
    id: 'judicial',
    name: 'Judicial',
    description: 'High Court judge-level analysis, constitutional depth'
  }
];

export const TARGET_EXAMS = [
  'Scale AI',
  'Outlier AI',
  'Mark',
  'Tiering',
  'Higher Judiciary',
  'Civil Service',
  'General Practice'
];

export const BARE_ACTS_REFERENCE = {
  'IPC': [1, 34, 51, 75, 100, 133, 149, 304, 362, 379, 420, 498],
  'CrPC': [41, 50, 61, 167, 225, 232, 309, 372, 386],
  'IEA': [3, 4, 5, 11, 23, 51, 65, 92],
  'ICA': [2, 6, 12, 13, 18, 39, 40, 54, 55, 62, 73, 75],
  'BNS': [2, 3, 4, 5, 101, 103, 112, 115, 193, 286, 356],
  'BNSS': [2, 3, 11, 19, 49, 53, 100, 150, 227],
  'BSA': [2, 3, 4, 6, 41, 51, 63, 65]
};
