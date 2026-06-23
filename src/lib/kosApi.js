import { getAuthAccessToken, getStoredAuthSession } from './supabaseAuth'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const KOS_API_URL = import.meta.env.VITE_KOS_API_URL

const tables = ['pemilik', 'kamar', 'penyewa', 'pembayaran']

export const emptyKosData = {
  pemilik: [],
  kamar: [],
  penyewa: [],
  pembayaran: [],
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data))
}

function syncRoomStatus(data) {
  const occupiedRooms = new Set(data.penyewa.map((tenant) => tenant.id_kamar).filter(Boolean))

  return {
    ...data,
    kamar: data.kamar.map((room) => ({
      ...room,
      status: occupiedRooms.has(room.id_kamar) ? 'Terisi' : 'Kosong',
    })),
  }
}

function isSupabaseReady() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY)
}

function isBackendReady() {
  return Boolean(KOS_API_URL)
}

function assertWritableConnection() {
  if (!isBackendReady() && !isSupabaseReady()) {
    throw new Error('Database belum terhubung. CRUD akan aktif setelah env Supabase atau Vercel API dipasang.')
  }
}

async function backendRequest(options = {}) {
  const response = await fetch(KOS_API_URL, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error || 'Backend API request failed.')
  }

  return payload
}

async function supabaseRequest(table, options = {}) {
  const params = new URLSearchParams(options.params || {})
  const url = `${SUPABASE_URL}/rest/v1/${table}${params.size ? `?${params.toString()}` : ''}`
  const accessToken = await getAuthAccessToken()

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken || SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed: ${response.status}`)
  }

  if (response.status === 204) return []

  return response.json()
}

async function loadFromSupabase() {
  const [pemilik, kamar, penyewa, pembayaran] = await Promise.all(
    tables.map((table) => supabaseRequest(table, { params: { select: '*' } })),
  )

  return syncRoomStatus({ pemilik, kamar, penyewa, pembayaran })
}

function clientId(prefix) {
  return `${prefix}${String(Date.now()).slice(-8)}`
}

async function mutateSupabase({ entity, key, payload, prefix }) {
  const existingId = payload[key]

  if (existingId) {
    await supabaseRequest(entity, {
      method: 'PATCH',
      params: { [key]: `eq.${existingId}` },
      body: payload,
    })
  } else {
    await supabaseRequest(entity, {
      method: 'POST',
      body: { ...payload, [key]: clientId(prefix) },
    })
  }

  return { data: await loadFromSupabase(), source: 'supabase' }
}

async function deleteSupabase({ entity, key, id }) {
  await supabaseRequest(entity, {
    method: 'DELETE',
    params: { [key]: `eq.${id}` },
  })

  return { data: await loadFromSupabase(), source: 'supabase' }
}

export const kosApi = {
  async checkConnection(signal) {
    if (isBackendReady()) {
      await backendRequest({ signal })
      return { healthy: true, source: 'vercel-api' }
    }

    if (isSupabaseReady()) {
      if (!getStoredAuthSession()) {
        return {
          healthy: false,
          source: 'disconnected',
          message: 'Login Supabase dibutuhkan untuk mengakses database.',
        }
      }

      await supabaseRequest('kamar', {
        params: { select: 'id_kamar', limit: '1' },
        signal,
      })
      return { healthy: true, source: 'supabase' }
    }

    return {
      healthy: false,
      source: 'disconnected',
      message: 'Env Supabase belum ditemukan.',
    }
  },

  async listAll() {
    if (isBackendReady()) {
      return { data: syncRoomStatus(await backendRequest()), source: 'vercel-api' }
    }

    if (isSupabaseReady()) {
      return { data: await loadFromSupabase(), source: 'supabase' }
    }

    return { data: cloneData(emptyKosData), source: 'disconnected' }
  },

  async saveRoom(room) {
    assertWritableConnection()

    const payload = { ...room, harga_sewa: Number(room.harga_sewa || 0) }

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: payload.id_kamar ? 'PATCH' : 'POST',
          body: { entity: 'kamar', payload },
        }),
        source: 'vercel-api',
      }
    }

    return mutateSupabase({ entity: 'kamar', key: 'id_kamar', payload, prefix: 'K' })
  },

  async deleteRoom(id_kamar) {
    assertWritableConnection()

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: 'DELETE',
          body: { entity: 'kamar', id: id_kamar },
        }),
        source: 'vercel-api',
      }
    }

    return deleteSupabase({ entity: 'kamar', key: 'id_kamar', id: id_kamar })
  },

  async saveTenant(tenant) {
    assertWritableConnection()

    const payload = {
      ...tenant,
      tanggal_masuk: tenant.tanggal_masuk || new Date().toISOString().slice(0, 10),
    }

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: payload.id_penyewa ? 'PATCH' : 'POST',
          body: { entity: 'penyewa', payload },
        }),
        source: 'vercel-api',
      }
    }

    return mutateSupabase({ entity: 'penyewa', key: 'id_penyewa', payload, prefix: 'PN' })
  },

  async deleteTenant(id_penyewa) {
    assertWritableConnection()

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: 'DELETE',
          body: { entity: 'penyewa', id: id_penyewa },
        }),
        source: 'vercel-api',
      }
    }

    return deleteSupabase({ entity: 'penyewa', key: 'id_penyewa', id: id_penyewa })
  },

  async savePayment(payment) {
    assertWritableConnection()

    const payload = {
      ...payment,
      jumlah_bayar: Number(payment.jumlah_bayar || 0),
      tanggal_bayar: payment.tanggal_bayar || new Date().toISOString().slice(0, 10),
    }

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: payload.id_pembayaran ? 'PATCH' : 'POST',
          body: { entity: 'pembayaran', payload },
        }),
        source: 'vercel-api',
      }
    }

    return mutateSupabase({ entity: 'pembayaran', key: 'id_pembayaran', payload, prefix: 'PB' })
  },

  async deletePayment(id_pembayaran) {
    assertWritableConnection()

    if (isBackendReady()) {
      return {
        data: await backendRequest({
          method: 'DELETE',
          body: { entity: 'pembayaran', id: id_pembayaran },
        }),
        source: 'vercel-api',
      }
    }

    return deleteSupabase({ entity: 'pembayaran', key: 'id_pembayaran', id: id_pembayaran })
  },
}
