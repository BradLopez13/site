// Everything Brad has written, in reading order. `from` says where he ran into it: Reservas for now,
// his team, and whatever comes next. Titles and summaries live in src/i18n/*.json under writing.<key>.
export type Source = 'reservas' | 'team';

export const articles: { slug: string; key: 'p1' | 'p2' | 'p3' | 'p4' | 'p5'; from: Source }[] = [
	{ slug: '50-requests-one-winner', key: 'p1', from: 'reservas' },
	{ slug: 'opaque-session-cookies', key: 'p2', from: 'reservas' },
	{ slug: 'idempotent-booking-retries', key: 'p3', from: 'reservas' },
	{ slug: 'rate-limiting-behind-a-proxy', key: 'p4', from: 'reservas' },
	{ slug: 'lint-rules-for-a-growing-team', key: 'p5', from: 'team' },
];
