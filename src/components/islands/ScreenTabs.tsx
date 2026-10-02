import { useState } from 'react';

export type Screen = { label: string; url: string; src: string; alt: string; width: number; height: number };

// Screenshots of the deployed app. "Open live" goes to the real thing.
export default function ScreenTabs({ screens, live }: { screens: Screen[]; live: string }) {
	const [i, setI] = useState(0);
	const cur = screens[i];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1rem' }}>
			<div className="frame">
				<div className="frame-bar">
					<span className="frame-dots" aria-hidden="true">
						<i />
						<i />
						<i />
					</span>
					<span className="frame-url">{cur.url}</span>
					<a href={live} className="frame-live">
						Open live
					</a>
				</div>
				<div className="frame-shot">
					<img
						key={cur.src}
						className="pan pop-in"
						src={cur.src}
						alt={cur.alt}
						width={cur.width}
						height={cur.height}
						loading="lazy"
						decoding="async"
					/>
				</div>
			</div>
			<div className="seg seg-plain" role="tablist" aria-label="reservas screens">
				{screens.map((s, k) => (
					<button key={s.label} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>
						{s.label}
					</button>
				))}
			</div>
		</div>
	);
}
