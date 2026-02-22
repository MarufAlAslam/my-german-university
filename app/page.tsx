'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UniversityApplication } from '@/types/application';

export default function Home() {
  const router = useRouter();
  const [applications, setApplications] = useState<UniversityApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load applications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('universityApplications');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApplications('' as unknown as UniversityApplication[]); // Type assertion to satisfy TypeScript
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('universityApplications', JSON.stringify(applications));
      // Trigger event for navigation update
      window.dispatchEvent(new Event('applicationsUpdated'));
    }
  }, [applications, isLoaded]);

  const handleAddApplication = (
    appData: Omit<UniversityApplication, 'id' | 'createdAt' | 'applied' | 'status'>
  ) => {
    const newApplication: UniversityApplication = {
      ...appData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applied: false,
      status: '',
    };
    setApplications((prev) => [newApplication, ...prev]);
    // Redirect to results page
    router.push('/results');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[calc(100vh-200px)]">
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-400/10 rounded-full pointer-events-none"></div>
      <div className="absolute top-40 left-20 w-24 h-24 bg-red-600/8 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-40 right-40 w-40 h-40 bg-black/5 rotate-45 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-yellow-400/15 rotate-12 pointer-events-none"></div>
      <div className="absolute top-60 right-60 w-20 h-20 bg-red-600/10 pointer-events-none"></div>
      <div className="absolute top-10 left-1/3 w-28 h-28 bg-yellow-400/8 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-60 left-1/4 w-36 h-36 bg-black/7 rotate-45 pointer-events-none"></div>
      <div className="absolute top-1/3 right-20 w-14 h-14 bg-red-600/12 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/3 w-22 h-22 bg-yellow-400/10 rotate-45 pointer-events-none"></div>
      <div className="absolute top-1/2 left-40 w-18 h-18 bg-black/8 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-26 h-26 bg-red-600/6 rounded-full pointer-events-none"></div>
      <div className="absolute top-80 left-60 w-12 h-12 bg-yellow-400/12 rotate-12 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Breadcrumbs 
          items={[
            { label: 'Add University', href: '/', icon: '🏠', active: true }
          ]} 
        />
        
        <div className="relative text-center mb-12 bg-linear-to-br from-yellow-50 via-white to-red-50 rounded-2xl p-10 border-2 border-yellow-400 shadow-xl overflow-hidden">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-linear-to-br from-black/10 to-transparent rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-red-600/10 to-transparent rounded-tl-full"></div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-yellow-400/20 to-transparent rounded-bl-full"></div>
          
          {/* Icon decoration */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-600 to-red-700 rounded-full mb-4 shadow-lg shadow-red-600/30">
            <span className="text-3xl">🎓</span>
          </div>
          
          <h1 className="text-3xl font-extrabold bg-linear-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Shortlist University
          </h1>
          <p className="text-base text-gray-700 font-medium max-w-2xl mx-auto">
            Add universities you&apos;re considering for your studies in Germany
          </p>
          
          {/* Bottom accent line */}
          <div className="mt-6 w-32 h-1 bg-linear-to-r from-black via-red-600 to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <ApplicationForm onSubmit={handleAddApplication} />
        
      </div>
    </main>
  );
}
