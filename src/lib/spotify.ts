export const getSpotifyAuthUrl = async () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback.html`;

  if (!CLIENT_ID) {
      alert("Spotify Client ID is not configured!");
      return null;
  }

  const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem('spotify_code_verifier', codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const scope = 'user-read-recently-played';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  }

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
}

export const getSpotifyToken = async (code: string) => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback.html`;
  let codeVerifier = localStorage.getItem('spotify_code_verifier');

  if (!CLIENT_ID || !codeVerifier) throw new Error('Missing Auth configuration');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch("https://accounts.spotify.com/api/token", payload);
  const response = await body.json();
  if (response.access_token) {
    localStorage.setItem('spotify_access_token', response.access_token);
    localStorage.setItem('spotify_refresh_token', response.refresh_token);
    localStorage.setItem('spotify_expires_at', (Date.now() + response.expires_in * 1000).toString());
    return response.access_token;
  }
  throw new Error(response.error_description || response.error || 'Failed to get token');
}

export const refreshSpotifyToken = async () => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID
        }),
    }
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();
    if (response.access_token) {
        localStorage.setItem('spotify_access_token', response.access_token);
        if (response.refresh_token) {
            localStorage.setItem('spotify_refresh_token', response.refresh_token);
        }
        localStorage.setItem('spotify_expires_at', (Date.now() + response.expires_in * 1000).toString());
        return response.access_token;
    }
    throw new Error('Failed to refresh token');
}

export const getValidSpotifyToken = async () => {
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_expires_at');

    if (!token) return null;

    if (Date.now() > Number(expiresAt)) {
        try {
            return await refreshSpotifyToken();
        } catch (e) {
            console.error('Refresh token failed', e);
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_refresh_token');
            localStorage.removeItem('spotify_expires_at');
            return null;
        }
    }
    return token;
}

export const getRecentlyPlayed = async (token: string, afterTimestamp: number) => {
    const params = new URLSearchParams({
        limit: '50',
        after: afterTimestamp.toString(),
    });

    const body = await fetch(`https://api.spotify.com/v1/me/player/recently-played?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Handle 204 No Content
    if (body.status === 204) return [];
    
    if (!body.ok) {
        throw new Error(`Spotify API error: ${body.status}`);
    }

    const response = await body.json();
    return response.items || [];
}
