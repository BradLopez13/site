import { useState } from 'react';

// Illustrative data and field names: the real model is private, the shape of the problem is not.
const examples = {
	ticket: {
		label: 'A ticket sale',
		source: { booking: 'EV-0000', item: 'Conference pass', paid: '121,00 €', paidAt: '02/10/2026 19:04', buyer: 'walk-in' },
		lines: [
			['Document', 'Simplified invoice'],
			['Taxable base', '100.00'],
			['VAT 21%', '21.00'],
			['Total', '121.00'],
		],
		target: { type: 'simplified', date: '2026-10-02', lines: [{ concept: 'Conference pass', base: 100.0, tax: 'IVA_21' }] },
	},
	fee: {
		label: 'A management fee',
		source: { booking: 'EV-0001', item: 'Handling fee', paid: '12,10 €', paidAt: '02/10/2026 19:04', buyer: 'walk-in' },
		lines: [
			['Document', 'Management expense'],
			['Taxable base', '10.00'],
			['VAT 21%', '2.10'],
			['Total', '12.10'],
		],
		target: { type: 'expense', date: '2026-10-02', lines: [{ concept: 'Handling fee', base: 10.0, tax: 'IVA_21' }] },
	},
};
type Id = keyof typeof examples;

export default function ErpFlow() {
	const [id, setId] = useState<Id>('ticket');
	const ex = examples[id];
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.75rem' }}>
			<div className="seg" role="tablist" aria-label="Example" style={{ alignSelf: 'flex-start' }}>
				{(Object.keys(examples) as Id[]).map((k) => (
					<button key={k} type="button" role="tab" aria-selected={k === id} onClick={() => setId(k)}>
						{examples[k].label}
					</button>
				))}
			</div>
			<div className="erp" key={id}>
				<figure className="code pop-in">
					<figcaption>From the events platform</figcaption>
					<pre>{JSON.stringify(ex.source, null, 2)}</pre>
				</figure>
				<span className="flow" aria-hidden="true" />
				<figure className="erp-mid pop-in">
					<figcaption>Normalised, in accounting terms</figcaption>
					<dl>
						{ex.lines.map(([k, v]) => (
							<div key={k}>
								<dt>{k}</dt>
								<dd>{v}</dd>
							</div>
						))}
					</dl>
				</figure>
				<span className="flow" aria-hidden="true" />
				<figure className="code pop-in erp-out">
					<figcaption>To the invoicing ERP</figcaption>
					<pre>{JSON.stringify(ex.target, null, 2)}</pre>
				</figure>
			</div>
		</div>
	);
}
