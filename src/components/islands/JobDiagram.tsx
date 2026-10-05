import { layerRules, type JobId } from '../../data/job';
import type { Dict } from '../../i18n';

// One small diagram per theme: the shape of the problem, never the real system.
export default function JobDiagram({ id, d }: { id: JobId; d: Dict['job']['diagram'] }) {
	if (id === 'integration' || id === 'cloud') {
		// His layer is the espresso box between two fog ones; violet stays for actions and selection.
		const tones = ['light', 'ink', 'light'];
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
		const tones = ['ink', 'light', 'violet'];
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
