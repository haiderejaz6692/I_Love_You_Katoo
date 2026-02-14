const CLOUDFLARE_SCRIPT_ID = "cf-web-analytics";
const CLOUDFLARE_SCRIPT_SRC = "https://static.cloudflareinsights.com/beacon.min.js";
const PLACEHOLDER_TOKEN = "PASTE_CLOUDFLARE_WEB_ANALYTICS_TOKEN_HERE";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
};

function appendCloudflareScript(token: string) {
  if (document.getElementById(CLOUDFLARE_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = CLOUDFLARE_SCRIPT_ID;
  script.defer = true;
  script.src = CLOUDFLARE_SCRIPT_SRC;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  document.head.appendChild(script);
}

export function initCloudflareWebAnalytics() {
  if (!import.meta.env.PROD) {
    return;
  }

  const token = import.meta.env.VITE_CF_WEB_ANALYTICS_TOKEN?.trim();
  if (!token || token === PLACEHOLDER_TOKEN) {
    return;
  }

  const start = () => {
    try {
      appendCloudflareScript(token);
    } catch {
      // Analytics must never block or break the app.
    }
  };

  const idleWindow = window as IdleWindow;
  if (typeof idleWindow.requestIdleCallback === "function") {
    idleWindow.requestIdleCallback(start, { timeout: 2000 });
    return;
  }

  window.setTimeout(start, 0);
}
