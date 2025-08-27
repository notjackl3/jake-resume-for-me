// SkillsForm.jsx
import { useState, useEffect } from 'react';

const SkillsForm = ({ skills, onUpdate }) => {
  const [formData, setFormData] = useState({
    languages_list: '',
    frameworks_list: '',
    tools_list: '',
    databases_list: '',
    certificates_list: '',
    technologies_list: ''
  });

  // Update local state when props change
  useEffect(() => {
    if (skills && skills.length > 0) {
      setFormData(skills[0]);
    }
  }, [skills]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // Send updated data back to parent
    onUpdate([updatedData]);
  };

  // Convert comma-separated string to array for display
  const stringToArray = (str) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item);
  };

  // Individual skill section component
  const SkillSection = ({ fieldKey, title, icon, placeholder }) => {
    const [newItem, setNewItem] = useState('');
    const currentValue = formData[fieldKey] || '';
    const itemsArray = stringToArray(currentValue);

    const handleAddItem = (e) => {
      e.preventDefault();
      if (!newItem.trim()) return;
      
      const updatedValue = currentValue 
        ? `${currentValue}, ${newItem.trim()}`
        : newItem.trim();
      
      handleInputChange(fieldKey, updatedValue);
      setNewItem('');
    };

    const handleRemoveItem = (indexToRemove) => {
      const updatedArray = itemsArray.filter((_, index) => index !== indexToRemove);
      const updatedValue = updatedArray.join(', ');
      handleInputChange(fieldKey, updatedValue);
    };

    const handleDirectEdit = (value) => {
      handleInputChange(fieldKey, value);
    };

    return (
      <div className="border rounded-lg p-4 border-fuchsia-300 bg-fuchsia-50">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg">{icon}</span>
          <h3 className="font-medium text-fuchsia-900">{title}</h3>
        </div>

        {/* Direct text input */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-fuchsia-800 mb-1">
            Enter items (comma-separated):
          </label>
          <textarea
            value={currentValue}
            onChange={(e) => handleDirectEdit(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent resize-none"
            rows="2"
            placeholder={placeholder}
          />
        </div>

        {/* Add individual item form */}
        <form onSubmit={handleAddItem} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
            placeholder="Add individual item"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Display items as tags */}
        {itemsArray.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-fuchsia-800">Current items:</h4>
            <div className="flex flex-wrap gap-2">
              {itemsArray.map((item, index) => (
                <div key={index} className="flex items-center bg-white px-3 py-1 rounded-full border border-fuchsia-200">
                  <span className="text-gray-900 text-sm">{item}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Add your technical skills to each section. You can enter items as comma-separated text or add them individually.
      </p>

      <SkillSection
        fieldKey="languages_list"
        title="Programming Languages"
        icon="💻"
        placeholder="e.g. JavaScript, Python, Java, C++"
      />

      <SkillSection
        fieldKey="frameworks_list"
        title="Frameworks & Libraries"
        icon="🚀"
        placeholder="e.g. Django, Flask, FastAPI, React"
      />

      <SkillSection
        fieldKey="tools_list"
        title="Tools"
        icon="🛠️"
        placeholder="e.g. VSCode, Git, Docker, Postman"
      />

      <SkillSection
        fieldKey="technologies_list"
        title="Technologies"
        icon="⚙️"
        placeholder="e.g. REST APIs, GraphQL, Microservices"
      />

      <SkillSection
        fieldKey="databases_list"
        title="Databases"
        icon="🗃️"
        placeholder="e.g. PostgreSQL, MongoDB, MySQL"
      />

      <SkillSection
        fieldKey="certificates_list"
        title="Certifications"
        icon="🏆"
        placeholder="e.g. AWS Certified Developer, Google Cloud"
      />

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Skills Summary</h3>
        {Object.entries(formData).map(([key, value]) => {
          const itemCount = stringToArray(value).length;
          const sectionName = key.replace('_list', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          return itemCount > 0 ? (
            <p key={key} className="text-sm text-blue-800">
              {sectionName}: {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default SkillsForm;