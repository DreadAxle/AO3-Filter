import React, { useState } from 'react';

export const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors focus:outline-none group"
      >
        <span className="flex items-center gap-2 text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          How to Use & Instructions
        </span>
         <svg 
            className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base border-t border-slate-700/50 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* App Instructions */}
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg border-b border-slate-700 pb-2">How to use the App</h4>
                    <p className="text-slate-400">
                        This app extracts ID numbers from AO3 feed URLs to create powerful search filters.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-slate-400 ml-1">
                        <li>Go to an AO3 tag or fandom page (e.g., the page listing works for a character).</li>
                        <li>Right-click the <span className="text-orange-400 font-medium bg-slate-900 px-1 rounded">RSS Feed</span> button and select <strong>Copy Link Address</strong>.</li>
                        <li>Paste that link into the <strong>Tag URL</strong> field in this app.</li>
                        <li>(Optional) Add a label so you know what the ID represents.</li>
                        <li>Click <strong>Add</strong>.</li>
                        <li>Use the checkboxes or lists to select which tags you want to filter for.</li>
                        <li>Copy the code from the <strong>Generated Filter Query</strong> box.</li>
                    </ol>
                </div>

                 {/* AO3 Instructions */}
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg border-b border-slate-700 pb-2">How to use in AO3</h4>
                    <p className="text-slate-400 mb-2">
                        Once you have copied the query string from this app, you can use it in two ways on Archive of Our Own:
                    </p>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-900/40 p-3 rounded border border-slate-700/50">
                            <h5 className="font-semibold text-indigo-300">Option 1: Search within Results</h5>
                            <p className="text-slate-400 text-sm mt-1">
                                If you are already searching works by tag, look for the sidebar on the right. 
                                Scroll down to the <strong>"Search within results"</strong> field, paste your code there, and press Enter.
                            </p>
                        </div>

                        <div className="bg-slate-900/40 p-3 rounded border border-slate-700/50">
                             <h5 className="font-semibold text-indigo-300">Option 2: Advanced / Edit Search</h5>
                             <p className="text-slate-400 text-sm mt-1">
                                Start a new search by clicking <strong>Search</strong> &gt; <strong>Edit Search</strong>, or selecting <strong>Works</strong> from the top dropdown menu.
                                Paste your code into the <strong>"Any field"</strong> input box.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};