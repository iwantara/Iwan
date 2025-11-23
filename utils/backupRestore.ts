import { Folder, SavedItem, ThemeName } from '../types';

export interface BackupData {
  version: number;
  timestamp: number;
  folders: Folder[];
  savedItems: SavedItem[];
  currentTheme: ThemeName;
}

/**
 * Validasi struktur Folder
 */
function isValidFolder(folder: any): folder is Folder {
  return (
    typeof folder === 'object' &&
    folder !== null &&
    typeof folder.id === 'string' &&
    typeof folder.name === 'string' &&
    typeof folder.createdAt === 'number' &&
    folder.id.length > 0 &&
    folder.name.length > 0
  );
}

/**
 * Validasi struktur SavedItem
 */
function isValidSavedItem(item: any): item is SavedItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.folderId === 'string' &&
    typeof item.interestName === 'string' &&
    typeof item.timestamp === 'number' &&
    item.id.length > 0 &&
    item.folderId.length > 0 &&
    item.interestName.length > 0
  );
}

/**
 * Validasi backup file yang akan di-restore
 */
export function validateBackupData(data: any): { valid: boolean; error?: string; data?: BackupData } {
  // Cek struktur dasar
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Struktur file tidak valid (bukan object)' };
  }

  // Cek version
  if (data.version !== 1) {
    return { valid: false, error: `Versi backup tidak kompatibel (versi ${data.version})` };
  }

  // Cek timestamp
  if (typeof data.timestamp !== 'number' || data.timestamp <= 0) {
    return { valid: false, error: 'Timestamp backup tidak valid' };
  }

  // Validasi folders array
  if (!Array.isArray(data.folders)) {
    return { valid: false, error: 'Data folders bukan array' };
  }

  // Validasi setiap folder
  for (let i = 0; i < data.folders.length; i++) {
    if (!isValidFolder(data.folders[i])) {
      return { valid: false, error: `Folder ke-${i + 1} memiliki struktur yang tidak valid` };
    }
  }

  // Validasi savedItems array
  if (!Array.isArray(data.savedItems)) {
    return { valid: false, error: 'Data savedItems bukan array' };
  }

  // Validasi setiap savedItem
  for (let i = 0; i < data.savedItems.length; i++) {
    if (!isValidSavedItem(data.savedItems[i])) {
      return { valid: false, error: `Item ke-${i + 1} memiliki struktur yang tidak valid` };
    }
  }

  // Validasi currentTheme (opsional)
  const validThemes = ['cosmic', 'ocean', 'nature', 'sunset', 'monochrome', 'aurora', 'mint', 'cherry', 'sunshine', 'royal'];
  if (data.currentTheme && !validThemes.includes(data.currentTheme)) {
    return { valid: false, error: `Tema "${data.currentTheme}" tidak dikenali` };
  }

  return {
    valid: true,
    data: {
      version: data.version,
      timestamp: data.timestamp,
      folders: data.folders,
      savedItems: data.savedItems,
      currentTheme: data.currentTheme || 'monochrome'
    }
  };
}

/**
 * Format backup data untuk export
 */
export function createBackupData(
  folders: Folder[],
  savedItems: SavedItem[],
  currentTheme: ThemeName
): BackupData {
  return {
    version: 1,
    timestamp: Date.now(),
    folders,
    savedItems,
    currentTheme
  };
}

/**
 * Generate filename untuk backup
 */
export function generateBackupFilename(timestamp: number = Date.now()): string {
  const date = new Date(timestamp).toISOString().slice(0, 10);
  const time = new Date(timestamp).toISOString().slice(11, 19).replace(/:/g, '-');
  return `koleksi-interest-${date}-${time}.json`;
}

/**
 * Format tanggal backup untuk ditampilkan
 */
export function formatBackupDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
