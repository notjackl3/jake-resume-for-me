import { useState, useEffect } from 'react'
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
  const [fileUpload, setFileUpload] = useState();

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
            <Manage fileUpload={fileUpload} setFileUpload={setFileUpload} />
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
