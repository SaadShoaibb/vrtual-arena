import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './components/ClientLayout';
import { locales } from './translations';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Virtual Arena',
  description: 'Virtual Reality Experience',
  alternates: {
    canonical: 'https://vrtualarena.com',
    languages: {
      'en-US': 'https://vrtualarena.com/?locale=en',
      'fr-CA': 'https://vrtualarena.com/?locale=fr',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Virtual Arena - Immersive VR Experiences" />
        <meta property="og:title" content="Virtual Arena" />
        <meta property="og:description" content="Discover the future of entertainment with our immersive virtual reality experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://virtualarena.com" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Language alternates */}
        {locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale === 'en' ? 'en-us' : 'fr-ca'}
            href={`https://vrtualarena.com/?locale=${locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://vrtualarena.com" />
      </head>
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, backgroundColor: 'black', border: 'none' }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
