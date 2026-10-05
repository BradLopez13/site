import { useRef, useState } from 'react';
import { dict, type Lang } from '../../i18n';
import { Btn, fill, Lab, type Entry, type Tone } from './Lab';

// The login limiter in reservas, before and after commit 4b5d840. Before: one counter per email and IP,
// and without trusting the proxy every request arrived from the platform's address. After: the last proxy
// hop is trusted, and there are three counters. Each attempt is recorded before counting; a rejected
// attempt is removed again; a successful login clears the email counters but not the IP one.
type Mode = 'before' | 'after';
type Kind = 'emailIp' | 'ip' | 'email';
const MAX: Record<Kind, number> = { emailIp: 5, ip: 20, email: 50 };
const PROXY = '10.0.0.1';
const IP = { ana: '83.45.12.7', attacker: '185.220.4.9' };

export default function LimiterLab({ lang }: { lang: Lang }) {
	const t = dict(lang).labs;
	const s = t.limit;
	const [mode, setMode] = useState<Mode>('before');
	const counters = useRef(new Map<string, { kind: Kind; label: string; n: number }>());
	const [, render] = useState(0);
	const [log, setLog] = useState<Entry[]>([]);
	const [pulse, setPulse] = useState({ n: 0, tone: 'info' as Tone });
	const seq = useRef(0);
	const sprayed = useRef(0);

	const say = (status: string, tone: Tone, text: string) => {
		seq.current += 1;
		const id = seq.current;
		setLog((l) => [{ id, status, tone, text }, ...l].slice(0, 5));
		setPulse({ n: id, tone });
	};

	const seenIp = (who: keyof typeof IP) => (mode === 'before' ? PROXY : IP[who]);

	// One login attempt. Returns the HTTP status and, when refused, which counter refused it.
	const attempt = (who: keyof typeof IP, email: string, correct: boolean): { status: number; kind?: Kind } => {
		const ip = seenIp(who);
		const keys: [Kind, string, string][] =
			mode === 'before'
				? [['emailIp', `email-ip|${email}|${ip}`, `${email} + ${ip}`]]
				: [
						['emailIp', `email-ip|${email}|${ip}`, `${email} + ${ip}`],
						['ip', `ip|${ip}`, ip],
						['email', `email|${email}`, email],
					];
		for (const [kind, k, label] of keys) {
			const c = counters.current.get(k) ?? { kind, label, n: 0 };
			counters.current.set(k, { ...c, n: c.n + 1 });
		}
		const over = keys.find(([kind, k]) => counters.current.get(k)!.n > MAX[kind]);
		if (over) {
			for (const [, k] of keys) counters.current.get(k)!.n -= 1;
			return { status: 429, kind: over[0] };
		}
		if (!correct) return { status: 401 };
		for (const [kind, k] of keys) if (kind !== 'ip') counters.current.delete(k);
		return { status: 200 };
	};

	const attack = () => {
		const results = Array.from({ length: 5 }, () => attempt('attacker', 'ana@', false));
		const refused = results.filter((r) => r.status === 429).length;
		say(refused ? '429' : '401', refused ? 'warn' : 'bad', fill(s.attackDone, { fails: 5 - refused, refused }));
		render((n) => n + 1);
	};

	const ana = () => {
		const r = attempt('ana', 'ana@', true);
		if (r.status === 429) say('429', 'bad', fill(s.anaBlocked, { kind: s[r.kind!], max: MAX[r.kind!] }));
		else say('200', 'ok', s.anaOk);
		render((n) => n + 1);
	};

	const spray = () => {
		let refused = 0;
		for (let i = 0; i < 25; i++) {
			sprayed.current += 1;
			if (attempt('attacker', `user${sprayed.current}@`, false).status === 429) refused++;
		}
		say(refused ? '429' : '401', refused ? 'warn' : 'bad', fill(refused ? s.sprayBlocked : s.sprayFree, { refused }));
		render((n) => n + 1);
	};

	const switchMode = (m: Mode) => {
		setMode(m);
		counters.current.clear();
		sprayed.current = 0;
		setLog([]);
		setPulse({ n: 0, tone: 'info' });
	};

	// Long lists of single-use counters (one per sprayed email) are summarised in one row.
	const rows = [...counters.current.values()].filter((c) => c.n > 0);
	const shown = rows.filter((c) => !c.label.startsWith('user'));
	const hidden = rows.length - shown.length;

	return (
		<Lab
			title={s.title}
			pulse={pulse.n}
			tone={pulse.tone}
			log={log}
			logTitle={t.log}
			empty={t.empty}
			note={t.note}
			mode={
				<>
					<Btn onClick={() => switchMode('before')} pressed={mode === 'before'}>
						{s.before}
					</Btn>
					<Btn onClick={() => switchMode('after')} pressed={mode === 'after'}>
						{s.after}
					</Btn>
				</>
			}
			controls={
				<>
					<Btn onClick={attack}>{s.actAttack}</Btn>
					<Btn onClick={ana}>{s.actAna}</Btn>
					<Btn onClick={spray}>{s.actSpray}</Btn>
					<Btn onClick={() => switchMode(mode)}>{t.reset}</Btn>
				</>
			}
			left={
				<>
					<h4>{s.sees}</h4>
					<dl className="lab-facts">
						<dt>{s.ana}</dt>
						<dd>
							<code>{IP.ana}</code> → <code className={mode === 'before' ? 'warn' : 'has'}>{seenIp('ana')}</code>
						</dd>
						<dt>{s.attacker}</dt>
						<dd>
							<code>{IP.attacker}</code> → <code className={mode === 'before' ? 'warn' : 'has'}>{seenIp('attacker')}</code>
						</dd>
					</dl>
					<p className="lab-small">{mode === 'before' ? fill(s.explainBefore, { ip: PROXY }) : s.explainAfter}</p>
				</>
			}
			right={
				<>
					<h4>{s.counters}</h4>
					{rows.length === 0 ? (
						<p className="lab-empty">{s.none}</p>
					) : (
						<ul className="lab-counters">
							{shown.map((c) => (
								<li key={c.kind + c.label} className={c.n >= MAX[c.kind] ? 'full' : ''}>
									<span>
										<b>{s[c.kind]}</b> <code>{c.label}</code>
									</span>
									<span className="lab-count">
										{c.n}/{MAX[c.kind]}
									</span>
									<span className="lab-bar" aria-hidden="true">
										<i style={{ width: `${Math.min(100, (c.n / MAX[c.kind]) * 100)}%` }} />
									</span>
								</li>
							))}
							{hidden > 0 && <li className="lab-small">{fill(s.more, { n: hidden })}</li>}
						</ul>
					)}
				</>
			}
		/>
	);
}
