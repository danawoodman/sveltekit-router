# sveltekit-router

This is a VERY experimental proof of concept for a generic SvelteKit endpoint router that would allow you to do the following:

`src/routes/api/[...path].ts`:

```ts
import type { Routes } from './_router'

export const routes: Routes = {
  'GET /ping': async ({ request, params }) => ({ body: { request, params } }),
  'GET /users': async () => ({ body: { users: [] } }),
  'GET /users/:id': async ({ params }) => ({
    body: { user: { id: params.id } },
  }),
}
```

This is not something you should use (it's not even packaged yet), but might be informative for reference.o

## License

MIT
