import { useState } from 'react';
import { onTabKey } from './tabs';
import { caseSlug, jobThemes, layerRules, type JobId } from '../../data/job';
import { base, dict, type Dict, type Lang } from '../../i18n';

// One small diagram per theme: the shape of the problem, never the real system.
function Diagram({ id, d }: { id: JobId; d: Dict['job']['diagram'] }) {
	if (id === 'integration' || id === 'cloud') {
		const tones = ['light', 'ink', 'violet'];
		return (
			<div className="flowline">
				{d[id].map(([title, sub], k) => (
					<div key={title} className="flowline-item">
						{k > 0 && <span className="flow" aria-hidden="true" />}
						<div className={`flowbox ${tones[k]}`}>
							<strong>{title}</strong>
							<span>{sub}</span>
						</div>
					</div>
				))}
			</div>
		);
	}
	if (id === 'standards') {
		return (
			<div className="stack" style={{ ['--gap' as string]: '0.5rem' }}>
				<div className="layers">
					{d.layers.map((name, k) => (
						<div key={name} className="layer">
							<strong>{name}</strong>
							<span className="row" style={{ ['--gap' as string]: '0.375rem' }}>
								{layerRules[k].map((r) => (
									<code key={r}>{r}</code>
								))}
							</span>
						</div>
					))}
				</div>
				<span className="note">{d.layersNote}</span>
			</div>
		);
	}
	if (id === 'product') {
		const tones = ['violet', 'ink', 'green'];
		return (
			<div className="stack" style={{ ['--gap' as string]: '0.5rem' }}>
				<div className="tenants">
					{d.tenants.map(([name, detail], k) => (
						<div key={name} className={`tenant ${tones[k]}`}>
							<strong>{name}</strong>
							<span>{detail}</span>
							<span className="row" style={{ ['--gap' as string]: '0.375rem' }}>
								{d.modules.map((m) => (
									<i key={m}>{m}</i>
								))}
							</span>
						</div>
					))}
				</div>
				<span className="note">{d.tenantsNote}</span>
			</div>
		);
	}
	return (
		<div className="people">
			{d.people.map(([title, sub], k) => (
				<div key={title} className={k === 3 ? 'violet' : ''}>
					<strong>{title}</strong>
					<span>{sub}</span>
				</div>
			))}
		</div>
	);
}

export default function WorkBoard({ lang }: { lang: Lang }) {
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
						<span className="tag">{t.themes[j.id].tag}</span>
						<span className="tile-title">{t.themes[j.id].title}</span>
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
				<Diagram id={cur.id} d={t.diagram} />
				<details className="more">
					<summary>
						<span className="when-closed">{all.common.readStory}</span>
						<span className="when-open">{all.common.hideStory}</span>
					</summary>
					<p>{words.text}</p>
					{cur.hasCase && (
						<p>
							<a href={`${base(lang)}/work/${caseSlug}/`}>{t.readFullCase}</a>
						</p>
					)}
				</details>
			</div>
		</div>
	);
}
