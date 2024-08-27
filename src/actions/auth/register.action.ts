import { defineAction, z } from 'astro:actions'

export const register = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
    remember_me: z.boolean().optional(),
  }),
  handler: async (input, context) => {
    const { remember_me } = input
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

    return { ok: true, msg: 'User created' }
  },
})
