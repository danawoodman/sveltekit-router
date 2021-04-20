import type { Routes } from './_router'

export const routes: Routes = {
  'GET /ping': async ({ request, params }) => ({ body: { request, params } }),
  'GET /users': async () => ({ body: { users: [] } }),
  'GET /users/:id': async ({ params }) => ({
    body: { user: { id: params.id } },
  }),
}
