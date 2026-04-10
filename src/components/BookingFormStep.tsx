'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { User, Mail, Phone, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import type { BookingIntakeData } from './BookingIntakeStep';
import { useLocale, useTranslations } from 'next-intl';

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}

interface BookingFormStepProps {
  selectedDateTime: string | null;
  intakeData: BookingIntakeData | null;
  onBack: () => void;
}

const STORAGE_KEY = 'webdirect_booking_form';

export const storeBookingFormData = (data: BookingFormData) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getBookingFormData = (): BookingFormData | null => {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BookingFormData) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const clearBookingFormData = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};

export const BookingFormStep = ({
  selectedDateTime,
  intakeData,
  onBack,
}: BookingFormStepProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations('booking.form');
  const locale = useLocale();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaEnabled = Boolean(turnstileSiteKey);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setSubmitError(null);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t('errors.nameRequired');
    if (!email.trim()) newErrors.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (captchaEnabled && !turnstileToken) {
      setSubmitError(t('errors.captchaRequired'));
      return;
    }
    const formData: BookingFormData = { name, email, phone };
    storeBookingFormData(formData);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const mode = selectedDateTime ? 'full' : 'intake';
      const res = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          selectedDateTime: selectedDateTime || undefined,
          intakeData,
          formData,
          ...(captchaEnabled && turnstileToken
            ? { turnstileToken }
            : {}),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        throw new Error(json.error || 'Versturen mislukt');
      }
      if (!selectedDateTime) {
        sessionStorage.setItem('webdirect_booking_mode', 'intake');
      }
      window.location.href = '/afspraak/success';
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setSubmitting(false);
    }
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
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('back')}
        </button>
        <span className="text-xs text-gray-500">
          {selectedDateTime ? t('stepLabel.full') : t('stepLabel.intake')}
        </span>
      </div>
      <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#6a49ff]/20 to-[#41AE96]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Jouw gegevens</h3>
              <p className="text-gray-400 text-xs">Vul je gegevens in</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="booking-name" className="block text-sm font-medium text-gray-400 mb-1.5">
                {t('fields.name.label')} *
              </label>
              <input
                id="booking-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('fields.name.placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="booking-email" className="block text-sm font-medium text-gray-400 mb-1.5">
                {t('fields.email.label')} *
              </label>
              <input
                id="booking-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('fields.email.placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-400 mb-1.5">
                {t('fields.phone.label')}
              </label>
              <input
                id="booking-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('fields.phone.placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#41AE96]/50 focus:outline-none transition-colors"
              />
            </div>

            {captchaEnabled && turnstileSiteKey ? (
              <div className="flex flex-col items-center gap-2 pt-1">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onSuccess={handleTurnstileSuccess}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileError}
                  options={{
                    theme: 'dark',
                    language: locale === 'nl' ? 'nl' : 'en',
                    size: 'normal',
                    action: 'booking',
                  }}
                />
              </div>
            ) : null}

            {submitError && (
              <p className="text-sm text-red-400 text-center">{submitError}</p>
            )}

            <motion.button
              type="submit"
              disabled={submitting || (captchaEnabled && !turnstileToken)}
              whileHover={
                !submitting
                  ? {
                      scale: 1.02,
                      boxShadow:
                        '0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)',
                    }
                  : {}
              }
              whileTap={!submitting ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('cta.submitting')}</span>
                </>
              ) : (
                <>
                  <span>{t('cta.submit')}</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-500 pt-2">{t('footnote')}</p>
        </div>
      </div>
    </motion.div>
  );
};
