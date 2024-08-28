import { firebase } from '@firebase/config'
import { defineAction, z } from 'astro:actions'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

export const loginGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials)
    console.log(credential)

    if (!credential) throw new Error('Invalid credentials')
    await signInWithCredential(firebase.auth, credential)
    return { ok: true }
  },
})
