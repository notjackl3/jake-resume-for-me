// EditEducationPanel.jsx
import { useState, useEffect } from 'react';

const EditEducationPanel = ({ education, onSave, onCancel }) => {
  const [idData, setIdData] = useState(0)
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    location: '',
    start_date: '',
    end_date: '',
    gpa: '',
    useGpa: false
  });

  // Populate form with existing education data
  useEffect(() => {
    if (education) {
			setIdData(education.id)
      setFormData({
        school: education.school || '',
        major: education.major || '',
        location: education.location || '',
        start_date: education.start_date || '',
        end_date: education.end_date || '',
        gpa: education.gpa || '',
        useGpa: education.gpa && education.gpa.trim() !== '' ? true : false
      });
    }
  }, [education]);

  // Handle regular input changes
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!formData.school || !formData.major) {
      alert('Please fill in school/university and major');
      return;
    }

    // Clean data based on toggle choice
    const cleanedData = {
      ...formData,
      start_date: formData.useGpa ? '' : formData.start_date,
      end_date: formData.useGpa ? '' : formData.end_date,
      gpa: formData.useGpa ? formData.gpa : ''
    };

    onSave(cleanedData, idData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* School */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          School/University *
        </label>
        <input
          type="text"
          name="school"
          value={formData.school}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. University of Toronto"
          required
        />
      </div>

      {/* Major */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Major *
        </label>
        <input
          type="text"
          name="major"
          value={formData.major}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. Computer Science"
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
          placeholder="e.g. Toronto, ON"
        />
      </div>

      {/* Conditional rendering based on useGpa toggle */}
      {formData.useGpa ? (
        <div>
          <label className="block text-sm font-medium text-label-primary mb-1">
            GPA
          </label>
          <input
            type="text"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g. 3.8/4.0"
          />
        </div>
      ) : (
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
              className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Toggle for Date vs GPA */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="useGpa"
          name="useGpa"
          checked={formData.useGpa}
          onChange={handleInputChange}
          className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="useGpa" className="text-sm font-medium text-label-primary">
          Include GPA instead of end date
        </label>
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

export default EditEducationPanel;