import { getRequestConfig } from 'next-intl/server';
import { locales } from '../../i18n';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../../src/messages/${locale}.json`)).default
  };
}); 