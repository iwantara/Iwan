import { Folder, SavedItem, ThemeName } from '../types';

export interface BackupData {
  version: number;
  timestamp: number;
  folders: Folder[];
  savedItems: SavedItem[];
  currentTheme: ThemeName;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: BackupData;
  warnings?: string[];
  stats?: {
    foldersCount: number;
    itemsCount: number;
    recoveredFolders: number;
    recoveredItems: number;
  };
}

/**
 * Validasi dan Sanitasi Data Backup
 * Fungsi ini tidak hanya mengecek validitas, tapi mencoba memperbaiki data yang kurang lengkap (legacy data).
 */
export function validateBackupData(data: any): ValidationResult {
  const warnings: string[] = [];
  let recoveredFolders = 0;
  let recoveredItems = 0;

  try {
    // 1. Cek struktur dasar
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'File tidak valid atau kosong' };
    }

    // 2. Sanitasi Folders
    // Jika data folder rusak atau tidak ada, kita buat array kosong
    let sanitizedFolders: Folder[] = [];
    const originalFoldersCount = Array.isArray(data.folders) ? data.folders.length : 0;

    if (Array.isArray(data.folders)) {
      sanitizedFolders = data.folders
        .filter((f: any) => f && typeof f.id === 'string' && typeof f.name === 'string') // Filter item sampah
        .map((f: any) => {
          const needsRecovery = typeof f.createdAt !== 'number';
          if (needsRecovery) {
            recoveredFolders++;
            warnings.push(`Folder "${f.name}" dipulihkan (timestamp hilang)`);
          }
          return {
            id: f.id,
            name: f.name,
            createdAt: typeof f.createdAt === 'number' ? f.createdAt : Date.now() // Patch createdAt jika hilang
          };
        });

      const invalidFolders = originalFoldersCount - sanitizedFolders.length;
      if (invalidFolders > 0) {
        warnings.push(`${invalidFolders} folder rusak dan dibuang`);
      }
    }

    // 3. Sanitasi SavedItems
    let sanitizedItems: SavedItem[] = [];
    const originalItemsCount = Array.isArray(data.savedItems) ? data.savedItems.length : 0;

    if (Array.isArray(data.savedItems)) {
      sanitizedItems = data.savedItems
        .filter((i: any) => i && typeof i.id === 'string' && typeof i.interestName === 'string')
        .map((i: any) => {
          let needsRecovery = false;

          // Tentukan folderId. Jika tidak ada (data lama), gunakan folder pertama yang tersedia atau ID sementara
          const targetFolderId = (typeof i.folderId === 'string' && i.folderId.length > 0)
            ? i.folderId
            : (sanitizedFolders.length > 0 ? sanitizedFolders[0].id : 'restored_default');

          if (!i.folderId || !i.timestamp) {
            needsRecovery = true;
            recoveredItems++;
          }

          return {
            id: i.id,
            interestName: i.interestName,
            folderId: targetFolderId,
            timestamp: typeof i.timestamp === 'number' ? i.timestamp : Date.now(),
            funFact: typeof i.funFact === 'string' ? i.funFact : undefined
          };
        });

      const invalidItems = originalItemsCount - sanitizedItems.length;
      if (invalidItems > 0) {
        warnings.push(`${invalidItems} item rusak dan dibuang`);
      }
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
      warnings.push(`Folder darurat "${recoveryFolder.name}" dibuat untuk menampung ${sanitizedItems.length} item`);

      // Semua item harus masuk ke folder recovery ini
      sanitizedItems = sanitizedItems.map(i => ({
        ...i,
        folderId: recoveryFolder.id
      }));
    }
    // Jika item menunjuk ke folder yang tidak ada di list folder
    else if (sanitizedFolders.length > 0) {
       const folderIds = new Set(sanitizedFolders.map(f => f.id));
       let orphanedCount = 0;
       sanitizedItems = sanitizedItems.map(i => {
         if (!folderIds.has(i.folderId)) {
           orphanedCount++;
           return { ...i, folderId: sanitizedFolders[0].id }; // Pindahkan ke folder pertama
         }
         return i;
       });
       if (orphanedCount > 0) {
         warnings.push(`${orphanedCount} item dipindahkan ke folder "${sanitizedFolders[0].name}" (folder asli tidak ditemukan)`);
       }
    }

    // 5. Sanitasi Theme
    const validThemes = ['cosmic', 'ocean', 'nature', 'sunset', 'monochrome', 'aurora', 'mint', 'cherry', 'sunshine', 'royal'];
    let theme: ThemeName = 'monochrome';
    if (data.currentTheme && validThemes.includes(data.currentTheme)) {
      theme = data.currentTheme as ThemeName;
    }

    // 6. Peringatan untuk backup kosong
    if (sanitizedFolders.length === 0 && sanitizedItems.length === 0) {
      warnings.push('⚠️ Backup ini tidak mengandung data apapun');
    }

    return {
      valid: true,
      data: {
        version: 1,
        timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
        folders: sanitizedFolders,
        savedItems: sanitizedItems,
        currentTheme: theme
      },
      warnings: warnings.length > 0 ? warnings : undefined,
      stats: {
        foldersCount: sanitizedFolders.length,
        itemsCount: sanitizedItems.length,
        recoveredFolders,
        recoveredItems
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