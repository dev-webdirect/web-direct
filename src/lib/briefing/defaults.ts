import type { BriefingFormValues } from './schema';

export const briefingDefaultValues: BriefingFormValues = {
  businessName: '',
  industry: '',
  businessEmail: '',
  personalEmail: '',
  phone: '',
  address: '',
  googleMapsLink: '',
  socialLinks: [],
  website: undefined,
  tagline: '',
  knownFor: [''],
  restrictions: '',
  targetLocation: '',
  targetAudience: '',
  competitors: [],

  logos: [],
  brandColors: [],
  fonts: [],
  brandGuidelines: undefined,
  toneOfVoice: 'professional',

  websiteType: 'marketing',
  pagesNeeded: [],
  customPagesDescription: '',
  homepageContent: {
    heroTitle: '',
    heroSubtitle: '',
    ctaText: '',
    sections: '',
  },
  faq: [],
  images: [],

  hasDomain: false,
  domainInfo: { domain: '', provider: '' },
  contentEditor: '',
  multiLanguage: false,
  languages: [],

  deadline: '',
  budget: 0,
  revisions: 2,
};
