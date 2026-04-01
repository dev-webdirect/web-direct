import type { BriefingFormValues } from './schema';
import { BRIEFING_CUSTOM_PAGES_LABEL } from './schema';

function field(label: string, value: string | undefined | null): string | null {
  const v = value?.trim();
  if (!v) return null;
  return `**${label}:** ${v}`;
}

function multilineField(label: string, value: string | undefined | null): string | null {
  const v = value?.trim();
  if (!v) return null;
  return `**${label}:**\n${v}`;
}

function bulletList(title: string, items: string[]): string | null {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;
  return `**${title}:**\n${filtered.map((i) => `- ${i}`).join('\n')}`;
}

function keep(lines: (string | null | undefined)[]): string[] {
  return lines.filter((x): x is string => Boolean(x && x.trim()));
}

function section(title: string, rows: string[]): string {
  const body = rows.length
    ? rows.join('\n')
    : '*No details provided.*';
  return `# ${title}\n\n${body}`;
}

function formatFaq(items: BriefingFormValues['faq'] | undefined): string | null {
  if (!items?.length) return null;
  const blocks = items.map((f, i) => {
    const parts: string[] = [`**Q${i + 1}: ${f.question || '(no question)'}**`];
    if (f.answer?.trim()) parts.push(f.answer.trim());
    if (f.documentUrl?.trim()) parts.push(`📎 Document: ${f.documentUrl}`);
    return parts.join('\n');
  });
  return `**FAQ:**\n\n${blocks.join('\n\n')}`;
}

function formatPages(
  pages: string[] | undefined,
  descriptions: Record<string, string> | undefined,
): string | null {
  if (!pages?.length) return null;
  const lines = pages.map((p) => {
    const desc = descriptions?.[p]?.trim();
    return desc ? `- **${p}**\n  ${desc}` : `- ${p}`;
  });
  return `**Pages / Sections required:**\n${lines.join('\n')}`;
}

export function briefingToClickUpDescription(data: BriefingFormValues): string {
  const business = section(
    'Business Information',
    keep([
      field('Company / Business name', data.businessName),
      field('Industry', data.industry),
      field('Business email', data.businessEmail),
      field('Personal email', data.personalEmail),
      field('Phone', data.phone),
      multilineField('Address', data.address),
      field('Google Maps', data.googleMapsLink),
      field('Existing website', data.website),
      field('Tagline', data.tagline),
      data.knownFor?.length ? field('Known for', data.knownFor.join(', ')) : null,
      data.restrictions?.trim()
        ? multilineField('Restrictions / Sensitivities', data.restrictions)
        : null,
      field('Target location', data.targetLocation),
      multilineField('Target audience', data.targetAudience),
      data.socialLinks?.length
        ? bulletList('Social profiles', data.socialLinks)
        : null,
      data.competitors?.length
        ? bulletList(
            'Competitors',
            data.competitors.map((c) =>
              c.website ? `${c.name} — ${c.website}` : c.name
            )
          )
        : null,
    ])
  );

  const branding = section(
    'Brand & Identity',
    keep([
      data.logos?.length ? bulletList('Logo links', data.logos) : null,
      data.brandColors?.length
        ? field('Brand colours (hex)', data.brandColors.join(', '))
        : null,
      data.fonts?.length ? field('Typefaces', data.fonts.join(', ')) : null,
      field('Brand guidelines', data.brandGuidelines),
      field('Tone of voice', data.toneOfVoice),
    ])
  );

  const hasCustomPages =
    data.pagesNeeded?.includes(BRIEFING_CUSTOM_PAGES_LABEL) &&
    data.customPagesDescription?.trim();

  const hpSections = data.homepageContent?.sections;
  const homepageSections = Array.isArray(hpSections)
    ? hpSections.length
      ? hpSections.map((s) => `- ${s}`).join('\n')
      : '—'
    : (typeof hpSections === 'string' && hpSections.trim()) || '—';

  const content = section(
    'Content & Site Map',
    keep([
      field('Website type', data.websiteType),
      formatPages(data.pagesNeeded, data.pageDescriptions),
      hasCustomPages
        ? multilineField('Custom pages — description', data.customPagesDescription!)
        : null,
      field('Homepage — Main headline', data.homepageContent?.heroTitle),
      field('Homepage — Supporting line', data.homepageContent?.heroSubtitle),
      field('Homepage — Primary CTA', data.homepageContent?.ctaText),
      `**Homepage — Structure / Notes:**\n${homepageSections}`,
      formatFaq(data.faq),
      data.images?.length
        ? bulletList('Reference image URLs', data.images)
        : null,
    ])
  );

  const technical = section(
    'Technical & Hosting',
    keep([
      field('Domain already registered', data.hasDomain ? 'Yes' : 'No'),
      data.hasDomain && data.domainInfo
        ? field(
            'Domain & Registrar',
            `${data.domainInfo.domain} (${data.domainInfo.provider})`
          )
        : null,
      multilineField('Who will edit content after launch', data.contentEditor),
      field('Multilingual site', data.multiLanguage ? 'Yes' : 'No'),
      data.multiLanguage && data.languages?.length
        ? field('Languages', data.languages.join(', '))
        : null,
    ])
  );

  const scope = section(
    'Project Scope & Timeline',
    keep([
      data.deadline?.trim()
        ? field('Target delivery date', new Date(data.deadline).toISOString().slice(0, 10))
        : null,
      data.revisions != null ? field('Revision rounds (requested)', String(data.revisions)) : null,
    ])
  );

  return [business, branding, content, technical, scope].join('\n\n---\n\n');
}

export function briefingTaskName(data: BriefingFormValues): string {
  return `${data.businessName || 'Unnamed'} — Website Briefing`;
}
