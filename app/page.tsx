'use client';

import { useState, useEffect } from 'react';
import ApplicationForm from '@/components/ApplicationForm';
import { UniversityApplication } from '@/types/application';

export default function Home() {
  const [applications, setApplications] = useState<UniversityApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load applications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('universityApplications');
    if (stored) {
      try {
        setApplications(JSON.parse(stored));
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
        <div className="text-center mb-12 bg-yellow-400/10 rounded-xl p-8 border-2 border-yellow-400/40">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Shortlist University
          </h1>
          <p className="text-xl text-gray-700">
            Add universities you're considering for your studies in Germany
          </p>
        </div>

        <ApplicationForm onSubmit={handleAddApplication} />
        
        <div className="mt-8 text-center bg-yellow-400/20 border-2 border-yellow-400/30 rounded-lg p-4">
          <p className="text-gray-900 font-bold">
            Total applications: <span className="text-red-600 text-xl">{applications.length}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
