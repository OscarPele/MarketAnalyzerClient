export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

const { VITE_API_BASE_URL, VITE_API_KEY } = import.meta.env as any;
const API_BASE: string = VITE_API_BASE_URL ?? "http://localhost:8080";
const API_KEY: string = VITE_API_KEY ?? "";

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, API_BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function request<T>(method: string, path: string, opt: RequestOptions = {}): Promise<T> {
  if (!API_KEY) throw new Error("Falta VITE_API_KEY en el cliente.");

  const { params, timeoutMs = 10000, headers = {}, body } = opt;

  const h: Record<string, string> = {
    Accept: "application/json",
    "X-API-KEY": API_KEY,
    ...headers,
  };
  if (body !== undefined) h["Content-Type"] = "application/json";

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    mode: "cors",
    signal: controller.signal,
  }).finally(() => clearTimeout(t));

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string, opt?: Omit<RequestOptions, "body">) => request<T>("GET", path, opt),
  post: <T>(path: string, body?: unknown, opt?: Omit<RequestOptions, "body">) =>
    request<T>("POST", path, { ...opt, body }),
  put:  <T>(path: string, body?: unknown, opt?: Omit<RequestOptions, "body">) =>
    request<T>("PUT", path, { ...opt, body }),
  del:  <T>(path: string, opt?: Omit<RequestOptions, "body">) =>
    request<T>("DELETE", path, opt),
};
