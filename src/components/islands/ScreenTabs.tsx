import { useState } from 'react';
import { onTabKey } from './tabs';

export type Screen = { label: string; url: string; src: string; alt: string; width: number; height: number };

// Screenshots of the deployed app. The "Open the app" button beside them goes to the real thing.
export default function ScreenTabs({ screens, tabsLabel }: { screens: Screen[]; tabsLabel: string }) {
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
				</div>
				<div className="frame-shot" id="screen-panel" role="tabpanel" aria-label={cur.label}>
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
			<div className="seg seg-plain" role="tablist" aria-label={tabsLabel}>
				{screens.map((s, k) => (
					<button key={s.label} type="button" role="tab" aria-selected={k === i} aria-controls="screen-panel" tabIndex={k === i ? 0 : -1} onKeyDown={(e) => onTabKey(e, k, screens.length, setI)} onClick={() => setI(k)}>
						{s.label}
					</button>
				))}
			</div>
		</div>
	);
}
