// Manage.jsx - Multi-section resume manager
import { useState } from 'react';
import AddExperienceForm from './AddExperienceForm';
import EditExperiencePanel from './EditExperiencePanel';
import AddEducationForm from './AddEducationForm';
// import EditEducationPanel from './EditEducationPanel';
import AddProjectForm from './AddProjectForm';
// import EditProjectPanel from './EditProjectPanel';
import TechnicalSkillsForm from './TechnicalSkillsForm';

const Manage = ({ fileUpload, setFileUpload }) => {
  // Track active section
  const [activeSection, setActiveSection] = useState('experiences');
  
  // Track all data for different sections
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState({
    languages: { enabled: false, items: [] },
    tools: { enabled: false, items: [] },
    frameworks: { enabled: false, items: [] },
    certificates: { enabled: false, items: [] },
    databases: { enabled: false, items: [] }
  });
  
  // Track which item is being edited for each section
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Section configuration
  const sections = [
    { id: 'experiences', label: 'Experiences', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Technical Skills', icon: '⚡' }
  ];

  // Generic handlers for experiences
  const handleAddExperience = (newExperience) => {
    console.log('Adding experience:', newExperience);
    const experienceWithId = { ...newExperience, id: Date.now() };
    setExperiences([...experiences, experienceWithId]);
  };

  const handleEditExperience = (updatedExperience) => {
    console.log('Updating experience:', updatedExperience);
    setExperiences(experiences.map(exp => 
      exp.id === updatedExperience.id ? updatedExperience : exp
    ));
    setEditingExperience(null);
  };

  const handleDeleteExperience = (experienceId) => {
    console.log('Deleting experience:', experienceId);
    setExperiences(experiences.filter(exp => exp.id !== experienceId));
    if (editingExperience && editingExperience.id === experienceId) {
      setEditingExperience(null);
    }
  };

  // Generic handlers for education
  const handleAddEducation = (newEducation) => {
    console.log('Adding education:', newEducation);
    const educationWithId = { ...newEducation, id: Date.now() };
    setEducation([...education, educationWithId]);
  };

  const handleEditEducation = (updatedEducation) => {
    console.log('Updating education:', updatedEducation);
    setEducation(education.map(edu => 
      edu.id === updatedEducation.id ? updatedEducation : edu
    ));
    setEditingEducation(null);
  };

  const handleDeleteEducation = (educationId) => {
    console.log('Deleting education:', educationId);
    setEducation(education.filter(edu => edu.id !== educationId));
    if (editingEducation && editingEducation.id === educationId) {
      setEditingEducation(null);
    }
  };

  // Generic handlers for projects
  const handleAddProject = (newProject) => {
    console.log('Adding project:', newProject);
    const projectWithId = { ...newProject, id: Date.now() };
    setProjects([...projects, projectWithId]);
  };

  const handleEditProject = (updatedProject) => {
    console.log('Updating project:', updatedProject);
    setProjects(projects.map(proj => 
      proj.id === updatedProject.id ? updatedProject : proj
    ));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    console.log('Deleting project:', projectId);
    setProjects(projects.filter(proj => proj.id !== projectId));
    if (editingProject && editingProject.id === projectId) {
      setEditingProject(null);
    }
  };

  // Handler for technical skills
  const handleUpdateTechnicalSkills = (updatedSkills) => {
    console.log('Updating technical skills:', updatedSkills);
    setTechnicalSkills(updatedSkills);
  };

  // Get current data based on active section
  const getCurrentData = () => {
    switch (activeSection) {
      case 'experiences': return experiences;
      case 'education': return education;
      case 'projects': return projects;
      case 'skills': return technicalSkills;
      default: return [];
    }
  };

  // Get current editing item
  const getCurrentEditingItem = () => {
    switch (activeSection) {
      case 'experiences': return editingExperience;
      case 'education': return editingEducation;
      case 'projects': return editingProject;
      default: return null;
    }
  };

  // Handle section change (reset editing states)
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setEditingExperience(null);
    setEditingEducation(null);
    setEditingProject(null);
  };

  // Render appropriate form based on section
  const renderForm = () => {
    const editingItem = getCurrentEditingItem();

    if (editingItem) {
      // Edit mode
      switch (activeSection) {
        case 'experiences':
          return (
            <EditExperiencePanel 
              experience={editingItem}
              onSave={handleEditExperience}
              onCancel={() => setEditingExperience(null)}
            />
          );
        case 'education':
          return (
            <EditEducationPanel 
              education={editingItem}
              onSave={handleEditEducation}
              onCancel={() => setEditingEducation(null)}
            />
          );
        case 'projects':
          return (
            <EditProjectPanel 
              project={editingItem}
              onSave={handleEditProject}
              onCancel={() => setEditingProject(null)}
            />
          );
        default:
          return null;
      }
    } else {
      // Add mode
      switch (activeSection) {
        case 'experiences':
          return <AddExperienceForm onSubmit={handleAddExperience} />;
        case 'education':
          return <AddEducationForm onSubmit={handleAddEducation} />;
        case 'projects':
          return <AddProjectForm onSubmit={handleAddProject} />;
        case 'skills':
          return <TechnicalSkillsForm skills={technicalSkills} onUpdate={handleUpdateTechnicalSkills} />;
        default:
          return null;
      }
    }
  };

  // Render list items based on section
  const renderListItems = () => {
    const currentData = getCurrentData();
    const editingItem = getCurrentEditingItem();

    if (activeSection === 'skills') {
      // Technical skills don't have a list, just the form
      return (
        <div className="text-center py-8 text-gray-500">
          Configure your technical skills using the form above.
        </div>
      );
    }

    if (!Array.isArray(currentData) || currentData.length === 0) {
      return (
        <p className="text-gray-500 text-center py-8">
          No {sections.find(s => s.id === activeSection)?.label.toLowerCase()} added yet. Add your first one above!
        </p>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentData.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              editingItem && editingItem.id === item.id
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex-1">
              {activeSection === 'experiences' && (
                <>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.organisation} • {item.location}</p>
                  <p className="text-sm text-gray-500">{item.startDate} - {item.endDate}</p>
                </>
              )}
              {activeSection === 'education' && (
                <>
                  <h3 className="font-medium text-gray-900">{item.degree} in {item.major}</h3>
                  <p className="text-sm text-gray-600">{item.university} • {item.location}</p>
                  <p className="text-sm text-gray-500">
                    {item.startDate} - {item.endDate}
                    {item.gpa && ` • GPA: ${item.gpa}`}
                  </p>
                </>
              )}
              {activeSection === 'projects' && (
                <>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Tools: {item.tools}</p>
                  {item.sourceCode && (
                    <a href={item.sourceCode} className="text-sm text-blue-600 hover:underline">
                      View Source Code
                    </a>
                  )}
                </>
              )}
              {item.descriptions && item.descriptions.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {item.descriptions.length} description{item.descriptions.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  switch (activeSection) {
                    case 'experiences': setEditingExperience(item); break;
                    case 'education': setEditingEducation(item); break;
                    case 'projects': setEditingProject(item); break;
                  }
                }}
                disabled={editingItem && editingItem.id === item.id}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  editingItem && editingItem.id === item.id
                    ? 'bg-green-200 text-green-800 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {editingItem && editingItem.id === item.id ? 'Editing' : 'Edit'}
              </button>
              <button
                onClick={() => {
                  switch (activeSection) {
                    case 'experiences': handleDeleteExperience(item.id); break;
                    case 'education': handleDeleteEducation(item.id); break;
                    case 'projects': handleDeleteProject(item.id); break;
                  }
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      
      {/* Section Tabs */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              activeSection === section.id
                ? 'bg-gray-700 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-600'
            }`}
          >
            <span className="mr-1">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>
      
      {/* Top: Add/Edit Form */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border">
        {getCurrentEditingItem() ? (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-green-800">
              Edit {sections.find(s => s.id === activeSection)?.label.slice(0, -1)}
            </h2>
            <span className="text-sm text-gray-500">
              Currently editing
            </span>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-fuchsia-300 mb-3">
            Add New {sections.find(s => s.id === activeSection)?.label.slice(0, -1) || 'Item'}
          </h2>
        )}
        {renderForm()}
      </div>

      {/* Bottom: List */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your {sections.find(s => s.id === activeSection)?.label}
        </h2>
        {renderListItems()}
      </div>
    </div>
  );
};

export default Manage;