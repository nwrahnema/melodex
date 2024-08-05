import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy } from 'react';

const Posts = lazy(() => import('@app/components/Posts'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link href="/vite.svg" rel="icon" type="image/svg+xml" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="Nima's page" name="description" />
        <title>Hono/React + Cloudflare</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </body>
    </html>
  );
}
