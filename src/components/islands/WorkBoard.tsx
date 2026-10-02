import { useState } from 'react';
import { jobThemes, type JobTheme } from '../../data/job';

// One small diagram per theme: the shape of the problem, never the real system.
function Diagram({ id }: { id: JobTheme['id'] }) {
	if (id === 'integration' || id === 'cloud') {
		const boxes =
			id === 'integration'
				? [
						['Events platform', 'bookings, attendees, fees', 'light'],
						['My normalisation layer', 'accounting terms, VAT split', 'ink'],
						['Invoicing ERP', 'simplified invoices, expenses', 'violet'],
					]
				: [
						['Client app', 'web and mobile', 'light'],
						['Cosmos DB', 'NoSQL model, designed from scratch', 'ink'],
						['Azure Storage', 'documents and files', 'violet'],
					];
		return (
			<div className="flowline">
				{boxes.map(([t, s, tone], k) => (
					<div key={t} className="flowline-item">
						{k > 0 && <span className="flow" aria-hidden="true" />}
						<div className={`flowbox ${tone}`}>
							<strong>{t}</strong>
							<span>{s}</span>
						</div>
					</div>
				))}
			</div>
		);
	}
	if (id === 'standards') {
		const layers = [
			['Hooks and components', ['max-lines', 'max-lines-per-function']],
			['Services and mappers', ['max-lines', 'complexity']],
			['Repositories and models', ['max-lines', 'no-restricted-imports']],
			['Everywhere', ['no-explicit-any', 'strict TypeScript']],
		] as const;
		return (
			<div className="stack" style={{ ['--gap' as string]: '0.5rem' }}>
				<div className="layers">
					{layers.map(([n, rules]) => (
						<div key={n} className="layer">
							<strong>{n}</strong>
							<span className="row" style={{ ['--gap' as string]: '0.375rem' }}>
								{rules.map((r) => (
									<code key={r}>{r}</code>
								))}
							</span>
						</div>
					))}
				</div>
				<span className="note">Illustrative rule names. Every layer has its own limits, and CI fails when one is broken.</span>
			</div>
		);
	}
	if (id === 'product') {
		const tenants = [
			['Company A', 'Sales, Marketing', 'violet'],
			['Company B', 'Operations', 'ink'],
			['Company C', 'Finance, HR', 'green'],
		];
		return (
			<div className="stack" style={{ ['--gap' as string]: '0.5rem' }}>
				<div className="tenants">
					{tenants.map(([n, d, tone]) => (
						<div key={n} className={`tenant ${tone}`}>
							<strong>{n}</strong>
							<span>{d}</span>
							<span className="row" style={{ ['--gap' as string]: '0.375rem' }}>
								<i>Itinerary</i>
								<i>Budget</i>
								<i>Costs</i>
							</span>
						</div>
					))}
				</div>
				<span className="note">Same app, each company and department with its own theme, roles and modules. Names are made up.</span>
			</div>
		);
	}
	return (
		<div className="people">
			{[
				['Onboarding', 'The standard, the repo, the flow'],
				['Task breakdown', 'Small, reviewable pieces'],
				['Code review', 'Every pull request'],
				['Junior developers', 'Working on their own'],
			].map(([t, s], k) => (
				<div key={t} className={k === 3 ? 'violet' : ''}>
					<strong>{t}</strong>
					<span>{s}</span>
				</div>
			))}
		</div>
	);
}

export default function WorkBoard() {
	const [i, setI] = useState(0);
	const cur = jobThemes[i];
	return (
		<div className="board">
			<div className="board-list" role="tablist" aria-orientation="vertical" aria-label="Cases">
				{jobThemes.map((j, k) => (
					<button key={j.id} type="button" role="tab" aria-selected={k === i} aria-controls="board-panel" onClick={() => setI(k)}>
						<span className="tag">{j.tag}</span>
						<span className="tile-title">{j.title}</span>
					</button>
				))}
			</div>
			<div id="board-panel" role="tabpanel" className="board-panel pop-in" key={cur.id}>
				<div className="board-head">
					<h3>{cur.headline}</h3>
					<div className="row" style={{ ['--gap' as string]: '0.375rem' }}>
						{cur.stack.map((t) => (
							<span key={t} className="pill pill-fog">
								{t}
							</span>
						))}
					</div>
				</div>
				<Diagram id={cur.id} />
				<details className="more">
					<summary>
						<span className="when-closed">Read the story</span>
						<span className="when-open">Hide the story</span>
					</summary>
					<p>{cur.text}</p>
					{cur.href && (
						<p>
							<a href={cur.href}>Read the full case</a>
						</p>
					)}
				</details>
			</div>
		</div>
	);
}
