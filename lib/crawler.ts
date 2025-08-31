import { env } from './env';

export type FetchLike = (url: string) => Promise<{
  ok: boolean;
  text(): Promise<string>;
}>;

export async function crawl(
  baseUrl: string,
  fetcher: FetchLike = fetch as any
): Promise<string[]> {
  const origin = new URL(baseUrl).origin;
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [
    { url: baseUrl, depth: 0 },
  ];

  while (queue.length) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url) || depth > env.MAX_DEPTH) continue;
    visited.add(url);
    if (depth === env.MAX_DEPTH) continue;

    let html = '';
    try {
      const res = await fetcher(url);
      if (!res.ok) continue;
      html = await res.text();
    } catch {
      continue;
    }

    const linkRegex = /href="(.*?)"/g;
    for (const match of html.matchAll(linkRegex)) {
      try {
        const nextUrl = new URL(match[1], url).toString();
        if (!nextUrl.startsWith(origin)) continue;
        if (!visited.has(nextUrl)) {
          queue.push({ url: nextUrl, depth: depth + 1 });
        }
      } catch {
        // ignore invalid URLs
      }
    }
  }

  return Array.from(visited);
}

