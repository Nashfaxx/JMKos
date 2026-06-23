import { useCallback, useEffect, useMemo, useState } from 'react'
import { emptyPayment, emptyRoom, emptyTenant } from '../constants/forms'
import {
  getStoredAuthSession,
  hasSupabaseConfig,
  refreshAuthSession,
  signInWithPassword,
  signUpWithPassword,
  signOut,
} from '../lib/supabaseAuth'
import { emptyKosData, kosApi } from '../lib/kosApi'
import {
  calculateStats,
  enrichTenants,
  getMonthlyRevenue,
  getRevenueForMonth,
} from '../utils/kosMetrics'

const CONNECTION_CHECK_INTERVAL_MS = 10000
const CONNECTION_TIMEOUT_MS = 8000

function checkedAtLabel() {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function connectionMessage(error) {
  if (error?.name === 'AbortError') return 'Koneksi timeout saat memeriksa database.'
  return error?.message || 'Database belum dapat dijangkau.'
}

export function useKosAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [authSession, setAuthSession] = useState(() => getStoredAuthSession())
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authNotice, setAuthNotice] = useState('')
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [data, setData] = useState(emptyKosData)
  const [source, setSource] = useState('disconnected')
  const [connectionStatus, setConnectionStatus] = useState({
    state: 'checking',
    source: 'disconnected',
    message: 'Memeriksa koneksi database...',
    checkedAt: '',
  })
  const [loading, setLoading] = useState(() => Boolean(getStoredAuthSession()))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [roomForm, setRoomForm] = useState(emptyRoom)
  const [tenantForm, setTenantForm] = useState(emptyTenant)
  const [paymentForm, setPaymentForm] = useState(emptyPayment)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [reportMonth, setReportMonth] = useState(currentMonth)
  const hasAuthConfig = hasSupabaseConfig()

  const markConnected = useCallback((nextSource) => {
    setSource(nextSource)
    setConnectionStatus({
      state: 'connected',
      source: nextSource,
      message: 'Database berhasil dijangkau.',
      checkedAt: checkedAtLabel(),
    })
  }, [])

  const markDisconnected = useCallback((message) => {
    setSource('disconnected')
    setConnectionStatus({
      state: 'disconnected',
      source: 'disconnected',
      message,
      checkedAt: checkedAtLabel(),
    })
  }, [])

  const handleLogin = useCallback(async (event) => {
    event.preventDefault()
    setAuthBusy(true)
    setAuthError('')
    setAuthNotice('')

    try {
      const session = await signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })
      setAuthSession(session)
      setLoginPassword('')
      setLoading(true)
    } catch (apiError) {
      setAuthError(connectionMessage(apiError))
    } finally {
      setAuthBusy(false)
    }
  }, [loginEmail, loginPassword])

  const handleSignup = useCallback(async (event) => {
    event.preventDefault()
    setAuthBusy(true)
    setAuthError('')
    setAuthNotice('')

    try {
      const response = await signUpWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
        nama: loginName.trim(),
      })

      if (response.session) {
        setAuthSession(response.session)
        setLoginPassword('')
        setLoading(true)
        return
      }

      setAuthMode('login')
      setLoginPassword('')
      setAuthNotice(response.message)
    } catch (apiError) {
      setAuthError(connectionMessage(apiError))
    } finally {
      setAuthBusy(false)
    }
  }, [loginEmail, loginName, loginPassword])

  const toggleAuthMode = useCallback(() => {
    setAuthMode((current) => (current === 'login' ? 'signup' : 'login'))
    setAuthError('')
    setAuthNotice('')
  }, [])

  const handleLogout = useCallback(async () => {
    setAuthBusy(true)

    try {
      await signOut()
    } finally {
      setAuthSession(null)
      setData(emptyKosData)
      setSource('disconnected')
      setActiveTab('dashboard')
      setAuthBusy(false)
      markDisconnected('Login Supabase dibutuhkan untuk mengakses database.')
    }
  }, [markDisconnected])

  const checkDatabaseConnection = useCallback(async ({ showChecking = false } = {}) => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), CONNECTION_TIMEOUT_MS)

    if (showChecking) {
      setConnectionStatus((current) => ({
        ...current,
        state: 'checking',
        message: 'Memeriksa koneksi database...',
      }))
    }

    try {
      const response = await kosApi.checkConnection(controller.signal)

      if (response.healthy) {
        markConnected(response.source)
        return
      }

      markDisconnected(response.message)
    } catch (apiError) {
      markDisconnected(connectionMessage(apiError))
    } finally {
      window.clearTimeout(timeout)
    }
  }, [markConnected, markDisconnected])

  const refresh = useCallback(async () => {
    setError('')
    try {
      const response = await kosApi.listAll()
      setData(response.data)
      markConnected(response.source)
    } catch (apiError) {
      setError(apiError.message)
      markDisconnected(connectionMessage(apiError))
    } finally {
      setLoading(false)
      setBusy(false)
    }
  }, [markConnected, markDisconnected])

  const runAction = useCallback(async (action) => {
    setBusy(true)
    setError('')
    try {
      const response = await action()
      setData(response.data)
      markConnected(response.source)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setBusy(false)
    }
  }, [markConnected])

  useEffect(() => {
    if (!authSession) return undefined

    const loadTimer = window.setTimeout(refresh, 0)

    return () => window.clearTimeout(loadTimer)
  }, [authSession, refresh])

  useEffect(() => {
    if (!authSession) return undefined

    let active = true
    const refreshTimer = window.setTimeout(async () => {
      try {
        const nextSession = await refreshAuthSession()
        if (active && nextSession) setAuthSession(nextSession)
      } catch {
        if (active) {
          setAuthSession(null)
          markDisconnected('Sesi Supabase berakhir. Masuk ulang untuk mengakses database.')
        }
      }
    }, Math.max((authSession.expiresAt || Date.now()) - Date.now() - 60000, 30000))

    return () => {
      active = false
      window.clearTimeout(refreshTimer)
    }
  }, [authSession, markDisconnected])

  useEffect(() => {
    if (!authSession) return undefined

    const interval = window.setInterval(() => {
      checkDatabaseConnection()
    }, CONNECTION_CHECK_INTERVAL_MS)

    function handleOnline() {
      checkDatabaseConnection({ showChecking: true })
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        checkDatabaseConnection({ showChecking: true })
      }
    }

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [authSession, checkDatabaseConnection])

  const enrichedTenants = useMemo(() => enrichTenants(data), [data])
  const stats = useMemo(
    () => calculateStats({ data, enrichedTenants, currentMonth }),
    [currentMonth, data, enrichedTenants],
  )
  const monthlyRevenue = useMemo(() => getMonthlyRevenue(data.pembayaran), [data.pembayaran])
  const selectedMonthRevenue = useMemo(
    () => getRevenueForMonth(data.pembayaran, reportMonth),
    [data.pembayaran, reportMonth],
  )
  const availableRooms = useMemo(
    () =>
      data.kamar.filter((room) => room.status === 'Kosong' || room.id_kamar === tenantForm.id_kamar),
    [data.kamar, tenantForm.id_kamar],
  )
  const latestPayments = useMemo(
    () =>
      [...data.pembayaran]
        .sort((a, b) => String(b.tanggal_bayar).localeCompare(String(a.tanggal_bayar)))
        .slice(0, 5),
    [data.pembayaran],
  )
  const delinquentTenants = useMemo(
    () => enrichedTenants.filter((tenant) => tenant.status === 'Nunggak'),
    [enrichedTenants],
  )

  function resetRoomForm() {
    setRoomForm(emptyRoom)
  }

  function resetTenantForm() {
    setTenantForm(emptyTenant)
  }

  function resetPaymentForm() {
    setPaymentForm(emptyPayment)
  }

  function handleRoomSubmit(event) {
    event.preventDefault()
    runAction(() => kosApi.saveRoom(roomForm))
    resetRoomForm()
  }

  function handleTenantSubmit(event) {
    event.preventDefault()
    runAction(() => kosApi.saveTenant(tenantForm))
    resetTenantForm()
  }

  function handlePaymentSubmit(event) {
    event.preventDefault()
    runAction(() => kosApi.savePayment(paymentForm))
    resetPaymentForm()
  }

  const canMutate = source !== 'disconnected'

  return {
    activeTab,
    authBusy,
    authError,
    authMode,
    authNotice,
    authSession,
    availableRooms,
    busy,
    canMutate,
    connectionStatus,
    currentMonth,
    data,
    delinquentTenants,
    enrichedTenants,
    error,
    handlePaymentSubmit,
    handleLogin,
    handleLogout,
    handleSignup,
    handleRoomSubmit,
    handleTenantSubmit,
    hasAuthConfig,
    latestPayments,
    loading,
    loginEmail,
    loginName,
    loginPassword,
    monthlyRevenue,
    paymentForm,
    refresh,
    reportMonth,
    resetPaymentForm,
    resetRoomForm,
    resetTenantForm,
    roomForm,
    runAction,
    selectedMonthRevenue,
    setActiveTab,
    setLoginEmail,
    setLoginName,
    setLoginPassword,
    toggleAuthMode,
    setPaymentForm,
    setReportMonth,
    setRoomForm,
    setTenantForm,
    source,
    stats,
    tenantForm,
  }
}
