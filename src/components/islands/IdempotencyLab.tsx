import { useRef, useState } from 'react';
import { dict, type Lang } from '../../i18n';
import { Btn, fill, hex, Lab, type Entry, type Tone } from './Lab';

// Idempotency in reservas: the key and a hash of the body are stored with the user. A finished
// result (success or a domain error below 500) is stored and replayed; a 503 deletes the record
// so the same key can run again. The EXCLUDE constraint still refuses a second booking of the slot.
type Court = 1 | 2;
interface Rec {
	court: Court;
	state: 'running' | 'done';
	status?: number;
	code?: string;
	booking?: number;
}
interface Booking {
	id: number;
	court: Court;
}

export default function IdempotencyLab({ lang }: { lang: Lang }) {
	const t = dict(lang).labs;
	const s = t.idem;
	const [key, setKey] = useState(1);
	const [court, setCourt] = useState<Court>(1);
	const [lose, setLose] = useState(false);
	const [busy, setBusy] = useState(false);
	const [seen, setSeen] = useState<string>(s.nothingYet);
	const [, render] = useState(0);
	const records = useRef(new Map<number, Rec>());
	const bookings = useRef<Booking[]>([]);
	const [log, setLog] = useState<Entry[]>([]);
	const [pulse, setPulse] = useState({ n: 0, tone: 'info' as Tone });
	const seq = useRef(0);

	const courtName = (c: Court) => (c === 1 ? s.court1 : s.court2);
	const say = (status: string, tone: Tone, text: string) => {
		seq.current += 1;
		const id = seq.current;
		setLog((l) => [{ id, status, tone, text }, ...l].slice(0, 5));
		setPulse({ n: id, tone });
	};

	// The server side of one request. Returns what the browser would receive.
	const serve = (k: number, c: Court, stillRunning = false): { status: string; tone: Tone; text: string } => {
		const rec = records.current.get(k);
		if (rec) {
			if (rec.court !== c) return { status: '422', tone: 'bad', text: s.conflict };
			if (rec.state === 'running') return { status: '409', tone: 'warn', text: s.inProgress };
			if (rec.status === 201) return { status: '201', tone: 'ok', text: fill(s.replay, { id: rec.booking! }) };
			return { status: String(rec.status), tone: 'bad', text: fill(s.replayError, { code: rec.code! }) };
		}
		records.current.set(k, { court: c, state: 'running' });
		if (stillRunning) return { status: '…', tone: 'info', text: '' };
		return finish(k, c);
	};

	const finish = (k: number, c: Court): { status: string; tone: Tone; text: string } => {
		if (busy) {
			records.current.delete(k);
			setBusy(false);
			return { status: '503', tone: 'warn', text: s.busyText };
		}
		if (bookings.current.some((b) => b.court === c)) {
			records.current.set(k, { court: c, state: 'done', status: 409, code: 'PISTA_OCUPADA' });
			return { status: '409', tone: 'bad', text: s.occupied };
		}
		const id = 100 + bookings.current.length + 1;
		bookings.current.push({ id, court: c });
		records.current.set(k, { court: c, state: 'done', status: 201, booking: id });
		return { status: '201', tone: 'ok', text: fill(s.created, { id }) };
	};

	const deliver = (r: { status: string; tone: Tone; text: string }) => {
		if (lose) {
			// Only the next response goes missing; the retry that follows gets through.
			setLose(false);
			setSeen(s.seenLost);
			say('—', 'warn', fill(s.lost, { status: r.status }));
		} else {
			setSeen(`${r.status}`);
			say(r.status, r.tone, r.text);
		}
		render((n) => n + 1);
	};

	const send = (k = key, c = court) => deliver(serve(k, c));

	const withNewKey = () => {
		const k = key + 1;
		setKey(k);
		send(k, court);
	};

	const otherCourt = () => {
		const c: Court = court === 1 ? 2 : 1;
		setCourt(c);
		send(key, c);
	};

	const doubleClick = () => {
		const first = serve(key, court, true);
		if (first.status !== '…') return deliver(first);
		// The second click arrives while the first is still being processed.
		deliver(serve(key, court));
		deliver(finish(key, court));
	};

	const reset = () => {
		records.current.clear();
		bookings.current = [];
		setKey((k) => k + 1);
		setCourt(1);
		setLose(false);
		setBusy(false);
		setSeen(s.nothingYet);
		setLog([]);
		setPulse({ n: 0, tone: 'info' });
	};

	const recs = [...records.current.entries()];

	return (
		<Lab
			title={s.title}
			pulse={pulse.n}
			tone={pulse.tone}
			log={log}
			logTitle={t.log}
			empty={t.empty}
			note={t.note}
			controls={
				<>
					<Btn onClick={() => send()}>{s.send}</Btn>
					<Btn onClick={withNewKey}>{s.newKey}</Btn>
					<Btn onClick={otherCourt}>{s.change}</Btn>
					<Btn onClick={doubleClick}>{s.double}</Btn>
					<Btn onClick={() => setLose((v) => !v)} pressed={lose}>
						{s.lose}
					</Btn>
					<Btn onClick={() => setBusy((v) => !v)} pressed={busy}>
						{s.busy}
					</Btn>
					<Btn onClick={reset}>{t.reset}</Btn>
				</>
			}
			left={
				<>
					<h4>{t.browser}</h4>
					<dl className="lab-facts">
						<dt>Idempotency-Key</dt>
						<dd>
							<code>{hex(key * 7919, 8)}-…</code>
						</dd>
						<dt>{s.body}</dt>
						<dd>{courtName(court)}</dd>
						<dt>{s.lastSeen}</dt>
						<dd>{seen}</dd>
					</dl>
				</>
			}
			right={
				<>
					<h4>{s.records}</h4>
					{recs.length === 0 ? (
						<p className="lab-empty">{s.none}</p>
					) : (
						<table className="lab-table">
							<tbody>
								{recs.map(([k, r]) => (
									<tr key={k}>
										<td>
											<code>{hex(k * 7919, 8)}</code>
										</td>
										<td>{courtName(r.court)}</td>
										<td>{r.state === 'running' ? s.running : fill(s.stored, { status: r.status! })}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
					<h4>{s.bookings}</h4>
					{bookings.current.length === 0 ? (
						<p className="lab-empty">{s.none}</p>
					) : (
						<table className="lab-table">
							<tbody>
								{bookings.current.map((b) => (
									<tr key={b.id}>
										<td>#{b.id}</td>
										<td>{courtName(b.court)}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</>
			}
		/>
	);
}
