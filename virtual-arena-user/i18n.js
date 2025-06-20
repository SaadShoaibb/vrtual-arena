export const locales = ['en', 'fr'];
export const defaultLocale = 'en';

// Define messages loading function
export function getMessages(locale) {
  return import(`./src/messages/${locale}.json`).then((module) => module.default);
} 