// EditExperiencePanel.jsx
import { useState, useEffect } from 'react';

const EditExperiencePanel = ({ experience, onSave, onCancel }) => {
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [idData, setIdData] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    organisation: '',
    location: '',
    start_date: '',
    end_date: '',
    descriptions: ['']
  });

  // Populate form with existing experience data
  useEffect(() => {
    if (experience) {
      setIdData(experience.id)
      setFormData({
        title: experience.title || '',
        organisation: experience.organisation || '',
        location: experience.location || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        descriptions: experience.descriptions && experience.descriptions.length > 0 
          ? experience.descriptions 
          : ['']
      });
      // Set current job status based on whether end_date is empty
      setIsCurrentJob(!experience.end_date || experience.end_date.trim() === '');
    }
  }, [experience]);

  // Handle regular input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle description field changes
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.descriptions];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      descriptions: newDescriptions
    }));
  };

  // Add new description field
  const addDescriptionField = () => {
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, '']
    }));
  };

  // Remove description field
  const removeDescriptionField = (index) => {
    if (formData.descriptions.length > 1) {
      const newDescriptions = formData.descriptions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        descriptions: newDescriptions
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.organisation) {
      alert('Please fill in title and organisation');
      return;
    }

    // Handle current job logic - if current job, clear end date
    const submissionData = {
      ...formData,
      end_date: isCurrentJob ? '' : formData.end_date
    };

    const objectDescriptions = submissionData.descriptions?.filter(item => typeof item === 'object' && item !== null) ?? [];
    const objectStringDescriptions = objectDescriptions.map(desc => desc.content)
    const stringDescriptions = submissionData.descriptions?.filter(item => typeof item === 'string') ?? [];

    const cleanedData = {
      ...submissionData,
      descriptions: [
        ...stringDescriptions.filter(desc => desc.trim() !== ''),
        ...objectStringDescriptions.filter(desc => desc.trim() !== '')
      ]
    };
    
    onSave(cleanedData, idData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Job Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Company *
        </label>
        <input
          type="text"
          name="organisation"
          value={formData.organisation}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. Google"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-label-primary mb-1">
            Start Date
          </label>
          <input
            type="month"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-label-primary mb-1">
            End Date
          </label>
          <input
            type="month"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            disabled={isCurrentJob}
            className={`w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              isCurrentJob ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="checkbox" 
              id="current-job-edit"
              checked={isCurrentJob}
              onChange={(e) => setIsCurrentJob(e.target.checked)}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="current-job-edit" className="text-sm font-medium text-label-primary">
              Current
            </label>
          </div>
        </div>
      </div>

      {/* Description Fields */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Job Descriptions
        </label>
        {formData.descriptions.map((description, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={description.content}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows="2"
              placeholder={`Description ${index + 1}`}
            />
            {formData.descriptions.length > 1 && (
              <button
                type="button"
                onClick={() => removeDescriptionField(index)}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDescriptionField}
          className="text-sm text-green-600 hover:text-green-800"
        >
          + Add Description
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditExperiencePanel;