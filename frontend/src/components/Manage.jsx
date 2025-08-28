// Manage.jsx - Multi-section resume manager
import { useState, useEffect } from 'react';
import axios from "axios"
import AddExperienceForm from './AddExperienceForm';
import EditExperiencePanel from './EditExperiencePanel';
import AddEducationForm from './AddEducationForm';
// import EditEducationPanel from './EditEducationPanel';
import AddProjectForm from './AddProjectForm';
// import EditProjectPanel from './EditProjectPanel';
import SkillsForm from './SkillsForm';


const VITE_API_URL = import.meta.env.VITE_API_URL
const EDUCATION_ENDPOINT = `${VITE_API_URL}/education/`
const EXPERIENCES_ENDPOINT = `${VITE_API_URL}/experiences/`


const Manage = ({ educationData, experiencesData, projectsData, skillsData }) => {
  // track active section
  const [activeSection, setActiveSection] = useState('experiences');
  
  // track all data for different sections - Initialize with the props data
  const [experiences, setExperiences] = useState(experiencesData || []);
  const [education, setEducation] = useState(educationData || []);
  const [projects, setProjects] = useState(projectsData || []);
  const [skills, setSkills] = useState(skillsData || []);

  // Only update when props actually change
  useEffect(() => {
    console.log("Props received:", { educationData, experiencesData, projectsData, skillsData });
    
    if (educationData !== undefined) {
      setEducation(educationData);
    }
    if (experiencesData !== undefined) {
      console.log("Setting experiences:", experiencesData);
      setExperiences(experiencesData);
    }
    if (projectsData !== undefined) {
      setProjects(projectsData);
    }
    if (skillsData !== undefined) {
      setSkills(skillsData);
    }
  }, [educationData, experiencesData, projectsData, skillsData]);

  // Add another useEffect to debug experiences state
  useEffect(() => {
    console.log("Experiences state updated:", experiences);
  }, [experiences]);
  
  // track which item is being edited for each section
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // section configuration
  const sections = [
    { id: 'experiences', label: 'Experiences'},
    { id: 'education', label: 'Education'},
    { id: 'projects', label: 'Projects'},
    { id: 'skills', label: 'Skills'}
  ];

  const postExperience = async (exp) => {
    const title = exp.title 
    const organisation = exp.organisation 
    const location = exp.location 
    const start_date = exp.start_date
    const end_date = exp.end_date
    const descriptions = exp.descriptions.map(desc => ({"content": desc}));

    const body = {title, organisation, location, start_date, end_date, descriptions}
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log("body:", body)

    const response = await axios.post(EXPERIENCES_ENDPOINT, body, config)
    console.log(response)
    return response.data
  }

  const handleAddExperience = async (newExperience) => {
    // to update the frontend
    const experienceWithId = { ...newExperience, id: Date.now() };
    const updatedExperiences = [...experiences, experienceWithId];
    setExperiences(updatedExperiences);

    //to update the backend
    const newData = await postExperience(newExperience);
    // console.log("New experience:", newExperience);
    // console.log("Added experience, current experiences:", updatedExperiences);
  };

  const handleEditExperience = (updatedExperience) => {
    console.log('Updating experience:', updatedExperience);
    const updatedExperiences = experiences.map(exp => 
      exp.id === updatedExperience.id ? updatedExperience : exp
    );
    setExperiences(updatedExperiences);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (experienceId) => {
    console.log('Deleting experience:', experienceId);
    const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
    setExperiences(updatedExperiences);
    if (editingExperience && editingExperience.id === experienceId) {
      setEditingExperience(null);
    }
  };


  const postEducation = async (edu) => {
    const school = edu.school
    const major = edu.major
    const location = edu.location
    const start_date = edu.start_date
    const end_date = edu.end_date
    const gpa = edu.gpa

    const body = {school, major, location, start_date, end_date, gpa}
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log("body:", body)

    const response = await axios.post(EDUCATION_ENDPOINT, body, config)
    console.log(response)
    return response.data
  }

  const handleAddEducation = async (newEducation) => {
    console.log('Adding education:', newEducation);
    const educationWithId = { ...newEducation, id: Date.now() };
    setEducation([...education, educationWithId]);

    const newData = await postEducation(newEducation);
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

  const postProject = async (proj) => {
    const title = proj.school
    const major = edu.major
    const location = edu.location
    const start_date = edu.start_date
    const end_date = edu.end_date
    const gpa = edu.gpa

    const body = {school, major, location, start_date, end_date, gpa}
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log("body:", body)

    const response = await axios.post(EDUCATION_ENDPOINT, body, config)
    console.log(response)
    return response.data
  }

  const handleAddProject = async (newProject) => {
    console.log('Adding project:', newProject);
    const projectWithId = { ...newProject, id: Date.now() };
    setProjects([...projects, projectWithId]);

    const newData = await postProject(newProject);
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
  const handleUpdateSkills = (updatedSkills) => {
    console.log('Updating technical skills:', updatedSkills);
    setSkills(updatedSkills);
  };

  // Get current data based on active section
  const getCurrentData = () => {
    switch (activeSection) {
      case 'experiences': return experiences;
      case 'education': return education;
      case 'projects': return projects;
      case 'skills': return skills;
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
          // here after the child cleans up the data then you call handleAllExperience() for the backend logic
          return <AddExperienceForm onSubmit={handleAddExperience} />;
        case 'education':
          return <AddEducationForm onSubmit={handleAddEducation} />;
        case 'projects':
          return <AddProjectForm onSubmit={handleAddProject} />;
        case 'skills':
          return <SkillsForm skills={skills} onUpdate={handleUpdateSkills} />;
        default:
          return null;
      }
    }
  };

  // Render list items based on section
  const renderListItems = () => {
    const currentData = getCurrentData();
    const editingItem = getCurrentEditingItem();

    console.log("Rendering list items for section:", activeSection);
    console.log("Current data:", currentData);

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
        <div className="text-center py-8">
          <p className="text-gray-500">
            No {sections.find(s => s.id === activeSection)?.label.toLowerCase()} added yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Add your first one above! (Current data: {JSON.stringify(currentData)})
          </p>
        </div>
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
                  <p className="text-sm text-gray-500">{item.start_date} - {item.end_date}</p>
                </>
              )}
              {activeSection === 'education' && (
                <>
                  <h3 className="font-medium text-gray-900">{item.major}</h3>
                  <p className="text-sm text-gray-600">{item.school} • {item.location}</p>
                  <p className="text-sm text-gray-500">
                    {item.start_date} - {item.end_date}
                    {item.gpa && ` • GPA: ${item.gpa}`}
                  </p>
                </>
              )}
              {activeSection === 'projects' && (
                <>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
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
      
      {/* Debug Info */}
      <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
        Debug: Active: {activeSection} | Experiences: {experiences?.length || 0} items | Props: {experiencesData?.length || 0}
      </div>

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
            {section.label}
          </button>
        ))}
      </div>
      
      {/* Top: Add/Edit Form */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border">
        {getCurrentEditingItem() ? (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-green-800">
              Edit {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <span className="text-sm text-gray-500">
              Currently editing
            </span>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-fuchsia-300 mb-3">
            Add New {sections.find(s => s.id === activeSection)?.label || 'Item'}
          </h2>
        )}
        {renderForm()}
      </div>

      {/* Bottom: List */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border flex-1">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">
          Your {sections.find(s => s.id === activeSection)?.label}
        </h2>
        {renderListItems()}
      </div>
    </div>
  );
};

export default Manage;