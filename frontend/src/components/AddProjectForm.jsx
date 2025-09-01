// AddProjectForm.jsx
import { useState } from 'react';

const AddProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    tools: '',
    source_code: '',
    descriptions: [''] // Array of description fields
  });

  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name) {
      alert('Please fill in project name');
      return;
    }

    // Filter out empty descriptions
    const cleanedData = {
      ...formData,
      descriptions: formData.descriptions.filter(desc => desc.trim() !== '')
    };

    onSubmit(cleanedData);
    
    // Reset form
    setFormData({
      name: '',
      tools: '',
      source_code: '',
      descriptions: ['']
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Project Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. E-commerce Website"
          required
        />
      </div>

      {/* Tools/Technologies */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Tools & Technologies
        </label>
        <input
          type="text"
          name="tools"
          value={formData.tools}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
        />
      </div>

      {/* Source Code Link */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Source Code Link
        </label>
        <input
          type="url"
          name="source_code"
          value={formData.source_code}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. https://github.com/username/project"
        />
      </div>

      {/* Description Fields */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Project Descriptions
        </label>
        {formData.descriptions.map((description, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent resize-none"
              rows="2"
              placeholder={`Description ${index + 1}`}
            />
            {formData.descriptions.length > 1 && (
              <button
                type="button"
                onClick={() => removeDescriptionField(index)}
                className="px-2 py-1 text-fuchsia-500 hover:text-fuchsia-900"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDescriptionField}
          className="text-sm text-emerald-400 hover:text-blue-800"
        >
          + Add Description
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-emerald-400 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors font-medium"
      >
        Add Project
      </button>
    </form>
  );
};

export default AddProjectForm;