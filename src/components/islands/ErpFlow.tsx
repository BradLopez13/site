import { useState } from 'react';
import { dict, type Lang } from '../../i18n';

// Illustrative data and field names: the real model is private, the shape of the problem is not.
// The JSON on both ends stays as it is in either language, because it is data, not prose.
const examples = {
	ticket: {
		source: { booking: 'EV-0000', item: 'Conference pass', paid: '121,00 €', paidAt: '02/10/2026 19:04', buyer: 'walk-in' },
		values: ['100.00', '21.00', '121.00'],
		target: { type: 'simplified', date: '2026-10-02', lines: [{ concept: 'Conference pass', base: 100.0, tax: 'IVA_21' }] },
	},
	fee: {
		source: { booking: 'EV-0001', item: 'Handling fee', paid: '12,10 €', paidAt: '02/10/2026 19:04', buyer: 'walk-in' },
		values: ['10.00', '2.10', '12.10'],
		target: { type: 'expense', date: '2026-10-02', lines: [{ concept: 'Handling fee', base: 10.0, tax: 'IVA_21' }] },
	},
};
type Id = keyof typeof examples;

export default function ErpFlow({ lang }: { lang: Lang }) {
	const t = dict(lang).erp;
	const [id, setId] = useState<Id>('ticket');
	const ex = examples[id];
	const doc = id === 'ticket' ? t.simplified : t.expense;
	const rows = t.rows.map((label, k) => [label, k === 0 ? doc : ex.values[k - 1]]);
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.75rem' }}>
			<div className="seg" role="tablist" aria-label={t.label} style={{ alignSelf: 'flex-start' }}>
				{(Object.keys(examples) as Id[]).map((k) => (
					<button key={k} type="button" role="tab" aria-selected={k === id} onClick={() => setId(k)}>
						{t[k]}
					</button>
				))}
			</div>
			<div className="erp" key={id}>
				<figure className="code pop-in">
					<figcaption>{t.from}</figcaption>
					<pre>{JSON.stringify(ex.source, null, 2)}</pre>
				</figure>
				<span className="flow" aria-hidden="true" />
				<figure className="erp-mid pop-in">
					<figcaption>{t.normalised}</figcaption>
					<dl>
						{rows.map(([k, v]) => (
							<div key={k}>
								<dt>{k}</dt>
								<dd>{v}</dd>
							</div>
						))}
					</dl>
				</figure>
				<span className="flow" aria-hidden="true" />
				<figure className="code pop-in erp-out">
					<figcaption>{t.to}</figcaption>
					<pre>{JSON.stringify(ex.target, null, 2)}</pre>
				</figure>
			</div>
		</div>
	);
}
