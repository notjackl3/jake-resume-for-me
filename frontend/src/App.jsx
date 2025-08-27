import { useState, useEffect } from 'react'
import axios from "axios"
import reactLogo from './assets/react.svg'
import Manage from "./components/Manage.jsx"
import './index.css'
import './App.css'

import { pdfjs } from 'react-pdf';
import PdfView from './components/PdfView.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {
  const VITE_API_URL = import.meta.env.VITE_API_URL
  const EDUCATION_ENDPOINT = `${VITE_API_URL}/education/`
  const EXPERIENCES_ENDPOINT = `${VITE_API_URL}/experiences/`
  const PROJECTS_ENDPOINT = `${VITE_API_URL}/projects/`
  const SKILLS_ENDPOINT = `${VITE_API_URL}/skills/`

  const [educationData, setEducationData] = useState([]);
  const [experiencesData, setExperiencesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  async function fetchData(dataType) {
    let response = null;
    let fetchedData = null;

    try {
      switch (dataType) {
        case "education":
          response = await axios.get(EDUCATION_ENDPOINT);
          fetchedData = response.data;
          setEducationData(fetchedData);
          break;
        case "experiences":
          response = await axios.get(EXPERIENCES_ENDPOINT);
          fetchedData = response.data;
          setExperiencesData(fetchedData);
          break;
        case "projects":
          response = await axios.get(PROJECTS_ENDPOINT);
          fetchedData = response.data;
          setProjectsData(fetchedData);
          break;
        case "skills":
          response = await axios.get(SKILLS_ENDPOINT);
          fetchedData = response.data;
          setSkillsData(fetchedData);
          break;
        default:
          console.log("Invalid data type provided.");
          return;
      }
    } catch (error) {
      console.error(`Failed to fetch ${dataType} data:`, error);
    }
  }

  useEffect(() => {
    async function fetchAllData() {
        await fetchData("education");
        await fetchData("experiences");
        await fetchData("projects");
        await fetchData("skills");
    }
    fetchAllData();
  }, []);


  useEffect(() => {
    console.log("Education Data:", educationData);
  }, [educationData])
  useEffect(() => {
    console.log("Experiences Data:", experiencesData);
  }, [experiencesData])
  useEffect(() => {
    console.log("Projects Data:", projectsData);
  }, [projectsData])
  useEffect(() => {
    console.log("Skills Data:", skillsData);
  }, [skillsData])

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <h1 className="heading-main">A few <span className="text-gradient">clicks</span> away<br />from a neat <span className="text-gradient">Resume</span></h1>
        </header>

        {/* Main content area with two-panel layout */}
        <div className="flex flex-col w-full h-auto lg:flex-row gap-8 mt-8">
          <div className="flex-1 min-w-0 lg:min-w-96 p-4 bg-gray-900 rounded-xl shadow-lg">
            <Manage educationData={educationData} experiencesData={experiencesData} projectsData={projectsData} skillsData={skillsData}/>
          </div>

          <div className="flex-1 min-w-0 lg:min-w-96 p-4 bg-gray-900 rounded-xl shadow-lg flex flex-col items-center">
            <PdfView />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
