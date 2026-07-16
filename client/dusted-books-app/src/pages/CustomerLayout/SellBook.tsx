import { useState, useRef } from "react";
import Nav from "../../components/Nav";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Types ── */
type SellMode = "individual" | "series";

interface BookEntry {
  bookTitle: string;
  authorName: string;
  price: string;
  photo: File | null;
  previewUrl: string;
}

const emptyBook = (): BookEntry => ({
  bookTitle: "",
  authorName: "",
  price: "",
  photo: null,
  previewUrl: "",
});

const formatLKR = (v: string | number) => {
  const n = Number(v);
  if (!v || isNaN(n) || n <= 0) return "";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);
};

/* ── Main component ── */
export default function SellBook() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<SellMode>("individual");
  const [books, setBooks] = useState<BookEntry[]>([emptyBook()]);
  const [seriesPrice, setSeriesPrice] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Book helpers ── */
  const updateBook = <K extends keyof BookEntry>(i: number, key: K, val: BookEntry[K]) =>
    setBooks((prev) => prev.map((b, idx) => (idx === i ? { ...b, [key]: val } : b)));

  const handlePhoto = (i: number, file: File | null) => {
    if (!file) {
      updateBook(i, "photo", null);
      updateBook(i, "previewUrl", "");
      return;
    }
    updateBook(i, "photo", file);
    updateBook(i, "previewUrl", URL.createObjectURL(file));
  };

  const addBook = () => setBooks((p) => [...p, emptyBook()]);
  const removeBook = (i: number) => {
    if (books.length <= 1) return;
    setBooks((p) => p.filter((_, idx) => idx !== i));
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!address.trim()) return setSubmitError("Pickup address is required.");
    if (!contact.trim()) return setSubmitError("Contact number is required.");

    if (mode === "series") {
      const sp = Number(seriesPrice);
      if (!seriesPrice || isNaN(sp) || sp <= 0)
        return setSubmitError("Enter a valid series price.");
    }

    for (let i = 0; i < books.length; i++) {
      const b = books[i];
      if (!b.bookTitle.trim()) return setSubmitError(`Book ${i + 1}: title is required.`);
      if (!b.authorName.trim()) return setSubmitError(`Book ${i + 1}: author name is required.`);
      if (mode === "individual") {
        const p = Number(b.price);
        if (!b.price || isNaN(p) || p < 0)
          return setSubmitError(`Book ${i + 1}: enter a valid asking price.`);
      }
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("sellType", mode);
      formData.append("location", address);
      formData.append("contactNumber", contact);
      if (mode === "series") formData.append("seriesPrice", seriesPrice);

      const booksPayload = books.map((b) => ({
        bookTitle: b.bookTitle,
        authorName: b.authorName,
        price: mode === "individual" ? b.price : undefined,
      }));
      formData.append("books", JSON.stringify(booksPayload));

      books.forEach((b) => {
        if (b.photo) {
          formData.append("photos", b.photo);
        } else {
          formData.append("photos", new Blob([], { type: "image/jpeg" }), "empty.jpg");
        }
      });

      const res = await fetch(`${API}/sell-requests`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setBooks([emptyBook()]);
    setSeriesPrice("");
    setAddress("");
    setContact("");
    setSubmitError("");
    setSuccess(false);
  };

  /* ── Shared input styles ── */
  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-amber-500 dark:focus:bg-gray-800";
  const labelCls = "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-gray-400";

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] dark:bg-gray-950 overflow-x-hidden w-full max-w-full">
        <Nav />
        <main className="mx-auto max-w-lg px-4 pb-20 pt-36 text-center">
          {/* Animated success ring */}
          <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40" />
            <svg className="relative h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-stone-900 dark:text-gray-50">
            Request Submitted!
          </h1>
          <p className="mb-2 text-base text-stone-500 dark:text-gray-400">
            Your sell request is now under review.
          </p>
          <p className="mb-10 text-sm text-stone-400 dark:text-gray-500">
            We'll reach out to you at <span className="font-semibold text-stone-600 dark:text-gray-300">{contact}</span> to arrange pickup.
          </p>

          {/* Summary pill */}
          <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-gray-500">What you submitted</p>
            <div className="flex flex-wrap gap-2">
              {books.filter(b => b.bookTitle).map((b, i) => (
                <span key={i} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-700/40">
                  {b.bookTitle}
                  {mode === "individual" && b.price && <span className="ml-1 opacity-70">— {formatLKR(b.price)}</span>}
                </span>
              ))}
              {mode === "series" && seriesPrice && (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 dark:bg-gray-800 dark:text-gray-300">
                  Bundle: {formatLKR(seriesPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/my-sell-requests")}
              className="rounded-full bg-amber-700 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-amber-700/20 transition hover:bg-amber-600 hover:shadow-amber-600/30"
            >
              View My Requests
            </button>
            <button
              onClick={resetForm}
              className="rounded-full border border-stone-300 px-8 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sell More Books
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-gray-950 overflow-x-hidden w-full max-w-full">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6 lg:pt-32">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-amber-400 dark:to-amber-300 sm:text-4xl">
            Sell Your Books
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-gray-400">
            Submit one book, a series, or a mix — we'll arrange the rest.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── SELL MODE TOGGLE ── */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4 dark:border-gray-700/60">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-gray-100">Pricing Method</h2>
                <p className="text-xs text-stone-400 dark:text-gray-500">How would you like to price your books?</p>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "individual" as const, title: "Individual Prices", desc: "Each book has its own price" },
                  { value: "series" as const, title: "Series / Bundle", desc: "All books at one price" },
                ]).map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setMode(m.value);
                      setSeriesPrice("");
                      setBooks([emptyBook()]);
                    }}
                    className={`relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      mode === m.value
                        ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:border-amber-500 dark:from-amber-900/20 dark:to-orange-900/10"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {mode === m.value && (
                      <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
                    <span className={`text-sm font-semibold leading-tight ${mode === m.value ? "text-amber-800 dark:text-amber-300" : "text-stone-800 dark:text-gray-200"}`}>
                      {m.title}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-gray-400 leading-snug">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── PICKUP DETAILS ── */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4 dark:border-gray-700/60">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-gray-100">Pickup Details</h2>
                <p className="text-xs text-stone-400 dark:text-gray-500">Where and how can we reach you?</p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {/* Address */}
              <div className="sm:col-span-2">
                <label htmlFor="sell-address" className={labelCls}>
                  Pickup Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <input
                    id="sell-address"
                    type="text"
                    placeholder="e.g. 42 Galle Road, Colombo 3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputCls} pl-10`}
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="sm:col-span-2">
                <label htmlFor="sell-contact" className={labelCls}>
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <input
                    id="sell-contact"
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className={`${inputCls} pl-10`}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── SERIES PRICE ── */}
          {mode === "series" && (
            <div className="rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:border-amber-700/40 dark:from-amber-900/15 dark:to-orange-900/10 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-amber-200/60 px-6 py-4 dark:border-amber-700/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800/40">
                  <svg className="h-4 w-4 text-amber-700 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Bundle Price</h2>
                  <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Set a single price for the entire collection</p>
                </div>
              </div>
              <div className="p-5">
                <label htmlFor="series-price" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Total asking price (LKR) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    Rs.
                  </span>
                  <input
                    id="series-price"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    value={seriesPrice}
                    onChange={(e) => setSeriesPrice(e.target.value)}
                    className={`${inputCls} pl-12`}
                    required={mode === "series"}
                  />
                  {seriesPrice && !isNaN(Number(seriesPrice)) && Number(seriesPrice) > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-800/40 dark:text-amber-300">
                      {formatLKR(seriesPrice)}
                    </span>
                  )}
                </div>
                {seriesPrice && !isNaN(Number(seriesPrice)) && Number(seriesPrice) > 0 && (
                  <p className="mt-2 text-xs text-amber-700/70 dark:text-amber-400/70">
                    {formatLKR(seriesPrice)} for all {books.length} book{books.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── BOOK LIST ── */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-stone-800 dark:text-gray-100">
                    Books{" "}
                    <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      {books.length}
                    </span>
                  </h2>
                  <p className="text-xs text-stone-400 dark:text-gray-500">Add the books you'd like to sell</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addBook}
                className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 active:scale-95"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Book
              </button>
            </div>

            {/* Book rows */}
            <ul className="flex flex-col divide-y divide-stone-100 dark:divide-gray-700/60">
              {books.map((book, i) => (
                <li key={i} className="group px-5 py-5 transition-colors hover:bg-stone-50/50 dark:hover:bg-gray-800/20">
                  {/* Row header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-xs font-bold text-amber-800 ring-1 ring-amber-200 dark:from-amber-900/40 dark:to-orange-900/20 dark:text-amber-300 dark:ring-amber-700/40">
                        {i + 1}
                      </div>
                      {book.bookTitle && (
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:bg-gray-800 dark:text-gray-300 max-w-[200px] truncate">
                          {book.bookTitle}
                          {book.authorName && ` — ${book.authorName}`}
                          {mode === "individual" && book.price && ` · ${formatLKR(book.price)}`}
                        </span>
                      )}
                    </div>
                    {books.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBook(i)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {/* Photo upload */}
                    <div
                      className="relative shrink-0 cursor-pointer"
                      onClick={() => document.getElementById(`photo-${i}`)?.click()}
                    >
                      {book.previewUrl ? (
                        <div className="group/img relative h-24 w-16 overflow-hidden rounded-xl border border-stone-200 shadow-sm dark:border-gray-700">
                          <img src={book.previewUrl} alt="book" className="h-full w-full object-cover transition group-hover/img:scale-105" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover/img:opacity-100 rounded-xl">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-24 w-16 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 transition hover:border-amber-400 hover:bg-amber-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500 dark:hover:bg-amber-900/10">
                          <svg className="h-5 w-5 text-stone-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                          </svg>
                          <span className="text-[9px] font-medium text-stone-300 dark:text-gray-600">Photo</span>
                        </div>
                      )}
                      <input
                        id={`photo-${i}`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        ref={(el) => { fileRefs.current[i] = el; }}
                        onChange={(e) => handlePhoto(i, e.target.files?.[0] ?? null)}
                      />
                      {book.previewUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePhoto(i, null);
                            if (fileRefs.current[i]) fileRefs.current[i]!.value = "";
                          }}
                          className="mt-1.5 block w-full text-center text-[10px] font-medium text-red-400 transition hover:text-red-600 hover:underline"
                        >
                          remove
                        </button>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="flex flex-1 flex-col gap-2.5 min-w-0">
                      <input
                        id={`title-${i}`}
                        type="text"
                        required
                        placeholder="Book title *"
                        value={book.bookTitle}
                        onChange={(e) => updateBook(i, "bookTitle", e.target.value)}
                        className={inputCls}
                      />
                      <input
                        id={`author-${i}`}
                        type="text"
                        required
                        placeholder="Author name *"
                        value={book.authorName}
                        onChange={(e) => updateBook(i, "authorName", e.target.value)}
                        className={inputCls}
                      />
                      {mode === "individual" && (
                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400 dark:text-gray-500">
                            Rs.
                          </span>
                          <input
                            id={`price-${i}`}
                            type="number"
                            min="0"
                            step="1"
                            required
                            placeholder="Asking price *"
                            value={book.price}
                            onChange={(e) => updateBook(i, "price", e.target.value)}
                            className={`${inputCls} pl-12`}
                          />
                          {book.price && !isNaN(Number(book.price)) && Number(book.price) > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-800/30 dark:text-amber-300">
                              {formatLKR(book.price)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add another book */}
            <button
              type="button"
              onClick={addBook}
              className="flex w-full items-center justify-center gap-2 border-t border-dashed border-stone-200 py-4 text-sm font-medium text-stone-400 transition hover:bg-amber-50 hover:text-amber-700 dark:border-gray-700/60 dark:text-gray-500 dark:hover:bg-amber-900/10 dark:hover:text-amber-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add another book
            </button>
          </div>

          {/* ── Summary ── */}
          {books.some((b) => b.bookTitle) && (
            <div className="rounded-2xl border border-stone-100 bg-gradient-to-br from-stone-50 to-amber-50/30 px-5 py-4 dark:border-gray-700/60 dark:from-gray-800/50 dark:to-amber-900/5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-gray-500">
                Summary
              </p>
              <div className="flex flex-wrap gap-2">
                {books.filter((b) => b.bookTitle).map((b, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
                  >
                    {b.bookTitle}
                    {b.authorName && <span className="text-stone-400 dark:text-gray-500"> — {b.authorName}</span>}
                    {mode === "individual" && b.price && (
                      <span className="ml-1.5 font-bold text-amber-700 dark:text-amber-400">{formatLKR(b.price)}</span>
                    )}
                  </span>
                ))}
                {mode === "series" && seriesPrice && Number(seriesPrice) > 0 && (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/40">
                    Bundle: {formatLKR(seriesPrice)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-700/40 dark:bg-red-900/20">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{submitError}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="relative inline-flex items-center gap-2 rounded-full bg-amber-700 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-700/25 transition hover:bg-amber-600 hover:shadow-amber-600/30 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Submit Sell Request
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-xs text-stone-400 dark:text-gray-500">
              {books.length} book{books.length > 1 ? "s" : ""} · {mode === "series" ? "Bundle pricing" : "Individual pricing"}
            </p>
          </div>

        </form>
      </main>
    </div>
  );
}
