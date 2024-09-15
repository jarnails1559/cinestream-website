export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  title: string;
  year: number;
  poster: string;
  genre: string;
}

export interface SearchResult {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  media_type: string;
}