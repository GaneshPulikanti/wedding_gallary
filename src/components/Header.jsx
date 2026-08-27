import React from 'react';
import { QrCode, RefreshCw, Play, Sparkles, Radio, Heart } from 'lucide-react';

export function Header({
  photoCount = 0,
  isSyncing = false,
  isMockMode = false,
  lastSyncTime = null,
  onRefresh,
  onOpenQrModal,
  onStartSlideshow,
  onSimulateShot,
  activeFilter,
  setActiveFilter,
  categories = []
}) {
  const formatTime = (date) => {
    if (!date) return 'Initializing...';
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return 'Initializing...';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Initializing...';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[#D4AF37]/20 shadow-xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          
          {/* Left Column: Logo + Couple Title & Subtitle */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-panel-gold flex items-center justify-center border border-[#D4AF37] shadow-sm shrink-0">
              <Heart className="w-4.5 h-4.5 text-[#D4AF37] fill-[#D4AF37]/30" />
              <Sparkles className="w-2.5 h-2.5 text-[#FFF6D6] absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-extrabold tracking-wider gold-gradient-text leading-tight whitespace-nowrap">
                SRI LAKSHMI & SAI TEJA
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-[#C5BBAA] mt-0.5">
                <span>The Grand Wedding</span>
                <span className="text-[#D4AF37]">•</span>
                <span className="text-[#8C8270]">{photoCount} Photos</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Status Badge pushed to top, 3 Action Buttons below */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            
            {/* Top Right: Live Status Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold glass-panel border border-[#D4AF37]/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isMockMode ? 'bg-[#D4AF37]' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isMockMode ? 'bg-[#D4AF37]' : 'bg-emerald-500'}`}></span>
              </span>
              <span className={isMockMode ? 'text-[#F3E5AB]' : 'text-emerald-400'}>
                {isMockMode ? 'DEMO STREAM' : 'LIVE TETHERED'}
              </span>
            </div>

            {/* Bottom Right: 3 Action Buttons (Venue QR, Slideshow, Sync) side-by-side */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {isMockMode && (
                <button
                  onClick={onSimulateShot}
                  title="Simulate Shot"
                  className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3E5AB] border border-[#D4AF37]/40 text-[10px] font-semibold hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Radio className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                  <span className="hidden xs:inline">+ Shot</span>
                </button>
              )}

              {/* Venue QR */}
              <button
                onClick={onOpenQrModal}
                title="Venue QR Code"
                className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 text-[10px] font-medium transition-all hover:border-[#D4AF37] cursor-pointer shadow-sm"
              >
                <QrCode className="w-3 h-3 text-[#D4AF37]" />
                <span className="hidden sm:inline">QR</span>
              </button>

              {/* Slideshow */}
              <button
                onClick={onStartSlideshow}
                title="Slideshow Mode"
                className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 text-[10px] font-medium transition-all hover:border-[#D4AF37] cursor-pointer shadow-sm"
              >
                <Play className="w-3 h-3 text-[#D4AF37]" />
                <span className="hidden sm:inline">Slideshow</span>
              </button>

              {/* Sync */}
              <button
                onClick={onRefresh}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A0A0C] font-bold text-[10px] transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '...' : 'Sync'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
