import { useState } from 'react';
import JobDiagram from './JobDiagram';
import { onTabKey } from './tabs';
import { caseSlug, jobThemes } from '../../data/job';
import { base, dict, type Lang } from '../../i18n';

// caseReady: whether the job case study is published in this build. A draft has no page, so
// the tile falls back to the work index instead of linking to a 404.
export default function JobTiles({ lang, caseReady }: { lang: Lang; caseReady: boolean }) {
	const t = dict(lang).job;
	const [i, setI] = useState(0);
	const cur = jobThemes[i];
	const hasCase = !!cur.hasCase && caseReady;
	const words = t.themes[cur.id];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1rem' }}>
			<div className="tiles" role="tablist" aria-label={t.label}>
				{jobThemes.map((j, k) => (
					<button key={j.id} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onKeyDown={(e) => onTabKey(e, k, jobThemes.length, setI)} aria-controls="job-panel" onClick={() => setI(k)}>
						<span className="tile-title">{t.themes[j.id].title}</span>
						{/* A pause between title and tag, so screen readers don't run them together. */}
						<span className="sr-only">. </span>
						<span className="tag">{t.themes[j.id].tag}</span>
					</button>
				))}
			</div>
			{/* The rows name each theme in a few words; the panel opens with the longer headline, which says
			    what the work achieved rather than repeating the row's name.
			    The theme's diagram fills the other half: the shape of the problem, never the real system. */}
			<div id="job-panel" role="tabpanel" aria-labelledby="job-panel-title" className="tile-panel pop-in" key={cur.id}>
				<div className="stack" style={{ ['--gap' as string]: '0.75rem' }}>
					<h3 id="job-panel-title" className="tile-headline">
						{words.headline}
					</h3>
					<p className="tile-text">{words.text}</p>
					<div className="row" style={{ ['--gap' as string]: '0.5rem' }}>
						{cur.stack.map((s) => (
							<span key={s} className="pill pill-fog">
								{s}
							</span>
						))}
					</div>
					{/* A ghost button, so the selected row stays the one violet in view. Only a published case gets a button; "see all work" would lead back to these same tiles. */}
					{hasCase && (
						<a className="btn btn-ghost" href={`${base(lang)}/work/${caseSlug}/`}>
							{t.readCase}
						</a>
					)}
				</div>
				<div className="tile-diagram">
					<JobDiagram id={cur.id} d={t.diagram} />
				</div>
			</div>
		</div>
	);
}
