import { AppLayout } from './components/layout/AppLayout'
import { useKosAdmin } from './hooks/useKosAdmin'
import { DashboardPage } from './pages/DashboardPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { ReportsPage } from './pages/ReportsPage'
import { RoomsPage } from './pages/RoomsPage'
import { TenantsPage } from './pages/TenantsPage'

function App() {
  const admin = useKosAdmin()

  if (admin.loading) {
    return (
      <main className="grid min-h-svh place-items-center overflow-x-clip bg-[#f4f1e8] text-[#17231f]">
        <div className="grid w-[min(960px,calc(100%_-_40px))] grid-cols-[1.3fr_1fr] gap-3.5 max-[680px]:grid-cols-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              className="min-h-40 animate-pulse rounded-3xl bg-[linear-gradient(110deg,#20312c_8%,#2f463f_18%,#20312c_33%)] bg-[length:200%_100%]"
              key={index}
            />
          ))}
        </div>
      </main>
    )
  }

  return (
    <AppLayout
      activeTab={admin.activeTab}
      busy={admin.busy}
      error={admin.error}
      onRefresh={admin.refresh}
      onTabChange={admin.setActiveTab}
      source={admin.source}
    >
      {admin.activeTab === 'dashboard' && (
        <DashboardPage
          currentMonth={admin.currentMonth}
          data={admin.data}
          latestPayments={admin.latestPayments}
          onNavigate={admin.setActiveTab}
          stats={admin.stats}
        />
      )}

      {admin.activeTab === 'kamar' && (
        <RoomsPage
          data={admin.data}
          disabled={!admin.canMutate}
          onCancel={admin.resetRoomForm}
          onDelete={admin.runAction}
          onEdit={admin.setRoomForm}
          onSubmit={admin.handleRoomSubmit}
          roomForm={admin.roomForm}
          setRoomForm={admin.setRoomForm}
        />
      )}

      {admin.activeTab === 'penyewa' && (
        <TenantsPage
          availableRooms={admin.availableRooms}
          disabled={!admin.canMutate}
          enrichedTenants={admin.enrichedTenants}
          onCancel={admin.resetTenantForm}
          onSubmit={admin.handleTenantSubmit}
          runAction={admin.runAction}
          setTenantForm={admin.setTenantForm}
          tenantForm={admin.tenantForm}
        />
      )}

      {admin.activeTab === 'pembayaran' && (
        <PaymentsPage
          data={admin.data}
          disabled={!admin.canMutate}
          enrichedTenants={admin.enrichedTenants}
          onCancel={admin.resetPaymentForm}
          onSubmit={admin.handlePaymentSubmit}
          paymentForm={admin.paymentForm}
          runAction={admin.runAction}
          setPaymentForm={admin.setPaymentForm}
        />
      )}

      {admin.activeTab === 'laporan' && (
        <ReportsPage
          delinquentTenants={admin.delinquentTenants}
          monthlyRevenue={admin.monthlyRevenue}
          reportMonth={admin.reportMonth}
          selectedMonthRevenue={admin.selectedMonthRevenue}
          setReportMonth={admin.setReportMonth}
        />
      )}
    </AppLayout>
  )
}

export default App
