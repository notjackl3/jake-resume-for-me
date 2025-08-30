// AddEducationForm.jsx
import { useState } from 'react';

const AddEducationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    location: '',
    start_date: '',
    end_date: '',
    gpa: '',
    useGpa: false // Toggle for GPA vs Date
  });

  // Handle regular input changes
  const handleInputChange = (even) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.school || !formData.major) {
      alert('Please fill in school/college and major');
      return;
    }

    // Clean data based on toggle choice
    const cleanedData = {
      ...formData,
      start_date: formData.useGpa ? '' : formData.start_date,
      end_date: formData.useGpa ? '' : formData.end_date,
      gpa: formData.useGpa ? formData.gpa : ''
    };

    onSubmit(cleanedData);
    
    setFormData({
      school: '',
      major: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
      useGpa: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          School/university *
        </label>
        <input
          type="text"
          name="school"
          value={formData.school}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
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
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
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
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. Toronto, ON"
        />
      </div>

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
            className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
            placeholder="e.g. 3.8/4.0"
          />
        </div>
      ) : (
        <>
            <div>
                <label className="block text-sm font-medium text-label-primary mb-1">
                Start Date
                </label>
                <input
                type="month"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
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
                className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
            />
            </div>
        </>
      )}
    	
			{/* Toggle for Date vs GPA */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="useGpa"
          name="useGpa"
          checked={formData.useGpa}
          onChange={handleInputChange}
          className="w-4 h-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
        />
        <label htmlFor="useGpa" className="text-sm font-medium text-label-primary">
          Include GPA instead of end date
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Add Education
      </button>
    </form>
  );
};

export default AddEducationForm;