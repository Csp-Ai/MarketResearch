export interface CrawlOptions {
  baseUrl: string;
  maxDepth: number;
  log?: (depth: number) => void;
}

/**
 * Simple crawler that logs the current depth before visiting a level.
 * It does not perform any network requests – depth logging is the
 * only side effect and enables easy verification in tests.
 */
export async function crawl({ baseUrl, maxDepth, log = () => {} }: CrawlOptions): Promise<void> {
  for (let depth = 0; depth <= maxDepth; depth++) {
    log(depth);
  }
}
