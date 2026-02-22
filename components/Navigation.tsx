'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    // Load application count from localStorage
    const stored = localStorage.getItem('universityApplications');
    if (stored) {
      try {
        const apps = JSON.parse(stored);
        setAppCount(apps.length);
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const stored = localStorage.getItem('universityApplications');
      if (stored) {
        try {
          const apps = JSON.parse(stored);
          setAppCount(apps.length);
        } catch (error) {
          console.error('Error loading applications:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('applicationsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('applicationsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-white border-b-4 border-yellow-400 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              🎓 German Uni Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-sm min-w-[180px]">
              <span className="text-gray-600">Shortlisted:</span>
              <span className="ml-2 font-bold text-2xl text-red-600 inline-block min-w-[40px] text-center">{appCount}</span>
            </div>
            
            <div className="flex space-x-6">
              <Link
                href="/"
                className={`text-lg font-semibold transition duration-200 hover:text-red-600 pb-1 ${
                  pathname === '/'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700'
                }`}
              >
                Add University
              </Link>
              <Link
                href="/results"
                className={`text-lg font-semibold transition duration-200 hover:text-red-600 pb-1 ${
                  pathname === '/results'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700'
                }`}
              >
                View Shortlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
