'use client';

import { useState, useEffect } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import { UniversityApplication, ApplicationStatus } from '@/types/application';

export default function ResultsPage() {
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

  const handleToggleApplied = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, applied: !app.applied, status: app.applied ? '' : app.status } : app
      )
    );
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
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
      <div className="absolute top-10 left-20 w-40 h-40 bg-black/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-60 right-10 w-32 h-32 bg-yellow-400/8 pointer-events-none"></div>
      <div className="absolute bottom-40 left-40 w-28 h-28 bg-red-600/10 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-60 w-20 h-20 bg-yellow-400/12 rotate-45 pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-black/6 rotate-12 pointer-events-none"></div>
      <div className="absolute top-32 right-1/3 w-24 h-24 bg-red-600/8 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-yellow-400/10 pointer-events-none"></div>
      <div className="absolute top-1/4 right-40 w-18 h-18 bg-black/7 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/2 right-20 w-22 h-22 bg-red-600/12 rotate-45 pointer-events-none"></div>
      <div className="absolute top-80 left-1/2 w-14 h-14 bg-yellow-400/8 pointer-events-none"></div>
      <div className="absolute bottom-60 right-1/4 w-30 h-30 bg-black/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-20 left-60 w-12 h-12 bg-red-600/10 rotate-12 pointer-events-none"></div>
      <div className="absolute bottom-80 left-80 w-26 h-26 bg-yellow-400/6 rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 bg-yellow-400/10 rounded-xl p-8 border-2 border-yellow-400/40">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Shortlisted Universities
          </h1>
          <p className="text-xl text-gray-700">
            Universities you're considering and tracking application status
          </p>
        </div>

        <ApplicationTable
          applications={applications}
          onToggleApplied={handleToggleApplied}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteApplication}
        />
      </div>
    </main>
  );
}
