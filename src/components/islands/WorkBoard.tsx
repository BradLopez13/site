import { useState } from 'react';
import { onTabKey } from './tabs';
import JobDiagram from './JobDiagram';
import { caseSlug, jobThemes } from '../../data/job';
import { base, dict, type Lang } from '../../i18n';

// caseReady: whether the job case study is published in this build; drafts have no page.
export default function WorkBoard({ lang, caseReady }: { lang: Lang; caseReady: boolean }) {
	const all = dict(lang);
	const t = all.job;
	const [i, setI] = useState(0);
	const cur = jobThemes[i];
	const words = t.themes[cur.id];
	return (
		<div className="board">
			<div className="board-list" role="tablist" aria-orientation="vertical" aria-label={all.work.casesLabel}>
				{jobThemes.map((j, k) => (
					<button key={j.id} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onKeyDown={(e) => onTabKey(e, k, jobThemes.length, setI)} aria-controls="board-panel" onClick={() => setI(k)}>
						<span className="tile-title">{t.themes[j.id].title}</span>
						<span className="tag">{t.themes[j.id].tag}</span>
					</button>
				))}
			</div>
			<div id="board-panel" role="tabpanel" className="board-panel pop-in" key={cur.id}>
				<div className="board-head">
					<h3>{words.headline}</h3>
					<div className="row" style={{ ['--gap' as string]: '0.375rem' }}>
						{cur.stack.map((s) => (
							<span key={s} className="pill pill-fog">
								{s}
							</span>
						))}
					</div>
				</div>
				<JobDiagram id={cur.id} d={t.diagram} />
				<details className="more">
					<summary>
						<span className="when-closed">{all.common.readStory}</span>
						<span className="when-open">{all.common.hideStory}</span>
					</summary>
					<p>{words.text}</p>
					{cur.hasCase && caseReady && (
						<p>
							<a href={`${base(lang)}/work/${caseSlug}/`}>{t.readFullCase}</a>
						</p>
					)}
				</details>
			</div>
		</div>
	);
}
