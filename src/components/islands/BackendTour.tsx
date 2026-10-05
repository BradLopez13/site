import { useState } from 'react';
import { onTabKey } from './tabs';
import { backendSteps } from '../../data/reservas';
import { LINKS } from '../../consts';
import { dict, fmt, type Lang } from '../../i18n';

export default function BackendTour({ lang }: { lang: Lang }) {
	const t = dict(lang).backend;
	const [step, setStep] = useState(0);
	const cur = backendSteps[step];
	const words = t.steps[cur.id];
	return (
		<div className="tour">
			<div className="tour-line" role="tablist" aria-label={t.label}>
				<span className="tour-rail" aria-hidden="true" />
				<span className="tour-packet" aria-hidden="true" style={{ left: `calc(${(step + 0.5) * 20}% - 0.5625rem)` }} />
				{backendSteps.map((s, i) => (
					<button
						key={s.id}
						type="button"
						role="tab"
						aria-selected={i === step}
						tabIndex={i === step ? 0 : -1}
						onKeyDown={(e) => onTabKey(e, i, backendSteps.length, setStep)}
						aria-controls="tour-panel"
						onClick={() => setStep(i)}
					>
						{/* What the stop answers first, in plain words; the engineering name under it. */}
						<span className="stop-ask">{t.steps[s.id].ask}</span>
						<span className="stop-term">{t.steps[s.id].label}</span>
					</button>
				))}
			</div>
			<div id="tour-panel" role="tabpanel" aria-labelledby="tour-panel-title" className="tour-panel pop-in" key={step}>
				<div className="stack">
					<h3 id="tour-panel-title">{words.title}</h3>
					<p>{words.text}</p>
				</div>
				<figure className="code">
					{/* The file path, with a break chance after each slash so it wraps between folders, then
					    the commit it is pinned to, linked to those lines on GitHub. */}
					<figcaption>
						<span>
							{cur.file.split('/').map((part, i, all) => (
								<span key={i}>
									{part}
									{i < all.length - 1 && (
										<>
											/<wbr />
										</>
									)}
								</span>
							))}
						</span>
						<a className="code-commit" href={`${LINKS.reservasRepo}/blob/${cur.commit}/${cur.file}#L${cur.lines[0]}${cur.lines[1] > cur.lines[0] ? `-L${cur.lines[1]}` : ''}`}>
							{fmt(t.commitLabel, { commit: cur.commit })}
						</a>
					</figcaption>
					{/* Long lines scroll sideways, so the block takes focus and a name: keyboards can scroll it too. */}
					<pre tabIndex={0} role="region" aria-label={fmt(t.codeLabel, { file: cur.file })}>
						{cur.code}
					</pre>
				</figure>
			</div>
		</div>
	);
}
