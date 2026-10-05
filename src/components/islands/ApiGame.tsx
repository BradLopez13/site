import { useEffect, useRef, useState } from 'react';
import { created, occupied, pista, requestBody, slotTimes } from '../../data/reservas';
import { LINKS } from '../../consts';
import { dict, fmt, type Lang } from '../../i18n';

// last: what the client sent most recently. 'race' is the first send; 'same' and 'new' are the two
// ways to retry the winning request. step counts every send, so each answer pops in fresh.
type Race = { id: number; rank: number; won: boolean; key: string; winnerKey: string; newKey: string; last: 'race' | 'same' | 'new'; newTried: boolean; step: number };
type Slot = ReturnType<typeof slotTimes>;

const LANES = 50;

// "9th of 50", not "9 of 50". Spanish says "el puesto 9", so only English needs it.
const suffixes: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const ordinal = (n: number) => `${n}${suffixes[new Intl.PluralRules('en', { type: 'ordinal' }).select(n)]}`;

// A simulation in the browser with the real request and response shapes of reservas.
// It never calls the live API: fifty fake bookings would land in the demo database.
// Losing the race is the normal outcome, so the second step is always about the winning request:
// its 201 is lost on the way back and the visitor chooses how its app retries. A new key looks like
// a new booking and gets a 409 against the booking that already worked; the same key gets the stored
// 201. Either way the booking count stays at 1, and the visitor learns it by choosing.
// The counters are the API's: every request in the race, and the bookings it made for the slot.
// buildSlot is the slot computed when the page was built, so the first render matches the HTML;
// it moves to tomorrow's slot as soon as the island runs.
export default function ApiGame({ lang, buildSlot }: { lang: Lang; buildSlot: Slot }) {
	const t = dict(lang).game;
	const [slot, setSlot] = useState(buildSlot);
	useEffect(() => setSlot(slotTimes()), []);
	const [race, setRace] = useState<Race | null>(null);
	const [requests, setRequests] = useState(0);
	const [booked, setBooked] = useState(0);
	const actions = useRef<HTMLDivElement>(null);
	// The button just pressed is replaced by the next step's buttons; keep keyboard focus there
	// instead of letting it fall back to the top of the page.
	const keepFocus = useRef(false);

	// On a phone the verdict would land below the fold; bring it into view after each send.
	useEffect(() => {
		// Bring the next step into view (the verdict sits just above it), then move focus there
		// without a second scroll fighting the first. The next step is always a button: at the end
		// that is "Start over", so one more Enter never opens the mail app by surprise.
		if (race) actions.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		if (keepFocus.current) actions.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
		keepFocus.current = false;
	}, [race?.id, race?.step]);

	const send = () => {
		keepFocus.current = true;
		const rank = 1 + Math.floor(Math.random() * LANES);
		const won = rank === 1;
		const key = crypto.randomUUID();
		setRace({ id: (race?.id ?? 0) + 1, rank, won, key, winnerKey: won ? key : crypto.randomUUID(), newKey: '', last: 'race', newTried: false, step: 0 });
		// Fifty requests reach the API and exactly one booking comes out of them.
		setRequests(LANES);
		setBooked(1);
	};
	// Neither retry creates a second booking, so neither touches `booked`.
	const retry = (how: 'same' | 'new') => {
		if (!race) return;
		keepFocus.current = true;
		setRace({ ...race, last: how, newKey: how === 'new' ? crypto.randomUUID() : race.newKey, newTried: race.newTried || how === 'new', step: race.step + 1 });
		setRequests((n) => n + 1);
	};
	const reset = () => {
		keepFocus.current = true;
		setRace(null);
		setRequests(0);
		setBooked(0);
	};

	const replayed = race?.last === 'same';
	const newKey = race?.last === 'new';
	// After a retry the client shows the winner's request, whoever won: the stored 201 for the same
	// key, a 409 for a new one.
	const shownWon = !!race && (replayed || (race.last === 'race' && race.won));
	const shownKey = !race ? '—' : race.last === 'race' ? race.key : race.last === 'same' ? race.winnerKey : race.newKey;
	// The counters sit above the request and scroll away on a phone; the lesson repeats them.
	const tally = `${t.requests}: ${requests} · ${t.booked}: ${booked}.`;
	const verdict = !race
		? ''
		: replayed
			? race.won
				? t.replayWin
				: t.replayLose
			: newKey
				? race.won
					? t.newKeyWin
					: t.newKeyLose
				: race.won
					? t.win
					: fmt(t.lose, { rank: lang === 'en' ? ordinal(race.rank) : race.rank });
	// Once a retry is on screen it is the winner's request, so the visitor's own square stops glowing.
	const showYou = !!race && race.last === 'race';

	return (
		<div className="game">
			<dl className="game-score">
				<div>
					<dt>{t.requests}</dt>
					<dd key={`r${requests}`} className="pulse">
						{requests}
					</dd>
				</div>
				<div>
					<dt>{t.booked}</dt>
					<dd key={`b${booked}`} className="pulse">
						{booked}
					</dd>
				</div>
			</dl>

			{/* Mounted from the start, so screen readers announce the first result too. */}
			<p className="sr-only" aria-live="polite">
				{race ? `${shownWon ? '201 Created' : '409 Conflict'}. ${verdict}${replayed ? ` ${tally} ${t.lesson}` : ''}` : ''}
			</p>

			<div className="game-client dark">
				<div className="game-req">
					<div>
						<span className="verb">POST</span> /api/reservas
					</div>
					<div className="muted-mono">
						Idempotency-Key: <span>{shownKey}</span>
					</div>
					<pre tabIndex={0} role="region" aria-label={t.reqLabel}>
						{JSON.stringify(requestBody(slot), null, 2)}
					</pre>
					<p className="game-note">{fmt(t.utcNote, { utc: `${slot.inicio.slice(11, 16)}Z`, time: pista.franja })}</p>
					{!race && <p className="game-note">{t.keyHint}</p>}
				</div>

				{race && (
					<div className="game-res">
						<div className="arrival" role="img" aria-label={t.arrival} key={race.id}>
							{Array.from({ length: LANES }, (_, i) => {
								const n = i + 1;
								const cls = [n === 1 && 'first', showYou && n === race.rank && 'you'].filter(Boolean).join(' ');
								return <i key={n} className={cls} style={{ animationDelay: `${i * 12}ms` }} />;
							})}
						</div>
						<div className="arrival-key" aria-hidden="true">
							<span>
								<i className="first" /> {t.winner}
							</span>
							{showYou && (
								<span>
									<i className="you" /> {t.you}
								</span>
							)}
						</div>
						<div className="pop-in" key={`${race.id}-${race.step}`}>
							<div className="game-status">
								<span className={shownWon ? 'code-ok' : 'code-warn'}>{shownWon ? '201 Created' : '409 Conflict'}</span>
								{replayed && <span className="store">{t.fromStore}</span>}
							</div>
							<p className="game-verdict">{verdict}</p>
							<pre tabIndex={0} role="region" aria-label={t.resLabel}>
								{JSON.stringify(shownWon ? created(slot) : occupied, null, 2)}
							</pre>
							{!shownWon && t.esNote && <p className="es-note">{t.esNote}</p>}
							{replayed && (
									<div className="lesson">
										<p className="tally">
											<span>
												{t.requests}: {requests}
											</span>{' '}
											·{' '}
											<span>
												{t.booked}: {booked}
											</span>
										</p>
										<p>{t.lesson}</p>
									</div>
								)}
						</div>
					</div>
				)}

				<div className="game-actions" ref={actions}>
					{!race ? (
						<>
							<p className="game-step">{fmt(t.empty, { court: pista.nombre, time: pista.franja })}</p>
							<button type="button" className="btn btn-light" onClick={send}>
								{t.sendNew}
							</button>
						</>
					) : race.last === 'race' ? (
						<>
							<p className="game-step">{race.won ? t.step2Win : t.step2Lose}</p>
							<button type="button" className="btn btn-light" onClick={() => retry('same')}>
								{t.sendSame}
							</button>
							<button type="button" className="btn btn-light" onClick={() => retry('new')}>
								{t.retryNew}
							</button>
						</>
					) : newKey ? (
						<>
							<p className="game-step">{t.afterNew}</p>
							<button type="button" className="btn btn-light" onClick={() => retry('same')}>
								{t.sendSame}
							</button>
						</>
					) : (
						<>
							<a className="btn btn-light" href={`mailto:${LINKS.email}`}>
								{dict(lang).common.writeMe}
							</a>
							{!race.newTried && (
								<button type="button" className="btn btn-ghost" onClick={() => retry('new')}>
									{t.tryNew}
								</button>
							)}
							<button type="button" className="btn btn-ghost" onClick={reset}>
								{t.reset}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
