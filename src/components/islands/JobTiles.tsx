import { useState } from 'react';
import { jobThemes } from '../../data/job';

export default function JobTiles() {
	const [i, setI] = useState(0);
	const cur = jobThemes[i];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1rem' }}>
			<div className="tiles" role="tablist" aria-label="Work themes">
				{jobThemes.map((j, k) => (
					<button
						key={j.id}
						type="button"
						role="tab"
						aria-selected={k === i}
						aria-controls="job-panel"
						onClick={() => setI(k)}
					>
						<span className="tag">{j.tag}</span>
						<span className="tile-title">{j.title}</span>
					</button>
				))}
			</div>
			<div id="job-panel" role="tabpanel" className="tile-panel dark pop-in" key={cur.id}>
				<div className="stack" style={{ ['--gap' as string]: '0.75rem' }}>
					<p className="tile-text">{cur.text}</p>
					<div className="row" style={{ ['--gap' as string]: '0.5rem' }}>
						{cur.stack.map((t) => (
							<span key={t} className="pill">
								{t}
							</span>
						))}
					</div>
				</div>
				<a className="btn btn-light" href={cur.href ?? '/work/'}>
					{cur.href ? 'Read the case' : 'See all work'}
				</a>
			</div>
		</div>
	);
}
