'use client';

import { useState } from 'react';
import { BookingLayout } from '@/src/components/BookingLayout';
import { BookingDateStep } from '@/src/components/BookingDateStep';
import { BookingIntakeStep, INTAKE_SECTION_COUNT } from '@/src/components/BookingIntakeStep';
import { BookingFormStep } from '@/src/components/BookingFormStep';
import { BookingProgressBar } from '@/src/components/BookingProgressBar';
import type { BookingFormData } from '@/src/components/BookingFormStep';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';

const TOTAL_STEPS = 7;

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [intakeData, setIntakeData] = useState<BookingIntakeData | null>(null);
  const [formData, setFormData] = useState<BookingFormData | null>(null);
  const [intakeSectionIndex, setIntakeSectionIndex] = useState(0);

  const handleDateComplete = (datetime: string) => {
    setSelectedDateTime(datetime);
    setStep(2);
    setIntakeSectionIndex(0);
  };

  const handleIntakeComplete = (data: BookingIntakeData) => {
    setIntakeData(data);
    setStep(3);
  };

  const handleBackToDate = () => setStep(1);
  const handleBackToIntake = () => {
    setStep(2);
    setIntakeSectionIndex(INTAKE_SECTION_COUNT - 1);
  };

  const getGlobalStep = (): number => {
    if (step === 1) return 1;
    if (step === 2) return 2 + intakeSectionIndex;
    return TOTAL_STEPS;
  };

  return (
    <BookingLayout mode="full">
      <BookingProgressBar currentStep={getGlobalStep()} totalSteps={TOTAL_STEPS} />
      {step === 1 && <BookingDateStep onComplete={handleDateComplete} />}
      {step === 2 && (
        <BookingIntakeStep
          onComplete={handleIntakeComplete}
          onBack={handleBackToDate}
          onSectionChange={setIntakeSectionIndex}
        />
      )}
      {step === 3 && (
        <BookingFormStep
          selectedDateTime={selectedDateTime}
          intakeData={intakeData}
          onBack={handleBackToIntake}
        />
      )}
    </BookingLayout>
  );
}

