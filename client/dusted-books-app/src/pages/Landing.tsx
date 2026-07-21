import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { apiFetch } from "../service/apiClient";
import Footer from "../components/Footer";
import logoImage from "../assets/db logo.png";
import HeroImgSpines from "../assets/hero-imgs/hero-img2.jpg";
import HeroImgShelves from "../assets/hero-imgs/hero-shelves.jpg";
import HeroImgStack from "../assets/hero-imgs/hero-stack.jpg";
import HeroImgOpen from "../assets/hero-imgs/hero-open.jpg";
import HeroImgBrowse from "../assets/hero-imgs/hero-browse.jpg";
import HeroImgReading from "../assets/hero-imgs/hero-reading.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero story (second-hand book journey):
 * 1. Discover shelves → 2. Browse collection → 3. Choose a stack
 * → 4. Feel the worn spines → 5. Open the pages → 6. Read & enjoy
 */
const HERO_SLIDES = [
  {
    src: HeroImgShelves,
    alt: "Discover — shelves full of pre-loved books waiting to be found",
    kenBurns: "scale(1.15) translate(2%, -1%)",
  },
  {
    src: HeroImgBrowse,
    alt: "Browse — colorful used bookstore collection to explore",
    kenBurns: "scale(1.12) translate(-2%, -1%)",
  },
  {
    src: HeroImgStack,
    alt: "Choose — stack of second-hand paperbacks ready for a new home",
    kenBurns: "scale(1.1) translate(-1%, -2%)",
  },
  {
    src: HeroImgSpines,
    alt: "Preloved — worn spines that show every book has a past",
    kenBurns: "scale(1.12) translate(-2%, 1%)",
  },
  {
    src: HeroImgOpen,
    alt: "Open — yellowed pages of a book starting its second life",
    kenBurns: "scale(1.14) translate(1%, 2%)",
  },
  {
    src: HeroImgReading,
    alt: "Enjoy — someone reading a pre-loved book in a quiet moment",
    kenBurns: "scale(1.12) translate(1%, -1%)",
  },
] as const;

const HERO_SLIDE_MS = 6500;

type BookItem = {
  _id: string;
  title: string;
  author: string;
  price: number;
  imgUrl?: string;
  category?: string[];
};

// ── Icons ──
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.97 0-9-4.03-9-9 0-4.632 3.5-8.443 8-8.941V3c5.523 0 10 4.477 10 10h-.059C20.443 17.5 16.632 21 12 21Zm0 0c0-4.97 4.03-9 9-9" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function NonFictionIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
  );
}

function MysteryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function SelfHelpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  );
}

function RomanceIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function ScienceIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function BiographyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

const steps = [
  {
    icon: BookOpenIcon,
    title: "Browse & Discover",
    desc: "Explore hundreds of pre-loved books across Fiction, Non-Fiction, Science, History, and more.",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-900/20",
  },
  {
    icon: ShoppingBagIcon,
    title: "Buy or Request",
    desc: "Found what you love? Add to cart. Can't find it? Submit a book request and we'll source it.",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
  },
  {
    icon: SparklesIcon,
    title: "Sell Your Books",
    desc: "Have books gathering dust? List them for sale—individually or as a bundle—and earn from your shelf.",
    color: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-900/20",
  },
];

const browseCategories = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Self Help",
  "Romance",
  "Science",
  "History",
  "Biography",
  "Kids",
] as const;

const perks = [
  {
    icon: ShieldCheckIcon,
    title: "Condition Checked",
    desc: "Every book is inspected and honestly graded before it reaches the shelf, so you know exactly what you're getting.",
  },
  {
    icon: TagIcon,
    title: "Fair Prices",
    desc: "Pre-loved means a fraction of retail. Build your library without emptying your wallet.",
  },
  {
    icon: LeafIcon,
    title: "Read Sustainably",
    desc: "Every second-hand book you buy keeps paper out of landfills and gives a good story another reader.",
  },
  {
    icon: TruckIcon,
    title: "Easy Pickup",
    desc: "Selling? Tell us where your books are and we'll arrange collection — no packing, no postage.",
  },
];

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const booksRef = useRef<HTMLDivElement>(null);
  const perksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<BookItem[] | { books?: BookItem[] }>("/books");
        const list = Array.isArray(data) ? data : Array.isArray(data?.books) ? data.books : [];
        if (cancelled) return;
        setTotalBooks(list.length);
        setBooks(list.slice(0, 6));
      } catch {
        if (!cancelled) setBooks([]);
      } finally {
        if (!cancelled) setBooksLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotate second-hand book hero backgrounds
  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Hero entrance — run once; do not re-run when books load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".landing-hero-text > *", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, []);

  // Scroll motion only (no opacity) so content never gets stuck invisible.
  // Previous gsap.from({ opacity: 0 }) + ScrollTrigger hid category chips
  // and book cards when triggers did not fire (e.g. after books re-render).
  useEffect(() => {
    // Wait until books fetch settles so the featured grid exists in the DOM
    if (booksLoading) return;

    const ctx = gsap.context(() => {
      const reveals: Array<[HTMLDivElement | null, string, number]> = [
        [stepsRef.current, ".step-card", 24],
        [categoriesRef.current, ".category-chip", 12],
        [booksRef.current, ".book-card", 20],
        [perksRef.current, ".perk-card", 20],
      ];

      reveals.forEach(([container, selector, distance]) => {
        if (!container) return;
        const items = container.querySelectorAll(selector);
        if (!items.length) return;

        // Ensure visible before animating (guards against leftover inline styles)
        gsap.set(items, { clearProps: "opacity,visibility,transform" });

        gsap.from(items, {
          y: distance,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: {
            trigger: container,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, [books, booksLoading]);

  const stats = [
    {
      value: totalBooks > 0 ? `${totalBooks}+` : "100s",
      label: "Books in stock",
      hint: "Ready to browse",
      icon: BookOpenIcon,
    },
    {
      value: String(browseCategories.length),
      label: "Categories",
      hint: "Genres covered",
      icon: TagIcon,
    },
    {
      value: "100%",
      label: "Condition checked",
      hint: "Honest grading",
      icon: ShieldCheckIcon,
    },
    {
      value: "Free",
      label: "Join & sell",
      hint: "No signup fees",
      icon: SparklesIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-gray-950 text-amber-950 dark:text-amber-100 font-sans selection:bg-amber-900 selection:text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-amber-900/10 dark:border-gray-700/50 shadow-md py-2.5"
            : "bg-gradient-to-b from-black/50 to-transparent py-4"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-wider transition-transform hover:scale-[1.02] active:scale-95 sm:text-2xl"
          >
            <img
              src={logoImage}
              alt="DustedBooks logo"
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            />
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r ${
                scrolled
                  ? "from-amber-900 to-amber-700 dark:from-amber-400 dark:to-amber-300"
                  : "from-white to-amber-100"
              }`}
            >
              DustedBooks
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                scrolled
                  ? "text-amber-950/70 dark:text-amber-200/70 hover:bg-amber-900/10 dark:hover:bg-white/10"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link
              to="/signup"
              className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 sm:inline-flex ${
                scrolled
                  ? "border border-amber-800/20 bg-white text-amber-900 hover:bg-amber-50 dark:border-amber-300/20 dark:bg-gray-800 dark:text-amber-100 dark:hover:bg-gray-700"
                  : "border border-white/40 bg-white text-amber-950 shadow-lg shadow-black/15 hover:bg-amber-50"
              }`}
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-700/25 transition-all hover:scale-[1.02] hover:bg-amber-500 active:scale-95 sm:px-5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 sm:pt-24"
      >
        {/* Dynamic second-hand book slideshow + Ken Burns zoom */}
        <div className="absolute inset-0" aria-hidden="true">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === heroSlide;
            return (
              <div
                key={slide.src}
                className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 1 : 0,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
                  style={{
                    backgroundImage: `url(${slide.src})`,
                    transform: isActive ? slide.kenBurns : "scale(1)",
                    transition: isActive
                      ? `transform ${HERO_SLIDE_MS + 400}ms ease-out`
                      : "transform 0ms",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Warm paper / amber overlays for second-hand book mood */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#2a1c10]/75 via-[#3a2818]/55 to-[#1a120c]/80" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-tr from-amber-900/25 via-transparent to-orange-900/15" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#1a120c]/70 to-transparent" />

        {/* Soft floating dust motes */}
        <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden="true">
          <span className="absolute left-[12%] top-[28%] h-1 w-1 animate-pulse rounded-full bg-amber-200/40" />
          <span className="absolute left-[78%] top-[22%] h-1.5 w-1.5 animate-pulse rounded-full bg-amber-100/30 [animation-delay:700ms]" />
          <span className="absolute left-[55%] top-[65%] h-1 w-1 animate-pulse rounded-full bg-orange-200/35 [animation-delay:1200ms]" />
          <span className="absolute left-[30%] top-[72%] h-0.5 w-0.5 animate-pulse rounded-full bg-amber-50/40 [animation-delay:400ms]" />
          <span className="absolute left-[88%] top-[48%] h-1 w-1 animate-pulse rounded-full bg-amber-200/25 [animation-delay:900ms]" />
        </div>

        <div className="landing-hero-text relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-black/35 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-100 backdrop-blur-md sm:mb-6 sm:text-sm">
            <SparklesIcon className="h-4 w-4 shrink-0 text-amber-300" />
            Sri Lanka&apos;s Preloved Book Marketplace
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Give Books a{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Second Life
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
            Discover pre-loved books at great prices, sell the ones gathering dust on your shelf, or request titles we don&apos;t yet stock.
          </p>

          <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/browse"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-base font-bold text-gray-900 shadow-xl shadow-amber-600/35 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-95"
            >
              Browse Collection
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-7 py-3.5 text-base font-bold text-amber-950 shadow-xl shadow-black/20 transition-all hover:scale-[1.02] hover:bg-amber-50 active:scale-95"
            >
              Create Account
            </Link>
          </div>

          {/* Slide indicators — second-hand book scenes */}
          <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Hero background scenes">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={index === heroSlide}
                aria-label={slide.alt}
                onClick={() => setHeroSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === heroSlide
                    ? "w-8 bg-amber-400 shadow-sm shadow-amber-500/40"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative z-10 -mt-8 px-4 sm:-mt-10 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-xl shadow-amber-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isLastColMobile = index % 2 === 1;
              const isLastRowMobile = index >= 2;
              const isLastDesktop = index === stats.length - 1;
              return (
                <li
                  key={stat.label}
                  className={[
                    "flex items-center gap-3 px-4 py-4 sm:gap-3.5 sm:px-5 sm:py-5",
                    !isLastColMobile ? "border-r border-amber-900/8 dark:border-gray-700/80" : "",
                    !isLastRowMobile ? "border-b border-amber-900/8 dark:border-gray-700/80" : "",
                    "md:border-b-0",
                    !isLastDesktop ? "md:border-r md:border-amber-900/8 dark:md:border-gray-700/80" : "md:border-r-0",
                  ].join(" ")}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-700 ring-1 ring-amber-900/5 dark:from-amber-900/40 dark:to-amber-950/40 dark:text-amber-300 dark:ring-white/5 sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-xl font-extrabold leading-none tracking-tight text-amber-800 dark:text-amber-300 sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold leading-snug text-amber-950/80 dark:text-amber-100/85 sm:text-sm">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 hidden truncate text-[11px] leading-snug text-amber-900/45 dark:text-amber-200/40 sm:block">
                      {stat.hint}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
              How It Works
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Three simple steps to start
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-amber-800/65 dark:text-amber-200/50 sm:text-base">
              Whether you&apos;re buying, selling, or hunting for a specific title — we&apos;ve got you covered.
            </p>
          </div>

          <div ref={stepsRef} className="grid gap-4 md:grid-cols-3 md:gap-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`step-card group relative rounded-2xl border border-amber-900/8 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/5 dark:border-gray-700 dark:hover:shadow-black/20 sm:p-7 ${step.bgLight} ${step.bgDark}`}
                >
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${step.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="absolute right-5 top-5 select-none text-5xl font-black text-amber-900/5 dark:text-white/5">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-amber-800/70 dark:text-amber-200/60">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="bg-white px-5 py-14 dark:bg-gray-900/50 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
              Find Your Genre
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Browse by category
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-amber-800/65 dark:text-amber-200/50 sm:text-base">
              Pick a shelf and start exploring — every title is pre-loved and ready for its next reader.
            </p>
          </div>

          <div
            ref={categoriesRef}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          >
            {browseCategories.map((cat) => (
              <Link
                key={cat}
                to={`/browse?category=${encodeURIComponent(cat)}`}
                className="category-chip rounded-full border border-amber-900/10 bg-[#fcfaf8] px-5 py-2.5 text-sm font-semibold text-amber-950 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-600/40 hover:bg-amber-50 hover:text-amber-800 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-amber-100 dark:hover:border-amber-500/40 dark:hover:bg-gray-750 dark:hover:text-amber-300"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Books (always rendered so the section never disappears) ── */}
      <section className="px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
                Featured Collection
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                Fresh from the shelf
              </h2>
            </div>
            <Link
              to="/browse"
              className="group hidden items-center gap-2 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-600 dark:text-amber-400 sm:inline-flex"
            >
              View all
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {booksLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-amber-900/8 bg-amber-100/40 dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : books.length > 0 ? (
            <>
              <div ref={booksRef} className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {books.map((book) => (
                  <Link
                    key={book._id}
                    to={`/books/${book._id}`}
                    className="book-card group overflow-hidden rounded-2xl border border-amber-900/8 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-black/30"
                  >
                    <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white p-4 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 sm:h-52">
                      {book.imgUrl ? (
                        <img
                          src={book.imgUrl}
                          alt={book.title}
                          className="max-h-full max-w-[140px] object-contain transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <BookOpenIcon className="h-14 w-14 text-amber-900/20 dark:text-amber-200/20" />
                      )}
                      {book.category?.[0] && (
                        <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          {book.category[0]}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="truncate text-base font-bold text-amber-950 dark:text-amber-100">
                        {book.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-amber-800/60 dark:text-amber-200/50">
                        by {book.author}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                          Rs. {book.price.toLocaleString("en-IN")}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-amber-400">
                          View Details
                          <ArrowRightIcon className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-7 text-center sm:hidden">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-700/20 transition-all hover:scale-[1.02] hover:bg-amber-600"
                >
                  Browse All Books
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-amber-900/15 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
              <BookOpenIcon className="mx-auto mb-3 h-10 w-10 text-amber-700/40 dark:text-amber-300/40" />
              <p className="text-base font-semibold text-amber-950 dark:text-amber-100">
                No books listed yet
              </p>
              <p className="mt-1 text-sm text-amber-800/60 dark:text-amber-200/50">
                Check back soon, or browse the full collection.
              </p>
              <Link
                to="/browse"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500"
              >
                Go to Browse
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why DustedBooks ── */}
      <section className="bg-white px-5 py-14 dark:bg-gray-900/50 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-10">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
                Why DustedBooks
              </p>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Books deserve more than one reader
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-800/65 dark:text-amber-200/50 sm:text-base">
                We built DustedBooks so great stories keep circulating instead of collecting dust. Buy with confidence, sell without hassle, and read for less.
              </p>
              <Link
                to="/signup"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-700/20 transition-all hover:scale-[1.02] hover:bg-amber-500"
              >
                Join the community
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div ref={perksRef} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="perk-card rounded-2xl border border-amber-900/8 bg-[#fcfaf8] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-900/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-black/20"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 text-base font-bold">{perk.title}</h3>
                    <p className="text-sm leading-relaxed text-amber-800/60 dark:text-amber-200/50">
                      {perk.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a3625] via-[#3a2818] to-[#2a1c10] p-8 text-center shadow-2xl shadow-amber-900/20 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 dark:shadow-black/40 sm:rounded-3xl sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl mix-blend-screen" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-600/10 blur-3xl mix-blend-screen" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center rounded-full border border-amber-300/25 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-200 backdrop-blur-md">
              Join thousands of readers
            </p>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              Ready to dust off your bookshelf?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-amber-200/75 sm:text-base">
              Create a free account to start buying, selling, and requesting books today.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-base font-bold text-gray-900 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-95"
              >
                Get Started Free
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/20 active:scale-95"
              >
                Browse First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
