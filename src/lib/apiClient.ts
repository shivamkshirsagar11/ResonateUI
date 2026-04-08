// REST API client for the Resonate BE backend
// Automatically picks up the base URL from VITE_API_URL or defaults to same origin
const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserOut {
  username: string;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface APIError {
  detail?: string | ValidationError[];
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as APIError;
      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
        errorMessage = data.detail.map((e) => e.msg).join(", ");
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  /** POST /auth/signup */
  signup: (data: UserCreate) =>
    request<UserOut>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** POST /auth/login — returns token */
  login: (data: UserLogin) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** GET /auth/me — returns current user */
  me: (token: string) => request<UserOut>("/auth/me", { token }),

  /** POST /upload/file */
  uploadFile: (file: File, docType: string, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", docType);
    return fetch(`${BASE_URL}/upload/file`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  /** POST /chat/query */
  queryDocs: (question: string, token: string) =>
    request<unknown>("/chat/query", {
      method: "POST",
      body: JSON.stringify({ question }),
      token,
    }),

  /** GET /chat/debug/chunks */
  getChunks: (fileId: string, token: string, limit = 10, section?: string) => {
    const params = new URLSearchParams({
      file_id: fileId,
      limit: String(limit),
    });
    if (section) params.set("section", section);
    return request<unknown>(`/chat/debug/chunks?${params}`, { token });
  },
};
