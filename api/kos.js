const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const entities = {
  kamar: { table: 'kamar', key: 'id_kamar' },
  penyewa: { table: 'penyewa', key: 'id_penyewa' },
  pembayaran: { table: 'pembayaran', key: 'id_pembayaran' },
  pemilik: { table: 'pemilik', key: 'id_pemilik' },
}

function send(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function supabaseRequest(table, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured on Vercel.')
  }

  const params = new URLSearchParams(options.params || {})
  const url = `${SUPABASE_URL}/rest/v1/${table}${params.size ? `?${params.toString()}` : ''}`
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  if (response.status === 204) return []

  return response.json()
}

async function loadAll() {
  const [pemilik, kamar, penyewa, pembayaran] = await Promise.all([
    supabaseRequest('pemilik', { params: { select: '*' } }),
    supabaseRequest('kamar', { params: { select: '*' } }),
    supabaseRequest('penyewa', { params: { select: '*' } }),
    supabaseRequest('pembayaran', { params: { select: '*' } }),
  ])

  return { pemilik, kamar, penyewa, pembayaran }
}

function clientId(prefix) {
  return `${prefix}${String(Date.now()).slice(-8)}`
}

function idPrefix(entity) {
  if (entity === 'pembayaran') return 'PB'
  if (entity === 'penyewa') return 'PN'
  if (entity === 'kamar') return 'K'
  return 'ID'
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      send(res, 200, await loadAll())
      return
    }

    if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
      send(res, 405, { error: 'Method not allowed' })
      return
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const entity = entities[body.entity]

    if (!entity) {
      send(res, 400, { error: 'Unknown entity.' })
      return
    }

    if (req.method === 'DELETE') {
      await supabaseRequest(entity.table, {
        method: 'DELETE',
        params: { [entity.key]: `eq.${body.id}` },
      })
      send(res, 200, await loadAll())
      return
    }

    const payload = { ...body.payload }
    const existingId = payload[entity.key]

    if (req.method === 'PATCH' || existingId) {
      await supabaseRequest(entity.table, {
        method: 'PATCH',
        params: { [entity.key]: `eq.${existingId}` },
        body: payload,
      })
    } else {
      await supabaseRequest(entity.table, {
        method: 'POST',
        body: { ...payload, [entity.key]: clientId(idPrefix(body.entity)) },
      })
    }

    send(res, 200, await loadAll())
  } catch (error) {
    send(res, 500, { error: error.message })
  }
}
