import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, Sparkles, Check, HardDrive, Clock, Maximize, ZoomIn, ZoomOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LightboxModal({
  photo,
  onClose,
  onPrev,
  onNext,
  hasNext = true,
  hasPrev = true
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Reset zoom on photo change
  useEffect(() => {
    setZoomLevel(1);
  }, [photo?.id]);

  if (!photo) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Trigger celebratory confetti on high-res save
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#F3E5AB', '#FFFFFF']
      });

      const downloadTarget = photo.downloadUrl || photo.fullUrl;
      const response = await fetch(downloadTarget);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = photo.name || `Sri_Lakshmi_Sai_Teja_Wedding_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.warn('Download fallback trigger:', err);
      window.open(photo.downloadUrl || photo.fullUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sri Lakshmi & Sai Teja Wedding Photo',
          text: `Check out this wedding memory: ${photo.caption || photo.name}`,
          url: photo.fullUrl
        });
        return;
      } catch (e) {
        // User cancelled share
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(photo.fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  const toggleZoom = () => {
    setZoomLevel(prev => (prev === 1 ? 1.8 : 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0C]/95 backdrop-blur-2xl animate-fadeIn">
      
      {/* Top Header Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h3 className="text-sm sm:text-base font-serif-luxury font-bold text-[#FAF6EE] line-clamp-1">
              {photo.caption || photo.name}
            </h3>
            <p className="text-[11px] text-[#C5BBAA] flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              {new Date(photo.createdTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            onClick={toggleZoom}
            className="p-2.5 rounded-full bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer"
            title="Toggle Zoom"
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer relative"
            title="Share Photo"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copiedLink && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[#D4AF37] text-[#0A0A0C] font-bold px-2 py-0.5 rounded shadow">
                Link Copied!
              </span>
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#14141A] hover:bg-rose-950/50 text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer ml-2"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5 text-[#FAF6EE]" />
          </button>
        </div>
      </div>

      {/* Prev / Next Controls */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#14141A]/80 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-[#0A0A0C] border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xl"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#14141A]/80 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-[#0A0A0C] border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xl"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Central High-Res Photo Container */}
      <div className="relative max-w-6xl max-h-[80vh] w-full px-4 flex items-center justify-center overflow-auto">
        <img
          src={photo.fullUrl || photo.thumbnailUrl}
          alt={photo.caption || photo.name}
          onError={(e) => {
            if (e.target.src !== photo.thumbnailUrl && photo.thumbnailUrl) {
              e.target.src = photo.thumbnailUrl;
            }
          }}
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#D4AF37]/30 transition-transform duration-300"
        />
      </div>

      {/* Bottom Bar Controls & High-Res Save Button */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-5 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 text-xs text-[#C5BBAA]">
          {photo.dimensions && (
            <span className="flex items-center gap-1.5 bg-[#14141A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
              <Maximize className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{photo.dimensions}</span>
            </span>
          )}

          {photo.size && (
            <span className="flex items-center gap-1.5 bg-[#14141A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
              <HardDrive className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{photo.size} (Uncompressed)</span>
            </span>
          )}
        </div>

        {/* Primary Download High-Res Action Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] text-[#0A0A0C] font-extrabold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved High-Res to Device!</span>
            </>
          ) : isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
              <span>Fetching Full Quality JPEG...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Original High-Res (JPEG)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
