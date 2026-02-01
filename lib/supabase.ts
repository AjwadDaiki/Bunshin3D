import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === "undefined") return undefined;

          const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`));

          if (!match) return undefined;

          const raw = match.substring(name.length + 1);
          try {
            return decodeURIComponent(raw);
          } catch {
            return raw;
          }
        },

        set(name: string, value: string, options: any) {
          if (typeof document === "undefined") return;

          const opts = options ?? {};
          let cookie = `${name}=${encodeURIComponent(value)}`;

          if (typeof opts.maxAge === "number") cookie += `; Max-Age=${opts.maxAge}`;
          if (opts.expires) cookie += `; Expires=${new Date(opts.expires).toUTCString()}`;

          cookie += `; Path=${opts.path ?? "/"}`;

          if (opts.domain) cookie += `; Domain=${opts.domain}`;

          if (opts.sameSite) {
            const ss =
              typeof opts.sameSite === "string"
                ? opts.sameSite
                : String(opts.sameSite);
            cookie += `; SameSite=${ss[0].toUpperCase()}${ss.slice(1)}`;
          } else {
            cookie += `; SameSite=Lax`;
          }

          const secure =
            opts.secure ??
            (typeof window !== "undefined" &&
              window.location.protocol === "https:");
          if (secure) cookie += "; Secure";

          document.cookie = cookie;
        },

        remove(name: string, options: any) {
          if (typeof document === "undefined") return;

          const opts = options ?? {};
          let cookie = `${name}=; Max-Age=0; Path=${opts.path ?? "/"}`;
          if (opts.domain) cookie += `; Domain=${opts.domain}`;

          document.cookie = cookie;
        },
      },
    },
  );
