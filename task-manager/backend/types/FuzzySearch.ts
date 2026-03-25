export type Extractor<T> = (item: T) => string | string[];

export interface FuzzySearchOptions<T> {
  extractor?: Extractor<T>;
  threshold?: number;
  limit?: number;
}

export interface FuzzySearchResult<T> {
  item: T;
  score: number;
  matchedBy: string;
}
