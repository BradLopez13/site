// The four-part series on reservas. Titles live in src/i18n/*.json under writing.p1 to writing.p4.
// A part shows as "planned" until its article exists in that language.
export const series = [
	{ part: 1, slug: '50-requests-one-winner' },
	{ part: 2, slug: 'opaque-session-cookies' },
	{ part: 3, slug: 'idempotent-booking-retries' },
	{ part: 4, slug: 'rate-limiting-behind-a-proxy' },
] as { part: number; slug?: string }[];
