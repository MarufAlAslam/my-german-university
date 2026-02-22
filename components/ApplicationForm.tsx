'use client';

import { useState } from 'react';
import { UniversityApplication } from '@/types/application';

interface ApplicationFormProps {
  onSubmit: (application: Omit<UniversityApplication, 'id' | 'createdAt' | 'applied' | 'status'>) => void;
}

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    universityName: '',
    semesterFee: '',
    city: '',
    applyThrough: '',
    applicationStartDate: '',
    applicationEndDate: '',
    subject: '',
    livingCost: '',
    documentsRequired: '',
    ieltsScore: '',
    applicationFee: '',
    usefulLinks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      universityName: '',
      semesterFee: '',
      city: '',
      applyThrough: '',
      applicationStartDate: '',
      applicationEndDate: '',
      subject: '',
      livingCost: '',
      documentsRequired: '',
      ieltsScore: '',
      applicationFee: '',
      usefulLinks: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-yellow-400/40 p-8 mb-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 pb-4 border-b-2 border-yellow-400/40">Add New University Application</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            University Name *
          </label>
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Technical University of Munich"
          />
        </div>

        {/* Subject */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject/Program *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City/Location *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Munich"
          />
        </div>

        {/* Apply Through */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Apply Through *
          </label>
          <input
            type="text"
            name="applyThrough"
            value={formData.applyThrough}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Uni-Assist, Direct"
          />
        </div>

        {/* Application Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Application Start Date
          </label>
          <input
            type="date"
            name="applicationStartDate"
            value={formData.applicationStartDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Application End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Application End Date *
          </label>
          <input
            type="date"
            name="applicationEndDate"
            value={formData.applicationEndDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Semester Fee */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Semester Fee (€)
          </label>
          <input
            type="text"
            name="semesterFee"
            value={formData.semesterFee}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 350"
          />
        </div>

        {/* Living Cost */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Living Cost (€/month)
          </label>
          <input
            type="text"
            name="livingCost"
            value={formData.livingCost}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 850"
          />
        </div>

        {/* IELTS Score */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IELTS Score Required
          </label>
          <input
            type="text"
            name="ieltsScore"
            value={formData.ieltsScore}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 6.5"
          />
        </div>

        {/* Application Fee */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Application Fee (€)
          </label>
          <input
            type="text"
            name="applicationFee"
            value={formData.applicationFee}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 75"
          />
        </div>

        {/* Documents Required */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Documents Required
          </label>
          <textarea
            name="documentsRequired"
            value={formData.documentsRequired}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Passport, Transcripts, CV, Motivation Letter, etc."
          />
        </div>

        {/* Useful Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Useful Links
          </label>
          <textarea
            name="usefulLinks"
            value={formData.usefulLinks}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add useful links (one per line)"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 border-2 border-red-600"
        >
          Add University Application
        </button>
      </div>
    </form>
  );
}
