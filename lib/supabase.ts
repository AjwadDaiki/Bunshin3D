import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Vérifier si on est côté client avant d'accéder à document
          if (typeof window === 'undefined') {
            return undefined;
          }
          // Lecture des cookies côté client
          const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1];
          return value ? decodeURIComponent(value) : undefined;
        },
        set(name: string, value: string, options: any) {
          // Vérifier si on est côté client avant d'accéder à document
          if (typeof window === 'undefined') {
            return;
          }
          // Écriture des cookies côté client
          let cookie = `${name}=${encodeURIComponent(value)}`;

          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
          }
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookie += `; domain=${options.domain}`;
          }
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`;
          }
          if (options?.secure) {
            cookie += '; secure';
          }

          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          // Vérifier si on est côté client avant d'accéder à document
          if (typeof window === 'undefined') {
            return;
          }
          // Suppression des cookies côté client
          let cookie = `${name}=; max-age=0`;

          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookie += `; domain=${options.domain}`;
          }

          document.cookie = cookie;
        },
      },
    }
  );
