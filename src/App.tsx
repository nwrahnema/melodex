import { lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Posts = lazy(() => import('@app/components/Posts'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Nima's page" />
        <title>Hono/React + Cloudflare</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
