import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './components/ClientLayout';
import { locales } from './translations';
import { generatePageMetadata, generateLocalBusinessSchema } from './utils/seoMetadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata = generatePageMetadata('home', 'en');

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema('en')),
          }}
        />

        {/* Language alternates */}
        {locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale === 'en' ? 'en-us' : 'fr-ca'}
            href={`https://vrtualarena.ca/?locale=${locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://vrtualarena.ca" />
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
