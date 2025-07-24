'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { API_URL } from '@/utils/ApiUrl';
import { translations } from '@/app/translations';

const getPredefinedPages = (t) => [
  { title: t.home, path: '/' },
  { title: t.experiences, path: '/experiences' },
  { title: t.gallery, path: '/gallery' },
  { title: t.shop, path: '/merchandise' },
  { title: t.tournaments, path: '/tournaments' },
  { title: t.contactUs, path: '/contact' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  const predefinedPages = getPredefinedPages(t);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products once on first render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Search fetch error:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper to filter by query
  const matches = (text = '') => text.toLowerCase().includes(query);

  const productResults = products.filter(
    (p) => matches(p.name) || matches(p.description || '') || matches(p.category || '')
  );

  const pageResults = predefinedPages.filter((p) => matches(p.title));

  const hasResults = query && (productResults.length || pageResults.length);

  return (
    <div className="min-h-screen flex flex-col bg-blackish text-white">
      <Navbar locale={locale} />

      <main className="flex-1 container mx-auto px-4 lg:px-12 py-12">
        <h1 className="text-3xl font-bold mb-6">
          Search results for: <span className="text-purplelight">{query}</span>
        </h1>

        {loading && <p>Searching…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !hasResults && (
          <p>No results found.</p>
        )}

        {/* Page results */}
        {pageResults.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Pages</h2>
            <ul className="space-y-2">
              {pageResults.map((page) => (
                <li key={page.path}>
                  <Link href={`${page.path}?locale=${locale}`} className="hover:underline text-purplelight">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Product results */}
        {productResults.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productResults.map((product) => (
                <Link
                  key={product.product_id}
                  href={`/merchandise/${product.product_id}?locale=${locale}`}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <p className="font-bold mb-2 truncate" title={product.name}>{product.name}</p>
                  <p className="text-sm text-gray-400 truncate">{product.category}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer locale={locale} />
    </div>
  );
}
