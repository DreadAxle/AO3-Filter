import React, { useState } from 'react';
import { ParsedLink, CustomList } from '../types';
import { LinkItem } from './LinkItem';

interface LinkListProps {
  links: ParsedLink[];
  lists: CustomList[];
  onRemove: (id: string) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
  onClear: () => void;
  onAddLinksToList: (linkIds: string[], listId: string) => void;
  onRemoveLinkFromList: (linkId: string, listId: string) => void;
  activeListId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LinkList: React.FC<LinkListProps> = ({ 
  links, 
  lists, 
  onRemove,
  onUpdateLabel,
  onClear,
  onAddLinksToList,
  onRemoveLinkFromList,
  activeListId,
  searchQuery,
  onSearchChange
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [targetListId, setTargetListId] = useState<string>("");

  const handleToggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === links.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(links.map(l => l.id)));
    }
  };

  const handleBulkAdd = () => {
    if (!targetListId || selectedIds.size === 0) return;
    onAddLinksToList(Array.from(selectedIds), targetListId);
    setSelectedIds(new Set()); // Clear selection after add
    setTargetListId("");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all visible links permanently?")) {
      onClear();
      setSelectedIds(new Set());
    }
  };

  const activeListName = activeListId ? lists.find(l => l.id === activeListId)?.name : "All Links";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-slate-200">
          {activeListName} <span className="text-slate-500 text-sm">({links.length})</span>
        </h2>
        
        {activeListId === null && links.length > 0 && !searchQuery && (
           <button
             onClick={handleClearAll}
             className="text-sm text-red-400 hover:text-red-300 hover:underline text-left"
           >
             Clear All Links
           </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by label or URL..."
          className="block w-full rounded-md border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/50 sm:text-sm pl-9 py-2 border transition-colors"
        />
        {searchQuery && (
            <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      {links.length > 0 && (
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <input 
               type="checkbox" 
               checked={links.length > 0 && selectedIds.size === links.length}
               onChange={handleSelectAll}
               className="h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
             />
             <span className="text-sm text-slate-400">
               {selectedIds.size} selected
             </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
             <select
               value={targetListId}
               onChange={(e) => setTargetListId(e.target.value)}
               disabled={selectedIds.size === 0 || lists.length === 0}
               className="flex-1 sm:w-40 block rounded-md border-slate-600 bg-slate-900 text-white text-base sm:text-xs py-2 sm:py-1.5 px-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
             >
               <option value="">Add to list...</option>
               {lists.map(list => (
                 <option key={list.id} value={list.id}>{list.name}</option>
               ))}
             </select>
             <button
               onClick={handleBulkAdd}
               disabled={!targetListId || selectedIds.size === 0}
               className="px-3 py-2 sm:py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Add
             </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3 max-h-none sm:max-h-[500px] overflow-y-visible sm:overflow-y-auto pr-2 custom-scrollbar">
        {links.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/30">
            {searchQuery ? (
                 <p className="text-slate-500">No results found for "{searchQuery}".</p>
            ) : (
                <>
                <p className="text-slate-500">
                  {activeListId ? "No links in this list yet." : "No links added yet."}
                </p>
                {activeListId && (
                  <p className="text-xs text-slate-600 mt-2">
                    Go to "All Links", select items, and add them to this list.
                  </p>
                )}
                </>
            )}
          </div>
        ) : (
          links.map(link => (
            <LinkItem 
              key={link.id} 
              item={link} 
              selected={selectedIds.has(link.id)}
              onToggleSelection={handleToggleSelection}
              onRemove={onRemove}
              onUpdateLabel={onUpdateLabel}
              lists={lists}
              onRemoveFromList={onRemoveLinkFromList}
            />
          ))
        )}
      </div>
    </div>
  );
};
