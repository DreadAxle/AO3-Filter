import { useState, useEffect, useCallback } from 'react';
import { ParsedLink, CustomList, BackupData } from '../types';
import { parseAndValidateUrl } from '../utils/parser';

const STORAGE_KEY_LINKS = 'ao3_filter_links';
const STORAGE_KEY_LISTS = 'ao3_filter_lists';

export const usePersistentLinks = () => {
  // --- LINKS STATE ---
  const [links, setLinks] = useState<ParsedLink[]>(() => {
    try {
      const savedLinks = localStorage.getItem(STORAGE_KEY_LINKS);
      if (savedLinks) {
        const parsed = JSON.parse(savedLinks);
        // Migration: Ensure listIds exists on old data
        return parsed.map((link: any) => ({ ...link, listIds: link.listIds || [] }));
      }
      return [];
    } catch (e) {
      console.error("Failed to load links", e);
      return [];
    }
  });

  // --- LISTS STATE ---
  const [lists, setLists] = useState<CustomList[]>(() => {
    try {
      const savedLists = localStorage.getItem(STORAGE_KEY_LISTS);
      return savedLists ? JSON.parse(savedLists) : [];
    } catch (e) {
      console.error("Failed to load lists", e);
      return [];
    }
  });

  // Persist Links
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
    } catch (e) {
      console.error("Failed to save links", e);
    }
  }, [links]);

  // Persist Lists
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(lists));
    } catch (e) {
      console.error("Failed to save lists", e);
    }
  }, [lists]);

  // --- LINK ACTIONS ---

  const addLink = useCallback((urlInput: string, labelInput: string) => {
    const trimmedInput = urlInput.trim();
    const trimmedLabel = labelInput.trim();

    if (!trimmedInput) return { success: false };

    const { id: numericId, error } = parseAndValidateUrl(trimmedInput);

    if (error || !numericId) {
      return { success: false, error: error || "Invalid URL structure." };
    }

    if (links.some(link => link.numericId === numericId)) {
      return { success: false, error: "This tag ID has already been added." };
    }

    const newLink: ParsedLink = {
      id: crypto.randomUUID(),
      originalUrl: trimmedInput,
      numericId: numericId,
      timestamp: Date.now(),
      label: trimmedLabel || undefined,
      listIds: [],
    };

    setLinks(prev => [newLink, ...prev]);
    return { success: true };
  }, [links]);

  const updateLink = useCallback((id: string, newLabel: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, label: newLabel.trim() || undefined } : link
    ));
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const clearLinks = useCallback(() => {
    setLinks([]);
  }, []);

  // --- LIST ACTIONS ---

  const createList = useCallback((name: string) => {
    if (!name.trim()) return;
    const newList: CustomList = {
      id: crypto.randomUUID(),
      name: name.trim()
    };
    setLists(prev => [...prev, newList]);
  }, []);

  const deleteList = useCallback((listId: string) => {
    // Remove the list
    setLists(prev => prev.filter(l => l.id !== listId));
    
    // Remove this listId from all links
    setLinks(prev => prev.map(link => ({
      ...link,
      listIds: link.listIds.filter(id => id !== listId)
    })));
  }, []);

  const addLinksToList = useCallback((linkIds: string[], listId: string) => {
    setLinks(prev => prev.map(link => {
      if (linkIds.includes(link.id)) {
        // Prevent duplicates in listIds
        if (!link.listIds.includes(listId)) {
          return { ...link, listIds: [...link.listIds, listId] };
        }
      }
      return link;
    }));
  }, []);

  const removeLinkFromList = useCallback((linkId: string, listId: string) => {
    setLinks(prev => prev.map(link => {
      if (link.id === linkId) {
        return { ...link, listIds: link.listIds.filter(id => id !== listId) };
      }
      return link;
    }));
  }, []);

  // --- IMPORT/EXPORT ACTIONS ---

  const importData = useCallback((data: BackupData) => {
    if (!data || !Array.isArray(data.links) || !Array.isArray(data.lists)) {
      return { success: false, error: "Invalid backup file format." };
    }
    
    // Replace current state with backup
    setLinks(data.links);
    setLists(data.lists);
    return { success: true };
  }, []);

  return {
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
  };
};