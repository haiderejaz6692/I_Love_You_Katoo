const CLOUDFLARE_SCRIPT_ID = "cf-web-analytics";
const PLACEHOLDER_TOKEN = "PASTE_CLOUDFLARE_WEB_ANALYTICS_TOKEN_HERE";

export function initCloudflareWebAnalytics() {
  if (!import.meta.env.PROD) {
    return;
  }

  const token = import.meta.env.VITE_CF_WEB_ANALYTICS_TOKEN?.trim();
  if (!token || token === PLACEHOLDER_TOKEN) {
    return;
  }

  if (document.getElementById(CLOUDFLARE_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = CLOUDFLARE_SCRIPT_ID;
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  document.head.appendChild(script);
}
