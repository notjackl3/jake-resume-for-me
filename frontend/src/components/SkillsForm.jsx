// SkillsForm.jsx
import { useState, useEffect } from 'react';

const SkillsForm = ({ skills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');

  // Handle adding individual skill
  const handleAddSkill = (event) => {
    event.preventDefault();
    if (!newSkill.trim()) return;
    
    onUpdate(newSkill)

    setNewSkill('');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        Add your technical skills below. You can enter them as comma-separated text or add them individually.
      </p>

      {/* Add individual skill form */}
      <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="Add individual skill"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-600 transition-colors font-medium"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default SkillsForm;