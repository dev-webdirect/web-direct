import { forbidden } from 'next/navigation';
import { validateBriefingToken } from '@/src/lib/briefing/tokens';
import { BriefingWizard } from '@/src/components/briefing/BriefingWizard';

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export default async function BriefingTokenPage({ params }: Props) {
  const { token } = await params;

  if (!validateBriefingToken(token)) {
    forbidden();
  }

  return <BriefingWizard accessToken={token} />;
}
