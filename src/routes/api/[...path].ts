import { svelteKitAdapter } from './_router'
import { routes } from './_routes'

const app = svelteKitAdapter('/api', routes)

export const get = app.get
export const post = app.post
export const del = app.del
export const put = app.put
export const patch = app.patch
