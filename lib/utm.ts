const UTM_SOURCE = "neretvarafting";
const UTM_MEDIUM = "referral";

const CROSS_DOMAIN_HOSTS = new Set([
  "discoverkonjic.com",
  "www.discoverkonjic.com",
]);

export function shouldTagWithUtm(url: string): boolean {
  try {
    const u = new URL(url);
    return CROSS_DOMAIN_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

export function withUtm(
  url: string,
  opts: { campaign: string; content?: string },
): string {
  if (!shouldTagWithUtm(url)) return url;

  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) {
      u.searchParams.set("utm_source", UTM_SOURCE);
    }
    if (!u.searchParams.has("utm_medium")) {
      u.searchParams.set("utm_medium", UTM_MEDIUM);
    }
    if (!u.searchParams.has("utm_campaign")) {
      u.searchParams.set("utm_campaign", opts.campaign);
    }
    if (opts.content && !u.searchParams.has("utm_content")) {
      u.searchParams.set("utm_content", opts.content);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function pathToContextSlug(pathname: string): string {
  return pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/\//g, "_")
    .replace(/[^a-z0-9_-]/gi, "")
    .toLowerCase() || "root";
}
