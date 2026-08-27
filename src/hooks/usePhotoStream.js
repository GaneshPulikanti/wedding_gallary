import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDrivePhotos, simulateNewCameraPhoto } from '../services/googleDrive';

export function usePhotoStream({ folderId, apiKey, pollInterval = 7000, forceMock = false }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [newPhotosCount, setNewPhotosCount] = useState(0);

  const photoIdsSetRef = useRef(new Set());

  // Core Sync Function
  const syncPhotos = useCallback(async (isInitial = false) => {
    if (!isInitial) setIsSyncing(true);

    try {
      const result = await fetchDrivePhotos({
        folderId,
        apiKey,
        useMock: forceMock
      });

      setIsMockMode(result.isMock);
      setApiError(result.error || null);

      if (result.photos && result.photos.length > 0) {
        if (isInitial || photoIdsSetRef.current.size === 0) {
          // Initial population
          setPhotos(result.photos);
          photoIdsSetRef.current = new Set(result.photos.map(p => p.id));
        } else {
          // Calculate diff for new incoming live tethered photos
          const incomingNewPhotos = result.photos.filter(p => !photoIdsSetRef.current.has(p.id));
          
          if (incomingNewPhotos.length > 0) {
            console.log(`📸 Received ${incomingNewPhotos.length} new tethered photo(s)!`);
            
            // Add new IDs to set
            incomingNewPhotos.forEach(p => photoIdsSetRef.current.add(p.id));
            
            // Prepend new photos to top of state
            setPhotos(prev => [...incomingNewPhotos, ...prev]);
            setNewPhotosCount(prev => prev + incomingNewPhotos.length);
          }
        }
      }

      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Photo Stream Sync Error:', err);
      setApiError(err.message);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [folderId, apiKey, forceMock]);

  // Initial fetch
  useEffect(() => {
    syncPhotos(true);
  }, [syncPhotos]);

  // Auto Polling Timer
  useEffect(() => {
    if (!pollInterval || pollInterval <= 0) return;

    const intervalId = setInterval(() => {
      syncPhotos(false);
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [pollInterval, syncPhotos]);

  // Manual Trigger to simulate a new DSLR photo landing (Demo Mode helper)
  const triggerMockPhotoCapture = useCallback(() => {
    const newPhoto = simulateNewCameraPhoto();
    photoIdsSetRef.current.add(newPhoto.id);
    setPhotos(prev => [newPhoto, ...prev]);
    setNewPhotosCount(prev => prev + 1);
    setIsMockMode(true);
    return newPhoto;
  }, []);

  const clearNewToast = useCallback(() => {
    setNewPhotosCount(0);
  }, []);

  return {
    photos,
    isLoading,
    isSyncing,
    isMockMode,
    lastSyncTime,
    apiError,
    newPhotosCount,
    clearNewToast,
    refreshNow: () => syncPhotos(false),
    triggerMockPhotoCapture
  };
}
