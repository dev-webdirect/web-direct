'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, FileText, ArrowRight, Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '../lib/utils';

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
    // Exclude File objects from storage (they can't be serialized)
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

interface BookingIntakeStepProps {
  onComplete: (data: BookingIntakeData) => void;
  onBack: () => void;
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors';
const labelClass = 'block text-sm font-medium text-gray-400 mb-1.5';

export const BookingIntakeStep = ({ onComplete, onBack }: BookingIntakeStepProps) => {
  const [subStep, setSubStep] = useState<1 | 2>(1);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [logoPreviews, setLogoPreviews] = useState<string[]>([]);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectType, setProjectType] = useState<'new' | 'existing'>('new');
  const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [primaryAction, setPrimaryAction] = useState('');
  const [servicesDescription, setServicesDescription] = useState('');
  const [focusCentral, setFocusCentral] = useState('');
  const [offerExplanation, setOfferExplanation] = useState('');
  const [primaryAudience, setPrimaryAudience] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [style, setStyle] = useState('');
  const [favoriteWebsites, setFavoriteWebsites] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [doNotMention, setDoNotMention] = useState('');
  const [budget, setBudget] = useState<BudgetOption | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [questionIndexSub1, setQuestionIndexSub1] = useState(0);
  const [questionIndexSub2, setQuestionIndexSub2] = useState(0);

  const SUB1_KEYS = useMemo(
    () =>
      [
        'companyName',
        'logo',
        'projectType',
        'currentWebsiteUrl',
        'mainGoal',
        'primaryAction',
        'servicesDescription',
        'focusCentral',
        'offerExplanation',
      ] as const,
    []
  );
  const SUB2_KEYS = useMemo(
    () =>
      [
        'primaryAudience',
        'colorHex',
        'style',
        'favoriteWebsites',
        'competitors',
        'doNotMention',
        'budget',
      ] as const,
    []
  );
  const currentKeySub1 = SUB1_KEYS[questionIndexSub1];
  const currentKeySub2 = SUB2_KEYS[questionIndexSub2];
  const isLastQuestionSub1 = questionIndexSub1 === SUB1_KEYS.length - 1;
  const isLastQuestionSub2 = questionIndexSub2 === SUB2_KEYS.length - 1;

  const validateSubStep1 = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht';
    if (projectType === 'existing' && !currentWebsiteUrl.trim()) {
      newErrors.currentWebsiteUrl = 'Huidige website URL is verplicht bij bestaande website';
    }
    if (!mainGoal) newErrors.mainGoal = 'Hoofddoel is verplicht';
    if (!primaryAction) newErrors.primaryAction = 'Belangrijkste actie is verplicht';
    if (!servicesDescription.trim()) newErrors.servicesDescription = 'Beschrijving diensten/producten is verplicht';
    if (!focusCentral) newErrors.focusCentral = 'Wat moet centraal staan is verplicht';
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const validateCurrentQuestionSub1 = (): boolean => {
    const key = currentKeySub1;
    if (key === 'companyName') {
      if (!companyName.trim()) {
        setErrors((e) => ({ ...e, companyName: 'Bedrijfsnaam is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, companyName: '' }));
      return true;
    }
    if (key === 'logo') return true;
    if (key === 'projectType') {
      if (!projectType) {
        setErrors((e) => ({ ...e, projectType: 'Kies een optie' }));
        return false;
      }
      setErrors((e) => ({ ...e, projectType: '' }));
      return true;
    }
    if (key === 'currentWebsiteUrl') {
      if (projectType === 'existing' && !currentWebsiteUrl.trim()) {
        setErrors((e) => ({ ...e, currentWebsiteUrl: 'Huidige website URL is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, currentWebsiteUrl: '' }));
      return true;
    }
    if (key === 'mainGoal') {
      if (!mainGoal) {
        setErrors((e) => ({ ...e, mainGoal: 'Hoofddoel is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, mainGoal: '' }));
      return true;
    }
    if (key === 'primaryAction') {
      if (!primaryAction) {
        setErrors((e) => ({ ...e, primaryAction: 'Belangrijkste actie is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, primaryAction: '' }));
      return true;
    }
    if (key === 'servicesDescription') {
      if (!servicesDescription.trim()) {
        setErrors((e) => ({ ...e, servicesDescription: 'Beschrijving is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, servicesDescription: '' }));
      return true;
    }
    if (key === 'focusCentral') {
      if (!focusCentral) {
        setErrors((e) => ({ ...e, focusCentral: 'Kies een optie' }));
        return false;
      }
      setErrors((e) => ({ ...e, focusCentral: '' }));
      return true;
    }
    if (key === 'offerExplanation') return true;
    return true;
  };

  const validateCurrentQuestionSub2 = (): boolean => {
    const key = currentKeySub2;
    if (key === 'primaryAudience') {
      if (!primaryAudience) {
        setErrors((e) => ({ ...e, primaryAudience: 'Doelgroep is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, primaryAudience: '' }));
      return true;
    }
    if (key === 'colorHex') return true;
    if (key === 'style') {
      if (!style) {
        setErrors((e) => ({ ...e, style: 'Stijl is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, style: '' }));
      return true;
    }
    if (key === 'favoriteWebsites' || key === 'competitors' || key === 'doNotMention') return true;
    if (key === 'budget') {
      if (!budget) {
        setErrors((e) => ({ ...e, budget: 'Budget is verplicht' }));
        return false;
      }
      setErrors((e) => ({ ...e, budget: '' }));
      return true;
    }
    return true;
  };

  const validateAll = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht';
    if (projectType === 'existing' && !currentWebsiteUrl.trim()) {
      newErrors.currentWebsiteUrl = 'Huidige website URL is verplicht bij bestaande website';
    }
    if (!mainGoal) newErrors.mainGoal = 'Hoofddoel is verplicht';
    if (!primaryAction) newErrors.primaryAction = 'Belangrijkste actie is verplicht';
    if (!servicesDescription.trim()) newErrors.servicesDescription = 'Beschrijving diensten/producten is verplicht';
    if (!focusCentral) newErrors.focusCentral = 'Wat moet centraal staan is verplicht';
    if (!primaryAudience) newErrors.primaryAudience = 'Doelgroep is verplicht';
    if (!style) newErrors.style = 'Stijl is verplicht';
    if (!budget) newErrors.budget = 'Budget is verplicht';
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const processFiles = (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;

    setLogoError(null);

    setLogoFiles((currentFiles) => {
      const newFiles: File[] = [];
      const previewPromises: Promise<string>[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Check file count
        if (currentFiles.length + newFiles.length >= 10) {
          setLogoError('Maximum 10 bestanden toegestaan');
          break;
        }

        // Check file size (100 MB = 100 * 1024 * 1024 bytes)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
          setLogoError(`${file.name} is te groot (max 100 MB)`);
          continue;
        }

        // Check file type
        const validTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/svg+xml',
          'image/webp',
          'application/pdf',
        ];
        if (!validTypes.includes(file.type)) {
          setLogoError(`${file.name} heeft een ongeldig bestandstype. Toegestaan: PNG, JPG, SVG, PDF`);
          continue;
        }

        newFiles.push(file);

        // Create preview promise for images
        if (file.type.startsWith('image/')) {
          const previewPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              resolve(result);
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
          previewPromises.push(previewPromise);
        } else {
          // For PDFs, use empty string placeholder
          previewPromises.push(Promise.resolve(''));
        }
      }

      // Handle previews asynchronously
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

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = (index: number) => {
    setLogoFiles((prev) => prev.filter((_, i) => i !== index));
    setLogoPreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleNextOrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subStep === 1) {
      if (!isLastQuestionSub1) {
        if (!validateCurrentQuestionSub1()) {
          setTimeout(() => {
            const el = document.querySelector(`[data-field="${currentKeySub1}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          return;
        }
        setQuestionIndexSub1((i) => {
          let next = i + 1;
          if (SUB1_KEYS[next] === 'currentWebsiteUrl' && projectType === 'new') next++;
          return next;
        });
        setErrors({});
        return;
      }
      const validation = validateSubStep1();
      if (!validation.isValid) {
        setTimeout(() => {
          const firstErrorKey = Object.keys(validation.errors)[0];
          if (firstErrorKey) {
            const errorElement = document.querySelector(`[data-field="${firstErrorKey}"]`);
            if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return;
      }
      setSubStep(2);
      setQuestionIndexSub2(0);
      setErrors({});
      return;
    }
    if (subStep === 2 && !isLastQuestionSub2) {
      if (!validateCurrentQuestionSub2()) {
        setTimeout(() => {
          const el = document.querySelector(`[data-field="${currentKeySub2}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
      setQuestionIndexSub2((i) => i + 1);
      setErrors({});
      return;
    }
    const validation = validateAll();
    if (!validation.isValid) {
      setTimeout(() => {
        const firstErrorKey = Object.keys(validation.errors)[0];
        if (firstErrorKey) {
          const errorElement = document.querySelector(`[data-field="${firstErrorKey}"]`);
          if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    const data: BookingIntakeData = {
      companyName: companyName.trim(),
      contactPerson: '', // Empty string since field was removed from form
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (subStep === 1) {
              if (questionIndexSub1 > 0) {
                setQuestionIndexSub1((i) => {
                  let prev = i - 1;
                  if (SUB1_KEYS[prev] === 'currentWebsiteUrl' && projectType === 'new') prev--;
                  return prev;
                });
              } else onBack();
            } else {
              if (questionIndexSub2 > 0) setQuestionIndexSub2((i) => i - 1);
              else {
                setSubStep(1);
                setQuestionIndexSub1(SUB1_KEYS.length - 1);
              }
            }
          }}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {subStep === 1
            ? questionIndexSub1 === 0
              ? 'Terug'
              : 'Vorige vraag'
            : questionIndexSub2 === 0
              ? 'Vorige'
              : 'Vorige vraag'}
        </button>
        <span className="text-xs text-gray-500">
          Stap 2 van 3 
        </span>
      </div>

      <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 pb-3 pt-4 px-4 sm:px-5 md:px-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Pre-website intake</h3>
            <p className="text-gray-400 text-xs">
              {subStep === 1 ? 'Project & aanbod' : 'Stijl, referenties & budget'}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <form onSubmit={handleNextOrSubmit} className="relative z-10 space-y-4">
            {subStep === 1 && (
              <AnimatePresence mode="wait">
                {currentKeySub1 === 'companyName' && (
                  <motion.div
                    key="companyName"
                    data-field="companyName"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <label className={labelClass}>Bedrijfsnaam *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Je bedrijfsnaam"
                      className={inputClass}
                      autoFocus
                    />
                    {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'logo' && (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className={labelClass}>Logo (optioneel)</label>
                    <p className="text-xs text-gray-500 mb-2">
                      Bij voorkeur zonder achtergrond (PNG of SVG). Max 10 bestanden, 100 MB per bestand.
                    </p>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => e.preventDefault()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-6 text-center transition-colors',
                        'border-white/10 hover:border-[#41AE96]/50 bg-white/5 hover:bg-white/10 cursor-pointer'
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
                      <p className="text-white text-sm font-medium mb-1">Klik om te uploaden of sleep bestanden hierheen</p>
                      <p className="text-gray-400 text-xs">PNG, JPG, SVG, PDF (max 100 MB per bestand)</p>
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
                  </motion.div>
                )}
                {currentKeySub1 === 'projectType' && (
                  <motion.div key="projectType" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Is dit een nieuwe website of een update/vervanging? *</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        { value: 'new' as const, label: 'Nieuwe website' },
                        { value: 'existing' as const, label: 'Bestaande website updaten/vervangen' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setProjectType(opt.value)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                            projectType === opt.value ? 'bg-[#41AE96]/20 border-[#41AE96]/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-[#41AE96]/50'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {currentKeySub1 === 'currentWebsiteUrl' && projectType === 'existing' && (
                  <motion.div key="currentWebsiteUrl" data-field="currentWebsiteUrl" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Huidige website URL *</label>
                    <input
                      type="url"
                      value={currentWebsiteUrl}
                      onChange={(e) => setCurrentWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                      autoFocus
                    />
                    {errors.currentWebsiteUrl && <p className="mt-1 text-sm text-red-400">{errors.currentWebsiteUrl}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'mainGoal' && (
                  <motion.div key="mainGoal" data-field="mainGoal" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Wat is het hoofddoel van de website? *</label>
                    <div className="space-y-2 mt-2">
                      {MAIN_GOAL_OPTIONS.map((o) => {
                        const isSelected = mainGoal === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="mainGoal" value={o.value} checked={isSelected} onChange={() => setMainGoal(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.mainGoal && <p className="mt-1 text-sm text-red-400">{errors.mainGoal}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'primaryAction' && (
                  <motion.div key="primaryAction" data-field="primaryAction" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Belangrijkste actie die een bezoeker moet doen *</label>
                    <div className="space-y-2 mt-2">
                      {PRIMARY_ACTION_OPTIONS.map((o) => {
                        const isSelected = primaryAction === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="primaryAction" value={o.value} checked={isSelected} onChange={() => setPrimaryAction(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.primaryAction && <p className="mt-1 text-sm text-red-400">{errors.primaryAction}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'servicesDescription' && (
                  <motion.div key="servicesDescription" data-field="servicesDescription" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Welke diensten, producten of services bied je aan? *</label>
                    <textarea
                      value={servicesDescription}
                      onChange={(e) => setServicesDescription(e.target.value)}
                      placeholder="Kort wat je aanbiedt, voor wie, belangrijkste voordeel"
                      rows={3}
                      className={cn(inputClass, 'resize-none')}
                      autoFocus
                    />
                    {errors.servicesDescription && <p className="mt-1 text-sm text-red-400">{errors.servicesDescription}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'focusCentral' && (
                  <motion.div key="focusCentral" data-field="focusCentral" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Wat moet het meest centraal staan op de website? *</label>
                    <div className="space-y-2 mt-2">
                      {FOCUS_CENTRAL_OPTIONS.map((o) => {
                        const isSelected = focusCentral === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="focusCentral" value={o.value} checked={isSelected} onChange={() => setFocusCentral(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.focusCentral && <p className="mt-1 text-sm text-red-400">{errors.focusCentral}</p>}
                  </motion.div>
                )}
                {currentKeySub1 === 'offerExplanation' && (
                  <motion.div key="offerExplanation" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Toelichting op je aanbod (optioneel)</label>
                    <textarea
                      value={offerExplanation}
                      onChange={(e) => setOfferExplanation(e.target.value)}
                      placeholder="Concreet welke diensten/producten, voor wie, voordeel"
                      rows={2}
                      className={cn(inputClass, 'resize-none')}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {subStep === 2 && (
              <AnimatePresence mode="wait">
                {currentKeySub2 === 'primaryAudience' && (
                  <motion.div key="primaryAudience" data-field="primaryAudience" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Wie is de primaire doelgroep? *</label>
                    <div className="space-y-2 mt-2">
                      {AUDIENCE_OPTIONS.map((o) => {
                        const isSelected = primaryAudience === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="primaryAudience" value={o.value} checked={isSelected} onChange={() => setPrimaryAudience(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.primaryAudience && <p className="mt-1 text-sm text-red-400">{errors.primaryAudience}</p>}
                  </motion.div>
                )}
                {currentKeySub2 === 'colorHex' && (
                  <motion.div key="colorHex" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Welke kleuren? (Hex codes, optioneel)</label>
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      placeholder="#081534"
                      className={inputClass}
                      autoFocus
                    />
                  </motion.div>
                )}
                {currentKeySub2 === 'style' && (
                  <motion.div key="style" data-field="style" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Welke stijl past het beste bij je bedrijf? *</label>
                    <div className="space-y-2 mt-2">
                      {STYLE_OPTIONS.map((o) => {
                        const isSelected = style === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="style" value={o.value} checked={isSelected} onChange={() => setStyle(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.style && <p className="mt-1 text-sm text-red-400">{errors.style}</p>}
                  </motion.div>
                )}
                {currentKeySub2 === 'favoriteWebsites' && (
                  <motion.div key="favoriteWebsites" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Welke websites vind je tof? (optioneel)</label>
                    <textarea value={favoriteWebsites} onChange={(e) => setFavoriteWebsites(e.target.value)} placeholder="Links + waarom" rows={2} className={cn(inputClass, 'resize-none')} autoFocus />
                  </motion.div>
                )}
                {currentKeySub2 === 'competitors' && (
                  <motion.div key="competitors" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Belangrijkste concurrenten (optioneel)</label>
                    <textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="Naam + website URL" rows={2} className={cn(inputClass, 'resize-none')} autoFocus />
                  </motion.div>
                )}
                {currentKeySub2 === 'doNotMention' && (
                  <motion.div key="doNotMention" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Dingen die wel/niet benoemd moeten worden (optioneel)</label>
                    <textarea value={doNotMention} onChange={(e) => setDoNotMention(e.target.value)} placeholder="..." rows={2} className={cn(inputClass, 'resize-none')} autoFocus />
                  </motion.div>
                )}
                {currentKeySub2 === 'budget' && (
                  <motion.div key="budget" data-field="budget" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                    <label className={labelClass}>Wat is je budget? *</label>
                    <div className="space-y-2 mt-2">
                      {BUDGET_OPTIONS.map((o) => {
                        const isSelected = budget === o.value;
                        return (
                          <label
                            key={o.value}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                              isSelected ? 'bg-[#41AE96]/20 border-[#41AE96]/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30'
                            )}
                          >
                            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border', isSelected ? 'border-[#41AE96] bg-[#41AE96]' : 'border-white/40 bg-white/5')}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="font-medium text-white">{o.label}</span>
                            <input type="radio" name="budget" value={o.value} checked={isSelected} onChange={() => setBudget(o.value)} className="sr-only" />
                          </label>
                        );
                      })}
                    </div>
                    {errors.budget && <p className="mt-1 text-sm text-red-400">{errors.budget}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  '0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-4"
            >
              <span>
                {subStep === 1
                  ? isLastQuestionSub1
                    ? 'Volgende — Stijl & budget'
                    : 'Volgende'
                  : isLastQuestionSub2
                    ? 'Volgende — naar gegevens'
                    : 'Volgende'}
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
