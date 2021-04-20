import type { Request, Response } from '@sveltejs/kit'
import { match, MatchFunction } from 'path-to-regexp'

export const supportedMethods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const
export type SupportedHTTPMethod = typeof supportedMethods[number]

export interface Routes {
  [key: string]: <T>({
    request,
    params,
  }: {
    request: Request<any, T>
    params?: Record<string, any>
  }) => Promise<Response>
}

export function svelteKitAdapter(basePath = '', routes: Routes) {
  const handle = async (method: SupportedHTTPMethod, req) => {
    const { path } = req

    console.log({ req })

    const route = matchRoute(routes, method, path.replace(basePath, ''))
    if (!route) return { body: { error: 'no route match', status: 404 } }

    console.log({ route })

    const resp = await route.handler({
      request: req,
      params: route.matched.params,
    })

    if (!resp) return { body: { error: 'something broke', status: 500 } }

    console.log({ resp })

    return resp
  }

  return {
    get: async (req) => handle('GET', req),
    post: async (req) => handle('POST', req),
    put: async (req) => handle('PUT', req),
    patch: async (req) => handle('PATCH', req),
    del: async (req) => handle('DELETE', req),
  }
}

function makeRouteTable(
  routes: Routes,
): {
  [method in SupportedHTTPMethod]: {
    [key: string]: { matcher: MatchFunction<Record<string, any>>; handler: any }
  }
} {
  return Object.entries(routes).reduce(
    (all, [k, v]) => {
      const [method, path] = k.split(' ')
      all[method] = {
        ...all[method],
        [path]: {
          matcher: match(path, { decode: decodeURIComponent }),
          handler: v,
        },
      }
      return all
    },
    { GET: {}, POST: {}, PATCH: {}, PUT: {}, DELETE: {} },
  )
}

function matchRoute(routes: Routes, method: SupportedHTTPMethod, path: string) {
  console.log({ path })

  const routeTable = makeRouteTable(routes)

  console.log({ routeTable })

  console.log({ routes })

  for (const supportedMethod of supportedMethods) {
    const available = routeTable[supportedMethod]

    console.log({ available })

    if (available) {
      for (const [_, route] of Object.entries(available)) {
        const methodMatched = method === supportedMethod

        console.log({ methodMatched, method, supportedMethod })

        const matched = methodMatched && route.matcher(path)

        console.log({ matched })

        if (matched) return { matched, handler: route.handler }
      }
    }
  }

  return false
}
