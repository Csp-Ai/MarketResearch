export async function filterAllowedUrls(
  baseUrl: string,
  urls: string[],
  fetchFn: typeof fetch = fetch
): Promise<string[]> {
  let disallow: string[] = [];
  try {
    const res = await fetchFn(new URL('/robots.txt', baseUrl));
    if ((res as any)?.ok) {
      const content = await (res as any).text();
      disallow = parseDisallow(content);
    }
  } catch {
    // ignore errors fetching robots
  }
  return urls.filter((u) => {
    const path = new URL(u).pathname;
    return !disallow.some((rule) => rule !== '' && path.startsWith(rule));
  });
}

function parseDisallow(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const rules: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [directive, value = ''] = line.split(':', 2).map((s) => s.trim());
    if (directive.toLowerCase() === 'disallow' && value) {
      rules.push(value);
    }
  }
  return rules;
}
