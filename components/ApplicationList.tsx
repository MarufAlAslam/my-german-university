'use client';

import { UniversityApplication, ApplicationStatus } from '@/types/application';

interface ApplicationListProps {
  applications: UniversityApplication[];
  onDelete: (id: string) => void;
  onToggleApplied: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  showAsApplied: boolean;
}

export default function ApplicationList({
  applications,
  onDelete,
  onToggleApplied,
  onUpdateStatus,
  showAsApplied,
}: ApplicationListProps) {
  const extractLinks = (linksText: string): string[] => {
    if (!linksText) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = linksText.match(urlRegex) || [];
    // Also split by newlines for non-URL text
    const lines = linksText.split('\n').filter((line) => line.trim());
    return lines.length > matches.length ? lines : matches;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">
          {showAsApplied 
            ? "No applications submitted yet. Mark applications as applied in the 'Not Applied' tab!" 
            : "No pending applications. Add your first application above!"}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {showAsApplied ? '✅ Applied Universities' : '📝 Pending Applications'} ({applications.length})
      </h2>
      
      {applications.map((app) => (
        <div
          key={app.id}
          className={`rounded-xl shadow-lg p-6 border-l-4 transition duration-200 hover:shadow-xl ${
            showAsApplied 
              ? 'bg-green-50 border-green-500' 
              : 'bg-white border-yellow-500'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">
                {app.universityName}
              </h3>
              <p className="text-lg text-blue-600 font-semibold">{app.subject}</p>
              <p className="text-gray-600 mt-1">
                📍 {app.city} • Apply via: {app.applyThrough}
              </p>
              
              {/* Status Display/Selector for Applied Universities */}
              {showAsApplied && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Status:
                  </label>
                  <select
                    value={app.status || ''}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                    className={`px-4 py-2 border-2 rounded-lg font-semibold transition duration-200 ${getStatusColor(app.status)}`}
                  >
                    <option value="">Select status...</option>
                    <option value="processing">⏳ Processing</option>
                    <option value="accepted">✓ Accepted</option>
                    <option value="rejected">✗ Rejected</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              {!showAsApplied && (
                <button
                  onClick={() => onToggleApplied(app.id)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-semibold transition duration-200"
                >
                  Mark as Applied
                </button>
              )}
              {showAsApplied && (
                <button
                  onClick={() => onToggleApplied(app.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-semibold transition duration-200 text-sm"
                >
                  Move to Pending
                </button>
              )}
              <button
                onClick={() => onDelete(app.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                Application Deadline
              </p>
              <p className="text-gray-800 font-bold">
                {formatDate(app.applicationEndDate)}
              </p>
              {app.applicationStartDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Opens: {formatDate(app.applicationStartDate)}
                </p>
              )}
            </div>

            {app.semesterFee && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                  Semester Fee
                </p>
                <p className="text-gray-800 font-bold">€{app.semesterFee}</p>
              </div>
            )}

            {app.livingCost && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                  Living Cost/Month
                </p>
                <p className="text-gray-800 font-bold">€{app.livingCost}</p>
              </div>
            )}

            {app.applicationFee && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                  Application Fee
                </p>
                <p className="text-gray-800 font-bold">€{app.applicationFee}</p>
              </div>
            )}

            {app.ieltsScore && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                  IELTS Required
                </p>
                <p className="text-gray-800 font-bold">{app.ieltsScore}</p>
              </div>
            )}
          </div>

          {app.documentsRequired && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                📄 Documents Required:
              </p>
              <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {app.documentsRequired}
              </p>
            </div>
          )}

          {app.usefulLinks && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                🔗 Useful Links:
              </p>
              <div className="space-y-1">
                {extractLinks(app.usefulLinks).map((link, index) => {
                  const isUrl = link.startsWith('http');
                  return (
                    <div key={index} className="bg-blue-50 p-2 rounded">
                      {isUrl ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {link}
                        </a>
                      ) : (
                        <span className="text-gray-700">{link}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Added on {formatDate(app.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
