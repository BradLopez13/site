import { useState } from 'react';
import { created, occupied, pista, requestBody } from '../../data/reservas';
import { dict, fmt, type Lang } from '../../i18n';

type Result = { rank: number; won: boolean; replay: boolean };

// A simulation in the browser with the real request and response shapes of reservas.
// It never calls the live API: fifty fake bookings would land in the demo database.
export default function ApiGame({ lang }: { lang: Lang }) {
	const t = dict(lang).game;
	const [key, setKey] = useState('3f2c9a1e-8b47-4d2a-9c61-0e5b7d4a2f18');
	const [tries, setTries] = useState(0);
	const [wins, setWins] = useState(0);
	const [last, setLast] = useState<Result | null>(null);

	const sendNew = () => {
		const rank = 1 + Math.floor(Math.random() * 50);
		setKey(crypto.randomUUID());
		setTries((n) => n + 1);
		if (rank === 1) setWins((n) => n + 1);
		setLast({ rank, won: rank === 1, replay: false });
	};
	const sendSame = () => {
		if (!last) return;
		setTries((n) => n + 1);
		setLast({ ...last, replay: true });
	};

	const verdict = !last ? '' : last.replay ? t.replay : last.won ? t.win : fmt(t.lose, { rank: last.rank });

	return (
		<div className="game">
			<dl className="game-score">
				<div>
					<dt>{t.attempts}</dt>
					<dd key={`t${tries}`} className="pulse">
						{tries}
					</dd>
				</div>
				<div>
					<dt>{t.won}</dt>
					<dd key={`w${wins}`} className="pulse">
						{wins}
					</dd>
				</div>
			</dl>
			<div className="game-client">
				<div className="game-req">
					<div>
						<span className="verb">POST</span> /api/reservas
					</div>
					<div className="muted-mono">
						Idempotency-Key: <span>{key}</span>
					</div>
					<pre>{JSON.stringify(requestBody, null, 2)}</pre>
					<div className="game-actions">
						<button type="button" className="btn btn-light" onClick={sendNew}>
							{t.sendNew}
						</button>
						<button type="button" className="btn btn-ghost" onClick={sendSame} disabled={!last}>
							{t.sendSame}
						</button>
					</div>
				</div>
				<div className="game-res" aria-live="polite">
					{last ? (
						<div key={tries} className="pop-in">
							<div className="game-status">
								<span className={last.won ? 'code-ok' : 'code-warn'}>{last.won ? '201 Created' : '409 Conflict'}</span>
								<span>{verdict}</span>
							</div>
							<pre>{JSON.stringify(last.won ? created : occupied, null, 2)}</pre>
						</div>
					) : (
						<p className="game-empty">{fmt(t.empty, { court: pista.nombre, time: pista.franja })}</p>
					)}
				</div>
			</div>
		</div>
	);
}
