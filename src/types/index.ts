// Document types
export interface DocumentInfo {
  id: string;
  name: string;
  size: number;
  uploadedAt: bigint;
  mimeType: string;
  pageCount?: number;
}

export interface DocumentUploadProgress {
  documentId?: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: bigint;
  documentIds?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: bigint;
  updatedAt: bigint;
  documentIds: string[];
}

export interface ChatSessionInfo {
  id: string;
  title: string;
  createdAt: bigint;
  updatedAt: bigint;
  messageCount: number;
  documentIds: string[];
}

// User profile types
export interface UserProfile {
  id: string;
  displayName?: string;
  createdAt: bigint;
}

// UI state types
export type SidebarState = "expanded" | "collapsed";

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
};
