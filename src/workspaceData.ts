import { designImages, brandImages } from 'virtual:showcase-images';

export type CaseVideo = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  role: string;
  image: string;
  previewVideo?: string;
  videos?: CaseVideo[];
  images: string[];
  color: string;
  tags: string[];
  decisions: string[];
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IntroFrame = {
  id: string;
  number: string;
  title: string;
  headlineBold: string;
  headlineMuted: string;
  categoryLeft: string;
  metaCenter: string;
  metaRight: string;
  image?: string;
  isHero?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

const preview = (name: string) => '/showcase-previews/' + encodeURIComponent(name + '.webp');

export const FRAME_WIDTH = 1120;
export const FRAME_HEIGHT = 580;
export const FRAME_GAP = 70;

export const introFrames: IntroFrame[] = [
  {
    id: 'intro-1',
    number: '01',
    title: 'Identity',
    headlineBold: 'My name is King David Nwaeze.',
    headlineMuted: 'Human-centred AI designer & systems architect.',
    categoryLeft: 'The Designer',
    metaCenter: 'David Nwaeze\nNiuxverse Solutions',
    metaRight: 'Selected Portfolio\n2026 Edition',
    x: 60,
    y: 60,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  },
  {
    id: 'intro-2',
    number: '02',
    title: 'Craft & AI',
    headlineBold: 'I take powerful technologies like AI and turn them into clean, friendly digital products.',
    headlineMuted: 'Solving real, everyday problems through thoughtful, intuitive interaction design.',
    categoryLeft: 'Core Mission',
    metaCenter: 'Machine Intelligence\nHuman Interface',
    metaRight: 'Practical Solutions\nEveryday Problems',
    x: 60,
    y: 60 + (FRAME_HEIGHT + FRAME_GAP) * 1,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  },
  {
    id: 'intro-3',
    number: '03',
    title: 'The Standard',
    headlineBold: 'Technology should feel as natural, safe, and helpful.',
    headlineMuted: 'Designed around human intuition, emotional ease, and transparent user control.',
    categoryLeft: 'Design Standard',
    metaCenter: 'Clarity & Safety\nCalm Computing',
    metaRight: 'Cognitive Comfort\nZero Dark Patterns',
    x: 60,
    y: 60 + (FRAME_HEIGHT + FRAME_GAP) * 2,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  },
  {
    id: 'intro-4',
    number: '04',
    title: 'True Intelligence',
    headlineBold: 'True intelligence is not about algorithmic speed.',
    headlineMuted: 'It is about empathy, clear thinking, and tools that protect and enhance human capabilities.',
    categoryLeft: 'Philosophy',
    metaCenter: 'Empathy & Thinking\nHealthcare Science',
    metaRight: 'Human Agency\nProtection & Dignity',
    x: 60,
    y: 60 + (FRAME_HEIGHT + FRAME_GAP) * 3,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  },
  {
    id: 'intro-5',
    number: '05',
    title: 'Connect',
    headlineBold: 'Let’s create something meaningful.',
    headlineMuted: 'Available for product design jobs, speaking, and consultation.',
    categoryLeft: 'Get in Touch',
    metaCenter: 'theniuxversesolutions@gmail.com\nLagos / Worldwide',
    metaRight: 'Full-time Roles\nSpeaking & Advisory',
    x: 60,
    y: 60 + (FRAME_HEIGHT + FRAME_GAP) * 4,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  },
  {
    id: 'intro-6',
    number: '06',
    title: 'About Me',
    headlineBold: 'King David Nwaeze',
    headlineMuted: 'Human-centred AI designer & systems architect bridging clinical empathy with intelligent products.',
    categoryLeft: 'About Me · Hero',
    metaCenter: 'Niuxverse Solutions\nFounder & Principal',
    metaRight: 'Lagos / Worldwide\nOpen for Roles & Advisory',
    image: '/profile/david-1.jpg',
    isHero: true,
    x: 60,
    y: 60 + (FRAME_HEIGHT + FRAME_GAP) * 5,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  }
];

// Bento Grid layout below Frames 1-6
export const WORKS_START_Y = 60 + (FRAME_HEIGHT + FRAME_GAP) * 6 + 40;
const BENTO_COL_W = 535;
const BENTO_COL_GAP = 50;
const BENTO_ROW_H = 410;
const BENTO_ROW_GAP = 40;

export const projects: Project[] = [
  {
    id: 'octoserve',
    number: '07',
    title: 'OctoServe',
    category: 'Mobile Applications',
    summary: 'Everyday services, thoughtfully connected. Mobile interfaces for ordering, delivery, and real-time logistics.',
    role: 'Lead Interface Design',
    image: preview('1 (1).png'),
    images: ['1 (1).png', '10.png', '11.png'].map(preview),
    color: '#f0ecfa',
    tags: ['Mobile UI', 'Service Design', 'Product Design'],
    decisions: [
      'A shared visual language across service screens.',
      'Clear ordering states, navigation, and live tracking.',
      'Consistent components for an approachable mobile experience.'
    ],
    x: 60,
    y: WORKS_START_Y,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  },
  {
    id: 'ai-foundation',
    number: '08',
    title: 'AI Empowerment Foundation',
    category: 'Intelligent Systems',
    summary: 'An educational web platform demystifying artificial intelligence literacy and structured learning pathways.',
    role: 'Website Interface Design',
    image: preview('screencapture-ai-empowerment-foundation-6f21qe5yk-vercel-app-2026-05-16-21_15_55.png'),
    images: ['/PORFOLIO%20DESIGNS/screencapture-ai-empowerment-foundation-6f21qe5yk-vercel-app-2026-05-16-21_15_55.png'],
    color: '#e6eef7',
    tags: ['Web Design', 'AI Education', 'Information Architecture'],
    decisions: [
      'Accessible information architecture for students and leaders.',
      'Clear programme structures, curriculum modules, and navigation.',
      'A calm, consistent visual design language.'
    ],
    x: 60 + BENTO_COL_W + BENTO_COL_GAP,
    y: WORKS_START_Y,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  },
  {
    id: 'akuba',
    number: '09',
    title: 'AKUBA Smart Wear',
    category: 'Product Design',
    summary: 'African identity meets future-facing footwear, AR eyewear, and biometric wristwear in an immersive spatial product experience.',
    role: 'Product Identity & Experience',
    image: '/USE%20CASES/MacBook%20Air%20-%203.png',
    previewVideo: '/USE%20CASES/AKUBA%20SNEAKERS.mp4',
    videos: [
      {
        id: 'sneakers',
        title: 'AKUBA Kinetic Sneakers',
        subtitle: 'Dynamic Footwear & Adaptive Fit',
        src: '/USE%20CASES/AKUBA%20SNEAKERS.mp4'
      },
      {
        id: 'glasses',
        title: 'AKUBA AR/VR Eyewear',
        subtitle: 'Spatial Interface & Cultural Geometry',
        src: '/USE%20CASES/AKUBA%20VR%20AR%20GLASSES/AKUBA%20VR%20GLASS.mp4'
      },
      {
        id: 'wristwatch',
        title: 'AKUBA Biometric Wristband',
        subtitle: 'Haptic Telemetry & Seamless Pairing',
        src: '/USE%20CASES/AKUBA%20WRISTWATCH/AKUBA%20WRISTBAND.mp4'
      }
    ],
    images: [3, 4, 5].map(n => `/USE%20CASES/MacBook%20Air%20-%20${n}.png`),
    color: '#f5ebe2',
    tags: ['Product Design', 'Spatial Computing', 'African Identity', 'Wearables'],
    decisions: [
      'Connecting spatial 3D product motion with seamless checkout flow.',
      'Highlighting African geometric heritage, biomaterials, and ergonomic form.',
      'Synchronized telemetry across sneakers, eyewear, and wristwear.'
    ],
    x: 60,
    y: WORKS_START_Y + (BENTO_ROW_H + BENTO_ROW_GAP) * 1,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  },
  {
    id: 'dev-design',
    number: '10',
    title: 'Dev & Design Labs',
    category: 'Web Design',
    summary: 'An expressive digital playground at the intersection of design systems, typography, and code.',
    role: 'Web & Visual Design',
    image: preview('DEV AND DESIGN LABS (11).jpg'),
    images: ['DEV AND DESIGN LABS (11).jpg', 'DEV AND DESIGN LABS (2).jpg', 'DEV AND DESIGN LABS (3).jpg'].map(preview),
    color: '#e7f0eb',
    tags: ['Web Design', 'Visual Identity', 'Design Systems'],
    decisions: [
      'Strong typography establishes visual hierarchy.',
      'Kinetic artboards and interactive layout components.',
      'A distinctive visual voice bridging engineering and design.'
    ],
    x: 60 + BENTO_COL_W + BENTO_COL_GAP,
    y: WORKS_START_Y + (BENTO_ROW_H + BENTO_ROW_GAP) * 1,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  },
  {
    id: 'brand',
    number: '11',
    title: 'Visual Explorations',
    category: 'Branding & Visual',
    summary: 'Graphic design, typography, and identity experiments exploring rhythm and storytelling.',
    role: 'Graphic & Brand Design',
    image: brandImages[0]?.preview || brandImages[0]?.src || preview('Frame 2147227873.png'),
    images: brandImages.slice(0, 6).map(i => i.preview || i.src),
    color: '#f6ebef',
    tags: ['Branding', 'Graphic Design', 'Visual Identity'],
    decisions: [
      'Exploration of composition, color harmony, and visual storytelling.',
      'Distinctive typographic treatment and memorable brand marks.'
    ],
    x: 60,
    y: WORKS_START_Y + (BENTO_ROW_H + BENTO_ROW_GAP) * 2,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  },
  {
    id: 'experiments',
    number: '12',
    title: 'Interface Playground',
    category: 'Experiments',
    summary: 'A closer look at interactive components, token hierarchies, and micro-motion studies.',
    role: 'Interface Exploration',
    image: preview('Homepage.png'),
    images: designImages.slice(0, 8).map(i => i.preview || i.src),
    color: '#edf0e7',
    tags: ['UI Design', 'Micro-Interactions', 'Layout Systems'],
    decisions: [
      'Testing different modes of organizing dense information.',
      'Exploring tactile micro-animations and responsive geometry.'
    ],
    x: 60 + BENTO_COL_W + BENTO_COL_GAP,
    y: WORKS_START_Y + (BENTO_ROW_H + BENTO_ROW_GAP) * 2,
    width: BENTO_COL_W,
    height: BENTO_ROW_H
  }
];

export const TOTAL_CANVAS_WIDTH = 1240;
export const TOTAL_CANVAS_HEIGHT = WORKS_START_Y + (BENTO_ROW_H + BENTO_ROW_GAP) * 3 + 120;

export const categories = [
  'Overview',
  'Intro Frames',
  'Selected Works',
  'Mobile applications',
  'Intelligent systems',
  'Product design',
  'Web design',
  'About & experience'
];

export const bio = 'I am King David Nwaeze, a human-centred product designer with a background in healthcare and public health science. Founder of Niuxverse Solutions, I explore how thoughtful design, care ethics, and machine intelligence come together to solve meaningful human problems.';

export const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
