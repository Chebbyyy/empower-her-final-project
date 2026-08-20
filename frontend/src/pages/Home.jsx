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

const MENTORSHIP_IMAGE =
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80';

const NEXT_STEP_IMAGE =
  'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=2000&q=80';

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
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative section-wrap w-full pb-16 pt-32 md:pb-24 md:pt-40">
          <h1 className="text-paper max-w-xl">Empower Her</h1>
          <p className="mt-5 max-w-md text-paper">
            Education, health, opportunity, and community — built for women advancing equality.
          </p>
          <div className="mt-10">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-brass">
                Go to dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn-brass">
                Join the community
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0">
          <GradientWaves
            horizonColor="#1b3a2f"
            waveColor="#1b3a2f"
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
        <div className="relative page-section-tight pointer-events-none">
          <div className="section-wrap max-w-3xl">
            <p className="text-paper mb-3">
              Mission
            </p>
            <h2 className="text-paper max-w-2xl">
              A platform aligned with gender equality, not slogans.
            </h2>
            <p className="mt-8 text-paper max-w-2xl">
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
        <div className="relative page-section-roomy">
          <div className="section-wrap">
            <h2 className="text-paper mb-8">
              Where we focus
            </h2>
            <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-12">
              {focusAreas.map((area, index) => (
                <li
                  key={area.title}
                  className="focus-area-item"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <h3 className="text-paper">{area.title}</h3>
                  <p className="mt-2 text-paper">{area.body}</p>
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
            <blockquote className="text-forest">
              “We need to reshape our own perception of how we view ourselves. We have to step up
              as women and take the lead.”
            </blockquote>
            <p className="mt-8 text-ink-muted">— Beyoncé Knowles-Carter</p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="page-section-tight">
        <div className="section-wrap">
          <div className="mb-8 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
            <h2 className="text-forest">
              Voices that lead
            </h2>
            <Link to="/gallery" className="link-brass">
              View the gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-10">
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
          <div className="section-wrap flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-brass mb-3">
                Women&apos;s Library
              </p>
              <h2>
                Read what great women wrote
              </h2>
              <p className="mt-5 text-paper">
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
      <section className="page-section-roomy border-b border-line">
        <div className="section-wrap flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-brass mb-3">
              Events &amp; workshops
            </p>
            <h2 className="text-forest">
              Learn and connect in person or online
            </h2>
            <p className="mt-5 text-ink-muted">
              Workshops, webinars, panels, and meetups — RSVP to save your spot.
            </p>
          </div>
          <Link to="/events" className="btn-primary shrink-0">
            View events
          </Link>
        </div>
      </section>

      {/* Mentorship teaser */}
      <section className="mentorship-teaser relative overflow-hidden text-paper">
        <img
          src={MENTORSHIP_IMAGE}
          alt=""
          className="mentorship-teaser-bg"
          aria-hidden="true"
        />
        <div className="mentorship-teaser-overlay" aria-hidden="true" />
        <div className="relative page-section-tight">
          <div className="section-wrap flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-brass mb-3">
                Mentorship
              </p>
              <h2>
                Find a mentor — or become one
              </h2>
              <p className="mt-5 text-paper">
                Connect with women who share your interests in career, leadership, and community.
              </p>
            </div>
            <Link to="/mentorship" className="btn-brass shrink-0">
              Explore mentorship
            </Link>
          </div>
        </div>
      </section>

      {/* Community teaser */}
      <section className="page-section border-b border-line">
        <div className="section-wrap flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-brass mb-3">
              Community
            </p>
            <h2 className="text-forest">
              Join the conversation
            </h2>
            <p className="mt-5 text-ink-muted">
              Share stories, ask questions, and support other women in the EmpowerHer community.
            </p>
          </div>
          <Link to="/community" className="btn-primary shrink-0">
            Open community
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="next-step-teaser relative overflow-hidden text-paper">
        <img
          src={NEXT_STEP_IMAGE}
          alt=""
          className="next-step-teaser-bg"
          aria-hidden="true"
        />
        <div className="next-step-teaser-overlay" aria-hidden="true" />
        <div className="relative page-section-roomy">
          <div className="section-wrap flex flex-col gap-9 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2>
                Find your next step
              </h2>
              <p className="mt-5 text-paper">
                Browse curated resources or learn how EmpowerHer works — then join when you are ready.
              </p>
            </div>
            <Link to="/resources" className="btn-brass">
              Browse resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
