import React from 'react';

interface AfroDoodlesOverlayProps {
  theme: string;
}

export const AfroDoodlesOverlay: React.FC<AfroDoodlesOverlayProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const suffix = isDark ? 'white' : 'black';

  return (
    <div className="afro-doodles-root" aria-hidden="true">
      {/* 1. Subtle tiled Afro doodle pattern watermark across the entire background */}
      <div
        className="afro-pattern-watermark"
        style={{
          backgroundImage: `url('/patterns/afro-scattered-${suffix}.png')`,
        }}
      />

      {/* 2. Scattered individual Afro doodle motifs floating in margins & whitespace */}
      <div className="afro-scattered-layer">
        {/* Hero: Afro Sun with rays floating in top-right whitespace */}
        <div className="scattered-item doodle-pos-hero-sun">
          <img
            src={`/patterns/afro-sun-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* Hero: Tribal arch / rainbow motif near bottom index */}
        <div className="scattered-item doodle-pos-hero-arch">
          <img
            src={`/patterns/afro-arch-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* Selected Work: Geometric crossed shield motif */}
        <div className="scattered-item doodle-pos-works-shield">
          <img
            src={`/patterns/afro-shield-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* Case Studies: Sacred triangle doodle motif */}
        <div className="scattered-item doodle-pos-case-triangle">
          <img
            src={`/patterns/afro-triangle-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* About Section: Sacred eye motif beside portrait */}
        <div className="scattered-item doodle-pos-about-eye">
          <img
            src={`/patterns/afro-eye-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* Graphics & Brand: Concentric ring motif */}
        <div className="scattered-item doodle-pos-brand-ring">
          <img
            src={`/patterns/afro-ring-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>

        {/* Philosophy / Niuxverse: Botanic leaf motif */}
        <div className="scattered-item doodle-pos-philosophy-leaf">
          <img
            src={`/patterns/afro-leaf-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </div>
      </div>
    </div>
  );
};
