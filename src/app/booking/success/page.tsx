'use client';

import { useEffect, useState } from 'react';
import { BookingSuccessSection } from '@/src/components/BookingSuccessSection';
import { getBookingFormData, clearBookingFormData } from '@/src/components/BookingFormStep';

const DATETIME_KEY = 'webdirect_booking_datetime';
const INTAKE_KEY = 'webdirect_booking_intake';

export default function BookingSuccessPage() {
  const [email, setEmail] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);

  useEffect(() => {
    const data = getBookingFormData();
    if (data) {
      if (data.email) setEmail(data.email);
      if (data.name) setName(data.name);
    }
    if (typeof window !== 'undefined') {
      const dt = sessionStorage.getItem(DATETIME_KEY);
      if (dt) setSelectedDateTime(dt);
    }
    clearBookingFormData();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DATETIME_KEY);
      sessionStorage.removeItem(INTAKE_KEY);
    }
  }, []);

  return (
    <BookingSuccessSection
      email={email}
      name={name}
      selectedDateTime={selectedDateTime}
    />
  );
}
