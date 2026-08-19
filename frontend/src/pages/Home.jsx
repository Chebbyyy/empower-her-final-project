import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import GradientWaves from '../components/GradientWaves.jsx';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=2000&q=80';

const FOCUS_IMAGE =
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=2000&q=80';

const QUOTE_IMAGE =
  'https://images.unsplash.com/photo-1658092967527-4e140d9bdaea?auto=format&fit=crop&w=1600&q=80';

const LIBRARY_IMAGE =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=80';

const focusAreas = [
  {
    title: 'Education & skills',
    body: 'Curated learning paths and practical materials for career growth.',
  },
  {
    title: 'Health & wellness',
    body: 'Clear information and community support around physical and mental health.',
  },
  {
    title: 'Economic opportunity',
    body: 'Tools and networks that help women build financial independence.',
  },
  {
    title: 'Leadership',
    body: 'Mentorship and programs that prepare women to lead with clarity.',
  },
];

const featured = [
  {
    name: 'Michelle Obama',
    role: 'Girls’ education advocate',
    image: '/images/Michelle Obama.jpg',
  },
  {
    name: 'Malala Yousafzai',
    role: 'Education activist',
    image: '/images/Malala.jpg',
  },
  {
    name: 'Graça Machel',
    role: 'Rights & policy leader',
    image: '/images/Graca.jpg',
  },
  {
    name: 'Purity Kagwiria',
    role: 'Young women’s mentorship',
    image: '/images/purity.jpg',
  },
];

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Full-bleed video hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
        <img
          src={HERO_IMAGE}
          alt=""
          className="hero-video-fallback absolute inset-0 h-full w-full object-cover object-center"
        />
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_IMAGE}
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        <div className="relative section-wrap w-full pb-10 pt-24 md:pb-14 md:pt-28 animate-[fadeIn_0.8s_ease-out]">
          <h1 className="text-4xl text-paper sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
            Empower Her
          </h1>
          <p className="mt-4 max-w-xl text-base text-paper/85 leading-relaxed md:text-xl">
            Education, health, opportunity, and community — built for women advancing equality.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn-brass">
                    Go to dashboard
                  </Link>
                  <Link to="/library" className="btn-ghost">
                    Explore library
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-brass">
                    Join the community
                  </Link>
                  <Link to="/resources" className="btn-ghost">
                    Explore resources
                  </Link>
                </>
              )}
            </div>
          </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0">
          <GradientWaves
            horizonColor="#1b3a2f"
            waveColor="#2d5a48"
            crestColor="#2d5a48"
            speed={0.38}
            amplitude={2.4}
            waveScale={0.55}
            waveRatio={0.9}
            swell={32}
            turbulence={18}
            tilt={1.11}
            zoom={1.05}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1.05}
            opacity={0.95}
            mouseInteraction={true}
            parallaxStrength={0.45}
            grain={true}
            grainIntensity={0.04}
          />
        </div>
        <div className="relative page-section pointer-events-none">
          <div className="section-wrap max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
              Mission
            </p>
            <h2 className="font-display text-3xl text-paper md:text-4xl tracking-tight">
              A platform aligned with gender equality, not slogans.
            </h2>
            <p className="mt-6 font-inter text-lg text-paper/85 leading-relaxed">
              EmpowerHer supports UN Sustainable Development Goal 5 by connecting women with
              practical resources, mentorship, and peer networks — so progress is shared, not
              solitary.
            </p>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="focus-section relative overflow-hidden">
        <img
          src={FOCUS_IMAGE}
          alt=""
          className="focus-section-bg"
          aria-hidden="true"
        />
        <div className="focus-section-overlay" aria-hidden="true" />
        <div className="relative page-section">
          <div className="section-wrap">
            <h2 className="font-display text-3xl text-paper md:text-4xl tracking-tight mb-12">
              Where we focus
            </h2>
            <ul className="grid gap-10 sm:grid-cols-2">
              {focusAreas.map((area, index) => (
                <li
                  key={area.title}
                  className="focus-area-item"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <h3 className="font-display text-xl text-paper">{area.title}</h3>
                  <p className="mt-3 text-paper/80 leading-relaxed">{area.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="quote-section page-section">
        <div className="section-wrap quote-section-grid">
          <div className="quote-section-photo">
            <img src={QUOTE_IMAGE} alt="Black women from Ghana, smiling together" />
          </div>
          <div className="quote-section-copy">
            <blockquote className="font-editorial text-2xl text-forest leading-snug italic md:text-3xl">
              “We need to reshape our own perception of how we view ourselves. We have to step up
              as women and take the lead.”
            </blockquote>
            <p className="mt-6 text-sm text-ink-muted">— Beyoncé Knowles-Carter</p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="page-section">
        <div className="section-wrap">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl text-forest md:text-4xl tracking-tight">
              Voices that lead
            </h2>
            <Link to="/gallery" className="link-brass text-sm font-medium">
              View the gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {featured.map((person) => (
              <figure key={person.name} className="group">
                <div className="overflow-hidden">
                  <img
                    src={encodeURI(person.image)}
                    alt={person.name}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="font-medium text-ink">{person.name}</p>
                  <p className="text-sm text-ink-muted">{person.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Library teaser */}
      <section className="library-teaser relative overflow-hidden text-paper campaign-hero">
        <img
          src={LIBRARY_IMAGE}
          alt=""
          className="library-teaser-bg"
          aria-hidden="true"
        />
        <div className="library-teaser-overlay" aria-hidden="true" />
        <div className="relative page-section">
          <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
                Women&apos;s Library
              </p>
              <h2 className="font-campaign text-3xl md:text-4xl">
                Read what great women wrote
              </h2>
              <p className="mt-4 text-paper/80 leading-relaxed campaign-body">
                Browse books and journals with summaries, quotes, and links — memoirs, activism,
                leadership, and more.
              </p>
            </div>
            <Link to="/library" className="btn-brass shrink-0">
              Explore library
            </Link>
          </div>
        </div>
      </section>

      {/* Events teaser */}
      <section className="page-section border-b border-line">
        <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
              Events &amp; workshops
            </p>
            <h2 className="font-display text-3xl text-forest md:text-4xl tracking-tight">
              Learn and connect in person or online
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Workshops, webinars, panels, and meetups — RSVP to save your spot.
            </p>
          </div>
          <Link to="/events" className="btn-primary shrink-0">
            View events
          </Link>
        </div>
      </section>

      {/* Mentorship teaser */}
      <section className="page-section border-b border-line bg-paper-dark/40">
        <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
              Mentorship
            </p>
            <h2 className="font-display text-3xl text-forest md:text-4xl tracking-tight">
              Find a mentor — or become one
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Connect with women who share your interests in career, leadership, and community.
            </p>
          </div>
          <Link to="/mentorship" className="btn-outline shrink-0">
            Explore mentorship
          </Link>
        </div>
      </section>

      {/* Community teaser */}
      <section className="page-section border-b border-line">
        <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
              Community
            </p>
            <h2 className="font-display text-3xl text-forest md:text-4xl tracking-tight">
              Join the conversation
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Share stories, ask questions, and support other women in the EmpowerHer community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/community" className="btn-primary shrink-0">
              Open community
            </Link>
            <Link to="/search" className="btn-outline shrink-0">
              Search the site
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="page-section">
        <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-forest md:text-4xl tracking-tight">
              Find your next step
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Browse curated resources or learn how EmpowerHer works — then join when you are ready.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/resources" className="btn-primary">
              Browse resources
            </Link>
            <Link to="/about" className="btn-outline">
              About the project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
