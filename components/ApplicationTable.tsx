'use client';

import { useState } from 'react';
import { UniversityApplication, ApplicationStatus } from '@/types/application';

interface ApplicationTableProps {
  applications: UniversityApplication[];
  onToggleApplied: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (application: UniversityApplication) => void;
}

export default function ApplicationTable({
  applications,
  onToggleApplied,
  onUpdateStatus,
  onDelete,
  onEdit,
}: ApplicationTableProps) {
  const [selectedApp, setSelectedApp] = useState<UniversityApplication | null>(null);
  const [deleteConfirmApp, setDeleteConfirmApp] = useState<UniversityApplication | null>(null);
  const [sortField, setSortField] = useState<'deadline' | 'startDate' | 'semesterFee' | 'livingCost' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter states
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterUniversity, setFilterUniversity] = useState<string>('');
  const [filterApplyThrough, setFilterApplyThrough] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');

  const handleSort = (field: 'deadline' | 'startDate' | 'semesterFee' | 'livingCost') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get unique values for filters
  const uniqueCities = Array.from(new Set(applications.map(app => app.city).filter(Boolean))).sort();
  const uniqueUniversities = Array.from(new Set(applications.map(app => app.universityName).filter(Boolean))).sort();
  const uniqueApplyThrough = Array.from(new Set(applications.map(app => app.applyThrough).filter(Boolean))).sort();

  // Apply filters
  const filteredApplications = applications.filter(app => {
    if (filterCity && app.city !== filterCity) return false;
    if (filterUniversity && app.universityName !== filterUniversity) return false;
    if (filterApplyThrough && app.applyThrough !== filterApplyThrough) return false;
    if (filterStartDate && app.applicationStartDate !== filterStartDate) return false;
    return true;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    // First priority: Move checked/applied universities to top
    if (a.applied !== b.applied) {
      return a.applied ? -1 : 1;
    }

    // Second priority: Custom sorting field
    if (!sortField) return 0;

    let aValue: number | Date;
    let bValue: number | Date;

    if (sortField === 'deadline') {
      aValue = new Date(a.applicationEndDate || '');
      bValue = new Date(b.applicationEndDate || '');
    } else if (sortField === 'startDate') {
      aValue = new Date(a.applicationStartDate || '');
      bValue = new Date(b.applicationStartDate || '');
    } else if (sortField === 'semesterFee') {
      aValue = parseFloat(a.semesterFee || '0');
      bValue = parseFloat(b.semesterFee || '0');
    } else {
      aValue = parseFloat(a.livingCost || '0');
      bValue = parseFloat(b.livingCost || '0');
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const extractLinks = (linksText: string): string[] => {
    if (!linksText) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = linksText.match(urlRegex) || [];
    const lines = linksText.split('\n').filter((line) => line.trim());
    return lines.length > matches.length ? lines : matches;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-yellow-400/30 overflow-hidden">
      {/* Filters Section */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 md:px-6 py-4 border-b-2 border-blue-200">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🔍</span>
          <span>Filters</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">University</label>
            <select
              value={filterUniversity}
              onChange={(e) => setFilterUniversity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Universities</option>
              {uniqueUniversities.map(uni => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Apply Through</label>
            <select
              value={filterApplyThrough}
              onChange={(e) => setFilterApplyThrough(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {uniqueApplyThrough.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {(filterCity || filterUniversity || filterApplyThrough || filterStartDate) && (
          <button
            onClick={() => {
              setFilterCity('');
              setFilterUniversity('');
              setFilterApplyThrough('');
              setFilterStartDate('');
            }}
            className="mt-3 px-4 py-2 text-xs sm:text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Sorting Controls */}
      <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b">
        <span className="text-xs sm:text-sm font-semibold text-gray-700 block sm:inline mb-2 sm:mb-0 sm:mr-4">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort('startDate')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              sortField === 'startDate'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('deadline')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              sortField === 'deadline'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Deadline {sortField === 'deadline' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('semesterFee')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              sortField === 'semesterFee'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="hidden sm:inline">Semester </span>Fee {sortField === 'semesterFee' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('livingCost')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              sortField === 'livingCost'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="hidden sm:inline">Living </span>Cost {sortField === 'livingCost' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          {sortField && (
            <button
              onClick={() => setSortField(null)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="bg-yellow-400/10 rounded-xl border-2 border-yellow-400/30 p-12 text-center m-4">
          <p className="text-gray-700 text-lg font-semibold">
            {applications.length === 0 
              ? 'No universities shortlisted yet. Add your first university to get started!'
              : 'No universities match the selected filters.'
            }
          </p>
        </div>
      ) : (
        <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-600/90">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Applied
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                University Name
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Subject
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                City
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedApplications.map((app) => (
              <tr
                key={app.id}
                className={`transition duration-150 ${
                  app.applied ? 'bg-yellow-400/20 hover:bg-yellow-400/30 border-l-4 border-yellow-400' : 'hover:bg-gray-50'
                }`}
              >
                {/* Applied Checkbox */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={app.applied}
                    onChange={() => onToggleApplied(app.id)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                  />
                </td>

                {/* University Name */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">
                    {app.universityName}
                  </div>
                  <div className="text-xs text-gray-500">
                    via {app.applyThrough}
                  </div>
                </td>

                {/* Subject */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <div className="text-xs sm:text-sm text-gray-900">{app.subject}</div>
                </td>

                {/* City */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">{app.city}</div>
                </td>

                {/* Start Date */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">
                    {formatDate(app.applicationStartDate)}
                  </div>
                </td>

                {/* Deadline */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">
                    {formatDate(app.applicationEndDate)}
                  </div>
                </td>

                {/* Status Dropdown - only show if applied */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {app.applied ? (
                    <select
                      value={app.status || ''}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg border-2 font-semibold cursor-pointer ${
                        app.status === 'accepted'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : app.status === 'processing'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : app.status === 'applied for VPD'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      <option value="">Not set</option>
                      <option value="processing">⏳ Processing</option>
                      <option value="accepted">✓ Accepted</option>
                      <option value="rejected">✗ Rejected</option>
                      <option value="applied for VPD">📋 Applied for VPD</option>
                    </select>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-900 font-semibold mr-2 sm:mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    className="text-green-600 hover:text-green-900 font-semibold mr-2 sm:mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmApp(app)}
                    className="text-red-600 hover:text-red-900 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-yellow-400/10 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t-2 border-yellow-400/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs sm:text-sm">
          <div className="flex flex-wrap gap-3 sm:gap-6">
            <span className="text-gray-900 font-bold">
              <strong>Total:</strong> {filteredApplications.length}
            </span>
            <span className="text-yellow-700 font-bold">
              <strong>Applied:</strong> {filteredApplications.filter(app => app.applied).length}
            </span>
            <span className="text-red-700 font-bold">
              <strong>Pending:</strong> {filteredApplications.filter(app => !app.applied).length}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {filteredApplications.filter(app => app.status === 'accepted').length > 0 && (
              <span className="text-green-800">
                <strong>Accepted:</strong> {filteredApplications.filter(app => app.status === 'accepted').length}
              </span>
            )}
            {filteredApplications.filter(app => app.status === 'processing').length > 0 && (
              <span className="text-blue-800">
                <strong>Processing:</strong> {filteredApplications.filter(app => app.status === 'processing').length}
              </span>
            )}
            {filteredApplications.filter(app => app.status === 'rejected').length > 0 && (
              <span className="text-red-800">
                <strong>Rejected:</strong> {filteredApplications.filter(app => app.status === 'rejected').length}
              </span>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {/* View Details Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-2xl border-4 border-red-600 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-linear-to-br from-red-600 to-red-700 text-white p-4 sm:p-5 rounded-t-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/10 rounded-full -mr-12 -mb-12"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedApp.universityName}</h2>
                  <p className="text-red-100 text-xs sm:text-sm flex items-center gap-2">
                    <span>📍</span>
                    <span>via {selectedApp.applyThrough}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all hover:rotate-90 duration-200"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Main Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-xl border-2 border-yellow-400/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span>📚</span>
                    <span>Subject</span>
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{selectedApp.subject}</p>
                </div>
                <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-xl border-2 border-yellow-400/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span>🏙️</span>
                    <span>City</span>
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{selectedApp.city}</p>
                </div>
                <div className="bg-linear-to-br from-red-50 to-red-100 p-3 sm:p-4 rounded-xl border-2 border-red-400/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span>🗓️</span>
                    <span className="text-[10px] sm:text-xs">Application Opens</span>
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {selectedApp.applicationStartDate ? formatDate(selectedApp.applicationStartDate) : 'Not specified'}
                  </p>
                </div>
                <div className="bg-linear-to-br from-red-50 to-red-100 p-3 sm:p-4 rounded-xl border-2 border-red-400/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span>⏰</span>
                    <span>Deadline</span>
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{formatDate(selectedApp.applicationEndDate)}</p>
                </div>
              </div>

              {/* Fees Section */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <span>Fees & Costs</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {selectedApp.semesterFee && (
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border-2 border-gray-300 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Semester Fee</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">€{selectedApp.semesterFee}</p>
                    </div>
                  )}
                  {selectedApp.livingCost && (
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border-2 border-gray-300 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Living Cost</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">€{selectedApp.livingCost}/mo</p>
                    </div>
                  )}
                  {selectedApp.applicationFee && (
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border-2 border-gray-300 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Application Fee</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">€{selectedApp.applicationFee}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* IELTS Requirement */}
              {selectedApp.ieltsScore && (
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">📝 IELTS Requirement</h3>
                  <p className="text-sm sm:text-base text-gray-700 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    {selectedApp.ieltsScore}
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {selectedApp.documentsRequired && (
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">📄 Required Documents</h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg whitespace-pre-wrap text-sm sm:text-base text-gray-700">
                    {selectedApp.documentsRequired}
                  </div>
                </div>
              )}

              {/* Useful Links */}
              {selectedApp.usefulLinks && (
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">🔗 Useful Links</h3>
                  <div className="space-y-2">
                    {extractLinks(selectedApp.usefulLinks).map((link, index) => (
                      <a
                        key={index}
                        href={link.startsWith('http') ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline break-all bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-200"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Status */}
              <div className="border-t pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Application Status</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Added on {formatDate(selectedApp.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                      selectedApp.applied ? 'bg-yellow-400 text-gray-900' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {selectedApp.applied ? '✓ Applied' : 'Not Applied'}
                    </span>
                    {selectedApp.applied && selectedApp.status && (
                      <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                        selectedApp.status === 'accepted'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : selectedApp.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : selectedApp.status === 'processing'
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                          : selectedApp.status === 'applied for VPD'
                          ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                          : ''
                      }`}>
                        {selectedApp.status === 'accepted' ? '✓ Accepted' : 
                         selectedApp.status === 'rejected' ? '✗ Rejected' : 
                         selectedApp.status === 'processing' ? '⏳ Processing' : 
                         selectedApp.status === 'applied for VPD' ? '📋 Applied for VPD' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-linear-to-b from-gray-50 to-gray-100 p-4 sm:p-6 rounded-b-xl border-t-2 border-gray-200">
              <button
                onClick={() => setSelectedApp(null)}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-linear-to-br from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmApp && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirmApp(null)}
        >
          <div
            className="bg-white rounded-2xl border-4 border-red-600 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-linear-to-br from-red-600 to-red-700 text-white p-4 sm:p-5 rounded-t-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full -ml-8 -mb-8"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">⚠️</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold">Confirm Delete</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <p className="text-base sm:text-lg text-gray-700 mb-4">
                Are you sure you want to delete this university?
              </p>
              <div className="bg-linear-to-br from-yellow-50 to-amber-100 border-2 border-yellow-400 rounded-xl p-3 sm:p-4 shadow-sm">
                <p className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                  <span>🎓</span>
                  <span>{deleteConfirmApp.universityName}</span>
                </p>
                <p className="text-gray-600 text-xs sm:text-sm ml-7">{deleteConfirmApp.subject} • {deleteConfirmApp.city}</p>
              </div>
              <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-xl p-3">
                <p className="text-xs sm:text-sm text-red-700 font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>This action cannot be undone.</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-linear-to-b from-gray-50 to-gray-100 p-4 sm:p-6 rounded-b-xl border-t-2 border-gray-200 flex gap-3">
              <button
                onClick={() => setDeleteConfirmApp(null)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 border-2 border-gray-300 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmApp.id);
                  setDeleteConfirmApp(null);
                }}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-linear-to-br from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
