import { useState, useEffect, useCallback } from 'react';
import { ParsedLink, CustomList, BackupData } from '../types';
import { parseAndValidateUrl } from '../utils/parser';

const STORAGE_KEY_LINKS = 'ao3_filter_links';
const STORAGE_KEY_LISTS = 'ao3_filter_lists';
const CURRENT_BACKUP_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
};

const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeBackupData = (
  raw: unknown
): { success: true; data: BackupData } | { success: false; error: string } => {
  if (!isRecord(raw)) {
    return { success: false, error: "Invalid backup file format." };
  }

  const rawLinks = raw.links;
  const rawLists = raw.lists;

  if (!Array.isArray(rawLinks) || !Array.isArray(rawLists)) {
    return { success: false, error: "Invalid backup file format." };
  }

  const version =
    typeof raw.version === 'number' && Number.isFinite(raw.version)
      ? raw.version
      : CURRENT_BACKUP_VERSION;

  const timestamp =
    typeof raw.timestamp === 'number' && Number.isFinite(raw.timestamp)
      ? raw.timestamp
      : Date.now();

  const lists: CustomList[] = rawLists
    .filter(isRecord)
    .map((list) => {
      const id = typeof list.id === 'string' ? list.id : null;
      const name = typeof list.name === 'string' ? list.name.trim() : '';

      if (!id || !name) return null;
      return { id, name } satisfies CustomList;
    })
    .filter((list): list is CustomList => list !== null);

  const listIdSet = new Set(lists.map((l) => l.id));

  const links: ParsedLink[] = rawLinks
    .filter(isRecord)
    .map((link): ParsedLink | null => {
      const id = typeof link.id === 'string' ? link.id : createId();

      const numericIdRaw = link.numericId;
      const numericId =
        typeof numericIdRaw === 'string'
          ? numericIdRaw.trim()
          : typeof numericIdRaw === 'number' && Number.isFinite(numericIdRaw)
            ? String(numericIdRaw)
            : '';

      if (!numericId || !/^\d+$/.test(numericId)) return null;

      const originalUrlRaw = typeof link.originalUrl === 'string' ? link.originalUrl.trim() : '';
      const originalUrl = originalUrlRaw || `https://archiveofourown.org/tags/${numericId}`;

      const timestampValue =
        typeof link.timestamp === 'number' && Number.isFinite(link.timestamp)
          ? link.timestamp
          : Date.now();

      const label = typeof link.label === 'string' ? link.label.trim() : '';

      const listIds = Array.from(
        new Set(normalizeStringArray(link.listIds).filter((listId) => listIdSet.has(listId)))
      );

      const parsedLink: ParsedLink = {
        id,
        originalUrl,
        numericId,
        timestamp: timestampValue,
        listIds,
        ...(label ? { label } : {}),
      };

      return parsedLink;
    })
    .filter((link): link is ParsedLink => link !== null);

  return {
    success: true,
    data: {
      version,
      timestamp,
      links,
      lists,
    },
  };
};

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
      id: createId(),
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
      id: createId(),
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

  const importData = useCallback((data: unknown) => {
    const normalized = normalizeBackupData(data);
    if (!normalized.success) {
      return { success: false, error: normalized.error };
    }

    // Replace current state with backup
    setLinks(normalized.data.links);
    setLists(normalized.data.lists);
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
