import { randomUUID } from 'crypto';

export interface UrlScoutResult {
  crawlId: string;
  discoveredUrls: string[];
  total: number;
}

export async function urlScout(
  baseUrl: string,
  maxDepth: number,
  fetchFn: (url: string) => Promise<{ text(): Promise<string> }>
): Promise<UrlScoutResult> {
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [{ url: baseUrl, depth: 0 }];
  visited.add(baseUrl);

  while (queue.length > 0) {
    const { url, depth } = queue.shift()!;
    if (depth > maxDepth) continue;

    let html: string;
    try {
      const res = await fetchFn(url);
      html = await res.text();
    } catch {
      continue; // skip on fetch errors
    }

    if (depth === maxDepth) continue;

    const linkRegex = /href="(.*?)"/g;
    const matches = html.matchAll(linkRegex);
    for (const match of matches) {
      const href = match[1];
      if (!href) continue;
      try {
        const absolute = new URL(href, url).href;
        if (!visited.has(absolute) && !isAsset(absolute)) {
          visited.add(absolute);
          queue.push({ url: absolute, depth: depth + 1 });
        }
      } catch {
        // ignore invalid URLs
      }
    }
  }

  return {
    crawlId: randomUUID(),
    discoveredUrls: Array.from(visited),
    total: visited.size,
  };
}

function isAsset(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|svg|css|js|pdf)$/i.test(url);
}

