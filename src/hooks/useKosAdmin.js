import { useEffect, useMemo, useState } from 'react'
import { emptyPayment, emptyRoom, emptyTenant } from '../constants/forms'
import { emptyKosData, kosApi } from '../lib/kosApi'
import {
  calculateStats,
  enrichTenants,
  getMonthlyRevenue,
  getRevenueForMonth,
} from '../utils/kosMetrics'

export function useKosAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [data, setData] = useState(emptyKosData)
  const [source, setSource] = useState('disconnected')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [roomForm, setRoomForm] = useState(emptyRoom)
  const [tenantForm, setTenantForm] = useState(emptyTenant)
  const [paymentForm, setPaymentForm] = useState(emptyPayment)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [reportMonth, setReportMonth] = useState(currentMonth)

  async function refresh() {
    setError('')
    try {
      const response = await kosApi.listAll()
      setData(response.data)
      setSource(response.source)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setLoading(false)
      setBusy(false)
    }
  }

  async function runAction(action) {
    setBusy(true)
    setError('')
    try {
      const response = await action()
      setData(response.data)
      setSource(response.source)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      refresh()
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [])

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
    availableRooms,
    busy,
    canMutate,
    currentMonth,
    data,
    delinquentTenants,
    enrichedTenants,
    error,
    handlePaymentSubmit,
    handleRoomSubmit,
    handleTenantSubmit,
    latestPayments,
    loading,
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
    setPaymentForm,
    setReportMonth,
    setRoomForm,
    setTenantForm,
    source,
    stats,
    tenantForm,
  }
}
