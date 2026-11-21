import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, getMe } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'

const TOKEN_KEY = 'token'

const AuthContext = createContext(null)

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // localStorage tidak tersedia; sesi hanya bertahan selama state di memori
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true selama aplikasi memeriksa token yang tersimpan (GET /api/auth/me)
  const [loading, setLoading] = useState(() => Boolean(readToken()))

  const logout = useCallback(() => {
    writeToken(null)
    setUser(null)
  }, [])

  // Saat aplikasi dimuat: jika ada token, validasi lewat /api/auth/me.
  // Jika gagal, logout.
  useEffect(() => {
    if (!readToken()) {
      setLoading(false)
      return
    }

    let cancelled = false

    getMe()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [logout])

  // 401 pada request terproteksi -> logout otomatis.
  // ProtectedRoute yang akan mengarahkan ke /login karena user menjadi null.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // Error dari login (termasuk 401 "Invalid email or password") dilempar
  // kembali agar LoginPage menampilkan error.message. Tidak memicu logout.
  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password)
    writeToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isSuperadmin: user?.role === 'superadmin',
      login,
      logout,
    }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }
  return ctx
}