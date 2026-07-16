import { useEffect, useState } from "react";
import Nav from "../../components/Nav";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type SellStatus = "pending" | "approved" | "denied" | "pickup_confirmed" | "trade_accepted" | "trade_denied";

interface BookEntry { bookTitle: string; authorName: string; photoUrl: string; price: number | null; }

interface SellRequest {
  _id: string;
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

const statusCfg: Record<SellStatus, { label: string; dot: string; badge: string }> = {
  pending:          { label: "Pending Review",     dot: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50" },
  approved:         { label: "Approved",            dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50" },
  denied:           { label: "Denied",              dot: "bg-red-500",     badge: "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50" },
  pickup_confirmed: { label: "Pickup Confirmed",    dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50" },
  trade_accepted:   { label: "Trade Accepted ✓",    dot: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700/50" },
  trade_denied:     { label: "Trade Denied",        dot: "bg-red-600",     badge: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50" },
};

const statusMsg: Partial<Record<SellStatus, { type: "info" | "success" | "warn"; text: string }>> = {
  approved:         { type: "success", text: "Your sell request has been approved! We'll contact you shortly to arrange pickup." },
  denied:           { type: "warn",    text: "Unfortunately your sell request was denied." },
  pickup_confirmed: { type: "info",    text: "Pickup confirmed! The admin will contact you at the number you provided." },
  trade_accepted:   { type: "success", text: "Trade complete! Thank you for selling with Dusted Books." },
  trade_denied:     { type: "warn",    text: "The trade was denied after pickup. Please contact support." },
};

const StatusBadge = ({ status }: { status: SellStatus }) => {
  const c = statusCfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${c.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{c.label}
    </span>
  );
};

export default function MySellRequests() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/sell-requests/my`, { credentials: "include" });
        if (!res.ok) throw new Error();
        setRequests(await res.json());
      } catch { setError("Could not load your sell requests."); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-gray-950 overflow-x-hidden w-full max-w-full">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:pt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-gray-50">My Sell Requests</h1>
          <p className="mt-1.5 text-sm text-stone-500 dark:text-gray-400">Track the status of your book sell submissions.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">{error}</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <svg className="mx-auto mb-3 h-10 w-10 text-stone-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="text-sm font-medium text-stone-400 dark:text-gray-500">
              No sell requests yet.{" "}
              <a href="/sell-book" className="text-amber-700 underline hover:text-amber-600 dark:text-amber-400">Sell your first book</a>
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {requests.map((req) => {
              const isExpanded = !!expanded[req._id];
              const msg = statusMsg[req.status];
              const msgBg = msg?.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : msg?.type === "info"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";

              const totalIndividual = req.books.reduce((s, b) => s + (b.price ?? 0), 0);
              const displayPrice = req.sellType === "series" ? req.seriesPrice : totalIndividual;
              const priceLabel = req.sellType === "series" ? "Bundle price" : (req.books.length > 1 ? "Total asking" : "Asking price");

              return (
                <li key={req._id} className="rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-gray-800 dark:text-gray-300">
                          {req.sellType === "series" ? "Series / Bundle" : `${req.books.length} Book${req.books.length > 1 ? "s" : ""}`}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Book chips — name / author / price */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {req.books.map((b, i) => (
                          <span key={i} className="rounded-full bg-stone-50 px-2.5 py-0.5 text-xs text-stone-600 ring-1 ring-stone-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                            {b.bookTitle}
                            {b.authorName && <span className="text-stone-400"> — {b.authorName}</span>}
                            {req.sellType === "individual" && b.price != null && (
                              <span className="ml-1 font-semibold text-amber-700 dark:text-amber-400"> — {fmt(b.price)}</span>
                            )}
                          </span>
                        ))}
                      </div>

                      {displayPrice != null && displayPrice > 0 && (
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                          {priceLabel}: {fmt(displayPrice)}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  {/* Status message */}
                  {msg && (
                    <div className={`mx-5 mb-4 rounded-xl px-4 py-3 text-sm font-medium ${msgBg}`}>
                      {msg.text}
                      {req.adminNotes && <p className="mt-1 text-xs opacity-80">Note: {req.adminNotes}</p>}
                    </div>
                  )}

                  {/* Pickup info strip */}
                  <div className="mx-5 mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500 dark:bg-gray-800 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      {req.contactNumber}
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <span className="truncate">{req.location}</span>
                    </span>
                  </div>

                  {/* Expand for photos */}
                  {req.books.some((b) => b.photoUrl) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded((p) => ({ ...p, [req._id]: !p[req._id] }))}
                        className="flex w-full items-center justify-between border-t border-stone-100 px-5 py-3 text-xs font-medium text-stone-400 transition hover:text-stone-700 dark:border-gray-700/60 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <span>{isExpanded ? "Hide" : "View"} book photos</span>
                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="flex flex-wrap gap-3 border-t border-stone-100 px-5 pb-5 pt-4 dark:border-gray-700/60">
                          {req.books.filter((b) => b.photoUrl).map((b, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <img src={b.photoUrl} alt={b.bookTitle} className="h-24 w-16 rounded-lg object-cover shadow-sm" />
                              <p className="max-w-[64px] truncate text-center text-[10px] text-stone-400">{b.bookTitle}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
