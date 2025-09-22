'use client';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <div className="text-white text-lg font-medium">
          Loading Virtual Arena...
        </div>
      </div>
    </div>
  );
}