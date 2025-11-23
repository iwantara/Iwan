import { Folder, SavedItem, ThemeName } from '../types';

export interface BackupData {
  version: number;
  timestamp: number;
  folders: Folder[];
  savedItems: SavedItem[];
  currentTheme: ThemeName;
}

/**
 * Validasi dan Sanitasi Data Backup
 * Fungsi ini tidak hanya mengecek validitas, tapi mencoba memperbaiki data yang kurang lengkap (legacy data).
 */
export function validateBackupData(data: any): { valid: boolean; error?: string; data?: BackupData } {
  try {
    // 1. Cek struktur dasar
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'File tidak valid atau kosong' };
    }

    // 2. Sanitasi Folders
    // Jika data folder rusak atau tidak ada, kita buat array kosong
    let sanitizedFolders: Folder[] = [];
    if (Array.isArray(data.folders)) {
      sanitizedFolders = data.folders
        .filter((f: any) => f && typeof f.id === 'string' && typeof f.name === 'string') // Filter item sampah
        .map((f: any) => ({
          id: f.id,
          name: f.name,
          createdAt: typeof f.createdAt === 'number' ? f.createdAt : Date.now() // Patch createdAt jika hilang
        }));
    }

    // 3. Sanitasi SavedItems
    let sanitizedItems: SavedItem[] = [];
    if (Array.isArray(data.savedItems)) {
      sanitizedItems = data.savedItems
        .filter((i: any) => i && typeof i.id === 'string' && typeof i.interestName === 'string')
        .map((i: any) => {
          // Tentukan folderId. Jika tidak ada (data lama), gunakan folder pertama yang tersedia atau ID sementara
          const targetFolderId = (typeof i.folderId === 'string' && i.folderId.length > 0)
            ? i.folderId 
            : (sanitizedFolders.length > 0 ? sanitizedFolders[0].id : 'restored_default');

          return {
            id: i.id,
            interestName: i.interestName,
            folderId: targetFolderId,
            timestamp: typeof i.timestamp === 'number' ? i.timestamp : Date.now(),
            funFact: typeof i.funFact === 'string' ? i.funFact : undefined
          };
        });
    }

    // 4. Integrity Check: Pastikan item punya rumah (Folder)
    // Jika ada items tapi tidak ada folder, buat folder darurat
    if (sanitizedItems.length > 0 && sanitizedFolders.length === 0) {
      const recoveryFolder: Folder = {
        id: 'restored_default',
        name: 'Pulihan Backup',
        createdAt: Date.now()
      };
      sanitizedFolders.push(recoveryFolder);
      // Update item yang orphaned ke folder ini
      sanitizedItems = sanitizedItems.map(i => 
        i.folderId === 'restored_default' ? i : { ...i, folderId: recoveryFolder.id }
      );
    } 
    // Jika item menunjuk ke folder yang tidak ada di list folder
    else if (sanitizedFolders.length > 0) {
       const folderIds = new Set(sanitizedFolders.map(f => f.id));
       sanitizedItems = sanitizedItems.map(i => {
         if (!folderIds.has(i.folderId)) {
           return { ...i, folderId: sanitizedFolders[0].id }; // Pindahkan ke folder pertama
         }
         return i;
       });
    }

    // 5. Sanitasi Theme
    const validThemes = ['cosmic', 'ocean', 'nature', 'sunset', 'monochrome', 'aurora', 'mint', 'cherry', 'sunshine', 'royal'];
    let theme: ThemeName = 'monochrome';
    if (data.currentTheme && validThemes.includes(data.currentTheme)) {
      theme = data.currentTheme as ThemeName;
    }

    return {
      valid: true,
      data: {
        version: 1,
        timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
        folders: sanitizedFolders,
        savedItems: sanitizedItems,
        currentTheme: theme
      }
    };

  } catch (error) {
    return { valid: false, error: `Kesalahan saat memproses data: ${error instanceof Error ? error.message : String(error)}` };
  }
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