import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { interests } from './data/interests';
import { themes } from './data/themes';
import { Button } from './components/Button';
import { FolderCard } from './components/FolderCard';
import { SavedItemCard } from './components/SavedItemCard';
import { Sparkles, RefreshCw, Copy, Check, FolderPlus, ArrowLeft, Search, ArrowUpDown, Palette, Settings, Download, Upload, AlertCircle } from 'lucide-react';
import { Folder, SavedItem, ThemeName } from './types';
import { createBackupData, generateBackupFilename, formatBackupDate, validateBackupData } from './utils/backupRestore';

// Helper hook for clicking outside
function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Helper for Safe Lazy Loading from LocalStorage
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  // --- Global State with Lazy Initialization ---
  const [folders, setFolders] = useState<Folder[]>(() => loadFromStorage('rip_folders', []));
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => loadFromStorage('rip_items', []));
  
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // --- UI/Theme State with Lazy Initialization ---
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const savedTheme = loadFromStorage<ThemeName>('rip_theme', 'monochrome');
    return themes[savedTheme] ? savedTheme : 'monochrome';
  });
  
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(themeRef, () => setShowThemeSelector(false));

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsRef, () => setShowSettings(false));

  // --- Sort & Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(sortRef, () => setShowSortMenu(false));

  // --- Picker State ---
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // --- Input State ---
  const [newFolderName, setNewFolderName] = useState('');

  // --- AUTOMATIC DATA MIGRATION (Fix Legacy Data on Load) ---
  useEffect(() => {
    let hasChanges = false;
    
    // 1. Fix Folders (missing timestamps)
    const migratedFolders = folders.map(f => {
      if (typeof f.createdAt !== 'number') {
        hasChanges = true;
        return { ...f, createdAt: Date.now() };
      }
      return f;
    });

    // 2. Fix Items (missing folderIds or timestamps)
    // First, ensure we have at least one folder if items exist
    let folderIdList = new Set(migratedFolders.map(f => f.id));
    let defaultFolderId = migratedFolders[0]?.id;

    if (savedItems.length > 0 && !defaultFolderId) {
      const recoveryFolder: Folder = { id: 'recovered_auto', name: 'Umum (Recovered)', createdAt: Date.now() };
      migratedFolders.push(recoveryFolder);
      folderIdList.add(recoveryFolder.id);
      defaultFolderId = recoveryFolder.id;
      hasChanges = true;
    }

    const migratedItems = savedItems.map(item => {
      let needsFix = false;
      let newFolderId = item.folderId;
      let newTimestamp = item.timestamp;

      // Assign orphaned items to default folder
      if (!newFolderId || !folderIdList.has(newFolderId)) {
         newFolderId = defaultFolderId;
         needsFix = true;
      }
      
      if (typeof newTimestamp !== 'number') {
        newTimestamp = Date.now();
        needsFix = true;
      }

      if (needsFix) {
        hasChanges = true;
        return { ...item, folderId: newFolderId, timestamp: newTimestamp };
      }
      return item;
    });

    if (hasChanges) {
      console.log('App: Legacy data migrated automatically.');
      setFolders(migratedFolders);
      setSavedItems(migratedItems);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount

  // --- Persistence (SAVE ONLY) ---
  useEffect(() => {
    localStorage.setItem('rip_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('rip_items', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('rip_theme', currentTheme);
  }, [currentTheme]);

  // --- Helper to get current theme object ---
  const theme = themes[currentTheme] || themes.cosmic;

  // --- Backup & Restore Logic ---
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExport = () => {
    try {
      const backupData = createBackupData(folders, savedItems, currentTheme);

      // Cek jika data kosong
      if (folders.length === 0 && savedItems.length === 0) {
        const confirmEmpty = window.confirm(
          '⚠️ DATA KOSONG\n\n' +
          'Anda belum memiliki data apapun untuk di-backup.\n' +
          'Apakah Anda tetap ingin membuat file backup kosong?'
        );
        if (!confirmEmpty) {
          setShowSettings(false);
          return;
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateBackupFilename(backupData.timestamp);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Pesan sukses yang lebih informatif
      let successMessage = `✅ Backup berhasil!\n\n`;
      successMessage += `📁 ${folders.length} folder\n`;
      successMessage += `📌 ${savedItems.length} items\n\n`;
      successMessage += `📄 File: ${generateBackupFilename(backupData.timestamp)}`;

      setBackupStatus({
        type: 'success',
        message: successMessage
      });
      setTimeout(() => setBackupStatus(null), 5000);
      setShowSettings(false);
    } catch (error) {
      setBackupStatus({
        type: 'error',
        message: `❌ Gagal membuat backup: ${error instanceof Error ? error.message : String(error)}`
      });
      setTimeout(() => setBackupStatus(null), 4000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);

    try {
      const text = await file.text();
      console.log('File content read, length:', text.length);
      let parsedData;

      try {
        parsedData = JSON.parse(text);
        console.log('JSON parsed successfully:', parsedData);
      } catch (err) {
        throw new Error("File rusak atau bukan format JSON yang valid.");
      }

      // Validasi backup data (now auto-heals bad data)
      console.log('Validating backup data...');
      const validation = validateBackupData(parsedData);
      console.log('Validation result:', validation);

      if (!validation.valid || !validation.data) {
        throw new Error(validation.error || "Data backup tidak valid");
      }

      const backupData = validation.data;
      const stats = validation.stats;

      // Cek jika backup kosong
      if (stats && stats.foldersCount === 0 && stats.itemsCount === 0) {
        console.log('Backup is empty, showing confirmation...');
        const emptyConfirm = window.confirm(
          '⚠️ BACKUP KOSONG\n\n' +
          'File backup ini tidak mengandung data apapun.\n' +
          'Jika Anda lanjutkan, semua data yang ada sekarang akan DIHAPUS.\n\n' +
          'Apakah Anda yakin ingin melanjutkan?'
        );
        if (!emptyConfirm) {
          console.log('Empty backup cancelled by user');
          fileInput.value = '';
          return;
        }
        console.log('User confirmed empty backup restore');
      }

      // Buat pesan konfirmasi dengan detail
      let confirmMessage = `📦 BACKUP DITEMUKAN\n\n`;
      confirmMessage += `📅 Tanggal: ${formatBackupDate(backupData.timestamp)}\n`;
      confirmMessage += `📁 Folder: ${stats?.foldersCount || 0}\n`;
      confirmMessage += `📌 Items: ${stats?.itemsCount || 0}\n`;

      // Tambahkan peringatan jika ada
      if (validation.warnings && validation.warnings.length > 0) {
        confirmMessage += `\n⚠️ PERINGATAN:\n`;
        validation.warnings.forEach(w => {
          confirmMessage += `• ${w}\n`;
        });
      }

      confirmMessage += `\n🔄 Data yang ada saat ini akan DIGANTI dengan data backup ini.\n\nApakah Anda yakin?`;

      console.log('Showing confirmation dialog...');
      const confirmed = window.confirm(confirmMessage);
      console.log('User confirmation:', confirmed);

      if (confirmed) {
        console.log('Restoring data...');
        console.log('Folders to restore:', backupData.folders);
        console.log('Items to restore:', backupData.savedItems);

        // Update state
        setFolders(backupData.folders);
        setSavedItems(backupData.savedItems);
        setCurrentTheme(backupData.currentTheme);

        console.log('State updated, resetting active folder...');

        // Reset active folder to avoid showing a deleted folder
        setActiveFolderId(null);

        // Buat pesan sukses yang informatif
        let successMessage = `✅ Data berhasil dipulihkan!\n\n`;
        successMessage += `📁 ${stats?.foldersCount || 0} folder\n`;
        successMessage += `📌 ${stats?.itemsCount || 0} items`;

        if (stats && (stats.recoveredFolders > 0 || stats.recoveredItems > 0)) {
          successMessage += `\n\n🔧 Data diperbaiki:\n`;
          if (stats.recoveredFolders > 0) {
            successMessage += `• ${stats.recoveredFolders} folder\n`;
          }
          if (stats.recoveredItems > 0) {
            successMessage += `• ${stats.recoveredItems} items`;
          }
        }

        setBackupStatus({
          type: 'success',
          message: successMessage
        });
        setTimeout(() => setBackupStatus(null), 6000);
      }
    } catch (error) {
      console.error("Import Error:", error);
      setBackupStatus({
        type: 'error',
        message: '❌ Gagal restore: ' + (error instanceof Error ? error.message : String(error))
      });
      setTimeout(() => setBackupStatus(null), 5000);
    } finally {
      setShowSettings(false);
      // Reset input agar user bisa memilih file yang sama lagi
      fileInput.value = '';
    }
  };


  // --- Folder Logic ---
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
      createdAt: Date.now(),
    };
    setFolders([newFolder, ...folders]);
    setNewFolderName('');
  };

  const deleteFolder = (e: React.MouseEvent, id: string) => {
    // Stop propagation is handled in the child component, but good to have here too
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Yakin ingin menghapus folder ini beserta isinya?')) {
      setFolders(folders.filter(f => f.id !== id));
      setSavedItems(savedItems.filter(i => i.folderId !== id));
      if (activeFolderId === id) setActiveFolderId(null);
    }
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const moveFolder = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    const newFolders = [...folders];
    if (direction === 'up' && index > 0) {
      [newFolders[index], newFolders[index - 1]] = [newFolders[index - 1], newFolders[index]];
    } else if (direction === 'down' && index < newFolders.length - 1) {
      [newFolders[index], newFolders[index + 1]] = [newFolders[index + 1], newFolders[index]];
    }
    setFolders(newFolders);
  };

  const deleteItem = (itemId: string) => {
    setSavedItems(savedItems.filter(i => i.id !== itemId));
  };

  // --- Picker Logic ---
  const pickRandomInterest = useCallback(() => {
    if (interests.length === 0 || !activeFolderId) return;

    setIsAnimating(true);
    setCopied(false);
    
    let count = 0;
    const maxCount = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * interests.length);
      setSelectedInterest(interests[randomIndex]);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        finalizeSelection();
      }
    }, 50);
  }, [activeFolderId, interests]);

  const finalizeSelection = async () => {
    const finalIndex = Math.floor(Math.random() * interests.length);
    const finalChoice = interests[finalIndex];
    
    setSelectedInterest(finalChoice);
    setIsAnimating(false);
    
    // Auto Save to History
    if (activeFolderId) {
      const newItem: SavedItem = {
        id: Date.now().toString(),
        folderId: activeFolderId,
        interestName: finalChoice,
        timestamp: Date.now(),
      };
      setSavedItems(prev => [newItem, ...prev]);
    }
  };

  const handleCopy = async () => {
    if (selectedInterest) {
      try {
        await navigator.clipboard.writeText(selectedInterest);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // --- Derived State & Filter/Sort Logic ---
  const activeFolder = folders.find(f => f.id === activeFolderId);
  const currentFolderItems = savedItems.filter(i => i.folderId === activeFolderId);

  const processedFolders = useMemo(() => {
    let result = [...folders];

    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createdAt - a.createdAt;
      } else {
        return a.createdAt - b.createdAt;
      }
    });

    return result;
  }, [folders, searchQuery, sortOrder]);

  // --- Render Views ---

  const Background = () => (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
       <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] mix-blend-multiply transition-colors duration-1000 opacity-60 ${theme.colors.blob1}`}></div>
       <div className={`absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] mix-blend-multiply transition-colors duration-1000 opacity-60 ${theme.colors.blob2}`}></div>
    </div>
  );

  // VIEW 1: Folder Selection
  if (!activeFolderId) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center relative p-6 font-sans transition-colors duration-700 ${theme.colors.pageBackground} ${theme.colors.textColor}`}>
        <Background />

        {/* Backup Status Notification */}
        {backupStatus && (
          <div className={`fixed top-4 right-4 z-[200] max-w-md animate-in slide-in-from-right fade-in ${
            backupStatus.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          } rounded-lg shadow-lg p-4 flex items-start gap-3`}>
            <div className="mt-0.5">
              {backupStatus.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium whitespace-pre-line">{backupStatus.message}</p>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="z-50 w-full max-w-5xl flex justify-between items-start pt-4 mb-8 relative">
            <div className="space-y-1">
              <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${theme.colors.textColor}`}>
                Koleksi Interest
              </h1>
              <p className={`font-medium text-sm md:text-base ${theme.colors.subText}`}>Kelola inspirasimu dengan rapi.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              
              {/* Settings */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                   className={`p-3 border rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 relative backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white`}
                   title="Pengaturan & Backup"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showSettings && (
                   <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-300/30 p-2 animate-in fade-in zoom-in-95 origin-top-right ring-1 ring-slate-100 z-[100]">
                    <span className="text-xs font-bold text-slate-400 px-3 py-2 block uppercase tracking-wider border-b border-slate-100 mb-1">Data & Storage</span>
                    
                    <button
                      onClick={handleExport}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Download className="w-4 h-4 text-blue-500" />
                      Backup Data
                    </button>

                    <label className="w-full cursor-pointer text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                      <Upload className="w-4 h-4 text-green-500" />
                      Restore Data
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={handleImport}
                      />
                    </label>
                   </div>
                )}
              </div>

              {/* Theme Selector */}
              <div className="relative" ref={themeRef}>
                <button 
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className={`p-3 border rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 relative backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white`}
                  title="Ganti Tema"
                >
                  <Palette className="w-5 h-5" />
                </button>

                {showThemeSelector && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-300/30 p-2 animate-in fade-in zoom-in-95 origin-top-right ring-1 ring-slate-100 z-[100]">
                    <span className="text-xs font-bold text-slate-400 px-3 py-2 block uppercase tracking-wider border-b border-slate-100 mb-1">Pilih Tema</span>
                    <div className="max-h-[300px] overflow-y-auto">
                      {Object.values(themes).map((t) => (
                        <button
                          key={t.name}
                          onClick={() => { setCurrentTheme(t.name); setShowThemeSelector(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${currentTheme === t.name ? 'bg-slate-100 text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          <div className={`w-4 h-4 rounded-full shadow-sm`} style={{ backgroundColor: t.name === 'monochrome' ? '#000' : `var(--${t.colors.primary}-500, gray)` }}></div>
                          {t.label}
                          {currentTheme === t.name && <Check className="w-4 h-4 ml-auto text-slate-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
        </div>

        <div className="z-10 w-full max-w-5xl space-y-8">
          
          {/* Create Folder Input */}
          <div className={`${theme.colors.cardBg} ${theme.colors.cardBorder} backdrop-blur-lg p-3 rounded-[2rem] border shadow-xl shadow-black/5 flex gap-2 transition-transform hover:scale-[1.01]`}>
            <input 
              type="text" 
              placeholder="Nama folder baru..."
              className={`flex-1 bg-transparent border-none px-6 py-3 focus:outline-none font-medium text-lg placeholder:opacity-50 ${theme.colors.cardTextColor}`}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            />
            <button 
              onClick={createFolder}
              className={`text-white px-8 py-3 rounded-[1.5rem] font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ${theme.colors.gradientFrom}`}
              disabled={!newFolderName.trim()}
            >
              Buat
            </button>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
             
             {/* Left: Sort Dropdown */}
             <div className="relative w-full md:w-auto z-20" ref={sortRef}>
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className={`w-full md:w-auto flex items-center justify-between md:justify-start gap-3 px-5 py-3 ${theme.colors.cardBg} ${theme.colors.cardBorder} backdrop-blur-sm border rounded-2xl ${theme.colors.cardSubText} font-semibold transition-all shadow-sm hover:opacity-100 opacity-90`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 opacity-70" />
                    <span>Urutkan: <span className={`ml-1 ${theme.colors.accent}`}>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span></span>
                  </div>
                </button>
                
                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-1.5 z-30 animate-in fade-in zoom-in-95">
                    <button 
                      onClick={() => { setSortOrder('newest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between ${sortOrder === 'newest' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <span>Terbaru (Baru dibuat)</span>
                      {sortOrder === 'newest' && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between ${sortOrder === 'oldest' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <span>Terlama (Dulu dibuat)</span>
                      {sortOrder === 'oldest' && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                )}
             </div>

             {/* Right: Search Bar */}
             <div className="relative w-full md:w-72 lg:w-96">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                  <Search className={`w-5 h-5 ${theme.colors.cardSubText}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 ${theme.colors.cardBg} ${theme.colors.cardBorder} backdrop-blur-sm border rounded-2xl ${theme.colors.cardTextColor} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all shadow-sm placeholder:opacity-50`}
                  style={{
                    ['--tw-ring-color' as any]: `var(--${theme.colors.primary}-500)`
                  }}
                />
             </div>
          </div>

          {/* Folder Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 mt-10">
            {processedFolders.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${theme.colors.cardBg} backdrop-blur-sm mb-6 shadow-sm border ${theme.colors.cardBorder}`}>
                   <FolderPlus className={`w-8 h-8 ${theme.colors.cardSubText}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme.colors.textColor}`}>
                  {searchQuery ? 'Folder tidak ditemukan' : 'Belum ada folder'}
                </h3>
                <p className={`${theme.colors.subText}`}>{searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan membuat folder baru di atas'}</p>
              </div>
            ) : (
              processedFolders.map((folder, index) => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder} 
                  theme={theme}
                  itemCount={savedItems.filter(i => i.folderId === folder.id).length}
                  index={index}
                  totalFolders={processedFolders.length} 
                  allowManualSort={false} 
                  onClick={() => setActiveFolderId(folder.id)}
                  onDelete={(e) => deleteFolder(e, folder.id)}
                  onRename={(newName) => renameFolder(folder.id, newName)}
                  onMove={(e, dir) => moveFolder(e, index, dir)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: Inside Folder (Picker)
  return (
    <div className={`min-h-screen w-full flex flex-col items-center relative p-4 pb-20 font-sans transition-colors duration-700 ${theme.colors.pageBackground} ${theme.colors.textColor}`}>
      <Background />

      <div className="z-10 w-full max-w-3xl flex flex-col items-center space-y-8">
        
        {/* Navigation */}
        <div className="w-full flex items-center justify-between py-6">
          <button 
            onClick={() => setActiveFolderId(null)}
            className={`flex items-center gap-2 ${theme.colors.cardBg} backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border ${theme.colors.cardBorder} ${theme.colors.cardSubText} hover:${theme.colors.cardTextColor} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-sm">Kembali</span>
          </button>
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme.colors.cardBg} px-3 py-1 rounded-full mb-1 ${theme.colors.accent} border ${theme.colors.cardBorder}`}>Folder Aktif</span>
            <h2 className={`text-xl font-bold ${theme.colors.textColor}`}>{activeFolder?.name}</h2>
          </div>
          <div className="w-24"></div> 
        </div>

        {/* Main Picker Card */}
        <div className={`w-full ${theme.colors.cardBg} backdrop-blur-xl border ${theme.colors.cardBorder} rounded-[2.5rem] p-10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden transition-colors`}>
          
          <div className="min-h-[200px] flex flex-col items-center justify-center relative">
             {!selectedInterest ? (
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-20 h-20 ${theme.colors.cardBg} border ${theme.colors.cardBorder} rounded-full flex items-center justify-center mb-2 animate-pulse ${theme.colors.accent} shadow-inner bg-slate-50/50`}>
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className={`text-lg font-medium ${theme.colors.cardSubText}`}>Tekan tombol di bawah untuk mengacak</span>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-500 w-full slide-in-from-bottom-4">
                <span className={`text-xs uppercase tracking-widest font-bold mb-4 block ${theme.colors.accent}`}>
                  Hasil Pilihan
                </span>
                <h2 
                  className={`text-4xl md:text-5xl font-extrabold leading-tight cursor-pointer hover:opacity-80 transition-opacity py-2 drop-shadow-sm ${theme.colors.accent}`}
                  onClick={handleCopy}
                >
                  {selectedInterest}
                </h2>
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={pickRandomInterest} 
              disabled={isAnimating}
              theme={theme}
              className="flex items-center justify-center space-x-2 min-w-[200px]"
            >
              {isAnimating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isAnimating ? 'Mengacak...' : 'Acak Interest'}</span>
            </Button>

            {selectedInterest && !isAnimating && (
               <Button 
               variant="secondary"
               onClick={handleCopy}
               className={`flex items-center justify-center space-x-2 ${theme.colors.cardBg} ${theme.colors.cardTextColor} border ${theme.colors.cardBorder} hover:brightness-95`}
             >
               {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
               <span>{copied ? 'Tersalin' : 'Salin'}</span>
             </Button>
            )}
          </div>
        </div>

        {/* Saved Items List */}
        <div className="w-full pt-6">
           <div className="flex items-center justify-between mb-6 px-4">
              <h3 className={`text-xl font-bold flex items-center gap-2 ${theme.colors.textColor}`}>
                <FolderPlus className={`w-6 h-6 ${theme.colors.accent} ${theme.name === 'monochrome' ? '' : 'bg-white rounded-full p-1'}`} />
                History Pilihan
              </h3>
              <span className={`text-xs font-bold ${theme.colors.cardBg} border ${theme.colors.cardBorder} px-4 py-1.5 rounded-full shadow-sm ${theme.colors.accent}`}>
                {currentFolderItems.length} Tersimpan
              </span>
           </div>
           
           <div className="space-y-4">
             {currentFolderItems.length === 0 ? (
               <div className={`text-center py-16 ${theme.colors.cardBg} backdrop-blur-sm rounded-[2rem] border ${theme.colors.cardBorder} shadow-sm`}>
                 <p className={`mb-2 font-medium text-lg ${theme.colors.cardTextColor}`}>Belum ada history</p>
                 <p className={`text-sm opacity-70 ${theme.colors.cardSubText}`}>Hasil acakan akan otomatis tersimpan di sini</p>
               </div>
             ) : (
               currentFolderItems.map((item) => (
                 <SavedItemCard 
                    key={item.id} 
                    item={item} 
                    theme={theme}
                    onDelete={() => deleteItem(item.id)} 
                 />
               ))
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;