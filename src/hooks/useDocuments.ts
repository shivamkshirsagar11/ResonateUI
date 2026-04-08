import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { DocumentInfo, DocumentUploadProgress } from "../types";

// Mock document data for demo — replace with actor calls when backend is wired
const DEMO_DOCUMENTS: DocumentInfo[] = [
  {
    id: "doc-1",
    name: "Q4 Financial Report.pdf",
    size: 2_400_000,
    uploadedAt: BigInt(Date.now() - 86400000 * 3),
    mimeType: "application/pdf",
    pageCount: 42,
  },
  {
    id: "doc-2",
    name: "Product Roadmap 2026.pdf",
    size: 1_200_000,
    uploadedAt: BigInt(Date.now() - 86400000 * 7),
    mimeType: "application/pdf",
    pageCount: 18,
  },
  {
    id: "doc-3",
    name: "Engineering Specs v3.docx",
    size: 850_000,
    uploadedAt: BigInt(Date.now() - 86400000 * 14),
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pageCount: 31,
  },
  {
    id: "doc-4",
    name: "Customer Research Summary.pdf",
    size: 3_100_000,
    uploadedAt: BigInt(Date.now() - 86400000 * 21),
    mimeType: "application/pdf",
    pageCount: 56,
  },
];

let mockDocs = [...DEMO_DOCUMENTS];

export function useDocuments() {
  return useQuery<DocumentInfo[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      return mockDocs;
    },
    staleTime: 30_000,
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      await new Promise((r) => setTimeout(r, 400));
      mockDocs = mockDocs.filter((d) => d.id !== documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useRenameDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      documentId,
      name,
    }: { documentId: string; name: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      mockDocs = mockDocs.map((d) =>
        d.id === documentId ? { ...d, name } : d,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] =
    useState<DocumentUploadProgress | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress({
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      // Simulate chunked upload progress
      for (let p = 0; p <= 80; p += 10) {
        await new Promise((r) => setTimeout(r, 120));
        setUploadProgress((prev) => (prev ? { ...prev, progress: p } : null));
      }

      setUploadProgress((prev) =>
        prev ? { ...prev, progress: 90, status: "processing" } : null,
      );
      await new Promise((r) => setTimeout(r, 500));

      const newDoc: DocumentInfo = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: file.size,
        uploadedAt: BigInt(Date.now()),
        mimeType: file.type,
      };

      mockDocs = [newDoc, ...mockDocs];

      setUploadProgress((prev) =>
        prev
          ? {
              ...prev,
              progress: 100,
              status: "complete",
              documentId: newDoc.id,
            }
          : null,
      );

      await new Promise((r) => setTimeout(r, 800));
      setUploadProgress(null);

      return newDoc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return { ...mutation, uploadProgress };
}
