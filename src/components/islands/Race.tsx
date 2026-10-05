import { createTimeline } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { LINKS } from '../../consts';
import { useT } from '../../i18n/store';
import { iconSvg } from '../../icons';

// The race from the Reservas test suite: fifty requests leave at once, the database lets one through.
const WINNER = 23;
const order = Array.from({ length: 50 }, (_, i) => ((i * 37) % 50) * 14);
const token = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export default function Race() {
	const tr = useT();
	const grid = useRef<HTMLDivElement>(null);
	const [runs, setRuns] = useState(0);
	const [done, setDone] = useState(false);
	// The server renders the button disabled; it works once the island has hydrated.
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);

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
			<div ref={grid} className={done ? 'race done' : 'race'} role="img" aria-label={done ? tr('race.ariaDone') : tr('race.aria')} data-i18n-attr={done ? undefined : 'aria-label:race.aria'}>
				{Array.from({ length: 50 }, (_, i) => (
					<i key={i} className={i === WINNER ? 'win' : undefined} />
				))}
			</div>
			<div className="flex flex-col gap-[0.8rem]">
				<b data-i18n="race.people">{tr('race.people')}</b>
				<span className="mono muted text-[0.9rem]" aria-live="polite">
					{done ? '1 × 201 Created, 49 × 409 PISTA_OCUPADA' : <span data-i18n="race.ready">{tr('race.ready')}</span>}
				</span>
				<button className="btn btn-ink" type="button" onClick={run} disabled={!ready}>
					<i className="ico-box" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg(runs ? 'repeat' : 'flag') }} />
					<span data-i18n={runs ? undefined : 'race.run'}>{runs ? tr('race.again') : tr('race.run')}</span>
				</button>
				<a href={LINKS.raceTest} className="inline-flex items-center gap-[0.4rem]">
					<i className="ico-box" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg('github') }} />
					<span data-i18n="race.test">{tr('race.test')}</span>
				</a>
			</div>
		</div>
	);
}
