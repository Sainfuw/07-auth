import { register } from '@/actions/auth/register.action'
import { loginGoogle } from './auth/login-google.action'
import { login } from './auth/login.auth'
import { logout } from './auth/logout.action'

export const server = {
  login,
  loginGoogle,
  logout,
  register,
}
