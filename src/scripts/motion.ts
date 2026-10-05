// Motion and small interface behaviour for "Under load", on anime.js (one library, as the animacion-ui skill asks).
// Content is visible without JS; hidden start states are set here, never in CSS; only transform,
// opacity, filter and SVG stroke animate; everything rests under prefers-reduced-motion.
import { animate, createTimeline, stagger, svg } from 'animejs';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const root = document.documentElement;

/* ---------- Theme: system, then light, then dark; remembered, never required ---------- */
function setTheme(theme: string) {
	root.dataset.theme = theme;
	try {
		if (theme === 'auto') localStorage.removeItem('theme');
		else localStorage.setItem('theme', theme);
	} catch {}
	$$<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
		const key = b.dataset[`l${theme[0].toUpperCase()}${theme.slice(1)}`];
		if (key) b.dataset.i18nAttr = `aria-label:${key}`;
	});
	window.dispatchEvent(new CustomEvent('themechange'));
}
$$<HTMLButtonElement>('[data-theme-toggle]').forEach((b) =>
	b.addEventListener('click', () => {
		const t = root.dataset.theme;
		setTheme(t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto');
		window.dispatchEvent(new CustomEvent('relabel'));
	}),
);
setTheme(root.dataset.theme || 'auto');

/* ---------- The headline under load: one span per letter, the sentence kept for screen readers ---------- */
function splitLoad(h: HTMLElement) {
	const text = h.textContent!.trim();
	h.setAttribute('aria-label', text);
	h.replaceChildren();
	text.split(' ').forEach((word, i, all) => {
		const w = document.createElement('span');
		w.className = 'w';
		w.setAttribute('aria-hidden', 'true');
		for (const ch of word) {
			const c = document.createElement('span');
			c.className = 'c';
			c.textContent = ch;
			w.append(c);
		}
		h.append(w);
		if (i < all.length - 1) h.append(' ');
	});
}

/* ---------- Section titles: each word rises from behind a mask; variants alternate ---------- */
function splitTitle(h: HTMLElement) {
	const text = h.textContent!.trim();
	h.setAttribute('aria-label', text);
	h.replaceChildren();
	text.split(/\s+/).forEach((word, i, all) => {
		const mask = document.createElement('span');
		mask.className = 'mask';
		mask.setAttribute('aria-hidden', 'true');
		const inner = document.createElement('span');
		inner.className = 'wi';
		inner.textContent = word;
		mask.append(inner);
		h.append(mask);
		if (i < all.length - 1) h.append(' ');
	});
}

// The i18n script swaps textContent; when it does, rebuild the split text in its final state.
const loads = $$('.load');
const titles = $$('[data-split]');
loads.forEach(splitLoad);
titles.forEach(splitTitle);
window.addEventListener('langchange', () => {
	loads.forEach((h) => { if (!h.querySelector('.w')) splitLoad(h); });
	titles.forEach((h) => { if (!h.querySelector('.mask')) splitTitle(h); });
});

/* ---------- Diagrams: nodes appear and wires draw in the order data travels ---------- */
export function drawDiagram(d: Element) {
	const nodes = $$('.node', d);
	const wires = $$<SVGPathElement>('.wire', d);
	if (reduce) return;
	nodes.forEach((n) => (n.style.opacity = '0'));
	wires.forEach((w) => (w.style.opacity = '0'));
	const tl = createTimeline({ defaults: { ease: 'outQuart' } });
	nodes.forEach((n, i) => tl.add(n, { opacity: [0, 1], y: [10, 0], duration: 500 }, i * 260));
	wires.forEach((w, i) => {
		w.style.opacity = '1';
		tl.add(svg.createDrawable(w), { draw: ['0 0', '0 1'], duration: 600, ease: 'inOutQuad' }, 200 + i * 260);
	});
}

if (!reduce) {
	/* Page load: the headline's letters come up from below their line, then the profile row */
	const load = loads[0];
	if (load) {
		const chars = $$('.c', load);
		const rest = $$('[data-after-load]');
		chars.forEach((c) => { c.style.opacity = '0'; c.style.transform = 'translateY(40%)'; });
		rest.forEach((e) => (e.style.opacity = '0'));
		const tl = createTimeline({ defaults: { ease: 'outExpo' } });
		tl.add(chars, { opacity: [0, 1], y: ['40%', '0%'], duration: 900, delay: stagger(14) }, 100);
		if (rest.length) tl.add(rest, { opacity: [0, 1], y: [16, 0], duration: 700, delay: stagger(90) }, 520);
		tl.then(() => chars.forEach((c) => { c.style.removeProperty('transform'); c.style.removeProperty('opacity'); }));
	}

	/* Titles and diagrams enter once as they reach the viewport; body text is never held back */
	const variants = ['up', 'rot', 'blur'];
	const io = new IntersectionObserver(
		(entries) => entries.forEach((en) => {
			if (!en.isIntersecting) return;
			io.unobserve(en.target);
			const el = en.target as HTMLElement;
			if (el.hasAttribute('data-split')) enterTitle(el);
			else drawDiagram(el);
		}),
		{ rootMargin: '0px 0px -12% 0px' },
	);
	titles.forEach((h, i) => {
		h.dataset.v = variants[i % variants.length];
		$$('.wi', h).forEach((w) => (w.style.transform = 'translateY(110%)'));
		io.observe(h);
	});
	$$('svg.diagram[data-draw]').forEach((d) => io.observe(d));

	function enterTitle(h: HTMLElement) {
		const w = $$('.wi', h);
		if (h.dataset.v === 'rot') animate(w, { y: ['110%', '0%'], rotate: [7, 0], duration: 1000, delay: stagger(55), ease: 'outQuart' });
		else if (h.dataset.v === 'blur') {
			w.forEach((e) => (e.style.transform = 'none'));
			animate(w, { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], y: [18, 0], duration: 900, delay: stagger(70), ease: 'outQuart' });
		} else animate(w, { y: ['110%', '0%'], duration: 900, delay: stagger(40), ease: 'outExpo' });
	}
}

/* ---------- Live windows: the deployed app replaces its poster only when the visitor asks ---------- */
$$('[data-live]').forEach((box) => {
	const btn = box.querySelector<HTMLButtonElement>('.load-btn');
	btn?.addEventListener('click', () => {
		const f = document.createElement('iframe');
		f.src = box.dataset.live!;
		f.title = box.dataset.title || 'Live app';
		f.setAttribute('referrerpolicy', 'no-referrer');
		box.querySelector('.live-view')!.append(f);
		box.classList.add('is-live');
		const note = box.nextElementSibling as HTMLElement | null;
		if (note?.dataset.on) {
			note.dataset.i18n = note.dataset.on;
			window.dispatchEvent(new CustomEvent('relabel'));
		}
		if (!reduce) animate(f, { opacity: [0, 1], scale: [0.985, 1], duration: 600, ease: 'outQuart' });
		f.focus();
	});
});

/* ---------- Copy email, only where the clipboard is reachable ---------- */
$$<HTMLButtonElement>('[data-copy]').forEach((b) => {
	if (!navigator.clipboard) return;
	b.hidden = false;
	b.addEventListener('click', async () => {
		await navigator.clipboard.writeText(b.dataset.copy!);
		const label = b.querySelector('span')!;
		const key = label.dataset.i18n;
		label.dataset.i18n = 'ui.copied';
		window.dispatchEvent(new CustomEvent('relabel'));
		setTimeout(() => { label.dataset.i18n = key; window.dispatchEvent(new CustomEvent('relabel')); }, 1800);
	});
});
