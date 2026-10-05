import { createTimeline, svg } from 'animejs';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { pick, type Key } from '../../i18n';
import en from '../../i18n/en.json';
import es from '../../i18n/es.json';
import { useT } from '../../i18n/store';
import Chain from './Chain';

// Brad's professional work as tabs: each theme opens a panel whose diagram draws in the order data travels.
const ids = ['integration', 'standards', 'product', 'cloud', 'people'] as const;
type Id = (typeof ids)[number];
const stacks: Record<Id, string[]> = {
	integration: ['TypeScript', 'Node.js', 'Express'],
	standards: ['ESLint', 'GitHub Actions', 'Husky', 'Commitlint'],
	product: ['React', 'Vite', 'Express', 'MongoDB'],
	cloud: ['Azure Cosmos DB', 'Azure Storage'],
	people: ['Mentoring', 'Code review'],
};
// The steps that are Brad's own in each diagram are highlighted.
const mine: Record<Id, number[]> = { integration: [1], standards: [1, 2], product: [1], cloud: [1], people: [1, 2] };

export default function WorkThemes({ prefix = 'home', level = 3, caseHref }: { prefix?: string; level?: 2 | 3; caseHref?: string }) {
	const tr = useT();
	const [sel, setSel] = useState(0);
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const panel = useRef<HTMLDivElement>(null);
	const first = useRef(true);
	const H = `h${level}` as 'h2' | 'h3';
	const dict = tr.lang === 'es' ? es : en;

	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !panel.current) return;
		const nodes = Array.from(panel.current.querySelectorAll<SVGGElement>('.node'));
		const wires = Array.from(panel.current.querySelectorAll<SVGPathElement>('.wire'));
		const tl = createTimeline({ defaults: { ease: 'outQuart' } });
		tl.add(panel.current, { opacity: [0, 1], y: ['0.625rem', '0rem'], duration: 450 }, 0);
		nodes.forEach((n, i) => tl.add(n, { opacity: [0, 1], y: ['0.625rem', '0rem'], duration: 450 }, 120 + i * 220));
		wires.forEach((wire, i) => tl.add(svg.createDrawable(wire), { draw: ['0 0', '0 1'], duration: 520, ease: 'inOutQuad' }, 300 + i * 220));
	}, [sel]);

	function onKey(e: KeyboardEvent, i: number) {
		const n = ids.length;
		const moves: Record<string, number> = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i - 1 + n) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
		const j = moves[e.key];
		if (j === undefined) return;
		e.preventDefault();
		setSel(j);
		tabs.current[j]?.focus();
	}

	const id = ids[sel];
	const k = (s: string) => `themes.${id}.${s}` as Key;
	const nodes = pick(dict, `themes.${id}.n`) as string[][];

	return (
		<div className="themes">
			<div className="theme-list" role="tablist" aria-label={tr('themes.label')}>
				{ids.map((t, i) => (
					<button
						key={t}
						ref={(el) => {
							tabs.current[i] = el;
						}}
						className="theme"
						type="button"
						role="tab"
						id={`${prefix}-tab-${t}`}
						aria-controls={`${prefix}-panel`}
						aria-selected={i === sel}
						tabIndex={i === sel ? 0 : -1}
						onClick={() => setSel(i)}
						onKeyDown={(e) => onKey(e, i)}
					>
						<span className="t">{tr(`themes.${t}.t` as Key)}</span>
						<span className="k">{tr(`themes.${t}.k` as Key)}</span>
					</button>
				))}
			</div>
			<div ref={panel} className="theme-panel" role="tabpanel" id={`${prefix}-panel`} aria-labelledby={`${prefix}-tab-${id}`}>
				<H className="disp h-s h-panel">
					{tr(k('h'))}
				</H>
				<p className="muted" style={{ margin: '1rem 0 0' }}>
					{tr(k('d'))}
				</p>
				<Chain nodes={nodes} label={tr(k('a'))} me={mine[id]} />
				<ul className="pills">
					{stacks[id].map((s) => (
						<li key={s}>{s}</li>
					))}
				</ul>
				{id === 'integration' && caseHref && (
					<p style={{ margin: '1.5rem 0 0' }}>
						<a className="btn btn-line btn-sm" href={caseHref}>
							<span>{tr('ui.readCase')}</span>
						</a>
					</p>
				)}
			</div>
		</div>
	);
}
