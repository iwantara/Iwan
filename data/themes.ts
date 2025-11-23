
import { Theme } from '../types';

// Helper: Kita gunakan properti gradientFrom/To sekarang sebagai warna SOLID (awal dan akhir sama)
// agar tidak perlu mengubah struktur Typescript, tapi efek visualnya solid.

export const themes: Record<string, Theme> = {
  monochrome: {
    name: 'monochrome',
    label: 'Pitch Black',
    colors: {
      primary: 'neutral',
      secondary: 'stone',
      accent: 'text-white', // Aksen Putih Solid
      
      // Gunakan warna solid untuk tombol
      gradientFrom: 'from-neutral-100', // Tombol jadi terang/putih di tema gelap
      gradientTo: 'to-neutral-200',
      
      // HITAM PEKAT
      pageBackground: 'bg-black', 
      textColor: 'text-white',
      subText: 'text-neutral-400',
      
      // Kartu Gelap
      cardBg: 'bg-neutral-900',
      cardBorder: 'border-neutral-800',
      cardTextColor: 'text-white', // Text di dalam kartu putih
      cardSubText: 'text-neutral-400',
      
      blob1: 'bg-neutral-800/30',
      blob2: 'bg-stone-800/30'
    }
  },
  royal: {
    name: 'royal',
    label: 'Royal Blue',
    colors: {
      primary: 'indigo',
      secondary: 'blue',
      accent: 'text-indigo-700', // Solid Dark Blue text
      
      // Tombol Solid Biru
      gradientFrom: 'from-indigo-700',
      gradientTo: 'to-indigo-700',
      
      // BACKGROUND BIRU PEKAT
      pageBackground: 'bg-blue-900', 
      textColor: 'text-white',
      subText: 'text-blue-200',
      
      // KARTU PUTIH (Konsisten dengan tema lain)
      cardBg: 'bg-white',
      cardBorder: 'border-blue-200',
      cardTextColor: 'text-blue-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-blue-600',
      blob2: 'bg-indigo-600'
    }
  },
  cosmic: {
    name: 'cosmic',
    label: 'Deep Space',
    colors: {
      primary: 'purple',
      secondary: 'fuchsia',
      accent: 'text-purple-700', // Solid Purple Text
      
      // Tombol Solid Ungu
      gradientFrom: 'from-purple-700',
      gradientTo: 'to-purple-700',
      
      // BACKGROUND UNGU PEKAT
      pageBackground: 'bg-[#2e1065]', // Violet-950
      textColor: 'text-white',
      subText: 'text-purple-200',
      
      // KARTU PUTIH (Agar jelas)
      cardBg: 'bg-white',
      cardBorder: 'border-purple-200',
      cardTextColor: 'text-purple-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-purple-600',
      blob2: 'bg-fuchsia-600'
    }
  },
  cherry: {
    name: 'cherry',
    label: 'Bold Red',
    colors: {
      primary: 'red',
      secondary: 'rose',
      accent: 'text-red-600', 
      
      gradientFrom: 'from-red-600',
      gradientTo: 'to-red-600',
      
      pageBackground: 'bg-red-700', // Sedikit lebih gelap agar teks putih jelas
      textColor: 'text-white',
      subText: 'text-red-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-red-200',
      cardTextColor: 'text-red-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-red-500',
      blob2: 'bg-rose-500'
    }
  },
  ocean: {
    name: 'ocean',
    label: 'True Blue',
    colors: {
      primary: 'blue',
      secondary: 'sky',
      accent: 'text-blue-600',
      
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-600',
      
      pageBackground: 'bg-blue-600',
      textColor: 'text-white',
      subText: 'text-blue-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-blue-200',
      cardTextColor: 'text-blue-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-blue-500',
      blob2: 'bg-sky-500'
    }
  },
  nature: {
    name: 'nature',
    label: 'Deep Forest',
    colors: {
      primary: 'emerald',
      secondary: 'green',
      accent: 'text-emerald-600',
      
      gradientFrom: 'from-emerald-600',
      gradientTo: 'to-emerald-600',
      
      pageBackground: 'bg-emerald-700',
      textColor: 'text-white',
      subText: 'text-emerald-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-emerald-200',
      cardTextColor: 'text-emerald-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-green-500',
      blob2: 'bg-emerald-500'
    }
  },
  sunset: {
    name: 'sunset',
    label: 'Vibrant Sunset',
    colors: {
      primary: 'orange',
      secondary: 'red',
      accent: 'text-orange-600',
      
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-orange-600',
      
      pageBackground: 'bg-orange-600',
      textColor: 'text-white',
      subText: 'text-orange-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-orange-200',
      cardTextColor: 'text-orange-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-orange-500',
      blob2: 'bg-red-500'
    }
  },
  mint: {
    name: 'mint',
    label: 'Fresh Teal',
    colors: {
      primary: 'teal',
      secondary: 'emerald',
      accent: 'text-teal-600',
      
      gradientFrom: 'from-teal-600',
      gradientTo: 'to-teal-600',
      
      pageBackground: 'bg-teal-600',
      textColor: 'text-white',
      subText: 'text-teal-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-teal-200',
      cardTextColor: 'text-teal-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-teal-500',
      blob2: 'bg-emerald-500'
    }
  },
  aurora: {
    name: 'aurora',
    label: 'Hot Pink',
    colors: {
      primary: 'pink',
      secondary: 'purple',
      accent: 'text-pink-600',
      
      gradientFrom: 'from-pink-600',
      gradientTo: 'to-pink-600',
      
      pageBackground: 'bg-pink-600',
      textColor: 'text-white',
      subText: 'text-pink-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-pink-200',
      cardTextColor: 'text-pink-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-pink-500',
      blob2: 'bg-purple-500'
    }
  },
  sunshine: {
    name: 'sunshine',
    label: 'Golden Yellow',
    colors: {
      primary: 'yellow',
      secondary: 'orange',
      accent: 'text-yellow-700',
      
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-500',
      
      pageBackground: 'bg-yellow-500',
      textColor: 'text-white',
      subText: 'text-yellow-100',
      
      cardBg: 'bg-white',
      cardBorder: 'border-yellow-200',
      cardTextColor: 'text-yellow-950',
      cardSubText: 'text-slate-500',
      
      blob1: 'bg-yellow-400',
      blob2: 'bg-orange-400'
    }
  }
};
