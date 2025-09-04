// EditProjectPanel.jsx
import { useState, useEffect } from 'react';

const EditProjectPanel = ({ project, onSave, onCancel }) => {
  const [idData, setIdData] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    tools: '',
    source_code: '',
    descriptions: ['']
  });

  // Populate form with existing project data
  useEffect(() => {
    if (project) {
      setIdData(project.id)
      setFormData({
        name: project.name || '',
        tools: project.tools || '',
        source_code: project.source_code || '',
        descriptions: project.descriptions && project.descriptions.length > 0 
          ? project.descriptions 
          : ['']
      });
    }
  }, [project]);

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
    if (!formData.name) {
      alert('Please fill in project title');
      return;
    }

    const objectDescriptions = formData.descriptions?.filter(item => typeof item === 'object' && item !== null) ?? [];
    const objectStringDescriptions = objectDescriptions.map(desc => desc.content)
    const stringDescriptions = formData.descriptions?.filter(item => typeof item === 'string') ?? [];

    const cleanedData = {
      ...formData,
      descriptions: [
        ...stringDescriptions.filter(desc => desc.trim() !== ''),
        ...objectStringDescriptions.filter(desc => desc.trim() !== '')
      ]
    };
    
    onSave(cleanedData, idData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Project Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. E-commerce Platform"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Tools & Technologies
        </label>
        <input
          type="text"
          name="tools"
          value={formData.tools}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. Personal Project / Google"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Source Code Link
        </label>
        <input
          type="text"
          name="source_code"
          value={formData.source_code}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. San Francisco, CA"
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

export default EditProjectPanel;