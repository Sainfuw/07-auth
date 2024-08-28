import { firebase } from '@firebase/config'
import { defineMiddleware } from 'astro:middleware'

const publicRoutes = ['/login', '/register']
const privateRoutes = ['/protected']

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, locals, redirect } = context
  const isLoggedIn = !!firebase.auth.currentUser
  const user = firebase.auth.currentUser

  locals.isLoggedIn = isLoggedIn
  if (user) {
    locals.user = {
      avatar: user.photoURL ?? '',
      email: user.email ?? '',
      name: user.displayName ?? '',
      emailVerified: user.emailVerified,
    }
  }

  if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
    return redirect('/')
  }

  if (isLoggedIn && publicRoutes.includes(url.pathname)) {
    return redirect('/')
  }

  return next()
})
