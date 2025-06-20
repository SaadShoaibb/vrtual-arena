'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { MdChevronRight } from 'react-icons/md';

const Breadcrumb = ({ customLabels = {} }) => {
  const pathname = usePathname();
  
  // Skip rendering breadcrumb on the home page
  if (pathname === '/') return null;
  
  // Get path segments without query parameters
  const asPathWithoutQuery = pathname.split('?')[0];
  const segments = asPathWithoutQuery.split('/').filter((segment) => segment !== '');
  
  // Default labels for common paths
  const defaultLabels = {
    'experiences': 'Experiences',
    'ufo-spaceship': 'UFO Spaceship',
    'vr-360': 'VR 360',
    'vr-battle': 'VR Battle',
    'vr-warrior': 'VR WARRIOR',
    'vr-cat': 'VR CAT',
    'free-roaming-arena': 'Free-roaming Arena',
    'photo-booth': 'Photo Booth',
    'pricing': 'Pricing',
    'events': 'Events',
    'merchandise': 'Shop',
    'about': 'About Us',
    'contact': 'Contact Us',
    'bookings': 'My Bookings',
    'orders': 'My Orders',
    'tournaments': 'Tournaments',
    'notifications': 'Notifications',
    'wishlist': 'Wishlist',
    ...customLabels
  };
  
  // Generate breadcrumb data
  const breadcrumbs = segments.map((segment, index) => {
    // Build the URL for each segment by concatenating all segments up to current one
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    
    // Format the label: use default label or format the segment
    const label = defaultLabels[segment] || 
      segment.replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return { href, label };
  });
  
  // Check if this is an experiences page
  const isExperiencesPage = segments[0] === 'experiences';
  
  return (
    <div className={`w-full ${isExperiencesPage ? 'bg-[rgba(0,0,0,0.2)]' : 'bg-black'} py-3`}>
      <div className="w-full mx-auto max-w-[1600px] px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6">
        <nav className="flex items-center text-sm text-white">
          <Link href="/" className="flex items-center hover:text-[#DB1FEB] transition-colors">
            <IoHomeOutline className="mr-1" size={16} />
            <span>Home</span>
          </Link>
          
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
              <MdChevronRight className="mx-2 text-gray-400" size={16} />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-[#DB1FEB]">{breadcrumb.label}</span>
              ) : (
                <Link 
                  href={breadcrumb.href}
                  className="hover:text-[#DB1FEB] transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb; 