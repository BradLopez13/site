import { useState } from 'react';
import { backendSteps } from '../../data/reservas';
import { dict, type Lang } from '../../i18n';

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
						aria-controls="tour-panel"
						onClick={() => setStep(i)}
					>
						{t.steps[s.id].label}
					</button>
				))}
			</div>
			<div id="tour-panel" role="tabpanel" className="tour-panel pop-in" key={step}>
				<div className="stack">
					<h3>{words.title}</h3>
					<p>{words.text}</p>
				</div>
				<figure className="code">
					<figcaption>{cur.file}</figcaption>
					<pre>{cur.code}</pre>
				</figure>
			</div>
		</div>
	);
}
