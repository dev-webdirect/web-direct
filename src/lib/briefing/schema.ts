import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Use a valid hex color (#RGB or #RRGGBB)');

const optionalUrl = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.string().url().optional(),
);

const optionalEmail = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.string().email().optional(),
);

const urlOrImageDataUrl = z.string().refine(
  (val) => {
    if (/^data:image\//i.test(val)) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid URL or an image data URL' },
);

const competitorSchema = z.object({
  name: z.string().default(''),
  website: z.string().default(''),
});

const homepageContentSchema = z.object({
  heroTitle: z.string().optional().default(''),
  heroSubtitle: z.string().optional().default(''),
  ctaText: z.string().optional().default(''),
  sections: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .default(''),
});

const faqItemSchema = z.object({
  question: z.string().default(''),
  answer: z.string().default(''),
  documentUrl: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.string().url('Use a valid URL to your document').optional(),
  ),
});

/** Validated in superRefine when this page type is selected; must match PAGES_NEEDED_OPTIONS. */
export const BRIEFING_CUSTOM_PAGES_LABEL = 'Custom pages';

const domainInfoSchema = z.object({
  domain: z.string().default(''),
  provider: z.string().default(''),
});

export const briefingFormSchema = z.object({
  businessName: z.string().optional().default(''),
  industry: z.string().optional().default(''),
  businessEmail: optionalEmail,
  personalEmail: optionalEmail,
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
  googleMapsLink: optionalUrl,
  socialLinks: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
        : [],
    z.array(z.string().url()).default([]),
  ),
  website: optionalUrl,
  tagline: z.string().optional().default(''),
  knownFor: z.preprocess(
    (v) => {
      if (!Array.isArray(v)) return [];
      return v.map((s) => String(s).trim()).filter((s) => s.length > 0);
    },
    z.array(z.string()).default([]),
  ),
  restrictions: z.string().optional().default(''),
  targetLocation: z.string().optional().default(''),
  targetAudience: z.string().optional().default(''),
  competitors: z.preprocess(
    (v) => {
      if (!Array.isArray(v)) return [];
      return v.filter(
        (c: { name?: string; website?: string }) =>
          typeof c?.name === 'string' &&
          c.name.trim() !== '',
      );
    },
    z.array(competitorSchema).default([]),
  ),

  logos: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
        : [],
    z.array(z.string().url('Each logo must be a valid URL')).default([]),
  ),
  brandColors: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
        : [],
    z.array(hexColor).default([]),
  ),
  fonts: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
        : [],
    z.array(z.string()).default([]),
  ),
  brandGuidelines: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    urlOrImageDataUrl.optional(),
  ),
  toneOfVoice: z
    .enum(['professional', 'friendly', 'luxury', 'bold'])
    .optional()
    .default('professional'),

  websiteType: z
    .enum(['marketing', 'ecommerce', 'portfolio', 'landing', 'blog', 'other'])
    .optional()
    .default('marketing'),
  pagesNeeded: z.array(z.string()).default([]),
  pageDescriptions: z.record(z.string(), z.string()).optional().default({}),
  customPagesDescription: z.string().optional().default(''),
  homepageContent: homepageContentSchema.optional().default({
    heroTitle: '',
    heroSubtitle: '',
    ctaText: '',
    sections: '',
  }),
  faq: z.preprocess(
    (v) => {
      if (!Array.isArray(v)) return [];
      return v.filter(
        (item: { question?: string; answer?: string }) =>
          String(item?.question ?? '').trim() !== '' ||
          String(item?.answer ?? '').trim() !== '',
      );
    },
    z.array(faqItemSchema).default([]),
  ),
  images: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
        : [],
    z.array(z.string().url()).default([]),
  ),

  hasDomain: z.boolean().optional().default(false),
  domainInfo: domainInfoSchema.optional(),
  contentEditor: z.string().optional().default(''),
  multiLanguage: z.boolean().optional().default(false),
  languages: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v.map((s) => String(s).trim()).filter((s) => s.length > 0)
        : [],
    z.array(z.string()).default([]),
  ),

  deadline: z.string().optional().default(''),
  revisions: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? 0 : v),
    z.coerce.number().int().min(0).max(99).default(0),
  ),
});

export type BriefingFormValues = z.infer<typeof briefingFormSchema>;

/** Field groups for step-by-step `trigger()` in react-hook-form */
export const BRIEFING_STEP_FIELDS: (keyof BriefingFormValues)[][] = [
  [
    'businessName',
    'industry',
    'businessEmail',
    'personalEmail',
    'phone',
    'address',
    'googleMapsLink',
    'socialLinks',
    'website',
    'tagline',
    'knownFor',
    'restrictions',
    'targetLocation',
    'targetAudience',
    'competitors',
  ],
  ['logos', 'brandColors', 'fonts', 'brandGuidelines', 'toneOfVoice'],
  ['websiteType', 'pagesNeeded', 'pageDescriptions', 'customPagesDescription', 'homepageContent', 'faq', 'images'],
  ['hasDomain', 'domainInfo', 'contentEditor', 'multiLanguage', 'languages'],
  ['deadline', 'revisions'],
];

export const BRIEFING_TOTAL_STEPS = BRIEFING_STEP_FIELDS.length;

export const WEBSITE_TYPE_OPTIONS: { value: NonNullable<BriefingFormValues['websiteType']>; label: string }[] = [
  { value: 'marketing', label: 'Marketing / corporate' },
  { value: 'ecommerce', label: 'E\u2011commerce' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'landing', label: 'Landing page' },
  { value: 'blog', label: 'Blog / content' },
  { value: 'other', label: 'Other' },
];

export const PAGES_NEEDED_OPTIONS = [
  'Home',
  'About',
  'Services / products',
  'Contact',
  'Blog',
  'FAQ',
  'Pricing',
  'Careers',
  'Legal (privacy, terms)',
  BRIEFING_CUSTOM_PAGES_LABEL,
] as const;
