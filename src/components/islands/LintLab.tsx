import { useId, useRef, useState } from 'react';
import { dict, type Lang } from '../../i18n';
import { Btn, fill, Lab, type Entry, type Tone } from './Lab';

// One lint configuration per kind of file: where a file lives decides which limits apply to it.
// The numbers are examples; the article says so and the game says so.
type Kind = 'hook' | 'service' | 'repository' | 'model' | 'component' | 'api';
interface File {
	path: string;
	side: 'backend' | 'frontend';
	kind: Kind;
	maxLines: number;
	maxFn: number;
}

const FILES: File[] = [
	{ path: 'backend/src/hooks/audit.hook.ts', side: 'backend', kind: 'hook', maxLines: 120, maxFn: 30 },
	{ path: 'backend/src/services/booking.service.ts', side: 'backend', kind: 'service', maxLines: 250, maxFn: 50 },
	{ path: 'backend/src/repositories/booking.repository.ts', side: 'backend', kind: 'repository', maxLines: 200, maxFn: 40 },
	{ path: 'backend/src/models/booking.model.ts', side: 'backend', kind: 'model', maxLines: 150, maxFn: 30 },
	{ path: 'frontend/src/components/BookingCard.tsx', side: 'frontend', kind: 'component', maxLines: 200, maxFn: 60 },
	{ path: 'frontend/src/hooks/useBookings.ts', side: 'frontend', kind: 'hook', maxLines: 120, maxFn: 40 },
	{ path: 'frontend/src/api/bookings.api.ts', side: 'frontend', kind: 'api', maxLines: 100, maxFn: 30 },
];

// A conventional header: a known type, an optional scope, a subject with no trailing full stop.
const COMMIT = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?: \S.*[^.\s]$/;

export default function LintLab({ lang }: { lang: Lang }) {
	const t = dict(lang).labs;
	const s = t.lint;
	const id = useId();
	const [file, setFile] = useState(3);
	const [lines, setLines] = useState(180);
	const [fn, setFn] = useState(25);
	const [disable, setDisable] = useState(false);
	const [commit, setCommit] = useState(s.presets[1]);
	const [log, setLog] = useState<Entry[]>([]);
	const [pulse, setPulse] = useState({ n: 0, tone: 'info' as Tone });
	const seq = useRef(0);

	const f = FILES[file];
	const kind = s.kinds[f.kind];
	const checks = [
		{ rule: fill(s.ruleLines, { kind }), ok: lines <= f.maxLines, value: fill(s.of, { n: lines, max: f.maxLines }) },
		{ rule: fill(s.ruleFn, { kind }), ok: fn <= f.maxFn, value: fill(s.of, { n: fn, max: f.maxFn }) },
		{ rule: s.ruleDisable, ok: !disable, value: disable ? s.found : s.clean },
		{ rule: s.ruleCommit, ok: commit.length <= 72 && COMMIT.test(commit), value: COMMIT.test(commit) && commit.length <= 72 ? s.commitOk : s.commitBad },
	];
	const failed = checks.filter((c) => !c.ok);

	const run = () => {
		seq.current += 1;
		const n = seq.current;
		const tone: Tone = failed.length ? 'bad' : 'ok';
		const text = failed.length ? fill(s.fail, { n: failed.length, list: failed.map((c) => c.rule).join(', ') }) : s.pass;
		setLog((l) => [{ id: n, status: failed.length ? '✗' : '✓', tone, text }, ...l].slice(0, 5));
		setPulse({ n, tone });
	};

	const reset = () => {
		setFile(3);
		setLines(180);
		setFn(25);
		setDisable(false);
		setCommit(s.presets[1]);
		setLog([]);
		setPulse({ n: 0, tone: 'info' });
	};

	const group = (side: File['side']) =>
		FILES.map((x, i) => ({ x, i }))
			.filter(({ x }) => x.side === side)
			.map(({ x, i }) => (
				<Btn key={x.path} onClick={() => setFile(i)} pressed={i === file}>
					{s.kinds[x.kind]}
				</Btn>
			));

	return (
		<Lab
			title={s.title}
			pulse={pulse.n}
			tone={pulse.tone}
			log={log}
			logTitle={t.log}
			empty={t.empty}
			note={s.note}
			controls={
				<>
					<Btn onClick={run}>{s.run}</Btn>
					<Btn onClick={reset}>{t.reset}</Btn>
				</>
			}
			left={
				<>
					<h4>{s.change}</h4>
					<p className="lab-small">{s.backend}</p>
					<div className="lab-mini">{group('backend')}</div>
					<p className="lab-small">{s.frontend}</p>
					<div className="lab-mini">{group('frontend')}</div>
					<code className="has">{f.path}</code>
					<label className="lab-range" htmlFor={`${id}-lines`}>
						<span>
							{s.lines} <b>{lines}</b>
						</span>
						<input id={`${id}-lines`} type="range" min={10} max={400} step={5} value={lines} onChange={(e) => setLines(Number(e.target.value))} />
					</label>
					<label className="lab-range" htmlFor={`${id}-fn`}>
						<span>
							{s.fnLines} <b>{fn}</b>
						</span>
						<input id={`${id}-fn`} type="range" min={3} max={120} value={fn} onChange={(e) => setFn(Number(e.target.value))} />
					</label>
					<div className="lab-mini">
						<Btn onClick={() => setDisable((v) => !v)} pressed={disable}>
							{s.disable}
						</Btn>
					</div>
					<label className="lab-range" htmlFor={`${id}-commit`}>
						<span>{s.commit}</span>
						<input id={`${id}-commit`} className="lab-input" type="text" value={commit} onChange={(e) => setCommit(e.target.value)} spellCheck={false} />
					</label>
					<div className="lab-mini">
						{s.presets.map((p) => (
							<Btn key={p} onClick={() => setCommit(p)} pressed={commit === p}>
								{p}
							</Btn>
						))}
					</div>
				</>
			}
			right={
				<>
					<h4>{s.tools}</h4>
					<ul className="lab-checks">
						{checks.map((c) => (
							<li key={c.rule} className={c.ok ? 'ok' : 'bad'}>
								<span className={`lab-status ${c.ok ? 'ok' : 'bad'}`}>{c.ok ? '✓' : '✗'}</span>
								<span>
									<code>{c.rule}</code>
									<br />
									{c.value}
								</span>
							</li>
						))}
					</ul>
				</>
			}
		/>
	);
}
