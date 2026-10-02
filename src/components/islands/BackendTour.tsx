import { useState } from 'react';
import { backendSteps } from '../../data/reservas';

export default function BackendTour() {
	const [step, setStep] = useState(0);
	const cur = backendSteps[step];
	return (
		<div className="tour">
			<div className="tour-line" role="tablist" aria-label="Stops">
				<span className="tour-rail" aria-hidden="true" />
				<span className="tour-packet" aria-hidden="true" style={{ left: `calc(${(step + 0.5) * 20}% - 0.5625rem)` }} />
				{backendSteps.map((s, i) => (
					<button
						key={s.label}
						type="button"
						role="tab"
						aria-selected={i === step}
						aria-controls="tour-panel"
						onClick={() => setStep(i)}
					>
						{s.label}
					</button>
				))}
			</div>
			<div id="tour-panel" role="tabpanel" className="tour-panel pop-in" key={step}>
				<div className="stack">
					<h3>{cur.title}</h3>
					<p>{cur.text}</p>
				</div>
				<figure className="code">
					<figcaption>{cur.file}</figcaption>
					<pre>{cur.code}</pre>
				</figure>
			</div>
		</div>
	);
}
