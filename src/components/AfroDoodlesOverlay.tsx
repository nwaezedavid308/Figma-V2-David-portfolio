import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface AfroDoodlesOverlayProps {
  theme: string;
}

export const AfroDoodlesOverlay: React.FC<AfroDoodlesOverlayProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const suffix = isDark ? 'white' : 'black';

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { damping: 25, stiffness: 100 });

  // Parallax scroll displacements
  const bgY = useTransform(smoothY, [0, 4000], [0, -220]);
  const pSun = useTransform(smoothY, [0, 3000], [0, 140]);
  const pArch = useTransform(smoothY, [0, 3000], [0, -110]);
  const pShield = useTransform(smoothY, [0, 3000], [0, 130]);
  const pTriangle = useTransform(smoothY, [0, 3000], [0, -125]);
  const pEye = useTransform(smoothY, [0, 3000], [0, 115]);
  const pRing = useTransform(smoothY, [0, 3000], [0, -95]);
  const pLeaf = useTransform(smoothY, [0, 3000], [0, 135]);
  const pTopLeft = useTransform(smoothY, [0, 3000], [0, -80]);

  return (
    <div className="afro-doodles-root" aria-hidden="true">
      {/* 1. Subtle seamless Afro doodle watermark across the entire website */}
      <motion.div
        className="afro-pattern-watermark"
        style={{
          backgroundImage: `url('/patterns/afro-scattered-${suffix}.png')`,
          y: bgY,
        }}
      />

      {/* 2. Scattered floating Afro doodle motifs with parallax & organic motion */}
      <div className="afro-scattered-layer">
        {/* Top-Right: Afro Sun Motif */}
        <motion.div
          className="scattered-item doodle-motif-top-right float-anim-1"
          style={{ y: pSun }}
        >
          <img
            src={`/patterns/afro-sun-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Top-Left: Subtle Geometric Arch */}
        <motion.div
          className="scattered-item doodle-motif-top-left float-anim-2"
          style={{ y: pTopLeft }}
        >
          <img
            src={`/patterns/afro-arch-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Upper-Middle Left: Sacred Triangle */}
        <motion.div
          className="scattered-item doodle-motif-mid-left float-anim-3"
          style={{ y: pTriangle }}
        >
          <img
            src={`/patterns/afro-triangle-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Upper-Middle Right: Crossed Tribal Shield */}
        <motion.div
          className="scattered-item doodle-motif-mid-right float-anim-1"
          style={{ y: pShield }}
        >
          <img
            src={`/patterns/afro-shield-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Center-Left: Sacred Eye */}
        <motion.div
          className="scattered-item doodle-motif-center-left float-anim-2"
          style={{ y: pEye }}
        >
          <img
            src={`/patterns/afro-eye-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Lower-Middle Right: Concentric Cosmic Rings */}
        <motion.div
          className="scattered-item doodle-motif-lower-right float-anim-3"
          style={{ y: pRing }}
        >
          <img
            src={`/patterns/afro-ring-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Bottom-Left: Botanic Leaf Motif */}
        <motion.div
          className="scattered-item doodle-motif-bottom-left float-anim-1"
          style={{ y: pLeaf }}
        >
          <img
            src={`/patterns/afro-leaf-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>

        {/* Bottom-Right: Grounding Sacred Arch */}
        <motion.div
          className="scattered-item doodle-motif-bottom-right float-anim-2"
          style={{ y: pArch }}
        >
          <img
            src={`/patterns/afro-arch-${suffix}.png`}
            alt=""
            className="doodle-img"
          />
        </motion.div>
      </div>
    </div>
  );
};
