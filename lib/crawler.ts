export interface Page {
  url: string;
  links: string[];
}

export type FetchPage = (url: string) => Promise<Page> | Page;

/**
 * Crawl starting from `startUrl` using provided `fetchPage` callback.
 * The crawler stops when `pageLimit` pages have been visited.
 */
export async function crawl(
  startUrl: string,
  fetchPage: FetchPage,
  pageLimit: number
): Promise<Page[]> {
  const visited = new Set<string>();
  const result: Page[] = [];
  const queue: string[] = [startUrl];

  while (queue.length > 0 && visited.size < pageLimit) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    const page = await fetchPage(url);
    visited.add(url);
    result.push(page);
    for (const link of page.links) {
      if (!visited.has(link)) {
        queue.push(link);
      }
    }
  }
  return result;
}
