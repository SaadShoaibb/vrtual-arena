'use client'
import Head from 'next/head';
import { generatePageMetadata, generateLocalBusinessSchema } from '@/app/utils/seoMetadata';

const SEOHead = ({ page = 'home', locale = 'en', customTitle, customDescription }) => {
  const metadata = generatePageMetadata(page, locale);
  const schema = generateLocalBusinessSchema(locale);
  
  // Use custom title/description if provided, otherwise use generated metadata
  const title = customTitle || metadata.title;
  const description = customDescription || metadata.description;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:site_name" content={metadata.openGraph.siteName} />
      <meta property="og:image" content={metadata.openGraph.images[0].url} />
      <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
      <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
      <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
      <meta property="og:locale" content={metadata.openGraph.locale} />
      <meta property="og:type" content={metadata.openGraph.type} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images[0]} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metadata.alternates.canonical} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en-us" href={metadata.alternates.languages['en-US']} />
      <link rel="alternate" hrefLang="fr-ca" href={metadata.alternates.languages['fr-CA']} />
      <link rel="alternate" hrefLang="x-default" href={metadata.alternates.canonical} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="VRtual Arena Edmonton" />
      <meta name="copyright" content="ABOUDA Enterprise Inc." />
      <meta name="language" content={locale === 'fr' ? 'French' : 'English'} />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Meta Tags for Local SEO */}
      <meta name="geo.region" content="CA-AB" />
      <meta name="geo.placename" content="Edmonton" />
      <meta name="geo.position" content="53.5461;-113.4938" />
      <meta name="ICBM" content="53.5461, -113.4938" />
      
      {/* Business Information */}
      <meta name="contact:phone_number" content="+1 780-901-0804" />
      <meta name="contact:email" content="contact@vrtualarena.ca" />
      <meta name="contact:address" content="8109 102 St NW, Edmonton, AB T6E 4A4" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/assets/logo.png" />
    </Head>
  );
};

export default SEOHead;
