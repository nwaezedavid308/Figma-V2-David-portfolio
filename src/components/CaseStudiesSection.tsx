import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Pause, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaItem {
  id: string;
  label: string;
  type: 'video' | 'image';
  src: string;
  caption: string;
}

interface CaseStudyProject {
  id: string;
  number: string;
  shortTitle: string;
  category: string;
  title: string;
  creed: string;
  descriptionParagraphs: string[];
  metrics: string[];
  media: MediaItem[];
}

const CASE_STUDY_PROJECTS: CaseStudyProject[] = [
  {
    id: 'akuba-sneakers',
    number: '01',
    shortTitle: 'Biometric Sneaker',
    category: 'Athletic Telemetry & Footwear Ecosystem',
    title: 'AKUBA — Afro-Themed Smart Biometric Sneaker',
    creed: '“Know Your Body. Know Your Game.” Built in Africa, for the world.',
    descriptionParagraphs: [
      'Most athletic wearables look like sterile hospital gadgets. AKUBA celebrates contemporary African street culture while embedding sub-millimeter biometric pressure sensors directly into the sneaker sole.',
      'I designed the complete product identity, 3D interaction narrative, and direct-to-consumer digital platform—allowing athletes to track force distribution in real time and catch ligament stress before it becomes an injury.',
    ],
    metrics: [
      'Sub-Millimeter Sensor Sole',
      'Live Force Telemetry',
      'Afro-Geometric Aesthetic',
      'DTC Web Platform',
    ],
    media: [
      {
        id: 'sneaker-video',
        label: '3D Biometric Motion',
        type: 'video',
        src: '/USE%20CASES/AKUBA%20SNEAKERS.mp4',
        caption:
          'Dynamic 3D Sneaker Showcase — Afro-geometric lines with embedded athletic telemetry.',
      },
      {
        id: 'sneaker-storefront',
        label: 'Storefront Hero',
        type: 'image',
        src: '/USE%20CASES/MacBook%20Air%20-%203.png',
        caption:
          'DTC Web Experience — Immersive product launch interface celebrating African athletic culture.',
      },
      {
        id: 'sneaker-interactive',
        label: '3D Customizer',
        type: 'image',
        src: '/USE%20CASES/MacBook%20Air%20-%204.png',
        caption:
          'Interactive 3D configurator allowing athletes to inspect sole telemetry and custom finishes.',
      },
      {
        id: 'sneaker-checkout',
        label: 'Specs & Checkout',
        type: 'image',
        src: '/USE%20CASES/MacBook%20Air%20-%205.png',
        caption:
          'Sleek conversion funnel with live size availability, technical specs, and seamless payment.',
      },
    ],
  },
  {
    id: 'akuba-glasses',
    number: '02',
    shortTitle: 'VR/AR Eyewear',
    category: 'Spatial Computing & Optical Hardware',
    title: 'AKUBA — Spatial AR/VR Smart Eyewear',
    creed: '“See the World Through Our Eyes.” Heritage silhouettes meet heads-up intelligence.',
    descriptionParagraphs: [
      'Every major AR headset on the market looks like bulky ski goggles engineered in a Silicon Valley lab. With AKUBA Eyewear, I designed spatial hardware that feels like bespoke luxury eyewear inspired by West African sculpted curves.',
      'Beyond the industrial shell, I designed the spatial operating system: a calm heads-up interface that reduces cognitive clutter. Information whispers only when necessary, keeping the wearer anchored in the real world rather than lost in a digital void.',
    ],
    metrics: [
      'Micro-OLED Waveguide',
      'Spatial OS Interaction',
      'Sculpted Afro Silhouettes',
      'Calm Heads-Up Display',
    ],
    media: [
      {
        id: 'glasses-video',
        label: 'Spatial Hardware Film',
        type: 'video',
        src: '/USE%20CASES/AKUBA%20VR%20AR%20GLASSES/AKUBA%20VR%20GLASS.mp4',
        caption:
          'AKUBA VR/AR Eyewear Hardware Film — Sculpted architectural frames with ambient heads-up optics.',
      },
    ],
  },
  {
    id: 'akuba-wristband',
    number: '03',
    shortTitle: 'Health Wristband',
    category: 'Cardiovascular & Nervous System Wearable',
    title: 'AKUBA — Continuous Health Telemetry Wristband',
    creed: '“Listen Before It Hurts.” Clinical precision you can wear with dignity.',
    descriptionParagraphs: [
      'During my pharmacy training, I watched too many patients brush off silent warning signs until they ended up in the emergency ward. The AKUBA Wristband was born to close that gap—monitoring heart-rate variability, vascular elasticity, and autonomic stress 24/7.',
      'Instead of cheap plastic and shrill flashing alarms that trigger anxiety, we sculpted an anodized bronze-inspired casing with a breathable woven strap. The companion interface translates raw medical waveforms into simple, reassuring human words.',
    ],
    metrics: [
      'Clinical PPG Sensor Array',
      'Autonomic Stress Index',
      'Sculpted Metal Chassis',
      'Zero-Panic Interface',
    ],
    media: [
      {
        id: 'wristband-video',
        label: 'Telemetry Hardware Film',
        type: 'video',
        src: '/USE%20CASES/AKUBA%20WRISTWATCH/AKUBA%20WRISTBAND.mp4',
        caption:
          'AKUBA Continuous Telemetry Wristband — Precision multi-spectral optical sensor array in sculpted bronze chassis.',
      },
    ],
  },
];

export function CaseStudiesSection() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [activeMediaIndices, setActiveMediaIndices] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const currentProject = CASE_STUDY_PROJECTS[projectIndex];
  const currentMediaIndex = activeMediaIndices[currentProject.id] || 0;
  const activeMedia = currentProject.media[currentMediaIndex] || currentProject.media[0];

  // Support direct linking via ?case=sneakers | glasses | wristband
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const caseParam = params.get('case');
      if (caseParam) {
        const found = CASE_STUDY_PROJECTS.findIndex(
          (p) => p.id === caseParam || p.id.includes(caseParam)
        );
        if (found !== -1) setProjectIndex(found);
      }
    } catch {}
  }, []);

  // Reset video play status on project change
  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [projectIndex, currentMediaIndex]);

  const goToProject = (newIndex: number) => {
    if (newIndex === projectIndex) return;
    setSlideDirection(newIndex > projectIndex ? 1 : -1);
    setProjectIndex(newIndex);
  };

  const handlePrev = () => {
    if (projectIndex > 0) {
      goToProject(projectIndex - 1);
    }
  };

  const handleNext = () => {
    if (projectIndex < CASE_STUDY_PROJECTS.length - 1) {
      goToProject(projectIndex + 1);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const openLightbox = () => {
    setLightboxOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    dialogRef.current?.close();
    document.body.style.overflow = '';
  };

  return (
    <motion.section
      id="case-studies"
      className="case-studies grid-layout"
      aria-labelledby="case-studies-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="section-label">Selected Deep Dives</div>

      {/* Heading & Intro */}
      <div className="case-studies-heading">
        <h2 id="case-studies-heading">
          My case study
          <br />
          projects<span className="period">.</span>
        </h2>
        <p>
          End-to-end design across physical smart hardware, clinical AI systems, and digital
          platforms. Designed with cultural gravity and human clarity.
        </p>
      </div>

      {/* Horizontal Carousel Header Controls */}
      <div className="case-studies-carousel-controls">
        {/* Project Selector Pills */}
        <div className="case-study-pills" role="tablist" aria-label="Case Study Products">
          {CASE_STUDY_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              role="tab"
              aria-selected={projectIndex === idx}
              className={`case-study-pill-btn ${projectIndex === idx ? 'is-active' : ''}`}
              onClick={() => goToProject(idx)}
            >
              <span className="pill-num">{proj.number}</span>
              <span className="pill-title">{proj.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Carousel Arrow Controls & Indicator */}
        <div className="case-studies-arrows">
          <button
            onClick={handlePrev}
            disabled={projectIndex === 0}
            className="carousel-arrow-btn glass"
            aria-label="Previous case study project"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="case-studies-counter" aria-live="polite">
            {String(projectIndex + 1).padStart(2, '0')} /{' '}
            {String(CASE_STUDY_PROJECTS.length).padStart(2, '0')}
          </span>
          <button
            onClick={handleNext}
            disabled={projectIndex === CASE_STUDY_PROJECTS.length - 1}
            className="carousel-arrow-btn glass"
            aria-label="Next case study project"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Animated Horizontal Carousel Stage */}
      <div className="case-study-carousel-stage">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.article
            key={currentProject.id}
            className="case-study-feature"
            aria-label={`${currentProject.title} Case Study`}
            custom={slideDirection}
            initial={{
              opacity: 0,
              x: slideDirection > 0 ? 40 : slideDirection < 0 ? -40 : 0,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: slideDirection > 0 ? -40 : 40,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left Column: Product Video Thumbnail & Gallery */}
            <div className="case-study-media-col">
              <div className="case-study-media-wrapper">
                {activeMedia.type === 'video' ? (
                  <video
                    ref={videoRef}
                    key={activeMedia.src}
                    src={activeMedia.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="case-study-video"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.caption}
                    className="case-study-img"
                    loading="lazy"
                  />
                )}

                <div className="case-study-media-overlay">
                  <span className="badge glass">{activeMedia.label}</span>
                  <div className="overlay-actions">
                    {activeMedia.type === 'video' && (
                      <button
                        onClick={togglePlay}
                        className="icon-btn glass"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                    <button
                      onClick={openLightbox}
                      className="icon-btn glass"
                      aria-label="Expand media"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Sub-Tabs (if project has multiple angles) */}
              {currentProject.media.length > 1 && (
                <div
                  className="case-study-media-tabs"
                  role="tablist"
                  aria-label={`${currentProject.shortTitle} gallery tabs`}
                >
                  {currentProject.media.map((item, idx) => (
                    <button
                      key={item.id}
                      role="tab"
                      aria-selected={currentMediaIndex === idx}
                      className={`media-tab-btn ${currentMediaIndex === idx ? 'is-active' : ''}`}
                      onClick={() => {
                        setActiveMediaIndices((prev) => ({
                          ...prev,
                          [currentProject.id]: idx,
                        }));
                        if (item.type === 'video') setIsPlaying(true);
                      }}
                    >
                      {item.type === 'video' ? '▶ ' : ''}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Narrative Copy & Hardware Metrics */}
            <div className="case-study-info-col">
              <div>
                <span className="case-study-tag">{currentProject.category}</span>
                <h3 className="case-study-title">{currentProject.title}</h3>
                <p className="case-study-creed">{currentProject.creed}</p>

                <div className="case-study-body">
                  {currentProject.descriptionParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="case-study-footer">
                <div className="case-study-metrics">
                  {currentProject.metrics.map((metric) => (
                    <span key={metric} className="case-study-metric-chip">
                      {metric}
                    </span>
                  ))}
                </div>

                <a className="text-link" href="#contact">
                  Discuss this hardware <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <dialog
        ref={dialogRef}
        className="case-study-dialog"
        onCancel={closeLightbox}
        onClose={closeLightbox}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
        aria-label={`${currentProject.shortTitle} Media Viewer`}
      >
        <div className="dialog-inner">
          <button
            className="dialog-close glass"
            onClick={closeLightbox}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
          {activeMedia.type === 'video' ? (
            <video
              src={activeMedia.src}
              autoPlay
              controls
              loop
              playsInline
              className="dialog-media"
            />
          ) : (
            <img
              src={activeMedia.src}
              alt={activeMedia.caption}
              className="dialog-media"
            />
          )}
          <div className="dialog-caption">
            <h4>{activeMedia.label}</h4>
            <p>{activeMedia.caption}</p>
          </div>
        </div>
      </dialog>
    </motion.section>
  );
}
