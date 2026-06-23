const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

const STORAGE_KEY = `jmkos.supabase.session.${SUPABASE_URL || 'missing'}`
const REFRESH_MARGIN_MS = 60 * 1000

function authReady() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY)
}

function authUrl(path) {
  return `${SUPABASE_URL}/auth/v1${path}`
}

function readStoredSession() {
  try {
    const rawSession = window.localStorage.getItem(STORAGE_KEY)
    return rawSession ? JSON.parse(rawSession) : null
  } catch {
    return null
  }
}

function writeStoredSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

function sessionFromPayload(payload) {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Number(payload.expires_in || 3600) * 1000,
    user: payload.user,
  }
}

async function parseAuthResponse(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload.error_description || payload.msg || payload.error || 'Autentikasi gagal.'

    if (/invalid login credentials/i.test(message)) {
      throw new Error(
        'Email atau password belum cocok. Pastikan akun dibuat di project Supabase yang aktif, password benar, dan email sudah confirmed.',
      )
    }

    if (/email not confirmed/i.test(message)) {
      throw new Error('Email belum confirmed. Buka Supabase Auth Users lalu confirm user, atau klik link konfirmasi email.')
    }

    throw new Error(message)
  }

  return payload
}

async function authRequest(path, options = {}) {
  if (!authReady()) {
    throw new Error('Env Supabase belum lengkap. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.')
  }

  const response = await fetch(authUrl(path), {
    method: options.method || 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  return parseAuthResponse(response)
}

export function hasSupabaseConfig() {
  return authReady()
}

export function getStoredAuthSession() {
  const session = readStoredSession()
  return session?.accessToken ? session : null
}

export function clearAuthSession() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export async function signInWithPassword({ email, password }) {
  const payload = await authRequest('/token?grant_type=password', {
    body: { email, password },
  })
  const session = sessionFromPayload(payload)
  writeStoredSession(session)
  return session
}

export async function signUpWithPassword({ email, password, nama }) {
  const payload = await authRequest('/signup', {
    body: {
      email,
      password,
      data: { nama },
    },
  })

  if (!payload.session && payload.user) {
    return {
      needsConfirmation: true,
      user: payload.user,
      message: 'Akun berhasil dibuat. Confirm email dulu sebelum masuk.',
    }
  }

  const session = sessionFromPayload(payload)
  writeStoredSession(session)
  return { session }
}

export async function refreshAuthSession() {
  const session = getStoredAuthSession()

  if (!session?.refreshToken) {
    clearAuthSession()
    return null
  }

  try {
    const payload = await authRequest('/token?grant_type=refresh_token', {
      body: { refresh_token: session.refreshToken },
    })
    const nextSession = sessionFromPayload(payload)
    writeStoredSession(nextSession)
    return nextSession
  } catch (error) {
    clearAuthSession()
    throw error
  }
}

export async function getAuthAccessToken() {
  const session = getStoredAuthSession()

  if (!session) return ''

  if (session.expiresAt && session.expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return session.accessToken
  }

  const refreshedSession = await refreshAuthSession()
  return refreshedSession?.accessToken || ''
}

export async function signOut() {
  const session = getStoredAuthSession()

  if (session?.accessToken && authReady()) {
    await authRequest('/logout', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).catch(() => null)
  }

  clearAuthSession()
}
