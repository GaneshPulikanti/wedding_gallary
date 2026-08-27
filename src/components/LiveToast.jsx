import React, { useEffect } from 'react';
import { Camera, ArrowUp, X, Sparkles } from 'lucide-react';

export function LiveToast({ count = 0, onDismiss, onScrollTop }) {
  if (count <= 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-down">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel-gold border border-[#D4AF37] shadow-2xl backdrop-blur-xl">
        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A0A0C] font-extrabold text-xs shadow-md">
          <Camera className="w-4 h-4 animate-bounce" />
        </div>

        <div>
          <p className="text-xs font-extrabold text-[#FAF6EE] flex items-center gap-1.5">
            <span>{count} New Photo{count > 1 ? 's' : ''} Just Arrived!</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </p>
          <p className="text-[10px] text-[#C5BBAA]">Tethered direct from camera</p>
        </div>

        <button
          onClick={onScrollTop}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0A0A0C] text-xs font-bold transition-all shadow cursor-pointer ml-2"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>View Top</span>
        </button>

        <button
          onClick={onDismiss}
          className="p-1 rounded-full text-[#C5BBAA] hover:text-[#FAF6EE] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
