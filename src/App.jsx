import React, { useState, useMemo } from 'react';
import { usePhotoStream } from './hooks/usePhotoStream';
import { Header } from './components/Header';
import { GalleryGrid } from './components/GalleryGrid';
import { LightboxModal } from './components/LightboxModal';
import { QRCodeModal } from './components/QRCodeModal';
import { LiveToast } from './components/LiveToast';
import { Slideshow } from './components/Slideshow';
import { Heart, Camera, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0C] text-[#F3E5AB] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl glass-panel border border-[#D4AF37]/30 shadow-2xl">
            <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-[#FAF6EE] mb-2">Sri Lakshmi & Sai Teja Wedding Gallery</h2>
            <p className="text-xs text-[#C5BBAA] mb-4">Connecting to live photo stream...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0A0A0C] font-bold text-xs hover:brightness-110 cursor-pointer shadow-md"
            >
              Refresh Gallery
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

function App() {
  // Read env config with direct fallbacks for seamless Vercel deployment
  const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || '1Y6P9FT0w-AbfHYjtz-YCc6srXvKxwG01';
  const apiKey = import.meta.env.VITE_GOOGLE_DEVELOPER_API_KEY || 'AIzaSyC55xpl74MEwotQ3QKFOFHcnxbCXywMrVQ';
  const pollInterval = parseInt(import.meta.env.VITE_POLL_INTERVAL_MS || '7000', 10);
  const forceMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  // Custom photo stream hook
  const {
    photos,
    isLoading,
    isSyncing,
    isMockMode,
    lastSyncTime,
    apiError,
    newPhotosCount,
    clearNewToast,
    refreshNow,
    triggerMockPhotoCapture
  } = usePhotoStream({
    folderId,
    apiKey,
    pollInterval,
    forceMock
  });

  // UI state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    photos.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [photos]);

  // Filtered photos calculation
  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
      const matchesQuery = searchQuery === '' ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [photos, activeFilter, searchQuery]);

  const selectedPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearNewToast();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#FAF6EE] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0A0A0C]">

      {/* Header Bar */}
      <Header
        photoCount={photos.length}
        isSyncing={isSyncing}
        isMockMode={isMockMode}
        lastSyncTime={lastSyncTime}
        onRefresh={refreshNow}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onStartSlideshow={() => setIsSlideshowOpen(true)}
        onSimulateShot={triggerMockPhotoCapture}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        categories={categories}
      />

      {/* Warning Notice Banner if credentials missing */}
      {isMockMode && (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') && (
        <div className="bg-[#14141A] border-b border-[#D4AF37]/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#F3E5AB]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>
                <strong>Demo Mode Active:</strong> Showing realistic high-res sample photos. Add your Google Drive API key & Folder ID to `.env` to stream live photos.
              </span>
            </div>
            <button
              onClick={triggerMockPhotoCapture}
              className="px-3 py-1 rounded bg-[#D4AF37] text-[#0A0A0C] font-bold text-[11px] hover:brightness-110 cursor-pointer shrink-0"
            >
              + Test Live Shot
            </button>
          </div>
        </div>
      )}

      {/* Main Content Gallery */}
      <main className="flex-1">
        {apiError && !isMockMode && (
          <div className="max-w-3xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">Google Drive Connection Warning</p>
                <p className="text-[11px] opacity-80">{apiError}. Displaying fallback gallery stream.</p>
              </div>
            </div>
          </div>
        )}

        <GalleryGrid
          photos={filteredPhotos}
          isLoading={isLoading}
          onPhotoClick={(photo, index) => setSelectedPhotoIndex(index)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-8 bg-[#0A0A0C] mt-12 text-center text-xs text-[#8C8270]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#F3E5AB]">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-serif-luxury font-bold">Celebrating Sri Lakshmi & Sai Teja</span>
          </div>

          <p className="flex items-center gap-1">
            <span>Automated Camera-to-Cloud Stream </span>
          </p>

          <p className="text-[11px] text-[#8C8270]">
            Photos updated live every {pollInterval / 1000}s
          </p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <LightboxModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhotoIndex(null)}
          onPrev={() => setSelectedPhotoIndex(prev => Math.max(0, prev - 1))}
          onNext={() => setSelectedPhotoIndex(prev => Math.min(filteredPhotos.length - 1, prev + 1))}
          hasPrev={selectedPhotoIndex > 0}
          hasNext={selectedPhotoIndex < filteredPhotos.length - 1}
        />
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <QRCodeModal onClose={() => setIsQrModalOpen(false)} />
      )}

      {/* Slideshow Modal */}
      {isSlideshowOpen && (
        <Slideshow
          photos={photos}
          onClose={() => setIsSlideshowOpen(false)}
        />
      )}

      {/* Real-time Live Toast */}
      <LiveToast
        count={newPhotosCount}
        onDismiss={clearNewToast}
        onScrollTop={handleScrollTop}
      />

    </div>
  );
}
