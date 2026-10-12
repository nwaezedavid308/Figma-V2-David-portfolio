import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { ShowcaseImage } from '../showcase-types';

export function ImageShowcase({ id, title, description, images: allImages }: { id: string; title: string; description: string; images: ShowcaseImage[] }) {
  const [showAll, setShowAll] = useState(false);
  const images = showAll ? allImages : allImages.slice(0, 8);
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<ShowcaseImage | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const query = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    const update = () => setPinned(query.matches && images.length > 1 && !showAll);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [images.length, showAll]);
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!rail.current || !section.current) return;
      const bounds = section.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -bounds.top / (bounds.height - innerHeight)));
      rail.current.scrollLeft = progress * (rail.current.scrollWidth - rail.current.clientWidth);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule); update();
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [pinned, allImages, showAll]);
  useEffect(() => {
    if (selected) { dialog.current?.showModal(); document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);
  const go = (index: number) => {
    if (!rail.current) return;
    const card = rail.current.children[index] as HTMLElement;
    if (!card) return;
    const max = rail.current.scrollWidth - rail.current.clientWidth;
    const left = Math.min(card.offsetLeft - parseFloat(getComputedStyle(rail.current).paddingLeft), max);
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (pinned && section.current && max > 0) window.scrollTo({ top: section.current.offsetTop + (left / max) * (section.current.offsetHeight - innerHeight), behavior });
    else rail.current.scrollTo({ left, behavior });
  };
  const close = () => { dialog.current?.close(); setSelected(null); setZoomed(false); };
  return <section id={id} data-gallery-version="gallery-v2" ref={section} className={`work-journey image-showcase ${pinned ? 'is-pinned' : ''}`} style={pinned ? { height: `${Math.max(220, images.length * 75)}vh` } : undefined} aria-labelledby={`${id}-heading`}>
    <div className="work-stage">
      <div className="work-heading grid-layout"><h2 id={`${id}-heading`}>{title}</h2><p>{description}</p><span className="work-count">{images.length ? `${String(Math.min(active + 1, images.length)).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : 'Coming soon'}</span></div>
      {images.length ? <>
        <div className="project-rail" ref={rail} role="region" aria-roledescription="carousel" aria-label={title} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, Math.min(images.length - 1, active + (e.key === 'ArrowRight' ? 1 : -1)))); } }} onScroll={() => {
          const el = rail.current; if (!el) return;
          const cards = Array.from(el.children) as HTMLElement[];
          const distance = (i: number) => Math.abs(Math.min(cards[i].offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), el.scrollWidth - el.clientWidth) - el.scrollLeft);
          setActive(cards.reduce((best, _, i) => distance(i) < distance(best) ? i : best, 0));
        }}>{images.map((image, i) => <article className="project" key={image.src} aria-label={`${i + 1} of ${images.length}: ${image.title}`}>
          <button className="project-image" onClick={() => setSelected(image)} aria-label={`View ${image.title}`}><img src={image.preview || image.src} alt={image.title} loading={i < 3 ? 'eager' : 'lazy'} onLoad={e => { const imageEl = e.currentTarget; const card = imageEl.closest('.project') as HTMLElement | null; if (card) card.dataset.orientation = imageEl.naturalWidth / imageEl.naturalHeight < .8 ? 'portrait' : 'landscape'; }}/><span className="project-number">{String(i + 1).padStart(2, '0')}</span><span className="image-label glass">View design</span><span className="project-open glass"><ArrowUpRight size={25}/></span></button>
          <div className="project-caption"><div><span>{image.category}</span><h3><button onClick={() => setSelected(image)}>{image.title}</button></h3></div></div>
        </article>)}</div>
        <div className="carousel-footer"><span>{pinned ? 'Scroll down. Discover sideways.' : 'Swipe to discover. Or use the arrows.'}</span>{allImages.length > 8 && <button className="collection-button" onClick={() => { setShowAll(!showAll); setActive(0); if (rail.current) rail.current.scrollLeft = 0; section.current?.scrollIntoView({ behavior: 'instant' }); }}>{showAll ? 'Back to selected work' : `Browse all ${allImages.length} designs`}</button>}<div className="carousel-controls glass"><button aria-label={`Previous ${title} image`} disabled={active === 0} onClick={() => go(active - 1)}><ArrowLeft size={20}/></button><span className="carousel-position" aria-live="polite">{Math.min(active + 1, images.length)} / {images.length}</span><button aria-label={`Next ${title} image`} disabled={active >= images.length - 1} onClick={() => go(active + 1)}><ArrowRight size={20}/></button></div></div>
      </> : <div className="showcase-empty"><p>A new collection is on its way.</p><a className="text-link" href="#contact">Talk about a project <ArrowUpRight size={20}/></a></div>}
    </div>
    <dialog className={`project-dialog image-dialog ${zoomed ? 'is-zoomed' : ''}`} aria-label={selected?.title || 'Design viewer'} ref={dialog} onCancel={() => { setSelected(null); setZoomed(false); }} onClose={() => { setSelected(null); setZoomed(false); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>{selected && <div className="dialog-content"><div className="viewer-controls"><button className="glass" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? 'Fit artwork' : 'Zoom to read'}</button><button className="glass" aria-label="Close design" onClick={close}><X/></button></div><img src={selected.src} alt={selected.title}/><div className="dialog-copy"><span>{selected.category}</span><h2>{selected.title}</h2></div></div>}</dialog>
  </section>;
}
