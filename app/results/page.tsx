'use client';

import { useState, useEffect } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UniversityApplication, ApplicationStatus } from '@/types/application';

export default function ResultsPage() {
  const [applications, setApplications] = useState<UniversityApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [importData, setImportData] = useState<{ count: number; newCount: number; duplicateCount: number; data: UniversityApplication[] } | null>(null);

  // Load applications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('universityApplications');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Check if an application is a duplicate based on university name, subject, and deadline
  const isDuplicate = (newApp: UniversityApplication, existingApps: UniversityApplication[]) => {
    if (!Array.isArray(existingApps)) {
      return false;
    }
    return existingApps.some(existing => 
      existing.universityName?.toLowerCase().trim() === newApp.universityName?.toLowerCase().trim() &&
      existing.subject?.toLowerCase().trim() === newApp.subject?.toLowerCase().trim() &&
      existing.applicationEndDate === newApp.applicationEndDate
    );
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No data to export!');
      return;
    }

    // CSV headers
    const headers = [
      'University Name',
      'Semester Fee',
      'City',
      'Apply Through',
      'Application Start Date',
      'Application End Date',
      'Subject',
      'Living Cost',
      'Required Documents',
      'IELTS Requirement',
      'Application Fee',
      'Applied',
      'Status',
      'Useful Links',
      'Created At'
    ];

    // Convert applications to CSV rows
    const rows = applications.map(app => [
      app.universityName || '',
      app.semesterFee || '',
      app.city || '',
      app.applyThrough || '',
      app.applicationStartDate || '',
      app.applicationEndDate || '',
      app.subject || '',
      app.livingCost || '',
      (app.documentsRequired || '').replace(/,/g, ';'), // Replace commas with semicolons
      app.ieltsScore || '',
      app.applicationFee || '',
      app.applied ? 'Yes' : 'No',
      app.status || '',
      (app.usefulLinks || '').replace(/,/g, ';'), // Replace commas with semicolons
      app.createdAt || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `university-shortlist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('Invalid CSV file!');
          return;
        }

        // Skip header row
        const dataLines = lines.slice(1);
        const imported: UniversityApplication[] = [];

        dataLines.forEach(line => {
          // Parse CSV line (handling quoted values)
          const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
          if (!matches || matches.length < 15) return;

          const values = matches.map(val => val.replace(/^"(.*)"$/, '$1').trim());

          imported.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            universityName: values[0] || '',
            semesterFee: values[1] || '',
            city: values[2] || '',
            applyThrough: values[3] || '',
            applicationStartDate: values[4] || '',
            applicationEndDate: values[5] || '',
            subject: values[6] || '',
            livingCost: values[7] || '',
            documentsRequired: (values[8] || '').replace(/;/g, ','),
            ieltsScore: values[9] || '',
            applicationFee: values[10] || '',
            applied: values[11]?.toLowerCase() === 'yes',
            status: (values[12] || '') as ApplicationStatus,
            usefulLinks: (values[13] || '').replace(/;/g, ','),
            createdAt: values[14] || new Date().toISOString()
          });
        });

        if (imported.length > 0) {
          // Filter out duplicates
          const newApplications = imported.filter(app => !isDuplicate(app, applications));
          const duplicateCount = imported.length - newApplications.length;
          
          if (newApplications.length === 0) {
            alert('All entries in the CSV file already exist in your list. No new data to import.');
          } else {
            setImportData({ 
              count: imported.length, 
              newCount: newApplications.length, 
              duplicateCount,
              data: newApplications 
            });
          }
        } else {
          alert('No valid data found in CSV file.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be imported again
    event.target.value = '';
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
        <Breadcrumbs 
          items={[
            { label: 'Add University', href: '/', icon: '🏠' },
            { label: 'Shortlist', href: '/results', icon: '📋', active: true }
          ]} 
        />
        
        <div className="relative text-center mb-12 bg-linear-to-br from-red-50 via-white to-yellow-50 rounded-2xl p-8 border-2 border-red-600 shadow-xl overflow-hidden">
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-black/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-yellow-400/15 to-transparent rounded-tr-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-linear-to-br from-red-600/20 to-transparent rounded-br-full"></div>
          
          {/* Icon decoration */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-full mb-3 shadow-lg shadow-yellow-400/30">
            <span className="text-2xl">📋</span>
          </div>
          
          <h1 className="text-3xl font-extrabold bg-linear-to-r from-gray-900 via-yellow-700 to-gray-900 bg-clip-text text-transparent mb-3">
            Shortlisted Universities
          </h1>
          <p className="text-base text-gray-700 font-medium max-w-2xl mx-auto">
            Universities you&apos;re considering and tracking application status
          </p>
          
          {/* Bottom accent line */}
          <div className="mt-4 w-24 h-1 bg-linear-to-r from-yellow-400 via-red-600 to-black mx-auto rounded-full"></div>
        </div>

        {/* Export/Import Buttons */}
        <div className="mb-8 flex justify-end gap-4">
          <button
            onClick={handleExportCSV}
            className="group px-6 py-3.5 bg-linear-to-br from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 border-2 border-yellow-600 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/40 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">📥</span>
            <span>Export to CSV</span>
          </button>
          <label className="group px-6 py-3.5 bg-linear-to-br from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 cursor-pointer border-2 border-red-800 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 flex items-center gap-2">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">📤</span>
            <span>Import from CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
        </div>

        <ApplicationTable
          applications={applications}
          onToggleApplied={handleToggleApplied}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteApplication}
        />
      </div>

      {/* Import Confirmation Modal */}
      {importData && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setImportData(null)}
        >
          <div
            className="bg-white rounded-2xl border-4 border-yellow-400 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-linear-to-br from-yellow-400 to-yellow-500 text-gray-900 p-5 rounded-t-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full -ml-8 -mb-8"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">📤</span>
                </div>
                <h2 className="text-xl font-bold">Import Universities</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-lg text-gray-700 mb-4">
                Found <span className="font-bold text-gray-900">{importData.count}</span> {importData.count === 1 ? 'entry' : 'entries'} in the CSV file.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between bg-linear-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-3 shadow-sm">
                  <span className="text-gray-800 font-semibold flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span>New entries to import:</span>
                  </span>
                  <span className="font-bold text-green-700 text-xl px-3 py-1 bg-white rounded-lg">{importData.newCount}</span>
                </div>
                
                {importData.duplicateCount > 0 && (
                  <div className="flex items-center justify-between bg-linear-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-800 font-semibold flex items-center gap-2">
                      <span className="text-xl">🚫</span>
                      <span>Duplicates (skipped):</span>
                    </span>
                    <span className="font-bold text-red-700 text-xl px-3 py-1 bg-white rounded-lg">{importData.duplicateCount}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-linear-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-xl p-4 shadow-sm">
                <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">ℹ️</span>
                  <span>Note:</span>
                </p>
                <ul className="text-sm text-gray-700 space-y-1.5 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">▸</span>
                    <span>Only new universities will be added</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">▸</span>
                    <span>Duplicates are detected by university name, subject, and deadline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">▸</span>
                    <span>Your existing data will not be modified</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-linear-to-b from-gray-50 to-gray-100 p-6 rounded-b-xl border-t-2 border-gray-200 flex gap-3">
              <button
                onClick={() => setImportData(null)}
                className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 border-2 border-gray-300 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setApplications(prev => [...importData.data, ...prev]);
                  setImportData(null);
                }}
                className="flex-1 px-6 py-3 bg-linear-to-br from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 border-2 border-yellow-600 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/40"
              >
                Import {importData.newCount} {importData.newCount === 1 ? 'Entry' : 'Entries'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
