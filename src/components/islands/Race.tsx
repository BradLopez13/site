import { createTimeline } from 'animejs';
import { useRef, useState } from 'react';
import { useT } from '../../i18n/store';

// The race from the Reservas test suite: fifty requests leave at once, the database lets one through.
const WINNER = 23;
const order = Array.from({ length: 50 }, (_, i) => ((i * 37) % 50) * 14);
const token = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export default function Race() {
	const tr = useT();
	const grid = useRef<HTMLDivElement>(null);
	const [runs, setRuns] = useState(0);
	const [done, setDone] = useState(false);

	function run() {
		const dots = Array.from(grid.current!.children) as HTMLElement[];
		setDone(false);
		dots.forEach((d) => {
			d.style.removeProperty('background-color');
			d.style.removeProperty('transform');
		});
		const finish = () => {
			dots.forEach((d) => d.style.removeProperty('background-color'));
			setDone(true);
			setRuns((r) => r + 1);
		};
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
		const tl = createTimeline();
		dots.forEach((d, i) => tl.add(d, { scale: [1, 0.6, 1], duration: 380, ease: 'outQuad' }, order[i] * 0.4));
		dots.forEach((d, i) => {
			if (i !== WINNER) tl.add(d, { backgroundColor: [token('--fg'), token('--refused')], duration: 420, ease: 'outQuad' }, 300 + order[i]);
		});
		tl.add(dots[WINNER], { backgroundColor: [token('--fg'), token('--accent')], scale: [1, 1.4], duration: 900, ease: 'outBack' }, 1100);
		tl.then(finish);
	}

	return (
		<div className="race-box">
			<div ref={grid} className={done ? 'race done' : 'race'} role="img" aria-label={done ? tr('race.ariaDone') : tr('race.aria')}>
				{Array.from({ length: 50 }, (_, i) => (
					<i key={i} className={i === WINNER ? 'win' : undefined} />
				))}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
				<b>{tr('race.people')}</b>
				<span className="mono muted" style={{ fontSize: '.9rem' }} aria-live="polite">
					{done ? '1 × 201 Created, 49 × 409 PISTA_OCUPADA' : tr('race.ready')}
				</span>
				<button className="btn btn-ink" type="button" onClick={run}>
					<span>{runs ? tr('race.again') : tr('race.run')}</span>
				</button>
				<a href="https://github.com/BradLopez13/reservas">{tr('race.test')}</a>
			</div>
		</div>
	);
}
