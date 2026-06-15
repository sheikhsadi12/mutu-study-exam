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

  const getDirectDownloadUrl = () => {
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?id=${match[1]}&export=download`;
      }
    }
    return url;
  };

  const getPreviewUrl = () => {
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  const directUrl = getDirectDownloadUrl();
  const previewUrl = getPreviewUrl();

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-[#fffdf9] dark:bg-[#1a080c] overflow-hidden ${isFullscreen ? 'w-screen h-screen' : 'w-full h-[700px] border border-[#2d161022] dark:border-[#f5ebe622] rounded-[2px]'}`}
    >
      {/* Glassmorphic Top Controller Bar */}
      <div className="flex items-center justify-between px-2 py-1.5 sm:px-4 sm:py-2 bg-white/80 dark:bg-[#120206]/80 backdrop-blur-md border-b border-[#7C2D12] shrink-0 sticky top-0 z-10 shadow-sm">
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
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 py-1.5 px-2 sm:px-3 ml-1 bg-[#4C0519] text-white rounded transition-colors hover:bg-[#70102a] active:scale-95"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Download</span>
          </a>
        </div>
      </div>

      {/* PDF Canvas area - CSS Cropping Hack */}
      <div className="relative w-full flex-grow overflow-hidden rounded-b-lg bg-[#fffdf9] dark:bg-[#1a080c]">
        <div 
          className="transition-all duration-200 origin-top shadow-xl relative w-full h-full"
          style={{ 
            transform: `scale(${zoom / 100})`, 
            width: `${(100 / zoom) * 100}%`,
            height: `${(100 / zoom) * 100}%`
          }}
        >
          <iframe
            src={previewUrl}
            className="absolute top-0 left-0 w-full border-none bg-[#fffdf9] dark:bg-[#1a080c]"
            style={{ height: 'calc(100% + 56px)', marginTop: '-56px' }}
            title={`Preview of ${title}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
