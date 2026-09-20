#!/usr/bin/env bun
// One-shot OAuth helper: exchanges a fresh Spotify authorization for a
// refresh token, using SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET from the
// environment (bun loads .env automatically). Run with `bun run spotify:auth`.
//
// SPOTIFY_REDIRECT_URI must exactly match one registered on the Spotify app.
// If it's a loopback address (127.0.0.1/localhost), this catches the
// callback automatically with a local server. Otherwise (e.g. a real
// production domain that isn't wired to read ?code=, like
// https://dallascarraher.dev), Spotify still redirects the browser there
// with ?code=... in the URL, and it prompts you to paste that URL back in.

const SCOPES = "user-read-currently-playing user-read-playback-state";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:8888/callback";

if (!client_id || !client_secret) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in the environment (.env).");
  process.exit(1);
}

const redirectUrl = new URL(redirect_uri);
const isLoopback = redirectUrl.hostname === "127.0.0.1" || redirectUrl.hostname === "localhost";

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", client_id);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", redirect_uri);
authorizeUrl.searchParams.set("scope", SCOPES);

console.log("\nMake sure this exact redirect URI is registered on your Spotify app:");
console.log(`  ${redirect_uri}\n`);
console.log("Open this URL to authorize (attempting to open it automatically):");
console.log(`  ${authorizeUrl.toString()}\n`);

const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
Bun.spawn([opener, authorizeUrl.toString()], { stdout: "ignore", stderr: "ignore" }).exited.catch(() => {});

async function getCodeViaLocalServer(): Promise<string> {
  const port = Number(redirectUrl.port || 80);
  const { promise, resolve, reject } = Promise.withResolvers<string>();

  const server = Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname !== redirectUrl.pathname) {
        return new Response("Not found", { status: 404 });
      }

      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        reject(new Error(`Spotify authorization denied: ${error}`));
        return new Response(`Authorization failed: ${error}. You can close this tab.`, { status: 400 });
      }
      if (!code) {
        reject(new Error("No authorization code in callback"));
        return new Response("Missing code. You can close this tab.", { status: 400 });
      }

      resolve(code);
      return new Response("Authorization received. You can close this tab and return to the terminal.", {
        headers: { "Content-Type": "text/plain" },
      });
    },
  });

  try {
    return await promise;
  } finally {
    server.stop();
  }
}

async function getCodeViaManualPaste(): Promise<string> {
  console.log("After approving, Spotify will redirect your browser to a URL containing '?code=...'.");
  console.log("That page may show an error or 404 — that's fine, the code is in the address bar.");
  console.log("Paste the full redirected URL (or just the code) here:\n");

  for await (const line of console) {
    const input = line.trim();
    if (!input) continue;

    try {
      const url = new URL(input);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      if (error) throw new Error(`Spotify authorization denied: ${error}`);
      if (code) return code;
    } catch {
      // Not a URL — treat the raw input as the code itself.
    }
    return input;
  }

  throw new Error("No input received");
}

const code = isLoopback ? await getCodeViaLocalServer() : await getCodeViaManualPaste();

const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    client_secret,
  }).toString(),
});

if (!tokenResponse.ok) {
  console.error(`\nToken exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
  console.error(await tokenResponse.text());
  process.exit(1);
}

const data = (await tokenResponse.json()) as { refresh_token: string; access_token: string; scope: string };

console.log("\nSuccess. New refresh token (set this as SPOTIFY_REFRESH_TOKEN in Vercel):\n");
console.log(data.refresh_token);
console.log(`\nGranted scopes: ${data.scope}`);
process.exit(0);
