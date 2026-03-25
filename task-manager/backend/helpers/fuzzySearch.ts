import {
  Extractor,
  FuzzySearchOptions,
  FuzzySearchResult,
} from "../types/FuzzySearch";

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function levenshteinDistance(a: string, b: string): number {
  const left = normalizeText(a);
  const right = normalizeText(b);

  const aLen = left.length;
  const bLen = right.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  let previousRow = new Array<number>(bLen + 1);
  let currentRow = new Array<number>(bLen + 1);

  for (let j = 0; j <= bLen; j++) {
    previousRow[j] = j;
  }

  for (let i = 1; i <= aLen; i++) {
    currentRow[0] = i;

    for (let j = 1; j <= bLen; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;

      currentRow[j] = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + cost,
      );
    }

    [previousRow, currentRow] = [currentRow, previousRow];
  }

  return previousRow[bLen];
}

export function similarityScore(a: string, b: string): number {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left && !right) return 1;
  if (!left || !right) return 0;
  if (left === right) return 1;

  const distance = levenshteinDistance(left, right);
  const maxLen = Math.max(left.length, right.length);

  return 1 - distance / maxLen;
}

function buildCandidates(text: string, query: string): string[] {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  const textWords = normalizedText.split(" ").filter(Boolean);
  const queryWords = normalizedQuery.split(" ").filter(Boolean);

  const candidates = new Set<string>();
  candidates.add(normalizedText);

  for (const word of textWords) {
    candidates.add(word);
  }

  const windowSize = queryWords.length || 1;

  for (let i = 0; i <= textWords.length - windowSize; i++) {
    candidates.add(textWords.slice(i, i + windowSize).join(" "));
  }

  return [...candidates];
}

export function fuzzySearch<T>(
  items: T[],
  query: string,
  options: FuzzySearchOptions<T> = {},
): FuzzySearchResult<T>[] {
  const {
    extractor = ((item: T) => String(item)) as Extractor<T>,
    threshold = 0.45,
    limit = 10,
  } = options;

  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  const results: FuzzySearchResult<T>[] = [];

  for (const item of items) {
    const extracted = extractor(item);
    const texts = Array.isArray(extracted) ? extracted : [extracted];

    let bestScore = 0;
    let bestMatch = "";

    for (const text of texts) {
      const normalizedText = normalizeText(text);

      if (!normalizedText) continue;

      if (normalizedText.includes(normalizedQuery)) {
        bestScore = 1;
        bestMatch = normalizedText;
        break;
      }

      const candidates = buildCandidates(normalizedText, normalizedQuery);

      for (const candidate of candidates) {
        const score = similarityScore(candidate, normalizedQuery);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = candidate;
        }
      }
    }

    if (bestScore >= threshold) {
      results.push({
        item,
        score: bestScore,
        matchedBy: bestMatch,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
