import { useEffect, useRef, useState } from 'react';
import { dict, type Lang } from '../../i18n';

type Strategy = 'lock' | 'retry' | 'refuse';

const strategies: Strategy[] = ['lock', 'retry', 'refuse'];

// A simulation of the race test in reservas: one lane per request, one slot at the end.
// Timings are illustrative; the real test runs against PostgreSQL in Testcontainers.
export default function RaceDemo({ lang, slot = 'Pádel 1, 19:30' }: { lang: Lang; slot?: string }) {
	const t = dict(lang).race;
	const [strategy, setStrategy] = useState<Strategy>('refuse');
	const track = useRef<HTMLDivElement>(null);
	// Only decides how many lanes fit; the lane distance itself comes from CSS container units,
	// so the track is right from the first paint, before hydration.
	const [width, setWidth] = useState(1000);

	useEffect(() => {
		const el = track.current;
		if (!el) return;
		const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// 35rem, measured against the root font size so it follows the visitor's text size.
	const rem = typeof document === 'undefined' ? 16 : parseFloat(getComputedStyle(document.documentElement).fontSize);
	const small = width < 35 * rem;
	const lanes = small ? 25 : 50;
	const winner = Math.floor(lanes / 2) - 1;
	const slot_rem = small ? 5 : 9.375;

	return (
		<figure className="race-demo dark">
			<div className="race-head">
				<div className="seg" role="group" aria-label={t.label}>
					{strategies.map((s) => (
						<button key={s} type="button" aria-pressed={s === strategy} onClick={() => setStrategy(s)}>
							{t[s].label}
						</button>
					))}
				</div>
				<div className="race-legend">
					<span>
						<i className="ok" /> {t.created}
					</span>
					<span>
						<i className="warn" /> {t.occupied}
					</span>
				</div>
			</div>
			<div className="race-track" ref={track} style={{ height: `${lanes * 0.4375}rem`, ['--slot' as string]: `${slot_rem}rem` }}>
				{Array.from({ length: lanes }, (_, i) => {
					const win = i === winner;
					let d = 0;
					let q = 0;
					if (strategy === 'refuse') d = win ? 0 : ((i * 17) % 7) * 0.02;
					if (strategy === 'retry') d = win ? 0 : ((i * 13) % 9) * 0.03;
					if (strategy === 'lock') {
						d = win ? 0 : 0.05;
						q = 1.5 + (((i * 29 + 7) % lanes) * 1.4) / lanes;
					}
					return (
						<div
							key={`${strategy}-${i}`}
							className={`lane ${win ? 'win' : strategy}`}
							style={{ top: `${i * 0.4375}rem`, ['--d' as string]: `${d}s`, ['--q' as string]: `${q}s` }}
						>
							<span />
						</div>
					);
				})}
				<div className="race-wall" />
				<div className="race-slot">
					{small ? slot.split(', ').pop() : slot}
				</div>
			</div>
			<figcaption>
				{t[strategy].explain} {t.caption}
			</figcaption>
		</figure>
	);
}
