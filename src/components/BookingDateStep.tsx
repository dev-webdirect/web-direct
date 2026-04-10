'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocale, useTranslations } from 'next-intl';

const DATETIME_STORAGE_KEY = 'webdirect_booking_datetime';
const TIMEZONE = 'Europe/Amsterdam';

interface TimeSlot {
  start_time: string;
  invitees_remaining?: number;
}

type AvailabilityResponse = {
  dates: string[];
  slotsByDate: Record<string, TimeSlot[]>;
  maxDaysAhead?: number;
  meta?: { slotDurationMinutes: number | null; name: string | null };
};

/** Get offset in ms for a timezone at a given date (e.g. Paris = UTC+1 or UTC+2). */
function getTimezoneOffsetMs(date: Date, timeZone: string): number {
  const utcHour = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const tzStr = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  const [tzHour, tzMin] = tzStr.split(':').map(Number);
  let diffMinutes = (tzHour * 60 + tzMin) - (utcHour * 60 + utcMinutes);
  if (diffMinutes > 12 * 60) diffMinutes -= 24 * 60;
  if (diffMinutes < -12 * 60) diffMinutes += 24 * 60;
  return diffMinutes * 60 * 1000;
}

function startOfDayInTz(year: number, month: number, day: number, timeZone: string): Date {
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMs = getTimezoneOffsetMs(noonUtc, timeZone);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMs);
}

function getDatePartsInTz(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const str = date.toLocaleDateString('en-CA', { timeZone });
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function dateFromCalendarKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return startOfDayInTz(y, m, d, TIMEZONE);
}

function formatSlotTime(iso: string, locale: string): string {
  const d = new Date(iso);
  const localeTag = locale === 'nl' ? 'nl-NL' : 'en-US';
  return d.toLocaleTimeString(localeTag, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateLabel(date: Date, locale: string, todayLabel: string, tomorrowLabel: string): string {
  const parts = getDatePartsInTz(date, TIMEZONE);
  const todayParts = getDatePartsInTz(new Date(), TIMEZONE);
  if (parts.year === todayParts.year && parts.month === todayParts.month && parts.day === todayParts.day) return todayLabel;
  const tomorrowStart = startOfDayInTz(todayParts.year, todayParts.month, todayParts.day + 1, TIMEZONE);
  const tomorrowParts = getDatePartsInTz(tomorrowStart, TIMEZONE);
  if (parts.year === tomorrowParts.year && parts.month === tomorrowParts.month && parts.day === tomorrowParts.day) return tomorrowLabel;
  const localeTag = locale === 'nl' ? 'nl-NL' : 'en-US';
  return date.toLocaleDateString(localeTag, {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getStoredBookingDateTime(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(DATETIME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredBookingDateTime(iso: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(DATETIME_STORAGE_KEY, iso);
  }
}

interface BookingDateStepProps {
  onComplete: (selectedDateTime: string) => void;
}

export const BookingDateStep = ({ onComplete }: BookingDateStepProps) => {
  const [dates, setDates] = useState<string[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, TimeSlot[]>>({});
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number | null>(null);
  const [maxDaysAhead, setMaxDaysAhead] = useState(14);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const t = useTranslations('booking.date');
  const locale = useLocale();
  const todayLabel = t('today');
  const tomorrowLabel = t('tomorrow');

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedSlot(null);

    try {
      const res = await fetch('/api/ghl/availability');
      const json = (await res.json()) as AvailabilityResponse & { error?: string };

      if (!res.ok) {
        throw new Error(json.error || t('errorLoadingSlots'));
      }

      setDates(json.dates || []);
      setSlotsByDate(json.slotsByDate || {});
      setSlotDurationMinutes(json.meta?.slotDurationMinutes ?? null);
      if (typeof json.maxDaysAhead === 'number') setMaxDaysAhead(json.maxDaysAhead);

      const first = json.dates?.[0] ?? null;
      setSelectedDateKey(first);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('genericError'));
      setDates([]);
      setSlotsByDate({});
      setSelectedDateKey(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const slots = selectedDateKey ? slotsByDate[selectedDateKey] ?? [] : [];

  const handleNext = () => {
    if (!selectedSlot) return;
    setStoredBookingDateTime(selectedSlot);
    onComplete(selectedSlot);
  };

  const subtitleMinutes = slotDurationMinutes ?? 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{t('stepLabel')}</span>
      </div>

      <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#6a49ff]/20 to-[#41AE96]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{t('heading')}</h3>
              <p className="text-gray-400 text-xs">
                {t('subtitle', { minutes: subtitleMinutes, days: maxDaysAhead })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-medium mb-2">{t('chooseDate')}</p>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-8 h-8 animate-spin text-[#41AE96]" />
              </div>
            ) : error ? (
              <p className="text-red-400 text-sm py-2 text-center">{error}</p>
            ) : dates.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">{t('noAvailability')}</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {dates.map((key) => {
                  const d = dateFromCalendarKey(key);
                  const isSelected = selectedDateKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedDateKey(key);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        'px-2 py-0.5 rounded-lg text-sm font-semibold transition-all',
                        isSelected
                          ? 'bg-[#6a49ff] text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                      )}
                    >
                      {formatDateLabel(d, locale, todayLabel, tomorrowLabel)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-400 font-medium mb-2">{t('availableTimes')}</p>
            <div className="min-h-[140px] overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#41AE96]" />
                </div>
              ) : error ? (
                <p className="text-gray-500 text-sm py-4 text-center">{t('pickDateAfterError')}</p>
              ) : dates.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">{t('noAvailabilityHint')}</p>
              ) : slots.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">{t('noSlots')}</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot.start_time;
                    return (
                      <motion.button
                        key={slot.start_time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.start_time)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300',
                          isSelected
                            ? 'bg-[#41AE96]/20 border border-[#41AE96]/50'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#41AE96]/50 cursor-pointer group'
                        )}
                      >
                        <span className="font-medium text-white">
                          {formatSlotTime(slot.start_time, locale)}
                        </span>
                        <ArrowRight
                          className={cn(
                            'w-4 h-4 text-[#41AE96] transition-opacity',
                            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!selectedSlot}
            whileHover={
              selectedSlot
                ? {
                    scale: 1.02,
                    boxShadow:
                      '0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)',
                  }
                : {}
            }
            whileTap={selectedSlot ? { scale: 0.98 } : {}}
            className={cn(
              'w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-4',
              !selectedSlot && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span>{t('next')}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
