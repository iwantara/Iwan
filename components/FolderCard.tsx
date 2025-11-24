import React, { useState, useRef, useEffect } from 'react';
import { Folder, Theme } from '../types';
import { Folder as FolderIcon, Trash2, Pencil, Check, X, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';

interface FolderCardProps {
  folder: Folder;
  itemCount: number;
  index: number;
  totalFolders: number;
  theme: Theme;
  allowManualSort?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onRename: (newName: string) => void;
  onMove: (e: React.MouseEvent, direction: 'up' | 'down') => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  itemCount,
  index,
  totalFolders,
  theme,
  allowManualSort = false,
  onClick,
  onDelete,
  onRename,
  onMove
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSave = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    if (editName.trim()) {
      onRename(editName);
    } else {
      setEditName(folder.name);
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(folder.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      setEditName(folder.name);
      setIsEditing(false);
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    setShowMenu(false);
    onDelete(e);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`group relative rounded-[2rem] p-6 transition-all duration-300 backdrop-blur-sm border
        ${theme.colors.cardBg} ${theme.colors.cardBorder}
        ${!isEditing ? 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 cursor-pointer shadow-md' : 'cursor-default ring-2 shadow-md'}
      `}
      style={{
        borderColor: isEditing ? 'var(--theme-color)' : '',
        ['--theme-color' as any]: theme.colors.primary
      }}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        {/* Icon */}
        <div className={`p-3.5 rounded-2xl transition-colors border bg-opacity-20 ${theme.colors.cardBorder} ${theme.colors.accent.replace('text-', 'bg-')}`}>
          <FolderIcon className={`w-8 h-8 ${theme.colors.accent}`} />
        </div>

        {/* Menu Button (Three Dots) */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-xl transition-colors ${showMenu ? 'bg-slate-200/50 text-current' : `${theme.colors.cardSubText} hover:text-current hover:bg-black/5`}`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu - Always White for clarity */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/20 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={startEditing}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors hover:text-slate-900"
                >
                  <Pencil className="w-4 h-4" /> Ubah Nama
                </button>

                {allowManualSort && (
                  <>
                    <div className="h-px bg-slate-200 my-1 mx-2"></div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMove(e, 'up'); setShowMenu(false); }}
                      disabled={index === 0}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-left disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" /> Geser Naik
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMove(e, 'down'); setShowMenu(false); }}
                      disabled={index === totalFolders - 1}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-left disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4" /> Geser Turun
                    </button>
                  </>
                )}

                <div className="h-px bg-slate-200 my-1 mx-2"></div>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-left transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Folder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0 space-y-1">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-opacity-20"
              style={{
                  ['--tw-ring-color' as any]: `var(--${theme.colors.primary}-500)`
              }}
            />
            <button
              onClick={handleSave}
              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-200/50"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <h3 className={`text-xl font-bold truncate transition-colors ${theme.colors.cardTextColor} group-hover:${theme.colors.accent}`} title={folder.name}>
            {folder.name}
          </h3>
        )}

        <p className={`${theme.colors.cardSubText} text-sm font-medium flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${theme.colors.accent.replace('text-', 'bg-').replace('600', '500')}`}></span>
          {itemCount} interest tersimpan
        </p>
      </div>
    </div>
  );
};
