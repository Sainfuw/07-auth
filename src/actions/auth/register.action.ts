import { firebase } from '@firebase/config'
import { defineAction, z } from 'astro:actions'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError,
} from 'firebase/auth'

export const register = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
    remember_me: z.boolean().optional(),
  }),
  handler: async (input, context) => {
    const { name, email, password, remember_me } = input
    const { cookies } = context

    const data = ['name', 'email', 'password']

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

    // Creacion de usuario
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      // Actualizar el nombre (displayname)
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,
      })

      // Verificar el correo electronico
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: `${import.meta.env.BASE_URL}/protected?email-verified=true`,
      })

      return { ok: true, msg: 'User created' }
    } catch (error) {
      const firebaseError = error as AuthError

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use')
      }

      throw new Error('Error creating user')
    }
  },
})
