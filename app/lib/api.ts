const DEFAULT_API_URL = `http://localhost:${process.env.PORT ?? "3000"}/api`;

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function safeFetchJson<T>(path: string): Promise<T | null> {
  const url = buildApiUrl(path);

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`Error al consultar ${url}:`, response.status, response.statusText);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error de red al consultar ${url}:`, error);
    return null;
  }
}
