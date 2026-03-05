'use client';

import { useState } from 'react';
import { BookingLayout } from '@/src/components/BookingLayout';
import { BookingIntakeStep, INTAKE_SECTION_COUNT } from '@/src/components/BookingIntakeStep';
import { BookingFormStep } from '@/src/components/BookingFormStep';
import { BookingProgressBar } from '@/src/components/BookingProgressBar';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';

const TOTAL_STEPS = 5;

export default function IntakePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [intakeData, setIntakeData] = useState<BookingIntakeData | null>(null);
  const [intakeSectionIndex, setIntakeSectionIndex] = useState(0);

  const handleIntakeComplete = (data: BookingIntakeData) => {
    setIntakeData(data);
    setStep(2);
  };

  const handleBackToIntake = () => {
    setStep(1);
    setIntakeSectionIndex(INTAKE_SECTION_COUNT - 1);
  };

  const getGlobalStep = (): number => {
    if (step === 1) return 1 + intakeSectionIndex;
    return TOTAL_STEPS;
  };

  return (
    <BookingLayout mode="intake">
      <BookingProgressBar currentStep={getGlobalStep()} totalSteps={TOTAL_STEPS} />
      {step === 1 && (
        <BookingIntakeStep
          onComplete={handleIntakeComplete}
          onBack={() => window.history.back()}
          onSectionChange={setIntakeSectionIndex}
        />
      )}
      {step === 2 && (
        <BookingFormStep
          selectedDateTime={null}
          intakeData={intakeData}
          onBack={handleBackToIntake}
        />
      )}
    </BookingLayout>
  );
}

