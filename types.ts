export interface CustomList {
  id: string;
  name: string;
}

export interface ParsedLink {
  id: string; // Unique identifier for the list item (UUID)
  originalUrl: string;
  numericId: string;
  timestamp: number;
  label?: string;
  listIds: string[]; // Array of CustomList IDs this link belongs to
}

export interface BackupData {
  version: number;
  timestamp: number;
  links: ParsedLink[];
  lists: CustomList[];
}