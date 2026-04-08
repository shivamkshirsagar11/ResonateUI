import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type ChatSessionId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ChatSessionInfo {
    id: ChatSessionId;
    title: string;
    documentIds: Array<DocumentId>;
    createdAt: Timestamp;
    messageCount: bigint;
}
export interface DocumentInfo {
    id: DocumentId;
    title: string;
    blob: ExternalBlob;
    fileSize: bigint;
    fileType: string;
    uploadedAt: Timestamp;
}
export interface ChatSession {
    id: ChatSessionId;
    title: string;
    documentIds: Array<DocumentId>;
    messages: Array<ChatMessage>;
    owner: UserId;
    createdAt: Timestamp;
}
export type MessageId = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type DocumentId = bigint;
export interface ChatMessage {
    id: MessageId;
    content: string;
    role: MessageRole;
    timestamp: Timestamp;
}
export interface UserProfile {
    name: string;
}
export enum MessageRole {
    user = "user",
    assistant = "assistant"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatSession(documentIds: Array<DocumentId>, title: string): Promise<ChatSessionInfo>;
    deleteChatSession(sessionId: ChatSessionId): Promise<void>;
    deleteDocument(docId: DocumentId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatSession(sessionId: ChatSessionId): Promise<ChatSession | null>;
    getDocument(docId: DocumentId): Promise<DocumentInfo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listChatSessions(): Promise<Array<ChatSessionInfo>>;
    listDocuments(): Promise<Array<DocumentInfo>>;
    renameDocument(docId: DocumentId, newTitle: string): Promise<DocumentInfo>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(sessionId: ChatSessionId, content: string): Promise<ChatMessage>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    uploadDocument(title: string, fileType: string, fileSize: bigint, blob: ExternalBlob): Promise<DocumentInfo>;
}
