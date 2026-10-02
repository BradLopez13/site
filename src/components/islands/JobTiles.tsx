import { useState } from 'react';
import { caseSlug, jobThemes } from '../../data/job';
import { base, dict, type Lang } from '../../i18n';

export default function JobTiles({ lang }: { lang: Lang }) {
	const t = dict(lang).job;
	const [i, setI] = useState(0);
	const cur = jobThemes[i];
	const words = t.themes[cur.id];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1rem' }}>
			<div className="tiles" role="tablist" aria-label={t.label}>
				{jobThemes.map((j, k) => (
					<button key={j.id} type="button" role="tab" aria-selected={k === i} aria-controls="job-panel" onClick={() => setI(k)}>
						<span className="tag">{t.themes[j.id].tag}</span>
						<span className="tile-title">{t.themes[j.id].title}</span>
					</button>
				))}
			</div>
			<div id="job-panel" role="tabpanel" className="tile-panel dark pop-in" key={cur.id}>
				<div className="stack" style={{ ['--gap' as string]: '0.75rem' }}>
					<p className="tile-text">{words.text}</p>
					<div className="row" style={{ ['--gap' as string]: '0.5rem' }}>
						{cur.stack.map((s) => (
							<span key={s} className="pill">
								{s}
							</span>
						))}
					</div>
				</div>
				<a className="btn btn-light" href={`${base(lang)}/work/${cur.hasCase ? `${caseSlug}/` : ''}`}>
					{cur.hasCase ? t.readCase : t.seeAll}
				</a>
			</div>
		</div>
	);
}
