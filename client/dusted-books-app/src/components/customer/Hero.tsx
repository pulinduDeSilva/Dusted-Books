import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import HeroImgSpines from "../../assets/hero-imgs/hero-img2.jpg";
import HeroImgShelves from "../../assets/hero-imgs/hero-shelves.jpg";
import HeroImgStack from "../../assets/hero-imgs/hero-stack.jpg";
import HeroImgOpen from "../../assets/hero-imgs/hero-open.jpg";
import HeroImgBrowse from "../../assets/hero-imgs/hero-browse.jpg";
import HeroImgReading from "../../assets/hero-imgs/hero-reading.jpg";
import gsap from "gsap";

/**
 * Hero story (second-hand book journey):
 * 1. Discover shelves → 2. Browse collection → 3. Choose a stack
 * → 4. Feel the worn spines → 5. Open the pages → 6. Read & enjoy
 */
const HERO_SLIDES = [
  {
    src: HeroImgShelves,
    alt: "Discover — shelves full of pre-loved books waiting to be found",
    label: "Discover",
    kenBurns: "scale(1.15) translate(2%, -1%)",
  },
  {
    src: HeroImgBrowse,
    alt: "Browse — colorful used bookstore collection to explore",
    label: "Browse",
    kenBurns: "scale(1.12) translate(-2%, -1%)",
  },
  {
    src: HeroImgStack,
    alt: "Choose — stack of second-hand paperbacks ready for a new home",
    label: "Choose",
    kenBurns: "scale(1.1) translate(-1%, -2%)",
  },
  {
    src: HeroImgSpines,
    alt: "Preloved — worn spines that show every book has a past",
    label: "Preloved",
    kenBurns: "scale(1.12) translate(-2%, 1%)",
  },
  {
    src: HeroImgOpen,
    alt: "Open — yellowed pages of a book starting its second life",
    label: "Open",
    kenBurns: "scale(1.14) translate(1%, 2%)",
  },
  {
    src: HeroImgReading,
    alt: "Enjoy — someone reading a pre-loved book in a quiet moment",
    label: "Enjoy",
    kenBurns: "scale(1.12) translate(1%, -1%)",
  },
] as const;

const HERO_SLIDE_MS = 6500;
const HERO_FADE_MS = 1200;
const SLIDE_COUNT = HERO_SLIDES.length;

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function Hero() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  /** Once a slide is requested, keep its layer mounted for smooth revisits. */
  const [mountedSlides, setMountedSlides] = useState(() => new Set([0, 1]));
  /** Flip after paint so transform transitions from scale(1) → kenBurns (incl. first slide). */
  const [kenBurnsOn, setKenBurnsOn] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const timerEpochRef = useRef(0);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const autoplay = !prefersReducedMotion && !paused && !tabHidden;

  const goToSlide = useCallback((index: number) => {
    setKenBurnsOn(false);
    setHeroSlide(index);
    timerEpochRef.current += 1;
    setTimerEpoch(timerEpochRef.current);
  }, []);

  // Progressive mount: active + next only (keeps already-seen slides warm)
  useEffect(() => {
    const next = (heroSlide + 1) % SLIDE_COUNT;
    setMountedSlides((prev) => {
      if (prev.has(heroSlide) && prev.has(next)) return prev;
      const updated = new Set(prev);
      updated.add(heroSlide);
      updated.add(next);
      return updated;
    });
  }, [heroSlide]);

  // After each slide is at scale(1), enable Ken Burns so the CSS transition runs
  useEffect(() => {
    if (prefersReducedMotion) {
      setKenBurnsOn(false);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setKenBurnsOn(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [heroSlide, prefersReducedMotion]);

  // Pause autoplay when the tab is in the background
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Slideshow rotation — restarts cleanly after manual selection
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setKenBurnsOn(false);
      setHeroSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, HERO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, [autoplay, timerEpoch]);

  // Entrance animation (skipped when user prefers reduced motion)
  useEffect(() => {
    if (prefersReducedMotion || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current!.children, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
      });
    }, textRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const activeSlide = HERO_SLIDES[heroSlide];
  const progressStyle = {
    ["--hero-slide-ms" as string]: `${HERO_SLIDE_MS}ms`,
  } as CSSProperties;

  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured book scenes"
    >
      {/* Slideshow + Ken Burns — same transform transition as Landing */}
      <div className="absolute inset-0" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => {
          if (!mountedSlides.has(index)) return null;

          const isActive = index === heroSlide;
          const isFirst = index === 0;
          // Same pattern as Landing: scale(1) → kenBurns over the slide duration
          const motionOn = isActive && kenBurnsOn && !prefersReducedMotion;

          return (
            <div
              key={slide.src}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
                transitionDuration: prefersReducedMotion ? "0ms" : `${HERO_FADE_MS}ms`,
                pointerEvents: "none",
              }}
            >
              {/* Prefetch via hidden img so progressive loads still hit the cache */}
              <img
                src={slide.src}
                alt=""
                className="sr-only"
                loading={isFirst ? "eager" : "lazy"}
                decoding={isFirst ? "sync" : "async"}
                fetchPriority={isFirst ? "high" : "low"}
                draggable={false}
              />
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
                style={{
                  backgroundImage: `url(${slide.src})`,
                  transform: motionOn ? slide.kenBurns : "scale(1)",
                  transition: motionOn
                    ? `transform ${HERO_SLIDE_MS + 400}ms ease-out`
                    : "transform 0ms",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Warm paper / amber overlays for text contrast */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#2a1c10]/80 via-[#3a2818]/50 to-[#1a120c]/85" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-amber-950/30 via-transparent to-orange-950/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-[#1a120c]/80 to-transparent" />

      {/* Soft dust motes — disabled under reduced motion */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden motion-reduce:hidden"
          aria-hidden="true"
        >
          <span className="hero-dust absolute left-[12%] top-[28%] h-1 w-1 rounded-full bg-amber-200/40" />
          <span className="hero-dust absolute left-[78%] top-[22%] h-1.5 w-1.5 rounded-full bg-amber-100/30 [animation-delay:700ms]" />
          <span className="hero-dust absolute left-[55%] top-[65%] h-1 w-1 rounded-full bg-orange-200/35 [animation-delay:1.2s]" />
          <span className="hero-dust absolute left-[30%] top-[72%] h-0.5 w-0.5 rounded-full bg-amber-50/40 [animation-delay:400ms]" />
          <span className="hero-dust absolute left-[88%] top-[48%] h-1 w-1 rounded-full bg-amber-200/25 [animation-delay:900ms]" />
        </div>
      )}

      {/* ── Hero copy ── */}
      <div
        ref={textRef}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-28 text-center sm:px-6 sm:pb-24 sm:pt-32"
      >
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-lg shadow-black/20 backdrop-blur-md sm:mb-5 sm:px-5 sm:py-2 sm:text-sm">
          <SparklesIcon className="h-4 w-4 shrink-0 text-amber-300" />
          Welcome back to DustedBooks
        </p>

        {/* Story chapter that tracks the slideshow */}
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300/90 sm:text-xs"
          aria-live="polite"
        >
          <span className="text-amber-200/50">
            {String(heroSlide + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 text-amber-200/30">·</span>
          {activeSlide.label}
        </p>

        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Your next story is{" "}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            waiting
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg md:text-xl">
          Discover pre-loved books at great prices, sell the ones gathering dust,
          or request titles we don&apos;t yet stock.
        </p>

        <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3.5">
          <Link
            to="/sell-book"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-bold text-gray-900 shadow-xl shadow-amber-600/30 transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-amber-400 hover:shadow-amber-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 active:scale-[0.98]"
          >
            Sell a Book
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/my-requests"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/12 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-black/15 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:scale-[1.02] hover:border-white/70 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
          >
            Request a Book
          </Link>
          <Link
            to="/my-sell-requests"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-8 py-3.5 text-base font-semibold text-white/90 transition-[transform,background-color,border-color,color] duration-200 hover:scale-[1.02] hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
          >
            My Sell Requests
          </Link>
        </div>

        {/* Progress indicators — hover/focus pauses autoplay so users can choose */}
        <div
          className="mt-10 flex items-center gap-2"
          role="tablist"
          aria-label="Hero background scenes"
          style={progressStyle}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === heroSlide;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={slide.alt}
                onClick={() => goToSlide(index)}
                className={`relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                  isActive
                    ? "w-9 bg-white/25"
                    : "w-1.5 bg-white/35 hover:bg-white/65"
                }`}
              >
                {isActive && autoplay && (
                  <span
                    key={`${index}-${timerEpoch}`}
                    className="hero-progress-fill absolute inset-y-0 left-0 w-full rounded-full bg-amber-400 shadow-sm shadow-amber-500/40"
                  />
                )}
                {isActive && !autoplay && (
                  <span className="absolute inset-y-0 left-0 w-full rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#books"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/55 transition-colors hover:text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Scroll to books"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
          Explore
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 ${prefersReducedMotion ? "" : "hero-scroll-cue"}`}
        />
      </a>
    </section>
  );
}

export default Hero;
