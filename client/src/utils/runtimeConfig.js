const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);
const DEFAULT_BACKEND_PORT = '3000';

function isLoopbackHost(hostname) {
  return LOOPBACK_HOSTS.has(hostname);
}

function replaceLoopbackHost(urlString) {
  const currentHost = window.location.hostname;

  if (!urlString) {
    return null;
  }

  const resolvedUrl = new URL(urlString, window.location.origin);

  if (!isLoopbackHost(currentHost) && isLoopbackHost(resolvedUrl.hostname)) {
    resolvedUrl.hostname = currentHost;
  }

  return resolvedUrl.toString().replace(/\/$/, '');
}

function getBackendOrigin(protocol) {
  return `${protocol}//${window.location.hostname}:${DEFAULT_BACKEND_PORT}`;
}

export function getApiBaseUrl() {
  const configuredUrl = replaceLoopbackHost(import.meta.env.VITE_API_BASE_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  return `${getBackendOrigin(window.location.protocol)}\/api`;
}

export function getWsUrl() {
  const configuredUrl = replaceLoopbackHost(import.meta.env.VITE_WS_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return getBackendOrigin(wsProtocol);
}
