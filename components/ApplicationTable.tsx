'use client';

import { useState } from 'react';
import { UniversityApplication, ApplicationStatus } from '@/types/application';

interface ApplicationTableProps {
  applications: UniversityApplication[];
  onToggleApplied: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationTable({
  applications,
  onToggleApplied,
  onUpdateStatus,
  onDelete,
}: ApplicationTableProps) {
  const [selectedApp, setSelectedApp] = useState<UniversityApplication | null>(null);

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

  if (applications.length === 0) {
    return (
      <div className="bg-yellow-400/10 rounded-xl border-2 border-yellow-400/30 p-12 text-center">
        <p className="text-gray-700 text-lg font-semibold">
          No universities shortlisted yet. Add your first university to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-yellow-400/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-600/90">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                University Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr
                key={app.id}
                className={`transition duration-150 ${
                  app.applied ? 'bg-yellow-400/20 hover:bg-yellow-400/30 border-l-4 border-yellow-400' : 'hover:bg-gray-50'
                }`}
              >
                {/* Applied Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={app.applied}
                    onChange={() => onToggleApplied(app.id)}
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                  />
                </td>

                {/* University Name */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {app.universityName}
                  </div>
                  <div className="text-xs text-gray-500">
                    via {app.applyThrough}
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{app.subject}</div>
                </td>

                {/* City */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{app.city}</div>
                </td>

                {/* Deadline */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(app.applicationEndDate)}
                  </div>
                </td>

                {/* Status Dropdown - only show if applied */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {app.applied ? (
                    <select
                      value={app.status || ''}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className={`text-sm px-3 py-1 rounded-lg border-2 font-semibold cursor-pointer ${
                        app.status === 'accepted'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : app.status === 'processing'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      <option value="">Not set</option>
                      <option value="processing">⏳ Processing</option>
                      <option value="accepted">✓ Accepted</option>
                      <option value="rejected">✗ Rejected</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-900 font-semibold mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this application?')) {
                        onDelete(app.id);
                      }
                    }}
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
      <div className="bg-yellow-400/10 px-6 py-4 border-t-2 border-yellow-400/30">
        <div className="flex justify-between items-center text-sm">
          <div className="space-x-6">
            <span className="text-gray-900 font-bold">
              <strong>Total:</strong> {applications.length}
            </span>
            <span className="text-yellow-700 font-bold">
              <strong>Applied:</strong> {applications.filter(app => app.applied).length}
            </span>
            <span className="text-red-700 font-bold">
              <strong>Pending:</strong> {applications.filter(app => !app.applied).length}
            </span>
          </div>
          <div className="space-x-4">
            {applications.filter(app => app.status === 'accepted').length > 0 && (
              <span className="text-green-800">
                <strong>Accepted:</strong> {applications.filter(app => app.status === 'accepted').length}
              </span>
            )}
            {applications.filter(app => app.status === 'processing').length > 0 && (
              <span className="text-blue-800">
                <strong>Processing:</strong> {applications.filter(app => app.status === 'processing').length}
              </span>
            )}
            {applications.filter(app => app.status === 'rejected').length > 0 && (
              <span className="text-red-800">
                <strong>Rejected:</strong> {applications.filter(app => app.status === 'rejected').length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-xl border-4 border-yellow-400 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-red-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedApp.universityName}</h2>
                  <p className="text-red-100 text-sm">via {selectedApp.applyThrough}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-white hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold transition"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/30">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedApp.subject}</p>
                </div>
                <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/30">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">City</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedApp.city}</p>
                </div>
                <div className="bg-red-600/10 p-4 rounded-lg border border-red-600/30">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Application Opens</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedApp.applicationStartDate ? formatDate(selectedApp.applicationStartDate) : 'Not specified'}
                  </p>
                </div>
                <div className="bg-red-600/10 p-4 rounded-lg border border-red-600/30">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</h3>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedApp.applicationEndDate)}</p>
                </div>
              </div>

              {/* Fees Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Fees & Costs</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedApp.semesterFee && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Semester Fee</p>
                      <p className="text-xl font-bold text-gray-900">€{selectedApp.semesterFee}</p>
                    </div>
                  )}
                  {selectedApp.livingCost && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Living Cost</p>
                      <p className="text-xl font-bold text-gray-900">€{selectedApp.livingCost}/mo</p>
                    </div>
                  )}
                  {selectedApp.applicationFee && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Application Fee</p>
                      <p className="text-xl font-bold text-gray-900">€{selectedApp.applicationFee}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* IELTS Requirement */}
              {selectedApp.ieltsScore && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">📝 IELTS Requirement</h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {selectedApp.ieltsScore}
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {selectedApp.documentsRequired && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">📄 Required Documents</h3>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
                    {selectedApp.documentsRequired}
                  </div>
                </div>
              )}

              {/* Useful Links */}
              {selectedApp.usefulLinks && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">🔗 Useful Links</h3>
                  <div className="space-y-2">
                    {extractLinks(selectedApp.usefulLinks).map((link, index) => (
                      <a
                        key={index}
                        href={link.startsWith('http') ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 hover:underline break-all bg-blue-50 p-3 rounded-lg border border-blue-200"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Status */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Application Status</h3>
                    <p className="text-sm text-gray-600">
                      Added on {formatDate(selectedApp.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedApp.applied ? 'bg-yellow-400 text-gray-900' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {selectedApp.applied ? '✓ Applied' : 'Not Applied'}
                    </span>
                    {selectedApp.applied && selectedApp.status && (
                      <span className={`px-4 py-2 rounded-lg font-semibold ${
                        selectedApp.status === 'accepted'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : selectedApp.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : selectedApp.status === 'processing'
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                          : ''
                      }`}>
                        {selectedApp.status === 'accepted' ? '✓ Accepted' : 
                         selectedApp.status === 'rejected' ? '✗ Rejected' : 
                         selectedApp.status === 'processing' ? '⏳ Processing' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 rounded-b-lg border-t">
              <button
                onClick={() => setSelectedApp(null)}
                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
