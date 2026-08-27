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
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-8 py-3 sm:py-4 bg-gradient-to-b from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent gap-2">
        
        {/* Title & Metadata */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#14141A] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37] sm:hidden cursor-pointer shrink-0"
            title="Back to Gallery"
          >
            <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
          </button>

          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 hidden sm:block" />
          
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-base font-serif-luxury font-bold text-[#FAF6EE] truncate">
              {photo.caption || photo.name}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#C5BBAA] flex items-center gap-1.5 truncate">
              <Clock className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span>{new Date(photo.createdTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </p>
          </div>
        </div>

        {/* Right Action Control Buttons (Zoom, Share, Close X) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Toggle */}
          <button
            onClick={toggleZoom}
            className="p-2 sm:p-2.5 rounded-full bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer"
            title="Toggle Zoom"
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4 text-[#D4AF37]" /> : <ZoomIn className="w-4 h-4 text-[#D4AF37]" />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-semibold transition-all cursor-pointer relative shadow-md"
            title="Share Photo"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#D4AF37]" />}
            <span className="text-xs font-bold text-[#F3E5AB]">Share</span>
            {copiedLink && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[#D4AF37] text-[#0A0A0C] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>

          {/* Close (X) Button */}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-rose-950/40 hover:bg-rose-900/60 text-[#F3E5AB] border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-lg ml-1"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5 text-rose-300" />
          </button>
        </div>
      </div>

      {/* Prev / Next Controls */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#14141A]/80 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-[#0A0A0C] border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xl"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#14141A]/80 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-[#0A0A0C] border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xl"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Central High-Res Photo / Video Container */}
      <div className="relative max-w-6xl max-h-[75vh] w-full px-2 sm:px-4 my-auto flex items-center justify-center overflow-auto">
        {photo.isVideo ? (
          <video
            src={photo.fullUrl || photo.downloadUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#D4AF37]/30"
          />
        ) : (
          <img
            src={photo.fullUrl || photo.thumbnailUrl}
            alt={photo.caption || photo.name}
            onError={(e) => {
              if (e.target.src !== photo.thumbnailUrl && photo.thumbnailUrl) {
                e.target.src = photo.thumbnailUrl;
              }
            }}
            style={{ transform: `scale(${zoomLevel})` }}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#D4AF37]/30 transition-transform duration-300"
          />
        )}
      </div>

      {/* Bottom Bar Controls & High-Res Save Button */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-3 sm:px-8 py-3 sm:py-5 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/95 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] text-[#C5BBAA]">
          {photo.dimensions && (
            <span className="flex items-center gap-1 bg-[#14141A] px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
              <Maximize className="w-3 h-3 text-[#D4AF37]" />
              <span>{photo.dimensions}</span>
            </span>
          )}

          {photo.size && (
            <span className="flex items-center gap-1 bg-[#14141A] px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
              <HardDrive className="w-3 h-3 text-[#D4AF37]" />
              <span>{photo.size}</span>
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          {/* Mobile Share Button */}
          <button
            onClick={handleShare}
            className="sm:hidden flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/40 font-bold text-xs shadow-lg cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Share</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] text-[#0A0A0C] font-extrabold text-xs sm:text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved High-Res!</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download High-Res</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
