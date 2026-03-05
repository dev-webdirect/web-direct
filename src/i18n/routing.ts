import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales
  locales: ['nl', 'en'],

  // Default locale (Dutch)
  defaultLocale: 'nl',

  // Omit locale prefix for the default locale (`/booking` for nl, `/en/booking` for en)
  localePrefix: 'as-needed',
});

