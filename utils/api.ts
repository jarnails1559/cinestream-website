const API_BASE_URL = 'https://rivestream.live/api/backendfetch';
const CORS_PROXY = 'https://cors-proxy.rdpsell01.workers.dev/';

export async function fetchFromAPI(endpoint: string, params: Record<string, string>) {
  const url = new URL(API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => 
    url.searchParams.append(key, value)
  );

  const proxyUrl = `${CORS_PROXY}${url.toString()}`;

  const response = await fetch(proxyUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function searchMedia(query: string) {
  return fetchFromAPI('', {
    requestID: 'searchMulti',
    query,
  });
}

export async function getMovieDetails(id: string) {
  return fetchFromAPI('', {
    requestID: 'movieData',
    id,
    language: 'en-US',
  });
}

export async function getTVShowDetails(id: string) {
  return fetchFromAPI('', {
    requestID: 'tvData',
    id,
    language: 'en-US',
  });
}