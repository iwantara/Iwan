
export interface Interest {
  id: number;
  name: string;
  originalRaw: string;
}

export interface AIResponse {
  fact: string;
}

export interface SavedItem {
  id: string;
  folderId: string;
  interestName: string;
  funFact?: string;
  timestamp: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export type ThemeName = 'cosmic' | 'ocean' | 'nature' | 'sunset' | 'monochrome' | 'aurora' | 'mint' | 'cherry' | 'sunshine' | 'royal' | 'lavender' | 'lime';

export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    primary: string; // e.g., 'indigo'
    secondary: string; // e.g., 'purple'
    accent: string; // Used for icons/rings
    gradientFrom: string; // Used for BUTTON BACKGROUND (Solid color now)
    gradientTo: string; // Unused but kept for type compatibility if needed
    
    buttonTextColor: string; // NEW: Specific text color for the primary button
    
    // Background Utama (Halaman)
    pageBackground: string; // Full page bold background
    
    // Warna Teks di Halaman Utama (Judul Besar)
    textColor: string; 
    subText: string;   
    
    // Komponen (Kartu)
    cardBg: string;      // Background kartu (biasanya putih untuk tema bold)
    cardBorder: string;  
    cardTextColor: string; // Teks DI DALAM kartu (agar kontras dengan background kartu)
    cardSubText: string;   // Subteks DI DALAM kartu
    
    // Dekorasi
    blob1: string;
    blob2: string;
  };
}
