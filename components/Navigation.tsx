'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem('universityApplications');
      if (stored) {
        try {
          const apps = JSON.parse(stored);
          setAppCount(apps.length);
        } catch (error) {
          console.error('Error loading applications:', error);
        }
      } else {
        setAppCount(0);
      }
    };

    // Initial load - sync with localStorage
    updateCount();

    window.addEventListener('storage', updateCount);
    window.addEventListener('applicationsUpdated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('applicationsUpdated', updateCount);
    };
  }, []);

  return (
    <nav className="bg-white mb-4 sm:mb-6 md:mb-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo Section */}
          <Link href="/" className="shrink-0 flex items-center gap-2 sm:gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-red-600 to-yellow-400 rounded-lg flex items-center justify-center text-xl sm:text-2xl shadow-md">
              🎓
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                German Uni Tracker
              </h1>
              <p className="text-xs text-gray-500 font-medium hidden md:block">Plan your future in Germany</p>
            </div>
          </Link>
          
          {/* Right Section: Counter + Links */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {pathname === '/results' && (
              <div className="hidden md:flex items-center gap-3 bg-linear-to-r from-yellow-50 to-red-50 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Shortlisted:</span>
                <span className="font-bold text-sm text-red-600">{appCount}</span>
              </div>
            )}
            
            <Link
              href="/"
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                pathname === '/'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <span>➕</span>
              <span className="hidden sm:inline">Add</span>
              <span className="hidden md:inline">University</span>
            </Link>
            <Link
              href="/results"
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                pathname === '/results'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <span>📋</span>
              <span className="hidden md:inline">View Shortlist</span>
              <span className="hidden sm:inline md:hidden">List</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
