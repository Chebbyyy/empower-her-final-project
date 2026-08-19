import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  'Curated resources for skill development and career growth',
  'Health and wellness information and support',
  'Community posts and networking opportunities',
  'Educational content and mentorship programs',
  'Events and workshops focused on empowerment',
];

const About = () => {
  return (
    <div>
      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
            About
          </p>
          <h1 className="font-display text-4xl text-forest md:text-5xl tracking-tight">
            Built for gender equality, grounded in practice
          </h1>
          <p className="mt-6 font-inter text-lg text-ink-muted leading-relaxed">
            EmpowerHer advances gender equality and women’s empowerment in line with UN
            Sustainable Development Goal 5. We provide resources, community support, and
            opportunities so women can thrive across education, health, work, and leadership.
          </p>
        </div>
      </section>

      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-3xl">
          <h2 className="font-display text-3xl text-forest tracking-tight">Our mission</h2>
          <p className="mt-6 font-inter text-lg text-ink-muted leading-relaxed">
            To build a supportive ecosystem where women can access education, health resources,
            economic opportunity, and peer networks — and lead with confidence.
          </p>
        </div>
      </section>

      <section className="page-section border-b border-line">
        <div className="section-wrap">
          <h2 className="font-display text-3xl text-forest tracking-tight mb-10">
            What we offer
          </h2>
          <ul className="grid gap-0 sm:grid-cols-2">
            {offers.map((item) => (
              <li
                key={item}
                className="border-t border-line py-5 pr-6 text-ink leading-relaxed sm:odd:pr-10"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-forest tracking-tight">
              Take part
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Whether you are looking for resources, sharing your story, or contributing to the
              community — you are welcome here.
            </p>
          </div>
          <Link to="/resources" className="btn-primary">
            Browse resources
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
