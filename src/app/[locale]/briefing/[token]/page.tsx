import { validateBriefingToken } from '@/src/lib/briefing/tokens';
import { BriefingWizard } from '@/src/components/briefing/BriefingWizard';

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export default async function BriefingTokenPage({ params }: Props) {
  const { token } = await params;

  

  return <BriefingWizard accessToken={token} />;
}
