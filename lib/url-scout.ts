import crypto from 'node:crypto';

export interface CrawlConfig {
  baseUrl: string;
  maxDepth: number;
  maxPages?: number;
  fetchFn?: (url: string) => Promise<string>;
}

export interface CrawlResult {
  crawlId: string;
  discoveredUrls: string[];
  total: number;
}

export class PageLimitExceededError extends Error {
  constructor(limit: number) {
    super(`Page limit exceeded: ${limit}`);
    this.name = 'PageLimitExceededError';
  }
}

async function defaultFetch(url: string): Promise<string> {
  const res = await fetch(url);
  return res.text();
}

function extractLinks(html: string, origin: string): string[] {
  const links: string[] = [];
  const hrefRegex = /href="(.*?)"/g;
  for (const match of html.matchAll(hrefRegex)) {
    try {
      const href = match[1];
      const url = new URL(href, origin);
      if (url.origin === origin) {
        links.push(url.href);
      }
    } catch {
      // ignore invalid urls
    }
  }
  return links;
}

export async function crawl(config: CrawlConfig): Promise<CrawlResult> {
  const { baseUrl, maxDepth, maxPages = Infinity, fetchFn = defaultFetch } = config;
  const origin = new URL(baseUrl).origin;
  const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);
    if (visited.size > maxPages) {
      throw new PageLimitExceededError(maxPages);
    }
    if (depth >= maxDepth) continue;
    const html = await fetchFn(url);
    const links = extractLinks(html, origin);
    for (const link of links) {
      if (!visited.has(link)) {
        queue.push({ url: link, depth: depth + 1 });
      }
    }
  }

  return {
    crawlId: crypto.randomUUID(),
    discoveredUrls: Array.from(visited),
    total: visited.size,
  };
}
