'use client';

import { useState } from 'react';
import { BookingLayout } from '@/src/components/BookingLayout';
import { BookingDateStep } from '@/src/components/BookingDateStep';
import { BookingIntakeStep } from '@/src/components/BookingIntakeStep';
import { BookingFormStep } from '@/src/components/BookingFormStep';
import type { BookingFormData } from '@/src/components/BookingFormStep';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [intakeData, setIntakeData] = useState<BookingIntakeData | null>(null);
  const [formData, setFormData] = useState<BookingFormData | null>(null);

  const handleDateComplete = (datetime: string) => {
    setSelectedDateTime(datetime);
    setStep(2);
  };

  const handleIntakeComplete = (data: BookingIntakeData) => {
    setIntakeData(data);
    setStep(3);
  };

  const handleBackToDate = () => setStep(1);
  const handleBackToIntake = () => setStep(2);

  return (
    <BookingLayout>
      {step === 1 && <BookingDateStep onComplete={handleDateComplete} />}
      {step === 2 && (
        <BookingIntakeStep
          onComplete={handleIntakeComplete}
          onBack={handleBackToDate}
        />
      )}
      {step === 3 && selectedDateTime && (
        <BookingFormStep
          selectedDateTime={selectedDateTime}
          intakeData={intakeData}
          onBack={handleBackToIntake}
        />
      )}
    </BookingLayout>
  );
}
