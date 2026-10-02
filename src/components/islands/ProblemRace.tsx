import { useState } from 'react';
import { dict, type Lang } from '../../i18n';

// Two requests read the same free slot. Without the constraint both insert; with EXCLUDE the second gets 23P01.
export default function ProblemRace({ lang }: { lang: Lang }) {
	const t = dict(lang).problem;
	const [fixed, setFixed] = useState(false);
	return (
		<div className="problem">
			<button type="button" aria-pressed={fixed} className={`btn ${fixed ? 'btn-ok' : 'btn-primary'}`} onClick={() => setFixed(!fixed)}>
				{fixed ? t.on : t.off}
			</button>
			<div className="problem-grid card" key={String(fixed)}>
				<strong>{t.a}</strong>
				<span className="step" style={{ animationDelay: '0s' }}>SELECT: {t.free}</span>
				<span className="step ok" style={{ animationDelay: '1s' }}>INSERT: 201</span>
				<span />
				<strong>{t.b}</strong>
				<span className="step" style={{ animationDelay: '.5s' }}>SELECT: {t.free}</span>
				<span />
				<span className={`step ${fixed ? 'warn' : 'bad'}`} style={{ animationDelay: '1.5s' }}>
					{fixed ? 'INSERT: 409, 23P01' : 'INSERT: 201'}
				</span>
				<span className="note problem-time">{t.time}</span>
			</div>
			<p className={`problem-verdict ${fixed ? 'is-ok' : 'is-bad'}`} aria-live="polite">
				{fixed ? t.saved : t.sold}
			</p>
		</div>
	);
}
