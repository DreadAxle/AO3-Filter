import React, { useState, useRef, useEffect } from 'react';
import { ParsedLink, CustomList } from '../types';

interface LinkItemProps {
  item: ParsedLink;
  selected: boolean;
  onToggleSelection: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
  lists: CustomList[]; // All available lists to look up names
  onRemoveFromList: (linkId: string, listId: string) => void;
}

export const LinkItem: React.FC<LinkItemProps> = ({ 
  item, 
  selected, 
  onToggleSelection, 
  onRemove,
  onUpdateLabel,
  lists,
  onRemoveFromList
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreNextBlurRef = useRef(false);

  // Defensive check: Ensure listIds exists before filtering
  const currentListIds = item.listIds || [];
  const itemLists = lists.filter(l => currentListIds.includes(l.id));

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(item.label || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    ignoreNextBlurRef.current = true;
    onUpdateLabel(item.id, editValue);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    ignoreNextBlurRef.current = true;
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-start p-3 bg-slate-800 border rounded-lg shadow-sm transition-all duration-200 group ${selected ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-700 hover:shadow-md'}`}>
      
      {/* Checkbox */}
      <div className="flex-shrink-0 mr-3 pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelection(item.id)}
          className="h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800 cursor-pointer"
        />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        {/* Header: ID + Time */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
            ID: {item.numericId}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(item.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        {/* Label + URL Area */}
        <div className="mb-2 min-h-[2.5rem] flex flex-col justify-center">
          {isEditing ? (
             <div className="flex items-center gap-2 w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (ignoreNextBlurRef.current) {
                        ignoreNextBlurRef.current = false;
                        return;
                      }
                      handleSaveEdit();
                    }}
                    placeholder="Enter label..."
                    className="flex-1 bg-slate-900 text-white text-sm rounded border border-indigo-500 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
             </div>
          ) : (
             <div className="flex items-start justify-between group/label">
                 <div className="flex flex-col overflow-hidden">
                    {item.label ? (
                        <div className="flex items-center gap-2">
                             <span className="text-base font-medium text-white truncate">{item.label}</span>
                             <button 
                                onClick={handleStartEdit}
                                className="opacity-100 sm:opacity-0 sm:group-hover/label:opacity-100 sm:group-focus-within/label:opacity-100 sm:focus:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity p-2 sm:p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded"
                                title="Edit Label"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                             </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleStartEdit}
                            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 mb-0.5"
                        >
                            + Add Label
                        </button>
                    )}
                    <span className="text-xs text-slate-400 truncate" title={item.originalUrl}>
                        {item.originalUrl}
                    </span>
                 </div>
             </div>
          )}
        </div>

        {/* List Badges */}
        {itemLists.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {itemLists.map(list => (
              <span 
                key={list.id} 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700 text-slate-300 border border-slate-600"
              >
                {list.name}
                <button
                  onClick={() => onRemoveFromList(item.id, list.id)}
                  className="ml-1 -mr-1 p-1 text-slate-400 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded"
                  title={`Remove from list ${list.name}`}
                  aria-label={`Remove from list ${list.name}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 sm:p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ml-1"
        aria-label="Remove item"
        title="Delete Link permanently"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};
