
import { Theme } from '../types';

export const themes: Record<string, Theme> = {
  monochrome: {
    name: 'monochrome',
    label: 'Pitch Black',
    colors: {
      primary: 'neutral',
      secondary: 'stone',
      accent: 'text-white',
      
      // Tombol PUTIH di atas Background Hitam / Kartu Hitam
      gradientFrom: 'bg-white', 
      gradientTo: 'to-white',
      buttonTextColor: 'text-black', // Teks Hitam agar terbaca di tombol putih
      
      pageBackground: 'bg-black', 
      textColor: 'text-white',
      subText: 'text-neutral-400',
      
      cardBg: 'bg-neutral-900',
      cardBorder: 'border-neutral-800',
      cardTextColor: 'text-white',
      cardSubText: 'text-neutral-400',
      
      blob1: 'bg-neutral-800/30',
      blob2: 'bg-stone-800/30'
    }
  },
  royal: {
    name: 'royal',
    label: 'Cool Slate',
    colors: {
      primary: 'slate',
      secondary: 'gray',
      accent: 'text-slate-700',

      gradientFrom: 'bg-slate-700',
      gradientTo: 'to-slate-700',
      buttonTextColor: 'text-white',

      pageBackground: 'bg-slate-800',
      textColor: 'text-white',
      subText: 'text-slate-300',

      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      cardTextColor: 'text-slate-950',
      cardSubText: 'text-slate-500',

      blob1: 'bg-slate-600',
      blob2: 'bg-gray-600'
    }
  },
  cosmic: {
    name: 'cosmic',
    label: 'Warm Chocolate',
    colors: {
      primary: 'amber',
      secondary: 'stone',
      accent: 'text-amber-800',

      gradientFrom: 'bg-amber-700',
      gradientTo: 'to-amber-700',
      buttonTextColor: 'text-white',

      pageBackground: 'bg-amber-900',
      textColor: 'text-white',
      subText: 'text-amber-200',

      cardBg: 'bg-white',
      cardBorder: 'border-amber-200',
      cardTextColor: 'text-amber-950',
      cardSubText: 'text-slate-500',

      blob1: 'bg-amber-700',
      blob2: 'bg-stone-600'
    }
  },
  cherry: {
    name: 'cherry',
    label: 'Bold Red',
    colors: {
      primary: 'red',
      secondary: 'rose',
      accent: 'text-red-600', 
      
      gradientFrom: 'bg-red-600',
      gradientTo: 'to-red-600',
      buttonTextColor: 'text-white',
      
      pageBackground: 'bg-red-700', 
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
      
      gradientFrom: 'bg-blue-600',
      gradientTo: 'to-blue-600',
      buttonTextColor: 'text-white',
      
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
      
      gradientFrom: 'bg-emerald-600',
      gradientTo: 'to-emerald-600',
      buttonTextColor: 'text-white',
      
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
      
      gradientFrom: 'bg-orange-600',
      gradientTo: 'to-orange-600',
      buttonTextColor: 'text-white',
      
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
      
      gradientFrom: 'bg-teal-600',
      gradientTo: 'to-teal-600',
      buttonTextColor: 'text-white',
      
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
      
      gradientFrom: 'bg-pink-600',
      gradientTo: 'to-pink-600',
      buttonTextColor: 'text-white',
      
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
      
      // Kuning agak gelap sedikit agar beda dengan background putih kartu, 
      // tapi teksnya HARUS GELAP (coklat tua) agar terbaca.
      gradientFrom: 'bg-yellow-400', 
      gradientTo: 'to-yellow-400',
      buttonTextColor: 'text-yellow-950', 
      
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
