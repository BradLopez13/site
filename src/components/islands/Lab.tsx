import type { ReactNode } from 'react';

// Shared frame for the article mini games: a title, the controls, the browser and the server side by side
// with a request travelling between them, and a short log of what just happened.
export type Tone = 'ok' | 'bad' | 'warn' | 'info';
export interface Entry {
	id: number;
	status: string;
	tone: Tone;
	text: string;
}

export function Lab(props: {
	title: string;
	/** A mode switch shown beside the title, apart from the actions. */
	mode?: ReactNode;
	controls: ReactNode;
	left: ReactNode;
	right: ReactNode;
	pulse: number;
	tone: Tone;
	log: Entry[];
	logTitle: string;
	empty: string;
	note: string;
}) {
	const { title, mode, controls, left, right, pulse, tone, log, logTitle, empty, note } = props;
	return (
		<figure className="lab dark">
			<div className="lab-head">
				<p className="lab-title">{title}</p>
				{mode && <div className="lab-mode">{mode}</div>}
			</div>
			<div className="lab-actions">{controls}</div>
			<div className="lab-stage">
				<div className="lab-panel">{left}</div>
				<div className="lab-wire" aria-hidden="true">
					{pulse > 0 && <i key={pulse} className={`lab-packet ${tone}`} />}
				</div>
				<div className="lab-panel">{right}</div>
			</div>
			<div className="lab-panel">
				<h4>{logTitle}</h4>
				<ol className="lab-log" aria-live="polite">
					{log.length === 0 ? (
						<li className="lab-empty">{empty}</li>
					) : (
						log.map((e) => (
							<li key={e.id}>
								<span className={`lab-status ${e.tone}`}>{e.status}</span>
								<span>{e.text}</span>
							</li>
						))
					)}
				</ol>
			</div>
			<figcaption className="lab-note">{note}</figcaption>
		</figure>
	);
}

export function Btn(props: { onClick: () => void; children: ReactNode; pressed?: boolean; disabled?: boolean }) {
	return (
		<button type="button" onClick={props.onClick} aria-pressed={props.pressed} disabled={props.disabled}>
			{props.children}
		</button>
	);
}

/** Replaces {name} placeholders. */
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));

/** A short hex string that looks like a token or a hash; deterministic per seed so it reads stable. */
export function hex(seed: number, len = 8) {
	let x = (seed * 2654435761) >>> 0;
	let out = '';
	while (out.length < len) {
		x = (x ^ (x << 13)) >>> 0;
		x = (x ^ (x >>> 17)) >>> 0;
		x = (x ^ (x << 5)) >>> 0;
		out += x.toString(16).padStart(8, '0');
	}
	return out.slice(0, len);
}
