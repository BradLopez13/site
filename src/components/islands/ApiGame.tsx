import { useState } from 'react';
import { created, occupied, pista, requestBody } from '../../data/reservas';

type Result = { rank: number; won: boolean; replay: boolean };

const newKey = () => crypto.randomUUID();

// A simulation in the browser with the real request and response shapes of reservas.
// It never calls the live API: fifty fake bookings would land in the demo database.
export default function ApiGame() {
	const [key, setKey] = useState('3f2c9a1e-8b47-4d2a-9c61-0e5b7d4a2f18');
	const [tries, setTries] = useState(0);
	const [wins, setWins] = useState(0);
	const [last, setLast] = useState<Result | null>(null);

	const sendNew = () => {
		const rank = 1 + Math.floor(Math.random() * 50);
		setKey(newKey());
		setTries((t) => t + 1);
		if (rank === 1) setWins((w) => w + 1);
		setLast({ rank, won: rank === 1, replay: false });
	};
	const sendSame = () => {
		if (!last) return;
		setTries((t) => t + 1);
		setLast({ ...last, replay: true });
	};

	const status = last?.won ? '201 Created' : '409 Conflict';
	const verdict = !last
		? ''
		: last.replay
			? 'Same key, same answer. Nothing new was tried.'
			: last.won
				? 'You were first of 50. The court is yours.'
				: `You arrived ${last.rank} of 50. Someone got there first.`;

	return (
		<div className="game">
			<dl className="game-score">
				<div>
					<dt>Attempts</dt>
					<dd key={`t${tries}`} className="pulse">
						{tries}
					</dd>
				</div>
				<div>
					<dt>Courts won</dt>
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
							Send with a new key
						</button>
						<button type="button" className="btn btn-ghost" onClick={sendSame} disabled={!last}>
							Resend with the same key
						</button>
					</div>
				</div>
				<div className="game-res" aria-live="polite">
					{last ? (
						<div key={tries} className="pop-in">
							<div className="game-status">
								<span className={last.won ? 'code-ok' : 'code-warn'}>{status}</span>
								<span>{verdict}</span>
							</div>
							<pre>{JSON.stringify(last.won ? created : occupied, null, 2)}</pre>
						</div>
					) : (
						<p className="game-empty">
							No response yet. Send the booking to join the race for {pista.nombre} at {pista.franja}.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
