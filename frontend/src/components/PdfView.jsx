import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import pdfUrl from "../assets/resume.pdf"

const PdfView = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

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
    );
}
export default PdfView;
