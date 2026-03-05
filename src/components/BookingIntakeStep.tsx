"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, FileText, ArrowRight, Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "../lib/utils";

export type BudgetOption = '<1000' | '1000-2000' | '2000-3500' | '3500-5000' | '5000+';

export interface BookingIntakeData {
  companyName: string;
  contactPerson: string;
  logoFiles?: File[];
  projectType: 'new' | 'existing';
  currentWebsiteUrl?: string;
  mainGoal: string;
  primaryAction: string;
  servicesDescription: string;
  focusCentral: string;
  offerExplanation?: string;
  primaryAudience: string;
  colorHex?: string;
  style: string;
  favoriteWebsites?: string;
  competitors?: string;
  doNotMention?: string;
  budget: BudgetOption;
}

const INTAKE_STORAGE_KEY = 'webdirect_booking_intake';

export function storeBookingIntakeData(data: BookingIntakeData) {
  if (typeof window !== 'undefined') {
    const { logoFiles, ...dataToStore } = data;
    sessionStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(dataToStore));
  }
}

export function getBookingIntakeData(): BookingIntakeData | null {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(INTAKE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BookingIntakeData) : null;
    } catch {
      return null;
    }
  }
  return null;
}

const MAIN_GOAL_OPTIONS = [
  { value: 'new_clients', label: 'Nieuwe klanten krijgen' },
  { value: 'appointments', label: 'Afspraken genereren' },
  { value: 'quotes', label: 'Offerte aanvragen' },
  { value: 'information', label: 'Informatie verstrekken' },
  { value: 'other', label: 'Other' },
];

const PRIMARY_ACTION_OPTIONS = [
  { value: 'appointment', label: 'Afspraak plannen' },
  { value: 'call', label: 'Bellen' },
  { value: 'whatsapp', label: 'WhatsApp bericht sturen' },
  { value: 'form', label: 'Contactformulier invullen' },
  { value: 'other', label: 'Other' },
];

const FOCUS_CENTRAL_OPTIONS = [
  { value: 'single_service', label: 'Eén specifieke dienst of product' },
  { value: 'multiple_services', label: 'Meerdere diensten of producten' },
  { value: 'action_offer', label: 'Een actie of aanbod' },
  { value: 'general_intro', label: 'Algemene kennismaking' },
];

const AUDIENCE_OPTIONS = [
  { value: 'consumers', label: 'Consumenten' },
  { value: 'businesses', label: 'Bedrijven' },
  { value: 'both', label: 'Beide' },
];

const STYLE_OPTIONS = [
  { value: 'sleek_modern', label: 'Strak en modern' },
  { value: 'professional', label: 'Zakelijk en professioneel' },
  { value: 'warm', label: 'Warm en persoonlijk' },
  { value: 'luxury', label: 'Luxe' },
  { value: 'playful', label: 'Speels' },
  { value: 'other', label: 'Other' },
];

const BUDGET_OPTIONS: { value: BudgetOption; label: string }[] = [
  { value: '<1000', label: '< €1000' },
  { value: '1000-2000', label: '€1000 - €2000' },
  { value: '2000-3500', label: '€2000 - €3500' },
  { value: '3500-5000', label: '€3500 - €5000' },
  { value: '5000+', label: '€5000+' },
];

export const INTAKE_SECTION_COUNT = 4;

const SECTION_TITLES_KEYS: [string, string, string, string] = [
  "sections.companyProject",
  "sections.goalsOffer",
  "sections.styleDesign",
  "sections.budgetOther",
];

interface BookingIntakeStepProps {
  onComplete: (data: BookingIntakeData) => void;
  onBack: () => void;
  onSectionChange?: (sectionIndex: number) => void;
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors';
const labelClass = 'block text-sm font-medium text-gray-400 mb-1.5';

function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <>
      <div className="space-y-2 mt-2">
        {options.map((o) => {
          const isSelected = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-[#41AE96]/20 border-[#41AE96]/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                  isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5',
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </span>
              <span className="font-medium text-white">{o.label}</span>
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={isSelected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </>
  );
}

export const BookingIntakeStep = ({ onComplete, onBack, onSectionChange }: BookingIntakeStepProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const t = useTranslations("booking.intake");

  // Section 1: Bedrijf & Project
  const [companyName, setCompanyName] = useState('');
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [logoPreviews, setLogoPreviews] = useState<string[]>([]);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectType, setProjectType] = useState<'new' | 'existing'>('new');
  const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState('');

  // Section 2: Doelen & Aanbod
  const [mainGoal, setMainGoal] = useState('');
  const [primaryAction, setPrimaryAction] = useState('');
  const [servicesDescription, setServicesDescription] = useState('');
  const [focusCentral, setFocusCentral] = useState('');
  const [offerExplanation, setOfferExplanation] = useState('');

  // Section 3: Stijl & Design
  const [primaryAudience, setPrimaryAudience] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [style, setStyle] = useState('');
  const [favoriteWebsites, setFavoriteWebsites] = useState('');

  // Section 4: Budget & Overig
  const [competitors, setCompetitors] = useState('');
  const [doNotMention, setDoNotMention] = useState('');
  const [budget, setBudget] = useState<BudgetOption | ''>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const changeSectionTo = (index: number) => {
    setSectionIndex(index);
    onSectionChange?.(index);
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // --- File handling ---
  const processFiles = (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;
    setLogoError(null);

    setLogoFiles((currentFiles) => {
      const newFiles: File[] = [];
      const previewPromises: Promise<string>[] = [];

      for (const file of fileArray) {
        if (currentFiles.length + newFiles.length >= 10) {
          setLogoError(t("errors.logo.tooManyFiles"));
          break;
        }
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
          setLogoError(t("errors.logo.tooLarge", { name: file.name, maxMb: 100 }));
          continue;
        }
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          setLogoError(t("errors.logo.invalidType", { name: file.name }));
          continue;
        }
        newFiles.push(file);
        if (file.type.startsWith('image/')) {
          previewPromises.push(
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve((e.target?.result as string) || '');
              reader.onerror = () => resolve('');
              reader.readAsDataURL(file);
            }),
          );
        } else {
          previewPromises.push(Promise.resolve(''));
        }
      }

      if (previewPromises.length > 0) {
        Promise.all(previewPromises).then((previews) => {
          setLogoPreviews((prev) => [...prev, ...previews]);
        });
      }
      return [...currentFiles, ...newFiles];
    });
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveLogo = (index: number) => {
    setLogoFiles((prev) => prev.filter((_, i) => i !== index));
    setLogoPreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // --- Validation per section ---
  const validateSection = (idx: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (idx === 0) {
      if (!companyName.trim()) newErrors.companyName = t("errors.companyNameRequired");
      if (projectType === 'existing' && !currentWebsiteUrl.trim()) {
        newErrors.currentWebsiteUrl = t("errors.currentWebsiteUrlRequired");
      }
    } else if (idx === 1) {
      if (!mainGoal) newErrors.mainGoal = t("errors.mainGoalRequired");
      if (!primaryAction) newErrors.primaryAction = t("errors.primaryActionRequired");
      if (!servicesDescription.trim()) newErrors.servicesDescription = t("errors.servicesDescriptionRequired");
      if (!focusCentral) newErrors.focusCentral = t("errors.focusCentralRequired");
    } else if (idx === 2) {
      if (!primaryAudience) newErrors.primaryAudience = t("errors.primaryAudienceRequired");
      if (!style) newErrors.style = t("errors.styleRequired");
    } else if (idx === 3) {
      if (!budget) newErrors.budget = t("errors.budgetRequired");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstKey = Object.keys(newErrors)[0];
        const el = document.querySelector(`[data-field="${firstKey}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSection(sectionIndex)) return;

    if (sectionIndex < INTAKE_SECTION_COUNT - 1) {
      changeSectionTo(sectionIndex + 1);
      setErrors({});
    } else {
      // Final section -- submit
      const data: BookingIntakeData = {
        companyName: companyName.trim(),
        contactPerson: '',
        logoFiles: logoFiles.length > 0 ? logoFiles : undefined,
        projectType,
        currentWebsiteUrl: projectType === 'existing' ? currentWebsiteUrl.trim() : undefined,
        mainGoal,
        primaryAction,
        servicesDescription: servicesDescription.trim(),
        focusCentral,
        offerExplanation: offerExplanation.trim() || undefined,
        primaryAudience,
        colorHex: colorHex.trim() || undefined,
        style,
        favoriteWebsites: favoriteWebsites.trim() || undefined,
        competitors: competitors.trim() || undefined,
        doNotMention: doNotMention.trim() || undefined,
        budget: budget as BudgetOption,
      };
      storeBookingIntakeData(data);
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (sectionIndex > 0) {
      changeSectionTo(sectionIndex - 1);
      setErrors({});
    } else {
      onBack();
    }
  };

  const isLastSection = sectionIndex === INTAKE_SECTION_COUNT - 1;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {sectionIndex === 0 ? t("back") : t("previous")}
        </button>
      </div>

      <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 pb-3 pt-4 px-4 sm:px-5 md:px-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{t("title")}</h3>
            <p className="text-gray-400 text-xs">
              {t(SECTION_TITLES_KEYS[sectionIndex])}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <form onSubmit={handleNext} className="relative z-10 space-y-5">
            <AnimatePresence mode="wait">
              {sectionIndex === 0 && (
                <motion.div
                  key="section-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Company Name */}
                  <div data-field="companyName">
                    <label className={labelClass}>{t("fields.companyName.label")} *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t("fields.companyName.placeholder")}
                      className={inputClass}
                      autoFocus
                    />
                    {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className={labelClass}>{t("fields.logo.label")}</label>
                    <p className="text-xs text-gray-500 mb-2">
                      {t("fields.logo.helper")}
                    </p>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => e.preventDefault()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-6 text-center transition-colors',
                        'border-white/10 hover:border-[#41AE96]/50 bg-white/5 hover:bg-white/10 cursor-pointer',
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,application/pdf"
                        onChange={handleLogoSelect}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-[#41AE96] mx-auto mb-2" />
                      <p className="text-white text-sm font-medium mb-1">
                        {t("fields.logo.cta")}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {t("fields.logo.formats")}
                      </p>
                    </div>
                    {logoError && <p className="mt-2 text-sm text-red-400">{logoError}</p>}
                    {logoFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {logoFiles.map((file, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            {logoPreviews[index] ? (
                              <img src={logoPreviews[index]} alt={file.name} className="w-full h-24 object-contain p-2" />
                            ) : (
                              <div className="w-full h-24 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveLogo(index); }}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                            <p className="text-xs text-gray-400 px-2 pb-2 truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-gray-500 px-2 pb-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className={labelClass}>{t("fields.projectType.label")} *</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        { value: "new" as const, label: t("fields.projectType.new") },
                        { value: "existing" as const, label: t("fields.projectType.existing") },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setProjectType(opt.value)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                            projectType === opt.value
                              ? 'bg-[#41AE96]/20 border-[#41AE96]/50 text-white'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-[#41AE96]/50',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Website URL (conditional) */}
                  {projectType === 'existing' && (
                    <div data-field="currentWebsiteUrl">
                      <label className={labelClass}>{t("fields.currentWebsiteUrl.label")} *</label>
                      <input
                        type="url"
                        value={currentWebsiteUrl}
                        onChange={(e) => setCurrentWebsiteUrl(e.target.value)}
                        placeholder={t("fields.currentWebsiteUrl.placeholder")}
                        className={inputClass}
                      />
                      {errors.currentWebsiteUrl && <p className="mt-1 text-sm text-red-400">{errors.currentWebsiteUrl}</p>}
                    </div>
                  )}
                </motion.div>
              )}

              {sectionIndex === 1 && (
                <motion.div
                  key="section-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Main Goal */}
                  <div data-field="mainGoal">
                    <label className={labelClass}>{t("fields.mainGoal.label")} *</label>
                    <RadioGroup name="mainGoal" options={MAIN_GOAL_OPTIONS} value={mainGoal} onChange={setMainGoal} error={errors.mainGoal} />
                  </div>

                  {/* Primary Action */}
                  <div data-field="primaryAction">
                    <label className={labelClass}>{t("fields.primaryAction.label")} *</label>
                    <RadioGroup name="primaryAction" options={PRIMARY_ACTION_OPTIONS} value={primaryAction} onChange={setPrimaryAction} error={errors.primaryAction} />
                  </div>

                  {/* Services Description */}
                  <div data-field="servicesDescription">
                    <label className={labelClass}>{t("fields.servicesDescription.label")} *</label>
                    <textarea
                      value={servicesDescription}
                      onChange={(e) => setServicesDescription(e.target.value)}
                      placeholder={t("fields.servicesDescription.placeholder")}
                      rows={3}
                      className={cn(inputClass, 'resize-none')}
                    />
                    {errors.servicesDescription && <p className="mt-1 text-sm text-red-400">{errors.servicesDescription}</p>}
                  </div>

                  {/* Focus Central */}
                  <div data-field="focusCentral">
                    <label className={labelClass}>{t("fields.focusCentral.label")} *</label>
                    <RadioGroup name="focusCentral" options={FOCUS_CENTRAL_OPTIONS} value={focusCentral} onChange={setFocusCentral} error={errors.focusCentral} />
                  </div>

                  {/* Offer Explanation */}
                  <div>
                    <label className={labelClass}>{t("fields.offerExplanation.label")}</label>
                    <textarea
                      value={offerExplanation}
                      onChange={(e) => setOfferExplanation(e.target.value)}
                      placeholder={t("fields.offerExplanation.placeholder")}
                      rows={2}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>
                </motion.div>
              )}

              {sectionIndex === 2 && (
                <motion.div
                  key="section-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Primary Audience */}
                  <div data-field="primaryAudience">
                    <label className={labelClass}>{t("fields.primaryAudience.label")} *</label>
                    <RadioGroup name="primaryAudience" options={AUDIENCE_OPTIONS} value={primaryAudience} onChange={setPrimaryAudience} error={errors.primaryAudience} />
                  </div>

                  {/* Color Hex */}
                  <div>
                    <label className={labelClass}>{t("fields.colorHex.label")}</label>
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      placeholder={t("fields.colorHex.placeholder")}
                      className={inputClass}
                    />
                  </div>

                  {/* Style */}
                  <div data-field="style">
                    <label className={labelClass}>{t("fields.style.label")} *</label>
                    <RadioGroup name="style" options={STYLE_OPTIONS} value={style} onChange={setStyle} error={errors.style} />
                  </div>

                  {/* Favorite Websites */}
                  <div>
                    <label className={labelClass}>{t("fields.favoriteWebsites.label")}</label>
                    <textarea
                      value={favoriteWebsites}
                      onChange={(e) => setFavoriteWebsites(e.target.value)}
                      placeholder={t("fields.favoriteWebsites.placeholder")}
                      rows={2}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>
                </motion.div>
              )}

              {sectionIndex === 3 && (
                <motion.div
                  key="section-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Competitors */}
                  <div>
                    <label className={labelClass}>{t("fields.competitors.label")}</label>
                    <textarea
                      value={competitors}
                      onChange={(e) => setCompetitors(e.target.value)}
                      placeholder={t("fields.competitors.placeholder")}
                      rows={2}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  {/* Do Not Mention */}
                  <div>
                    <label className={labelClass}>{t("fields.doNotMention.label")}</label>
                    <textarea
                      value={doNotMention}
                      onChange={(e) => setDoNotMention(e.target.value)}
                      placeholder={t("fields.doNotMention.placeholder")}
                      rows={2}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  {/* Budget */}
                  <div data-field="budget">
                    <label className={labelClass}>{t("fields.budget.label")} *</label>
                    <RadioGroup name="budget" options={BUDGET_OPTIONS} value={budget} onChange={(v) => setBudget(v as BudgetOption)} error={errors.budget} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-4"
            >
              <span>{isLastSection ? t("cta.nextToDetails") : t("cta.next")}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
