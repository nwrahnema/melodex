import { useQuery } from '@tanstack/react-query';
import { hc } from 'hono/client';

import { AppType } from '@/server';

export function usePosts() {
  const client = hc<AppType>('/');
  const $get = client.api.posts.$get;

  return useQuery({
    queryFn: async () => {
      const res = await $get();
      return await res.json();
    },
    queryKey: ['posts'],
  });
}
