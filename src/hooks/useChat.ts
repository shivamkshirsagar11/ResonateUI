import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, ChatSession, ChatSessionInfo } from "../types";

// Mock data for demo
const DEMO_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "Q4 Financial Analysis",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "What were the key revenue drivers in Q4?",
        timestamp: BigInt(Date.now() - 3600000),
        documentIds: ["doc-1"],
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Based on the Q4 Financial Report, the key revenue drivers were: **1) Enterprise subscriptions** grew 34% YoY driven by larger deal sizes, **2) International expansion** contributed $12M in new ARR, and **3) Product-led growth** added 2,400 self-serve customers. The report highlights that enterprise deals over $100K increased by 67%, signaling strong upmarket momentum.",
        timestamp: BigInt(Date.now() - 3540000),
        documentIds: ["doc-1"],
      },
    ],
    createdAt: BigInt(Date.now() - 86400000),
    updatedAt: BigInt(Date.now() - 3540000),
    documentIds: ["doc-1"],
  },
  {
    id: "session-2",
    title: "Product Roadmap Review",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "What are the top 3 features planned for H1 2026?",
        timestamp: BigInt(Date.now() - 7200000),
        documentIds: ["doc-2"],
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "According to the Product Roadmap 2026 document, the top 3 features for H1 2026 are: **1) AI-powered search** with semantic understanding across all documents, **2) Collaborative workspaces** enabling team-based document analysis, and **3) API integrations** with Salesforce, Notion, and Slack. The roadmap indicates these are scheduled for Q1 and Q2 respectively.",
        timestamp: BigInt(Date.now() - 7140000),
        documentIds: ["doc-2"],
      },
    ],
    createdAt: BigInt(Date.now() - 172800000),
    updatedAt: BigInt(Date.now() - 7140000),
    documentIds: ["doc-2"],
  },
];

let mockSessions = [...DEMO_SESSIONS];

export function useChatSessions() {
  return useQuery<ChatSessionInfo[]>({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockSessions.map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s.messages.length,
        documentIds: s.documentIds,
      }));
    },
    staleTime: 30_000,
  });
}

export function useChatSession(sessionId: string | null) {
  return useQuery<ChatSession | null>({
    queryKey: ["chat-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      await new Promise((r) => setTimeout(r, 300));
      return mockSessions.find((s) => s.id === sessionId) ?? null;
    },
    enabled: !!sessionId,
    staleTime: 10_000,
  });
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      documentIds,
    }: { title: string; documentIds: string[] }) => {
      await new Promise((r) => setTimeout(r, 300));
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title,
        messages: [],
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
        documentIds,
      };
      mockSessions = [newSession, ...mockSessions];
      return newSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      await new Promise((r) => setTimeout(r, 300));
      mockSessions = mockSessions.filter((s) => s.id !== sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      content,
    }: { sessionId: string; content: string }) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-u`,
        role: "user",
        content,
        timestamp: BigInt(Date.now()),
      };

      // Optimistically add user message
      mockSessions = mockSessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              updatedAt: BigInt(Date.now()),
            }
          : s,
      );

      queryClient.setQueryData<ChatSession | null>(
        ["chat-session", sessionId],
        (old) =>
          old ? { ...old, messages: [...old.messages, userMsg] } : null,
      );

      // Simulate AI streaming response delay
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: "assistant",
        content: `I've analyzed your documents and found relevant information. Based on the content, ${content.toLowerCase().includes("what") ? "here is what I found: the documents contain detailed analysis and insights that directly address your question. The key findings indicate significant patterns and correlations that are worth noting." : "let me provide a comprehensive answer based on the available documentation. The documents reveal several important aspects that are relevant to your inquiry, with specific data points supporting the main conclusions."} Would you like me to dive deeper into any specific aspect?`,
        timestamp: BigInt(Date.now()),
      };

      mockSessions = mockSessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, assistantMsg],
              updatedAt: BigInt(Date.now()),
            }
          : s,
      );

      return assistantMsg;
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["chat-session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}
