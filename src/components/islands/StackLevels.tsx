import { useState } from 'react';

// Honest levels: what I use every day, what I chose for my own projects, and what I used before or taught.
const levels = {
	daily: {
		label: 'Every day at work',
		text: 'What I ship to production at my job, week after week.',
		items: [
			['TypeScript', 'Strict, no any'],
			['React', 'With Vite'],
			['Node.js', 'Express APIs'],
			['REST APIs', 'Design and integration'],
			['MongoDB', 'Schemas from scratch'],
			['Cosmos DB', 'NoSQL modelling, SQL API'],
			['Azure Storage', 'Files and blobs'],
			['GitHub Actions', 'CI I set up'],
			['Docker', 'Local and CI'],
			['Jest', 'Unit tests'],
			['ESLint', 'Architecture as rules'],
			['Husky, Commitlint', 'Pre-merge checks'],
		],
	},
	own: {
		label: 'In my own projects',
		text: 'What I chose on purpose for reservas and casino_online, to learn it properly.',
		items: [
			['Fastify', 'reservas API'],
			['PostgreSQL', 'Locks and constraints'],
			['Drizzle', 'Migrations'],
			['Zod', 'Shared contracts'],
			['Vitest', 'Unit and integration'],
			['Testcontainers', 'Real database in tests'],
			['Playwright', 'End to end'],
			['Angular 19', 'casino_online'],
			['Firebase', 'Rules as the server'],
			['Vercel', 'Deploys'],
		],
	},
	before: {
		label: 'Used before or taught',
		text: 'Real experience, but not what I use in production today. I say so up front.',
		items: [
			['Java', 'Taught at university level'],
			['Python', 'Test automation, ADB'],
			['PHP', 'Internal tools'],
			['MySQL', 'Small schemas, ER design'],
			['Power BI', 'Analytical SQL'],
			['Android Studio', 'Mobile'],
		],
	},
};
type Id = keyof typeof levels;

export default function StackLevels() {
	const [id, setId] = useState<Id>('daily');
	const cur = levels[id];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.5rem' }}>
			<div className="seg" role="tablist" aria-label="How I use it" style={{ alignSelf: 'flex-start', maxWidth: '100%' }}>
				{(Object.keys(levels) as Id[]).map((k) => (
					<button key={k} type="button" role="tab" aria-selected={k === id} onClick={() => setId(k)}>
						{levels[k].label}
					</button>
				))}
			</div>
			<p className="muted">{cur.text}</p>
			<ul className="skills" key={id} role="tabpanel">
				{cur.items.map(([name, note]) => (
					<li key={name}>
						<strong>{name}</strong>
						<span>{note}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
