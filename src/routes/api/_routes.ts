import type { Routes } from './_router'

export const routes: Routes = {
  'GET /users': async ({ request }) => ({
    body: { users: [] },
  }),
  'GET /users/:id': async ({ request, params }) => ({
    body: { message: `Welcome to ${request.host}`, request, params },
  }),
}
