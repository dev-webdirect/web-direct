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
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Valid website URL required'),
});

const homepageContentSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroSubtitle: z.string().optional().default(''),
  ctaText: z.string().optional().default(''),
  sections: z
    .union([z.string(), z.array(z.string().min(1))])
    .optional()
    .default(''),
});

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  /** Link to supporting doc (Google Docs, Dropbox, etc.) */
  documentUrl: z
    .string()
    .min(1, 'Document link is required')
    .url('Use a valid URL to your document (e.g. Google Docs, shared PDF)'),
});

/** Validated in superRefine when this page type is selected; must match PAGES_NEEDED_OPTIONS. */
export const BRIEFING_CUSTOM_PAGES_LABEL = 'Custom pages';

/** Validated in superRefine when hasDomain is true */
const domainInfoSchema = z.object({
  domain: z.string(),
  provider: z.string(),
});

export const briefingFormSchema = z
  .object({
    businessName: z.string().min(1, 'Business name is required'),
    industry: z.string().min(1, 'Industry is required'),
    businessEmail: z.string().email('Valid business email required'),
    personalEmail: optionalEmail,
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    googleMapsLink: z.string().url('Valid Google Maps URL required'),
    socialLinks: z.preprocess(
      (v) =>
        Array.isArray(v)
          ? v.filter((s) => typeof s === 'string' && s.trim() !== '')
          : [],
      z.array(z.string().url()).default([]),
    ),
    website: optionalUrl,
    tagline: z.string().min(1, 'Tagline is required'),
    knownFor: z.preprocess(
      (v) => {
        if (!Array.isArray(v)) return [];
        return v.map((s) => String(s).trim()).filter((s) => s.length > 0);
      },
      z
        .array(z.string().min(1))
        .min(1, 'Add at least one item you are known for')
        .max(3, 'Maximum 3 items'),
    ),
    restrictions: z.string().optional(),
    targetLocation: z.string().min(1, 'Target location is required'),
    targetAudience: z.string().min(1, 'Target audience is required'),
    competitors: z.preprocess(
      (v) => {
        if (!Array.isArray(v)) return [];
        return v.filter(
          (c: { name?: string; website?: string }) =>
            typeof c?.name === 'string' &&
            c.name.trim() !== '' &&
            typeof c?.website === 'string' &&
            c.website.trim() !== '',
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
      z.array(z.string().min(1)).default([]),
    ),
    brandGuidelines: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : v),
      urlOrImageDataUrl.optional(),
    ),
    toneOfVoice: z.enum(['professional', 'friendly', 'luxury', 'bold']),

    websiteType: z.enum(['marketing', 'ecommerce', 'portfolio', 'landing', 'blog', 'other']),
    pagesNeeded: z.array(z.string().min(1)).min(1, 'Select at least one page'),
    customPagesDescription: z.string().optional().default(''),
    homepageContent: homepageContentSchema,
    faq: z.preprocess(
      (v) => {
        if (!Array.isArray(v)) return [];
        return v.filter(
          (item: { question?: string; answer?: string; documentUrl?: string }) =>
            String(item?.question ?? '').trim() !== '' &&
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

    hasDomain: z.boolean(),
    domainInfo: domainInfoSchema.optional(),
    contentEditor: z
      .string()
      .min(1, 'Describe who will edit content after launch (and how, if known)'),
    multiLanguage: z.boolean(),
    languages: z.preprocess(
      (v) =>
        Array.isArray(v)
          ? v.map((s) => String(s).trim()).filter((s) => s.length > 0)
          : [],
      z.array(z.string().min(1)).default([]),
    ),

    deadline: z
      .string()
      .min(1, 'Deadline is required')
      .refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date'),
    budget: z.coerce.number().positive('Budget must be a positive number'),
    revisions: z.coerce.number().int().min(0).max(99),
  })
  .superRefine((data, ctx) => {
    if (data.hasDomain) {
      if (!data.domainInfo?.domain?.trim() || !data.domainInfo?.provider?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Domain and provider are required when you already have a domain',
          path: ['domainInfo', 'domain'],
        });
      }
    }
    if (data.multiLanguage && data.languages.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one language for multilingual sites',
        path: ['languages'],
      });
    }
    if (
      data.pagesNeeded.includes(BRIEFING_CUSTOM_PAGES_LABEL) &&
      !data.customPagesDescription?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Describe the custom pages you need',
        path: ['customPagesDescription'],
      });
    }
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
  ['websiteType', 'pagesNeeded', 'customPagesDescription', 'homepageContent', 'faq', 'images'],
  ['hasDomain', 'domainInfo', 'contentEditor', 'multiLanguage', 'languages'],
  ['deadline', 'budget', 'revisions'],
];

export const BRIEFING_TOTAL_STEPS = BRIEFING_STEP_FIELDS.length;

export const WEBSITE_TYPE_OPTIONS: { value: BriefingFormValues['websiteType']; label: string }[] = [
  { value: 'marketing', label: 'Marketing / corporate' },
  { value: 'ecommerce', label: 'E‑commerce' },
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
