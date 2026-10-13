import { useState, useRef } from 'react';
import { ArrowUpRight, Play, Pause, Maximize2, X } from 'lucide-react';

interface MediaItem {
  id: string;
  label: string;
  type: 'video' | 'image';
  src: string;
  caption: string;
}

const AKUBA_MEDIA: MediaItem[] = [
  {
    id: 'video',
    label: '3D Biometric Motion',
    type: 'video',
    src: '/USE CASES/AKUBA SNEAKERS.mp4',
    caption: 'Dynamic 3D Sneaker Showcase — Afro-geometric lines with embedded athletic telemetry.',
  },
  {
    id: 'storefront',
    label: 'Storefront Hero',
    type: 'image',
    src: '/USE CASES/MacBook Air - 3.png',
    caption: 'DTC Web Experience — Immersive product launch interface celebrating African athletic culture.',
  },
  {
    id: 'interactive',
    label: '3D Customizer',
    type: 'image',
    src: '/USE CASES/MacBook Air - 4.png',
    caption: 'Interactive 3D configurator allowing athletes to inspect sole telemetry and custom finishes.',
  },
  {
    id: 'checkout',
    label: 'Specs & Checkout',
    type: 'image',
    src: '/USE CASES/MacBook Air - 5.png',
    caption: 'Sleek conversion funnel with live size availability, technical specs, and seamless payment.',
  },
];

export function CaseStudiesSection() {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const activeMedia = AKUBA_MEDIA[activeMediaIndex];

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
    <section id="case-studies" className="case-studies grid-layout" aria-labelledby="case-studies-heading">
      <div className="section-label">Selected Deep Dives</div>
      
      <div className="case-studies-heading">
        <h2 id="case-studies-heading">
          My case study<br />projects<span className="period">.</span>
        </h2>
        <p>
          End-to-end design across physical smart hardware, clinical AI systems, and digital platforms. Designed with cultural gravity and human clarity.
        </p>
      </div>

      <article className="case-study-feature" aria-label="AKUBA Smart Wearable Case Study">
        <div className="case-study-media-col">
          <div className="case-study-media-wrapper">
            {activeMedia.type === 'video' ? (
              <video
                ref={videoRef}
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

          <div className="case-study-media-tabs" role="tablist" aria-label="AKUBA media gallery tabs">
            {AKUBA_MEDIA.map((item, idx) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeMediaIndex === idx}
                className={`media-tab-btn ${activeMediaIndex === idx ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveMediaIndex(idx);
                  if (item.type === 'video') setIsPlaying(true);
                }}
              >
                {item.type === 'video' ? '▶ ' : ''}{item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="case-study-info-col">
          <div>
            <span className="case-study-tag">Smart Wearable &amp; Hardware Ecosystem</span>
            <h3 className="case-study-title">AKUBA — Afro-Themed Smart Biometric Sneaker</h3>
            <p className="case-study-creed">“Know Your Body. Know Your Game.” Built in Africa, for the world.</p>

            <div className="case-study-body">
              <p>
                Most athletic wearables look like sterile medical gadgets. AKUBA celebrates contemporary African street culture while embedding sub-millimeter biometric pressure sensors directly into the sneaker sole.
              </p>
              <p>
                I designed the complete product identity, 3D interaction narrative, and direct-to-consumer e-commerce platform—allowing athletes to track force distribution in real time and prevent ligament injuries before they happen.
              </p>
            </div>
          </div>

          <div className="case-study-footer">
            <div className="case-study-metrics">
              <span className="case-study-metric-chip">Sub-Millimeter Sensor Sole</span>
              <span className="case-study-metric-chip">Live Force Telemetry</span>
              <span className="case-study-metric-chip">Afro-Geometric Aesthetic</span>
              <span className="case-study-metric-chip">DTC Web Platform</span>
            </div>

            <a className="text-link" href="#contact">
              Discuss this project <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </article>

      {/* Lightbox Modal */}
      <dialog
        ref={dialogRef}
        className="case-study-dialog"
        onCancel={closeLightbox}
        onClose={closeLightbox}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
        aria-label="AKUBA Media Viewer"
      >
        <div className="dialog-inner">
          <button className="dialog-close glass" onClick={closeLightbox} aria-label="Close dialog">
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
    </section>
  );
}
