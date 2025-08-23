// TechnicalSkillsForm.jsx
import { useState, useEffect } from 'react';

const TechnicalSkillsForm = ({ skills, onUpdate }) => {
  const [formData, setFormData] = useState(skills);

  // Update local state when props change
  useEffect(() => {
    setFormData(skills);
  }, [skills]);

  // Handle section toggle (enable/disable)
  const handleSectionToggle = (sectionKey) => {
    const updatedData = {
      ...formData,
      [sectionKey]: {
        ...formData[sectionKey],
        enabled: !formData[sectionKey].enabled
      }
    };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  // Handle adding item to a section
  const handleAddItem = (sectionKey, item) => {
    if (!item.trim()) return;
    
    const updatedData = {
      ...formData,
      [sectionKey]: {
        ...formData[sectionKey],
        items: [...formData[sectionKey].items, item.trim()]
      }
    };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  // Handle removing item from a section
  const handleRemoveItem = (sectionKey, itemIndex) => {
    const updatedData = {
      ...formData,
      [sectionKey]: {
        ...formData[sectionKey],
        items: formData[sectionKey].items.filter((_, index) => index !== itemIndex)
      }
    };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  // Individual section component
  const SkillSection = ({ sectionKey, title, icon, placeholder }) => {
    const [newItem, setNewItem] = useState('');
    const section = formData[sectionKey];

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddItem(sectionKey, newItem);
      setNewItem('');
    };

    return (
      <div className={`border rounded-lg p-4 ${section.enabled ? 'border-fuchsia-300 bg-fuchsia-50' : 'border-gray-300 bg-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <h3 className={`font-medium ${section.enabled ? 'text-fuchsia-900' : 'text-gray-100'}`}>
              {title}
            </h3>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={() => handleSectionToggle(sectionKey)}
              className="w-4 h-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Include</span>
          </label>
        </div>

        {section.enabled && (
          <>
            {/* Add new item form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1 px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                placeholder={placeholder}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
              >
                Add
              </button>
            </form>

            {/* List of items */}
            <div className="space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-gray-900">{item}</span>
                  <button
                    onClick={() => handleRemoveItem(sectionKey, index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {section.items.length === 0 && (
                <p className="text-gray-500 text-sm italic">No items added yet</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Select which technical skill sections to include in your resume and add items to each section.
      </p>

      <SkillSection
        sectionKey="languages"
        title="Programming Languages"
        icon="💻"
        placeholder="e.g. JavaScript, Python, Java"
      />

      <SkillSection
        sectionKey="frameworks"
        title="Frameworks & Libraries"
        icon="🚀"
        placeholder="e.g. React, Express.js, Django"
      />

      <SkillSection
        sectionKey="tools"
        title="Tools & Technologies"
        icon="🛠️"
        placeholder="e.g. Git, Docker, AWS"
      />

      <SkillSection
        sectionKey="databases"
        title="Databases"
        icon="🗃️"
        placeholder="e.g. MongoDB, PostgreSQL, MySQL"
      />

      <SkillSection
        sectionKey="certificates"
        title="Certifications"
        icon="🏆"
        placeholder="e.g. AWS Certified Developer, Google Cloud"
      />

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Resume Preview</h3>
        <p className="text-sm text-blue-800">
          Enabled sections: {Object.values(formData).filter(section => section.enabled).length} of 5
        </p>
        <p className="text-sm text-blue-700">
          Total items: {Object.values(formData).reduce((total, section) => total + (section.enabled ? section.items.length : 0), 0)}
        </p>
      </div>
    </div>
  );
};

export default TechnicalSkillsForm;