'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  MinusCircle, Search, ArrowLeft, AlertCircle, CheckCircle2,
  AlertTriangle, Loader2, Wallet, ChevronLeft, ChevronRight,
} from 'lucide-react';

export default function DeductUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userrole');
    if (!token || role !== 'admin') { router.push('/Auth'); return; }
    fetchUsers(1, '');
  }, []); // eslint-disable-line

  async function fetchUsers(p, q = '') {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(
        `https://bignsah.onrender.com/api/users?page=${p}&limit=10&search=${q}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(r.data.users);
      setPages(r.data.pagination.pages);
      setPage(p);
    } catch (_) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  async function deductOne(id) {
    if (!amount || parseFloat(amount) <= 0) return setError('Enter a valid amount.');
    if (!description) return setError('Enter a description (visible to user).');
    setWorking(true); setSuccess(''); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://bignsah.onrender.com/api/users/${id}/deduct`,
        {
          amount: parseFloat(amount), description,
          reason: reason || 'Administrative deduction',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Amount deducted.');
      setAmount(''); setDescription(''); setReason('');
      fetchUsers(page, search);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Insufficient balance') {
        setError(`User has insufficient balance (GHS ${err.response.data.userBalance}).`);
      } else {
        setError(err.response?.data?.message || 'Failed to deduct.');
      }
    } finally { setWorking(false); }
  }

  async function deductMany() {
    if (!selected.length) return setError('Select at least one user.');
    if (!amount || parseFloat(amount) <= 0) return setError('Enter a valid amount.');
    if (!description) return setError('Enter a description (visible to user).');
    setWorking(true); setSuccess(''); setError('');
    try {
      const token = localStorage.getItem('token');
      const r = await axios.post(
        `https://bignsah.onrender.com/api/bulk-deduct`,
        {
          userIds: selected, amount: parseFloat(amount), description,
          reason: reason || 'Administrative deduction',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { summary } = r.data;
      setSuccess(
        summary.failed > 0
          ? `Deducted from ${summary.successful}; failed for ${summary.failed} (often due to balance).`
          : `Deducted from ${summary.successful} user(s).`
      );
      setSelected([]); setAmount(''); setDescription(''); setReason('');
      fetchUsers(page, search);
    } catch (err) {
      setError(err.response?.data?.message || 'Bulk deduct failed.');
    } finally { setWorking(false); }
  }

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg border border-[var(--color-line)] hover:bg-white">
            <ArrowLeft size={18} className="text-[var(--color-ink)]" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-ink-subtle)]">Admin</p>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-brand-navy)] inline-flex items-center gap-2">
              <MinusCircle size={26} className="text-[var(--color-danger)]" /> Deduct from wallets
            </h1>
          </div>
        </div>

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 mb-4 inline-flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4 inline-flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form */}
          <div className="card p-5">
            <h2 className="font-bold text-[var(--color-ink)] inline-flex items-center gap-2">
              Deduction details
              <AlertTriangle size={14} className="text-amber-500" />
            </h2>

            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              This action reduces user wallet balances. Use a clear description &mdash; the user will see it.
            </div>

            <div className="mt-5">
              <label className="label">Amount (GHS) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-danger)]">GHS</span>
                <input type="number" min="0" step="0.01" placeholder="0.00"
                       value={amount} onChange={(e) => setAmount(e.target.value)} className="input pl-14" />
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Description (visible to user) *</label>
              <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Reversal for failed bundle" className="input resize-none" />
            </div>

            <div className="mt-4">
              <label className="label">Internal reason (optional)</label>
              <textarea rows="2" value={reason} onChange={(e) => setReason(e.target.value)}
                        placeholder="Internal note, hidden from user" className="input resize-none" />
            </div>

            <button onClick={deductMany} disabled={working || !selected.length}
                    className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {working ? <><Loader2 size={16} className="animate-spin" /> Working…</>
                       : <><MinusCircle size={16} /> Deduct from selected ({selected.length})</>}
            </button>
          </div>

          {/* Users */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <h2 className="font-bold text-[var(--color-ink)]">Users</h2>
              <form onSubmit={(e) => { e.preventDefault(); fetchUsers(1, search); }} className="flex w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="input pl-9" />
                </div>
              </form>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <Loader2 size={28} className="mx-auto animate-spin text-[var(--color-danger)]" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-[var(--color-line)]">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--color-surface-muted)] text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
                        <th className="px-3 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => setSelected(e.target.checked ? users.filter(u => u.walletBalance > 0).map(u => u._id) : [])}
                            checked={users.length > 0 && selected.length === users.filter(u => u.walletBalance > 0).length}
                            className="h-4 w-4 accent-[var(--color-danger)]"
                          />
                        </th>
                        <th className="px-3 py-3 text-left font-semibold">Name</th>
                        <th className="px-3 py-3 text-left font-semibold">Email</th>
                        <th className="px-3 py-3 text-left font-semibold">Balance</th>
                        <th className="px-3 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-line)]">
                      {users.length ? users.map(u => {
                        const noBalance = u.walletBalance <= 0;
                        return (
                          <tr key={u._id} className="hover:bg-[var(--color-surface-muted)]/60">
                            <td className="px-3 py-3">
                              <input type="checkbox" checked={selected.includes(u._id)} onChange={() => toggle(u._id)}
                                     disabled={noBalance} title={noBalance ? 'No balance' : ''}
                                     className="h-4 w-4 accent-[var(--color-danger)] disabled:opacity-50" />
                            </td>
                            <td className="px-3 py-3 font-medium text-[var(--color-ink)]">{u.name}</td>
                            <td className="px-3 py-3 text-[var(--color-ink-muted)]">{u.email}</td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center gap-1.5 font-semibold ${noBalance ? 'text-[var(--color-danger)]' : 'text-[var(--color-brand-navy)]'}`}>
                                <Wallet size={14} />
                                GHS {Number(u.walletBalance || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <button onClick={() => deductOne(u._id)}
                                      disabled={working || !amount || !description || noBalance}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <MinusCircle size={12} /> Deduct
                              </button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr><td colSpan="5" className="px-3 py-8 text-center text-[var(--color-ink-muted)]">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {pages > 1 && (
                  <div className="mt-5 flex items-center justify-center gap-1">
                    <button onClick={() => fetchUsers(Math.max(1, page - 1), search)} disabled={page === 1}
                            className="btn-ghost text-sm !py-1.5 !px-3 disabled:opacity-50">
                      <ChevronLeft size={14} /> Prev
                    </button>
                    {[...Array(pages)].map((_, i) => {
                      const n = i + 1;
                      const show = n === 1 || n === pages || Math.abs(n - page) <= 1;
                      if (!show) {
                        if ((n === 2 && page > 3) || (n === pages - 1 && page < pages - 2)) {
                          return <span key={`e${i}`} className="px-2 text-[var(--color-ink-subtle)]">…</span>;
                        }
                        return null;
                      }
                      return (
                        <button key={n} onClick={() => fetchUsers(n, search)}
                                className={`min-w-[34px] px-2 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                  n === page
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white border border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)]'
                                }`}>
                          {n}
                        </button>
                      );
                    })}
                    <button onClick={() => fetchUsers(Math.min(pages, page + 1), search)} disabled={page === pages}
                            className="btn-ghost text-sm !py-1.5 !px-3 disabled:opacity-50">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
