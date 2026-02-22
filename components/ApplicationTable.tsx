'use client';

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
                    onClick={() => {
                      const details = `
University: ${app.universityName}
Subject: ${app.subject}
City: ${app.city}
Apply Through: ${app.applyThrough}
Deadline: ${formatDate(app.applicationEndDate)}
${app.applicationStartDate ? `Opens: ${formatDate(app.applicationStartDate)}` : ''}
${app.semesterFee ? `Semester Fee: €${app.semesterFee}` : ''}
${app.livingCost ? `Living Cost: €${app.livingCost}/month` : ''}
${app.applicationFee ? `Application Fee: €${app.applicationFee}` : ''}
${app.ieltsScore ? `IELTS Required: ${app.ieltsScore}` : ''}
${app.documentsRequired ? `\nDocuments Required:\n${app.documentsRequired}` : ''}
${app.usefulLinks ? `\nUseful Links:\n${extractLinks(app.usefulLinks).join('\n')}` : ''}
                      `.trim();
                      alert(details);
                    }}
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
    </div>
  );
}
