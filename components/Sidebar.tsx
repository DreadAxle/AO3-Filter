import React, { useState, useRef } from 'react';
import { CustomList, ParsedLink, BackupData } from '../types';

interface SidebarProps {
  lists: CustomList[];
  links: ParsedLink[]; // Needed for export
  activeListId: string | null;
  onSelectList: (id: string | null) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onImportData: (data: unknown) => { success: boolean; error?: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  lists, 
  links,
  activeListId, 
  onSelectList, 
  onCreateList,
  onDeleteList,
  onImportData
}) => {
  const [newListName, setNewListName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName);
      setNewListName('');
    }
  };

  const handleExport = () => {
    const backup: BackupData = {
      version: 1,
      timestamp: Date.now(),
      links,
      lists
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `ao3_filter_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = onImportData(json);
        if (result.success) {
          alert("Backup restored successfully!");
        } else {
          alert(`Import failed: ${result.error}`);
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-4 px-2">Lists</h2>
      
      {/* List Navigation */}
      <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onSelectList(null)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            activeListId === null 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          All Links
        </button>

        <div className="my-2 border-t border-slate-700 mx-2" />

        {lists.length === 0 && (
          <p className="px-3 text-xs text-slate-500 italic">No custom lists yet</p>
        )}

        {lists.map(list => (
          <div 
            key={list.id}
            className={`group flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors text-sm font-medium ${
              activeListId === list.id
                ? 'bg-indigo-600/50 text-white border border-indigo-500/50'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <button
              onClick={() => onSelectList(list.id)}
              className="flex-1 text-left truncate"
            >
              {list.name}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm(`Delete list "${list.name}"? Links will remain in All Links.`)) {
                  onDeleteList(list.id);
                  if (activeListId === list.id) onSelectList(null);
                }
              }}
              className={`ml-2 p-2 sm:p-1 text-slate-500 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded ${activeListId === list.id ? 'text-indigo-200' : ''}`}
              title="Delete List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Create List Form */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <form onSubmit={handleCreate} className="space-y-2 mb-4">
          <label htmlFor="new-list" className="sr-only">New List Name</label>
          <input
            id="new-list"
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="+ New List Name"
            className="block w-full rounded-md border-slate-600 bg-slate-900 text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500/50 text-base sm:text-xs px-3 py-3 sm:py-2 border"
          />
          <button
            type="submit"
            disabled={!newListName.trim()}
            className="w-full inline-flex justify-center items-center px-3 py-2.5 sm:py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create List
          </button>
        </form>

        {/* Data Management */}
        <div className="border-t border-slate-700 pt-3">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2 px-1">Backup & Restore</p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2.5 sm:py-1.5 rounded transition-colors"
              title="Download JSON backup"
            >
              Export
            </button>
            <button
              onClick={handleImportClick}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2.5 sm:py-1.5 rounded transition-colors"
              title="Load JSON backup"
            >
              Import
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".json"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
