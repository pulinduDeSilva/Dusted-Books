import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type SellStatus = "pending" | "approved" | "denied" | "pickup_confirmed" | "trade_accepted" | "trade_denied";

interface BookEntry { bookTitle: string; authorName: string; photoUrl: string; price: number | null; }

interface SellRequest {
  _id: string;
  userEmail: string;
  sellType: "individual" | "series";
  seriesPrice?: number | null;
  books: BookEntry[];
  location: string;
  contactNumber: string;
  status: SellStatus;
  adminNotes?: string;
  createdAt: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n);

/* ── Status config ── */
const statusCfg: Record<SellStatus, { label: string; dot: string; badge: string; glow: string }> = {
  pending:          { label: "Pending",          dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",        glow: "shadow-amber-400/20"  },
  approved:         { label: "Approved",          dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50", glow: "shadow-emerald-400/20" },
  denied:           { label: "Denied",            dot: "bg-red-500",     badge: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",                glow: "shadow-red-400/20"     },
  pickup_confirmed: { label: "Pickup Confirmed",  dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",           glow: "shadow-blue-400/20"    },
  trade_accepted:   { label: "Trade Accepted",    dot: "bg-emerald-600", badge: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700/50", glow: "shadow-emerald-500/20" },
  trade_denied:     { label: "Trade Denied",      dot: "bg-red-600",     badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",               glow: "shadow-red-500/20"     },
};

const filterConfig = {
  all:              { label: "All" },
  pending:          { label: "Pending" },
  approved:         { label: "Approved" },
  pickup_confirmed: { label: "Pickup" },
  trade_accepted:   { label: "Trade Accepted" },
  trade_denied:     { label: "Trade Denied" },
  denied:           { label: "Denied" },
} as const;

const FILTERS = ["all", "pending", "approved", "pickup_confirmed", "trade_accepted", "trade_denied", "denied"] as const;
type FilterTab = typeof FILTERS[number];

const StatusBadge = ({ status }: { status: SellStatus }) => {
  const c = statusCfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

/* ── Stats card ── */
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`rounded-xl border bg-white px-4 py-3 shadow-sm dark:bg-gray-900 ${color}`}>
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</p>
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default function SellRequestManagement() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<Record<string, string>>({});
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/sell-requests`, { credentials: "include" });
        if (!res.ok) throw new Error();
        setRequests(await res.json());
      } catch { setError("Could not load sell requests."); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleAction = async (id: string, status: SellStatus) => {
    try {
      setActionLoading((p) => ({ ...p, [id]: true }));
      setActionError((p) => ({ ...p, [id]: "" }));
      const res = await fetch(`${API}/sell-requests/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: adminNotes[id] || "" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Action failed."); }
      const updated: SellRequest = await res.json();
      setRequests((p) => p.map((r) => (r._id === id ? updated : r)));
      setNotesOpen((p) => ({ ...p, [id]: false }));
    } catch (err: unknown) {
      setActionError((p) => ({ ...p, [id]: err instanceof Error ? err.message : "Something went wrong." }));
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const counts = Object.fromEntries(
    FILTERS.map((f) => [f, f === "all" ? requests.length : requests.filter((r) => r.status === f).length])
  ) as Record<FilterTab, number>;

  return (
    <div className="mx-auto max-w-5xl">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Sell Requests</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review and manage customer book sell submissions.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-700/40 dark:bg-amber-900/15">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{counts.pending} pending review</p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={counts.all} color="border-gray-200 dark:border-gray-700" />
        <StatCard label="Pending" value={counts.pending} color="border-amber-200 dark:border-amber-700/40" />
        <StatCard label="Approved" value={counts.approved + counts.pickup_confirmed} color="border-emerald-200 dark:border-emerald-700/40" />
        <StatCard label="Completed" value={counts.trade_accepted} color="border-blue-200 dark:border-blue-700/40" />
      </div>

      {/* ── Filter tabs ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              filter === tab
                ? "bg-gray-900 text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            {filterConfig[tab].label}
            <span className={`ml-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              filter === tab
                ? "bg-white/20 text-white dark:bg-black/20 dark:text-gray-900"
                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-16 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900">
          <svg className="h-5 w-5 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading sell requests…
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
            No {filter === "all" ? "" : filterConfig[filter].label.toLowerCase()} requests found.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((req) => {
            const isExpanded = !!expanded[req._id];
            const isLoading = !!actionLoading[req._id];
            const errMsg = actionError[req._id];
            const showNotes = !!notesOpen[req._id];
            const totalIndividual = req.books.reduce((s, b) => s + (b.price ?? 0), 0);
            const displayPrice = req.sellType === "series" ? req.seriesPrice : totalIndividual;
            const priceLabel = req.sellType === "series" ? "Bundle price" : (req.books.length > 1 ? "Total asking" : "Asking price");
            const cfg = statusCfg[req.status];

            return (
              <li
                key={req._id}
                className={`rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900 ${
                  req.status === "pending"
                    ? "border-amber-200 dark:border-amber-700/40"
                    : req.status === "approved" || req.status === "pickup_confirmed"
                    ? "border-emerald-200 dark:border-emerald-700/40"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* ── Status accent bar ── */}
                <div className={`h-1 w-full rounded-t-2xl ${cfg.dot}`} />

                {/* ── Card header ── */}
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-4">
                  <div className="flex-1 min-w-0">

                    {/* Top meta row */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        req.sellType === "series"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-stone-100 text-stone-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {req.sellType === "series" ? "Bundle" : `${req.books.length} Book${req.books.length > 1 ? "s" : ""}`}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>

                    {/* Book chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {req.books.map((b, i) => (
                        <span key={i} className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                          <span className="font-semibold">{b.bookTitle}</span>
                          {b.authorName && <span className="text-gray-400"> — {b.authorName}</span>}
                          {req.sellType === "individual" && b.price != null && (
                            <span className="ml-1 font-bold text-amber-700 dark:text-amber-400"> {fmt(b.price)}</span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    {displayPrice != null && displayPrice > 0 && (
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:ring-amber-700/40">
                        <svg className="h-3 w-3 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{priceLabel}: {fmt(displayPrice)}</span>
                      </div>
                    )}

                    {/* User */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      {req.userEmail}
                    </div>
                  </div>

                  <StatusBadge status={req.status} />
                </div>

                {/* ── Contact & address strip ── */}
                <div className="mx-5 mb-4 grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <svg className="h-3 w-3 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-amber-700 dark:text-amber-300">{req.contactNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs min-w-0 sm:col-span-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                      <svg className="h-3 w-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <span className="truncate text-gray-600 dark:text-gray-300">{req.location}</span>
                  </div>
                </div>

                {/* ── Photo gallery toggle ── */}
                {req.books.some((b) => b.photoUrl) && (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded((p) => ({ ...p, [req._id]: !p[req._id] }))}
                      className="flex w-full items-center justify-between border-t border-gray-100 px-5 py-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700/60 dark:text-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
                    >
                      <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {isExpanded ? "Hide" : "View"} book photos ({req.books.filter(b => b.photoUrl).length})
                      </span>
                      <svg className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-3 border-t border-gray-100 bg-gray-50/50 px-5 pb-5 pt-4 dark:border-gray-700/60 dark:bg-gray-800/20">
                        {req.books.filter((b) => b.photoUrl).map((b, i) => (
                          <div key={i} className="group flex flex-col items-center gap-1.5">
                            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                              <img
                                src={b.photoUrl}
                                alt={b.bookTitle}
                                className="h-28 w-20 object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>
                            <p className="max-w-[80px] truncate text-center text-[10px] font-medium text-gray-500 dark:text-gray-400">{b.bookTitle}</p>
                            {req.sellType === "individual" && b.price != null && (
                              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{fmt(b.price)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ── Action area ── */}
                <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-700/60">

                  {/* PENDING → Approve / Deny */}
                  {req.status === "pending" && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Actions</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(req._id, "approved")}
                          disabled={isLoading}
                          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 hover:shadow-emerald-500/30 disabled:opacity-60"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          {isLoading ? "Processing…" : "Approve"}
                        </button>
                        <button
                          onClick={() => setNotesOpen((p) => ({ ...p, [req._id]: !p[req._id] }))}
                          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                          Deny
                        </button>
                      </div>
                      {showNotes && (
                        <DenyForm
                          id={req._id}
                          isLoading={isLoading}
                          notes={adminNotes[req._id] || ""}
                          onNotes={(v) => setAdminNotes((p) => ({ ...p, [req._id]: v }))}
                          onConfirm={() => handleAction(req._id, "denied")}
                          onCancel={() => setNotesOpen((p) => ({ ...p, [req._id]: false }))}
                          placeholder="e.g. Condition not acceptable"
                        />
                      )}
                    </div>
                  )}

                  {/* APPROVED → Confirm Pickup / Deny */}
                  {req.status === "approved" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Approved — contact the customer and confirm pickup when ready.
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(req._id, "pickup_confirmed")}
                          disabled={isLoading}
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-60"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {isLoading ? "Processing…" : "Confirm Pickup"}
                        </button>
                        <button
                          onClick={() => setNotesOpen((p) => ({ ...p, [req._id]: !p[req._id] }))}
                          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                          Deny
                        </button>
                      </div>
                      {showNotes && (
                        <DenyForm
                          id={req._id}
                          isLoading={isLoading}
                          notes={adminNotes[req._id] || ""}
                          onNotes={(v) => setAdminNotes((p) => ({ ...p, [req._id]: v }))}
                          onConfirm={() => handleAction(req._id, "denied")}
                          onCancel={() => setNotesOpen((p) => ({ ...p, [req._id]: false }))}
                          placeholder="e.g. Customer unreachable"
                        />
                      )}
                    </div>
                  )}

                  {/* PICKUP_CONFIRMED → Accept Trade / Deny Trade */}
                  {req.status === "pickup_confirmed" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        Pickup confirmed — accept or deny the trade once the book is received.
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(req._id, "trade_accepted")}
                          disabled={isLoading}
                          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-60"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          {isLoading ? "Processing…" : "Accept Trade"}
                        </button>
                        <button
                          onClick={() => setNotesOpen((p) => ({ ...p, [req._id]: !p[req._id] }))}
                          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                          Deny Trade
                        </button>
                      </div>
                      {showNotes && (
                        <DenyForm
                          id={req._id}
                          isLoading={isLoading}
                          notes={adminNotes[req._id] || ""}
                          onNotes={(v) => setAdminNotes((p) => ({ ...p, [req._id]: v }))}
                          onConfirm={() => handleAction(req._id, "trade_denied")}
                          onCancel={() => setNotesOpen((p) => ({ ...p, [req._id]: false }))}
                          placeholder="e.g. Book condition misrepresented"
                        />
                      )}
                    </div>
                  )}

                  {/* Final states */}
                  {req.status === "trade_accepted" && (
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5 ring-1 ring-emerald-200 dark:from-emerald-900/20 dark:to-teal-900/10 dark:ring-emerald-700/40">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Trade accepted — transaction complete.</p>
                    </div>
                  )}

                  {(req.status === "denied" || req.status === "trade_denied") && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3.5 ring-1 ring-red-200 dark:bg-red-900/20 dark:ring-red-700/40">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                          {req.status === "denied" ? "Request denied." : "Trade denied."}
                        </p>
                        {req.adminNotes && (
                          <p className="mt-0.5 text-xs text-red-500 dark:text-red-400">{req.adminNotes}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {errMsg && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {errMsg}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── Reusable deny/confirm form ── */
interface DenyFormProps {
  id: string;
  isLoading: boolean;
  notes: string;
  onNotes: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder: string;
}

function DenyForm({ isLoading, notes, onNotes, onConfirm, onCancel, placeholder }: DenyFormProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-700/50 dark:bg-red-900/20">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-red-700 dark:text-red-300">Reason (optional)</label>
        <textarea
          rows={2}
          placeholder={placeholder}
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-600 dark:bg-gray-800 dark:text-gray-100 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </>
          ) : "Confirm Denial"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
