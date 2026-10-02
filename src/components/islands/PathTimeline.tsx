import { useState } from 'react';

const stops = [
	{ when: '2021 to 2023', short: 'DAM degree', title: 'Multiplatform application development (DAM)', text: 'Where I started: Java, databases, desktop and mobile apps.', tags: ['Java', 'SQL', 'Android'] },
	{ when: '2023 to 2025', short: 'DAW degree and tutoring', title: 'Web application development (DAW)', text: 'Final project: casino_online. At the same time, private tutor in Java and Python for university students.', tags: ['Angular', 'Firebase', 'Teaching'] },
	{ when: '2024', short: 'Junior at DELOGICA', title: 'Junior Developer, DELOGICA', text: 'Scrum team. Test automation for Android TV with Python and ADB, web automation scripts and process automation.', tags: ['Python', 'ADB', 'Scrum'] },
	{ when: '2025', short: 'Intern at MrGates', title: 'Intern Developer, MrGates', text: 'Internal full-stack tools in PHP and JavaScript, with small relational schemas taken from ER diagram to MySQL.', tags: ['PHP', 'MySQL', 'Docker'] },
	{ when: '2025 to today', short: 'Full-stack developer', title: 'Full Stack Developer and Engineering Support', text: 'Current company, Madrid. Integrations, a multi-tenant events platform, the team’s engineering standard and CI, and mentoring two interns into junior developers.', tags: ['TypeScript', 'React', 'Node.js', 'Azure'] },
];

export default function PathTimeline() {
	const [i, setI] = useState(stops.length - 1);
	const cur = stops[i];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.5rem' }}>
			<div className="path" role="tablist" aria-label="Path">
				<span className="path-rail" aria-hidden="true" />
				{stops.map((s, k) => (
					<button key={s.when + s.short} type="button" role="tab" aria-selected={k === i} aria-controls="path-panel" onClick={() => setI(k)}>
						<span className="path-dot" aria-hidden="true" />
						<span className="tag">{s.when}</span>
						<span className="tile-title">{s.short}</span>
					</button>
				))}
			</div>
			<div id="path-panel" role="tabpanel" className="path-panel dark pop-in" key={i}>
				<div className="stack" style={{ ['--gap' as string]: '0.625rem' }}>
					<h3>{cur.title}</h3>
					<p>{cur.text}</p>
				</div>
				<div className="row" style={{ ['--gap' as string]: '0.375rem' }}>
					{cur.tags.map((t) => (
						<span key={t} className="pill">
							{t}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
