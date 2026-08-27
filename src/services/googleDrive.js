/**
 * Google Drive API Service & Mock Generator
 * Handles real-time querying of Google Drive v3 API for tethered wedding photos.
 */

// Curated high-resolution wedding mock photos for instant demo mode
const MOCK_WEDDING_PHOTOS = [
  {
    id: 'mock-1',
    name: 'Sri Lakshmi & Sai Teja - First Dance.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=95',
    size: '8.4 MB',
    dimensions: '6000 x 4000',
    category: 'Reception',
    caption: 'Magical first dance under the fairy lights'
  },
  {
    id: 'mock-2',
    name: 'Ring Exchange Ceremony.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=95',
    size: '7.9 MB',
    dimensions: '6000 x 4000',
    category: 'Rituals',
    caption: 'The sacred ring exchange moment'
  },
  {
    id: 'mock-3',
    name: 'Bridal Portrait Srilu.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=95',
    size: '9.1 MB',
    dimensions: '6000 x 4000',
    category: 'Portraits',
    caption: 'Stunning bridal elegance'
  },
  {
    id: 'mock-4',
    name: 'Groom & Groomsmen Toast.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2400&q=95',
    size: '6.8 MB',
    dimensions: '6000 x 4000',
    category: 'Reception',
    caption: 'Raising a glass to love and laughter'
  },
  {
    id: 'mock-5',
    name: 'Wedding Mandap Floral Decor.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=95',
    size: '10.2 MB',
    dimensions: '6000 x 4000',
    category: 'Decor',
    caption: 'Royal gold and floral aesthetic decoration'
  },
  {
    id: 'mock-6',
    name: 'Champagne Tower Celebration.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2400&q=95',
    size: '8.1 MB',
    dimensions: '6000 x 4000',
    category: 'Party',
    caption: 'Pours of joy and champagne toast'
  },
  {
    id: 'mock-7',
    name: 'Royal Couple Sunset Walk.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=2400&q=95',
    size: '9.4 MB',
    dimensions: '6000 x 4000',
    category: 'Portraits',
    caption: 'Golden hour sunset with Sri Lakshmi & Sai Teja'
  },
  {
    id: 'mock-8',
    name: 'Sparkler Grand Exit.jpg',
    createdTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=2400&q=95',
    size: '8.7 MB',
    dimensions: '6000 x 4000',
    category: 'Party',
    caption: 'Grand sparkler send-off night celebration'
  }
];

// Extra dynamic mock items to simulate real-time tethering camera shots landing
const EXTRA_MOCK_STREAM = [
  {
    name: 'Live Tether - Laughs at Table 4.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2400&q=95',
    size: '7.8 MB',
    category: 'Guests'
  },
  {
    name: 'Live Tether - Wedding Cake Cutting.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=2400&q=95',
    size: '9.0 MB',
    category: 'Reception'
  },
  {
    name: 'Live Tether - Dancefloor Energy.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1000&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=2400&q=95',
    size: '8.3 MB',
    category: 'Party'
  }
];

let mockStreamIndex = 0;
let localMockState = [...MOCK_WEDDING_PHOTOS];

/**
 * Upscales Google Drive thumbnail to high resolution
 */

export function processDriveThumbnail(file) {
  if (!file) return '';
  if (typeof file === 'string') {
    return file.replace(/=s\d+/, '=w1200').replace(/=w\d+-h\d+/, '=w1200');
  }
  if (file.id) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;
  }
  if (file.thumbnailLink) {
    return file.thumbnailLink.replace(/=s\d+/, '=w1200').replace(/=w\d+-h\d+/, '=w1200');
  }
  return '';
}

/**
 * Constructs direct high-resolution download URL for Google Drive file
 */
export function getDriveDownloadUrl(file) {
  if (file.webContentLink) return file.webContentLink;
  if (file.id) return `https://drive.google.com/uc?export=download&id=${file.id}`;
  return file.fullUrl || '';
}

/**
 * Fetch photos from Google Drive API or Mock fallback
 */
export async function fetchDrivePhotos({ folderId, apiKey, useMock = false }) {
  const cleanFolderId = folderId ? folderId.split('?')[0].trim() : '';

  // If credentials are not configured, return empty photos list
  if (!apiKey || !cleanFolderId || apiKey === 'YOUR_GOOGLE_API_KEY_HERE' || cleanFolderId === 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE') {
    return {
      photos: [],
      isMock: false,
      totalCount: 0,
      error: 'Google Drive API key or Folder ID not configured.'
    };
  }

  try {
    const query = `'${cleanFolderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const fields = 'files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, createdTime, size, imageMediaMetadata)';
    const orderBy = 'createdTime desc';
    const pageSize = 100;

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=${encodeURIComponent(orderBy)}&pageSize=${pageSize}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.warn('Google Drive API Response Error:', errorData);
      return {
        photos: [],
        isMock: false,
        totalCount: 0,
        error: errorData?.error?.message || 'Drive API authorization or Folder ID issue'
      };
    }

    const data = await response.json();

    const formattedPhotos = (data.files || []).map((file) => {
      const sizeMB = file.size ? (parseInt(file.size, 10) / (1024 * 1024)).toFixed(1) + ' MB' : 'High-Res';
      const width = file.imageMediaMetadata?.width || '';
      const height = file.imageMediaMetadata?.height || '';
      const dimensions = width && height ? `${width} x ${height}` : 'Original';

      const cdnThumb = file.thumbnailLink
        ? file.thumbnailLink.replace(/=s\d+$/, '=s1000')
        : `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;

      const cdnFull = file.thumbnailLink
        ? file.thumbnailLink.replace(/=s\d+$/, '=s2500')
        : `https://drive.google.com/uc?export=view&id=${file.id}`;

      return {
        id: file.id,
        name: file.name,
        createdTime: file.createdTime,
        thumbnailUrl: cdnThumb,
        fullUrl: cdnFull,
        downloadUrl: getDriveDownloadUrl(file),
        size: sizeMB,
        dimensions: dimensions,
        category: 'Camera Tether',
        caption: file.name.replace(/\.[^/.]+$/, "")
      };
    });

    return {
      photos: formattedPhotos,
      isMock: false,
      totalCount: formattedPhotos.length
    };

  } catch (err) {
    console.error('Fetch Google Drive Error:', err);
    return {
      photos: localMockState,
      isMock: true,
      totalCount: localMockState.length,
      error: err.message
    };
  }
}

/**
 * Simulates tethered camera capturing a new photo live into local mock stream
 */
export function simulateNewCameraPhoto() {
  if (mockStreamIndex >= EXTRA_MOCK_STREAM.length) {
    mockStreamIndex = 0; // Loop back
  }

  const template = EXTRA_MOCK_STREAM[mockStreamIndex];
  mockStreamIndex++;

  const newPhoto = {
    id: `mock-live-${Date.now()}`,
    name: `${template.name}`,
    createdTime: new Date().toISOString(),
    thumbnailUrl: template.thumbnailUrl,
    fullUrl: template.fullUrl,
    size: template.size,
    dimensions: '6000 x 4000',
    category: template.category,
    caption: `Tethered Shot - ${template.name}`
  };

  localMockState = [newPhoto, ...localMockState];
  return newPhoto;
}
