import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageShowcase } from './components/ImageShowcase';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { AfroDoodlesOverlay } from './components/AfroDoodlesOverlay';
import { designImages, brandImages } from 'virtual:showcase-images';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('niux-theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('niux-theme', theme);
    } catch {}
  }, [theme]);

  const previewSection =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('preview')
      : null;

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryTheme = params.get('theme');
      if (queryTheme) setTheme(queryTheme);
    } catch {}
  }, []);

  return (
    <div className="app-wrapper">
      <AfroDoodlesOverlay theme={theme} />
      <a className="skip-link" href="#works">
        Skip to selected work
      </a>

      <header className="header grid-layout">
        <a className="wordmark" href="#home">
          king of
          <br />
          intelligence<span className="brand-dot">®</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#works">Work</a>
          <a href="#case-studies">Case Studies</a>
          <a href="#about">About</a>
          <a href="#contact">
            Contact <ArrowUpRight size={15} />
          </a>
        </nav>
        <button
          className="theme-toggle glass"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
        >
          <Sun size={17} />
          <span className="toggle-track">
            <span />
          </span>
          <Moon size={17} />
        </button>
      </header>

      <main>
        {(!previewSection || previewSection === 'home') && (
          <motion.section
            id="home"
            className="hero grid-layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-top">
              <span>Independent designer &amp; systems thinker</span>
              <span className="availability">
                <i /> Open to conversations
              </span>
            </div>

            <h1>
              <span>Human.</span>
              <span className="hero-line">
                By design<span className="period">.</span>
              </span>
            </h1>

            <div className="hero-bottom">
              <span className="hero-signature">
                Nwaeze David
                <br />
                <span>The King of Intelligence</span>
              </span>
              <p>
                Designing clarity in a complex world.
                <br />
                Bold identities. Thoughtful interfaces.
                <br />
                Intelligence with a human heartbeat.
              </p>
              <a
                href="#works"
                className="round-link"
                aria-label="Explore selected work"
              >
                <ArrowDown size={28} />
              </a>
            </div>

            <div className="hero-index">
              <span>Design / Technology / Humanity</span>
              <span>Scroll to explore</span>
            </div>
          </motion.section>
        )}

        {(!previewSection || previewSection === 'works') && (
          <ImageShowcase
            id="works"
            title="Selected work."
            description="Thoughtful interfaces and digital experiences. Designed for the human on the other side."
            images={designImages}
          />
        )}

        {(!previewSection || previewSection === 'case-studies') && (
          <CaseStudiesSection />
        )}

        {(!previewSection || previewSection === 'brand') && (
          <ImageShowcase
            id="brand-work"
            title="Graphics & brand."
            description="Visual identities, graphic experiments, and brands with a point of view."
            images={brandImages}
          />
        )}

        {(!previewSection || previewSection === 'about') && (
          <motion.section
            id="about"
            className="about grid-layout"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label">The person behind the pixels</div>
            <h2>
              Curious mind.
              <br />
              Human heart.
              <br />
              African roots.
            </h2>
            <figure>
              <img
                src="/profile/david-1.jpg"
                alt="Nwaeze David"
                loading="lazy"
              />
              <figcaption>Nwaeze David / Designer &amp; founder</figcaption>
            </figure>
            <div className="about-copy">
              <p>
                I’m David. A designer with roots in pharmacy and public health,
                building at the intersection of care, creativity, and intelligent
                systems.
              </p>
              <p>
                That clinical background taught me something you never forget:
                when someone is sick or scared, an interface that makes them
                guess isn't bad taste—it's dangerous.
              </p>
              <p>
                While others chase trendy visual gimmicks, I ask: Can a tired
                doctor read this at 3 AM? Can a mother understand this dosage
                without calling customer care? Does it respect the user's
                dignity?
              </p>
              <p>
                Today, I run Niuxverse Solutions from Lagos, working with
                founders globally across AI, healthcare, and smart physical
                hardware.
              </p>
              <p>
                When I'm not designing, I'm deep into public health research,
                music, and building tools that make human life calmer and
                simpler.
              </p>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/david-nwaeze"
                target="_blank"
                rel="noreferrer"
              >
                Meet me on LinkedIn <ArrowUpRight size={20} />
              </a>
            </div>
            <div className="disciplines">
              <span>Product design</span>
              <span>AI experiences</span>
              <span>Design systems</span>
              <span>Healthcare empathy</span>
            </div>
          </motion.section>
        )}

        {(!previewSection || previewSection === 'philosophy') && (
          <motion.section
            className="philosophy grid-layout"
            id="philosophy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">The Niuxverse</span>
            <h2>
              Technology moves.
              <br />
              People give it
              <br />
              direction.
            </h2>
            <p>
              Building the Niuxverse: a universe of tools, experiences, and
              systems where technology amplifies human agency instead of
              replacing it.
            </p>
            <div className="principles">
              <div>
                <h3>Make it clear.</h3>
                <p>Turn complexity into interfaces people understand.</p>
              </div>
              <div>
                <h3>Make it human.</h3>
                <p>Build with care, trust, and human agency at the centre.</p>
              </div>
              <div>
                <h3>Make it matter.</h3>
                <p>Use intelligence to solve real problems and impact lives.</p>
              </div>
            </div>
          </motion.section>
        )}

        {(!previewSection || previewSection === 'contact') && (
          <motion.section
            id="contact"
            className="contact grid-layout"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-top">
              <span>Have something in mind?</span>
              <span>Let’s make it meaningful.</span>
            </div>
            <a
              className="contact-title"
              href="mailto:theniuxversesolutions@gmail.com"
            >
              Let’s create.
              <ArrowUpRight />
            </a>
            <div className="contact-links">
              <a href="mailto:theniuxversesolutions@gmail.com">
                Email David <ArrowUpRight size={18} />
              </a>
              <a
                href="https://wa.me/2348110607341"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp <ArrowUpRight size={18} />
              </a>
              <a
                href="https://www.instagram.com/niuxdesigns"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowUpRight size={18} />
              </a>
              <a
                href="https://x.com/NwaezeDavid5"
                target="_blank"
                rel="noreferrer"
              >
                X / Twitter <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.section>
        )}
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Nwaeze David</span>
        <span>Built with intention.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
