import { useEffect, useRef, useState } from 'react';

type Strategy = 'lock' | 'retry' | 'refuse';

const strategies: { id: Strategy; label: string; explain: string }[] = [
	{ id: 'lock', label: 'Wait in line', explain: 'SELECT … FOR UPDATE locks the court: the others wait their turn, then find the slot taken.' },
	{ id: 'retry', label: 'Retry on conflict', explain: 'Nobody waits: the losers see the version changed and try again, up to three times.' },
	{ id: 'refuse', label: 'Let PostgreSQL refuse', explain: 'The EXCLUDE constraint rejects every overlapping insert with 23P01: the database decides.' },
];

// A simulation of the race test in reservas: one lane per request, one slot at the end.
// Timings are illustrative; the real test runs against PostgreSQL in Testcontainers.
export default function RaceDemo({ slot = 'Pádel 1, 19:30' }: { slot?: string }) {
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
	const current = strategies.find((s) => s.id === strategy)!;

	return (
		<figure className="race dark">
			<div className="race-head">
				<div className="seg" role="group" aria-label="Strategy">
					{strategies.map((s) => (
						<button key={s.id} type="button" aria-pressed={s.id === strategy} onClick={() => setStrategy(s.id)}>
							{s.label}
						</button>
					))}
				</div>
				<div className="race-legend">
					<span>
						<i className="ok" /> 201 Created
					</span>
					<span>
						<i className="warn" /> 409 PISTA_OCUPADA
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
				{current.explain} A simulation of the race test in reservas; timings are illustrative.
			</figcaption>
		</figure>
	);
}
