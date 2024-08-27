// No funciona es solo para guardar ejercicio antiguo
import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const authHeaders = request.headers.get('Authorization') ?? ''

  if (privateRoutes.includes(url.pathname)) {
    return checkAuth(authHeaders!, next)
  }

  return next()
})

const checkAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (authHeaders) {
    const authValue = authHeaders.split(' ').at(1) ?? 'user:pass'
    const [username, password] = atob(authValue).split(':')

    if (username === 'admin' && password === 'admin') {
      return next()
    }
  }

  return new Response('Not allowed', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
