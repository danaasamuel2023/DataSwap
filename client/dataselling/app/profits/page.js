'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  TrendingUp, Coins, Package, Users, Calendar, Download, ArrowUp, ArrowDown,
  BarChart3, FileSpreadsheet, RefreshCw, AlertCircle, Loader2,
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

export default function ProfitDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [bestPackages, setBestPackages] = useState([]);
  const [profitTrends, setProfitTrends] = useState([]);

  const [network, setNetwork] = useState('mtn');
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userrole');
    if (!token || role !== 'admin') { router.push('/Auth'); return; }
    fetchAll();
  }, [network, period]); // eslint-disable-line

  async function fetchAll() {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const base = 'https://datamall.onrender.com/api/profit';
      const [dailyR, monthlyR, packagesR, trendsR] = await Promise.all([
        axios.get(`${base}/daily-report?network=${network}`, { headers }),
        axios.get(`${base}/monthly-summary?network=${network}`, { headers }),
        axios.get(`${base}/best-packages?network=${network}&days=${period}`, { headers }),
        axios.get(`${base}/trends?network=${network}&days=${period}`, { headers }),
      ]);
      setDailyReport(dailyR.data);
      setMonthlyData(monthlyR.data);
      setBestPackages(packagesR.data.packages || []);
      setProfitTrends(trendsR.data.trends || []);
    } catch (_) {
      setError('Failed to load profit data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function initializePricing() {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://datamall.onrender.com/api/profit/initialize-pricing', {},
        { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (_) {
      setError('Failed to initialize pricing.');
    } finally {
      setRefreshing(false);
    }
  }

  async function exportData() {
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(`https://datamall.onrender.com/api/profit/export?network=${network}`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `profit-report-${network}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); link.click(); link.remove();
    } catch (_) {
      setError('Failed to export.');
    }
  }

  const today = dailyReport?.report?.[0] || {};
  const summary = {
    revenue: today.totalRevenue || 0,
    profit:  today.totalProfit || 0,
    orders:  today.totalOrders || 0,
    margin:  today.averageProfitMargin || 0,
  };
  const growth = dailyReport?.growth || {};

  const trendData = profitTrends.length ? {
    labels: profitTrends.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily profit',
        data: profitTrends.map(d => d.profit),
        borderColor: '#1E88FF',
        backgroundColor: 'rgba(30,136,255,.10)',
        tension: .25, fill: true,
      },
      {
        label: '7-day average',
        data: profitTrends.map(d => d.movingAvgProfit),
        borderColor: '#FF6B1A',
        backgroundColor: 'transparent',
        tension: .25, borderDash: [6, 4],
      },
    ],
  } : null;

  const packageData = bestPackages.length ? (() => {
    const top = bestPackages.slice(0, 5);
    return {
      labels: top.map(p => `${p.capacity}GB`),
      datasets: [{
        label: 'Total profit',
        data: top.map(p => p.totalProfit),
        backgroundColor: ['#1E88FF', '#0B3D91', '#FF6B1A', '#F59E0B', '#16A34A'],
        borderWidth: 0,
      }],
    };
  })() : null;

  if (loading) {
    return (
      <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] grid place-items-center">
        <div className="text-center">
          <Loader2 size={36} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
          <p className="mt-3 text-[var(--color-ink-muted)]">Loading profit data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-ink-subtle)]">Admin</p>
            <h1 className="mt-1 text-3xl font-black text-[var(--color-brand-navy)] inline-flex items-center gap-3">
              <TrendingUp size={28} className="text-emerald-600" />
              Profit analytics
            </h1>
            <p className="mt-1 text-[var(--color-ink-muted)]">Track business performance and profitability.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={network} onChange={(e) => setNetwork(e.target.value)} className="input !py-2 !px-3 !w-auto">
              <option value="mtn">MTN</option>
              <option value="telecel">Telecel</option>
              <option value="at">AirtelTigo</option>
            </select>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input !py-2 !px-3 !w-auto">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button onClick={initializePricing} disabled={refreshing} className="btn-ghost !py-2 !px-3 text-sm disabled:opacity-50">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Init pricing
            </button>
            <button onClick={exportData} className="btn-primary !py-2 !px-3 text-sm">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4 inline-flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPI label="Today's revenue" value={`GHS ${summary.revenue.toFixed(2)}`} icon={<Coins size={18} />} accent="blue"
               growth={growth.revenue} />
          <KPI label="Today's profit"  value={`GHS ${summary.profit.toFixed(2)}`} icon={<TrendingUp size={18} />} accent="emerald"
               growth={growth.profit} />
          <KPI label="Today's orders"  value={summary.orders} icon={<Package size={18} />} accent="orange"
               growth={growth.orders} />
          <KPI label="Profit margin"   value={`${summary.margin.toFixed(2)}%`} icon={<BarChart3 size={18} />} accent="navy"
               sub="Average margin" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="card p-5">
            <h2 className="font-bold text-[var(--color-ink)] mb-4">Profit trends</h2>
            {trendData ? (
              <Line data={trendData} options={{
                responsive: true,
                plugins: { legend: { position: 'top', labels: { color: '#3B4A66' } } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'GHS ' + Number(v).toFixed(0), color: '#6B7891' },
                    grid: { color: 'rgba(10,22,40,.06)' },
                  },
                  x: { ticks: { color: '#6B7891' }, grid: { display: false } },
                },
              }} />
            ) : (
              <p className="text-center py-10 text-[var(--color-ink-muted)]">No trend data available</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-bold text-[var(--color-ink)] mb-4">Top performing packages</h2>
            {packageData ? (
              <Doughnut data={packageData} options={{
                responsive: true,
                plugins: { legend: { position: 'right', labels: { color: '#3B4A66' } } },
              }} />
            ) : (
              <p className="text-center py-10 text-[var(--color-ink-muted)]">No package data available</p>
            )}
          </div>
        </div>

        {/* Packages table */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--color-ink)]">Detailed package performance</h2>
            <Link href="/admin/profit/pricing" className="text-sm font-semibold text-[var(--color-brand-blue-deep)] hover:underline">
              Manage pricing &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-line)]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-muted)] text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {['Package','Orders','Revenue','Total profit','Margin %','Profit/unit'].map(h =>
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {bestPackages.length ? bestPackages.map((p, i) => (
                  <tr key={i} className="hover:bg-[var(--color-surface-muted)]/60">
                    <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">{p.capacity}GB</td>
                    <td className="px-4 py-3 text-[var(--color-ink)]">{p.totalOrders}</td>
                    <td className="px-4 py-3 text-[var(--color-ink)]">GHS {Number(p.totalRevenue || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">GHS {Number(p.totalProfit || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-[var(--color-ink)]">{Number(p.avgProfitMargin || 0).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-[var(--color-ink)]">GHS {Number(p.currentPricing?.profitPerUnit || 0).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-[var(--color-ink-muted)]">No package data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <QuickLink href="/admin/profit/pricing" title="Manage pricing"
                     desc="Update provider costs and selling prices" icon={<FileSpreadsheet size={22} className="text-[var(--color-brand-blue-deep)]" />} />
          <QuickLink href="/admin/profit/monthly" title="Monthly reports"
                     desc="View detailed monthly analytics" icon={<Calendar size={22} className="text-emerald-600" />} />
          <QuickLink href="/admin/profit/segments" title="User segments"
                     desc="Analyze profit by user type" icon={<Users size={22} className="text-[var(--color-brand-orange)]" />} />
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, icon, accent, growth, sub }) {
  const palette = {
    blue:    { bg: 'bg-[var(--color-brand-blue-soft)]', text: 'text-[var(--color-brand-blue-deep)]' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    orange:  { bg: 'bg-[var(--color-brand-orange-soft)]', text: 'text-[#B7480F]' },
    navy:    { bg: 'bg-[var(--color-surface-sunken)]', text: 'text-[var(--color-brand-navy)]' },
  }[accent];
  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</p>
        <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">{value}</p>
        {growth !== undefined ? (
          <p className={`mt-1 text-xs inline-flex items-center gap-1 ${growth >= 0 ? 'text-emerald-600' : 'text-[var(--color-danger)]'}`}>
            {growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(growth).toFixed(1)}% vs yesterday
          </p>
        ) : sub ? (
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{sub}</p>
        ) : null}
      </div>
      <span className={`w-10 h-10 rounded-lg inline-flex items-center justify-center ${palette.bg} ${palette.text}`}>
        {icon}
      </span>
    </div>
  );
}

function QuickLink({ href, title, desc, icon }) {
  return (
    <Link href={href} className="card p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform">
      <div>
        <h3 className="font-semibold text-[var(--color-ink)]">{title}</h3>
        <p className="text-sm text-[var(--color-ink-muted)] mt-0.5">{desc}</p>
      </div>
      {icon}
    </Link>
  );
}
