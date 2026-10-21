import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Frame,
  Hand,
  Layers,
  LayoutGrid,
  Mail,
  Maximize,
  Menu,
  Minus,
  Moon,
  MousePointer2,
  PanelLeftClose,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Send,
  X
} from 'lucide-react';
import {
  projects,
  introFrames,
  categories,
  bio,
  read,
  save,
  FRAME_WIDTH,
  FRAME_HEIGHT,
  TOTAL_CANVAS_WIDTH,
  TOTAL_CANVAS_HEIGHT,
  WORKS_START_Y,
  type Project,
  type IntroFrame
} from './workspaceData';
import './workspace.css';

export default function Workspace() {
  const [theme, setTheme] = useState(() => read('niux-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [category, setCategory] = useState('Overview');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>('intro-1');
  const [layersOpen, setLayersOpen] = useState(window.innerWidth > 760);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [presentation, setPresentation] = useState(false);
  const [tool, setTool] = useState<'select' | 'hand'>('select');
  const [zoom, setZoom] = useState(0.68);
  const [pan, setPan] = useState({ x: 60, y: 40 });

  // AI Assistant state (Right Panel)
  const [assistant, setAssistant] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello, I am King of Intelligence assistant. Ask me anything about David’s design background, clinical healthcare empathy, the AKUBA spatial project, OctoServe, or his availability for design roles.'
    }
  ]);
  const [question, setQuestion] = useState('');

  // Sequential Walkthrough Sequence: 5 intro manifesto frames
  const allWalkthroughItems = introFrames.slice(0, 5);

  // Snappy, engaging animation timing (~3.0 seconds per frame at 40ms interval)
  const TICKS_PER_FRAME = 75;
  const [guide, setGuide] = useState(true);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [modal, setModal] = useState<Project | 'about' | 'contact' | 'engage' | null>(null);
  const [notice, setNotice] = useState('');

  // Video playback & sound controls for case studies (e.g. AKUBA)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [allVideosPlaying, setAllVideosPlaying] = useState(true);
  const [allVideosSound, setAllVideosSound] = useState(true);
  const [singlePlaying, setSinglePlaying] = useState<Record<number, boolean>>({});
  const [singleSound, setSingleSound] = useState<Record<number, boolean>>({});

  const canvas = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Active item in walkthrough
  const currentStepIdx = Math.min(allWalkthroughItems.length - 1, Math.max(0, Math.floor(tick / TICKS_PER_FRAME)));
  const currentStepTick = tick % TICKS_PER_FRAME;
  const activeItem = allWalkthroughItems[currentStepIdx] || allWalkthroughItems[0];

  // Draw perimeter animation for the active frame (1120 x 580 = perimeter 3400)
  const drawProgress = Math.min(1, currentStepTick / 20);
  const drawDistance = drawProgress * 3400;
  const fx = activeItem.x;
  const fy = activeItem.y;
  const fw = activeItem.width;
  const fh = activeItem.height;

  const cursorDraw = drawDistance < fw
    ? { x: fx + drawDistance, y: fy }
    : drawDistance < fw + fh
      ? { x: fx + fw, y: fy + (drawDistance - fw) }
      : drawDistance < 2 * fw + fh
        ? { x: fx + fw - (drawDistance - (fw + fh)), y: fy + fh }
        : { x: fx, y: fy + fh - (drawDistance - (2 * fw + fh)) };

  // Typing effect characters count (begins after outline is drawn at tick 18)
  const typedCount = Math.max(0, Math.floor((currentStepTick - 18) * 2.2));
  const fullHeadline = activeItem.headlineBold || activeItem.title;
  const typedHeadline = guide ? fullHeadline.slice(0, typedCount) : fullHeadline;
  const isTypingActive = guide && currentStepTick >= 18 && typedCount < fullHeadline.length;

  const project = projects.find(p => p.id === selected);
  const introSelected = introFrames.find(f => f.id === selected);

  const filtered = projects.filter(p =>
    (category === 'Overview' ||
      category === 'Intro Frames' ||
      category === 'Selected Works' ||
      category === 'About & experience' ||
      category === 'All' ||
      p.category === category ||
      p.tags.some(t => t.toLowerCase() === category.toLowerCase())) &&
    `${p.title} ${p.summary} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  );

  const stop = () => {
    setGuide(false);
  };

  const fit = () => {
    const w = canvas.current?.clientWidth || window.innerWidth;
    const h = canvas.current?.clientHeight || window.innerHeight;
    const z = Math.max(0.2, Math.min(0.75, (w - 100) / FRAME_WIDTH, (h - 100) / (FRAME_HEIGHT * 1.5)));
    setZoom(z);
    setPan({
      x: (w - FRAME_WIDTH * z) / 2 - 60 * z,
      y: 40
    });
  };

  const focus = (id: string) => {
    stop();
    setSelected(id);
    if (window.innerWidth <= 760) {
      setLayersOpen(false);
      setToolsOpen(false);
      document.getElementById('frame-' + id)?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start'
      });
      return;
    }

    const w = canvas.current?.clientWidth || window.innerWidth;
    const h = canvas.current?.clientHeight || window.innerHeight;
    const item = introFrames.find(f => f.id === id) || projects.find(p => p.id === id) || introFrames[0];
    const z = Math.min(0.8, (w - 100) / item.width, (h - 80) / item.height);

    setZoom(z);
    setPan({
      x: (w - item.width * z) / 2 - item.x * z,
      y: (h - item.height * z) / 2 - item.y * z
    });
  };

  const focusWorks = () => {
    stop();
    if (window.innerWidth <= 760) {
      document.getElementById('frame-gallery-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const w = canvas.current?.clientWidth || window.innerWidth;
    const h = canvas.current?.clientHeight || window.innerHeight;
    const z = 0.65;
    setZoom(z);
    setPan({
      x: (w - FRAME_WIDTH * z) / 2 - 60 * z,
      y: (h - 550 * z) / 2 - (WORKS_START_Y - 90) * z
    });
    setSelected('octoserve');
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('niux-theme', theme);
  }, [theme]);

  // Always auto-start animation on fresh load or page refresh
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGuide(false);
      return;
    }
    setGuide(true);
    setTick(0);
    setPaused(false);
    setSelected('intro-1');
  }, []);

  // Initial responsive zoom & vertical alignment
  useEffect(() => {
    if (window.innerWidth > 760) {
      const w = canvas.current?.clientWidth || window.innerWidth;
      const h = canvas.current?.clientHeight || window.innerHeight;
      const z = Math.min(0.72, (w - 120) / FRAME_WIDTH, (h - 100) / FRAME_HEIGHT);
      setZoom(z);
      setPan({
        x: (w - FRAME_WIDTH * z) / 2 - 60 * z,
        y: 40
      });
    }
  }, []);

  // Prevent browser zoom capture
  useEffect(() => {
    const el = canvas.current;
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    el?.addEventListener('wheel', preventBrowserZoom, { passive: false });
    return () => el?.removeEventListener('wheel', preventBrowserZoom);
  }, []);

  // Notice toast timer
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Animation frame interval (40ms ticks)
  useEffect(() => {
    if (!guide || paused) return;
    const timer = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(timer);
  }, [guide, paused]);

  // Pan canvas camera smoothly to the active frame (Frames 1 to 5)
  useEffect(() => {
    if (!guide) return;
    setSelected(activeItem.id);
    if (window.innerWidth > 760) {
      const w = canvas.current?.clientWidth || window.innerWidth;
      const h = canvas.current?.clientHeight || window.innerHeight;
      const targetX = (w - activeItem.width * zoom) / 2 - activeItem.x * zoom;
      const targetY = (h - activeItem.height * zoom) / 2 - activeItem.y * zoom;
      setPan({ x: targetX, y: targetY });
    } else {
      const frameEl = document.getElementById('frame-' + activeItem.id);
      frameEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStepIdx, guide]);

  // End of sequential walkthrough after 5th frame: camera glides down to introduce Works Section page, then stops
  useEffect(() => {
    if (tick >= TICKS_PER_FRAME * 5 && guide) {
      setGuide(false);
      focusWorks();
      setNotice('Introduction complete. Explore David’s Selected Works gallery below.');
    }
  }, [tick, guide]);

  // Modal dialog synchronization
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);

  // Video Autoplay & Sound synchronization for case study
  useEffect(() => {
    if (modal && typeof modal === 'object' && modal.videos) {
      setAllVideosPlaying(true);
      setAllVideosSound(true);
      const timer = setTimeout(() => {
        videoRefs.current.forEach((v, i) => {
          if (v) {
            v.currentTime = 0;
            v.muted = false;
            v.play().catch(() => {
              // Fallback to muted autoPlay if browser blocks unmuted audio without gesture
              v.muted = true;
              v.play().catch(() => {});
              setAllVideosSound(false);
            });
          }
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  const toggleAllVideosPlay = () => {
    const next = !allVideosPlaying;
    setAllVideosPlaying(next);
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (next) v.play().catch(() => {});
        else v.pause();
      }
      setSinglePlaying(prev => ({ ...prev, [i]: next }));
    });
  };

  const toggleAllVideosMute = () => {
    const next = !allVideosSound;
    setAllVideosSound(next);
    videoRefs.current.forEach((v, i) => {
      if (v) v.muted = !next;
      setSingleSound(prev => ({ ...prev, [i]: next }));
    });
  };

  const toggleSingleVideoPlay = (idx: number) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    const isPlaying = singlePlaying[idx] !== undefined ? singlePlaying[idx] : !v.paused;
    if (isPlaying) {
      v.pause();
      setSinglePlaying(prev => ({ ...prev, [idx]: false }));
    } else {
      v.play().catch(() => {});
      setSinglePlaying(prev => ({ ...prev, [idx]: true }));
    }
  };

  const toggleSingleVideoMute = (idx: number) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    const isSoundOn = singleSound[idx] !== undefined ? singleSound[idx] : !v.muted;
    v.muted = isSoundOn;
    setSingleSound(prev => ({ ...prev, [idx]: !isSoundOn }));
  };

  // Deep links for projects
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(location.search).get('project');
      const p = projects.find(item => item.id === id);
      if (p) {
        setSelected(p.id);
        setModal(p);
        setGuide(false);
      } else {
        setModal(null);
      }
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches('input, textarea, select') || (e.target as HTMLElement).closest('.guide-bar') || modal) return;
      if (e.key !== 'Tab') stop();
      if (e.key === 'Escape') {
        stop();
        setPresentation(false);
        setToolsOpen(false);
        setLayersOpen(false);
      }
      if (e.key.toLowerCase() === 'v') { stop(); setTool('select'); }
      if (e.key.toLowerCase() === 'h') { stop(); setTool('hand'); }
      if (e.key === '+' || e.key === '=') { stop(); setZoom(z => Math.min(1.4, z + 0.08)); }
      if (e.key === '-') { stop(); setZoom(z => Math.max(0.12, z - 0.08)); }
      if (e.key === '0') { stop(); fit(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, filtered.length]);

  const openProject = (p: Project) => {
    stop();
    setModal(p);
    const url = new URL(location.href);
    url.searchParams.set('project', p.id);
    history.pushState({}, '', url);
  };

  const closeModal = () => {
    setModal(null);
    videoRefs.current.forEach(v => v?.pause());
    const url = new URL(location.href);
    url.searchParams.delete('project');
    history.replaceState({}, '', url);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setNotice('Portfolio link copied');
    } catch {
      setNotice('Copy the URL from your address bar to share.');
    }
  };

  const replay = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stop();
      setNotice('Reduced motion is active. Canvas is ready.');
      focus('intro-1');
      return;
    }
    setTick(0);
    setPaused(false);
    setCategory('Overview');
    setQuery('');
    setSelected('intro-1');
    setGuide(true);
    if (window.innerWidth > 760) {
      const w = canvas.current?.clientWidth || window.innerWidth;
      const h = canvas.current?.clientHeight || window.innerHeight;
      const item = introFrames[0];
      const z = Math.min(0.72, (w - 120) / FRAME_WIDTH, (h - 100) / FRAME_HEIGHT);
      setZoom(z);
      setPan({
        x: (w - item.width * z) / 2 - item.x * z,
        y: (h - item.height * z) / 2 - item.y * z
      });
    } else {
      document.getElementById('frame-intro-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const jumpToStep = (idx: number) => {
    setTick(idx * TICKS_PER_FRAME);
    const target = allWalkthroughItems[idx];
    if (!target) return;
    setSelected(target.id);
    if (window.innerWidth <= 760) {
      document.getElementById('frame-' + target.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const w = canvas.current?.clientWidth || window.innerWidth;
      const h = canvas.current?.clientHeight || window.innerHeight;
      const z = zoom;
      setPan({
        x: (w - target.width * z) / 2 - target.x * z,
        y: (h - target.height * z) / 2 - target.y * z
      });
    }
  };

  const ask = (text: string) => {
    if (!text.trim()) return;
    stop();
    setAssistant(true);
    setLayersOpen(true);
    const userText = text.trim();
    setQuestion('');

    let answer = '';
    const lower = userText.toLowerCase();

    const foundProject = projects.find(
      p => lower.includes(p.title.toLowerCase()) || lower.includes(p.id.toLowerCase())
    );

    if (foundProject) {
      setSelected(foundProject.id);
      focus(foundProject.id);
      answer = `${foundProject.title} (${foundProject.category}): ${foundProject.summary} Role: ${foundProject.role}. Documented decisions: ${foundProject.decisions.slice(0, 2).join(' ')}. You can open its case study on canvas to inspect artifacts and interactive media.`;
    } else if (/contact|hire|email|reach|phone|whatsapp|book|engage/.test(lower)) {
      setModal('contact');
      answer = 'I have opened David’s contact channels. You can reach him via email at theniuxversesolutions@gmail.com, WhatsApp (+2348110607341), or LinkedIn.';
    } else if (/who|about|background|experience|david|story|bio|health|care/.test(lower)) {
      focus('intro-6');
      answer = 'King David Nwaeze is a human-centred product designer and systems architect with a background in healthcare and public health science. As founder of Niuxverse Solutions, he bridges clinical care ethics with machine intelligence to design clean, friendly tools that solve real everyday problems.';
    } else if (/philosophy|principles|human by design|intelligence/.test(lower)) {
      focus('intro-4');
      answer = 'David’s core philosophy: True intelligence is not about algorithmic speed. It is about empathy, clear thinking, and tools that protect and enhance human capabilities. Technology should feel natural, safe, and helpful.';
    } else if (/akuba|wearable|sneaker|eyewear|glasses|wrist/.test(lower)) {
      const akuba = projects.find(p => p.id === 'akuba');
      if (akuba) {
        setSelected('akuba');
        focus('akuba');
        answer = 'AKUBA Smart Wear combines African cultural identity with futuristic spatial computing across kinetic sneakers, AR/VR eyewear, and a biometric wristband. In the case study modal, you can watch all three demonstration videos playing in auto-replay with sound controls.';
      }
    } else if (/mobile|app|logistics|octo/.test(lower)) {
      const octo = projects.find(p => p.id === 'octoserve');
      if (octo) {
        setSelected('octoserve');
        focus('octoserve');
        answer = 'OctoServe is an end-to-end mobile service logistics application. David served as Lead Interface Designer, crafting a shared visual language, multi-state ordering pipelines, and real-time delivery tracking.';
      }
    } else if (/ai foundation|education|literacy/.test(lower)) {
      const aif = projects.find(p => p.id === 'ai-foundation');
      if (aif) {
        setSelected('ai-foundation');
        focus('ai-foundation');
        answer = 'The AI Empowerment Foundation platform demystifies artificial intelligence literacy and structured learning pathways for emerging leaders and students worldwide.';
      }
    } else if (/works|projects|gallery|portfolio/.test(lower)) {
      focusWorks();
      answer = 'I have navigated the canvas down to the Selected Works Bento Grid. You can explore OctoServe, AI Foundation, AKUBA Smart Wear, Dev & Design Labs, Visual Explorations, and Interface Playground.';
    } else {
      answer = 'I can help answer questions regarding David’s background in healthcare empathy, specific case studies (AKUBA, OctoServe, AI Foundation), his design philosophy, or his availability for design roles and speaking.';
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText },
      { role: 'assistant', text: answer }
    ]);
  };

  return (
    <div
      className={`workspace ${presentation ? 'presenting' : ''} ${layersOpen ? '' : 'layers-hidden'} ${toolsOpen ? 'tools-drawer-open' : ''}`}
    >
      <a href="#canvas" className="ws-skip">
        Skip to portfolio canvas
      </a>

      {/* Header: Clean Figma Top Bar with Mobile Hamburger Dockers */}
      <header className="ws-header">
        <div className="header-left-zone">
          <button
            className="mobile-docker-btn left"
            onClick={() => {
              stop();
              setToolsOpen(!toolsOpen);
              if (!toolsOpen) setLayersOpen(false);
            }}
            aria-label="Toggle Design Tools & Navigator"
            title="Design Tools & Navigator"
          >
            <Menu size={18} />
            <span className="docker-label">Tools</span>
          </button>

          <button
            className="text-brand-logo"
            aria-label="About King of Intelligence"
            onClick={() => {
              stop();
              setModal('about');
            }}
          >
            <span className="brand-dot-indicator" />
            <span className="logo-text">King of Intelligence</span>
            <span className="logo-badge">Portfolio</span>
          </button>

          <div className="file-identity desktop-only">
            <span>
              Workspace <ChevronRight size={12} />
            </span>
            <strong>
              David Nwaeze / Vertical Flow <ChevronDown size={13} />
            </strong>
          </div>
        </div>

        <span className="saved desktop-only">
          <Check size={13} /> Saved
        </span>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button
            className="avatar"
            aria-label="About David Nwaeze"
            onClick={() => {
              stop();
              setModal('about');
            }}
            title="About David Nwaeze"
          >
            <img src="/profile/david-1.jpg" alt="David Nwaeze" />
          </button>

          <button
            className="icon-button"
            onClick={() => {
              stop();
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            className="icon-button desktop-action"
            aria-label="Open AI Assistant"
            title="Open AI Assistant"
            onClick={() => {
              stop();
              setLayersOpen(true);
              setAssistant(true);
            }}
          >
            <Sparkles size={16} />
          </button>

          <button
            className="text-button desktop-action"
            onClick={() => {
              stop();
              setModal('about');
            }}
          >
            About Me
          </button>

          <button
            className="primary-button rounded-16-btn header-contact-cta desktop-action"
            onClick={() => setModal('contact')}
          >
            <Mail size={14} />
            <span>Contact</span>
          </button>

          <button
            className="icon-button desktop-action"
            title="Presentation mode (Escape to exit)"
            aria-label="Toggle presentation mode"
            aria-pressed={presentation}
            onClick={() => {
              stop();
              setPresentation(!presentation);
            }}
          >
            <Play size={16} />
          </button>

          <button className="primary-button share desktop-action" onClick={share}>
            <Copy size={13} />
            <span>Share</span>
          </button>

          {/* Right Mobile Hamburger Docker for Layers Panel */}
          <button
            className="mobile-docker-btn right"
            onClick={() => {
              stop();
              setLayersOpen(!layersOpen);
              if (!layersOpen) setToolsOpen(false);
            }}
            aria-label="Toggle Layers Panel"
            title="Layers & Artboards"
          >
            <Layers size={18} />
            <span className="docker-label">Layers</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {(toolsOpen || (layersOpen && window.innerWidth <= 760)) && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => {
            setToolsOpen(false);
            setLayersOpen(false);
          }}
        />
      )}

      {/* Left Drawer / Sidebar: Design Tools, Categories & File Navigation */}
      <aside className={`left-panel ${toolsOpen ? 'mobile-drawer-open' : ''}`} aria-label="Portfolio navigation">
        <div className="panel-tabs">
          <strong>
            <LayoutGrid size={14} /> Tools & Navigation
          </strong>
          <button
            className="icon-button mobile-drawer-close"
            aria-label="Close navigation"
            onClick={() => {
              setLayersOpen(false);
              setToolsOpen(false);
            }}
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        <div className="file-card">
          <div className="file-icon">
            <Frame size={17} />
          </div>
          <div>
            <strong>David’s Portfolio</strong>
            <span>Human-Centred AI Designer</span>
          </div>
        </div>

        <label className="search-field">
          <Search size={13} />
          <input
            aria-label="Search portfolio"
            placeholder="Search frames…"
            value={query}
            onChange={e => {
              stop();
              setQuery(e.target.value);
            }}
          />
          <kbd>/</kbd>
        </label>

        <div className="panel-heading">
          Quick Navigation
        </div>
        <div className="left-quick-actions">
          <button
            className="quick-action-link"
            onClick={() => {
              focus('intro-1');
              if (window.innerWidth <= 760) setToolsOpen(false);
            }}
          >
            <Frame size={14} /> 01. Identity (Introduction)
          </button>
          <button
            className="quick-action-link"
            onClick={() => {
              focus('intro-6');
              if (window.innerWidth <= 760) setToolsOpen(false);
            }}
          >
            <Sparkles size={14} /> 06. About Me (Hero)
          </button>
          <button
            className="quick-action-link"
            onClick={() => {
              focusWorks();
              if (window.innerWidth <= 760) setToolsOpen(false);
            }}
          >
            <ArrowDown size={14} /> View Works Gallery
          </button>
          <button
            className="quick-action-link"
            onClick={() => {
              setModal('engage');
              if (window.innerWidth <= 760) setToolsOpen(false);
            }}
          >
            <Check size={14} /> Engagement Services
          </button>
        </div>

        <div className="left-footer">
          <span className="status-dot" />
          <span>Available for work</span>
          <button className="icon-button" aria-label="Contact David" onClick={() => setModal('contact')}>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </aside>

      {/* Main Interactive Canvas */}
      <main className="canvas-shell" id="canvas" tabIndex={-1}>
        <div className="canvas-topline">
          <span>
            Portfolio <ChevronRight size={11} /> <strong>{category}</strong>
          </span>
          <span className="canvas-hint">
            {tool === 'hand' ? 'Drag canvas freely' : 'Click any artboard to inspect'}
          </span>
        </div>

        <div
          ref={canvas}
          className={`canvas-viewport ${tool === 'hand' ? 'hand-tool' : ''}`}
          onPointerDown={e => {
            if (e.button !== 0 || (e.target as HTMLElement).closest('button,a,input,video') || window.innerWidth <= 760) return;
            if (tool === 'hand' || e.target === e.currentTarget) {
              stop();
              setIsDragging(true);
              drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerMove={e => {
            if (drag.current) {
              setPan({
                x: drag.current.px + e.clientX - drag.current.x,
                y: drag.current.py + e.clientY - drag.current.y
              });
            }
          }}
          onPointerUp={() => { drag.current = null; setIsDragging(false); }}
          onPointerCancel={() => { drag.current = null; setIsDragging(false); }}
          onWheel={e => {
            if (e.ctrlKey || e.metaKey) {
              stop();
              setZoom(z => Math.max(0.15, Math.min(1.4, z - e.deltaY * 0.0016)));
            } else if (window.innerWidth > 760) {
              stop();
              setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
            }
          }}
        >
          <div
            className={`canvas-world ${isDragging ? 'is-dragging' : ''}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              width: `${TOTAL_CANVAS_WIDTH}px`,
              minHeight: `${TOTAL_CANVAS_HEIGHT}px`
            }}
          >
            {/* ======================================================== */}
            {/* 1. FRAMES 1–6 (VERTICAL LAYOUT ON CANVAS)                */}
            {/* ======================================================== */}
            {introFrames.map((f, idx) => {
              const isCurrentActive = guide && currentStepIdx === idx;
              const isSelected = selected === f.id;
              const hasDrawn = !guide || currentStepIdx > idx || (isCurrentActive && currentStepTick >= 20);

              return (
                <section
                  id={`frame-${f.id}`}
                  key={f.id}
                  className={`intro-artboard artboard ${isSelected ? 'is-selected' : ''} ${isCurrentActive ? 'building' : ''} ${f.isHero ? 'hero-artboard' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${f.x}px`,
                    top: `${f.y}px`,
                    width: `${f.width}px`,
                    height: `${f.height}px`
                  }}
                  aria-label={f.title}
                  onClick={() => { stop(); setSelected(f.id); }}
                >
                  <button className="frame-caption" onClick={() => focus(f.id)}>
                    <Frame size={13} /> {f.number}. {f.title}
                    <span>{f.width} × {f.height}</span>
                  </button>

                  {/* SVG Drawing Outline (Drawn sequentially one after the other) */}
                  {isCurrentActive && (
                    <svg className="drawing-outline" viewBox={`0 0 ${f.width} ${f.height}`} preserveAspectRatio="none">
                      <rect
                        x="1"
                        y="1"
                        width={f.width - 2}
                        height={f.height - 2}
                        pathLength="100"
                        style={{
                          strokeDashoffset: Math.max(0, 100 - drawProgress * 100)
                        }}
                      />
                    </svg>
                  )}

                  {/* FRAME 06: HERO SECTION DESIGN (PICTURE ON LEFT, TEXT ON LEFT, BUTTONS) */}
                  {f.isHero ? (
                    <div className="editorial-hero-slide" style={{ opacity: hasDrawn ? 1 : 0.04 }}>
                      <div className="hero-slide-grid">
                        {/* Picture on Left */}
                        <div className="hero-portrait-col">
                          <div className="hero-portrait-frame">
                            <img
                              src={f.image || '/profile/david-1.jpg'}
                              alt="King David Nwaeze"
                              className="hero-portrait-img"
                              loading="lazy"
                            />
                            <div className="hero-portrait-badge">
                              <span className="hero-live-dot" />
                              <span>Available for Hire</span>
                            </div>
                            <div className="editorial-red-circle hero-red-dot" />
                          </div>
                          <div className="hero-portrait-caption">
                            <strong>King David Nwaeze</strong>
                            <span>Founder, Niuxverse Solutions</span>
                          </div>
                        </div>

                        {/* Text Content (Left-aligned) */}
                        <div className="hero-content-col">
                          <div className="hero-top-eyebrow">
                            <span className="editorial-frame-num">{f.number} / HERO SECTION</span>
                            <span className="hero-discipline-tag">Human-Centred AI</span>
                          </div>

                          <div className="hero-main-typography">
                            <h1 className="hero-headline">
                              {f.headlineBold}
                            </h1>
                            <h2 className="hero-subhead">
                              Human-Centred AI Designer & Systems Architect
                            </h2>
                            <p className="hero-description">
                              I bridge clinical healthcare empathy with modern product design. I take powerful technologies like AI and turn them into clean, friendly digital products that solve real everyday problems.
                            </p>
                          </div>

                          {/* Focus Tags */}
                          <div className="hero-tags-row">
                            <span>Product Design</span>
                            <span>Healthcare Empathy</span>
                            <span>Intelligent Systems</span>
                            <span>Speaking & Advisory</span>
                          </div>

                          {/* Action Buttons (16px border-radius) */}
                          <div className="hero-actions-row">
                            <button
                              className="primary-button rounded-16-btn hero-btn contact-btn-blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModal('contact');
                              }}
                            >
                              <Mail size={15} />
                              <span>Contact David</span>
                              <ArrowUpRight size={14} />
                            </button>

                            <button
                              className="outline-button rounded-16-btn hero-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModal('engage');
                              }}
                            >
                              <span>Engage Services</span>
                              <ArrowUpRight size={14} />
                            </button>

                            <button
                              className="ghost-button rounded-16-btn hero-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                focusWorks();
                              }}
                            >
                              <span>View My Works</span>
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Anchored Bottom Row */}
                      <div className="editorial-bottom-row hero-bottom">
                        <div className="bottom-col left">
                          <span className="col-label">{f.categoryLeft}</span>
                        </div>
                        <div className="bottom-col center">
                          <span className="col-text">{f.metaCenter}</span>
                        </div>
                        <div className="bottom-col right">
                          <span className="col-text">{f.metaRight}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FRAMES 01–05: EDITORIAL SWISS MANIFESTO SLIDES */
                    <div className="editorial-canvas-slide" style={{ opacity: hasDrawn ? 1 : 0.04 }}>
                      <div className="editorial-top-row">
                        <span className="editorial-frame-num">{f.number}</span>
                        <div className="editorial-red-circle" />
                      </div>

                      <div className="editorial-main-typography">
                        <h1 className="bold-lettered-headline">
                          {isCurrentActive ? typedHeadline : f.headlineBold}
                          {isCurrentActive && isTypingActive && <span className="typing-caret" />}
                        </h1>
                        <p className="bold-lettered-muted">
                          {f.headlineMuted}
                        </p>
                      </div>

                      {/* 3-Column Anchored Bottom Row */}
                      <div className="editorial-bottom-row">
                        <div className="bottom-col left">
                          <span className="col-label">{f.categoryLeft}</span>
                        </div>
                        <div className="bottom-col center">
                          <span className="col-text">{f.metaCenter}</span>
                        </div>
                        <div className="bottom-col right">
                          <span className="col-text">{f.metaRight}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Selection Handles */}
                  {isSelected && (
                    <>
                      <i className="handle tl" />
                      <i className="handle tr" />
                      <i className="handle bl" />
                      <i className="handle br" />
                      <span className="dimension-label">{f.width} × {f.height}</span>
                    </>
                  )}
                </section>
              );
            })}

            {/* ======================================================== */}
            {/* 2. GALLERY HEADER ARTBOARD                               */}
            {/* ======================================================== */}
            <section
              id="frame-gallery-header"
              className="gallery-header-artboard artboard"
              style={{
                position: 'absolute',
                left: '60px',
                top: `${WORKS_START_Y - 90}px`,
                width: `${FRAME_WIDTH}px`,
                height: '70px'
              }}
            >
              <div className="gallery-header-row">
                <div className="gallery-header-title">
                  <span className="gallery-badge">MY WORKS · 07–12</span>
                  <h2>Selected Works & Case Studies</h2>
                </div>
                <div className="gallery-categories-tabs">
                  {['All', 'Mobile', 'Intelligent Systems', 'Product Design', 'Web Design'].map(cat => (
                    <button
                      key={cat}
                      className={`gallery-filter-pill ${category === cat || (cat === 'All' && category === 'Overview') ? 'active' : ''}`}
                      onClick={() => setCategory(cat === 'All' ? 'Overview' : cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* 3. BENTO GRID GALLERY OF WORKS (BELOW FRAMES 1–6)         */}
            {/* ======================================================== */}
            {filtered.map(p => {
              const isSelected = selected === p.id;
              const hasVideoPreview = !!p.previewVideo;

              return (
                <article
                  id={'frame-' + p.id}
                  key={p.id}
                  className={`bento-work-card artboard ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    width: `${p.width}px`,
                    height: `${p.height}px`
                  }}
                  onClick={() => { stop(); setSelected(p.id); }}
                >
                  <button className="frame-caption" onClick={() => focus(p.id)}>
                    <Frame size={13} /> {p.number}. {p.title}
                    <span>{p.category}</span>
                  </button>

                  <div className="bento-card-inner">
                    {/* Media preview: auto-looping video for AKUBA, images for others */}
                    <div
                      className="bento-media-wrap"
                      style={{ background: p.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openProject(p);
                      }}
                    >
                      {hasVideoPreview ? (
                        <div className="bento-video-container">
                          <video
                            src={p.previewVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="bento-looping-video"
                          />
                          <span className="video-live-pill">Auto Replay · Looping</span>
                        </div>
                      ) : (
                        <img
                          src={p.image}
                          alt={`${p.title} preview`}
                          loading="lazy"
                          draggable={false}
                          className="bento-card-img"
                        />
                      )}

                      {/* Expandable Arrow Button */}
                      <button
                        className="bento-expand-btn rounded-16-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProject(p);
                        }}
                        aria-label={`Open ${p.title} case study`}
                        title="Open full case study"
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </div>

                    {/* Card Information */}
                    <div className="bento-details">
                      <div className="bento-tag-row">
                        <span className="bento-cat-badge">{p.category}</span>
                        <span className="bento-role-text">{p.role}</span>
                      </div>

                      <h3 className="bento-title" onClick={() => openProject(p)}>
                        {p.title}
                      </h3>
                      <p className="bento-summary">{p.summary}</p>

                      <div className="bento-footer-row">
                        <div className="bento-tags">
                          {p.tags.slice(0, 2).map(t => (
                            <span key={t} className="bento-pill">{t}</span>
                          ))}
                        </div>
                        <button
                          className="bento-case-link rounded-16-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProject(p);
                          }}
                        >
                          <span>Case Study</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <>
                      <i className="handle tl" />
                      <i className="handle tr" />
                      <i className="handle bl" />
                      <i className="handle br" />
                      <span className="dimension-label">{p.width} × {p.height}</span>
                    </>
                  )}
                </article>
              );
            })}

            {/* Live Cursor Drawing Animation */}
            {guide && (
              <div
                className="guide-cursor"
                style={{
                  left: `${cursorDraw.x}px`,
                  top: `${cursorDraw.y}px`
                }}
              >
                <MousePointer2 fill="#0d99ff" size={26} />
                <span>
                  David Nwaeze · Drawing {activeItem.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Intro Stepper Bar (Walkthrough controller) */}
        {guide && (
          <div className="guide-bar">
            <div className="guide-stepper">
              {allWalkthroughItems.map((item, i) => (
                <button
                  key={item.id}
                  className={`step-pill ${currentStepIdx === i ? 'active' : ''}`}
                  onClick={() => jumpToStep(i)}
                  title={`${item.number}. ${item.title}`}
                >
                  {item.number}
                </button>
              ))}
            </div>
            <span className="guide-caption">
              {currentStepTick < 20
                ? `Drawing ${activeItem.title}…`
                : `Lettering ${activeItem.title}…`}
            </span>
            <button
              className="icon-button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Resume introduction' : 'Pause introduction'}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
            <button className="text-button guide-skip" onClick={() => { setGuide(false); focusWorks(); }}>
              Skip to Works <ArrowDown size={12} />
            </button>
          </div>
        )}

        {/* Bottom Canvas Tools Strip with Prominent Blue Contact Me Button */}
        <div className="canvas-bottom">
          <button
            className="footer-contact-blue-btn rounded-16-btn"
            onClick={() => setModal('contact')}
            title="Contact David Nwaeze"
          >
            <Mail size={15} />
            <span>Contact Me</span>
          </button>

          <div className="tool-strip">
            <button
              className={tool === 'select' ? 'active' : ''}
              aria-label="Select tool (V)"
              aria-pressed={tool === 'select'}
              onClick={() => { stop(); setTool('select'); }}
            >
              <MousePointer2 size={16} />
            </button>
            <button
              className={tool === 'hand' ? 'active' : ''}
              aria-label="Hand tool (H)"
              aria-pressed={tool === 'hand'}
              onClick={() => { stop(); setTool('hand'); }}
            >
              <Hand size={16} />
            </button>
            <i />
            <button aria-label="Fit canvas (0)" onClick={() => { stop(); fit(); }}>
              <Maximize size={15} />
            </button>
            <button
              aria-label="Reset view"
              onClick={() => {
                stop();
                setCategory('Overview');
                setQuery('');
                focus('intro-1');
              }}
            >
              <RotateCcw size={15} />
            </button>
            <i />
            <button aria-label="Replay walkthrough" title="Replay intro lettering" onClick={replay}>
              <Play size={15} />
            </button>
          </div>

          <div className="zoom-strip">
            <button aria-label="Zoom out" onClick={() => { stop(); setZoom(z => Math.max(0.12, z - 0.08)); }}>
              <Minus size={14} />
            </button>
            <button onClick={() => { stop(); fit(); }} title="Fit all frames">
              {Math.round(zoom * 100)}% <ChevronDown size={11} />
            </button>
            <button aria-label="Zoom in" onClick={() => { stop(); setZoom(z => Math.min(1.4, z + 0.08)); }}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Right Drawer / Sidebar: Layers Panel & Inspector (Compressible on Mobile) */}
      <aside className={`right-panel ${layersOpen ? 'mobile-drawer-open' : ''}`} aria-label="Selection inspector">
        <div className="inspector-tabs">
          <button
            className={!assistant ? 'active' : ''}
            onClick={() => setAssistant(false)}
          >
            Design & Layers
          </button>
          <button
            className={assistant ? 'active' : ''}
            onClick={() => {
              stop();
              setAssistant(true);
            }}
          >
            <Sparkles size={13} /> Assistant
          </button>
          <button
            className="icon-button mobile-drawer-close"
            aria-label="Close layers"
            onClick={() => setLayersOpen(false)}
          >
            <X size={15} />
          </button>
        </div>

        {assistant ? (
          <div className="assistant-panel">
            <div className="assistant-heading">
              <span className="ai-icon">
                <Sparkles size={18} />
              </span>
              <div>
                <h2>AI Design Assistant</h2>
                <p>Portfolio Intelligence · Human by Design</p>
              </div>
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className="message-sender">
                    {m.role === 'user' ? 'You' : 'King of Intelligence Assistant'}
                  </div>
                  <div className="message-bubble">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="suggestions">
              <span className="suggestions-label">Suggested questions</span>
              <div className="suggestions-scroll">
                {[
                  'Tell me about David',
                  'Explain AKUBA Smart Wear',
                  'Show mobile work',
                  'What is Niuxverse Solutions?',
                  'How can I contact David?'
                ].map(t => (
                  <button key={t} onClick={() => ask(t)}>
                    <span>{t}</span>
                    <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
            </div>

            <form
              className="chat-form"
              onSubmit={e => {
                e.preventDefault();
                ask(question);
              }}
            >
              <input
                aria-label="Ask the AI design assistant"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about David’s design work or philosophy…"
              />
              <button
                type="submit"
                aria-label="Send question"
                disabled={!question.trim()}
                className="chat-send-btn"
              >
                <Send size={14} />
              </button>
            </form>
            <p className="local-note">
              Verified answers from David Nwaeze’s portfolio and case studies.
            </p>
          </div>
        ) : (
          <>
            {/* Categories Section */}
            <div className="panel-heading">
              Categories <span>{categories.length}</span>
            </div>
            <nav className="page-list categories-list">
              {categories.map((c, i) => (
                <button
                  key={c}
                  className={category === c ? 'active' : ''}
                  onClick={() => {
                    stop();
                    setCategory(c);
                    setQuery('');
                    if (c === 'Intro Frames') {
                      setSelected('intro-1');
                      focus('intro-1');
                    } else if (c === 'Selected Works') {
                      focusWorks();
                    } else if (c === 'About & experience') {
                      setSelected('intro-6');
                      focus('intro-6');
                    } else {
                      focus('intro-1');
                    }
                    if (window.innerWidth <= 760) {
                      setLayersOpen(false);
                    }
                  }}
                >
                  <span>{i === 0 ? <LayoutGrid size={13} /> : <Frame size={13} />}</span>
                  {c}
                  {category === c && <span className="page-dot" />}
                </button>
              ))}
            </nav>

            {/* Canvas Layers Tree */}
            <div className="panel-heading layer-heading">
              <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Canvas Layers
              </button>
              <span>{introFrames.length + filtered.length}</span>
            </div>

            {expanded && (
              <div className="layer-list">
                <div className="layer-group-title">Intro & About Frames</div>
                {introFrames.map((f) => (
                  <button
                    key={f.id}
                    className={selected === f.id ? 'selected' : ''}
                    onClick={() => {
                      focus(f.id);
                      if (window.innerWidth <= 760) setLayersOpen(false);
                    }}
                  >
                    <Frame size={13} />
                    <span>{f.number}. {f.title}</span>
                    <span className="layer-type">{f.isHero ? 'Hero' : 'Frame'}</span>
                  </button>
                ))}

                <div className="layer-group-title" style={{ marginTop: '10px' }}>Selected Works (Bento)</div>
                {filtered.map(p => (
                  <button
                    key={p.id}
                    className={selected === p.id ? 'selected' : ''}
                    onClick={() => {
                      focus(p.id);
                      if (window.innerWidth <= 760) setLayersOpen(false);
                    }}
                  >
                    <ChevronRight size={11} />
                    <Frame size={13} />
                    <span>{p.number}. {p.title}</span>
                  </button>
                ))}
              </div>
            )}

            {introSelected ? (
              <>
                <div className="inspector-section">
                  <div className="selection-kind">
                    <Frame size={14} />
                    <span>{introSelected.isHero ? 'Hero Frame 06' : `Intro Frame ${introSelected.number}`}</span>
                  </div>
                  <h2>{introSelected.title}</h2>
                  <p>{introSelected.headlineBold}</p>
                </div>

                <div className="inspector-section">
                  <h3>Properties <ChevronDown size={12} /></h3>
                  <div className="property-grid">
                    <span><b>W</b> {introSelected.width}</span>
                    <span><b>H</b> {introSelected.height}</span>
                    <span><b>X</b> {introSelected.x}</span>
                    <span><b>Y</b> {introSelected.y}</span>
                  </div>
                  <div className="property-line">
                    <span>Corner Radius</span>
                    <span>16px</span>
                  </div>
                </div>

                <div className="inspector-section">
                  <h3>Context</h3>
                  <dl>
                    <dt>Label</dt>
                    <dd>{introSelected.categoryLeft}</dd>
                    <dt>Summary</dt>
                    <dd>{introSelected.headlineMuted}</dd>
                  </dl>
                </div>

                <div className="inspector-section inspector-actions">
                  <button
                    className="primary-button rounded-16-btn"
                    onClick={() => {
                      focus(introSelected.id);
                      setNotice(`Focused on ${introSelected.title}`);
                    }}
                  >
                    <span>Focus Frame</span>
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    className="outline-button rounded-16-btn"
                    onClick={() => ask(`Tell me about ${introSelected.title}`)}
                  >
                    <Sparkles size={13} />
                    <span>Ask Assistant about this</span>
                  </button>
                  {introSelected.isHero && (
                    <button
                      className="outline-button rounded-16-btn"
                      onClick={() => setModal('about')}
                    >
                      <span>Open Full About</span>
                      <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="inspector-section">
                  <div className="selection-kind">
                    <Frame size={14} />
                    <span>{project ? 'Project Frame' : 'Workspace'}</span>
                  </div>
                  <h2>{project?.title || 'David Nwaeze'}</h2>
                  <p>{project?.summary || 'Select any artboard on the canvas to inspect its layout and decisions.'}</p>
                </div>

                <div className="inspector-section">
                  <h3>Properties <ChevronDown size={12} /></h3>
                  <div className="property-grid">
                    <span><b>W</b> {project ? project.width : FRAME_WIDTH}</span>
                    <span><b>H</b> {project ? project.height : FRAME_HEIGHT}</span>
                    <span><b>X</b> {project ? project.x : 60}</span>
                    <span><b>Y</b> {project ? project.y : 60}</span>
                  </div>
                </div>

                <div className="inspector-section">
                  <h3>{project ? 'Details' : 'About'}</h3>
                  <dl>
                    <dt>{project ? 'Category' : 'Discipline'}</dt>
                    <dd>{project?.category || 'Product Design'}</dd>
                    <dt>{project ? 'Role' : 'Location'}</dt>
                    <dd>{project?.role || 'Lagos, Nigeria'}</dd>
                  </dl>
                  <div className="tag-list">
                    {(project?.tags || ['Product Design', 'Healthcare Empathy', 'Design Systems']).map(t => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className="inspector-section inspector-actions">
                  <button
                    className="primary-button rounded-16-btn"
                    onClick={() => (project ? openProject(project) : setModal('about'))}
                  >
                    <span>{project ? 'Open Case Study' : 'View Profile'}</span>
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    className="outline-button rounded-16-btn"
                    onClick={() => ask(project ? `Tell me about ${project.title}` : 'Tell me about David')}
                  >
                    <Sparkles size={13} />
                    <span>Ask Assistant about this</span>
                  </button>
                </div>
              </>
            )}

            <div className="inspector-invite">
              <div className="tiny-stack">
                <MousePointer2 size={16} />
                <span>
                  Available for product design jobs, speaking, and consultation.
                </span>
              </div>
              <button className="rounded-16-btn" onClick={() => setModal('contact')}>
                Contact David <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="inspector-foot">
              <CircleHelp size={13} />
              <span>V Select · H Hand · 0 Fit · Esc Exit</span>
            </div>
          </>
        )}
      </aside>

      {/* Floating Notice Toast */}
      {notice && (
        <div className="toast" role="status">
          <Check size={14} />
          {notice}
        </div>
      )}

      {/* Modal Dialog: Case Studies with 3 Auto-Replay Videos, About, Contact & Engage */}
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-label="Portfolio details"
        onCancel={e => {
          e.preventDefault();
          closeModal();
        }}
        onClick={e => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-top">
            <span>
              {typeof modal === 'object' && modal
                ? 'Project / ' + modal.title
                : modal === 'about'
                  ? 'About David Nwaeze'
                  : modal === 'engage'
                    ? 'Engage Services'
                    : 'Contact'}
            </span>
            <button className="icon-button" aria-label="Close detail view" onClick={closeModal}>
              <X size={18} />
            </button>
          </div>

          {modal === 'about' ? (
            <div className="about-detail">
              <img src="/profile/david-1.jpg" alt="King David Nwaeze" />
              <div>
                <span className="detail-eyebrow">David Nwaeze</span>
                <h2>Human-Centred Product Design.</h2>
                <p>{bio}</p>
                <p>
                  As the founder of Niuxverse Solutions, I bridge clinical healthcare empathy with modern product design. I take powerful technologies like AI and turn them into clean, friendly digital products that solve real everyday problems.
                </p>
                <h3>Focus</h3>
                <p>Product Design · Healthcare Empathy · AI Workflows · Design Systems · Speaking & Consultation</p>
                <div className="detail-links">
                  <a
                    href="https://www.linkedin.com/in/david-nwaeze"
                    target="_blank"
                    rel="noreferrer"
                    className="primary-button rounded-16-btn"
                  >
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                  <button
                    className="outline-button rounded-16-btn"
                    onClick={() => {
                      const file = new Blob(
                        [
                          'King David Nwaeze\n\n' +
                            bio +
                            '\n\nFounder, Niuxverse Solutions\nFocus: Product design, healthcare empathy, intelligent systems\nEmail: theniuxversesolutions@gmail.com\nLinkedIn: https://www.linkedin.com/in/david-nwaeze\n\nPortfolio profile summary.'
                        ],
                        { type: 'text/plain' }
                      );
                      const url = URL.createObjectURL(file);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'David-Nwaeze-Profile.txt';
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }}
                  >
                    Download Profile <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : modal === 'engage' ? (
            <div className="engage-detail">
              <div className="engage-top-header">
                <span className="status-dot" /> Available for Design Roles, Speaking & Consultation
                <h2>Engage & Collaborate with David.</h2>
                <p>
                  Whether you are assembling a product design team for an intelligent system, looking for an executive keynote on human-centred AI, or require specialized UX advisory.
                </p>
              </div>

              <div className="engage-services-grid">
                <div className="engage-service-card">
                  <span className="service-icon"><LayoutGrid size={20} /></span>
                  <h3>Product Design Leadership</h3>
                  <p>End-to-end UX/UI, design tokens, and human interfaces for machine intelligence and healthcare products.</p>
                </div>

                <div className="engage-service-card">
                  <span className="service-icon"><Sparkles size={20} /></span>
                  <h3>Speaking & Keynotes</h3>
                  <p>Dynamic presentations on calm technology, healthcare empathy in software, and AI without dehumanization.</p>
                </div>

                <div className="engage-service-card">
                  <span className="service-icon"><CircleHelp size={20} /></span>
                  <h3>Advisory & Consultation</h3>
                  <p>Strategic interface audits, AI workflow ergonomics, and design system governance for high-growth ventures.</p>
                </div>
              </div>

              <div className="engage-ctas-row">
                <a className="primary-button rounded-16-btn" href="mailto:theniuxversesolutions@gmail.com?subject=Engage%20David%20Nwaeze">
                  <Mail size={16} /> Book via Email <ArrowUpRight size={15} />
                </a>
                <a
                  href="https://wa.me/2348110607341"
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button rounded-16-btn"
                >
                  WhatsApp Direct <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/david-nwaeze"
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button rounded-16-btn"
                >
                  LinkedIn Profile <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ) : modal === 'contact' ? (
            <div className="contact-detail">
              <span className="status-dot" /> Available for product design jobs, speaking, and consultation
              <h2>Let’s create something meaningful.</h2>
              <p>Reach out to discuss projects, advisory, speaking engagements, or design leadership.</p>
              <a className="primary-button rounded-16-btn" href="mailto:theniuxversesolutions@gmail.com">
                <Mail size={16} /> Email theniuxversesolutions@gmail.com <ArrowUpRight size={15} />
              </a>
              <div className="detail-links" style={{ marginTop: '20px' }}>
                <a
                  href="https://wa.me/2348110607341"
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button rounded-16-btn"
                >
                  WhatsApp <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/david-nwaeze"
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button rounded-16-btn"
                >
                  LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ) : (
            modal && (
              <article className="case-detail">
                <span className="detail-eyebrow">{modal.category}</span>
                <h2>{modal.title}</h2>
                <p className="case-lead">{modal.summary}</p>
                <div className="case-meta">
                  <span>
                    Role<strong>{modal.role}</strong>
                  </span>
                  <span>
                    Disciplines<strong>{modal.tags.join(' / ')}</strong>
                  </span>
                </div>

                {/* THREE CASE STUDY VIDEOS (AUTO-REPLAY WITH SOUND CONTROLS) */}
                {modal.videos && modal.videos.length > 0 && (
                  <section className="case-videos-section">
                    <div className="case-videos-header">
                      <div>
                        <span className="case-videos-badge">Product Motion & Spatial Demonstrations</span>
                        <h3>Interactive Video Suite ({modal.videos.length} Videos in Auto-Replay)</h3>
                      </div>
                      <div className="case-videos-master-ctrls">
                        <button
                          className="rounded-16-btn video-ctrl-btn"
                          onClick={toggleAllVideosPlay}
                        >
                          {allVideosPlaying ? <Pause size={14} /> : <Play size={14} />}
                          <span>{allVideosPlaying ? 'Pause All' : 'Play All'}</span>
                        </button>
                        <button
                          className={`rounded-16-btn video-ctrl-btn ${allVideosSound ? 'sound-active' : ''}`}
                          onClick={toggleAllVideosMute}
                        >
                          {allVideosSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
                          <span>{allVideosSound ? 'Sound On' : 'Sound Muted'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="case-videos-grid">
                      {modal.videos.map((vid, idx) => (
                        <div key={vid.id} className="case-video-card">
                          <div className="case-video-viewport">
                            <video
                              ref={el => { videoRefs.current[idx] = el; }}
                              src={vid.src}
                              autoPlay
                              loop
                              playsInline
                              className="case-video-player"
                            />
                            <div className="case-video-overlay-ctrls">
                              <button
                                className="video-pip-btn"
                                onClick={() => toggleSingleVideoPlay(idx)}
                                aria-label="Play or pause"
                              >
                                {singlePlaying[idx] !== false ? <Pause size={13} /> : <Play size={13} />}
                              </button>
                              <button
                                className={`video-pip-btn ${singleSound[idx] ? 'sound-on' : ''}`}
                                onClick={() => toggleSingleVideoMute(idx)}
                                aria-label="Toggle sound"
                              >
                                {singleSound[idx] ? <Volume2 size={13} /> : <VolumeX size={13} />}
                              </button>
                            </div>
                          </div>
                          <div className="case-video-info">
                            <span className="video-idx">0{idx + 1}</span>
                            <h4>{vid.title}</h4>
                            <p>{vid.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <h3>Design Decisions</h3>
                <ul>
                  {modal.decisions.map(d => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                {modal.images.map((src, i) => (
                  <figure key={src}>
                    <img src={src} alt={`${modal.title} screen ${i + 1}`} loading="lazy" />
                    <figcaption>
                      {modal.title} / Screen {i + 1}
                    </figcaption>
                  </figure>
                ))}

                <button className="outline-button rounded-16-btn" onClick={share}>
                  <Copy size={14} /> Copy Link
                </button>
              </article>
            )
          )}
        </div>
      </dialog>
    </div>
  );
}
