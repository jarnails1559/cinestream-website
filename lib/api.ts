const CORS_PROXY = 'https://cors-proxy.rdpsell01.workers.dev/';
const BASE_URL = `https://imdb-api.rdpsell01.workers.dev`;
const RIVESTREAM_BASE_URL = `${CORS_PROXY}https://rivestream.live/api`;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export interface MovieSearchResult {
  id: string;
  title: string;
  year: number;
  type: string; // This should be either 'movie' or 'tvSeries'
  image: string;
  image_large: string;
  api_path: string;
  imdb: string;
}

export interface MovieDetails {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  release_date: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  original_title: string;
  original_language: string;
  popularity: number;
}

export interface StreamingLink {
  quality: string;
  url: string;
  source: string;
  format: string;
}

export interface TrendingMovie {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TrendingMoviesResponse {
  page: number;
  results: TrendingMovie[];
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=searchMulti&query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }
  const data = await response.json();
  
  // Map the response to match the MovieSearchResult interface
  return data.results.map((item: any) => ({
    id: item.id.toString(),
    title: item.title || item.name,
    year: new Date(item.release_date || item.first_air_date).getFullYear(),
    type: item.media_type === 'movie' ? 'movie' : 'tvSeries',
    image: item.poster_path,
    image_large: item.backdrop_path,
    api_path: item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`,
    imdb: item.id.toString(),
  }));
}

export async function getMovieDetails(imdbId: string): Promise<MovieDetails> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?id=${imdbId}&requestID=movieData&language=en-US`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function getHindiStreamingLinks(imdbId: string): Promise<StreamingLink[]> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=movieVideoProvider&id=${imdbId}&service=indian`);
  const data = await response.json();
  return data.data.sources;
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder.svg'; // Return placeholder SVG if path is null or undefined
  if (path.startsWith('http')) {
    return `${CORS_PROXY}${path}`;
  }
  return `${CORS_PROXY}${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

// Add this function to get a random item from an array
export function getRandomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export async function getTrendingMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=trendingMovie&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Add these new functions at the end of the file

export function addToWatchlist(item: TrendingMovie | MovieDetails | TVShow) {
  const watchlist = getWatchlist();
  const isAlreadyInWatchlist = watchlist.some(watchlistItem => watchlistItem.id === item.id);
  if (!isAlreadyInWatchlist) {
    watchlist.push(item);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
}

export function removeFromWatchlist(movieId: number) {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
}

export function getWatchlist(): (TrendingMovie | MovieDetails | TVShow)[] {
  const watchlistJSON = localStorage.getItem('watchlist');
  return watchlistJSON ? JSON.parse(watchlistJSON) : [];
}

export function isInWatchlist(movieId: number): boolean {
  const watchlist = getWatchlist();
  return watchlist.some(movie => movie.id === movieId);
}

// Add this new function to lib/api.ts
export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TrendingMoviesResponse> {
  console.log(`Fetching movies for genre ID: ${genreId}, page: ${page}`);
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=trendingMovie&language=en-US&page=${page}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("API response data:", data);
  
  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid API response: results array is missing or not an array");
  }
  
  // Filter the results to only include movies with the specified genre
  const filteredResults = data.results.filter((movie: TrendingMovie) => 
    movie.genre_ids.includes(genreId)
  );
  
  console.log(`Filtered ${filteredResults.length} movies for genre ID ${genreId}`);

  return {
    ...data,
    results: filteredResults
  };
}

// Update this object to map genre IDs to their corresponding names
export const genreMap: { [key: number]: string } = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'science fiction',
  10770: 'tv movie',
  53: 'thriller',
  10752: 'war',
  37: 'western'
};

// Function to get genre names from genre IDs
export function getGenreNames(genreIds: number[]): string[] {
  return genreIds.map(id => genreMap[id] || 'Unknown');
}

// ... existing code ...

export async function getTopRatedMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=topRatedMovie&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch top rated movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// ... (rest of the code remains the same)

// Add this new function
export async function getSuggestedMovies(movie: MovieDetails, page: number = 1): Promise<TrendingMovie[]> {
  const trendingMovies = await getTrendingMovies(page);
  const movieGenreIds = movie.genres.map(genre => genre.id);
  
  return trendingMovies.results.filter(trendingMovie => 
    trendingMovie.id !== movie.id && // Exclude the current movie
    trendingMovie.genre_ids.some(genreId => movieGenreIds.includes(genreId))
  ).slice(0, 6); // Limit to 6 suggested movies
}

// ... rest of the file remains the same

// Add these new functions
export function addToRecentlyViewed(item: TrendingMovie | MovieDetails | TVShow) {
  const recentlyViewed = getRecentlyViewed();
  const updatedRecentlyViewed = [item, ...recentlyViewed.filter(m => m.id !== item.id)].slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
}

export function getRecentlyViewed(): (TrendingMovie | MovieDetails | TVShow)[] {
  const recentlyViewedJSON = localStorage.getItem('recentlyViewed');
  return recentlyViewedJSON ? JSON.parse(recentlyViewedJSON) : [];
}

// ... rest of the file remains the same


// Add new functions to fetch movies and TV shows
export async function getMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=trendingMovie&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function getTVShows(page: number = 1): Promise<TVShowsResponse> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=trendingTvDay&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids?: number[]; // Make this optional
  genres?: { id: number; name: string }[]; // Make genres optional
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  last_air_date: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  seasons: {
    id: number;
    name: string;
    episode_count: number;
    season_number: number; // Add this line
    poster_path: string | null;
    air_date: string | null;
  }[];
  type?: string; // Add this line to include the 'type' property as optional
}

export interface TVShowsResponse {
  page: number;
  results: TVShow[];
}

export async function getTVShowDetails(id: string): Promise<TVShow> {
  console.log(`Fetching TV show details for ID: ${id}`);
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?id=${id}&requestID=tvData&language=en-US`);
  
  if (!response.ok) {
    console.error(`API request failed with status: ${response.status}`);
    throw new Error(`Failed to fetch TV show details: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("API response data:", data);
  
  if (!data || typeof data !== 'object') {
    console.error("Invalid API response:", data);
    throw new Error("Invalid API response: data is missing or not an object");
  }
  
  // Check if the response has the expected TV show properties
  if (!data.name || !data.id || !data.overview) {
    console.error("API response is missing expected TV show properties:", data);
    throw new Error("Invalid API response: missing TV show properties");
  }
  
  return data as TVShow;
}

export async function getSuggestedTVShows(tvShow: TVShow, page: number = 1): Promise<TVShow[]> {
  console.log(`Fetching suggested TV shows for: ${tvShow.name}`);
  const allTVShows = await getTVShows(page);
  
  // Extract genre IDs from the tvShow.genres array
  const tvShowGenreIds = tvShow.genres?.map(genre => genre.id) || [];

  // Filter TV shows based on matching genres
  const suggestedShows = allTVShows.results.filter(show => 
    show.id !== tvShow.id && // Exclude the current show
    show.genres && // Check if genres exist
    show.genres.some(genre => tvShowGenreIds.includes(genre.id))
  );

  console.log(`Found ${suggestedShows.length} suggested TV shows`);
  
  // Shuffle the array and return up to 6 suggested shows
  return shuffleArray(suggestedShows).slice(0, 6);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ... (rest of the code remains the same)

// Add this new interface
export interface TVStreamingLink {
  quality: string;
  url: string;
  source: string;
  format: string;
}

// Add this new function
export async function getTVStreamingLinks(tvShowId: string, season: number, episode: number): Promise<TVStreamingLink[]> {
  const response = await fetch(`${RIVESTREAM_BASE_URL}/backendfetch?requestID=tvVideoProvider&id=${tvShowId}&season=${season}&episode=${episode}&service=indian`);
  if (!response.ok) {
    throw new Error(`Failed to fetch TV streaming links: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data.sources;
}
