export interface CrawlResult {
  discoveredUrls: string[];
}

export type Fetcher = (url: string) => Promise<string>;

// A simple breadth-first crawler that stops when maxDepth is reached.
export async function crawlSite(
  baseUrl: string,
  maxDepth: number,
  fetcher: Fetcher = defaultFetcher
): Promise<CrawlResult> {
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [];
  const discovered: string[] = [];

  visited.add(baseUrl);
  queue.push({ url: baseUrl, depth: 0 });

  while (queue.length) {
    const { url, depth } = queue.shift()!;
    discovered.push(url);
    if (depth >= maxDepth) continue;
    try {
      const html = await fetcher(url);
      const links = extractLinks(html, baseUrl);
      for (const link of links) {
        if (!visited.has(link)) {
          visited.add(link);
          queue.push({ url: link, depth: depth + 1 });
        }
      }
    } catch {
      // ignore fetch errors in this simple implementation
    }
  }

  return { discoveredUrls: discovered };
}

async function defaultFetcher(url: string): Promise<string> {
  const res = await fetch(url);
  return res.text();
}

function extractLinks(html: string, base: string): string[] {
  const links: string[] = [];
  const regex = /href="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], base).toString();
      links.push(resolved);
    } catch {
      // skip invalid URLs
    }
  }
  return links;
}
