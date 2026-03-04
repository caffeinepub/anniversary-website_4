import { Heart, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CoupleInfo, TimelineMilestone } from "./backend.d";
import {
  useCoupleInfo,
  useLoveLetter,
  useTimelineMilestones,
} from "./hooks/useQueries";

// ─── Days Together Since Proposal ────────────────────────────────────────────
// Started: September 25, 2025 at 4:10 PM
const TOGETHER_SINCE = new Date("2025-09-25T16:10:00");

function useDaysTogether(): {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const [elapsed, setElapsed] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculate() {
      const now = new Date();

      // Calculate full months elapsed
      let months =
        (now.getFullYear() - TOGETHER_SINCE.getFullYear()) * 12 +
        (now.getMonth() - TOGETHER_SINCE.getMonth());

      // Build the date that is exactly `months` months after the start
      const monthsLater = new Date(TOGETHER_SINCE);
      monthsLater.setMonth(monthsLater.getMonth() + months);
      if (monthsLater > now) months -= 1;

      // Remaining time after stripping full months
      const afterMonths = new Date(TOGETHER_SINCE);
      afterMonths.setMonth(afterMonths.getMonth() + months);

      const remainingMs = now.getTime() - afterMonths.getTime();
      const totalSeconds = Math.floor(remainingMs / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ months, days, hours, minutes, seconds });
    }

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, []);

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
const HEARTS = [
  {
    id: 0,
    left: "5%",
    size: 10,
    duration: 9,
    delay: 0,
    opacity: 0.55,
    sway: 3.5,
    color: "oklch(0.72 0.30 355)",
  },
  {
    id: 1,
    left: "20%",
    size: 12,
    duration: 11,
    delay: 2.5,
    opacity: 0.45,
    sway: 4,
    color: "oklch(0.80 0.22 345)",
  },
  {
    id: 2,
    left: "38%",
    size: 9,
    duration: 8,
    delay: 5,
    opacity: 0.5,
    sway: 3,
    color: "oklch(0.85 0.20 350)",
  },
  {
    id: 3,
    left: "55%",
    size: 14,
    duration: 10,
    delay: 1,
    opacity: 0.4,
    sway: 4.5,
    color: "oklch(0.72 0.30 355)",
  },
  {
    id: 4,
    left: "72%",
    size: 10,
    duration: 12,
    delay: 7,
    opacity: 0.48,
    sway: 3,
    color: "oklch(0.80 0.22 345)",
  },
  {
    id: 5,
    left: "88%",
    size: 8,
    duration: 9,
    delay: 3,
    opacity: 0.44,
    sway: 3.5,
    color: "oklch(0.85 0.20 350)",
  },
  {
    id: 6,
    left: "13%",
    size: 18,
    duration: 13,
    delay: 0.5,
    opacity: 0.25,
    sway: 5,
    color: "oklch(0.75 0.28 5)",
  },
  {
    id: 7,
    left: "47%",
    size: 16,
    duration: 15,
    delay: 3.5,
    opacity: 0.22,
    sway: 4,
    color: "oklch(0.80 0.24 350)",
  },
  {
    id: 8,
    left: "65%",
    size: 20,
    duration: 12,
    delay: 6,
    opacity: 0.28,
    sway: 5.5,
    color: "oklch(0.75 0.28 5)",
  },
  {
    id: 9,
    left: "82%",
    size: 17,
    duration: 14,
    delay: 1.8,
    opacity: 0.2,
    sway: 4,
    color: "oklch(0.80 0.24 350)",
  },
  {
    id: 10,
    left: "30%",
    size: 30,
    duration: 18,
    delay: 2,
    opacity: 0.12,
    sway: 7,
    color: "oklch(0.78 0.22 10)",
  },
  {
    id: 11,
    left: "58%",
    size: 34,
    duration: 22,
    delay: 8,
    opacity: 0.1,
    sway: 8,
    color: "oklch(0.75 0.28 5)",
  },
  {
    id: 12,
    left: "74%",
    size: 26,
    duration: 19,
    delay: 4,
    opacity: 0.14,
    sway: 6.5,
    color: "oklch(0.78 0.22 10)",
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

// ─── Days Together Timer ───────────────────────────────────────────────────────
function DaysTogetherTimer() {
  const elapsed = useDaysTogether();

  const units: { label: string; value: number }[] = [
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
              className="countdown-sep text-primary/60 font-display text-xl self-start pt-3"
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
        {["da", "hr", "min", "sec"].map((unit) => (
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

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.85 0.22 350 / 0.18) 0%, transparent 70%)",
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

        {/* Tagline */}
        <p className="font-body text-lg sm:text-xl text-primary italic mb-12 leading-relaxed max-w-xl mx-auto font-semibold">
          "{coupleInfo.tagline}"
        </p>

        {/* Ornament divider */}
        <div className="ornament-divider mb-8 max-w-xs mx-auto">
          <span className="text-primary text-sm font-display">♥</span>
        </div>

        {/* Days Together label */}
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6 font-body">
          Since September 25, 2025
        </p>

        {/* Timer */}
        <DaysTogetherTimer />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest font-body">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}

// ─── Sweet Notes Section (replaces "Why I Love You") ─────────────────────────
const SWEET_NOTES = [
  {
    icon: "🌸",
    title: "Every Day with You",
    note: "Every ordinary day becomes extraordinary just because you are in it. You make the mundane magical.",
  },
  {
    icon: "✨",
    title: "My Safe Place",
    note: "With you, I feel at home anywhere in the world. Your arms are my favourite place to be.",
  },
  {
    icon: "💌",
    title: "Little Things",
    note: "It is the little things — the way you laugh, the way you care, the way you are just you — that I treasure most.",
  },
  {
    icon: "🌺",
    title: "Growing Together",
    note: "Every month we grow closer, understand each other deeper, and love each other more. I cannot wait to see where we go.",
  },
  {
    icon: "💖",
    title: "My Favourite Chapter",
    note: "Of all the stories in the world, you and I are my favourite one. Thank you for choosing me.",
  },
  {
    icon: "🌹",
    title: "Forever Grateful",
    note: "I am grateful every single day that on September 25 you held my hand and made us official. Best decision ever.",
  },
];

function SweetNotesSection() {
  const headingRef = useFadeIn();

  return (
    <section
      data-ocid="sweet_notes.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.92 0.10 350 / 0.08) 0%, transparent 70%)",
      }}
    >
      <div ref={headingRef} className="fade-in-section text-center mb-14">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary/80 mb-4 font-body">
          Little notes for you
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          My Heart Says
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-primary/70 text-xs">✦</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SWEET_NOTES.map((note, index) => (
          <SweetNoteCard key={note.title} note={note} index={index} />
        ))}
      </div>
    </section>
  );
}

function SweetNoteCard({
  note,
  index,
}: {
  note: { icon: string; title: string; note: string };
  index: number;
}) {
  const ref = useFadeIn();

  return (
    <div
      ref={ref}
      data-ocid={`sweet_notes.item.${index + 1}`}
      className="fade-in-section sweet-note-card rounded-2xl p-6 flex flex-col items-center text-center gap-3"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <span className="text-3xl" aria-hidden="true">
        {note.icon}
      </span>
      <h3 className="font-display text-xl font-bold text-foreground">
        {note.title}
      </h3>
      <p className="font-body text-base text-muted-foreground leading-relaxed">
        {note.note}
      </p>
      <Sparkles
        className="text-primary/40 mt-auto"
        size={14}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <section
      data-ocid="landing.section"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 hero-bg overflow-hidden"
    >
      <FloatingHearts />

      {/* Soft radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.85 0.22 350 / 0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        {/* Greeting */}
        <h1
          className="font-display leading-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 7rem)",
            fontWeight: 800,
            color: "oklch(0.35 0.15 355)",
            textShadow:
              "0 2px 24px oklch(0.72 0.30 355 / 0.25), 0 1px 0 oklch(0.95 0.06 350)",
            letterSpacing: "-0.02em",
          }}
        >
          Hello Bagade
        </h1>

        {/* Subtitle line */}
        <p
          className="text-primary/70 text-base italic"
          style={{ fontFamily: "'Lora', 'Georgia', serif" }}
        >
          I made something for you
        </p>

        {/* Small decorative hearts row */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="text-primary/40 text-sm">♥</span>
          <span className="w-16 h-px bg-primary/30" />
          <span className="text-primary text-lg">♥</span>
          <span className="w-16 h-px bg-primary/30" />
          <span className="text-primary/40 text-sm">♥</span>
        </div>

        {/* CTA button */}
        <button
          data-ocid="landing.primary_button"
          onClick={onEnter}
          className="landing-love-btn font-display text-lg sm:text-xl font-bold px-10 py-4 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
          type="button"
        >
          <span className="mr-2" aria-hidden="true">
            ♥
          </span>
          Click if you really love me
          <span className="ml-2" aria-hidden="true">
            ♥
          </span>
        </button>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-10.36.45-AM-4-1.jpeg",
    alt: "Jeeya & Anuj holding hands",
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-11.39.48-AM-1--2.jpeg",
    alt: "Jeeya & Anuj together",
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-11.39.48-AM-3.jpeg",
    alt: "Jeeya & Anuj — a beautiful memory",
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-11.39.12-AM-4.jpeg",
    alt: "Jeeya & Anuj — the proposal moment",
  },
  {
    src: "/assets/uploads/WhatsApp-Image-2026-03-04-at-11.37.34-AM-5.jpeg",
    alt: "Jeeya & Anuj smiling together",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function GallerySection() {
  const headingRef = useFadeIn();

  // Shuffle once on mount; stable for the session
  const shuffledPhotos = useMemo(() => shuffleArray(GALLERY_PHOTOS), []);

  return (
    <section
      data-ocid="gallery.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.90 0.12 350 / 0.07) 0%, transparent 70%)",
      }}
    >
      {/* Heading */}
      <div ref={headingRef} className="fade-in-section text-center mb-14">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary/80 mb-4 font-body">
          Frames of love
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          Our Moments
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-primary/70 text-xs">✦</span>
        </div>
      </div>

      {/* 5-photo Mosaic Grid */}
      <div className="max-w-5xl mx-auto">
        {/* Top row: 2 photos */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {shuffledPhotos.slice(0, 2).map((photo, index) => (
            <GalleryItem key={photo.src} photo={photo} index={index} tall />
          ))}
        </div>
        {/* Bottom row: 3 photos */}
        <div className="grid grid-cols-3 gap-4">
          {shuffledPhotos.slice(2, 5).map((photo, index) => (
            <GalleryItem
              key={photo.src}
              photo={photo}
              index={index + 2}
              tall={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({
  photo,
  index,
  tall,
}: {
  photo: { src: string; alt: string };
  index: number;
  tall: boolean;
}) {
  const ref = useFadeIn();

  return (
    <div
      ref={ref}
      data-ocid={`gallery.item.${index + 1}`}
      className="fade-in-section gallery-photo-wrapper"
      style={{
        aspectRatio: tall ? "3/4" : "4/5",
        transitionDelay: `${index * 100}ms`,
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

// ─── Love Letter Section ──────────────────────────────────────────────────────
function LoveLetterSection({ letter }: { letter: string }) {
  const ref = useFadeIn();

  return (
    <section
      data-ocid="love_letter.section"
      className="relative py-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.90 0.10 350 / 0.06) 0%, transparent 70%)",
      }}
    >
      <div ref={ref} className="fade-in-section max-w-2xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary/80 mb-4 font-body">
            Written from the heart
          </p>
          <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
            A Love Letter
          </h2>
        </div>

        {/* Letter card */}
        <article className="paper-card rounded-2xl p-8 sm:p-12 relative">
          <div
            className="absolute top-4 left-4 text-primary opacity-30 font-display text-5xl leading-none select-none"
            aria-hidden="true"
          >
            "
          </div>
          <div
            className="absolute bottom-4 right-5 text-primary opacity-30 font-display text-5xl leading-none select-none rotate-180"
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
      <div ref={headingRef} className="fade-in-section text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary/80 mb-4 font-body">
          The chapters of us
        </p>
        <h2 className="font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-tight">
          Our Story
        </h2>
        <div className="ornament-divider mt-8 max-w-[120px] mx-auto">
          <span className="text-primary/60 text-xs">✦</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto relative">
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
      <div
        className={`flex-1 ${isLeft ? "md:text-right md:pr-10" : "md:order-3 md:text-left md:pl-10"}`}
      >
        {isLeft && <TimelineCard milestone={milestone} />}
      </div>

      <div className="relative flex items-center justify-center md:order-2 flex-shrink-0">
        <div
          className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-rose-glow z-10"
          aria-hidden="true"
        />
      </div>

      <div
        className={`flex-1 ${isLeft ? "md:order-3 md:pl-10" : "md:pr-10 md:text-right"}`}
      >
        {!isLeft && <TimelineCard milestone={milestone} />}
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
    <div className="bg-card border border-border rounded-xl p-6 shadow-luxury group hover:border-primary/60 transition-colors duration-300">
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
          "linear-gradient(to top, oklch(0.92 0.08 350) 0%, oklch(0.95 0.06 350) 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
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

        <p className="font-body text-sm text-muted-foreground mb-8 italic">
          Since {coupleInfo.anniversaryDate}
        </p>

        <div className="ornament-divider mb-8 max-w-[200px] mx-auto">
          <span className="text-primary text-xs">♥</span>
        </div>

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
            className="text-primary hover:text-primary/70 underline underline-offset-2 transition-colors duration-200"
            data-ocid="footer.link"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
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
  const [page, setPage] = useState<"landing" | "main">("landing");

  const coupleQuery = useCoupleInfo();
  const letterQuery = useLoveLetter();
  const timelineQuery = useTimelineMilestones();

  const isLoading =
    coupleQuery.isPending || letterQuery.isPending || timelineQuery.isPending;

  // Show landing page first regardless of loading state
  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("main")} />;
  }

  if (isLoading) return <LoadingState />;

  const coupleInfo = coupleQuery.data ?? {
    partner1Name: "Jeeya",
    partner2Name: "Anuj",
    anniversaryDate: "September 25, 2025",
    tagline: "Six months of love, laughter, and forever in the making",
  };

  const milestones = timelineQuery.data ?? [];

  // Love letter from Jeeya to Anuj — always use Jeeya's exact letter
  const letterContent =
    "My baby,\n\nFrom the moment you became mine on September 25, my world has been more colourful, more joyful, and more complete. Every laugh we have shared, every quiet moment spent together, every little memory we have created — I hold all of it close to my heart.\n\nYou have a way of making even the simplest days feel like something worth remembering. I never knew love could feel this natural, this warm, and this real until I found it with you.\n\nAs we reach six months together on March 25, I want you to know that every single day with you has been a gift. Here is to many more months, many more smiles, and a lifetime of us.\n\nAlways yours,\nJeeya";

  return (
    <main>
      <HeroSection coupleInfo={coupleInfo} />
      <SweetNotesSection />
      <GallerySection />
      <LoveLetterSection letter={letterContent} />
      {milestones.length > 0 && <TimelineSection milestones={milestones} />}
      <Footer coupleInfo={coupleInfo} />
    </main>
  );
}
