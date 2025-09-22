import { Suspense } from 'react';
import HomePageContent from './components/HomePageContent';
import LoadingPage from './components/LoadingPage';
import HydrationHandler from './components/HydrationHandler';

export default function HomePage() {
  return (
    <>
      <HydrationHandler />
      <Suspense fallback={<LoadingPage />}>
        <HomePageContent />
      </Suspense>
    </>
  );
}
