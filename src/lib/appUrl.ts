/**
 * Returns the canonical app base URL.
 * Prefers the current browser origin so OAuth redirect URIs always
 * match the host the user is actually on.
 */
export function getAppBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://trypost.ai';
}

/**
 * Build the OAuth callback URL for a given platform, e.g.
 * https://trypost.ai/oauth/threads/callback
 */
export function getOAuthCallbackUrl(platform: string): string {
  return `${getAppBaseUrl()}/oauth/${platform}/callback`;
}
