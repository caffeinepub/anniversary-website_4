import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CoupleInfo, TimelineMilestone } from "./backend.d";
import {
  useCoupleInfo,
  useLoveLetter,
  useReasonsList,
  useTimelineMilestones,
} from "./hooks/useQueries";

// ─── Utility: parse anniversary date ─────────────────────────────────────────
function parseAnniversaryDate(dateStr: string): Date {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date("2020-03-04") : parsed;
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────
interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(anniversaryDate: string): TimeElapsed {
  const [elapsed, setElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculate() {
      const start = parseAnniversaryDate(anniversaryDate);
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setElapsed({ years, months, days, hours, minutes, seconds });
    }

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [anniversaryDate]);

  return elapsed;
}

// ─── IntersectionObserver Hook ────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Floating Hearts ──────────────────────────────────────────────────────────
// Three tiers: tiny gold, medium rose, large slow anchor
const HEARTS = [
  // Tiny gold flecks — fast, sparse
  {
    id: 0,
    left: "8%",
    size: 9,
    duration: 9,
    delay: 0,
    opacity: 0.28,
    sway: 3.5,
    color: "oklch(0.82 0.095 75)",
  },
  {
    id: 1,
    left: "22%",
    size: 10,
    duration: 11,
    delay: 2.5,
    opacity: 0.22,
    sway: 4,
    color: "oklch(0.82 0.095 75)",
  },
  {
    id: 2,
    left: "55%",
    size: 8,
    duration: 8,
    delay: 5,
    opacity: 0.25,
    sway: 3,
    color: "oklch(0.82 0.095 75)",
  },
  {
    id: 3,
    left: "78%",
    size: 11,
    duration: 10,
    delay: 1,
    opacity: 0.2,
    sway: 4.5,
    color: "oklch(0.82 0.095 75)",
  },
  {
    id: 4,
    left: "91%",
    size: 9,
    duration: 12,
    delay: 7,
    opacity: 0.22,
    sway: 3,
    color: "oklch(0.82 0.095 75)",
  },
  // Medium rose petals — mid-speed
  {
    id: 5,
    left: "15%",
    size: 16,
    duration: 13,
    delay: 0.5,
    opacity: 0.18,
    sway: 5,
    color: "oklch(0.72 0.12 15)",
  },
  {
    id: 6,
    left: "36%",
    size: 14,
    duration: 15,
    delay: 3.5,
    opacity: 0.16,
    sway: 4,
    color: "oklch(0.72 0.12 15)",
  },
  {
    id: 7,
    left: "63%",
    size: 17,
    duration: 12,
    delay: 6,
    opacity: 0.2,
    sway: 5.5,
    color: "oklch(0.72 0.12 15)",
  },
  {
    id: 8,
    left: "84%",
    size: 15,
    duration: 14,
    delay: 1.8,
    opacity: 0.15,
    sway: 4,
    color: "oklch(0.72 0.12 15)",
  },
  // Large anchor hearts — slow drift, very faint
  {
    id: 9,
    left: "28%",
    size: 28,
    duration: 18,
    delay: 2,
    opacity: 0.07,
    sway: 7,
    color: "oklch(0.88 0.07 15)",
  },
  {
    id: 10,
    left: "50%",
    size: 32,
    duration: 22,
    delay: 8,
    opacity: 0.06,
    sway: 8,
    color: "oklch(0.82 0.095 75)",
  },
  {
    id: 11,
    left: "72%",
    size: 24,
    duration: 19,
    delay: 4,
    opacity: 0.08,
    sway: 6.5,
    color: "oklch(0.88 0.07 15)",
  },
];

function FloatingHearts() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {HEARTS.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            color: h.color,
            animationDuration: `${h.duration}s, ${h.sway}s`,
            animationDelay: `${h.delay}s, ${h.delay * 0.4}s`,
            opacity: h.opacity,
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer({ anniversaryDate }: { anniversaryDate: string }) {
  const elapsed = useCountdown(anniversaryDate);

  const units: { label: string; value: number }[] = [
    { label: "Years", value: elapsed.years },
    { label: "Months", value: elapsed.months },
    { label: "Days", value: elapsed.days },
    { label: "Hours", value: elapsed.hours },
    { label: "Minutes", value: elapsed.minutes },
    { label: "Seconds", value: elapsed.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div className="countdown-cell flex flex-col items-center w-[62px] sm:w-[72px] py-3 px-2">
            <span
              className="countdown-number font-display text-3xl sm:text-4xl font-bold text-primary tabular-nums leading-none"
              aria-label={`${value} ${label}`}
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-body">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="countdown-sep text-primary/30 font-display text-xl self-start pt-3"
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} aria-hidden="true" />;
}

function HeroSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto"
      data-ocid="hero.loading_state"
    >
      <SkeletonBlock className="h-14 w-3/4 rounded-lg" />
      <SkeletonBlock className="h-5 w-1/2 rounded" />
      <SkeletonBlock className="h-4 w-2/3 rounded" />
      <div className="flex gap-6 mt-4">
        {["yr", "mo", "da", "hr", "min", "sec"].map((unit) => (
          <SkeletonBlock key={unit} className="h-12 w-14 rounded" />
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ coupleInfo }: { coupleInfo: CoupleInfo }) {
  const ref = useFadeIn();

  return (
    <section
      data-ocid="hero.section"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 hero-bg overflow-hidden"
    >
      <FloatingHearts />

      {/* Radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.28 0.07 15 / 0.25) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className="fade-in-section relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Names */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-none">
            {coupleInfo.partner1Name}
          </h1>
          <Heart
            className="text-accent animate-heart-beat flex-shrink-0"
            size={40}
            fill="currentColor"
            aria-hidden="true"
          />
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-none">
            {coupleInfo.partner2Name}
          </h1>
        </div>

        {/* Anniversary date */}
        <p className="font-display text-xl sm:text-2xl text-primary font-medium tracking-wider mb-4">
          {coupleInfo.anniversaryDate}
        </p>

        {/* Tagline */}
        <p className="font-body text-lg sm:text-xl text-muted-foreground italic mb-12 leading-relaxed max-w-xl mx-auto">
          "{coupleInfo.tagline}"
        </p>

        {/* Ornament divider */}
        <div className="ornament-divider mb-8 max-w-xs mx-auto">
          <span className="text-primary text-sm font-display">♥</span>
        </div>

        {/* Countdown label */}
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 font-body">
          Together for
        </p>

        {/* Live countdown */}
        <CountdownTimer anniversaryDate={coupleInfo.anniversaryDate} />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest font-body">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
}

// ─── Love Letter Section ──────────────────────────────────────────────────────
function LoveLetterSection({ letter }: { letter: string }) {
  const ref = useFadeIn();

  return (
    <section
      data-ocid="love_letter.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.18 0.045 320 / 0.3) 0%, transparent 70%)",
      }}
    >
      <div ref={ref} className="fade-in-section max-w-2xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70 mb-4 font-body">
            Written from the heart
          </p>
          <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
            A Love Letter
          </h2>
        </div>

        {/* Letter card */}
        <article className="paper-card rounded-2xl p-8 sm:p-12 relative">
          {/* Decorative corner flourish */}
          <div
            className="absolute top-4 left-4 text-primary opacity-20 font-display text-5xl leading-none select-none"
            aria-hidden="true"
          >
            "
          </div>
          <div
            className="absolute bottom-4 right-5 text-primary opacity-20 font-display text-5xl leading-none select-none rotate-180"
            aria-hidden="true"
          >
            "
          </div>

          <p className="font-body text-lg sm:text-xl text-foreground leading-relaxed whitespace-pre-line italic">
            {letter}
          </p>
        </article>
      </div>
    </section>
  );
}

// ─── Timeline Section ─────────────────────────────────────────────────────────
function TimelineSection({ milestones }: { milestones: TimelineMilestone[] }) {
  const headingRef = useFadeIn();

  return (
    <section data-ocid="timeline.section" className="relative py-24 px-6">
      {/* Heading */}
      <div ref={headingRef} className="fade-in-section text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70 mb-4 font-body">
          The chapters of us
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          Our Story
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-primary/60 text-xs">✦</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto relative">
        {/* Center line */}
        <div
          className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-12">
          {milestones.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineItem
                key={`${milestone.date}-${index}`}
                milestone={milestone}
                index={index}
                isLeft={isLeft}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  milestone,
  index,
  isLeft,
}: {
  milestone: TimelineMilestone;
  index: number;
  isLeft: boolean;
}) {
  const ref = useFadeIn();

  return (
    <div
      ref={ref}
      data-ocid={`timeline.item.${index + 1}`}
      className="fade-in-section relative flex flex-col md:flex-row items-start md:items-center gap-6"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Left side content */}
      <div
        className={`flex-1 ${isLeft ? "md:text-right md:pr-10" : "md:order-3 md:text-left md:pl-10"}`}
      >
        {isLeft && <TimelineCard milestone={milestone} />}
      </div>

      {/* Center dot */}
      <div className="relative flex items-center justify-center md:order-2 flex-shrink-0">
        <div
          className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-gold-glow z-10"
          aria-hidden="true"
        />
      </div>

      {/* Right side content */}
      <div
        className={`flex-1 ${isLeft ? "md:order-3 md:pl-10" : "md:pr-10 md:text-right"}`}
      >
        {!isLeft && <TimelineCard milestone={milestone} />}
        {/* Mobile: always show */}
        {isLeft && (
          <div className="md:hidden">
            <TimelineCard milestone={milestone} />
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ milestone }: { milestone: TimelineMilestone }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-luxury group hover:border-primary/40 transition-colors duration-300">
      <span className="text-xs uppercase tracking-[0.25em] text-primary font-body block mb-2">
        {milestone.date}
      </span>
      <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {milestone.title}
      </h3>
      <p className="font-body text-base text-muted-foreground leading-relaxed">
        {milestone.description}
      </p>
    </div>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.36.45-AM-1.jpeg",
    alt: "Jeeya & Anuj — a cherished moment",
    span2: true,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.37.50-AM-2.jpeg",
    alt: "Jeeya & Anuj together",
    span2: false,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.37.29-AM-3.jpeg",
    alt: "Our beautiful memory",
    span2: false,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.36.45-AM-1-4.jpeg",
    alt: "A moment to remember",
    span2: false,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.37.50-AM-1-5.jpeg",
    alt: "Jeeya & Anuj — forever",
    span2: true,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.36.45-AM-2-6.jpeg",
    alt: "Together always",
    span2: false,
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.37.29-AM-1-7.jpeg",
    alt: "Our story in a frame",
    span2: false,
  },
];

function GallerySection() {
  const headingRef = useFadeIn();

  return (
    <section
      data-ocid="gallery.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.16 0.04 320 / 0.25) 0%, transparent 70%)",
      }}
    >
      {/* Heading */}
      <div ref={headingRef} className="fade-in-section text-center mb-14">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary/70 mb-4 font-body">
          Frames of love
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          Our Moments
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-primary/60 text-xs">✦</span>
        </div>
      </div>

      {/* Masonry-like grid */}
      <div
        className="max-w-5xl mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "220px",
          gap: "12px",
        }}
      >
        {GALLERY_PHOTOS.map((photo, index) => (
          <GalleryItem key={photo.src} photo={photo} index={index} />
        ))}
      </div>
    </section>
  );
}

function GalleryItem({
  photo,
  index,
}: {
  photo: { src: string; alt: string; span2: boolean };
  index: number;
}) {
  const ref = useFadeIn();

  return (
    <div
      ref={ref}
      data-ocid={`gallery.item.${index + 1}`}
      className="fade-in-section gallery-photo-wrapper"
      style={{
        gridRow: photo.span2 ? "span 2" : "span 1",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="gallery-photo"
      />
    </div>
  );
}

// ─── Reasons Section ──────────────────────────────────────────────────────────
function ReasonsSection({ reasons }: { reasons: string[] }) {
  const headingRef = useFadeIn();

  return (
    <section
      data-ocid="reasons.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.16 0.04 15 / 0.2) 0%, transparent 70%)",
      }}
    >
      <div ref={headingRef} className="fade-in-section text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-accent/80 mb-4 font-body">
          Counted and infinite
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          Why I Love You
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-accent/60 text-xs">✦</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reasons.map((reason, index) => (
          <ReasonCard key={reason.slice(0, 30)} reason={reason} index={index} />
        ))}
      </div>
    </section>
  );
}

function ReasonCard({ reason, index }: { reason: string; index: number }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      data-ocid={`reasons.item.${index + 1}`}
      className="fade-in-section reason-card bg-card border border-border rounded-xl p-6 shadow-luxury"
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        <span
          className="font-display text-3xl font-bold text-primary/30 leading-none flex-shrink-0 select-none"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="font-body text-base text-foreground leading-relaxed pt-1">
          {reason}
        </p>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ coupleInfo }: { coupleInfo: CoupleInfo }) {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer
      data-ocid="footer.section"
      className="relative border-t border-border py-12 px-6"
      style={{
        background:
          "linear-gradient(to top, oklch(0.08 0.02 310) 0%, oklch(0.10 0.025 310) 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Couple names */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="font-display text-xl text-foreground">
            {coupleInfo.partner1Name}
          </span>
          <Heart
            className="text-accent"
            size={16}
            fill="currentColor"
            aria-hidden="true"
          />
          <span className="font-display text-xl text-foreground">
            {coupleInfo.partner2Name}
          </span>
        </div>

        {/* Anniversary date */}
        <p className="font-body text-sm text-muted-foreground mb-8 italic">
          Since {coupleInfo.anniversaryDate}
        </p>

        {/* Ornament */}
        <div className="ornament-divider mb-8 max-w-[200px] mx-auto">
          <span className="text-primary text-xs">♥</span>
        </div>

        {/* Attribution */}
        <p className="font-body text-xs text-muted-foreground">
          © {year}. Built with{" "}
          <Heart
            className="inline text-accent"
            size={12}
            fill="currentColor"
            aria-hidden="true"
          />{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-gold-light underline underline-offset-2 transition-colors duration-200"
            data-ocid="footer.link"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <div
      data-ocid="app.error_state"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 hero-bg"
    >
      <Heart className="text-accent mb-6" size={48} fill="currentColor" />
      <h2 className="font-display text-2xl text-foreground mb-3">
        Something went wrong
      </h2>
      <p className="font-body text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div
      data-ocid="app.loading_state"
      className="min-h-screen flex flex-col items-center justify-center hero-bg px-6"
    >
      <div className="text-center">
        <Heart
          className="text-primary mx-auto mb-8 animate-heart-beat"
          size={48}
          fill="currentColor"
          aria-hidden="true"
        />
        <HeroSkeleton />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const coupleQuery = useCoupleInfo();
  const letterQuery = useLoveLetter();
  const reasonsQuery = useReasonsList();
  const timelineQuery = useTimelineMilestones();

  const isLoading =
    coupleQuery.isPending ||
    letterQuery.isPending ||
    reasonsQuery.isPending ||
    timelineQuery.isPending;

  const isError =
    coupleQuery.isError ||
    letterQuery.isError ||
    reasonsQuery.isError ||
    timelineQuery.isError;

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState message="We couldn't load your anniversary page. Please refresh and try again." />
    );
  }

  const coupleInfo = coupleQuery.data!;
  const letter = letterQuery.data ?? { content: "", recipient: "", author: "" };
  const reasons = reasonsQuery.data ?? [];
  const milestones = timelineQuery.data ?? [];

  return (
    <main>
      <HeroSection coupleInfo={coupleInfo} />
      {letter.content && <LoveLetterSection letter={letter.content} />}
      {milestones.length > 0 && <TimelineSection milestones={milestones} />}
      <GallerySection />
      {reasons.length > 0 && <ReasonsSection reasons={reasons} />}
      <Footer coupleInfo={coupleInfo} />
    </main>
  );
}
