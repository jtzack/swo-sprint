import './index.css'
import { useState, useEffect, useRef } from 'react'
import * as Fathom from 'fathom-client'

const DEFAULT_CTA_URL = 'https://vine-perch-730.notion.site/aiws-swo-sprint-coming-soon?pvs=74'

// Cart closes at midnight ET the night before Session 1 (Monday, June 15, 2026)
const CART_CLOSE_DATE = new Date('2026-06-15T03:59:00Z')

const trackCTA = (location: string) => Fathom.trackEvent(`CTA: ${location}`)

/* ─── Fade-up on scroll ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: `transform 320ms ease-out ${delay}ms, opacity 320ms ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Logo lockup — 🚢 emoji + wordmark (the emoji IS the mark) ─── */
function Logo({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span style={{ fontSize: size * 1.2, lineHeight: 1 }} role="img" aria-label="ship">🚢</span>
      <span className="font-extrabold text-white tracking-[-0.01em] leading-none" style={{ fontSize: size }}>
        Start Writing Online Sprint
      </span>
    </div>
  )
}

/* ─── Eyebrow — small, red, tracked caps ─── */
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-bold text-[12px] uppercase tracking-caps text-red ${className}`}>
      {children}
    </p>
  )
}

/* ─── Gradient CTA (the page's heartbeat) ─── */
function CTA({
  children,
  href = DEFAULT_CTA_URL,
  size = 'lg',
  variant = 'gradient',
  full = false,
  className = '',
  onRef,
  track,
}: {
  children: React.ReactNode
  href?: string
  size?: 'lg' | 'sm'
  variant?: 'gradient' | 'red' | 'light'
  full?: boolean
  className?: string
  onRef?: React.Ref<HTMLAnchorElement>
  track?: string
}) {
  const pad = size === 'lg' ? 'px-9 py-[18px] text-[clamp(16px,1.4vw,21px)]' : 'px-6 py-3.5 text-[15px]'
  const variantClass = {
    gradient: 'bg-cta-gradient text-white shadow-cta hover:brightness-[1.06]',
    red: 'bg-red text-white hover:brightness-[1.08]',
    light: 'bg-white text-red hover:brightness-[0.97]',
  }[variant]
  return (
    <a
      ref={onRef}
      href={href}
      onClick={() => track && trackCTA(track)}
      className={`${full ? 'block w-full text-center' : 'inline-block'} font-bold rounded-btn transition-[transform,filter] duration-150 active:scale-[0.98] ${pad} ${variantClass} ${className}`}
    >
      {children}
    </a>
  )
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ targetDate, compact, hero }: { targetDate: Date; compact?: boolean; hero?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    const id = setInterval(() => setTimeLeft(calc()), 1000)
    setTimeLeft(calc())
    return () => clearInterval(id)
  }, [targetDate])

  if (compact) {
    return (
      <span className="text-[13px] text-fg-2 tabular-nums font-semibold">
        {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  if (hero) {
    return (
      <div className="swo-countdown">
        {units.map((u) => (
          <div key={u.label} className="cd-unit">
            <div className="cd-box">{String(u.value).padStart(2, '0')}</div>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="inline-flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="font-extrabold text-[28px] leading-none rounded-btn px-3 py-2 min-w-[54px] text-center tabular-nums bg-card-2 text-white">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-caps mt-1.5 text-fg-3">{u.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO — centered countdown hero on an animated aurora sky
   ═══════════════════════════════════════════════════════════ */
function Hero({ ctaRef }: { ctaRef: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <header className="relative isolate overflow-hidden flex items-center justify-center min-h-screen" style={{ background: '#10142A' }}>
      {/* animated background layers */}
      <div className="swo-hero-bg">
        <div className="bg-aurora-fx">
          <div className="blob a" />
          <div className="blob b" />
          <div className="blob c" />
        </div>
      </div>
      <div className="swo-vignette" aria-hidden="true" />

      <div className="relative z-[2] w-full max-w-[900px] mx-auto px-5 md:px-8 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2.5 bg-card-2/80 border border-line rounded-full px-4 py-2 text-[14px] font-semibold text-fg-1 backdrop-blur-[6px]">
          <span className="swo-pulse w-2 h-2 rounded-full bg-red flex-shrink-0" />
          Live Sprint Begins Monday, June 15, 2026
        </div>
        <h1
          className="font-black text-white mt-7"
          style={{ fontSize: 'clamp(42px, 6.2vw, 84px)', lineHeight: 0.98, letterSpacing: '-0.03em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}
        >
          Start Writing<br />
          Online In{' '}
          <span className="swo-ul">
            5 Days
            <svg className="swo-ul-svg" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
              <path className="ul-base" d="M4 16 C 70 6, 150 4, 296 12" pathLength={1} />
              <path className="ul-draw" d="M4 16 C 70 6, 150 4, 296 12" pathLength={1} />
              <path className="ul-comet" d="M4 16 C 70 6, 150 4, 296 12" pathLength={1} />
            </svg>
          </span>
        </h1>
        <p className="text-fg-2 max-w-[560px] mt-6" style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.55 }}>
          Create your niche, differentiate your ideas, and kickstart a timeless library of content.
        </p>
        <a
          ref={ctaRef}
          href={DEFAULT_CTA_URL}
          onClick={() => trackCTA('Hero')}
          className="swo-cta-glow inline-flex items-center justify-center mt-9 font-extrabold text-[17px] text-white bg-cta-gradient rounded-btn px-10 py-[17px] transition-[transform,filter] duration-150 hover:brightness-[1.06] active:scale-[0.98]"
        >
          Join The Sprint
        </a>
        <p className="text-[11px] font-bold uppercase text-fg-3 mt-12 mb-4" style={{ letterSpacing: '0.22em' }}>Cart Closes In</p>
        <CountdownTimer targetDate={CART_CLOSE_DATE} hero />
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════
   WHY WRITE ONLINE — The opportunity
   ═══════════════════════════════════════════════════════════ */
function WhyWriteOnline() {
  const reasons = [
    { num: '01', title: 'Build the skill.', body: 'Writing online is the highest-leverage skill of the decade. Learn the fundamentals (especially in the age of AI) — every post sharpens how you think and compounds how far your ideas travel.' },
    { num: '02', title: 'Claim your niche.', body: 'The internet rewards specificity. Stake your claim on a niche and become the go-to voice people follow, trust, and learn from.' },
    { num: '03', title: 'Build an audience asset.', body: 'A library of content is the front door to your entire business — the asset that turns readers into subscribers, customers, and clients.' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <Eyebrow className="mb-3">The opportunity</Eyebrow>
        <h2 className="font-extrabold text-white tracking-display mb-12 max-w-[16ch]" style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05 }}>
          Why start writing online in 2026?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div key={r.num} className="bg-card-2 rounded-card p-7 md:p-8 flex flex-col">
              <p className="font-black text-[44px] leading-none text-gradient mb-4">{r.num}</p>
              <h3 className="font-bold text-[22px] text-white mb-3">{r.title}</h3>
              <p className="text-[16px] leading-[1.6] text-fg-2">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   WHAT IS THE SPRINT — stat cards
   ═══════════════════════════════════════════════════════════ */
function Stats() {
  const stats = [
    { num: '5', label: 'Live Sessions', desc: 'One per day over 5 days. 60 min each. 3:00 PM ET.' },
    { num: '5', label: 'Days To Start Writing Online', desc: 'From blank page to a publishing habit and your first library of content.' },
    { num: '5', label: 'AI Prompts', desc: 'A plug-and-play AI prompt included with every single session.' },
    { num: '2', label: 'World-Class Instructors', desc: 'Nicolas Cole & Dickie Bush — founders of Ship 30 for 30.' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        {/* Centered header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Eyebrow className="mb-4">The sprint</Eyebrow>
          <h2 className="font-extrabold text-white tracking-display max-w-[18ch]" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)', lineHeight: 1.08 }}>
            What is the Start Writing Online Sprint?
          </h2>
        </div>
        {/* Image left, stats right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/images/swo-hero-2.png"
              alt="Sprint cohort together on a live group video call"
              className="w-full max-w-[480px] object-contain"
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card-2 rounded-card p-5 md:p-6 flex flex-col">
                <p className="font-black text-gradient leading-none mb-3" style={{ fontSize: 'clamp(40px, 4vw, 56px)' }}>{s.num}</p>
                <p className="text-[13px] font-bold text-white mb-2 leading-tight">{s.label}</p>
                <p className="text-[13px] md:text-[14px] leading-[1.5] text-fg-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Centered CTA */}
        <div className="mt-14 text-center">
          <CTA size="lg" track="Stats">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   INSTRUCTORS — Cole + Dickie (circular avatars, red names)
   ═══════════════════════════════════════════════════════════ */
function Instructors() {
  const captains = [
    {
      name: 'Nicolas Cole',
      role: 'Co-Founder, Ship 30 for 30 & Premium Ghostwriting Academy',
      img: '/images/sps/cole-headshot.png',
      bio: 'I challenged myself to write every single day on Quora for a year — and became the #1 most-read writer on the platform, out of 200 million users. That habit led to a column at Inc Magazine, a multimillion-dollar ghostwriting agency, and my book, The Art & Business of Online Writing. Today I’ve distilled 10+ years of online writing into Ship 30 for 30 to get you started in just 30 days.',
    },
    {
      name: 'Dickie Bush',
      role: 'Co-Founder, Ship 30 for 30',
      img: '/images/sps/dickie-headshot.png',
      bio: 'I started writing online in January 2020 by publishing a short post every single day for 30 days — squashing my perfectionism, 10x-ing my writing speed, and growing my audience over 500%. A single tweet to 500 followers turned that experiment into Ship 30 for 30. Together with Cole, I’ve packed everything we know about building habits and writing online into the program.',
    },
  ]
  const pills = ['10,000+ Writers Taught', '$20M+ In Digital Products']
  return (
    <section id="instructors" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
        <div>
          <Eyebrow className="mb-5">Meet your instructors</Eyebrow>
          <h2 className="font-extrabold text-white tracking-display mb-6" style={{ fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.1 }}>
            Built by the founders of the internet’s #1 writing program.
          </h2>
          <p className="text-[17px] text-fg-2 leading-[1.6] max-w-[520px] mb-8">
            Created by Nicolas Cole &amp; Dickie Bush — the team behind Ship 30 for 30, the program that’s taught over <strong className="text-white font-semibold">10,000 writers</strong> to start writing online.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {pills.map((s) => (
              <span key={s} className="inline-flex items-center bg-card-3 text-white text-[12px] font-bold uppercase tracking-caps px-4 py-2 rounded-card">{s}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {captains.map((c) => (
            <div key={c.name} className="bg-card-2 rounded-card p-6 md:p-7 flex gap-5 items-start">
              <div className="w-[80px] h-[80px] md:w-[92px] md:h-[92px] rounded-full overflow-hidden flex-shrink-0 border-2 border-card-3">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div>
                <p className="font-extrabold text-[20px] text-red leading-none">{c.name}</p>
                <p className="text-[12px] font-semibold text-fg-3 mt-1.5 mb-3">{c.role}</p>
                <p className="text-[15px] leading-[1.6] text-fg-2">{c.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof — what Ship 30 for 30 writers say */}
      <SocialProof />
    </section>
  )
}

/* ─── Lite YouTube embed — thumbnail facade, loads the real
       player only on click (fast first paint, no cookies until play) ─── */
function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false)
  return (
    <div className="relative w-full aspect-video rounded-card overflow-hidden bg-card-2 shadow-card">
      {active ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
          <span className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-cta-gradient shadow-cta transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SOCIAL PROOF — testimonials from Ship 30 for 30 writers
   ═══════════════════════════════════════════════════════════ */
function SocialProof() {
  const testimonials = [
    {
      name: 'David Miller',
      quote: 'Ignore every other course and community on Twitter and go all in with Ship 30 for 30! It’s hard to describe the inspiration I feel surging through my body every day since joining.',
    },
    {
      name: 'Nicole Folker',
      quote: 'Ship 30 for 30 is the best course I’ve taken hands down (and I’ve taken a lot). Not only will you learn how to be a digital writer, but you’ll meet incredible people in the community.',
    },
    {
      name: 'Omer Khan',
      quote: 'Before Ship 30 for 30, I had never written and published anything for more than a couple of days in a row. After, I published 30 days in a row and overcame my fear of perfection.',
    },
    {
      name: 'Tin',
      quote: 'Ship 30 is the best cohort-course I’ve ever taken. It truly is a life-changing experience. You will go from 0 to 1 if you take this course.',
    },
    {
      name: 'Pia Mailhot-Leichter',
      quote: 'Hard-core value. It provides the best (and super professional) framework for learning — actually practicing. Learning by doing with a strong, supportive, and engaged community.',
    },
    {
      name: 'Kevin Alexander',
      quote: 'From Day 1, it’s full of actionable takeaways you can immediately use to improve your writing. I’ve been in a couple of other cohort-based courses — I got the most value from this one.',
    },
  ]
  return (
    <div className="max-w-container mx-auto mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-line">
      <h2 className="font-extrabold text-white tracking-display text-center mb-12 md:mb-14" style={{ fontSize: 'clamp(28px, 4.2vw, 48px)', lineHeight: 1.08 }}>
        Loved by 10,000+ writers
      </h2>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-card-2 rounded-card p-6 flex flex-col">
              <blockquote className="text-[15px] leading-[1.6] text-fg-2 flex-1">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-5">
                <span className="w-9 h-9 rounded-full bg-cta-gradient flex items-center justify-center font-bold text-[14px] text-white flex-shrink-0">
                  {t.name.charAt(0)}
                </span>
                <span className="font-bold text-[14px] text-white">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        {/* Video — lite YouTube facade */}
        <div className="lg:sticky lg:top-24">
          <LiteYouTube id="c_HHqXB2qWM" title="Start Writing Online Sprint" />
        </div>
      </div>
    </div>
  )
}

/* ─── Green circled check (the brand's one recurring icon) ─── */
function Check() {
  return (
    <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(61,214,140,0.15)' }}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3DD68C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ — Is the sprint right for you? (green-check problem cards)
   ═══════════════════════════════════════════════════════════ */
function QuizSection() {
  const cards = [
    { title: 'Have you wanted to <em>start writing online</em>, but aren’t sure the first step to take?', body: 'Are you <strong>overwhelmed</strong> with the number of different platforms, topics, and strategies out there for writing online?' },
    { title: 'Have you <em>started writing online</em>, but now feel stuck?', body: 'Are you hacking away at blog posts, <strong>publishing into the void</strong>, never gaining any traction?' },
    { title: 'Do you have <em>plenty of ideas</em>, but struggle to put yourself out there?', body: 'Do you find yourself creating <strong>draft after draft</strong>, never hitting publish?' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <h2 className="font-extrabold text-white tracking-display text-center mb-12 md:mb-14" style={{ fontSize: 'clamp(28px, 4.2vw, 48px)', lineHeight: 1.08 }}>
          Quiz: Is the sprint right for you?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="bg-card-2 rounded-card p-6 md:p-7 flex flex-col gap-4">
              <Check />
              <h3
                className="font-bold text-[19px] leading-[1.3] text-white [&_em]:not-italic [&_em]:text-red"
                dangerouslySetInnerHTML={{ __html: c.title }}
              />
              <p
                className="text-[15px] leading-[1.55] text-fg-2 [&_strong]:text-white [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </div>
          ))}
        </div>
        <div className="text-center my-14 md:my-16">
          <p className="font-extrabold text-white tracking-tight2 mb-4" style={{ fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.1 }}>If any of these sound familiar…</p>
          <p className="font-extrabold text-white tracking-tight2" style={{ fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.1 }}>
            Then the <span className="text-gradient">Start Writing Online Sprint</span> was built for you.
          </p>
        </div>
        <div className="text-center">
          <CTA size="lg" track="Quiz">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ─── Hairline section rule ─── */
function Divider() {
  return <div className="max-w-[1000px] mx-auto h-[2px] bg-white/80" />
}

/* ═══════════════════════════════════════════════════════════
   CURRICULUM — 5 sessions on a vertical timeline
   ═══════════════════════════════════════════════════════════ */
function Curriculum() {
  const sessions = [
    { num: 1, date: 'Mon Jun 15', title: 'Niche Content Strategy', desc: 'Find the intersection of what you know, what you love, and what people want to read. Walk away with a clear niche and a content strategy you can execute from day one.', asset: 'Niche Content Strategy Prompt' },
    { num: 2, date: 'Tue Jun 16', title: 'Short-Form Posts', desc: 'The anatomy of a scroll-stopping short-form post. Master the hooks, formats, and frameworks that turn a single idea into a post that earns attention.', asset: 'Short-Form Post Generator' },
    { num: 3, date: 'Wed Jun 17', title: 'Atomic Essays', desc: 'Package one big idea into a 250-word Atomic Essay that’s clear, valuable, and endlessly shareable — the signature format that built tens of thousands of writers.', asset: 'Atomic Essay Builder' },
    { num: 4, date: 'Thu Jun 18', title: 'Long-Form Articles', desc: 'Expand your best Atomic Essays into long-form articles that rank, resonate, and establish you as the authority in your niche.', asset: 'Long-Form Article Outliner' },
    { num: 5, date: 'Fri Jun 19', title: 'CTAs & Engagement', desc: 'Turn readers into subscribers and fans. Master the calls-to-action and engagement loops that compound your audience over time.', asset: 'CTA & Engagement Prompt' },
  ]
  return (
    <section id="curriculum" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="mb-3 text-center">The 5 live sessions</Eyebrow>
        <h2 className="font-extrabold text-white tracking-display text-center mb-3" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08 }}>
          Here’s what you’ll build.
        </h2>
        <p className="text-[15px] text-fg-2 text-center mb-14">
          All sessions 60 min · Mon–Fri · 3:00 PM ET · June 15 – June 19, 2026
        </p>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2" style={{ background: 'rgba(211,22,81,0.35)' }} />
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-[2px]" style={{ background: 'rgba(211,22,81,0.35)' }} />

          <div className="space-y-10 md:space-y-14">
            {sessions.map((s) => {
              const isEven = s.num % 2 === 0
              return (
                <div key={s.num} className="relative">
                  <div className="absolute z-10 w-11 h-11 rounded-full bg-cta-gradient flex items-center justify-center left-0 md:left-1/2 md:-translate-x-1/2 shadow-cta">
                    <span className="font-black text-[18px] text-white leading-none">{s.num}</span>
                  </div>
                  <div className={`pl-16 md:pl-0 md:w-[45%] ${isEven ? 'md:ml-auto md:pl-14' : 'md:mr-auto md:pr-14 md:text-right'}`}>
                    <span className="inline-block bg-card-2 text-red text-[11px] font-bold uppercase tracking-caps px-3 py-1 rounded-[6px] mb-2.5">{s.date}</span>
                    <h3 className="font-bold text-white mb-2.5" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)' }}>{s.title}</h3>
                    <p className="text-[15px] text-fg-2 leading-[1.6] mb-3">{s.desc}</p>
                    <div className={`inline-block bg-card-2 rounded-[8px] px-3 py-2 ${isEven ? '' : 'md:ml-auto'}`}>
                      <p className="text-[10px] font-bold uppercase tracking-caps text-red mb-0.5">AI Prompt included</p>
                      <p className="text-[13px] font-semibold text-white">{s.asset}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-extrabold text-white tracking-tight2 mb-5" style={{ fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.15 }}>
            We build <span className="text-gradient">together</span>. You leave with <span className="text-gradient">a library of content</span>.
          </p>
          <p className="text-[16px] text-fg-2 mb-8">This isn’t self-paced content you buy and forget.</p>
          <CTA size="lg" track="Curriculum">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   AI WRITING SKOOL — Free 30-Day Trial
   ═══════════════════════════════════════════════════════════ */
function AIWritingSkool() {
  const perks = [
    { title: 'AI Cole', desc: 'Our custom AI model trained on all of our programs, curriculums, books, and content. Ask it anything, 24/7.', value: '$5,000+ value' },
    { title: 'Monday Hot Seats with Cole', desc: 'Submit your questions and workshop your specific situation live.', value: '$3,000+ value' },
    { title: 'Weekly AI/Tech Clinic with Mitch Harris', desc: 'Office hours to troubleshoot, learn new AI tools, and stay on the cutting edge.', value: '$1,500+ value' },
    { title: 'Monthly Mini-Products, Templates, Prompts, and .Skills', desc: 'New resources dropped every month that you can download and use immediately.', value: '$1,000+ value' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <Eyebrow className="mb-4">Included free with the sprint</Eyebrow>
        <h2 className="font-extrabold text-white tracking-display mb-4" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08 }}>
          A 30-day trial to <span className="text-gradient">AI Writing Skool</span>.
        </h2>
        <p className="text-[18px] text-fg-2 mb-12 max-w-[760px] leading-[1.6]">
          AI Writing Skool is THE community for writers and creators building in the new AI economy — and you get full access for 30 days so you can <strong className="text-white font-semibold">get feedback on your writing</strong>, trade ideas, and stay sharp as you build.
        </p>
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
          <div className="w-full md:w-[45%] flex-shrink-0">
            <img src="/images/AIWS.png" alt="AI Writing Skool" className="w-full object-contain rounded-card border border-line shadow-card" loading="lazy" />
          </div>
          <div className="flex-1">
            <Eyebrow className="mb-5">Inside, you’ll unlock:</Eyebrow>
            <div className="space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="text-red mt-1 flex-shrink-0 font-bold">→</span>
                  <div>
                    <span className="text-[15px] font-bold text-white">{p.title}:</span>
                    <span className="text-[15px] text-fg-2"> {p.desc}</span>
                    <span className="text-[13px] text-red font-semibold"> ({p.value})</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-red mt-1 flex-shrink-0 font-bold">→</span>
                <div>
                  <span className="text-[15px] font-bold text-white">Daily Q&amp;A Channel:</span>
                  <span className="text-[15px] text-fg-2"> Never get stuck. Get answers from the community and our team every single day.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   BONUSES — placeholder (copy + assets TBD)
   ═══════════════════════════════════════════════════════════ */
function BonusSection() {
  const bonuses = [
    { tag: 'Bonus #1', title: 'Bonus title coming soon', desc: 'Placeholder copy for the first bonus. Swap this out with the real bonus name, description, and value.', value: 'TBD' },
    { tag: 'Bonus #2', title: 'Bonus title coming soon', desc: 'Placeholder copy for the second bonus. Swap this out with the real bonus name, description, and value.', value: 'TBD' },
    { tag: 'Bonus #3', title: 'Bonus title coming soon', desc: 'Placeholder copy for the third bonus. Swap this out with the real bonus name, description, and value.', value: 'TBD' },
  ]
  return (
    <section id="bonuses" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <Eyebrow className="mb-4">Plus free bonuses</Eyebrow>
          <h2 className="font-extrabold text-white tracking-display max-w-[18ch]" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08 }}>
            Enroll today and unlock these bonuses.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonuses.map((b) => (
            <div key={b.tag} className="bg-card-2 rounded-card p-7 flex flex-col border border-dashed border-line">
              <span className="inline-block self-start bg-card-3 text-red text-[11px] font-bold uppercase tracking-caps px-3 py-1 rounded-[6px] mb-4">{b.tag}</span>
              <h3 className="font-bold text-[20px] text-white mb-3">{b.title}</h3>
              <p className="text-[15px] leading-[1.6] text-fg-2 flex-1">{b.desc}</p>
              <p className="text-[13px] text-red font-semibold mt-4">({b.value} value)</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PRICING — Offer stack
   ═══════════════════════════════════════════════════════════ */
function Pricing() {
  const items = [
    { name: '5 x 60-Minute Live Sessions', price: '$1,500' },
    { name: 'A 5-Day Write & Publish Schedule', price: '$500' },
    { name: 'The Sprint Session Guide', price: '$300' },
    { name: '5 Done-For-You AI Prompts', price: '$500' },
    { name: 'Session Replays', price: '$300' },
    { name: 'Lifetime Access to the Curriculum', price: 'Priceless' },
    { name: '30-Day AI Writing Skool Trial', price: '$99' },
  ]
  return (
    <section id="pricing" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-narrow mx-auto text-center">
        <Eyebrow className="mb-4">Join the sprint</Eyebrow>
        <h2 className="font-extrabold text-white tracking-display mb-12 mx-auto max-w-[16ch]" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08 }}>
          Want to start writing online in 5 days?
        </h2>

        <div className="max-w-[560px] mx-auto rounded-lg2 overflow-hidden shadow-float">
          {/* Value stack */}
          <div className="bg-card p-7 md:p-9 text-left">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-line last:border-b-0 gap-4">
                <span className="text-[14px] text-fg-1">{item.name}</span>
                <span className="text-[14px] font-semibold text-fg-3 flex-shrink-0">{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-3 border-t border-line">
              <span className="text-[14px] font-bold text-white">Total Value</span>
              <span className="font-black text-[24px] text-white line-through decoration-red decoration-2">$3,199</span>
            </div>
          </div>
          {/* Price reveal — gradient panel */}
          <div className="bg-cta-gradient p-8 md:p-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-caps text-white/75">Your price today</p>
            <p className="font-black text-white leading-none mt-2" style={{ fontSize: 'clamp(64px,11vw,96px)' }}>$99</p>
            <a
              href={DEFAULT_CTA_URL}
              onClick={() => trackCTA('Pricing')}
              className="inline-block bg-white text-red font-bold text-[16px] px-9 py-[18px] rounded-btn mt-6 transition-[transform,filter] duration-150 hover:brightness-[0.97] active:scale-[0.98]"
            >
              Join The Sprint →
            </a>
            <p className="text-[12px] text-white/80 mt-4">7-day money-back guarantee</p>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-caps text-fg-3 mt-10 mb-3">Enrollment closes in</p>
        <div className="inline-block"><CountdownTimer targetDate={CART_CLOSE_DATE} /></div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FINAL CTA BAND
   ═══════════════════════════════════════════════════════════ */
function CTABand() {
  return (
    <section id="final-cta" className="py-24 md:py-32 px-5 md:px-8 text-center">
      <div className="max-w-narrow mx-auto">
        <h2 className="font-extrabold text-white tracking-display mb-5 mx-auto" style={{ fontSize: 'clamp(34px, 5.2vw, 60px)', lineHeight: 1.08, textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
          Start writing online. This week.
        </h2>
        <p className="text-[19px] text-fg-2 max-w-[600px] mx-auto mb-9 leading-[1.6]">
          Five live sessions, five done-for-you AI prompts, and a 5-day schedule that takes you from blank page to a publishing habit. Lifetime access — and a 7-day no-questions-asked refund if you show up to Session 1 and decide it isn’t for you.
        </p>
        <CTA size="lg" track="Final">Join The Sprint</CTA>
        <p className="text-[14px] text-fg-3 mt-6">Live sprint begins Monday, June 15, 2026.</p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
function FAQ() {
  const faqs = [
    { q: 'How much time do I need?', a: 'One 60-minute live session per day (Monday–Friday at 3:00 PM ET), plus about 30 minutes to write and publish each day. Everything is built during the session itself, so implementation time is minimal.' },
    { q: 'What if I can’t attend live?', a: 'Every session is recorded and the replay goes up within hours, along with the full slide deck. Showing up live is where the real value is — real-time Q&A and feedback can’t be replicated in a replay.' },
    { q: 'I’m not a great writer. Can I still do this?', a: 'You don’t need to be a great writer. You need to be a clear thinker. The frameworks show you how to organize your ideas, and the AI prompt that comes with each session helps with the words. We’ve seen total beginners publish posts they’re genuinely proud of by Friday.' },
    { q: 'Do I need an audience or a following already?', a: 'Not at all. The Sprint is built for people starting from zero. You’ll leave with a niche, a publishing habit, and your first library of content — the foundation every audience is built on.' },
    { q: 'Won’t AI-assisted writing sound generic?', a: 'Not the way we teach it. There’s a difference between AI-generated slop (which readers scroll right past) and AI-assisted writing (which is the new standard). Each AI prompt helps you write faster while keeping every post recognizably yours.' },
    { q: 'How is this different from Ship 30 for 30?', a: 'Think of them as sequential, not competing. Ship 30 for 30 helps you build a daily writing habit. The sprint kickstarts your progress.' },
    { q: 'How long do I have access?', a: 'Lifetime. Every replay, slide, template, and AI prompt is yours forever — including every update we ship to the curriculum.' },
    { q: 'Is there a guarantee?', a: 'Yes. Show up to Session 1, do the work, and if it isn’t what you expected — email us within 7 days and we’ll refund you in full. No questions asked.' },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="mb-4">Frequently asked questions</Eyebrow>
        <h2 className="font-extrabold text-white tracking-display mb-12" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08 }}>Still wondering?</h2>
        <div className="flex flex-col gap-[2px] bg-line rounded-card overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="bg-ink-900">
                <button
                  onClick={() => {
                    if (!isOpen) Fathom.trackEvent(`FAQ: ${faq.q}`)
                    setOpen(isOpen ? null : i)
                  }}
                  className="w-full bg-transparent border-none cursor-pointer px-6 md:px-7 py-5 md:py-6 flex items-center justify-between text-left text-white text-[16px] md:text-[18px] font-semibold leading-tight hover:text-red transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="font-black text-[28px] text-red leading-none flex-shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </button>
                {isOpen && (
                  <div className="px-6 md:px-7 pb-6 md:pb-7">
                    <p className="text-[16px] md:text-[17px] leading-[1.6] text-fg-2 max-w-[680px]">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-line px-5 md:px-8 py-10">
      <div className="max-w-container mx-auto flex flex-col md:flex-row items-center gap-5">
        <Logo size={17} />
        <div className="flex gap-6 md:ml-auto">
          <a href="#" className="text-fg-2 text-[14px] hover:text-white transition-colors">Blog</a>
          <a href="#" className="text-fg-2 text-[14px] hover:text-white transition-colors">Success Stories</a>
          <a href="#" className="text-fg-2 text-[14px] hover:text-white transition-colors">Privacy</a>
        </div>
        <div className="text-fg-3 text-[13px] md:ml-6">© 2026 Ship 30 for 30, LLC.</div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   STICKY CTA BAR — appears when hero CTA scrolls off
   ═══════════════════════════════════════════════════════════ */
function StickyCtaBar({ heroCtaRef }: { heroCtaRef: React.RefObject<HTMLAnchorElement | null> }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = heroCtaRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroCtaRef])
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-line backdrop-blur-md transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ background: 'rgba(16,20,42,0.82)' }}
    >
      <div className="max-w-container mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
        <Logo size={16} className="hidden md:flex" />
        <div className="hidden md:block">
          <CountdownTimer targetDate={CART_CLOSE_DATE} compact />
        </div>
        <CTA size="sm" track="Sticky Bar" className="mx-auto md:mx-0">Join The Sprint</CTA>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const heroCtaRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const thresholds = [25, 50, 75, 100]
    const firedScroll = new Set<number>()
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (window.scrollY / total) * 100
      for (const t of thresholds) {
        if (pct >= t && !firedScroll.has(t)) {
          firedScroll.add(t)
          Fathom.trackEvent(`Scroll: ${t}%`)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const sectionNames: Record<string, string> = {
      curriculum: 'Section: Curriculum',
      pricing: 'Section: Pricing',
      'final-cta': 'Section: Final CTA',
      faq: 'Section: FAQ',
    }
    const firedSection = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedSection.has(entry.target.id)) {
            firedSection.add(entry.target.id)
            const name = sectionNames[entry.target.id]
            if (name) Fathom.trackEvent(name)
          }
        }
      },
      { threshold: 0.3 },
    )
    for (const id of Object.keys(sectionNames)) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="starfield min-h-screen">
      <Hero ctaRef={heroCtaRef} />
      <FadeIn><WhyWriteOnline /></FadeIn>
      <FadeIn><Stats /></FadeIn>
      <FadeIn><Instructors /></FadeIn>
      <FadeIn><QuizSection /></FadeIn>
      <Divider />
      <FadeIn><Curriculum /></FadeIn>
      <FadeIn><AIWritingSkool /></FadeIn>
      <FadeIn><BonusSection /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><CTABand /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <Footer />
      <StickyCtaBar heroCtaRef={heroCtaRef} />
    </main>
  )
}
