import {
    Activity,
    Bell,
    BookOpenCheck,
    Globe2,
    Layers3,
    MenuSquare,
    MessageCircle,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet
} from 'lucide-react';
import React from 'react';

const navItems = [
  { label: 'Dashboard', icon: MenuSquare },
  { label: 'Guides', icon: Users },
  { label: 'Bookings', icon: BookOpenCheck },
  { label: 'Payments', icon: Wallet },
  { label: 'Messaging', icon: MessageCircle },
  { label: 'Reviews & Reports', icon: Layers3 },
  { label: 'Settings', icon: ShieldCheck }
];

const statusChips: Array<{ label: string; value: number; tone: string }> = [
  { label: 'Active Trips', value: 48, tone: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { label: 'Verified Guides', value: 124, tone: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { label: 'Pending Bookings', value: 16, tone: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { label: 'Safety SOS Alerts', value: 0, tone: 'bg-slate-100 text-slate-700 border border-slate-200' }
];

const kpiCards: Array<{ label: string; primary: string; secondary?: string; delta?: string }> = [
  { label: 'Total Platform Volume', primary: '₹14.8L', secondary: '+18.4% vs last month', delta: '▲ +24% Bookings' },
  { label: 'Green Travel CO2 Saved', primary: '3,420 kg', secondary: 'Across 280 eco-routes', delta: '▲ Eco Target 92%' },
  { label: 'Active AI Consultations', primary: '1,890', secondary: 'Sarthi Assistant + Mood AI', delta: '▲ 99.2% Positive' }
];

const guideApplications: Array<{ name: string; region: string; tags: string[]; docs: string; verification: string; status: string }> = [
  { name: 'Kavita Rathore', region: 'Jaipur, Rajasthan', tags: ['Heritage Forts', 'Palaces', 'Hindi / English'], docs: 'Govt Tourism ID #JP-889', verification: 'Aadhaar Verified', status: 'Pending Review' },
  { name: 'Sameer Qureshi', region: 'Lucknow, Uttar Pradesh', tags: ['Awadhi Food', 'Bazaars', 'Urdu / Hindi'], docs: 'Guide License #UP-412', verification: 'Police Cleared', status: 'Pending Review' },
  { name: 'Pradeep Nayak', region: 'Hampi, Karnataka', tags: ['Temple Ruins', 'History', 'Kannada / English'], docs: 'Archaeology Certified', verification: 'Identity Verified', status: 'In Review' }
];

const bookingRows: Array<{ code: string; user: string; guide: string; category: string; destination: string; date: string; status: string; payment: string }> = [
  { code: 'BK-8902', user: 'Aarav Sharma', guide: 'Mohammad Tariq', category: 'Heritage Weekend', destination: 'Lucknow, UP', date: 'Tomorrow, 9:00 AM', status: 'Confirmed', payment: 'Paid' },
  { code: 'BK-8901', user: 'Sneha Patel', guide: 'Ananya Sharma', category: 'Spiritual Walk', destination: 'Varanasi, UP', date: '22 Aug 2026', status: 'Confirmed', payment: 'Paid' },
  { code: 'BK-8899', user: 'Vikram Mehta', guide: 'Rohan Naik', category: 'Eco Trail', destination: 'Goa', date: '25 Aug 2026', status: 'Pending', payment: 'Pending' },
  { code: 'BK-8894', user: 'Pooja Iyer', guide: 'Devika Menon', category: 'Backwaters Ayurveda', destination: 'Alleppey, Kerala', date: '28 Aug 2026', status: 'Confirmed', payment: 'Paid' }
];

const paymentRows: Array<{ id: string; amount: string; person: string; type: string; gateway: string; status: string; mode: string }> = [
  { id: 'PAY-7712', amount: '₹3,600', person: 'Aarav Sharma', type: 'Package Hold', gateway: 'Razorpay UPI', status: 'Success', mode: 'GPay' },
  { id: 'PAY-7710', amount: '₹1,500', person: 'Sneha Patel', type: 'Local Guide Fee', gateway: 'Razorpay Card', status: 'Success', mode: 'Visa Card' },
  { id: 'PAY-7708', amount: '₹2,500', person: 'Pooja Iyer', type: 'Weekend Experience', gateway: 'Razorpay NetBanking', status: 'Success', mode: 'HDFC' }
];

const chartBars: number[] = [32, 45, 28, 56, 64, 78, 85];
const destinationChart: Array<{ label: string; value: number }> = [
  { label: 'Lucknow (Awadh Culture)', value: 34 },
  { label: 'Varanasi (Ganga Ghats)', value: 26 },
  { label: 'Goa (Eco & Coastal)', value: 22 },
  { label: 'Kerala (Backwaters)', value: 18 }
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold">
              DT
            </div>
            <div>
              <p className="text-sm text-slate-500">DarShana Admin</p>
              <p className="text-lg font-semibold">Travel Ops Studio</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="px-4 pb-6 space-y-2">
            {statusChips.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                Live status chips will appear once operational data is connected.
              </div>
            ) : (
              statusChips.map((chip) => (
                <div key={chip.label} className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${chip.tone}`}>
                  <span>{chip.label}</span>
                  <span className="text-base">{chip.value}</span>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Admin overview</p>
              <h1 className="text-3xl font-semibold">Operations Command Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Switch Env
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Manual Booking
              </button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200">
                Broadcast Alert
              </button>
            </div>
          </header>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kpiCards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                Live KPIs will appear here once analytics is connected.
              </div>
            ) : (
              kpiCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{card.primary}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.secondary}</p>
                  <p className="mt-3 text-xs font-semibold text-emerald-600">{card.delta}</p>
                </div>
              ))
            )}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Daily Bookings Trend</h3>
                <span className="text-xs text-slate-500">Awaiting live data</span>
              </div>
              <div className="mt-6 flex items-end gap-3">
                {chartBars.length === 0 ? (
                  <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Booking trend data will display once connected to real events.
                  </div>
                ) : (
                  chartBars.map((bar, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-full bg-blue-50 p-1 text-center text-[10px] text-blue-600">{bar}</div>
                      <div className="w-full rounded-full bg-gradient-to-t from-blue-100 to-blue-500" style={{ height: `${bar * 1.2}px` }} />
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Most Booked Destinations</h3>
                <Globe2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 space-y-3">
                {destinationChart.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Destination insights will show once booking data is ingested.
                  </p>
                ) : (
                  destinationChart.map((dest) => (
                    <div key={dest.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dest.label}</span>
                        <span className="text-slate-500">{dest.value}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${dest.value}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Guide Registration Queue</h3>
                <span className="text-xs text-amber-500">Live metrics pending</span>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {guideApplications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500">No pending guide registrations yet.</div>
                ) : (
                  guideApplications.map((guide) => (
                    <div key={guide.name} className="py-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{guide.name}</p>
                        <span className="text-xs font-semibold text-amber-600">{guide.status}</span>
                      </div>
                      <p className="text-xs text-slate-500">{guide.region}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {guide.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{guide.docs} • {guide.verification}</p>
                      <div className="mt-3 flex gap-3 text-xs font-semibold">
                        <button className="rounded-lg border border-emerald-600 px-3 py-1 text-emerald-600">Approve</button>
                        <button className="rounded-lg border border-rose-200 px-3 py-1 text-rose-500">Reject</button>
                        <button className="rounded-lg border border-amber-200 px-3 py-1 text-amber-600">Request Docs</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Gateway Health</h3>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Connect Stripe or Razorpay webhooks to surface live gateway metrics here.
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bookings Management</h3>
                <button className="text-xs font-semibold text-blue-600">View All</button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-2">Booking</th>
                      <th>User</th>
                      <th>Guide</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookingRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-sm text-slate-500">No bookings to display yet.</td>
                      </tr>
                    ) : (
                      bookingRows.map((row) => (
                        <tr key={row.code} className="text-sm">
                          <td className="py-3 font-semibold">{row.code}</td>
                          <td>{row.user}</td>
                          <td>{row.guide}</td>
                          <td>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {row.status}
                            </span>
                          </td>
                          <td>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {row.payment}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payments & Wallet</h3>
                <button className="text-xs font-semibold text-blue-600">Download report</button>
              </div>
              <div className="mt-4 space-y-4">
                {paymentRows.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Wallet activity will populate after transactions occur.
                  </div>
                ) : (
                  paymentRows.map((payment) => (
                    <div key={payment.id} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-semibold">{payment.id}</p>
                        <span className="text-slate-500">{payment.gateway}</span>
                      </div>
                      <p className="text-xs text-slate-400">{payment.type}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-600">{payment.amount}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{payment.person}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{payment.mode}</span>
                        <span className={`rounded-full px-2 py-0.5 font-semibold ${payment.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Messaging Center</h3>
                <button className="text-xs font-semibold text-blue-600">Compose</button>
              </div>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Messaging stats will appear once queues are connected.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Reviews & Reports</h3>
                <button className="text-xs font-semibold text-blue-600">Export</button>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Reviews and reports will be available once real feedback data is connected.
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Settings</h3>
                <button className="text-xs font-semibold text-blue-600">Open settings</button>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                System settings will reflect once the admin backend is wired up.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Security & Access Control</h3>
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Security posture and audit logs will populate from the live auth service.
              </div>
            </div>
          </section>
        </main>

        <aside className="w-full border-l border-slate-200 bg-white/90 backdrop-blur px-5 py-6 lg:w-80">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
              <p className="text-sm text-blue-100">Ops Center</p>
              <h2 className="mt-2 text-2xl font-semibold">Live Operations</h2>
              <p className="mt-2 text-xs text-blue-100">Queue summary · Webhooks · Messaging health</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Queue Summary</h3>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Queues will populate from the live backend once connected.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Payment Webhooks</h3>
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Webhook events will stream in once payment gateways are wired.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Messaging Queue</h3>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Messaging delivery stats will appear after integrating the comms service.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Admin Notifications</h3>
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Live admin notifications will show here when hooked to the events stream.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2 text-xs font-semibold">
              <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
                Quick actions will be enabled once admin APIs are connected.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
