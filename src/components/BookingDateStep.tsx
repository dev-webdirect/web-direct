'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const DATETIME_STORAGE_KEY = 'webdirect_booking_datetime';
const TIMEZONE = 'Europe/Paris'; // Central European Time (CET/CEST) — same as Calendly
const MAX_DAYS_AHEAD = 14;
const MIN_NOTICE_HOURS = 4;

interface TimeSlot {
  start_time: string;
  invitees_remaining?: number;
}

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

/** Start of the given calendar day in the given timezone, as a UTC Date. */
function startOfDayInTz(year: number, month: number, day: number, timeZone: string): Date {
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMs = getTimezoneOffsetMs(noonUtc, timeZone);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMs);
}

/** End of the given calendar day in the given timezone (last ms), as a UTC Date. */
function endOfDayInTz(year: number, month: number, day: number, timeZone: string): Date {
  const start = startOfDayInTz(year, month, day, timeZone);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

/** Current calendar date (y, m, d) in the given timezone. */
function getDatePartsInTz(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const str = date.toLocaleDateString('en-CA', { timeZone });
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function formatSlotTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('nl-NL', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateLabel(date: Date): string {
  const parts = getDatePartsInTz(date, TIMEZONE);
  const todayParts = getDatePartsInTz(new Date(), TIMEZONE);
  if (parts.year === todayParts.year && parts.month === todayParts.month && parts.day === todayParts.day) return 'Vandaag';
  const tomorrowStart = startOfDayInTz(todayParts.year, todayParts.month, todayParts.day + 1, TIMEZONE);
  const tomorrowParts = getDatePartsInTz(tomorrowStart, TIMEZONE);
  if (parts.year === tomorrowParts.year && parts.month === tomorrowParts.month && parts.day === tomorrowParts.day) return 'Morgen';
  return date.toLocaleDateString('nl-NL', {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function getSelectableDates(): Date[] {
  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  const minParts = getDatePartsInTz(minStart, TIMEZONE);
  const maxAllowed = new Date(now.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);
  const dates: Date[] = [];
  for (let i = 0; i < MAX_DAYS_AHEAD; i++) {
    const nextDay = new Date(Date.UTC(minParts.year, minParts.month - 1, minParts.day + i, 12, 0, 0));
    const parts = getDatePartsInTz(nextDay, TIMEZONE);
    const startOfDay = startOfDayInTz(parts.year, parts.month, parts.day, TIMEZONE);
    if (startOfDay.getTime() > maxAllowed.getTime()) break;
    dates.push(startOfDay);
  }
  return dates;
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dates = getSelectableDates();

  const fetchSlots = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);
    setSlots([]);
    setSelectedSlot(null);

    const parts = getDatePartsInTz(date, TIMEZONE);
    let start = startOfDayInTz(parts.year, parts.month, parts.day, TIMEZONE);
    let end = endOfDayInTz(parts.year, parts.month, parts.day, TIMEZONE);

    const now = new Date();
    const minStart = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
    if (start.getTime() < minStart.getTime()) {
      start = minStart;
    }

    const startTime = start.toISOString();
    const endTime = end.toISOString();

    try {
      const res = await fetch(
        `/api/calendly/available-times?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Kon beschikbare tijden niet laden');
      }

      setSlots(json.collection || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    } else if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [selectedDate, dates.length, fetchSlots]);

  const handleNext = () => {
    if (!selectedSlot) return;
    setStoredBookingDateTime(selectedSlot);
    onComplete(selectedSlot);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">Stap 1 van 3</span>
      </div>

      <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6a49ff]/20 to-[#41AE96]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Kies datum en tijd</h3>
              <p className="text-gray-400 text-xs">20-minuten sessie • Max {MAX_DAYS_AHEAD} dagen vooruit</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-medium mb-2">Kies een datum</p>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {dates.map((d) => {
                const selParts = selectedDate && getDatePartsInTz(selectedDate, TIMEZONE);
                const dParts = getDatePartsInTz(d, TIMEZONE);
                const isSelected =
                  !!selParts &&
                  selParts.year === dParts.year &&
                  selParts.month === dParts.month &&
                  selParts.day === dParts.day;
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-sm font-semibold transition-all',
                      isSelected
                        ? 'bg-[#6a49ff] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    )}
                  >
                    {formatDateLabel(d)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-medium mb-2">Beschikbare tijden</p>
            <div className="min-h-[140px] overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#41AE96]" />
                </div>
              ) : error ? (
                <p className="text-red-400 text-sm py-4 text-center">{error}</p>
              ) : slots.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">
                  Geen beschikbare tijden voor deze datum
                </p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot.start_time;
                    return (
                      <motion.button
                        key={slot.start_time}
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
                          {formatSlotTime(slot.start_time)}
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
              'w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-4',
              !selectedSlot && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span>Volgende</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
