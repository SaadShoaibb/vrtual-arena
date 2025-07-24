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

        {/* Tawk.to Live Chat Script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/688272a32f66bc191640c585/1j0uovjqa';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);

                // Debug: Log when Tawk.to loads
                s1.onload = function() {
                  console.log('Tawk.to script loaded successfully');
                };

                s1.onerror = function() {
                  console.error('Failed to load Tawk.to script');
                };
              })();

              // Set up Tawk.to callbacks
              Tawk_API.onLoad = function(){
                console.log('Tawk.to widget loaded and ready');
                window.tawkLoaded = true;
              };

              Tawk_API.onStatusChange = function(status){
                console.log('Tawk.to status:', status);
              };
            `
          }}
        />
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
