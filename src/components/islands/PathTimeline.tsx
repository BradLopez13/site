import { useState } from 'react';
import { pathStops, pathTags } from '../../data/job';
import { dict, type Lang } from '../../i18n';

export default function PathTimeline({ lang }: { lang: Lang }) {
	const t = dict(lang).about;
	const [i, setI] = useState(pathStops.length - 1);
	const id = pathStops[i];
	const cur = t.path[id];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.5rem' }}>
			<div className="path" role="tablist" aria-label={t.pathLabel}>
				<span className="path-rail" aria-hidden="true" />
				{pathStops.map((s, k) => (
					<button key={s} type="button" role="tab" aria-selected={k === i} aria-controls="path-panel" onClick={() => setI(k)}>
						<span className="path-dot" aria-hidden="true" />
						<span className="tag">{t.path[s].when}</span>
						<span className="tile-title">{t.path[s].short}</span>
					</button>
				))}
			</div>
			<div id="path-panel" role="tabpanel" className="path-panel dark pop-in" key={id}>
				<div className="stack" style={{ ['--gap' as string]: '0.625rem' }}>
					<h3>{cur.title}</h3>
					<p>{cur.text}</p>
				</div>
				<div className="row" style={{ ['--gap' as string]: '0.375rem' }}>
					{pathTags[id].map((tag) => (
						<span key={tag} className="pill">
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
