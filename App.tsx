import React, { useState, useMemo } from 'react';
import { usePersistentLinks } from './hooks/usePersistentLinks';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LinkList } from './components/LinkList';
import { ResultDisplay } from './components/ResultDisplay';
import { Sidebar } from './components/Sidebar';
import { Instructions } from './components/Instructions';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const { 
    links, 
    lists,
    addLink,
    updateLink,
    removeLink, 
    clearLinks,
    createList,
    deleteList,
    addLinksToList,
    removeLinkFromList,
    importData
  } = usePersistentLinks();

  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter links based on active list and search query
  const filteredLinks = useMemo(() => {
    let result = links;

    // 1. Filter by List
    if (activeListId !== null) {
      result = result.filter(link => {
        // Defensive: ensure listIds exists
        const ids = link.listIds || [];
        return ids.includes(activeListId);
      });
    }

    // 2. Filter by Search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(link => 
        (link.label && link.label.toLowerCase().includes(q)) ||
        (link.originalUrl && link.originalUrl.toLowerCase().includes(q)) ||
        (link.numericId && link.numericId.includes(q))
      );
    }
    
    return result;
  }, [links, activeListId, searchQuery]);

  const handleSelectList = (id: string | null) => {
    setActiveListId(id);
    setSearchQuery(''); // Reset search when switching lists
  };

  const handleImportData = (data: unknown) => {
    const result = importData(data);
    if (result.success) {
      setActiveListId(null);
      setSearchQuery('');
    }
    return result;
  };

  return (
    <div className="min-h-[100dvh] bg-slate-900 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Header />

        <Instructions />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar - Left Column on Desktop */}
          <div className="lg:col-span-3">
            <Sidebar 
              lists={lists}
              links={links}
              activeListId={activeListId}
              onSelectList={handleSelectList}
              onCreateList={createList}
              onDeleteList={deleteList}
              onImportData={handleImportData}
            />
          </div>

          {/* Main Content - Right Column on Desktop */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Input Form is always visible, adds to the main pool of links */}
            <InputForm onAdd={addLink} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              
              <LinkList 
                links={filteredLinks} 
                lists={lists}
                onUpdateLabel={updateLink}
                onRemove={removeLink} 
                onClear={clearLinks}
                onAddLinksToList={addLinksToList}
                onRemoveLinkFromList={removeLinkFromList}
                activeListId={activeListId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <ResultDisplay links={filteredLinks} />

            </div>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
