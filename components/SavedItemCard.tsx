
import React from 'react';
import { SavedItem, Theme } from '../types';
import { Trash2, Copy, ExternalLink } from 'lucide-react';

interface SavedItemCardProps {
  item: SavedItem;
  theme: Theme;
  onDelete: () => void;
}

export const SavedItemCard: React.FC<SavedItemCardProps> = ({ item, theme, onDelete }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.interestName);
  };

  const handleGoogle = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(item.interestName)}`, '_blank');
  };

  return (
    <div className={`${theme.colors.cardBg} ${theme.colors.cardBorder} border rounded-2xl p-5 flex flex-col gap-4 group hover:shadow-lg hover:shadow-black/5 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`text-lg font-bold transition-colors ${theme.colors.cardTextColor} group-hover:${theme.colors.accent}`}>{item.interestName}</h4>
          <span className={`text-xs font-medium mt-1 block ${theme.colors.cardSubText}`}>
            {new Date(item.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} • {new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors ${theme.colors.cardSubText} hover:${theme.colors.accent} hover:bg-black/5`}
            title="Salin"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleGoogle}
            className={`p-2 rounded-lg transition-colors ${theme.colors.cardSubText} hover:${theme.colors.accent} hover:bg-black/5`}
            title="Cari di Google"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className={`p-2 rounded-lg transition-colors ${theme.colors.cardSubText} hover:text-red-500 hover:bg-red-500/10`}
            title="Hapus Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
