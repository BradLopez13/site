import { useEffect, useRef, useState } from 'react';
import { created, occupied, pista, requestBody } from '../../data/reservas';
import { dict, fmt, type Lang } from '../../i18n';

type Race = { id: number; rank: number; won: boolean; key: string; replays: number };

const LANES = 50;

// A simulation in the browser with the real request and response shapes of reservas.
// It never calls the live API: fifty fake bookings would land in the demo database.
// Losing the race is the normal outcome; the point is the second step, resending the same
// request and getting the stored answer back instead of a second booking.
export default function ApiGame({ lang }: { lang: Lang }) {
	const t = dict(lang).game;
	const [race, setRace] = useState<Race | null>(null);
	const [requests, setRequests] = useState(0);
	const [booked, setBooked] = useState(0);
	const result = useRef<HTMLDivElement>(null);

	// On a phone the verdict would land below the fold; bring it into view after each send.
	useEffect(() => {
		if (race) result.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}, [race?.id, race?.replays]);

	const send = () => {
		const rank = 1 + Math.floor(Math.random() * LANES);
		const won = rank === 1;
		setRace({ id: (race?.id ?? 0) + 1, rank, won, key: crypto.randomUUID(), replays: 0 });
		setRequests((n) => n + 1);
		if (won) setBooked((n) => n + 1);
	};
	// A retry with the same key never creates a second booking, so it never touches `booked`.
	const resend = () => {
		if (!race) return;
		setRace({ ...race, replays: race.replays + 1 });
		setRequests((n) => n + 1);
	};
	const reset = () => {
		setRace(null);
		setRequests(0);
		setBooked(0);
	};

	const replayed = !!race && race.replays > 0;
	const verdict = !race
		? ''
		: replayed
			? race.won
				? t.replayWin
				: t.replayLose
			: race.won
				? t.win
				: fmt(t.lose, { rank: race.rank });

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

			<div className="game-client">
				<div className="game-req">
					<div>
						<span className="verb">POST</span> /api/reservas
					</div>
					<div className="muted-mono">
						Idempotency-Key: <span>{race?.key ?? '—'}</span>
					</div>
					<pre>{JSON.stringify(requestBody, null, 2)}</pre>
				</div>

				{race && (
					<div className="game-res" aria-live="polite">
						<div className="arrival" role="img" aria-label={t.arrival} key={race.id}>
							{Array.from({ length: LANES }, (_, i) => {
								const n = i + 1;
								const cls = n === race.rank ? 'you' : n === 1 ? 'first' : '';
								return <i key={n} className={cls} style={{ animationDelay: `${i * 12}ms` }} />;
							})}
						</div>
						<div className="arrival-key" aria-hidden="true">
							<span>
								<i className="first" /> {t.winner}
							</span>
							<span>
								<i className="you" /> {t.you}
							</span>
						</div>
						<div className="pop-in" ref={result} key={`${race.id}-${race.replays}`}>
							<div className="game-status">
								<span className={race.won ? 'code-ok' : 'code-warn'}>{race.won ? '201 Created' : '409 Conflict'}</span>
								{replayed && <span className="store">{t.fromStore}</span>}
							</div>
							<p className="game-verdict">{verdict}</p>
							<pre>{JSON.stringify(race.won ? created : occupied, null, 2)}</pre>
							{replayed && <p className="lesson">{t.lesson}</p>}
						</div>
					</div>
				)}

				<div className="game-actions">
					{!race ? (
						<>
							<p className="game-step">{fmt(t.empty, { court: pista.nombre, time: pista.franja })}</p>
							<button type="button" className="btn btn-light" onClick={send}>
								{t.sendNew}
							</button>
						</>
					) : !replayed ? (
						<>
							<p className="game-step">{t.step2}</p>
							<button type="button" className="btn btn-light" onClick={resend}>
								{t.sendSame}
							</button>
						</>
					) : (
						<>
							<button type="button" className="btn btn-light" onClick={send}>
								{t.again}
							</button>
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
