import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export function Slideshow({ photos = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C] flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass-panel-gold flex items-center justify-center border border-[#D4AF37]">
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-serif-luxury font-bold text-[#FAF6EE]">Sri Lakshmi & Sai Teja</h2>
            <p className="text-xs text-[#D4AF37]">Live Wedding Presentation Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full glass-panel hover:border-[#D4AF37] text-[#F3E5AB] transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-full glass-panel hover:bg-rose-950/40 text-[#F3E5AB] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Photo Display */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {currentPhoto && (
          <img
            key={currentPhoto.id}
            src={currentPhoto.fullUrl || currentPhoto.thumbnailUrl}
            alt={currentPhoto.caption || currentPhoto.name}
            className="max-h-[78vh] w-auto max-w-full object-contain rounded-2xl border border-[#D4AF37]/30 shadow-2xl transition-all duration-1000 animate-fadeIn scale-100"
          />
        )}
      </div>

      {/* Footer Controls & Caption */}
      <div className="flex items-center justify-between z-20">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full glass-panel hover:border-[#D4AF37] text-[#F3E5AB] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center max-w-lg">
          <p className="text-sm font-semibold text-[#F3E5AB]">
            {currentPhoto?.caption || currentPhoto?.name}
          </p>
          <p className="text-xs text-[#8C8270] mt-1">
            Photo {currentIndex + 1} of {photos.length}
          </p>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-full glass-panel hover:border-[#D4AF37] text-[#F3E5AB] transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
