import React, { useState } from 'react';
import { Download, Maximize2, Sparkles, Clock, HardDrive, Check } from 'lucide-react';

export function GalleryGrid({ photos = [], onPhotoClick, isLoading = false }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleDownload = async (e, photo) => {
    e.stopPropagation(); // Prevent opening lightbox
    setDownloadingId(photo.id);

    try {
      // Trigger file download helper
      const response = await fetch(photo.fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = photo.name || `Sri_Lakshmi_Sai_Teja_Wedding_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccessId(photo.id);
      setTimeout(() => setDownloadSuccessId(null), 2500);
    } catch (err) {
      console.warn('Direct blob download fallback to window location:', err);
      // Fallback open target in new tab
      window.open(photo.fullUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading && photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="masonry-grid">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="masonry-item rounded-2xl bg-[#14141A] border border-[#D4AF37]/10 overflow-hidden h-72 animate-pulse flex flex-col justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1D1D26]" />
                <div className="w-24 h-4 rounded bg-[#1D1D26]" />
              </div>
              <div className="w-full h-8 rounded bg-[#1D1D26]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && photos.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full glass-panel-gold flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]">
          <Sparkles className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h3 className="text-xl font-bold font-serif-luxury text-[#FAF6EE]">No Photos Available Yet</h3>
        <p className="text-sm text-[#C5BBAA] mt-2 leading-relaxed">
          Tethered camera is connected and listening. As soon as the photographer shoots a photo, it will stream live onto this gallery!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="masonry-grid">
        {photos.map((photo, index) => {
          const isLoaded = loadedImages[photo.id];
          const isNew = index === 0; // Highlight top/latest photo

          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(photo, index)}
              className={`masonry-item group relative rounded-2xl overflow-hidden glass-panel border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-1 ${
                isNew ? 'animate-slide-down' : ''
              }`}
            >
              {/* Image Container with Skeleton Loader */}
              <div className="relative w-full bg-[#14141A] min-h-[220px]">
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#14141A] via-[#1D1D26] to-[#14141A] animate-pulse flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]/40 animate-spin" />
                  </div>
                )}
                
                <img
                  src={photo.thumbnailUrl || photo.fullUrl}
                  alt={photo.caption || photo.name}
                  onLoad={() => handleImageLoad(photo.id)}
                  onError={(e) => {
                    if (e.target.src !== photo.fullUrl && photo.fullUrl) {
                      e.target.src = photo.fullUrl;
                    }
                    handleImageLoad(photo.id);
                  }}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-100"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-95 transition-opacity">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-[#0A0A0C]/85 text-[#F3E5AB] backdrop-blur-md border border-[#D4AF37]/30 flex items-center gap-1 shadow-md">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {new Date(photo.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {photo.size && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#0A0A0C]/85 text-[#C5BBAA] backdrop-blur-md border border-[#D4AF37]/20 flex items-center gap-1 shadow-md">
                      <HardDrive className="w-3 h-3 text-[#D4AF37]" />
                      {photo.size}
                    </span>
                  )}
                </div>

                {/* Bottom Action Overlay - Anchored at bottom so main photo is 100% clear & bright */}
                <div className="absolute bottom-0 left-0 right-0 pt-12 pb-3.5 px-3.5 sm:px-4 bg-gradient-to-t from-[#0A0A0C]/95 via-[#0A0A0C]/60 to-transparent transition-opacity duration-300 flex flex-col justify-end">
                  <div>
                    <p className="text-xs font-semibold text-[#F3E5AB] line-clamp-1 mb-2.5 drop-shadow-md">
                      {photo.caption || photo.name}
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Save High-Res Direct Button */}
                      <button
                        onClick={(e) => handleDownload(e, photo)}
                        disabled={downloadingId === photo.id}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0A0A0C] font-bold text-xs transition-all shadow-lg active:scale-95 cursor-pointer"
                      >
                        {downloadSuccessId === photo.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : downloadingId === photo.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Save High-Res</span>
                          </>
                        )}
                      </button>

                      {/* Expand Button */}
                      <button
                        onClick={() => onPhotoClick(photo, index)}
                        className="p-2 rounded-xl bg-[#14141A]/90 hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/40 transition-colors shadow-lg cursor-pointer"
                        title="View Full Resolution Lightbox"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
