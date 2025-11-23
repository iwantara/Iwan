import React from 'react';
import { Folder, Theme } from '../types';
import { Folder as FolderIcon } from 'lucide-react';

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
  theme,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-[2rem] p-6 transition-all duration-300 backdrop-blur-sm border hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 cursor-pointer shadow-sm
        ${theme.colors.cardBg} ${theme.colors.cardBorder}
      `}
    >
      <div className="flex justify-between items-start mb-6">
        {/* Icon */}
        <div className={`p-3.5 rounded-2xl transition-colors border bg-opacity-20 ${theme.colors.cardBorder} ${theme.colors.accent.replace('text-', 'bg-')}`}>
          <FolderIcon className={`w-8 h-8 ${theme.colors.accent}`} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className={`text-xl font-bold truncate transition-colors ${theme.colors.cardTextColor} group-hover:${theme.colors.accent}`} title={folder.name}>
          {folder.name}
        </h3>

        <p className={`${theme.colors.cardSubText} text-sm font-medium flex items-center gap-2 mt-2`}>
          <span className={`w-2 h-2 rounded-full ${theme.colors.accent.replace('text-', 'bg-').replace('600', '500')}`}></span>
          {itemCount} interest tersimpan
        </p>
      </div>
    </div>
  );
};
