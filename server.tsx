import App from '@app/App';
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
  serveSinglePageApp,
} from '@cloudflare/kv-asset-handler';
import assetManifest from '__STATIC_CONTENT_MANIFEST';
import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import * as ReactDOMServer from 'react-dom/server';

interface Bindings {
  __STATIC_CONTENT: KVNamespace;
}

interface Data {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
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
          waitUntil: (p) => {
            c.executionCtx.waitUntil(p);
          },
        },
        {
          ASSET_MANIFEST: assetManifest,
          ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
          cacheControl: {
            browserTTL: undefined,
            bypassCache: true,
            edgeTTL: 2 * 60 * 60 * 24,
          },
          defaultETag: 'strong',
          mapRequestToAsset: serveSinglePageApp,
        },
      );
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new Error(e.message);
      } else if (e instanceof MethodNotAllowedError) {
        throw new Error(e.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  })
  .get('/api/posts', async (c) => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const response = await fetch(url);
    const result: Data[] = await response.json();
    return c.json(result);
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
        message: err.message,
        name: err.name,
      },
      500,
    ),
  );

export type AppType = typeof app;
export const onRequest = handle(app);

export default app;
