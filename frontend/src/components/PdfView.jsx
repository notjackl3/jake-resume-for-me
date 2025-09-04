import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import pdfUrl from "../assets/resume.pdf"
import axios from "axios"

const VITE_URL = import.meta.env.VITE_URL
const CREATE_RESUME_ENDPOINT = `${VITE_URL}/create-resume/`

const PdfView = ({ educationData, experiencesData, projectsData, skillsData, refreshData }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const [personalData, setpersonalData] = useState({
        name: '',
        number: '',
        email: '',
        portfolio: '',
        linkedin: '',
        github: '',
    });

    // Handle regular input changes
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setpersonalData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    const createResume = async () => {
        await refreshData();

        const personal_info = personalData
        const education = educationData
        const experiences = experiencesData
        const projects = projectsData
        const skills = skillsData

        const body = {personal_info, education, experiences, projects, skills}
        const config = {
        headers: {
            'Content-Type': 'application/json'
        }
        };

        const response = await axios.post(CREATE_RESUME_ENDPOINT, body, config)
        console.log(response)
        return response.data
    }

    useEffect(() => {
        // we only update the width after all the DOM elements have rendered, useEffect is called after all DOM elements appear
        const updateWidth = () => {
            // ref is like a pointer to a DOM element, which in this case is our wrapper
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div ref={containerRef} className="w-full bg-fuchsia-200 rounded-xl overflow-hidden">
                <Document
                    file={pdfUrl} 
                    onLoadSuccess={({ numPages }) => {setNumPages(numPages);}}
                >
                    <Page 
                        pageNumber={pageNumber} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        width={containerWidth > 0 ? containerWidth : undefined}
                    />
                </Document>
            </div>
            <div className="w-full flex flex-row gap-3">
                <button type="button" onClick={createResume} className="w-full bg-fuchsia-300 text-white py-2 px-4 rounded-md hover:bg-fuchsia-500 transition-colors font-medium">
                    Create Resume
                </button>
                <button type="button" className="w-full bg-fuchsia-300 text-white py-2 px-4 rounded-md hover:bg-fuchsia-500 transition-colors font-medium">
                    Download PDF
                </button>
            </div>
            <div className="w-full flex flex-col gap-3">
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        Name 
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={personalData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        Phone number
                    </label>
                    <input
                        type="text"
                        name="number"
                        value={personalData.number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={personalData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        Portfolio
                    </label>
                    <input
                        type="text"
                        name="portfolio"
                        value={personalData.portfolio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        LinkedIn
                    </label>
                    <input
                        type="text"
                        name="linkedin"
                        value={personalData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-label-primary mb-1">
                        Github
                    </label>
                    <input
                        type="text"
                        name="github"
                        value={personalData.github}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-label-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
export default PdfView;
