// AddExperienceForm.jsx
import { useState } from 'react';

const AddExperienceForm = ({ onSubmit }) => {
	const [isCurrentJob, setIsCurrentJob] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organisation: '',
    location: '',
    start_date: '',
    end_date: '',
    descriptions: [''] // Array of description fields
  });

  // all of the fields will call this method, they will change the formData state accordingly
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (index, value) => {
    // create a copy of the current description then mutate it
    const newDescriptions = [...formData.descriptions];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      descriptions: newDescriptions
    }));
  };

  const addDescriptionField = () => {
    // the parameter prev is the previous state of the object, then you just update with the new description, setting it as blank
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, '']
    }));
  };

  const removeDescriptionField = (index) => {
    if (formData.descriptions.length > 1) {
    	// newDescriptions will be the ones that does not have the index of the one being deleted
      const newDescriptions = formData.descriptions.filter((element, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        descriptions: newDescriptions
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.title || !formData.organisation) {
      alert('Please fill in title and organisation');
      return;
    }

    // filter out empty descriptions so it does not send empty spaces
    const cleanedData = {
      ...formData,
      descriptions: formData.descriptions.filter(desc => desc.trim() !== '')
    };

    // this obSubmit function is taken from the parameter, so the child's job is to clean up the data, clear up the form, and then send back the data to the parent, and the parent will take care of the logic like sending data to the server
    onSubmit(cleanedData);
    
    setFormData({
      title: '',
      organisation: '',
      location: '',
      start_date: '',
      end_date: '',
      descriptions: ['']
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* title */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Job Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      {/* organisation */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Organisation *
        </label>
        <input
          type="text"
          name="organisation"
          value={formData.organisation}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
          placeholder="e.g. Google"
          required
        />
      </div>

      {/* location */}
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
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      {/* date Range */}
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
					<div className="flex items-center gap-2 mt-1 text-label-primary">
						<input 
							type="checkbox" 
							checked={isCurrentJob}
							onChange={(e) => setIsCurrentJob(e.target.checked)}
						/>
						<label>Current</label>
					</div>
        </div>
      </div>

      {/* description Fields */}
      <div>
        <label className="block text-sm font-medium text-label-primary mb-1">
          Job Descriptions
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

      {/* submit Button */}
      <button
        type="submit"
        className="w-full bg-emerald-400 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors font-medium"
      >
        Add Experience
      </button>
    </form>
  );
};

export default AddExperienceForm;
