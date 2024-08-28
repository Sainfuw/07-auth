import { firebase } from '@firebase/config'
import { defineAction, z } from 'astro:actions'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const login = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(4),
    remember_me: z.boolean().optional(),
  }),
  handler: async (input, context) => {
    const { email, password, remember_me } = input
    const { cookies } = context

    const data = ['email', 'password']

    if (remember_me) {
      data.map((key) => {
        cookies.set(key, input[key as keyof typeof input] as string, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        })
      })
    } else {
      data.map((key) => {
        cookies.delete(key)
      })
    }

    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      return { ok: true, msg: 'User logged in' }
    } catch (error) {
      throw new Error('Error while logging user')
    }
  },
})
