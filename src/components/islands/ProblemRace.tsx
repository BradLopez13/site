import { useState } from 'react';

// Two requests read the same free slot. Without the constraint both insert; with EXCLUDE the second gets 23P01.
export default function ProblemRace() {
	const [fixed, setFixed] = useState(false);
	return (
		<div className="problem">
			<button type="button" aria-pressed={fixed} className={`btn ${fixed ? 'btn-ok' : 'btn-primary'}`} onClick={() => setFixed(!fixed)}>
				{fixed ? 'EXCLUDE is on' : 'Turn on EXCLUDE'}
			</button>
			<div className="problem-grid card" key={String(fixed)}>
				<strong>Request A</strong>
				<span className="step" style={{ animationDelay: '0s' }}>SELECT: free</span>
				<span className="step ok" style={{ animationDelay: '1s' }}>INSERT: 201</span>
				<span />
				<strong>Request B</strong>
				<span className="step" style={{ animationDelay: '.5s' }}>SELECT: free</span>
				<span />
				<span className={`step ${fixed ? 'warn' : 'bad'}`} style={{ animationDelay: '1.5s' }}>
					{fixed ? 'INSERT: 409, 23P01' : 'INSERT: 201'}
				</span>
				<span className="note problem-time">Time runs left to right</span>
			</div>
			<p className={`problem-verdict ${fixed ? 'is-ok' : 'is-bad'}`} aria-live="polite">
				{fixed ? 'One booking. The database said no to B.' : 'Sold twice.'}
			</p>
		</div>
	);
}
