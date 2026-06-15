import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';

interface PDFReaderProps {
  url: string;
  title?: string;
}

export default function PDFReader({ url, title = 'Document' }: PDFReaderProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getRenderUrl = () => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  const renderUrl = getRenderUrl();
  const isDrive = url.includes('drive.google.com');

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-[#fffdf9] dark:bg-[#1a080c] rounded-[2px] overflow-hidden ${isFullscreen ? 'w-screen h-screen' : 'w-full h-[80vh] min-h-[600px]'}`}
    >
      {/* Glassmorphic Top Controller Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#120206]/80 backdrop-blur-md border-b-2 border-[#7C2D12] shrink-0 sticky top-0 z-10 shadow-sm">
        <h3 className="font-bold text-sm truncate max-w-[40%] flex items-center gap-2 text-[#4C0519] dark:text-[#f5ebe6]">
          {title}
        </h3>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[#2d16100a] dark:bg-[#f5ebe60a] rounded-md overflow-hidden mr-2">
            <button 
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="p-2 hover:bg-[#2d161011] dark:hover:bg-[#f5ebe611] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 opacity-70" />
            </button>
            <span className="text-xs font-mono w-12 text-center opacity-70 select-none pb-0.5">{zoom}%</span>
            <button 
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="p-2 hover:bg-[#2d161011] dark:hover:bg-[#f5ebe611] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 opacity-70" />
            </button>
          </div>
          
          <button 
            onClick={handleFullscreen}
            className="p-2 hover:bg-[#2d16100a] dark:hover:bg-[#f5ebe60a] rounded-md transition-colors"
            title="Toggle Full Screen"
          >
            <Maximize className="w-4 h-4 opacity-70" />
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-2 py-2 px-3 sm:px-4 ml-1 bg-[#4C0519] text-white rounded-md transition-colors hover:bg-[#70102a] active:scale-95"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden md:inline">Download PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Canvas area */}
      <div className="flex-grow overflow-auto relative bg-[#2d16100a] dark:bg-[#0a0204] flex justify-center p-0 sm:p-4 md:p-8">
        <div 
          className="transition-all duration-200 origin-top shadow-xl relative bg-white dark:bg-white"
          style={{ 
            width: '100%', 
            maxWidth: '1000px',
            transform: `scale(${zoom / 100})`, 
            height: `${(100 / zoom) * 100}%`,
            minHeight: '100%'
          }}
        >
          {isDrive ? (
             <iframe 
               src={renderUrl} 
               className="w-full h-full border-none absolute inset-0 bg-white"
               allow="autoplay"
               title={`Preview of ${title}`}
             ></iframe>
          ) : (
            <object
              data={url}
              type="application/pdf"
              className="w-full h-full border-none absolute inset-0 bg-white"
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-sm opacity-70 dark:text-[#2d1610]">
                <p className="mb-4 text-[#2d1610]">Your browser does not support inline PDFs.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#4C0519] text-white rounded-md font-bold text-xs uppercase tracking-widest">
                  Open Direct Link
                </a>
              </div>
            </object>
          )}
        </div>
      </div>
    </div>
  );
}
