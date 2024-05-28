import { zValidator } from '@hono/zod-validator'
import { MethodNotAllowedError, NotFoundError, getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { z } from 'zod'
import * as ReactDOMServer from 'react-dom/server'
import assetManifest from '__STATIC_CONTENT_MANIFEST'
import App from '@app/App'

type Bindings = {
  __STATIC_CONTENT: KVNamespace
}

interface Data {
  userId: number
  id: number
  title: string
  completed: boolean
}

const app = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) =>
    c.newResponse(
      await ReactDOMServer.renderToReadableStream(<App />, {
        bootstrapModules: ['/assets/main.js'],
      }),
    ),
  )
  .get('/assets/*', async (c) => {
    try {
      return await getAssetFromKV(
        {
          request: c.req.raw,
          waitUntil: async (p) => c.executionCtx.waitUntil(p),
        },
        {
          ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          defaultETag: 'strong',
          mapRequestToAsset: serveSinglePageApp,
          cacheControl: {
            browserTTL: undefined,
            edgeTTL: 2 * 60 * 60 * 24,
            bypassCache: true,
          },
        },
      )
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new Error(e.message)
      } else if (e instanceof MethodNotAllowedError) {
        throw new Error(e.message)
      } else {
        throw new Error('An unexpected error occurred')
      }
    }
  })
  .get('/api/posts', async (c) => {
    const url = 'https://jsonplaceholder.typicode.com/posts'
    const response = await fetch(url)
    const result: Data[] = await response.json()
    return c.json(result)
  })
  .notFound((c) =>
    c.json(
      {
        message: 'Not Found',
        ok: false,
      },
      404,
    ),
  )
  .onError((err, c) =>
    c.json(
      {
        name: err.name,
        message: err.message,
      },
      500,
    ),
  )

export type AppType = typeof app
export const onRequest = handle(app)

export default app
