'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  briefingFormSchema,
  type BriefingFormValues,
  BRIEFING_STEP_FIELDS,
  BRIEFING_TOTAL_STEPS,
  WEBSITE_TYPE_OPTIONS,
  PAGES_NEEDED_OPTIONS,
  BRIEFING_CUSTOM_PAGES_LABEL,
} from '@/src/lib/briefing/schema';
import { briefingDefaultValues } from '@/src/lib/briefing/defaults';
import { cn } from '@/src/lib/utils';

const TONE_OF_VOICE_OPTIONS = [
  { value: 'professional' as const, label: 'Professional' },
  { value: 'friendly' as const, label: 'Friendly' },
  { value: 'luxury' as const, label: 'Luxury' },
  { value: 'bold' as const, label: 'Bold' },
];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors';
const labelClass = 'block text-sm font-medium text-gray-400 mb-1.5';

/** YYYY-MM-DD in local timezone, for `<input type="date" min="...">`. */
function localDateInputMin(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type Props = {
  accessToken: string;
};

const STEP_TITLES = [
  'Business information',
  'Brand & identity',
  'Content',
  'Technical',
  'Project scope',
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export function BriefingWizard({ accessToken }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingFormSchema) as Resolver<BriefingFormValues>,
    defaultValues: briefingDefaultValues,
    mode: 'onBlur',
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const faqFa = useFieldArray({ control, name: 'faq' });

  const hasDomain = watch('hasDomain');
  const multiLanguage = watch('multiLanguage');
  const pagesNeeded = watch('pagesNeeded') ?? [];
  /** Per-page description fields in the same order as the “Pages needed” chips */
  const standardPageDescriptionsOrdered = PAGES_NEEDED_OPTIONS.filter(
    (page) =>
      page !== BRIEFING_CUSTOM_PAGES_LABEL &&
      page !== 'Home' &&
      pagesNeeded.includes(page),
  );
  const deadlineMin = localDateInputMin();
  const draftKey = `briefing-draft-${accessToken}`;

  const persistDraft = useCallback(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(getValues()));
    } catch {
      /* ignore quota */
    }
  }, [draftKey, getValues]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<BriefingFormValues>;
      const merged = { ...briefingDefaultValues, ...parsed };
      const todayYmd = localDateInputMin();
      if (
        merged.deadline?.trim() &&
        /^\d{4}-\d{2}-\d{2}$/.test(merged.deadline.trim()) &&
        merged.deadline.trim() < todayYmd
      ) {
        merged.deadline = '';
      }
      reset(merged);
    } catch {
      /* ignore */
    }
  }, [draftKey, reset]);

  useEffect(() => {
    const t = window.setInterval(persistDraft, 4000);
    return () => window.clearInterval(t);
  }, [persistDraft]);

  const next = async () => {
    setApiError(null);
    const fields = BRIEFING_STEP_FIELDS[step];
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) return;
    persistDraft();
    setStep((s) => Math.min(s + 1, BRIEFING_TOTAL_STEPS - 1));
  };

  const back = () => {
    setApiError(null);
    persistDraft();
    setStep((s) => Math.max(s - 1, 0));
  };

  const onValid = async (data: BriefingFormValues) => {
    setApiError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Briefing-Token': accessToken,
        },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 403) {
        setApiError('This link is no longer valid. Request a new briefing URL from your agency.');
        return;
      }
      if (!res.ok) {
        setApiError(
          typeof json.error === 'string'
            ? json.error
            : 'Could not submit briefing. Check the form and try again.',
        );
        return;
      }
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* ignore */
      }
      setDone(true);
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePage = (label: string) => {
    const nextPages = pagesNeeded.includes(label)
      ? pagesNeeded.filter((p) => p !== label)
      : [...pagesNeeded, label];
    if (label === BRIEFING_CUSTOM_PAGES_LABEL && !nextPages.includes(BRIEFING_CUSTOM_PAGES_LABEL)) {
      setValue('customPagesDescription', '', { shouldValidate: true, shouldDirty: true });
    }
    if (!nextPages.includes(label)) {
      const current = getValues('pageDescriptions') ?? {};
      const { [label]: _, ...rest } = current;
      setValue('pageDescriptions', rest, { shouldDirty: true });
    }
    setValue('pagesNeeded', nextPages, { shouldValidate: true, shouldDirty: true });
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white py-16">
        <div className="rounded-full bg-[#41AE96]/20 p-6 mb-6">
          <Check className="w-12 h-12 text-[#41AE96]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Thank you ! Briefing received. </h1>
        
      </div>
    );
  }

  const progress = ((step + 1) / BRIEFING_TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 py-10 sm:py-14 text-white max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Website briefing questionnaire</h1>
        <p className="text-white/60 text-sm mt-2">
          Step {step + 1} of {BRIEFING_TOTAL_STEPS}.
        </p>
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-[#6a49ff] to-[#41AE96]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {apiError && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-sm">{apiError}</div>
      )}

      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-5 sm:p-8">
     

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-white/10">{STEP_TITLES[step]}</h2>

            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Business name</label>
                  <input {...register('businessName')} className={inputClass} />
                  <FieldError message={errors.businessName?.message} />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <input {...register('industry')} className={inputClass} placeholder="e.g. Dental, SaaS, Retail" />
                  <FieldError message={errors.industry?.message} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Business email</label>
                    <input type="email" {...register('businessEmail')} className={inputClass} />
                    <FieldError message={errors.businessEmail?.message} />
                  </div>
                  <div>
                    <label className={labelClass}>Personal email (optional)</label>
                    <input type="email" {...register('personalEmail')} className={inputClass} />
                    <FieldError message={errors.personalEmail?.message} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input {...register('phone')} className={inputClass} />
                  <FieldError message={errors.phone?.message} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <textarea {...register('address')} rows={2} className={inputClass} />
                  <FieldError message={errors.address?.message} />
                </div>
                <div>
                  <label className={labelClass}>Google Maps link</label>
                  <input {...register('googleMapsLink')} className={inputClass} placeholder="https://maps.google.com/..." />
                  <FieldError message={errors.googleMapsLink?.message} />
                </div>
                <div>
                  <label className={labelClass}>Website (optional)</label>
                  <input {...register('website')} className={inputClass} />
                  <FieldError message={errors.website?.message} />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input {...register('tagline')} className={inputClass} />
                  <FieldError message={errors.tagline?.message} />
                </div>
                <div>
                  <label className={labelClass}>Known for (1-3 short items)</label>
                  <Controller
                    control={control}
                    name="knownFor"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((_, i) => (
                          <input
                            key={i}
                            className={inputClass}
                            value={field.value[i] ?? ''}
                            onChange={(e) => {
                              const next = [...field.value];
                              next[i] = e.target.value;
                              field.onChange(next);
                            }}
                          />
                        ))}
                        {field.value.length < 3 && (
                          <button
                            type="button"
                            onClick={() => field.onChange([...field.value, ''])}
                            className="text-sm text-[#41AE96] flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add item
                          </button>
                        )}
                      </div>
                    )}
                  />
                  <FieldError message={errors.knownFor?.message} />
                </div>
                <div>
                  <label className={labelClass}>Restrictions (optional)</label>
                  <textarea {...register('restrictions')} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Target location</label>
                  <input {...register('targetLocation')} className={inputClass} />
                  <FieldError message={errors.targetLocation?.message} />
                </div>
                <div>
                  <label className={labelClass}>Target audience</label>
                  <textarea {...register('targetAudience')} rows={3} className={inputClass} />
                  <FieldError message={errors.targetAudience?.message} />
                </div>

                <div>
                  <label className={labelClass}>Social profile URLs</label>
                  <Controller
                    control={control}
                    name="socialLinks"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((url, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className={inputClass}
                              value={url}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = e.target.value;
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                              aria-label="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, ''])}
                          className="text-sm text-[#41AE96] flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add URL
                        </button>
                      </div>
                    )}
                  />
                  <FieldError message={(errors.socialLinks as { message?: string } | undefined)?.message} />
                </div>

                <div>
                  <label className={labelClass}>Competitors</label>
                  <Controller
                    control={control}
                    name="competitors"
                    render={({ field }) => (
                      <div className="space-y-3">
                        {field.value.map((row, i) => (
                          <div key={i} className="flex flex-col sm:flex-row gap-2">
                            <input
                              className={inputClass}
                              placeholder="Name"
                              value={row.name}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = { ...next[i], name: e.target.value };
                                field.onChange(next);
                              }}
                            />
                            <input
                              className={inputClass}
                              placeholder="https://..."
                              value={row.website}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = { ...next[i], website: e.target.value };
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10 shrink-0"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, { name: '', website: '' }])}
                          className="text-sm text-[#41AE96] flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add competitor
                        </button>
                      </div>
                    )}
                  />
                  <FieldError message={errors.competitors?.message} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Logo links</label>
                  <p className="text-xs text-white/50 mb-2">
                    Add direct URLs to your logo files (e.g. Google Drive, Dropbox, etc.).
                  </p>
                  <Controller
                    control={control}
                    name="logos"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((url, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="url"
                              className={inputClass}
                              placeholder="https://..."
                              value={url}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = e.target.value;
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                              aria-label="Remove logo link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, ''])}
                          className="text-sm text-[#41AE96] flex items-center gap-1 disabled:opacity-40"
                          disabled={field.value.length >= 10}
                        >
                          <Plus className="w-4 h-4" /> Add logo link
                        </button>
                      </div>
                    )}
                  />
                  <FieldError message={errors.logos?.message} />
                </div>
                <div>
                  <label className={labelClass}>Brand colors (hex)</label>
                  <Controller
                    control={control}
                    name="brandColors"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((hex, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className={inputClass}
                              placeholder="#RRGGBB"
                              value={hex}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = e.target.value;
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, '#000000'])}
                          className="text-sm text-[#41AE96] flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add color
                        </button>
                      </div>
                    )}
                  />
                  <FieldError message={errors.brandColors?.message} />
                </div>
                <div>
                  <label className={labelClass}>Fonts (family names)</label>
                  <Controller
                    control={control}
                    name="fonts"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((font, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className={inputClass}
                              placeholder="e.g. Inter"
                              value={font}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = e.target.value;
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, ''])}
                          className="text-sm text-[#41AE96] flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add font
                        </button>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>Brand guidelines (URL or leave empty)</label>
                  <input {...register('brandGuidelines')} className={inputClass} placeholder="https://.." />
                  <FieldError message={errors.brandGuidelines?.message} />
                </div>
                <div>
                  <label className={labelClass}>Tone of voice</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TONE_OF_VOICE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setValue('toneOfVoice', opt.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                          watch('toneOfVoice') === opt.value
                            ? 'bg-[#41AE96]/20 border-[#41AE96]/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-[#41AE96]/50',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <FieldError message={errors.toneOfVoice?.message} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Website type</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {WEBSITE_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setValue('websiteType', opt.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={cn(
                          'px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left',
                          watch('websiteType') === opt.value
                            ? 'bg-[#41AE96]/20 border-[#41AE96]/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-[#41AE96]/50',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <FieldError message={errors.websiteType?.message} />
                </div>
                <div>
                  <label className={labelClass}>Pages needed</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PAGES_NEEDED_OPTIONS.map((page) => (
                      <label
                        key={page}
                        className={`cursor-pointer px-3 py-2 rounded-xl text-sm border transition-colors ${
                          pagesNeeded.includes(page)
                            ? 'bg-[#41AE96]/20 border-[#41AE96]/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={pagesNeeded.includes(page)}
                          onChange={() => togglePage(page)}
                        />
                        {page}
                      </label>
                    ))}
                  </div>
                  <FieldError message={errors.pagesNeeded?.message} />
                </div>

                {pagesNeeded.includes('Home') && (
                  <div className="space-y-3 border border-white/10 rounded-xl p-4">
                    <p className="text-sm font-medium text-white">Home — page content</p>
                    <div>
                      <label className={labelClass}>Hero title</label>
                      <input {...register('homepageContent.heroTitle')} className={inputClass} />
                      <FieldError message={errors.homepageContent?.heroTitle?.message} />
                    </div>
                    <div>
                      <label className={labelClass}>Hero subtitle</label>
                      <input {...register('homepageContent.heroSubtitle')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CTA button text</label>
                      <input {...register('homepageContent.ctaText')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Sections / notes (one per line or free text)</label>
                      <textarea {...register('homepageContent.sections')} rows={4} className={inputClass} />
                    </div>
                  </div>
                )}

                {standardPageDescriptionsOrdered.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">Describe what you need on each page:</p>
                    {standardPageDescriptionsOrdered.map((page) => (
                      <div key={page} className="border border-white/10 rounded-xl p-4">
                        <label className={labelClass}>{page}</label>
                        <textarea
                          rows={2}
                          className={cn(inputClass, 'resize-none')}
                          placeholder={`What should the ${page} page include?`}
                          value={watch('pageDescriptions')?.[page] ?? ''}
                          onChange={(e) => {
                            const current = getValues('pageDescriptions') ?? {};
                            setValue(
                              'pageDescriptions',
                              { ...current, [page]: e.target.value },
                              { shouldDirty: true },
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {pagesNeeded.includes(BRIEFING_CUSTOM_PAGES_LABEL) && (
                  <div data-field="customPagesDescription" className="border border-white/10 rounded-xl p-4">
                    <label className={labelClass}>Custom pages — describe what you need</label>
                    <textarea
                      {...register('customPagesDescription')}
                      rows={4}
                      className={cn(inputClass, 'resize-none')}
                      placeholder="e.g. Team page with bios, case study template, landing page for a campaign, pricing calculator..."
                    />
                    <FieldError message={errors.customPagesDescription?.message} />
                  </div>
                )}
                <div>
                  <label className={labelClass}>FAQ items</label>
                
                      
                        <input
                          type="url"
                          className={inputClass}
                          placeholder="https://docs.google.com/... or link to PDF"
                        />
                </div>
                <div>
                  <label className={labelClass}>Image URLs</label>
                  <Controller
                    control={control}
                    name="images"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value.map((url, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className={inputClass}
                              placeholder="https://..."
                              value={url}
                              onChange={(e) => {
                                const next = [...field.value];
                                next[i] = e.target.value;
                                field.onChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-white/10"
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => field.onChange([...field.value, ''])}
                          className="text-sm text-[#41AE96] flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add image URL
                        </button>
                      </div>
                    )}
                  />
                  <FieldError message={errors.images?.message} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('hasDomain')} className="rounded border-white/20" />
                  <span>We already have a domain</span>
                </label>
                {hasDomain && (
                  <div className="grid sm:grid-cols-2 gap-4 pl-2 border-l-2 border-[#41AE96]/40">
                    <div>
                      <label className={labelClass}>Domain</label>
                      <input {...register('domainInfo.domain')} className={inputClass} placeholder="example.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Provider / registrar</label>
                      <input {...register('domainInfo.provider')} className={inputClass} placeholder="e.g. TransIP, Cloudflare" />
                    </div>
                    <FieldError message={errors.domainInfo?.message} />
                  </div>
                )}
                <div>
                  <label className={labelClass}>Who will edit content after launch?</label>
                  <textarea
                    {...register('contentEditor')}
                    rows={3}
                    className={inputClass}
                    placeholder="e.g. Our team, your marketing team ..."
                  />
                  <FieldError message={errors.contentEditor?.message} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('multiLanguage')} className="rounded border-white/20" />
                  <span>Multilingual website</span>
                </label>
                {multiLanguage && (
                  <div>
                    <label className={labelClass}>Languages (one per line in the box - use Add)</label>
                    <Controller
                      control={control}
                      name="languages"
                      render={({ field }) => (
                        <div className="space-y-2">
                          {field.value.map((lang, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                className={inputClass}
                                value={lang}
                                onChange={(e) => {
                                  const next = [...field.value];
                                  next[i] = e.target.value;
                                  field.onChange(next);
                                }}
                              />
                              <button
                                type="button"
                                className="p-2 rounded-lg bg-white/10"
                                onClick={() =>
                                  field.onChange(field.value.filter((_: string, j: number) => j !== i))
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => field.onChange([...field.value, ''])}
                            className="text-sm text-[#41AE96] flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add language
                          </button>
                        </div>
                      )}
                    />
                    <FieldError message={errors.languages?.message} />
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass} htmlFor="briefing-deadline">
                    Desired deadline{' '}
                    <span className="text-[#41AE96]" aria-hidden>
                      *
                    </span>
                  </label>
                  <input
                    id="briefing-deadline"
                    type="date"
                    min={deadlineMin}
                    required
                    aria-required="true"
                    {...register('deadline')}
                    className={inputClass}
                  />
                  <FieldError message={errors.deadline?.message} />
                </div>
                <div>
                  <label className={labelClass}>Requested revision rounds</label>
                  <input type="number" min="0" max="99" {...register('revisions', { valueAsNumber: true })} className={inputClass} />
                  <FieldError message={errors.revisions?.message} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < BRIEFING_TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#6a49ff] to-[#5839e6] font-semibold text-white"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit(onValid)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#41AE96] to-[#2d8a73] font-semibold text-white disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit briefing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
